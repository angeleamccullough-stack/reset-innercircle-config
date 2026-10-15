import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import serviceCheckout from '../netlify/functions/service-checkout.mjs';
import support from '../netlify/functions/support.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const templates = JSON.parse(read('config/reset-communication-templates.json'));
const routing = JSON.parse(read('config/reset-smart-response.json'));
const payments = JSON.parse(read('config/reset-payment-buckets.json'));
const studio = read('site/studio-upgrade.js');
const discordCommands = read('rms-discord-bridge/src/commands.js');
const discordInteractions = read('rms-discord-bridge/api/interactions.js');
const discordEnvExample = read('rms-discord-bridge/.env.example');
const discordRegistration = read('rms-discord-bridge/src/register-commands.js');

const EXPECTED_PAYMENT_LINKS = {
  community_support: 'https://donate.rmsglobalpublishing.com/b/5kQbJ26YgeF41fa4E5grS00',
  studio_services: 'https://donate.rmsglobalpublishing.com/b/8x23cw82kaoO6zufiJgrS01',
  event_services: 'https://donate.rmsglobalpublishing.com/b/4gM9AUgyQdB08HC3A1grS02'
};

test('RESET communication pack contains every governed lifecycle template', () => {
  const required = ['intro', 'welcome', 'purchase_confirmation', 'renewal_notice', 'failed_payment', 'inquiry_acknowledgment', 'support_acknowledgment', 'event_confirmation'];
  assert.deepEqual(Object.keys(templates.templates), required);
  assert.equal(templates.provider, 'Zoho');
  assert.equal(templates.status, 'prepared_not_activated');
  for (const template of Object.values(templates.templates)) {
    assert.ok(template.subject.length > 5);
    assert.ok(template.body.length > 40);
  }
});

test('RESET smart routing is fail-closed for sensitive and financial inquiries', () => {
  const byIntent = Object.fromEntries(routing.automation_rules.map((rule) => [rule.intent, rule]));
  assert.equal(byIntent.payment_support.auto_reply, 'acknowledgment_only');
  assert.equal(byIntent.rights_or_licensing.auto_reply, 'no_substantive_advice');
  assert.equal(byIntent.credential_or_card_data.auto_reply, 'redact_and_warn');
  assert.match(routing.provider_boundary, /Zoho/);
  assert.match(routing.provider_boundary, /CreatorHub/);
});

test('RESET payment lanes are active, distinct, entitlement-safe and pinned to verified Stripe links', () => {
  assert.equal(payments.status, 'active_verified');
  const buckets = payments.buckets;
  assert.notEqual(buckets.community_support.environment_variable, buckets.studio_services.environment_variable);
  assert.notEqual(buckets.studio_services.environment_variable, buckets.event_services.environment_variable);
  for (const [key, bucket] of Object.entries(buckets)) {
    assert.equal(bucket.status, 'active_verified');
    assert.equal(bucket.discord_access_entitlement, false);
    assert.equal(bucket.checkout_url, EXPECTED_PAYMENT_LINKS[key]);
    assert.match(bucket.checkout_url, /^https:\/\/donate\.rmsglobalpublishing\.com\/b\//);
  }
  assert.equal(buckets.community_support.tax_deductible_claim, false);
  assert.match(studio, /href="\/booking\.html#studio"/);
  assert.doesNotMatch(studio, /href="\/\.netlify\/functions\/service-checkout\?bucket=studio"/);
});

test('RESET payment functions fail closed when unbound and redirect only to verified branded Stripe URLs when bound', async () => {
  const saved = {
    support: process.env.RESET_STRIPE_SUPPORT_URL,
    studio: process.env.RESET_STRIPE_STUDIO_SERVICES_URL,
    events: process.env.RESET_STRIPE_EVENT_SERVICES_URL
  };
  delete process.env.RESET_STRIPE_SUPPORT_URL;
  delete process.env.RESET_STRIPE_STUDIO_SERVICES_URL;
  delete process.env.RESET_STRIPE_EVENT_SERVICES_URL;
  try {
    for (const bucket of ['studio', 'events']) {
      const response = await serviceCheckout(new Request(`https://resetinnercircle.com/checkout/${bucket}?bucket=${bucket}`));
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match(await response.text(), /No payment has been initiated/);
    }
    const supportResponse = await support(new Request('https://resetinnercircle.com/support'));
    assert.equal(supportResponse.status, 503);
    assert.equal(supportResponse.headers.get('cache-control'), 'no-store');
    const rejected = await serviceCheckout(new Request('https://resetinnercircle.com/checkout/studio?bucket=studio', { method: 'POST' }));
    assert.equal(rejected.status, 405);
    assert.equal(rejected.headers.get('allow'), 'GET, HEAD');

    process.env.RESET_STRIPE_SUPPORT_URL = EXPECTED_PAYMENT_LINKS.community_support;
    process.env.RESET_STRIPE_STUDIO_SERVICES_URL = EXPECTED_PAYMENT_LINKS.studio_services;
    process.env.RESET_STRIPE_EVENT_SERVICES_URL = EXPECTED_PAYMENT_LINKS.event_services;
    const supportBound = await support(new Request('https://resetinnercircle.com/support'));
    assert.equal(supportBound.status, 302);
    assert.equal(supportBound.headers.get('location'), EXPECTED_PAYMENT_LINKS.community_support);
    for (const [bucket, expected] of [['studio', EXPECTED_PAYMENT_LINKS.studio_services], ['events', EXPECTED_PAYMENT_LINKS.event_services]]) {
      for (const suffix of ['', `?bucket=${bucket}`, `?bucket=${bucket === 'studio' ? 'events' : 'studio'}`]) {
        const response = await serviceCheckout(new Request(`https://resetinnercircle.com/checkout/${bucket}${suffix}`));
        assert.equal(response.status, 302);
        assert.equal(response.headers.get('location'), expected);
        assert.equal(response.headers.get('cache-control'), 'no-store');
      }
      const head = await serviceCheckout(new Request(`https://resetinnercircle.com/checkout/${bucket}`, { method: 'HEAD' }));
      assert.equal(head.status, 302);
      assert.equal(await head.text(), '');
    }
  } finally {
    if (saved.support === undefined) delete process.env.RESET_STRIPE_SUPPORT_URL; else process.env.RESET_STRIPE_SUPPORT_URL = saved.support;
    if (saved.studio === undefined) delete process.env.RESET_STRIPE_STUDIO_SERVICES_URL; else process.env.RESET_STRIPE_STUDIO_SERVICES_URL = saved.studio;
    if (saved.events === undefined) delete process.env.RESET_STRIPE_EVENT_SERVICES_URL; else process.env.RESET_STRIPE_EVENT_SERVICES_URL = saved.events;
  }
});

test('RMS Discord bridge is guild-bound and routes customers through canonical domains', () => {
  assert.match(discordInteractions, /interaction\.guild_id !== guildId/);
  assert.match(discordInteractions, /DISCORD_GUILD_ID is not configured/);
  assert.ok(discordInteractions.indexOf('verifyKey') < discordInteractions.indexOf('interaction.guild_id !== guildId'));
  assert.match(discordCommands, /https:\/\/creators\.rmsglobalpublishing\.com\//);
  assert.match(discordCommands, /randomUUID\(\)/);
  assert.doesNotMatch(discordEnvExample, /rms-creator-portal\.vercel\.app/);
  assert.ok(discordRegistration.indexOf('rest.get(route)') < discordRegistration.indexOf('rest.put('));
  assert.match(discordRegistration, /already current; no Discord write needed/);
});

// Preserve the evidence/authority boundary discovered during community alignment.
test('community bots remain capabilities beneath whole-ecosystem authority', () => {
  const carl = JSON.parse(read('config/carl-premium-automation.json'));
  const discord = JSON.parse(read('config/rms-discord-integration.json'));
  for (const config of [carl, discord]) {
    assert.equal(config.ecosystem_alignment.company_control_plane, 'RMS Command Core v3.1');
    assert.equal(config.ecosystem_alignment.provider_authority, 'CAPABILITY_ONLY');
    assert.equal(config.ecosystem_alignment.new_paid_dependency, false);
    assert.equal(config.ecosystem_alignment.new_scheduler, false);
    assert.equal(config.ecosystem_alignment.recognition_is_entitlement, false);
    assert.equal(config.ecosystem_alignment.recognition_is_mastery, false);
  }
  assert.equal(carl.tatsu_control.native_bot_control_verified, false);
  assert.equal(discord.discord.tatsu_integration.native_bot_control_verified, false);
  assert.equal(carl.standard_features_to_harden.greetings.live_state.creatorhub, 'https://creators.rmsglobalpublishing.com/start');
  assert.equal(carl.tatsu_control.live_state.automatic_role_mapping_count, 0);
  assert.equal(carl.tatsu_control.live_state.self_role_mapping_count, 0);
  if (carl.tatsu_control.live_state.recognition_runtime_certified) {
    assert.ok(carl.tatsu_control.recognition_evidence?.source);
    assert.ok(carl.tatsu_control.recognition_evidence?.verified_at);
  } else {
    assert.match(carl.tatsu_control.status, /NOT_CERTIFIED/);
  }
  assert.equal(carl.tatsu_control.live_state.historical_balances_preserved, true);
  assert.equal(carl.tatsu_control.live_state.historical_voucher_records_preserved, true);
  const counts = ['points_blocked_text_channels', 'score_blocked_text_channels', 'global_xp_credits_blocked_text_channels'].map(key => carl.tatsu_control.live_state[key]);
  assert.ok(counts.every(n => Number.isInteger(n) && n > 0));
  assert.ok(counts.every(n => n === counts[0]));
  assert.equal(carl.tatsu_control.live_state.new_channel_coverage_requires_recheck, true);
  const loggingConfig = carl.standard_features_to_harden.logging;
  assert.equal(loggingConfig.privacy_policy, 'REQUIRE_PRIVATE_STAFF_DESTINATIONS');
  const logging = loggingConfig.live_state;
  if (loggingConfig.private_only === true) {
    assert.equal(logging.privacy_verification, 'VERIFIED_DISCORD_PERMISSIONS');
    assert.ok(logging.privacy_evidence?.source);
    assert.ok(logging.privacy_evidence?.verified_at);
  } else {
    assert.equal(loggingConfig.private_only, null);
  }
  if (logging.privacy_gap === false) {
    assert.equal(logging.privacy_verification, 'VERIFIED_DISCORD_PERMISSIONS');
    assert.ok(logging.privacy_evidence?.source);
    assert.ok(logging.privacy_evidence?.verified_at);
  } else {
    assert.equal(logging.privacy_gap, null);
    assert.ok(carl.live_audit.standard_gap.length > 0);
  }
});
