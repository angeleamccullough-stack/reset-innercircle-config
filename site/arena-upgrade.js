(() => {
  const applyArenaModel = () => {
    const network = document.querySelector('#network');
    if (!network || network.dataset.arenaApplied === 'true') return false;

    const cards = network.querySelectorAll('.network-node');
    const center = cards[1];
    if (center) {
      const label = center.querySelector('.node-label');
      const title = center.querySelector('h3');
      const copy = center.querySelector('p');
      const stats = center.querySelector('.node-stat');
      const cta = center.querySelector('.button');
      if (label) label.innerHTML = '<span>SHARED COMMUNITY LAYER</span><b>MAIN ARENA</b>';
      if (title) title.textContent = 'Reset Main Arena';
      if (copy) copy.textContent = 'Members from participating communities converge into one shared Reset social layer after opting into Discord. Their source group remains attribution only; members are not siloed once inside.';
      if (stats) stats.innerHTML = '<span><strong>ONE</strong><small>SHARED ARENA</small></span><span><strong>OPEN</strong><small>AFTER ONBOARDING</small></span>';
      if (cta) {
        cta.href = '/arena.html';
        cta.dataset.event = 'arena_bridge_click';
        cta.dataset.placement = 'partner_network';
        const span = cta.querySelector('span');
        if (span) span.textContent = 'Open Reset Main Arena';
      }
    }

    const headCopy = network.querySelector('.network-head p');
    if (headCopy) headCopy.textContent = 'Independent communities keep their identity while Reset gives members one shared Arena for connection, collaboration, events and creator opportunity. Group origin can be credited without becoming a wall between members.';

    const spine = network.querySelector('.network-spine span');
    if (spine) spine.textContent = 'DISCOVER → JOIN → ONBOARD → ENTER ARENA → CONNECT → CREATE → MEASURE → IMPROVE';

    const registry = network.querySelector('.network-registry');
    const registryButton = registry?.querySelector('.button');
    if (registryButton) {
      registryButton.href = '/arena.html';
      registryButton.dataset.event = 'arena_bridge_click';
      registryButton.dataset.placement = 'network_registry';
      const span = registryButton.querySelector('span');
      if (span) span.textContent = 'Test Main Arena Route';
    }
    const registryCopy = registry?.querySelector('small');
    if (registryCopy) registryCopy.innerHTML = 'Approved partner links can use non-personal attribution such as <code>/arena.html?source=facebook&amp;partner=group-slug&amp;campaign=community</code>. The source tag follows the session for analytics, but does not partition members inside Reset.';

    network.dataset.arenaApplied = 'true';
    window.resetTrack?.('arena_model_rendered', { placement: 'gateway_network' });
    return true;
  };

  if (applyArenaModel()) return;
  const observer = new MutationObserver(() => {
    if (applyArenaModel()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 10000);
})();