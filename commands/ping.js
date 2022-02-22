//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong !'),
    async execute(interaction) {
        await interaction.reply('Pong !');
    },
};