(() => {
  const studio = document.querySelector('#studio');
  if (!studio || studio.dataset.productionBlueprint === '3') return;
  studio.dataset.productionBlueprint = '3';

  const copy = studio.querySelector('.wrap.split > div:first-child');
  const card = studio.querySelector('.studio-card');
  if (!copy || !card) return;

  const mainArenaUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370096';
  const claimStageUrl = 'https://discord.gg/YsxvcQBBqH';
  const gameRoomUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370100';
  const soundationUrl = 'https://soundation.com/';

  const makeSessionId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();
    return `RST-${date}-${rand}`;
  };

  const lead = copy.querySelector('.lead.small');
  if (lead) lead.textContent = 'A premium multipurpose production floor for music, podcasts, interviews, spoken word, education, gaming, storytelling, visual sharing and live collaboration. MPC is the flagship production engine. Discord connects the room. Wave Link controls the signal. OBS builds the program. Camera Hub keeps the host camera production-ready.';

  const chips = copy.querySelector('.chips');
  if (chips) chips.innerHTML = '<span>Interviews + Podcasts</span><span>Music + Performance</span><span>Creator Education</span><span>Gaming + Live Play</span><span>Visual + Screen Share</span><span>Storytelling + Spoken Word</span><span>Collaboration</span><span>Live Production</span>';

  copy.querySelector('[data-event="studio_discord_click"]')?.remove();

  const actions = document.createElement('div');
  actions.className = 'studio-blueprint-actions';
  actions.innerHTML = `
    <button type="button" class="button gold studio-start-session"><span>Start RMS Session</span><i>→</i></button>
    <a class="button ghost track soundable" data-event="studio_main_arena_click" data-placement="studio_blueprint" href="${mainArenaUrl}" target="_blank" rel="noopener"><span>Enter Main Arena</span><i>↗</i></a>
    <a class="text-link track soundable" data-event="claim_your_stage_invite_click" data-placement="studio_blueprint" href="${claimStageUrl}" target="_blank" rel="noopener">Claim Your Stage <b>↗</b></a>
    <a class="text-link track soundable" data-event="game_room_click" data-placement="studio_blueprint" href="${gameRoomUrl}" target="_blank" rel="noopener">Game Room <b>↗</b></a>`;
  copy.appendChild(actions);

  const inviteNote = document.createElement('p');
  inviteNote.className = 'studio-blueprint-note';
  inviteNote.innerHTML = '<strong>Claim Your Stage is not music-only.</strong> Cleared members with a creative spark can use the room for performances, demos, interviews, education, visual presentations, storytelling, podcasts, gaming moments, showcases and collaborative experiments. Recording remains off unless the session clearly announces otherwise.';
  copy.appendChild(inviteNote);

  const sessionBox = document.createElement('div');
  sessionBox.className = 'studio-session-box';
  sessionBox.hidden = true;
  sessionBox.innerHTML = '<span>RMS SESSION REFERENCE</span><strong class="studio-session-id"></strong><small>Use this reference in filenames, notes and service requests. It is a tracking reference only. It does not upload your DAW project or stems automatically.</small>';
  copy.appendChild(sessionBox);

  const path = card.querySelector('.signal-path');
  if (path) path.innerHTML = '<span>CREATE</span><i>→</i><span>WAVE LINK</span><i>→</i><span>OBS</span><i>→</i><span>DISCORD / LIVE / REC</span>';

  const status = document.createElement('div');
  status.className = 'studio-blueprint-status';
  status.innerHTML = `
    <span><small>VOICE</small><strong>WAVE:3</strong></span>
    <span><small>DAW</small><strong>MPC</strong></span>
    <span><small>CAMERA</small><strong>FACECAM MK.2</strong></span>
    <span><small>PROGRAM</small><strong>OBS 32</strong></span>`;
  card.appendChild(status);

  const floor = document.createElement('div');
  floor.className = 'studio-luxury-floor';
  floor.innerHTML = `
    <section class="studio-luxury-intro" data-view-event="studio_luxury_view">
      <div>
        <p class="kicker">RMS DIGITAL STUDIO · PRODUCTION FLOOR</p>
        <h3>Build the session.<br><em>Protect the work.</em></h3>
        <p>RESET Studio combines production, collaboration and catalog discipline in one creator-first workflow. The goal is simple: less chaos, cleaner sessions and more usable work.</p>
      </div>
      <div class="studio-signal-card">
        <span>FLAGSHIP SIGNAL PATH</span>
        <div><b>MPC / CREATOR APP</b><i>→</i><b>WAVE LINK</b><i>→</i><b>OBS</b><i>→</i><b>LIVE / REC</b></div>
        <small>Discord receives a clean microphone bus. The full program mix stays with OBS so guest audio, music and app sound do not feed back into the room.</small>
      </div>
    </section>

    <section class="studio-launch-grid">
      <article class="studio-launch-card flagship"><span>01 · FLAGSHIP</span><h4>MPC Production Room</h4><p>Full local production using MPC, Wave Link, OBS, Facecam and the RESET voice-room blueprint.</p><button type="button" class="button gold studio-start-session secondary"><span>Create Session Reference</span><i>→</i></button></article>
      <article class="studio-launch-card"><span>02 · BROWSER COLLAB</span><h4>Soundation Workspace</h4><p>Optional browser-based audio/MIDI sketching and real-time collaboration. Provider account and plan rules apply.</p><a class="button ghost track soundable" data-event="studio_browser_daw_click" data-placement="studio_luxury" href="${soundationUrl}" target="_blank" rel="noopener"><span>Launch Browser DAW</span><i>↗</i></a></article>
      <article class="studio-launch-card"><span>03 · SHOWCASE</span><h4>Claim Your Stage</h4><p>For cleared members with a creative spark across music, podcasts, spoken word, interviews, visual work, education, gaming and storytelling.</p><a class="button ghost track soundable" data-event="studio_claim_stage_click" data-placement="studio_luxury" href="${claimStageUrl}" target="_blank" rel="noopener"><span>Claim Your Stage</span><i>↗</i></a></article>
      <article class="studio-launch-card"><span>04 · COMMUNITY PLAY</span><h4>Game Room</h4><p>Gaming, community play, creator social sessions and low-pressure collaboration.</p><a class="button ghost track soundable" data-event="studio_game_room_click" data-placement="studio_luxury" href="${gameRoomUrl}" target="_blank" rel="noopener"><span>Open Game Room</span><i>↗</i></a></article>
    </section>

    <section class="studio-workflow-panel">
      <div><p class="kicker">RMS PROGRESSIVE INTELLIGENCE · SESSION STANDARD</p><h3>Less chaos. More usable catalog.</h3></div>
      <div class="studio-workflow-grid">
        <div><b>01</b><strong>START</strong><small>Create a privacy-safe RMS session reference.</small></div>
        <div><b>02</b><strong>CREATE</strong><small>Work in MPC or the approved collaboration lane.</small></div>
        <div><b>03</b><strong>VERSION</strong><small>Use RMS filename and version conventions.</small></div>
        <div><b>04</b><strong>REVIEW</strong><small>Check metadata, ownership, samples and delivery scope.</small></div>
        <div><b>05</b><strong>DELIVER</strong><small>Export approved files and route service requests through controlled intake.</small></div>
      </div>
    </section>

    <section class="studio-menu-panel" data-view-event="studio_pricing_view">
      <div class="studio-menu-head"><div><p class="kicker">RMS STUDIO MENU · PILOT STARTING RATES</p><h3>Professional work.<br><em>Clear value.</em></h3></div><p>Rates are starting points. Rights, complexity, revision scope, prior licenses and delivery requirements are confirmed before work or licensing begins.</p></div>
      <div class="studio-price-grid">
        <article><span>BEAT LICENSE</span><strong>$49+</strong><h4>WAV Lease</h4><small>Non-exclusive. Written license controls permitted uses.</small></article>
        <article><span>BEAT LICENSE</span><strong>$149+</strong><h4>Stems Lease</h4><small>Non-exclusive multitrack delivery with written scope.</small></article>
        <article><span>RIGHTS</span><strong>$750+</strong><h4>Exclusive Beat Rights</h4><small>Custom quote. Prior leases, publishing and exclusivity documented first.</small></article>
        <article><span>PRODUCTION</span><strong>$350+</strong><h4>Custom Production</h4><small>Scope and ownership defined before production begins.</small></article>
        <article><span>POST</span><strong>$175+</strong><h4>Mixing</h4><small>Per-song starting rate. Complexity and revision scope may change quote.</small></article>
        <article><span>POST</span><strong>$75+</strong><h4>Mastering</h4><small>Per-song starting rate with delivery formats confirmed at intake.</small></article>
        <article><span>POST</span><strong>$225+</strong><h4>Mix + Master</h4><small>Combined starting rate for standard projects.</small></article>
        <article><span>DELIVERY</span><strong>$75+</strong><h4>Stem Preparation</h4><small>Organized, labeled multitrack exports.</small></article>
        <article><span>CATALOG</span><strong>$149+</strong><h4>Metadata + Sync Prep</h4><small>Readiness review and organization. No placement guarantee.</small></article>
        <article><span>PUBLISHING</span><strong>AGREEMENT</strong><h4>Administration</h4><small>Available only under a written administration agreement.</small></article>
      </div>
      <div class="studio-menu-actions"><a class="button gold track soundable" data-event="studio_service_checkout_click" data-placement="studio_pricing" href="/.netlify/functions/service-checkout?bucket=studio"><span>Open Secure Studio Checkout</span><i>→</i></a><a class="button ghost track soundable" data-event="studio_main_arena_click" data-placement="studio_pricing" href="${mainArenaUrl}" target="_blank" rel="noopener"><span>Enter Main Arena</span><i>↗</i></a></div>
      <p class="studio-checkout-note">Checkout activates only when the approved RESET Studio Stripe service link is connected. If it is not active, no payment is initiated.</p>
    </section>

    <section class="studio-quality-panel">
      <div><p class="kicker">RMS PRODUCTION STANDARD</p><h3>Every project leaves cleaner than it arrived.</h3></div>
      <div class="studio-quality-grid">
        <div><b>METADATA</b><small>Clear title, creator, version and delivery labels.</small></div>
        <div><b>OWNERSHIP</b><small>Splits and rights status captured or explicitly marked pending.</small></div>
        <div><b>THIRD-PARTY CONTENT</b><small>Samples, beats and licensed elements disclosed before final delivery.</small></div>
        <div><b>DELIVERY</b><small>Approved formats, stems and versions matched to the service scope.</small></div>
        <div><b>PUBLISHING</b><small>Administration and registration pathways stay separate from production ownership.</small></div>
        <div><b>SYNC READINESS</b><small>Preparation improves readiness; it never guarantees placement or income.</small></div>
      </div>
    </section>`;
  studio.appendChild(floor);

  const style = document.createElement('style');
  style.textContent = `
    .studio-blueprint-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}.studio-blueprint-actions .text-link{margin-left:4px}.studio-blueprint-note{margin-top:20px;padding:16px 18px;border-left:1px solid var(--gold);background:rgba(200,162,74,.04);color:#8d877d;font-size:11px;line-height:1.65;max-width:760px}.studio-blueprint-note strong{color:#d4c9b2;font-weight:500}.studio-session-box{margin-top:18px;padding:18px;border:1px solid rgba(200,162,74,.28);background:#090a0c}.studio-session-box span,.studio-session-box small{display:block}.studio-session-box span{color:var(--gold);font-size:8px;letter-spacing:.16em}.studio-session-box strong{display:block;color:#f0dfb5;font-family:ui-monospace,monospace;font-size:17px;margin:8px 0}.studio-session-box small{color:#7d776d;line-height:1.5}.studio-blueprint-status{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:24px;background:rgba(200,162,74,.15);border:1px solid rgba(200,162,74,.15)}.studio-blueprint-status span{background:#090a0c;padding:14px}.studio-blueprint-status small{display:block;color:#746e65;font-size:8px;letter-spacing:.13em}.studio-blueprint-status strong{display:block;color:var(--gold2);font-family:Georgia,serif;font-size:14px;font-weight:400;margin-top:5px}.studio-luxury-floor{grid-column:1/-1;margin-top:70px}.studio-luxury-intro,.studio-menu-head,.studio-quality-panel{display:grid;grid-template-columns:1fr .8fr;gap:34px;align-items:end}.studio-luxury-intro h3,.studio-menu-head h3,.studio-workflow-panel h3,.studio-quality-panel h3{font-family:Georgia,serif;font-size:clamp(34px,4vw,54px);font-weight:400;line-height:1;margin:14px 0}.studio-luxury-intro h3 em,.studio-menu-head h3 em{color:var(--gold2);font-weight:400}.studio-luxury-intro>div>p:last-child,.studio-menu-head>p{color:var(--muted);font-size:13px}.studio-signal-card{padding:26px;border:1px solid #443821;background:radial-gradient(circle at 80% 10%,rgba(200,162,74,.1),transparent 30%),#0a0b0d}.studio-signal-card>span{color:var(--gold);font-size:8px;letter-spacing:.16em}.studio-signal-card>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:24px 0;color:#d9cfbb;font-size:10px}.studio-signal-card i{color:var(--gold)}.studio-signal-card small{color:#777168;line-height:1.55}.studio-launch-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px}.studio-launch-card{padding:28px;border:1px solid #302b21;background:linear-gradient(180deg,#101114,#08090b);min-height:260px}.studio-launch-card.flagship{border-color:#695226;background:radial-gradient(circle at 50% 0,rgba(200,162,74,.12),transparent 38%),#0b0c0e}.studio-launch-card>span,.studio-price-grid article>span{color:var(--gold);font-size:8px;letter-spacing:.14em}.studio-launch-card h4,.studio-price-grid h4{font-family:Georgia,serif;font-size:23px;font-weight:400;margin:28px 0 10px}.studio-launch-card p{color:#8a847b;font-size:11px;line-height:1.55;min-height:70px}.studio-workflow-panel,.studio-menu-panel,.studio-quality-panel{margin-top:44px;padding:34px;border:1px solid #3b3223;background:#0a0b0d}.studio-workflow-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:rgba(200,162,74,.12);margin-top:26px}.studio-workflow-grid>div{background:#090a0c;padding:20px}.studio-workflow-grid b{color:var(--gold);font-family:Georgia,serif}.studio-workflow-grid strong,.studio-workflow-grid small{display:block}.studio-workflow-grid strong{margin:14px 0 8px;font-size:10px;letter-spacing:.12em}.studio-workflow-grid small{color:#777168;font-size:9px;line-height:1.5}.studio-price-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:28px}.studio-price-grid article{padding:22px;border:1px solid #2e2920;background:#0e0f11;min-height:185px}.studio-price-grid article>strong{display:block;color:#e6ca7c;font-family:Georgia,serif;font-size:25px;font-weight:400;margin-top:20px}.studio-price-grid h4{font-size:18px;margin:9px 0}.studio-price-grid small{color:#777168;font-size:9px;line-height:1.45}.studio-menu-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.studio-checkout-note{color:#6f6a61;font-size:9px;margin-top:14px}.studio-quality-panel{align-items:start}.studio-quality-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.studio-quality-grid>div{padding:18px;border:1px solid #302b21;background:#0e0f11}.studio-quality-grid b,.studio-quality-grid small{display:block}.studio-quality-grid b{color:#d7c9a5;font-size:9px;letter-spacing:.12em}.studio-quality-grid small{color:#777168;font-size:9px;line-height:1.5;margin-top:7px}@media(max-width:1050px){.studio-launch-grid{grid-template-columns:1fr 1fr}.studio-price-grid{grid-template-columns:repeat(2,1fr)}.studio-workflow-grid{grid-template-columns:1fr 1fr}.studio-luxury-intro,.studio-menu-head,.studio-quality-panel{grid-template-columns:1fr}}@media(max-width:700px){.studio-blueprint-actions{align-items:stretch;flex-direction:column}.studio-blueprint-actions .button{width:100%}.studio-blueprint-status,.studio-launch-grid,.studio-price-grid,.studio-workflow-grid,.studio-quality-grid{grid-template-columns:1fr}.studio-menu-actions{flex-direction:column}.studio-menu-actions .button{width:100%}}
  `;
  document.head.appendChild(style);

  const startSession = () => {
    const id = makeSessionId();
    const target = copy.querySelector('.studio-session-id');
    if (target) target.textContent = id;
    sessionBox.hidden = false;
    window.resetTrack?.('studio_session_started', { session_ref: id, mode: 'flagship_mpc' });
    sessionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  document.querySelectorAll('.studio-start-session').forEach((button) => button.addEventListener('click', startSession));
})();
