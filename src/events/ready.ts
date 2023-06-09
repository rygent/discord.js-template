import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';
import { redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'ready',
			once: true
		});
	}

	public run() {
		console.log(`Logged in as ${redBright(underline(`${this.client.user.tag}`))}`);
		console.log(`Loaded ${this.client.commands.size} commands & ${this.client.events.size} events!`);
	}
}
