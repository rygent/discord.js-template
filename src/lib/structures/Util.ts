import type BaseClient from '#lib/BaseClient.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globby } from 'globby';
import Command from '#lib/structures/Command.js';
import Event from '#lib/structures/Event.js';
import path from 'node:path';

export default class Util {
	public client: BaseClient<true>;

	public constructor(client: BaseClient) {
		this.client = client;
	}

	private isClass(input: unknown): boolean {
		return (
			typeof input === 'function' && typeof input.prototype === 'object' && input.toString().slice(0, 5) === 'class'
		);
	}

	private get directory(): string {
		const main = fileURLToPath(new URL('../../index.js', import.meta.url));
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');
	}

	public async loadCommands(): Promise<void> {
		return globby(`${this.directory}commands/**/*.js`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const { default: File } = await import(pathToFileURL(commandFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				this.client.commands.set(command.name, command);
			}
		});
	}

	public async loadEvents(): Promise<void> {
		return globby(`${this.directory}events/**/*.js`).then(async (events: string[]) => {
			for (const eventFile of events) {
				const { name } = path.parse(eventFile);
				const { default: File } = await import(pathToFileURL(eventFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args: unknown[]) => event.run(...args));
			}
		});
	}
}
