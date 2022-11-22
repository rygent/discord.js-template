import type BaseClient from './BaseClient.js';
import { BitField, CommandInteraction, PermissionsBitField, PermissionsString } from 'discord.js';
import type { Awaitable } from '@sapphire/utilities';

export abstract class Command {
	public client: BaseClient<true>;
	public name: string[];
	public description: string;
	public memberPermissions: Readonly<BitField<any, any>>;
	public clientPermissions: Readonly<BitField<any, any>>;
	public disabled: boolean;
	public guildOnly: boolean;
	public ownerOnly: boolean;

	public constructor(client: BaseClient, options: InteractionCommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description ?? 'No description provided';
		this.memberPermissions = new PermissionsBitField(options.memberPermissions).freeze();
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.disabled = options.disabled ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.ownerOnly = options.ownerOnly ?? false;
	}

	public abstract execute(interaction: CommandInteraction): Awaitable<unknown>;
}

interface InteractionCommandOptions {
	name: string[];
	description?: string;
	memberPermissions?: PermissionsString[];
	clientPermissions?: PermissionsString[];
	disabled?: boolean;
	guildOnly?: boolean;
	ownerOnly?: boolean;
}
