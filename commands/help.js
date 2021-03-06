//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const help = require('../data/help.json');
const { EmbedBuilder } = require('../lib/embed-message.js');
const embedBuilder = new EmbedBuilder();

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies a list of commands available.'),
    async execute(interaction) {
        inf(`Command help called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        await interaction.reply({embeds: [embedBuilder.getHelpEmbed(help)]});
    },
};