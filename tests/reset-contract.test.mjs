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
  assert.match(studio, /href="\/checkout\/studio"/);
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
      const response = await serviceCheckout(new Request(`https://resetinnercircle.com/checkout/${bucket}?bucket=${bucket}`));
      assert.equal(response.status, 302);
      assert.equal(response.headers.get('location'), expected);
      assert.equal(response.headers.get('cache-control'), 'no-store');
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
