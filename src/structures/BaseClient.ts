import { BitField, Client, type If, PermissionsBitField, type PermissionsString } from 'discord.js';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { Collection } from '@discordjs/collection';
import type { Command } from './Command.js';
import type { Event } from './Event.js';
import Util from './Util.js';
import semver from 'semver';

export default class BaseClient<Ready extends boolean = boolean> extends Client<Ready> {
	public commands: Collection<string, Command>;
	public aliases: Collection<string, string>;
	public events: Collection<string, Event>;

	public utils: Util;

	declare public token: If<Ready, string, string | null>;
	public debug: boolean | undefined;
	public owners: string[] | undefined;
	public defaultPermissions: Readonly<BitField<any, any>> | undefined;

	public constructor(options: ClientOptions) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			}
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();

		this.utils = new Util(this);
	}

	private validate(options: ClientOptions) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (semver.lt(process.versions.node, '16.9.0')) throw new Error('This client requires Node.JS v16.9.0 or higher.');
		this.debug = options.debug;

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.owners.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		if (!Array.isArray(options.defaultPermissions)) throw new TypeError('Permission(s) should be a type of Array<String>.');
		this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();
	}

	public start(token = this.token) {
		void this.utils.loadCommands();
		void this.utils.loadEvents();
		void super.login(token!);
	}
}

interface ClientOptions {
	token: any;
	owners: string[];
	debug: boolean;
	defaultPermissions: PermissionsString[];
}
