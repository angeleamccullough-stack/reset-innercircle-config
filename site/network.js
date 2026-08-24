(() => {
  const facebookNetworkUrl = 'https://www.facebook.com/groups/search/groups?q=Engagement&filters=eyJteV9ncm91cHM6MCI6IntcIm5hbWVcIjpcIm15X2dyb3Vwc1wiLFwiYXJnc1wiOlwiXCJ9In0%3D';
  const discordLiveEventsUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370096';
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
        <div>
          <p class="kicker">RESET PARTNER NETWORK · PILOT</p>
          <h2 id="network-title">Many communities.<br><em>One place to activate together.</em></h2>
        </div>
        <p>Reset Inner Circle gives independent group leaders a shared live-events bridge without absorbing their brands, member lists or communities. Leaders keep their identity. Reset supplies the connection layer, production capacity and measurable event infrastructure.</p>
      </div>

      <div class="leader-promise">
        <span>GROUP LEADER STANDARD</span>
        <div><b>YOU KEEP YOUR COMMUNITY</b><small>No ownership transfer. No audience scraping.</small></div>
        <div><b>YOU KEEP YOUR CREDIT</b><small>Approved partner groups can be visibly attributed.</small></div>
        <div><b>WE BUILD THE BRIDGE</b><small>Events, production, collaboration and public-safe analytics.</small></div>
      </div>

      <div class="network-map">
        <article class="network-node">
          <div class="node-label"><span>DISCOVERY LAYER</span><b>FACEBOOK</b></div>
          <h3>Independent Group Communities</h3>
          <p>Creator and engagement groups keep operating where their members already gather. Reset provides an optional shared route into coordinated live experiences and deeper creator collaboration.</p>
          <div class="node-stat"><span><strong>20+</strong><small>GROUP OPPORTUNITY</small></span><span><strong>OPT-IN</strong><small>LEADER CONTROL</small></span></div>
          <a class="text-link track soundable" data-event="facebook_network_click" data-placement="partner_network" href="${facebookNetworkUrl}" target="_blank" rel="noopener">Explore the Facebook group landscape <b>↗</b></a>
        </article>

        <article class="network-node center">
          <div class="node-label"><span>CONTROLLED TEST LANE</span><b>LIVE EVENTS</b></div>
          <h3>Reset Live Events Hub</h3>
          <p>We are testing the external-to-internal bridge here first. Approved Facebook communities can send members toward shared live programming without opening unrelated Inner Circle rooms or exposing private server activity.</p>
          <div class="node-stat"><span><strong>LIVE</strong><small>EVENT ROUTING</small></span><span><strong>PILOT</strong><small>MEASURE FIRST</small></span></div>
          <a class="button gold track soundable" data-event="discord_live_events_click" data-placement="partner_network" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>Open Live Events Hub</span><i>↗</i></a>
        </article>

        <article class="network-node">
          <div class="node-label"><span>PUBLIC ENTRY</span><b>RESET INNER CIRCLE</b></div>
          <h3>Not inside Discord yet?</h3>
          <p>New visitors enter through the public invite first. Once inside, event programming can route them to the appropriate live room while the website stays public-safe.</p>
          <div class="node-stat"><span><strong>FREE</strong><small>COMMUNITY ENTRY</small></span><span><strong>SAFE</strong><small>BOUNDARY FIRST</small></span></div>
          <a class="text-link track soundable" data-event="network_discord_join_click" data-placement="partner_network" href="${discordInviteUrl}" target="_blank" rel="noopener">Enter Reset Inner Circle <b>↗</b></a>
        </article>
      </div>

      <div class="network-spine"><i></i><span>DISCOVER → INVITE → ATTEND → CONNECT → CREATE → MEASURE → IMPROVE</span><i></i></div>

      <div class="leader-panel">
        <div class="leader-copy">
          <p class="kicker">FOR GROUP LEADERS</p>
          <h3>Bring your people to something worth attending.</h3>
          <p>Partner leaders can co-promote approved events, retain visible group attribution, participate in cross-community programming and request production support. We prove the Live Events bridge first, then expand only where the data and member experience justify it.</p>
          <div class="leader-actions">
            <a class="button gold track soundable" data-event="group_leader_interest" data-placement="leader_panel" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>Explore Leader Partnership</span><i>↗</i></a>
            <a class="button ghost track soundable" data-event="facebook_network_directory_click" data-placement="leader_panel" href="${facebookNetworkUrl}" target="_blank" rel="noopener"><span>View Group Network</span><i>↗</i></a>
          </div>
        </div>
        <div class="leader-rules">
          <span>PARTNER PRINCIPLES</span>
          <ul>
            <li>Leader approval before public group promotion</li>
            <li>No scraping, member-list export or private-post ingestion</li>
            <li>Clear attribution for participating communities</li>
            <li>Shared events must have a defined host, purpose and route</li>
            <li>Expansion happens only after the pilot is measured</li>
          </ul>
        </div>
      </div>

      <div class="revenue-panel" data-view-event="network_revenue_view">
        <div class="revenue-intro"><p class="kicker">SUSTAIN THE NETWORK</p><h3>Community access can stay open while the infrastructure earns.</h3><p>Revenue is attached to real value around the community, not a paywall on Discord membership.</p></div>
        <div class="revenue-grid">
          <a class="revenue-card track soundable" data-event="studio_service_inquiry" data-placement="network_revenue" href="${studioAnchor}"><span>01</span><strong>Virtual Studio Services</strong><small>Remote production, interviews, creator sessions and performance capture.</small></a>
          <a class="revenue-card track soundable" data-event="event_sponsor_interest" data-placement="network_revenue" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>02</span><strong>Event Sponsorship</strong><small>Brand-supported or partner-supported programming with clear disclosure.</small></a>
          <a class="revenue-card track soundable" data-event="group_feature_interest" data-placement="network_revenue" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>03</span><strong>Partner Spotlights</strong><small>Approved promotional features for leaders, creators and community initiatives.</small></a>
          <a class="revenue-card track soundable" data-event="workshop_event_interest" data-placement="network_revenue" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>04</span><strong>Workshops & Produced Events</strong><small>Paid production or ticketed experiences sold outside Discord membership.</small></a>
          <a class="revenue-card track soundable" data-event="support_checkout_started" data-placement="network_revenue" href="${supportAnchor}"><span>05</span><strong>Voluntary Support</strong><small>Support the operating costs without purchasing community access.</small></a>
        </div>
      </div>

      <div class="network-note"><strong>Privacy boundary:</strong> this gateway measures public-safe routing and campaign attribution only. It does not scrape Facebook groups, read private Discord conversations, export member lists or move protected creator data between platforms.</div>

      <div class="network-registry">
        <div><span>PARTNER DIRECTORY · APPROVAL REQUIRED</span><small>Specific Facebook group names, logos and public links will be added only after the relevant leader approves participation. Referral URLs can use non-personal tags such as <code>?source=facebook&amp;partner=group-slug&amp;campaign=live-event</code> for privacy-safe attribution.</small></div>
        <a class="button ghost track soundable" data-event="discord_live_events_click" data-placement="network_registry" href="${discordLiveEventsUrl}" target="_blank" rel="noopener"><span>Test Live Events Route</span><i>↗</i></a>
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