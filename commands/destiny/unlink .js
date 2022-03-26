//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder } = require('../../lib/embed-message.js')
const embedBuilder = new EmbedBuilder();

const userDB = require('../../lib/userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Unlink you Guardian\'s tag.'),
    async execute(interaction) {
        inf(`Command unlink called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        const discordID = interaction.user.id;

        if(!userDB.isUserExist(discordID)) {
            inf('This user doesn\'t have any linked Bungie profile.');
            await interaction.reply({embeds: [embedBuilder.getAccountUnlinkErrorEmbed()], ephemeral: true});
            return;
        };

        const bungieTag = userDB.getBungieTag(discordID);
        userDB.deleteUser(discordID);
        inf(`User successfully unlinked: ${bungieTag}`);

        await interaction.reply({embeds: [embedBuilder.getAccountUnlinkedEmbed(bungieTag)], ephemeral: true});
    },
};