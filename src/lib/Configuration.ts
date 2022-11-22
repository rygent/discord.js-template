import type { PermissionsString } from 'discord.js';

export const token = process.env.DISCORD_TOKEN!;
export const owners = process.env.CLIENT_OWNERS!.split(',').filter(item => item.length);
export const debug = JSON.parse(process.env.DEBUG_MODE ?? 'false') as boolean;
export const defaultPermissions = ['SendMessages', 'ViewChannel'] as PermissionsString[];
