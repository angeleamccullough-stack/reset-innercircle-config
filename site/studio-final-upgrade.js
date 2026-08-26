(() => {
  const studio = document.querySelector('#studio');
  const floor = studio?.querySelector('.studio-luxury-floor');
  if (!studio || !floor || studio.dataset.finalStudioUpgrade === '1') return;
  studio.dataset.finalStudioUpgrade = '1';

  const mainArena = 'https://discord.com/channels/1429398855681573038/1429398859020370096';
  const claimStage = 'https://discord.gg/YsxvcQBBqH';
  const creatorHub = 'https://creators.rmsglobalpublishing.com/';

  const final = document.createElement('div');
  final.className = 'studio-final-system';
  final.innerHTML = `
    <section class="studio-membership-panel" data-view-event="studio_membership_view">
      <div class="studio-final-head">
        <div><p class="kicker">MEMBERSHIP ACCESS · FOUNDER-GOVERNED</p><h3>Access should add value.<br><em>Never take away ownership.</em></h3></div>
        <p>Studio membership is being built around access, discovery, events, education, selected discounts and priority routing. A canceled membership never cancels a separately purchased perpetual license.</p>
      </div>
      <div class="studio-tier-grid">
        <article><span>TIER 1</span><h4>Member</h4><p>Member library access, Studio events, educational resources and selected discounts.</p><strong>PRICE · FOUNDER APPROVAL</strong></article>
        <article><span>TIER 2</span><h4>Pro</h4><p>Expanded member library access plus priority routing and deeper Studio access.</p><strong>PRICE · FOUNDER APPROVAL</strong></article>
        <article><span>TIER 3</span><h4>Executive</h4><p>Highest approved library access, priority routing and executive Studio experiences.</p><strong>PRICE · FOUNDER APPROVAL</strong></article>
      </div>
      <p class="studio-final-note">Membership checkout remains unavailable until deliverables are quantified, Founder pricing is approved, Drive grant/revoke automation is proven, and Stripe is wired last.</p>
    </section>

    <section class="studio-new-panel" data-view-event="studio_new_this_week_view">
      <div class="studio-final-head"><div><p class="kicker">NEW THIS WEEK</p><h3>Only cleared work<br><em>reaches the floor.</em></h3></div><p>RMS PI surfaces only assets cleared for their intended commercial/member use. Internal masters, unresolved rights, restricted samples and review-required material remain private.</p></div>
      <div class="studio-empty-state"><span>RMS PI FEED</span><strong>Catalog feed ready.</strong><p>Approved Studio assets will appear here after the first rights-cleared staging batch is ingested. No placeholder tracks or fake activity are displayed.</p></div>
      <div class="studio-final-actions"><a class="button ghost track soundable" data-event="studio_free_preview_click" data-placement="studio_new_this_week" href="${creatorHub}" target="_blank" rel="noopener"><span>Browse RMS CreatorHub</span><i>↗</i></a></div>
    </section>

    <section class="studio-faq-panel">
      <div><p class="kicker">STUDIO FAQ</p><h3>Clear before<br><em>you create.</em></h3></div>
      <div class="studio-faq-list">
        <details><summary>Is RESET Studio only for musicians?</summary><p>No. The production floor supports music, podcasts, spoken word, interviews, education, gaming, visual creators, storytelling and collaborative sessions.</p></details>
        <details><summary>Does starting a session upload my MPC project?</summary><p>No. A session reference organizes the workflow. DAW project files and stems are never claimed as uploaded until an actual secure ingest action occurs.</p></details>
        <details><summary>Does membership give RMS ownership of my work?</summary><p>No. Membership is an access product. Ownership, licensing and publishing authority are separate and governed by explicit written terms.</p></details>
        <details><summary>Can uncleared samples enter the member library?</summary><p>No. Rights, commercial-use and third-party-content gates must clear before an asset can surface publicly or in a paid member catalog.</p></details>
        <details><summary>Does sync prep guarantee a placement?</summary><p>No. RMS can improve organization and licensing readiness. Placement and income are never guaranteed.</p></details>
      </div>
    </section>

    <section class="studio-final-cta" data-view-event="studio_final_cta_view">
      <p class="kicker">RESET INNER CIRCLE STUDIO</p>
      <h3>Create with intention.<br><em>Leave with something usable.</em></h3>
      <p>Enter the room, build the session, protect the rights and move the work forward.</p>
      <div class="studio-final-actions">
        <button type="button" class="button gold studio-start-session"><span>Start a Session</span><i>→</i></button>
        <a class="button ghost track soundable" data-event="studio_services_click" data-placement="studio_final" href="#studio"><span>Explore Studio Services</span><i>→</i></a>
        <a class="button ghost track soundable" data-event="studio_claim_stage_click" data-placement="studio_final" href="${claimStage}" target="_blank" rel="noopener"><span>Claim Your Stage</span><i>↗</i></a>
        <a class="text-link track soundable" data-event="studio_arena_click" data-placement="studio_final" href="${mainArena}" target="_blank" rel="noopener">Enter Main Arena <b>↗</b></a>
      </div>
    </section>`;
  floor.appendChild(final);

  const style = document.createElement('style');
  style.textContent = `
    .studio-final-system{margin-top:34px}.studio-membership-panel,.studio-new-panel,.studio-faq-panel,.studio-final-cta{margin-top:22px;padding:clamp(28px,4vw,54px);border:1px solid rgba(200,162,74,.2);background:linear-gradient(180deg,rgba(18,18,20,.96),rgba(7,8,10,.98))}.studio-final-head,.studio-faq-panel{display:grid;grid-template-columns:1fr .85fr;gap:38px;align-items:start}.studio-final-head h3,.studio-faq-panel h3,.studio-final-cta h3{font-family:Georgia,serif;font-size:clamp(34px,4.2vw,58px);font-weight:400;line-height:1;margin:12px 0}.studio-final-head h3 em,.studio-faq-panel h3 em,.studio-final-cta h3 em{color:var(--gold2);font-weight:400}.studio-final-head>p,.studio-final-cta>p{color:#8f897f;font-size:12px;line-height:1.7}.studio-tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:32px}.studio-tier-grid article{padding:28px;border:1px solid #343026;background:#0b0c0e}.studio-tier-grid span{color:var(--gold);font-size:8px;letter-spacing:.15em}.studio-tier-grid h4{font:400 27px Georgia,serif;margin:20px 0 10px}.studio-tier-grid p{color:#8a847b;font-size:11px;line-height:1.6;min-height:72px}.studio-tier-grid strong{display:block;margin-top:20px;color:#bba977;font-size:9px;letter-spacing:.11em}.studio-final-note{margin-top:20px;padding:14px 16px;border-left:1px solid var(--gold);color:#817b72;background:rgba(200,162,74,.04);font-size:10px;line-height:1.6}.studio-empty-state{margin-top:28px;padding:28px;border:1px dashed rgba(200,162,74,.28);text-align:center}.studio-empty-state span{display:block;color:var(--gold);font-size:8px;letter-spacing:.16em}.studio-empty-state strong{display:block;font:400 24px Georgia,serif;margin:15px 0 8px}.studio-empty-state p{max-width:620px;margin:auto;color:#817b72;font-size:11px;line-height:1.6}.studio-faq-list details{border-top:1px solid #302c24;padding:16px 0}.studio-faq-list details:last-child{border-bottom:1px solid #302c24}.studio-faq-list summary{cursor:pointer;color:#ded4c0;font-size:12px}.studio-faq-list p{color:#817b72;font-size:11px;line-height:1.6;padding-right:20px}.studio-final-cta{text-align:center;background:radial-gradient(circle at 50% 0,rgba(200,162,74,.12),transparent 38%),#090a0c}.studio-final-cta>p{max-width:600px;margin:14px auto}.studio-final-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:26px}.studio-final-actions .text-link{align-self:center;margin-left:8px}@media(max-width:850px){.studio-final-head,.studio-faq-panel{grid-template-columns:1fr}.studio-tier-grid{grid-template-columns:1fr}.studio-tier-grid p{min-height:0}}
  `;
  document.head.appendChild(style);

  // Bind final CTA buttons to the already-installed Studio session handler.
  const sourceButton = studio.querySelector('.studio-start-session:not(.studio-final-system .studio-start-session)');
  studio.querySelectorAll('.studio-final-system .studio-start-session').forEach((button) => {
    button.addEventListener('click', () => sourceButton?.click());
  });
})();
