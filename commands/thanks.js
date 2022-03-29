//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const team = require('../data/team.json');
const { EmbedBuilder } = require('../lib/embed-message.js')
const embedBuilder = new EmbedBuilder();

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thanks')
        .setDescription('Replies with a list of persons that helped me through this project.'),
    async execute(interaction) {
        inf(`Command thanks called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        await interaction.reply({embeds: [embedBuilder.getThanksEmbed(team)]});
    },
};