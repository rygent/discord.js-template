import type BaseClient from '../../structures/BaseClient.js';
import { Command } from '../../structures/Command.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import type { ContextMenuCommandInteraction, GuildMember } from 'discord.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: ['Avatar']
		});
	}

	public execute(interaction: ContextMenuCommandInteraction) {
		const member = interaction.options.getMember('user') as GuildMember;

		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(member.displayAvatarURL({ extension: 'png', size: 4096 })));

		const embed = new EmbedBuilder()
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
			.setDescription(`***ID:*** \`${member.user.id}\``)
			.setImage(member.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL()! });

		return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
	}
}
