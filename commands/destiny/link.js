//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { BungieAPI } = require('../../lib/bungie-api.js');

const { EmbedBuilder } = require('../../lib/embed-message.js')
const embedBuilder = new EmbedBuilder();

const userDB = require('../../lib/userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link you Guardian\'s tag')
        .addStringOption(options =>
            options.setName('bungie-tag')
            .setDescription('Link your Bungie tag to your Discord account.')
            .setRequired(true))
        .addStringOption(options =>
            options.setName('plateform')
            .setDescription('Only needed if the user does not have Cross Save activated. This will be ignored otherwise')
            .setRequired(false)
            .addChoice('PSN', 'PSN')
            .addChoice('Xbox', 'Xbox')
            .addChoice('Steam', 'Steam')
            .addChoice('Stadia', 'Stadia')),
    async execute(interaction) {
        inf(`Command link called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        const discordID = interaction.user.id;
        const bungieTag = interaction.options.getString('bungie-tag');

        if(userDB.isUserExist(discordID)) {
            inf('This user is already registered.');
            await interaction.reply({embeds: [embedBuilder.getAccountLinkErrorEmbed(discordID)], ephemeral: true});
            return;
        }

        bungieAPI = new BungieAPI();
        bungieAPI.get(`/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(bungieTag)}/`)
            .then(async res => {
                inf(`Status code: ${res.status}`);
                if(bungieAPI.isBungieAPIDown(res)) {
                    inf('Bungie API down.')
                    await interaction.reply({embeds: [embedBuilder.getAPIDownEmbed()], ephemeral: true});
                    return;
                };

                if(res.data.Response[0]==undefined) {
                    inf('Wrong Bungie Tag')
                    await interaction.reply({embeds: [embedBuilder.getBungieTagErrorEmbed()], ephemeral: true});
                    return;
                };

                memberID = res.data.Response[0].membershipId;
                if(res.data.Response[0].crossSaveOverride==0) {
                    memberType = res.data.Response[0].membershipType;
                } else {
                    for (type of res.data.Response) {
                        if (type.crossSaveOverride==type.membershipType) {
                            memberType = type.membershipType;
                            break;
                        };
                    };
                };
                
                userDB.addUser(discordID, memberID, memberType, bungieTag);
                inf(`New user linked: ${bungieTag}`);

                await interaction.reply({embeds: [embedBuilder.getAccountLinkedEmbed(bungieTag)]});

            })
            .catch(async error => {
                err(error.code)
                if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                    await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                };
                console.error(error);
            });
    },
};