//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getThanksEmbed } = require('../lib/embed-message.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thanks')
        .setDescription('Replies with a list of person that helped me through this project'),
    async execute(interaction) {
        helpEmbed = getThanksEmbed();
        inf(`Command thanks called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        await interaction.reply({embeds: [helpEmbed]});
    },
};