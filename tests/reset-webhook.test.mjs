import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import handler,{verifyStripeSignature} from '../netlify/functions/stripe-communications-webhook.mjs';
const secret='test-only-secret';
function signature(body,t){return `t=${t},v1=${createHmac('sha256',secret).update(`${t}.${body}`).digest('hex')}`;}
test('signature accepts current raw body and rejects replay, future, malformed and tampering',()=>{
 const body='{"id":"evt_test"}',t=1000000;
 assert.equal(verifyStripeSignature(body,signature(body,t),secret,t),true);
 for(const time of [t-301,t+301])assert.equal(verifyStripeSignature(body,signature(body,time),secret,t),false);
 assert.equal(verifyStripeSignature(body+' ',signature(body,t),secret,t),false);
 assert.equal(verifyStripeSignature(body,'t=no,v1=bad',secret,t),false);
});
test('paid delayed event reaches ingress; unpaid, unrecognized and malformed events do not',async()=>{
 Object.assign(process.env,{RESET_STRIPE_COMMUNICATIONS_WEBHOOK_SECRET:secret,RESET_CREATORHUB_COMMUNICATIONS_INGRESS_SECRET:'test-only-ingress',RMS_CREATORHUB_SUPABASE_URL:'https://example.invalid',RMS_CREATORHUB_SUPABASE_PUBLISHABLE_KEY:'test-only-publishable'});
 const original=globalThis.fetch;let calls=[];
 globalThis.fetch=async(url,init)=>{calls.push(JSON.parse(init.body));return Response.json('test-ingress-id');};
 async function send(type,payment_status='paid',payment_link='plink_1UG8HHLlKcswOpj9aJJoRmGd',id='evt_test'){
  const body=JSON.stringify({id,type,data:{object:{id:'cs_test',object:'checkout.session',payment_status,payment_link,amount_total:100,currency:'usd'}}});
  return handler(new Request('https://example.invalid/webhook',{method:'POST',headers:{'stripe-signature':signature(body,Math.floor(Date.now()/1000))},body}));
 }
 try{
  assert.equal((await send('checkout.session.async_payment_succeeded')).status,200);assert.equal(calls.length,1);
  assert.equal(calls[0].p_event_type,'checkout.session.async_payment_succeeded');
  await send('checkout.session.completed','unpaid');await send('customer.subscription.updated');await send('checkout.session.completed','paid','plink_other');
  assert.equal((await send('checkout.session.completed','paid',undefined,null)).status,400);
  assert.equal(calls.length,1);
 }finally{globalThis.fetch=original;}
});
