(() => {
  const send = (eventType, metadata = {}) => {
    const body = JSON.stringify({ event_type: eventType, metadata });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/intelligence', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/intelligence', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  };

  send('reset_gateway_view', { path: location.pathname, referrer_host: document.referrer ? new URL(document.referrer).hostname : null });

  document.querySelectorAll('.track').forEach((link) => {
    link.addEventListener('click', () => send(link.dataset.event || 'reset_gateway_click', { destination: link.getAttribute('href') }));
  });
})();