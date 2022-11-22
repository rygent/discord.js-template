import type BaseClient from '../../structures/BaseClient.js';
import { Event } from '../../structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'debug',
			once: false
		});
	}

	public run(info: string) {
		if (!this.client.debug) return;
		console.log(info);
	}
}
