(() => {
  const facebookNetworkUrl = 'https://www.facebook.com/groups/search/groups?q=Engagement&filters=eyJteV9ncm91cHM6MCI6IntcIm5hbWVcIjpcIm15X2dyb3Vwc1wiLFwiYXJnc1wiOlwiXCJ9In0%3D';
  const discordHubUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370092';
  const discordInviteUrl = 'https://discord.gg/hE5TarQsut';

  const nav = document.querySelector('.nav nav');
  if (nav && !nav.querySelector('[href="#network"]')) {
    const link = document.createElement('a');
    link.href = '#network';
    link.className = 'soundable';
    link.textContent = 'Network';
    nav.insertBefore(link, nav.firstChild);
  }

  const support = document.querySelector('#support');
  if (!support || document.querySelector('#network')) return;

  const section = document.createElement('section');
  section.id = 'network';
  section.className = 'network reveal';
  section.setAttribute('aria-labelledby', 'network-title');
  section.innerHTML = `
    <div class="wrap">
      <div class="network-head">
        <div>
          <p class="kicker">GLOBAL ENGAGEMENT NETWORK</p>
          <h2 id="network-title">Many communities.<br><em>One Inner Circle hub.</em></h2>
        </div>
        <p>Reset Inner Circle connects participating Facebook communities, the live Discord engagement hub, creator programming and the virtual studio without erasing the identity of any community that joins the network.</p>
      </div>

      <div class="network-map">
        <article class="network-node">
          <div class="node-label"><span>DISCOVERY LAYER</span><b>FACEBOOK</b></div>
          <h3>Facebook Group Network</h3>
          <p>Participating engagement communities remain visible in their own spaces while Reset gives members a shared route into deeper collaboration, events and creator resources.</p>
          <div class="node-stat"><span><strong>20+</strong><small>COMMUNITY CONNECTIONS</small></span><span><strong>OPEN</strong><small>DISCOVERY</small></span></div>
          <a class="text-link track soundable" data-event="facebook_network_click" href="${facebookNetworkUrl}" target="_blank" rel="noopener">Explore the Facebook network <b>↗</b></a>
        </article>

        <article class="network-node center">
          <div class="node-label"><span>CENTRAL CONNECTION LAYER</span><b>RESET INNER CIRCLE</b></div>
          <h3>The Engagement Hub</h3>
          <p>This is the shared Inner Circle room for cross-community connection, introductions, collaboration signals and coordinated engagement. Facebook can discover. Discord can deepen the relationship.</p>
          <div class="node-stat"><span><strong>LIVE</strong><small>DISCORD HUB</small></span><span><strong>GLOBAL</strong><small>CREATOR ROUTING</small></span></div>
          <a class="button gold track soundable" data-event="discord_engagement_hub_click" href="${discordHubUrl}" target="_blank" rel="noopener"><span>Open Engagement Hub</span><i>↗</i></a>
        </article>

        <article class="network-node">
          <div class="node-label"><span>ENTRY LAYER</span><b>COMMUNITY</b></div>
          <h3>New to the Inner Circle?</h3>
          <p>People who are not yet inside the Discord server can enter through the public gateway first, then move into the appropriate rooms without exposing private server data on the website.</p>
          <div class="node-stat"><span><strong>FREE</strong><small>COMMUNITY ENTRY</small></span><span><strong>SAFE</strong><small>PUBLIC ROUTING</small></span></div>
          <a class="text-link track soundable" data-event="network_discord_join_click" href="${discordInviteUrl}" target="_blank" rel="noopener">Enter Reset Inner Circle <b>↗</b></a>
        </article>
      </div>

      <div class="network-spine"><i></i><span>DISCOVER → CONNECT → PARTICIPATE → COLLABORATE → CREATE → MEASURE</span><i></i></div>

      <div class="network-note"><strong>Privacy boundary:</strong> the gateway measures public-safe routing signals only. It does not scrape Facebook groups, read private Discord conversations, export member lists or move protected creator data between platforms.</div>

      <div class="network-registry">
        <div><span>PARTICIPATING GROUP DIRECTORY · REGISTRY READY</span><small>Specific Facebook group names and approved public links can be promoted here as they are verified, without changing the gateway architecture.</small></div>
        <a class="button ghost track soundable" data-event="facebook_network_directory_click" href="${facebookNetworkUrl}" target="_blank" rel="noopener"><span>View Group Network</span><i>↗</i></a>
      </div>
    </div>`;

  support.parentNode.insertBefore(section, support);

  requestAnimationFrame(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) section.classList.add('in');
    else {
      const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0]?.isIntersecting) {
          section.classList.add('in');
          obs.disconnect();
        }
      }, { threshold: 0.08 });
      observer.observe(section);
    }
  });
})();