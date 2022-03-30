//#region libs
require('dotenv').config();

const fs = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

//Trace Module
const {err, wrn, inf, not, dbg} = require('./trace.js');
//#endregion

const commands = [];
const help = {};
const team = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const destinyCommandFiles = fs.readdirSync('./commands/destiny').filter(file => file.endsWith('.js'));
not(`Command files list: ${commandFiles}`);

//IDs
const clientId = String(process.env.CLIENT_ID);

//Help file
help.Destiny = [];
for (const file of destinyCommandFiles) {
    inf('Destiny Commands');
    not(`File: ${file}`);
    const command = require(`./commands/destiny/${file}`);
    inf(`Detected ${command.data.name} command`);
    commands.push(command.data.toJSON());
    help.Destiny.push([ `/${command.data.name}`, command.data.description]);
}

help.General = [];
for (const file of commandFiles) {
    inf('General commands');
    not(`File: ${file}`);
    const command = require(`./commands/${file}`);
    inf(`Detected ${command.data.name} command`);
    commands.push(command.data.toJSON());
    help.General.push([ `/${command.data.name}`, command.data.description]);
}

fs.writeFile('./data/help.json', JSON.stringify(help, null, 4), (error) => {
    if (error) {
        err(error);
        console.error(error);
        throw error;
    }
});

const rest = new REST({ version: 9 }).setToken(process.env.DISCORD_TOKEN);

//Guild commands
(async () => {
    try {
        inf('Started refreshing application (/) commands ...');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        inf('Successfully reloeded application (/) commands');
    } catch (error) {
        err(error);
    }
})();