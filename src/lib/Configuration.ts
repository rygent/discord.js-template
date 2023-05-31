import type { PermissionsString } from 'discord.js';
import project from '../../package.json' assert { type: 'json' };

export const token = process.env.DISCORD_TOKEN as string;
export const version = (process.env.CLIENT_VERSION ??= project.version);
export const owners = process.env.CLIENT_OWNERS?.split(',').filter((item) => item.length) as string[];
export const debug = process.env.DEBUG_MODE === 'true';
export const defaultPermissions = ['SendMessages', 'ViewChannel'] as PermissionsString[];
