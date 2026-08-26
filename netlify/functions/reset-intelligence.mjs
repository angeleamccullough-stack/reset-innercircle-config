import crypto from 'node:crypto';

const allowed = new Set([
  'reset_gateway_view',
  'discord_join_click',
  'discord_join_click_footer',
  'studio_interest',
  'studio_discord_click',
  'studio_service_inquiry',
  'studio_luxury_view',
  'studio_pricing_view',
  'studio_session_started',
  'studio_browser_daw_click',
  'studio_claim_stage_click',
  'studio_game_room_click',
  'studio_main_arena_click',
  'studio_service_checkout_click',
  'claim_your_stage_invite_click',
  'game_room_click',
  'support_checkout_started',
  'facebook_network_click',
  'facebook_network_directory_click',
  'discord_engagement_hub_click',
  'discord_live_events_click',
  'network_discord_join_click',
  'partner_network_view',
  'network_revenue_view',
  'group_leader_interest',
  'event_sponsor_interest',
  'group_feature_interest',
  'workshop_event_interest',
  'footer_network_click',
  'footer_studio_click',
  'footer_services_click',
  'footer_support_click',
  'footer_arena_click',
  'footer_live_click',
  'footer_partner_click',
  'footer_discord_click',
  'footer_rms_click',
  'footer_creator_portal_click',
  'footer_academy_click',
  'footer_steadiora_click',
  'footer_rs_vault_click',
  'nav_arena_click',
  'live_bridge_click',
  'live_bridge_view',
  'partner_onboarding_view',
  'partner_application_submit',
  'partner_thanks_view',
  'arena_gateway_view',
  'arena_bridge_click',
  'arena_discord_open_click',
  'arena_join_click',
  'arena_live_events_click',
  'arena_soul_flow_click',
  'arena_studio_click',
  'arena_model_rendered',
  'pinterest_surface_click',
  'pinterest_referral_view',
  'pinterest_arena_interest',
  'pinterest_live_interest',
  'pinterest_studio_interest'
]);

const DEFAULT_CREATORHUB_INGRESS = 'https://creators.rmsglobalpublishing.com/api/internal/communications/ingest';

export default async (request) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const input = await request.json();
    const eventType = String(input?.event_type || '').slice(0, 120);
    if (!allowed.has(eventType)) return Response.json({ ok: false }, { status: 400 });

    const endpoint = process.env.RESET_INTELLIGENCE_INGRESS_URL || DEFAULT_CREATORHUB_INGRESS;
    const secret = process.env.RESET_INTELLIGENCE_INGRESS_SECRET || '';
    if (!secret) return Response.json({ ok: true, relayed: false }, { status: 202 });

    const metadata = input?.metadata && typeof input.metadata === 'object' ? input.metadata : {};
    const safe = Object.fromEntries(Object.entries(metadata).filter(([k]) => !/email|name|phone|token|secret|password|cookie|authorization|key/i.test(k)).slice(0, 20));
    const externalId = `netlify-${Date.now()}-${crypto.randomUUID()}`;
    const payload = {
      scope: 'resetinnercircle',
      source: 'netlify',
      external_event_id: externalId,
      event_type: eventType,
      payload: { ...safe, gateway: 'resetinnercircle.com' }
    };

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-rms-communications-ingress-secret': secret
      },
      body: JSON.stringify(payload)
    });
    return Response.json({ ok: true, relayed: upstream.ok }, { status: upstream.ok ? 202 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
};
