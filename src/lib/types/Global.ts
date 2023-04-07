import type BaseClient from '../BaseClient.js';
import type { PermissionsString } from 'discord.js';
import type { EventEmitter } from 'node:events';

export interface ClientOptions {
	token: any;
	version: string;
	owners: string[];
	debug: boolean;
	defaultPermissions: PermissionsString[];
}

export interface InteractionCommandOptions {
	name: string;
	description?: string;
	memberPermissions?: PermissionsString[];
	clientPermissions?: PermissionsString[];
	disabled?: boolean;
	context?: boolean;
	guildOnly?: boolean;
	ownerOnly?: boolean;
}

export interface EventOptions {
	name: string;
	once?: boolean;
	emitter?: keyof BaseClient | EventEmitter;
}
