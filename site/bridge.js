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
  send(location.pathname.includes('partner') ? 'partner_onboarding_view' : 'live_bridge_view', { path: location.pathname });
  document.addEventListener('click', (event) => {
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