import { bootstrapMembershipRoles, controlledMembershipRoleProof } from '../src/membership.js';

function send(res,status,payload){res.statusCode=status;res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.end(JSON.stringify(payload));}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('allow','POST');return send(res,405,{error:'Method not allowed'});}
  const supplied=req.headers['x-rms-membership-secret']||'';
  if(!supplied || supplied!==process.env.RMS_MEMBERSHIP_SIGNING_SECRET) return send(res,401,{error:'Unauthorized'});
  try{
    const roles=await bootstrapMembershipRoles();
    const proof=await controlledMembershipRoleProof(roles);
    return send(res,200,{ok:true,roles,proof});
  }catch(error){
    console.error('Membership bootstrap failed:',error?.message||error);
    return send(res,500,{ok:false,error:error?.message||'Membership bootstrap failed'});
  }
}
