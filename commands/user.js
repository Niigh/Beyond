//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user infos !'),
    async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    },
};