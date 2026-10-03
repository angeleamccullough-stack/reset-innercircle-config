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
    <section class="studio-final-cta" data-view-event="studio_booking_view">
      <p class="kicker">BOOK PRODUCTION · SECURE STRIPE CHECKOUT</p>
      <h3>A clear scope.<br><em>A real next step.</em></h3>
      <p>Studio deposits start at $250 USD. Event deposits start at $500 USD. Confirm your scope and terms, then pay the agreed deposit toward your project.</p>
      <div class="studio-final-actions">
        <a class="button gold track soundable" data-event="studio_service_booking" data-placement="studio_final" href="/booking.html#studio"><span>Book Studio Production</span><i>→</i></a>
        <a class="button ghost track soundable" data-event="event_service_booking" data-placement="studio_final" href="/booking.html#events"><span>Book Event Production</span><i>→</i></a>
      </div>
    </section>

    <section class="studio-faq-panel">
      <div><p class="kicker">STUDIO FAQ</p><h3>Clear before<br><em>you create.</em></h3></div>
      <div class="studio-faq-list">
        <details><summary>Is RESET Studio only for musicians?</summary><p>No. The production floor supports music, podcasts, spoken word, interviews, education, gaming, visual creators, storytelling and collaborative sessions.</p></details>
        <details><summary>Does starting a session upload my MPC project?</summary><p>No. A session reference organizes the workflow. DAW project files and stems are never claimed as uploaded until an actual secure ingest action occurs.</p></details>
        <details><summary>Does paying a deposit transfer ownership of my work?</summary><p>No. Ownership, licensing and publishing authority are separate and governed by explicit written terms.</p></details>
        <details><summary>Can I bring third-party content to a project?</summary><p>Disclose samples, licensed beats and other third-party content at intake. Permissions must be confirmed before any agreed commercial delivery.</p></details>
        <details><summary>Does sync prep guarantee a placement?</summary><p>No. RMS can improve organization and licensing readiness. Placement and income are never guaranteed.</p></details>
      </div>
    </section>

    <section class="studio-final-cta" data-view-event="studio_final_cta_view">
      <p class="kicker">RESET INNER CIRCLE STUDIO</p>
      <h3>Create with intention.<br><em>Leave with something usable.</em></h3>
      <p>Enter the room, build the session, protect the rights and move the work forward.</p>
      <div class="studio-final-actions">
        <button type="button" class="button gold studio-start-session"><span>Start a Session</span><i>→</i></button>
        <a class="button ghost track soundable" data-event="studio_services_click" data-placement="studio_final" href="/booking.html"><span>Book Production</span><i>→</i></a>
        <a class="button ghost track soundable" data-event="studio_claim_stage_click" data-placement="studio_final" href="${claimStage}" target="_blank" rel="noopener"><span>Claim Your Stage</span><i>↗</i></a>
        <a class="text-link track soundable" data-event="studio_arena_click" data-placement="studio_final" href="${mainArena}" target="_blank" rel="noopener">Enter Main Arena <b>↗</b></a>
      </div>
    </section>`;
  floor.appendChild(final);

  const style = document.createElement('style');
  style.textContent = `
    .studio-final-system{margin-top:34px}.studio-faq-panel,.studio-final-cta{margin-top:22px;padding:clamp(28px,4vw,54px);border:1px solid rgba(200,162,74,.2);background:linear-gradient(180deg,rgba(18,18,20,.96),rgba(7,8,10,.98))}.studio-final-head,.studio-faq-panel{display:grid;grid-template-columns:1fr .85fr;gap:38px;align-items:start}.studio-final-head h3,.studio-faq-panel h3,.studio-final-cta h3{font-family:Georgia,serif;font-size:clamp(34px,4.2vw,58px);font-weight:400;line-height:1;margin:12px 0}.studio-final-head h3 em,.studio-faq-panel h3 em,.studio-final-cta h3 em{color:var(--gold2);font-weight:400}.studio-final-head>p,.studio-final-cta>p{color:#8f897f;font-size:12px;line-height:1.7}.studio-faq-list details{border-top:1px solid #302c24;padding:16px 0}.studio-faq-list details:last-child{border-bottom:1px solid #302c24}.studio-faq-list summary{cursor:pointer;color:#ded4c0;font-size:12px}.studio-faq-list p{color:#817b72;font-size:11px;line-height:1.6;padding-right:20px}.studio-final-cta{text-align:center;background:radial-gradient(circle at 50% 0,rgba(200,162,74,.12),transparent 38%),#090a0c}.studio-final-cta>p{max-width:600px;margin:14px auto}.studio-final-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:26px}.studio-final-actions .text-link{align-self:center;margin-left:8px}@media(max-width:850px){.studio-final-head,.studio-faq-panel{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const sourceButton = studio.querySelector('.studio-start-session:not(.studio-final-system .studio-start-session)');
  studio.querySelectorAll('.studio-final-system .studio-start-session').forEach((button) => {
    button.addEventListener('click', () => sourceButton?.click());
  });
})();

