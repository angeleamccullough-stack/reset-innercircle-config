export default async (request) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD', 'cache-control': 'no-store' } });
  }
  const supportUrl = process.env.RESET_STRIPE_SUPPORT_URL || '';
  if (!supportUrl || !/^https:\/\/(buy|checkout)\.stripe\.com\//i.test(supportUrl)) {
    const body = request.method === 'HEAD' ? null : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Support Reset Society</title><style>body{background:#08090b;color:#f4efe4;font-family:Arial;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:600px;padding:40px;text-align:center}h1{font-family:Georgia,serif;font-size:48px;font-weight:400;color:#e4c875}a{color:#c8a24a}</style></head><body><main><h1>Support is being connected.</h1><p>Thank you for helping keep Reset Society available. Secure Stripe support checkout is not active yet.</p><p><a href="/">Return to Reset Inner Circle</a></p></main></body></html>`;
    return new Response(body, { status: 503, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  return new Response(null, { status: 302, headers: { location: supportUrl, 'cache-control': 'no-store' } });
};
