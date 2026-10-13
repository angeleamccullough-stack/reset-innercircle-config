import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const page=read('site/helpstudio.html'),error=read('site/404.html'),config=read('netlify.toml');

test('exact Help path serves real content and does not mask other 404s or payment functions',()=>{
 assert.match(config,/from = "\/helpstudio"\s+to = "\/helpstudio.html"\s+status = 200/);
 assert.match(config,/from = "\/help"\s+to = "\/helpstudio"\s+status = 302/);
 assert.doesNotMatch(config,/from = "\/\*"[\s\S]*?status = 200/);
 for(const path of ['/support','/checkout/studio','/checkout/events','/api/intelligence','/booking','/membership'])assert.ok(config.includes('from = "'+path+'"'),path);
 assert.match(error,/name="robots" content="noindex,follow"/);
 assert.match(error,/href="\/helpstudio"/);
});

test('public guide distinguishes Discord command, web route, account access and factual readiness',()=>{
 assert.match(page,/inside Discord/);
 assert.match(page,/Opening the room does not run the command or send a message/);
 assert.match(page,/cannot hear your speakers/);
 assert.match(page,/does not read your account/);
 assert.match(page,/https:\/\/discord.gg\/DWyT4vskVW/);
 assert.match(page,/https:\/\/discord.com\/channels\/1429398855681573038\/1431964592421998684/);
 assert.match(page,/https:\/\/creators.rmsglobalpublishing.com\/creator\/assistance/);
 assert.match(page,/https:\/\/creators.rmsglobalpublishing.com\/creator\/support/);
 assert.match(page,/Preview scene with music - free/);
 assert.doesNotMatch(page,/<(?:iframe|audio|video|form)\b|href="\/(?:checkout|support)(?:["/?#])|sessionStorage|localStorage|onclick=/);
 assert.doesNotMatch(read('site/helpstudio.js'),/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie/);
});

test('all local Help links and assets resolve without trusting arbitrary query input',()=>{
 for(const html of [page,error])for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(url.startsWith('#')){assert.ok(page.includes('id="'+url.slice(1)+'"'));continue;}
  if(!url.startsWith('/'))continue;
  const pathname=url.split(/[?#]/)[0];
  const actual=pathname==='/'?'index.html':pathname==='/helpstudio'?'helpstudio.html':pathname==='/booking'?'booking.html':pathname.slice(1);
  assert.ok(existsSync(new URL('../site/'+actual,import.meta.url)),url);
 }
 assert.match(read('site/index.html'),/href="\/helpstudio"/);
 assert.match(read('site/booking.html'),/href="\/helpstudio"/);
 assert.match(read('site/sitemap.xml'),/<loc>https:\/\/resetinnercircle.com\/helpstudio<\/loc>/);
 for(const html of [page,error])assert.match(html,/Angelea McCullough, Founder of RMS Global Publishing/);
});
