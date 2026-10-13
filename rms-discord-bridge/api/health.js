import {assistanceGateway} from '../src/assistance.js';
let cached=null,pending=null;
async function assistanceHealth(){
 if(cached&&Date.now()-cached.at<45000)return cached.value;
 if(!pending)pending=(async()=>{let value;try{const r=await assistanceGateway({action:'health',guild:process.env.DISCORD_GUILD_ID},AbortSignal.timeout(1800));value={backendReady:r.ok===true&&r.policy_enabled===true,version:r.version||'1.0.0',checkedAt:new Date().toISOString()};}catch{value={backendReady:false,version:'1.0.0',checkedAt:new Date().toISOString()};}cached={at:Date.now(),value};return value;})().finally(()=>{pending=null;});
 return pending;
}
export default async function handler(_req,res){
 const health=await assistanceHealth();res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
 res.end(JSON.stringify({ok:true,service:'RMS CreatorHub Discord Bridge',runtime:'vercel',assistance:{...health,entry:'/api/interactions',requestedControls:true,unsolicited:'shadow',messageContentListener:false,audienceAudioMeasured:false}}));
}
