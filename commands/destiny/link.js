//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { BungieAPI } = require(`../../lib/bungie-api.js`);

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link you Guardian\'s tag')
        .addStringOption(options =>
            options.setName('bungie-tag')
            .setDescription('Link your Bungie tag to your Discord account')
            .setRequired(true))
        .addStringOption(options =>
            options.setName('plateform')
            .setDescription('Only needed if the user does not have Cross Save activated. This will be ignored otherwise')
            .setRequired(false)
            .addChoice('PSN', 'PSN')
            .addChoice('Xbox', 'Xbox')
            .addChoice('Steam', 'Steam')
            .addChoice('Stadia', 'Stadia')),
    async execute(interaction, guildData) {
        inf(`Command link called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        const discordID = interaction.user.id;
        const bungieTag = interaction.options.getString('bungie-tag');

        if(guildData.isExistingLinkedUser(discordID)) {
            inf('This user is already registered.');
            await interaction.reply({content: `Your account is already linked : ${guildData.getLinkedUser(discordID)}`, ephemeral: true});
            return;
        }

        bungieAPI = new BungieAPI();
        bungieAPI.get(`/Destiny2/SearchDestinyPlayer/-1/${bungieTag}/`)
            .then(async res => {
                inf(`Status code: ${res.status}`);
                //console.log(res.data.Response)
                if(bungieAPI.isBungieAPIDown(res)) {
                    inf('Bungie API down.')
                    await interaction.reply({content: 'Destiny 2 API is down, it might be a maintenance ongoing. Check again later.', ephemeral: true});
                    return;
                };

                if(res.data.Response[0]==undefined) {
                    inf('Wrong Bungie Tag')
                    await interaction.reply({content: 'No Bungie profile found. Are your sure about your Bungie tag ?', ephemeral: true});
                    return;
                }

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

                memberPlateform = bungieAPI.getPlateform(memberType);

                if(!bungieAPI.isPublicAccount(res.data.Response)) {
                    await interaction.reply({content: 'Your account is set on private, we we won\'t be able to access your informations.', ephemeral: true});
                }

                dbg(`memberID: ${memberID}`);
                dbg(`memberType: ${memberType}`);
                dbg(`memberPlateform: ${memberPlateform}`);

                guildData.addUser(discordID, memberID, memberType, bungieTag);
                guildData.getUsersList();

                await interaction.reply('You linked your account.');

            })
            .catch(error => {
                console.error(error)
            });
    },
};