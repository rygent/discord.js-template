import type BaseClient from '../../structures/BaseClient.js';
import { Event } from '../../structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'error',
			once: false
		});
	}

	public run(error: Error) {
		console.error(`${error.name}: ${error.message}`);
	}
}
