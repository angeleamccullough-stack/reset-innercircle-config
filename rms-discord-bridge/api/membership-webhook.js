import { normalizeMembershipStripeEvent, recordMembershipEvent, reconcileDiscordMembership, verifyStripeSignature } from '../src/membership.js';

async function rawBody(req){const chunks=[];for await(const chunk of req)chunks.push(chunk);return Buffer.concat(chunks).toString('utf8');}
function send(res,status,payload){res.statusCode=status;res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.end(JSON.stringify(payload));}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('allow','POST');return send(res,405,{error:'Method not allowed'});}
  const body=await rawBody(req);
  if(!verifyStripeSignature(body,req.headers['stripe-signature']||'')) return send(res,400,{error:'Invalid Stripe signature'});
  let event; try{event=JSON.parse(body);}catch{return send(res,400,{error:'Invalid JSON'});}
  const normalized=normalizeMembershipStripeEvent(event);
  if(!normalized) return send(res,200,{received:true,ignored:true,type:event?.type||null});
  try{
    const result=await recordMembershipEvent(normalized);
    if(result?.duplicate || result?.stale || result?.pending_binding) return send(res,200,{received:true,...result});
    const role=await reconcileDiscordMembership(result.discord_user_id,result.desired_role_tier);
    return send(res,200,{received:true,eventId:event.id,action:result.action,role});
  }catch(error){
    console.error('Membership webhook failed:',error?.message||error);
    return send(res,500,{error:'Membership fulfillment failed'});
  }
}
