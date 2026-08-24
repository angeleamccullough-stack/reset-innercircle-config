const STRIPE_URL = /^https:\/\/(buy|checkout)\.stripe\.com\//i;

const buckets = {
  studio: 'RESET_STRIPE_STUDIO_SERVICES_URL',
  events: 'RESET_STRIPE_EVENT_SERVICES_URL'
};

export default async (request) => {
  const url = new URL(request.url);
  const bucket = String(url.searchParams.get('bucket') || '').toLowerCase();
  const envName = buckets[bucket];
  const checkoutUrl = envName ? (process.env[envName] || '') : '';

  if (!envName || !checkoutUrl || !STRIPE_URL.test(checkoutUrl)) {
    return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Reset Services Checkout</title><style>body{background:#08090b;color:#f4efe4;font-family:Arial;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:680px;padding:40px;text-align:center}h1{font-family:Georgia,serif;font-size:48px;font-weight:400;color:#e4c875}a{color:#c8a24a}</style></head><body><main><h1>Secure checkout is being connected.</h1><p>This Reset service payment lane is not active yet. No payment has been initiated.</p><p><a href="/">Return to Reset Inner Circle</a></p></main></body></html>`, { status: 503, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }

  return new Response(null, { status: 302, headers: { location: checkoutUrl, 'cache-control': 'no-store' } });
};
