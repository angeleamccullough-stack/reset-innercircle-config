(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let soundOn = sessionStorage.getItem('resetSound') !== 'off';
  let audioCtx = null;

  const send = (eventType, metadata = {}) => {
    const body = JSON.stringify({ event_type: eventType, metadata });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/intelligence', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/intelligence', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  };

  const playTone = (kind = 'tap') => {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const map = {
        tap: [520, 0.035, 0.025],
        nav: [410, 0.028, 0.018],
        primary: [610, 0.055, 0.032]
      };
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
    if (tracked) send(tracked.dataset.event || 'reset_gateway_click', { destination: tracked.getAttribute('href') });
  });

  send('reset_gateway_view', {
    path: location.pathname,
    referrer_host: document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch { return null; } })() : null
  });

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

  const networkCss = document.createElement('link');
  networkCss.rel = 'stylesheet';
  networkCss.href = '/network.css';
  document.head.appendChild(networkCss);

  const networkScript = document.createElement('script');
  networkScript.src = '/network.js';
  networkScript.defer = true;
  document.body.appendChild(networkScript);
})();