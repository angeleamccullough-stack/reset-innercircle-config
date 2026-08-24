(() => {
  const facebookNetworkPrimary = 'https://www.facebook.com/groups/search/groups?q=Engagement&filters=eyJteV9ncm91cHM6MCI6IntcIm5hbWVcIjpcIm15X2dyb3Vwc1wiLFwiYXJnc1wiOlwiXCJ9In0%3D';
  const facebookNetworkSecondary = 'https://www.facebook.com/groups/search/groups?q=engagment&filters=eyJteV9ncm91cHM6MCI6IntcIm5hbWVcIjpcIm15X2dyb3Vwc1wiLFwiYXJnc1wiOlwiXCJ9In0%3D';
  const pinterestSurfaceUrl = 'https://www.pinterest.com/?tabId=1127166681679282275';
  const liveBridgeUrl = '/live.html';
  const partnerUrl = '/partner.html';
  const arenaUrl = '/arena.html';
  const discordInviteUrl = 'https://discord.gg/hE5TarQsut';
  const studioAnchor = '#studio';
  const supportAnchor = '#support';

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
  section.dataset.viewEvent = 'partner_network_view';
  section.setAttribute('aria-labelledby', 'network-title');
  section.innerHTML = `
    <div class="wrap">
      <div class="network-head">
        <div><p class="kicker">RESET PARTNER NETWORK · PILOT</p><h2 id="network-title">Many communities.<br><em>One place to activate together.</em></h2></div>
        <p>Reset Inner Circle connects independent communities and discovery surfaces into one shared creator ecosystem without absorbing their identity or private audience data.</p>
      </div>

      <div class="leader-promise">
        <span>COMMUNITY STANDARD</span>
        <div><b>YOU KEEP YOUR COMMUNITY</b><small>No ownership transfer. No audience scraping.</small></div>
        <div><b>YOU KEEP YOUR CREDIT</b><small>Approved partner communities can retain visible attribution.</small></div>
        <div><b>WE BUILD THE BRIDGE</b><small>Discovery, Arena access, events, production and public-safe analytics.</small></div>
      </div>

      <div class="network-map">
        <article class="network-node">
          <div class="node-label"><span>DISCOVERY LAYER</span><b>FACEBOOK + PINTEREST</b></div>
          <h3>External Discovery Surfaces</h3>
          <p>Facebook group cohorts and Pinterest now act as discovery lanes into the same Reset gateway. They stay separate at the platform level while Reset measures only privacy-safe referral and conversion signals downstream.</p>
          <div class="node-stat"><span><strong>3</strong><small>DISCOVERY SURFACES</small></span><span><strong>ONE</strong><small>RESET ECOSYSTEM</small></span></div>
          <div class="leader-actions">
            <a class="text-link track soundable" data-event="facebook_network_click" data-placement="partner_network_primary" href="${facebookNetworkPrimary}" target="_blank" rel="noopener">Open primary Facebook cohort <b>↗</b></a>
            <a class="text-link track soundable" data-event="facebook_network_click" data-placement="partner_network_secondary" href="${facebookNetworkSecondary}" target="_blank" rel="noopener">Open additional Facebook cohort <b>↗</b></a>
            <a class="text-link track soundable" data-event="pinterest_surface_click" data-placement="partner_network_pinterest" href="${pinterestSurfaceUrl}" target="_blank" rel="noopener">Open Pinterest discovery surface <b>↗</b></a>
          </div>
        </article>

        <article class="network-node center">
          <div class="node-label"><span>SHARED CONNECTION LAYER</span><b>RESET MAIN ARENA</b></div>
          <h3>One Arena. Many Origins.</h3>
          <p>Visitors arriving from Facebook, Pinterest or direct discovery can enter Reset through one public gateway. Once they opt into Discord, origin can remain attributed for analytics while the member experience stays shared rather than siloed.</p>
          <div class="node-stat"><span><strong>OPEN</strong><small>PUBLIC ROUTING</small></span><span><strong>SHARED</strong><small>MEMBER EXPERIENCE</small></span></div>
          <a class="button gold track soundable" data-event="arena_bridge_click" data-placement="partner_network" href="${arenaUrl}"><span>Enter Reset Main Arena</span><i>→</i></a>
        </article>

        <article class="network-node">
          <div class="node-label"><span>PUBLIC ENTRY</span><b>RESET INNER CIRCLE</b></div>
          <h3>Not inside Discord yet?</h3>
          <p>New visitors enter through the public invite first. Once inside, programming can route them to the Arena, Live Events, Studio and other appropriate rooms while the website stays public-safe.</p>
          <div class="node-stat"><span><strong>FREE</strong><small>COMMUNITY ENTRY</small></span><span><strong>SAFE</strong><small>BOUNDARY FIRST</small></span></div>
          <a class="text-link track soundable" data-event="network_discord_join_click" data-placement="partner_network" href="${discordInviteUrl}" target="_blank" rel="noopener">Enter Reset Inner Circle <b>↗</b></a>
        </article>
      </div>

      <div class="network-spine"><i></i><span>DISCOVER → ENTER → CONNECT → ATTEND → CREATE → MONETIZE → MEASURE → IMPROVE</span><i></i></div>

      <div class="leader-panel">
        <div class="leader-copy">
          <p class="kicker">FOR GROUP LEADERS & COMMUNITY PARTNERS</p>
          <h3>Bring your people to something worth joining.</h3>
          <p>Partner leaders can co-promote approved events, retain visible group attribution, participate in cross-community programming and request production support. Pinterest and other visual discovery surfaces can feed the same public routes without importing private audience data.</p>
          <div class="leader-actions">
            <a class="button gold track soundable" data-event="group_leader_interest" data-placement="leader_panel" href="${partnerUrl}"><span>Apply for Leader Partnership</span><i>→</i></a>
            <a class="button ghost track soundable" data-event="live_bridge_click" data-placement="leader_panel" href="${liveBridgeUrl}"><span>Preview Live Events Bridge</span><i>→</i></a>
          </div>
        </div>
        <div class="leader-rules">
          <span>PARTNER PRINCIPLES</span>
          <ul><li>Leader approval before public group promotion</li><li>No scraping, member-list export or private-post ingestion</li><li>Only approved public links and non-personal attribution are used</li><li>Clear attribution for participating communities</li><li>Shared campaigns must have a defined purpose and route</li><li>Automation optimizes routing and intelligence, not artificial engagement</li></ul>
        </div>
      </div>

      <div class="revenue-panel" data-view-event="network_revenue_view">
        <div class="revenue-intro"><p class="kicker">SUSTAIN THE NETWORK</p><h3>Community access can stay open while the infrastructure earns.</h3><p>Revenue is attached to real value around the community, not a paywall on Discord membership.</p></div>
        <div class="revenue-grid">
          <a class="revenue-card track soundable" data-event="studio_service_inquiry" data-placement="network_revenue" href="${studioAnchor}"><span>01</span><strong>Virtual Studio Services</strong><small>Remote production, interviews, creator sessions and performance capture.</small></a>
          <a class="revenue-card track soundable" data-event="event_sponsor_interest" data-placement="network_revenue" href="${partnerUrl}"><span>02</span><strong>Event Sponsorship</strong><small>Brand-supported or partner-supported programming with clear disclosure.</small></a>
          <a class="revenue-card track soundable" data-event="group_feature_interest" data-placement="network_revenue" href="${partnerUrl}"><span>03</span><strong>Partner Spotlights</strong><small>Approved promotional features for leaders, creators and community initiatives.</small></a>
          <a class="revenue-card track soundable" data-event="workshop_event_interest" data-placement="network_revenue" href="${partnerUrl}"><span>04</span><strong>Workshops & Produced Events</strong><small>Paid production or ticketed experiences sold outside Discord membership.</small></a>
          <a class="revenue-card track soundable" data-event="support_checkout_started" data-placement="network_revenue" href="${supportAnchor}"><span>05</span><strong>Voluntary Support</strong><small>Support the operating costs without purchasing community access.</small></a>
        </div>
      </div>

      <div class="network-note"><strong>Privacy boundary:</strong> this gateway measures public-safe routing and campaign attribution only. It does not scrape Facebook groups, Pinterest boards, read private Discord conversations, export member lists or move protected creator data between platforms.</div>

      <div class="network-registry">
        <div><span>DISCOVERY REGISTRY · APPROVAL REQUIRED</span><small>Approved referrals can use non-personal tags such as <code>/?source=pinterest&amp;partner=reset-pinterest&amp;campaign=creator-discovery</code> or <code>/arena.html?source=facebook&amp;partner=group-slug&amp;campaign=arena</code>.</small></div>
        <a class="button ghost track soundable" data-event="live_bridge_click" data-placement="network_registry" href="${liveBridgeUrl}"><span>Test Public Live Route</span><i>→</i></a>
      </div>
    </div>`;

  support.parentNode.insertBefore(section, support);

  const trackVisible = (element, eventType) => {
    if (!element || !window.resetTrack) return;
    if (!('IntersectionObserver' in window)) { window.resetTrack(eventType, { section: element.id || null }); return; }
    const observer = new IntersectionObserver((entries, obs) => {
      if (!entries[0]?.isIntersecting) return;
      window.resetTrack(eventType, { section: element.id || eventType });
      obs.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
  };

  trackVisible(section, 'partner_network_view');
  trackVisible(section.querySelector('.revenue-panel'), 'network_revenue_view');

  requestAnimationFrame(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) section.classList.add('in');
    else {
      const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0]?.isIntersecting) { section.classList.add('in'); obs.disconnect(); }
      }, { threshold: 0.08 });
      observer.observe(section);
    }
  });
})();