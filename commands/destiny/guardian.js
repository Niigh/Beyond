//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { BungieAPI } = require('../../lib/bungie-api.js');
const { getGuardianEmbed } = require('../../lib/embed-message.js');

const db = require('../../lib/userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guardian')
        .setDescription('Show your guardian\'s stats')
        .addStringOption(options =>
            options.setName('class')
            .setDescription('The guardian class you want to get informations for.')
            .setRequired(true)
            .addChoice('Hunter', 'Hunter')
            .addChoice('Titan', 'Titan')
            .addChoice('Warlock', 'Warlock')),
    async execute(interaction) {
        inf(`Command guardian called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        await interaction.deferReply();
        const discordID = interaction.user.id;
        const guardianClass = interaction.options.getString('class');

        if(!db.isUserExist(discordID)) {
            inf('Discord user didn\'t linked.')
            await interaction.editReply({content: 'Your Bungie Profile isn\'t linked. Please use /link to register your Bungie profile.', ephemeral: true});
            return;
        }

        const memberId = db.getMemberID(discordID);
        const memberType = db.getMemberType(discordID);
        inf(`Requesting bungie profile: ${db.getBungieTag(discordID)} ...`);

        bungieAPI = new BungieAPI();
        bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,200`)
            .then(async res => {
                inf(`Status code: ${res.status}`);
                //console.log(res.data.Response.profile.data.characterIds);

                if(bungieAPI.isBungieAPIDown(res)) {
                    inf('Bungie API down.')
                    await interaction.editReply({content: 'Destiny 2 API is down, it might be a maintenance ongoing. Check again later.', ephemeral: true});
                    return;
                };

                if(res.data.ErrorCode != 1) {
                    await interaction.editReply({content: 'An error occured with your account. Is there a Destiny 2 account connected ?', ephemeral: true});
                    return;
                }

                for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                    charId = res.data.Response.profile.data.characterIds[i];
                    character = res.data.Response.characters.data[charId];
                    if (character.classType == bungieAPI.getClassID(guardianClass)) {
                        not(`Class: ${bungieAPI.getClass(character.classType)}`);

                        db.addGuardians(db.getBungieTag(discordID), memberId, memberType, charId);
                        bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                            .then(async res => {
                                //console.log(res.data.Response.character);
                                //console.log(res.data.Response.equipment.data.items);
                                
                                guardianEmbed = getGuardianEmbed(discordID, res.data.Response);
                                await interaction.editReply({embeds: [guardianEmbed]})
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }
            })
            .catch(error => {
                console.error(error)
            });
    },
};