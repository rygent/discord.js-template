import type { AutocompleteInteraction, CommandInteraction } from 'discord.js';

export function formatArray(
	input: string[],
	options: { style?: Intl.ListFormatStyle; type?: Intl.ListFormatType } = {}
): string {
	const { style = 'short', type = 'conjunction' } = options;
	return new Intl.ListFormat('en-US', { style, type }).format(input);
}

export function formatPermissions(input: string): string {
	return input
		.replace(/(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])/g, ' $1')
		.replace(/To|And|In\b/g, (txt) => txt.toLowerCase())
		.replace(/ Instant| Embedded/g, '')
		.replace(/Guild/g, 'Server')
		.replace(/Moderate/g, 'Timeout')
		.replace(/TTS/g, 'Text-to-Speech')
		.replace(/Use VAD/g, 'Use Voice Activity');
}

export function resolveCommandName(
	interaction: CommandInteraction<'cached' | 'raw'> | AutocompleteInteraction<'cached' | 'raw'>
): string {
	if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return interaction.commandName;

	const topLevelCommand = interaction.commandName;
	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	const subCommand = interaction.options.getSubcommand(false);

	const command = [
		topLevelCommand,
		...(subCommandGroup ? [subCommandGroup] : []),
		...(subCommand ? [subCommand] : [])
	].join(' ');

	return command;
}
