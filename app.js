//#region libs
require('dotenv').config();

const fs = require('fs');

const config = require('./config.json');
const message = require(config.HELP_FILE);

//Help
const Help = require('./legacy/LEGACY_help.js');
const help = new Help(message);

//Discord Lib
const { Client, Collection, Intents, } = require('discord.js');

const beyondIntents = new Intents();
beyondIntents.add(
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES)
const bot = new Client({ intents: beyondIntents });

//Trace Module
const {err, wrn, inf, not, dbg} = require('./trace.js');
//#endregion

//Initializing Discord Bot
/*
bot.once('ready', () => {
    inf('The bot is online');
    bot.user.setPresence({
        activities: {
            type: 'PLAYING',
            name: 'Destiny 2'
        },
        status: 'online'
    })
})
*/

//#region Event Handling

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}

//#endregion

//#region Command handling
bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.on ('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        err(error);
        await interaction.reply({
            content: 'The command couldn\'t be executed due to an error.',
            ephemeral: true
        });
    }
});
//#endregion

bot.login(process.env.DISCORD_TOKEN);