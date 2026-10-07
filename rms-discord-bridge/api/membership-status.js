import { REST, Routes, PermissionsBitField } from 'discord.js';

function send(res,status,payload){res.statusCode=status;res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.end(JSON.stringify(payload));}

export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('allow','GET');return send(res,405,{error:'Method not allowed'});}
  try{
    const token=process.env.DISCORD_TOKEN||'';
    const clientId=process.env.DISCORD_CLIENT_ID||'';
    const guildId=process.env.DISCORD_GUILD_ID||'';
    if(!token||!clientId||!guildId) throw new Error('Discord bridge is not configured.');
    const rest=new REST({version:'10'}).setToken(token);
    const [commands,roles,member]=await Promise.all([
      rest.get(Routes.applicationGuildCommands(clientId,guildId)),
      rest.get(Routes.guildRoles(guildId)),
      rest.get(Routes.guildMember(guildId,clientId))
    ]);
    let bits=0n;
    const roleSet=new Set(member.roles||[]);
    for(const role of roles){
      if(roleSet.has(role.id)) bits |= BigInt(role.permissions||'0');
    }
    const perms=new PermissionsBitField(bits);
    const paidNames=['RMS Member','RMS Pro','RMS Executive'];
    const paidRoles=Object.fromEntries(paidNames.map(name=>[name,roles.some(role=>role.name===name)]));
    return send(res,200,{
      ok:true,
      membershipCommandRegistered:commands.some(command=>command.name==='membership'),
      manageRoles:perms.has(PermissionsBitField.Flags.ManageRoles),
      administrator:perms.has(PermissionsBitField.Flags.Administrator),
      paidRoles,
      lifecycleWebhookConfigured:Boolean(process.env.RMS_MEMBERSHIP_STRIPE_WEBHOOK_SECRET),
      creatorHubIngressConfigured:Boolean(process.env.RMS_CREATORHUB_SUPABASE_URL&&process.env.RMS_CREATORHUB_SUPABASE_PUBLISHABLE_KEY),
      checkoutSigningConfigured:Boolean(process.env.RMS_MEMBERSHIP_SIGNING_SECRET),
      publicCheckoutEnabled:process.env.RMS_MEMBERSHIP_PUBLIC_ENABLED==='true'
    });
  }catch(error){
    console.error('Membership status failed:',error?.message||error);
    return send(res,500,{ok:false,error:'Membership status unavailable'});
  }
}
