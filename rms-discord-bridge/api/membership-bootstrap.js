import { REST, Routes } from 'discord.js';
import { bootstrapMembershipRoles, controlledMembershipRoleProof } from '../src/membership.js';
import { commandData } from '../src/commands.js';

function send(res,status,payload){res.statusCode=status;res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.end(JSON.stringify(payload));}

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
  const supplied=req.headers['x-rms-membership-secret']||'';
  if(!supplied || supplied!==process.env.RMS_MEMBERSHIP_SIGNING_SECRET) return send(res,401,{error:'Unauthorized'});
  try{
    const roles=await bootstrapMembershipRoles();
    const proof=await controlledMembershipRoleProof(roles);
    const commandsRegistered=await registerCommands();
    return send(res,200,{ok:true,roles,proof,commandsRegistered});
  }catch(error){
    console.error('Membership bootstrap failed:',error?.message||error);
    return send(res,500,{ok:false,error:error?.message||'Membership bootstrap failed'});
  }
}
