import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'uncaughtException',
			once: false,
			emitter: process
		});
	}

	public run(error: Error) {
		console.error(`${error.name}: ${error.message}`);
	}
}
