import type BaseClient from '#lib/BaseClient.js';
import type { PermissionsString } from 'discord.js';
import type { EventEmitter } from 'node:events';

declare global {
	interface ClientOptions {
		token: any;
		version: string;
		owners: string[];
		debug: boolean;
		defaultPermissions: PermissionsString[];
	}

	interface CommandOptions {
		name: string;
		description?: string;
		memberPermissions?: PermissionsString[];
		clientPermissions?: PermissionsString[];
		disabled?: boolean;
		context?: boolean;
		guildOnly?: boolean;
		ownerOnly?: boolean;
	}

	interface EventOptions {
		name: string;
		once?: boolean;
		emitter?: keyof BaseClient | EventEmitter;
	}
}
