(() => {
  const studio = document.querySelector('#studio');
  if (!studio || studio.dataset.productionBlueprint === '2') return;
  studio.dataset.productionBlueprint = '2';

  const copy = studio.querySelector('.wrap.split > div:first-child');
  const card = studio.querySelector('.studio-card');
  if (!copy || !card) return;

  const lead = copy.querySelector('.lead.small');
  if (lead) lead.textContent = 'A multipurpose remote creator room wired for live conversation, performance, interviews, education, gaming, storytelling, visual sharing, podcasts, collaboration and production. Discord connects the people. Wave Link controls the audio. MPC Beats and other approved apps feed the creative signal. OBS builds the program. Camera Hub controls the host camera.';

  const chips = copy.querySelector('.chips');
  if (chips) chips.innerHTML = '<span>Interviews + Podcasts</span><span>Music + Performance</span><span>Creator Education</span><span>Gaming + Live Play</span><span>Visual + Screen Share</span><span>Storytelling + Spoken Word</span><span>Collaboration</span><span>Live Production</span>';

  const oldLink = copy.querySelector('[data-event="studio_discord_click"]');
  if (oldLink) oldLink.remove();

  const actions = document.createElement('div');
  actions.className = 'studio-blueprint-actions';
  actions.innerHTML = `
    <a class="button gold track soundable" data-event="studio_main_arena_click" data-placement="studio_blueprint" href="https://discord.com/channels/1429398855681573038/1429398859020370096" target="_blank" rel="noopener"><span>Enter the Main Arena</span><i>↗</i></a>
    <a class="button ghost track soundable" data-event="claim_your_stage_invite_click" data-placement="studio_blueprint" href="https://discord.gg/YsxvcQBBqH" target="_blank" rel="noopener"><span>Claim Your Stage</span><i>↗</i></a>
    <a class="text-link track soundable" data-event="game_room_click" data-placement="studio_blueprint" href="https://discord.com/channels/1429398855681573038/1429398859020370100" target="_blank" rel="noopener">Open the Game Room <b>↗</b></a>`;
  copy.appendChild(actions);

  const inviteNote = document.createElement('p');
  inviteNote.className = 'studio-blueprint-note';
  inviteNote.innerHTML = '<strong>Claim Your Stage is not music-only.</strong> Cleared members with a creative spark can use the room for demos, performances, interviews, education, visual presentations, storytelling, podcasts, gaming moments, showcases and collaborative experiments. Recording is off unless the session clearly announces otherwise.';
  copy.appendChild(inviteNote);

  const path = card.querySelector('.signal-path');
  if (path) path.innerHTML = '<span>CREATE</span><i>→</i><span>WAVE LINK</span><i>→</i><span>OBS</span><i>→</i><span>DISCORD / LIVE / REC</span>';

  const status = document.createElement('div');
  status.className = 'studio-blueprint-status';
  status.innerHTML = `
    <span><small>VOICE</small><strong>WAVE:3</strong></span>
    <span><small>DAW</small><strong>MPC BEATS</strong></span>
    <span><small>CAMERA</small><strong>FACECAM MK.2</strong></span>
    <span><small>PROGRAM</small><strong>OBS 32</strong></span>`;
  card.appendChild(status);

  const style = document.createElement('style');
  style.textContent = `
    .studio-blueprint-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}.studio-blueprint-actions .text-link{margin-left:4px}.studio-blueprint-note{margin-top:20px;padding:16px 18px;border-left:1px solid var(--gold);background:rgba(200,162,74,.04);color:#8d877d;font-size:11px;line-height:1.65;max-width:760px}.studio-blueprint-note strong{color:#d4c9b2;font-weight:500}.studio-blueprint-status{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:24px;background:rgba(200,162,74,.15);border:1px solid rgba(200,162,74,.15)}.studio-blueprint-status span{background:#090a0c;padding:14px}.studio-blueprint-status small{display:block;color:#746e65;font-size:8px;letter-spacing:.13em}.studio-blueprint-status strong{display:block;color:var(--gold2);font-family:Georgia,serif;font-size:14px;font-weight:400;margin-top:5px}@media(max-width:700px){.studio-blueprint-actions{align-items:stretch;flex-direction:column}.studio-blueprint-actions .button{width:100%}.studio-blueprint-status{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);
})();
