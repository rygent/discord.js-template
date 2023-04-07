import type BaseClient from '../BaseClient.js';
import type { EventOptions } from '../types/Global.js';
import type { Awaitable } from '@sapphire/utilities';
import type { EventEmitter } from 'node:events';

export default abstract class Event {
	public client: BaseClient<true>;
	public name: string;
	public type: 'once' | 'on';
	public emitter: EventEmitter;

	public constructor(client: BaseClient, options: EventOptions) {
		this.client = client;
		this.name = options.name;
		this.type = options.once ? 'once' : 'on';
		this.emitter =
			(typeof options.emitter === 'string'
				? (Reflect.get(this.client, options.emitter) as EventEmitter)
				: options.emitter) ?? this.client;
	}

	public abstract run(...args: unknown[]): Awaitable<unknown>;
}
