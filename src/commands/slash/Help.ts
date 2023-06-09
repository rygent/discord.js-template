import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Command.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { type APIMessageComponentEmoji, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, parseEmoji } from 'discord.js';
import { bold, chatInputApplicationCommandMention, italic, quote } from '@discordjs/formatters';
import { formatPermissions } from '#lib/utils/Function.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'help',
			description: 'Shows help information and commands.'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const command = interaction.options.getString('command');

		const app_command = await this.client.application?.commands.fetch();

		if (command) {
			const cmd = this.client.commands.get(command);
			const cmdId = app_command.find((item) => item.name === cmd?.name.split(' ')[0])?.id;

			const permissions = cmd?.memberPermissions.toArray();

			const embed = new EmbedBuilder()
				.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: this.client.user.displayAvatarURL() })
				.setTitle(`${chatInputApplicationCommandMention(cmd!.name, cmdId!)}`)
				.setDescription(
					[
						`${cmd?.description}`,
						`${bold(italic('Permissions:'))} ${
							permissions?.length
								? permissions.map((item) => `\`${formatPermissions(item)}\``).join(', ')
								: 'No permission required.'
						}`
					].join('\n')
				)
				.setFooter({
					text: `Powered by ${this.client.user.username}`,
					iconURL: interaction.user.avatarURL() as string
				});

			return interaction.reply({ embeds: [embed] });
		}

		let i0 = 0;
		let i1 = 8;
		let page = 1;

		const commands = this.client.commands
			.filter(({ context, ownerOnly }) => !context && !ownerOnly)
			.map((item) => ({
				id: app_command.find((i) => i.name === item.name.split(' ')[0])?.id,
				...item
			}));

		const [firstId, previousId, pageId, nextId, lastId] = ['first', 'previous', 'page', 'next', 'last'].map(
			(id) => `${id}-${interaction.id}`
		);
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(firstId as string)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji('⏪') as APIMessageComponentEmoji)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(previousId as string)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji('◀️') as APIMessageComponentEmoji)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(pageId as string)
					.setStyle(ButtonStyle.Secondary)
					.setLabel(`${page}/${Math.ceil(commands.length / 8)}`)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nextId as string)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji('▶️') as APIMessageComponentEmoji)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(lastId as string)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji('⏩') as APIMessageComponentEmoji)
			);

		const description = [
			`Welcome to help menu, here is the list of commands!`,
			commands
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((cmd) => `${chatInputApplicationCommandMention(cmd.name, cmd.id!)}\n${quote(cmd.description)}`)
				.slice(i0, i1)
				.join('\n')
		];

		if (commands.length <= 8) {
			button.components[3]?.setDisabled(true);
			button.components[4]?.setDisabled(true);
		}

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: this.client.user.displayAvatarURL() })
			.setDescription(description.join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		const reply = await interaction.reply({ embeds: [embed], components: [button], fetchReply: true });

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 300_000
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', (i) => {
			collector.resetTimer();

			switch (i.customId) {
				case firstId:
					i0 -= 8 * (page - 1);
					i1 -= 8 * (page - 1);
					page -= 1 * (page - 1);

					if (page === 1) {
						button.components[0]?.setDisabled(true);
						button.components[1]?.setDisabled(true);
					}

					if (page !== Math.ceil(commands.length / 8)) {
						button.components[3]?.setDisabled(false);
						button.components[4]?.setDisabled(false);
					}

					description.splice(
						1,
						description.length,
						commands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((cmd) => `${chatInputApplicationCommandMention(cmd.name, cmd.id!)}\n${quote(cmd.description)}`)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(commands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [button] });
				case previousId:
					i0 -= 8;
					i1 -= 8;
					page -= 1;

					if (page === 1) {
						button.components[0]?.setDisabled(true);
						button.components[1]?.setDisabled(true);
					}

					if (page !== Math.ceil(commands.length / 8)) {
						button.components[3]?.setDisabled(false);
						button.components[4]?.setDisabled(false);
					}

					description.splice(
						1,
						description.length,
						commands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((cmd) => `${chatInputApplicationCommandMention(cmd.name, cmd.id!)}\n${quote(cmd.description)}`)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(commands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [button] });
				case nextId:
					i0 += 8;
					i1 += 8;
					page += 1;

					if (page !== 1) {
						button.components[0]?.setDisabled(false);
						button.components[1]?.setDisabled(false);
					}

					if (page === Math.ceil(commands.length / 8)) {
						button.components[3]?.setDisabled(true);
						button.components[4]?.setDisabled(true);
					}

					description.splice(
						1,
						description.length,
						commands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((cmd) => `${chatInputApplicationCommandMention(cmd.name, cmd.id!)}\n${quote(cmd.description)}`)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(commands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [button] });
				case lastId:
					i0 += 8 * (Math.ceil(commands.length / 8) - page);
					i1 += 8 * (Math.ceil(commands.length / 8) - page);
					page += 1 * (Math.ceil(commands.length / 8) - page);

					if (page !== 1) {
						button.components[0]?.setDisabled(false);
						button.components[1]?.setDisabled(false);
					}

					if (page === Math.ceil(commands.length / 8)) {
						button.components[3]?.setDisabled(true);
						button.components[4]?.setDisabled(true);
					}

					description.splice(
						1,
						description.length,
						commands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((cmd) => `${chatInputApplicationCommandMention(cmd.name, cmd.id!)}\n${quote(cmd.description)}`)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(commands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [button] });
			}
		});

		collector.on('end', (collected, reason) => {
			if ((!collected.size && reason === 'time') || reason === 'time') {
				button.components[0]?.setDisabled(true);
				button.components[1]?.setDisabled(true);
				button.components[3]?.setDisabled(true);
				button.components[4]?.setDisabled(true);

				return void reply.edit({ components: [button] });
			}
		});
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();

		const choices = this.client.commands
			.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()))
			.map((commands) => ({ ...commands }));

		const respond = choices
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter((cmd) => !cmd.context && !cmd.ownerOnly)
			.filter((cmd) => {
				if (cmd.guildOnly && !interaction.inCachedGuild()) return false;
				return true;
			})
			.map(({ name }) => ({ name, value: name }));

		return interaction.respond(respond.slice(0, 25));
	}
}
