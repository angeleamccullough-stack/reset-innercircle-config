(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let soundOn = sessionStorage.getItem('resetSound') !== 'off';
  let audioCtx = null;

  const cleanParam = (value) => String(value || '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80) || null;
  const params = new URLSearchParams(location.search);
  const freshAttribution = {
    source: cleanParam(params.get('source') || params.get('utm_source')),
    partner: cleanParam(params.get('partner') || params.get('group')),
    campaign: cleanParam(params.get('campaign') || params.get('utm_campaign'))
  };
  if (freshAttribution.source || freshAttribution.partner || freshAttribution.campaign) {
    sessionStorage.setItem('resetAttribution', JSON.stringify(freshAttribution));
  }
  let attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem('resetAttribution') || '{}'); } catch { attribution = {}; }

  const send = (eventType, metadata = {}) => {
    const body = JSON.stringify({ event_type: eventType, metadata: { ...attribution, ...metadata } });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/intelligence', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/intelligence', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  };
  window.resetTrack = send;

  const playTone = (kind = 'tap') => {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const map = { tap: [520, 0.035, 0.025], nav: [410, 0.028, 0.018], primary: [610, 0.055, 0.032] };
      const [freq, duration, volume] = map[kind] || map.tap;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + duration);
      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(filter).connect(gain).connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch {}
  };

  const soundToggle = document.querySelector('.sound-toggle');
  const syncSoundToggle = () => {
    if (!soundToggle) return;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.setAttribute('aria-label', soundOn ? 'Turn interface sound off' : 'Turn interface sound on');
    soundToggle.innerHTML = `<span></span>${soundOn ? ' SOUND ON' : ' SOUND OFF'}`;
  };
  syncSoundToggle();

  soundToggle?.addEventListener('click', () => {
    soundOn = !soundOn;
    sessionStorage.setItem('resetSound', soundOn ? 'on' : 'off');
    syncSoundToggle();
    if (soundOn) playTone('primary');
  });

  document.addEventListener('click', (event) => {
    const soundable = event.target.closest?.('.soundable');
    if (soundable) playTone(soundable.classList.contains('gold') ? 'primary' : soundable.closest('nav') ? 'nav' : 'tap');

    const tracked = event.target.closest?.('.track');
    if (tracked) send(tracked.dataset.event || 'reset_gateway_click', {
      destination: tracked.getAttribute('href'),
      placement: tracked.dataset.placement || null
    });
  });

  send('reset_gateway_view', {
    path: location.pathname,
    referrer_host: document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch { return null; } })() : null
  });

  const createSupportColumn = Array.from(document.querySelectorAll('.directory-column')).find((column) => column.querySelector('span')?.textContent?.trim() === 'CREATE + SUPPORT');
  if (createSupportColumn && !createSupportColumn.querySelector('[data-event="footer_rs_vault_click"]')) {
    const vault = document.createElement('a');
    vault.className = 'track soundable';
    vault.dataset.event = 'footer_rs_vault_click';
    vault.dataset.placement = 'ecosystem_footer';
    vault.href = 'https://rsvault.rmsglobalpublishing.com/';
    vault.target = '_blank';
    vault.rel = 'noopener';
    vault.innerHTML = 'Creator Gear · RS Vault <b>↗</b>';
    createSupportColumn.appendChild(vault);
  }

  const progress = document.querySelector('.progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
    if (progress) progress.style.width = `${pct}%`;
  };
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => observer.observe(el));
  }

  const seen = new WeakSet();
  if ('IntersectionObserver' in window) {
    const signalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        if (entry.target.dataset.viewEvent) send(entry.target.dataset.viewEvent, { section: entry.target.id || null });
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-view-event]').forEach((el) => signalObserver.observe(el));
  }

  if (!prefersReduced && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  const loadStyle = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  const loadScript = (src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  };

  loadStyle('/network.css');
  loadStyle('/brand-upgrade.css');
  loadScript('/network.js');
  loadScript('/arena-upgrade.js');
  loadScript('/brand-upgrade.js');
})();