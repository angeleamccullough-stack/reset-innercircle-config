import { REST, Routes } from 'discord.js';
import { bootstrapMembershipRoles, controlledMembershipRoleProof } from '../src/membership.js';
import { commandData } from '../src/commands.js';

function send(res,status,payload){res.statusCode=status;res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.end(JSON.stringify(payload));}

async function consumeGate(){
  const supabaseUrl=(process.env.RMS_CREATORHUB_SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.RMS_CREATORHUB_SUPABASE_PUBLISHABLE_KEY||'';
  const secret=process.env.RMS_MEMBERSHIP_SIGNING_SECRET||'';
  if(!supabaseUrl||!key||!secret) throw new Error('Membership bootstrap gate is not configured.');
  const r=await fetch(`${supabaseUrl}/rest/v1/rpc/rms_membership_consume_bootstrap_gate`,{
    method:'POST',headers:{apikey:key,'content-type':'application/json',accept:'application/json'},
    body:JSON.stringify({p_secret:secret})
  });
  if(!r.ok) throw new Error(`Membership bootstrap gate failed: ${r.status}`);
  return Boolean(await r.json());
}

async function registerCommands(){
  const token=process.env.DISCORD_TOKEN||'';
  const clientId=process.env.DISCORD_CLIENT_ID||'';
  const guildId=process.env.DISCORD_GUILD_ID||'';
  if(!token||!clientId||!guildId) throw new Error('Discord command registration is not configured.');
  const rest=new REST({version:'10'}).setToken(token);
  const result=await rest.put(Routes.applicationGuildCommands(clientId,guildId),{body:commandData});
  return result.length;
}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('allow','POST');return send(res,405,{error:'Method not allowed'});}
  try{
    if(!(await consumeGate())) return send(res,403,{error:'Bootstrap gate is closed'});
    const commandsRegistered=await registerCommands();
    const roles=await bootstrapMembershipRoles();
    const proof=await controlledMembershipRoleProof(roles);
    return send(res,200,{ok:true,roles,proof,commandsRegistered});
  }catch(error){
    console.error('Membership bootstrap failed:',error?.message||error);
    return send(res,500,{ok:false,error:error?.message||'Membership bootstrap failed'});
  }
}
