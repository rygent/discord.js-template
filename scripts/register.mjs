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

const token = process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = process.env.DISCORD_APPLICATION_ID;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function loadCommands() {
	const main = fileURLToPath(new URL('../dist/index.js', import.meta.url));
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [];
	await globby(`${directory}interactions/**/*.js`).then(async interactions => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			commands.push(interaction);
		}
	});

	return commands;
}

async function registerCommands(local = false) {
	const guildId = process.env.DISCORD_GUILD_ID;
	if (!guildId && local) {
		throw new Error('The DISCORD_GUILD_ID environment variable is required.');
	}

	const commands = await loadCommands();
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		console.log('Started refreshing application (/) commands.');

		switch (local) {
			case true:
				await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
				break;
			case false:
				await rest.put(Routes.applicationCommands(applicationId), { body: commands });
				break;
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
	}
}

const options = program.opts();
if (options.global) await registerCommands(false);
if (options.local) await registerCommands(true);
else await registerCommands(false);
