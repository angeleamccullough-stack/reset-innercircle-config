import { SlashCommandBuilder } from 'discord.js';
import { randomUUID } from 'node:crypto';

export const commandBuilders = [
  new SlashCommandBuilder().setName('portal').setDescription('Open RMS CreatorHub and creator onboarding.'),
  new SlashCommandBuilder().setName('submit').setDescription('Open the secure RMS submission pathway.'),
  new SlashCommandBuilder().setName('marketplace').setDescription('Open the RMS Marketplace.'),
  new SlashCommandBuilder().setName('sync').setDescription('View RMS licensing-readiness and sync guidance.'),
  new SlashCommandBuilder().setName('rights').setDescription('View RMS Rights & Metadata Intelligence guidance.'),
  new SlashCommandBuilder().setName('events').setDescription('View current RESET LIVE programming.'),
  new SlashCommandBuilder().setName('missions').setDescription('View current Platform Missions.'),
  new SlashCommandBuilder().setName('leadership').setDescription('View the RESET leadership pathway and expectations.'),
  new SlashCommandBuilder().setName('safety').setDescription('View RESET cross-platform engagement safety standards.'),
  new SlashCommandBuilder().setName('studio').setDescription('Open the RESET Virtual Studio and Main Arena production path.'),
  new SlashCommandBuilder().setName('stage').setDescription('Open Claim Your Stage for cleared multidisciplinary creators.'),
  new SlashCommandBuilder().setName('game').setDescription('Open the RESET Game Room.'),
  new SlashCommandBuilder().setName('startsession').setDescription('Create an RMS Studio session reference.'),
  new SlashCommandBuilder().setName('savesession').setDescription('View the RMS Studio version and filename standard.'),
  new SlashCommandBuilder().setName('exportstems').setDescription('View the RMS stem-export checklist.'),
  new SlashCommandBuilder().setName('requestmix').setDescription('Open the RESET Studio mix/master service path.'),
  new SlashCommandBuilder().setName('support').setDescription('Open the private RMS support route.'),
];

export const commandData = commandBuilders.map((command) => command.toJSON());

function env(name, fallback = '') {
  return process.env[name] || fallback;
}

const creatorHubUrl = () => env('CREATORHUB_URL', 'https://creators.rmsglobalpublishing.com/');
const marketplaceUrl = () => env('RMS_MARKETPLACE_URL', `${creatorHubUrl().replace(/\/$/, '')}/marketplace`);
const resetUrl = () => env('RESET_INNER_CIRCLE_URL', 'https://resetinnercircle.com/');
const networkUrl = () => `${resetUrl().replace(/\/$/, '')}/#network`;
const studioUrl = () => `${resetUrl().replace(/\/$/, '')}/#studio`;
const mainArenaUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370096';
const claimStageUrl = 'https://discord.com/channels/1429398855681573038/1468103128279941272';
const claimStageInvite = 'https://discord.gg/YsxvcQBBqH';
const gameRoomUrl = 'https://discord.com/channels/1429398855681573038/1429398859020370100';

const footer = 'RMS Global Publishing · RESET Inner Circle · Ownership First';

const baseEmbed = (title, description) => ({
  color: 0xC8A24A,
  title,
  description,
  footer: { text: footer },
});

const makeSessionId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `RST-${date}-${rand}`;
};

export function buildCommandResponse(commandName) {
  switch (commandName) {
    case 'portal':
      return { ephemeral: false, embeds: [baseEmbed('RMS CreatorHub™', `Enter the ownership-first creator infrastructure for onboarding, submissions, rights preparation, licensing readiness, marketplace activity, and professional creator tools.\n\n**CreatorHub:** ${creatorHubUrl()}\n**Reset Inner Circle:** ${resetUrl()}`)] };
    case 'submit':
      return { ephemeral: true, embeds: [baseEmbed('Secure Submission Path', `Use CreatorHub™ for official submissions and private creator records.\n\n${creatorHubUrl()}\n\n**Do not upload unreleased masters, contracts, rights splits, passwords, banking information, or confidential metadata into Discord.**`)] };
    case 'marketplace':
      return { ephemeral: false, embeds: [baseEmbed('RMS Marketplace', `Explore approved public creator offerings and marketplace activity.\n\n${marketplaceUrl()}`)] };
    case 'sync':
      return { ephemeral: false, embeds: [baseEmbed('Licensing Readiness', `Prepare ownership, metadata, versions, clearances, and delivery assets through RMS CreatorHub™. Licensing readiness does not guarantee placement.\n\n${creatorHubUrl()}`)] };
    case 'rights':
      return { ephemeral: false, embeds: [baseEmbed('Rights & Metadata Intelligence', `Use CreatorHub™ to prepare and maintain authoritative ownership and metadata records. Keep confidential rights information out of public Discord channels.\n\n${creatorHubUrl()}`)] };
    case 'events': {
      const channelId = env('EVENTS_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'the RESET LIVE event calendar';
      return { ephemeral: false, embeds: [baseEmbed('RESET LIVE', `See upcoming live programming, Power Hours, Arena activity, creator education, collaboration sessions, and community events in ${route}.`)] };
    }
    case 'missions': {
      const channelId = env('MISSIONS_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'Platform Missions';
      return { ephemeral: false, embeds: [baseEmbed('Platform Missions', `Find current cross-platform creator activations in ${route}. Participation must remain authentic and platform-safe. No forced reciprocity, scripted comments, artificial views, or engagement loops.`)] };
    }
    case 'leadership':
      return { ephemeral: false, embeds: [baseEmbed('RESET Leadership Pathway', `**Entry → Activation → Contribution → Visibility → Advancement**\n\nLeadership seats are voluntary community roles, not paid employment or contract labor. Leaders model healthy participation, protect dignity and privacy, support creator collaboration, and follow platform-safe engagement standards.\n\n**Code of Honor:** protect dignity · respect ownership · choose truth over hype · keep private things private · elevate the room.\n\n${networkUrl()}`)] };
    case 'safety':
      return { ephemeral: false, embeds: [baseEmbed('RESET Cross-Platform Safety', `RESET never requires or rewards actions that violate platform policies. Automation may route, remind, organize, and recognize. It does not impersonate members or manufacture engagement.\n\n**Facebook:** no mass tagging, repetitive comments, or forced reciprocity.\n**Instagram:** no rapid-fire automation or duplicate flooding.\n**TikTok:** no follow/unfollow cycles or artificial engagement.\n**YouTube:** no scripted comments, artificial views, or watch-time loops.\n**Twitch:** safe moderation, no automated spam, and proper music rights.\n\n${networkUrl()}`)] };
    case 'studio':
      return { ephemeral: false, embeds: [baseEmbed('RESET Virtual Studio™', `The flagship RESET creative-room blueprint is multipurpose, not music-only. Use it for interviews, podcasts, performances, education, gaming, storytelling, visual sharing, live production and collaboration.\n\n**Studio:** ${studioUrl()}\n**Main Arena:** ${mainArenaUrl}\n\nProduction path: **Create → Wave Link → OBS → Discord / Live / Record**.`)] };
    case 'stage':
      return { ephemeral: false, embeds: [baseEmbed('Claim Your Stage', `Available to cleared members with a creative spark. This room is for musicians **and** podcasters, educators, visual creators, storytellers, spoken-word artists, gamers, interviewers, presenters and collaborative experiments.\n\n**Room:** ${claimStageUrl}\n**Invite:** ${claimStageInvite}\n\nRecording is off unless the session clearly announces otherwise.`)] };
    case 'game':
      return { ephemeral: false, embeds: [baseEmbed('RESET Game Room', `Use the Game Room for community play, low-latency conversation, creator gaming sessions and game-stream collaboration.\n\n${gameRoomUrl}`)] };
    case 'startsession': {
      const sessionId = makeSessionId();
      return { ephemeral: true, embeds: [baseEmbed('RMS Studio Session', `**Session reference:** \`${sessionId}\`\n\nUse this reference in filenames, notes and service requests. This creates a tracking reference only; it does not upload your DAW project or stems automatically.\n\n**Studio:** ${studioUrl()}`)] };
    }
    case 'savesession':
      return { ephemeral: true, embeds: [baseEmbed('RMS Version Standard', `Save your working version in the DAW, then label exports consistently.\n\n**Recommended:** \`RMS-[SESSION]-[CREATOR]-[TITLE]-[VERSION]-[ASSETTYPE]-YYYYMMDD.ext\`\n\nThis command does not claim to save third-party DAW files for you.`)] };
    case 'exportstems':
      return { ephemeral: true, embeds: [baseEmbed('RMS Stem Export Checklist', `Export from a common start point where practical. Keep sample rate and bit depth consistent. Name each stem clearly. Include instrumental, vocal, FX and alternate versions only when they are part of the agreed delivery scope.\n\nDo not post confidential or unreleased source files in public Discord channels.`)] };
    case 'requestmix':
      return { ephemeral: true, embeds: [baseEmbed('RESET Studio Mix / Master', `Open the Studio menu for current starting rates and the secure service path. Project complexity, revision scope and delivery requirements are confirmed before work begins.\n\n${studioUrl()}`)] };
    case 'support': {
      const channelId = env('SUPPORT_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'the private RMS support pathway';
      return { ephemeral: true, embeds: [baseEmbed('RMS Support', `Use ${route} for CreatorHub access, events, collaboration concerns, marketplace support, rights and metadata questions, technical issues, privacy concerns, or partnership inquiries.\n\nNever post passwords, banking details, government ID, contracts, unreleased masters, or confidential CreatorHub data publicly.`)] };
    }
    default:
      return { ephemeral: true, content: 'That RMS command is not available.' };
  }
}
