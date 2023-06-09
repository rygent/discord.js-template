import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Command.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'ping',
			description: 'Send a ping request.'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const replies = [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``
		].join('\n');

		return interaction.reply({ content: replies });
	}
}
