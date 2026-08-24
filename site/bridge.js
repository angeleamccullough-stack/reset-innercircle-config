(() => {
  const clean = (value) => String(value || '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0,80) || null;
  const params = new URLSearchParams(location.search);
  const attribution = {
    source: clean(params.get('source') || params.get('utm_source')),
    partner: clean(params.get('partner') || params.get('group')),
    campaign: clean(params.get('campaign') || params.get('utm_campaign'))
  };

  const send = (eventType, metadata = {}) => {
    const body = JSON.stringify({ event_type: eventType, metadata: { ...attribution, ...metadata } });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/intelligence', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/intelligence', { method:'POST', headers:{'content-type':'application/json'}, body, keepalive:true }).catch(()=>{});
  };

  const path = location.pathname;
  const viewEvent = path.includes('partner-thanks')
    ? 'partner_thanks_view'
    : path.includes('partner')
      ? 'partner_onboarding_view'
      : path.includes('arena')
        ? 'arena_gateway_view'
        : 'live_bridge_view';
  send(viewEvent, { path });

  let audioCtx = null;
  const soundEnabled = sessionStorage.getItem('resetSound') !== 'off';
  const tone = (primary = false) => {
    if (!soundEnabled) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(primary ? 610 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(primary ? 680 : 485, now + 0.04);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(primary ? 0.03 : 0.018, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.055);
    } catch {}
  };

  document.addEventListener('click', (event) => {
    const soundable = event.target.closest?.('.soundable, .button');
    if (soundable) tone(soundable.classList.contains('gold'));
    const tracked = event.target.closest?.('.track');
    if (tracked) send(tracked.dataset.event || 'bridge_click', { destination: tracked.getAttribute('href'), placement: tracked.dataset.placement || null });
  });

  const form = document.querySelector('form[name="reset-partner-interest"]');
  form?.addEventListener('submit', () => send('partner_application_submit', { placement:'partner_form' }));

  const progress = document.querySelector('.progress span');
  const update = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  update(); addEventListener('scroll', update, { passive:true });
})();