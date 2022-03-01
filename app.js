//#region libs
require('dotenv').config();

const fs = require('fs');

//Discord Lib
const { Client, Collection, Intents, } = require('discord.js');

const beyondIntents = new Intents();
beyondIntents.add(
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS)
const bot = new Client({ intents: beyondIntents, partials: ["CHANNEL"] });

//Trace Module
const {err, wrn, inf, not, dbg} = require('./trace.js');
//#endregion

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
const destinyCommandFiles = fs.readdirSync('./commands/destiny').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

for (const file of destinyCommandFiles) {
    const command = require(`./commands/destiny/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.on ('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; //Is the message a command ?
    if(interaction.channel.type === "DM") return;
    if (interaction.user.bot) return; //Is the user a bot ?

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    // Bot latency check
    if(command.data.name === 'ping' || command.data.name === 'shutdown') {
        try {
            await command.execute(interaction, bot);
        } catch (error) {
            err(error);
            await interaction.reply({
                content: 'The command couldn\'t be executed due to an error.',
                ephemeral: true
            });
        }
    } else {
        try {
            await command.execute(interaction);
        } catch (error) {
            err(error);
            await interaction.reply({
                content: 'The command couldn\'t be executed due to an error.',
                ephemeral: true
            });
        }
    }
});
//#endregion

bot.login(process.env.DISCORD_TOKEN).catch( error => {
    err("Can't log Beyond Bot : ", error);
});