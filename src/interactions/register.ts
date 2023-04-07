import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Command } from 'commander';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globby } from 'globby';
import path from 'node:path';
import 'dotenv/config';

const program = new Command();

program.option('-g, --global', 'register commands globally');
program.option('-l, --local', 'register commands locally');

program.parse(process.argv);

const token = process.env.DISCORD_TOKEN as string;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = process.env.DISCORD_APPLICATION_ID as string;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function loadCommands(): Promise<object[]> {
	const main = fileURLToPath(import.meta.url);
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [] as object[];
	await globby(`${directory}?(context|slash)/**/*.js`).then(async (interactions: string[]) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile).toString());
			commands.push(interaction);
		}
	});

	return commands;
}

async function registerCommands(): Promise<void> {
	const options = program.opts();
	if (!Object.keys(options).length) return console.log(program.helpInformation());

	const guildId = process.env.DISCORD_GUILD_ID as string;
	if (!guildId && options.local) {
		throw new Error('The DISCORD_GUILD_ID environment variable is required.');
	}

	const commands = await loadCommands();
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		console.log('Started refreshing application (/) commands.');

		if (options.global) {
			await rest.put(Routes.applicationCommands(applicationId), { body: commands });
		}

		if (options.local) {
			await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (e: unknown) {
		console.error(`${(e as Error).name}: ${(e as Error).message}`);
	}
}

void registerCommands();
