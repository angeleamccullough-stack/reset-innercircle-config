import { SlashCommandBuilder } from 'discord.js';

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
  new SlashCommandBuilder().setName('support').setDescription('Open the private RMS support route.'),
];

export const commandData = commandBuilders.map((command) => command.toJSON());

function env(name, fallback = '') {
  return process.env[name] || fallback;
}

const creatorHubUrl = () => env('CREATORHUB_URL', 'https://rms-creator-portal.vercel.app/');
const marketplaceUrl = () => env('RMS_MARKETPLACE_URL', `${creatorHubUrl().replace(/\/$/, '')}/marketplace`);
const resetUrl = () => env('RESET_INNER_CIRCLE_URL', 'https://resetinnercircle.com/');
const networkUrl = () => `${resetUrl().replace(/\/$/, '')}/#network`;

const footer = 'RMS Global Publishing · RESET Inner Circle · Ownership First';

const baseEmbed = (title, description) => ({
  color: 0xC8A24A,
  title,
  description,
  footer: { text: footer },
});

export function buildCommandResponse(commandName) {
  switch (commandName) {
    case 'portal':
      return {
        ephemeral: false,
        embeds: [baseEmbed(
          'RMS CreatorHub™',
          `Enter the ownership-first creator infrastructure for onboarding, submissions, rights preparation, licensing readiness, marketplace activity, and professional creator tools.\n\n**CreatorHub:** ${creatorHubUrl()}\n**Reset Inner Circle:** ${resetUrl()}`,
        )],
      };
    case 'submit':
      return {
        ephemeral: true,
        embeds: [baseEmbed(
          'Secure Submission Path',
          `Use CreatorHub™ for official submissions and private creator records.\n\n${creatorHubUrl()}\n\n**Do not upload unreleased masters, contracts, rights splits, passwords, banking information, or confidential metadata into Discord.**`,
        )],
      };
    case 'marketplace':
      return {
        ephemeral: false,
        embeds: [baseEmbed('RMS Marketplace', `Explore approved public creator offerings and marketplace activity.\n\n${marketplaceUrl()}`)],
      };
    case 'sync':
      return {
        ephemeral: false,
        embeds: [baseEmbed(
          'Licensing Readiness',
          `Prepare ownership, metadata, versions, clearances, and delivery assets through RMS CreatorHub™. Licensing readiness does not guarantee placement.\n\n${creatorHubUrl()}`,
        )],
      };
    case 'rights':
      return {
        ephemeral: false,
        embeds: [baseEmbed(
          'Rights & Metadata Intelligence',
          `Use CreatorHub™ to prepare and maintain authoritative ownership and metadata records. Keep confidential rights information out of public Discord channels.\n\n${creatorHubUrl()}`,
        )],
      };
    case 'events': {
      const channelId = env('EVENTS_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'the RESET LIVE event calendar';
      return {
        ephemeral: false,
        embeds: [baseEmbed('RESET LIVE', `See upcoming live programming, Power Hours, Arena activity, creator education, collaboration sessions, and community events in ${route}.`)],
      };
    }
    case 'missions': {
      const channelId = env('MISSIONS_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'Platform Missions';
      return {
        ephemeral: false,
        embeds: [baseEmbed('Platform Missions', `Find current cross-platform creator activations in ${route}. Participation must remain authentic and platform-safe. No forced reciprocity, scripted comments, artificial views, or engagement loops.`)],
      };
    }
    case 'leadership':
      return {
        ephemeral: false,
        embeds: [baseEmbed(
          'RESET Leadership Pathway',
          `**Entry → Activation → Contribution → Visibility → Advancement**\n\nLeadership seats are voluntary community roles, not paid employment or contract labor. Leaders model healthy participation, protect dignity and privacy, support creator collaboration, and follow platform-safe engagement standards.\n\n**Code of Honor:** protect dignity · respect ownership · choose truth over hype · keep private things private · elevate the room.\n\n${networkUrl()}`,
        )],
      };
    case 'safety':
      return {
        ephemeral: false,
        embeds: [baseEmbed(
          'RESET Cross-Platform Safety',
          `RESET never requires or rewards actions that violate platform policies. Automation may route, remind, organize, and recognize. It does not impersonate members or manufacture engagement.\n\n**Facebook:** no mass tagging, repetitive comments, or forced reciprocity.\n**Instagram:** no rapid-fire automation or duplicate flooding.\n**TikTok:** no follow/unfollow cycles or artificial engagement.\n**YouTube:** no scripted comments, artificial views, or watch-time loops.\n**Twitch:** safe moderation, no automated spam, and proper music rights.\n\nPlatform systems can change, so RESET does not promise “shadowban-proof” outcomes.\n\n${networkUrl()}`,
        )],
      };
    case 'support': {
      const channelId = env('SUPPORT_CHANNEL_ID');
      const route = channelId ? `<#${channelId}>` : 'the private RMS support pathway';
      return {
        ephemeral: true,
        embeds: [baseEmbed(
          'RMS Support',
          `Use ${route} for CreatorHub access, events, collaboration concerns, marketplace support, rights and metadata questions, technical issues, privacy concerns, or partnership inquiries.\n\nNever post passwords, banking details, government ID, contracts, unreleased masters, or confidential CreatorHub data publicly.`,
        )],
      };
    }
    default:
      return { ephemeral: true, content: 'That RMS command is not available.' };
  }
}
