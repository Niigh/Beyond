//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with the help'),
    async execute(interaction) {
        await interaction.reply('Voici l\'aide.');
    },
};