import type BaseClient from '#lib/BaseClient.js';
import {
	AutocompleteInteraction,
	BitField,
	CommandInteraction,
	PermissionsBitField,
	type PermissionsString
} from 'discord.js';
import type { Awaitable } from '@discordjs/util';

export default abstract class Command {
	public client: BaseClient<true>;
	public readonly name: string;
	public readonly description: string;
	public readonly memberPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public readonly clientPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public readonly disabled: boolean;
	public readonly context: boolean;
	public readonly guildOnly: boolean;
	public readonly ownerOnly: boolean;

	// eslint-disable-next-line no-undef
	public constructor(client: BaseClient, options: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description ?? 'No description provided';
		this.memberPermissions = new PermissionsBitField(options.memberPermissions).freeze();
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.disabled = options.disabled ?? false;
		this.context = options.context ?? false;
		this.guildOnly = options.guildOnly ?? false;
		this.ownerOnly = options.ownerOnly ?? false;
	}

	public abstract execute(interaction: CommandInteraction<'cached' | 'raw'>): Awaitable<unknown>;

	// @ts-expect-error
	public autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>): Awaitable<unknown> {
		throw new Error(`${this.name} doesn't provide a autocomplete method!`);
	}
}
