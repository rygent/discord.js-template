import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	public run(error: Error) {
		if (error.name === 'DiscordAPIError[10062]') return;
		console.error(`${error.name}: ${error.message}`);
	}
}
