import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';
import type { DiscordAPIError } from '@discordjs/rest';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { formatArray, formatPermissions, resolveCommandName } from '#lib/utils/Function.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'interactionCreate',
			once: false
		});
	}

	public async run(interaction: CommandInteraction<'cached' | 'raw'>) {
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

		const command = this.client.commands.get(resolveCommandName(interaction));
		if (command) {
			if (command.disabled && !this.client.owners?.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is currently inaccessible.', ephemeral: true });
			}

			if (command.guildOnly && !interaction.inCachedGuild()) {
				return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
			}

			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPermissions
					? this.client.defaultPermissions?.add(command.memberPermissions)
					: this.client.defaultPermissions;

				if (memberPermCheck) {
					const missing = interaction.channel
						?.permissionsFor(interaction.member as GuildMember)
						?.missing(memberPermCheck) as string[];

					if (missing.length) {
						const replies = `You lack the ${formatArray(
							missing.map((item) => `***${formatPermissions(item)}***`)
						)} permission(s) to continue.`;

						return interaction.reply({ content: replies, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPermissions
					? this.client.defaultPermissions?.add(command.clientPermissions)
					: this.client.defaultPermissions;

				if (clientPermCheck) {
					const missing = interaction.channel
						?.permissionsFor(interaction.guild!.members.me!)
						?.missing(clientPermCheck) as string[];

					if (missing.length) {
						const replies = `I lack the ${formatArray(
							missing.map((item) => `***${formatPermissions(item)}***`)
						)} permission(s) to continue.`;

						return interaction.reply({ content: replies, ephemeral: true });
					}
				}
			}

			if (command.ownerOnly && !this.client.owners?.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is only accessible for developers.', ephemeral: true });
			}

			try {
				await command.execute(interaction);
			} catch (e: unknown) {
				if ((e as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
				if (interaction.replied) return;
				console.error(`${(e as Error).name}: ${(e as Error).message}`);

				const replies = [
					'An error has occured when executing this command, our developers have been informed.',
					'If the issue persists, please contact us in our Support Server.'
				].join('\n');

				if (interaction.deferred) return interaction.editReply({ content: replies });
				return interaction.reply({ content: replies, ephemeral: true });
			}
		}
	}
}
