//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { BungieAPI } = require('../../lib/bungie-api.js');
const { getGuardianEmbed, getBungieTagErrorEmbed, getAPIDownEmbed, getPrivateAccountEmbed, getErrorEmbed } = require('../../lib/embed-message.js');

const userDB = require('../../lib/userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guardian')
        .setDescription('Show your guardian\'s equipement and informations.')
        
        .addStringOption(option =>
            option.setName('class')
            .setDescription('The guardian class you want to get informations for.')
            .setRequired(true)
            .addChoice('Hunter', 'Hunter')
            .addChoice('Titan', 'Titan')
            .addChoice('Warlock', 'Warlock'))
        .addStringOption(option =>
            option.setName('bungie-tag')
            .setDescription('The guardian you want to get informations for. Leave empty to get your own informations.')
            .setRequired(false)),
    async execute(interaction) {
        inf(`Command guardian called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        await interaction.deferReply();
        const discordID = interaction.user.id;
        const bungieTag = interaction.options.getString('bungie-tag');
        const guardianClass = interaction.options.getString('class');

        bungieAPI = new BungieAPI();

        if(bungieTag==null) {
            if(!userDB.isUserExist(discordID)) {
                inf('Discord user didn\'t linked.')
                await interaction.editReply({content: 'Your Bungie Profile isn\'t linked. Please use /link to register your Bungie profile.', ephemeral: true});
                return;
            };

            const memberId = userDB.getMemberID(discordID);
            const memberType = userDB.getMemberType(discordID);
            inf(`Requesting bungie profile: ${userDB.getBungieTag(discordID)} ...`);

            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,200`)
                .then(async res => {
                    inf(`Status code: ${res.status}`);

                    if(bungieAPI.isBungieAPIDown(res)) {
                        inf('Bungie API down.')
                        await interaction.editReply({embeds: [getAPIDownEmbed()]});
                        return;
                    };

                    if(res.data.ErrorCode != 1) {
                        await interaction.editReply({content: 'An error occured with your account. Is there a Destiny 2 account connected ?', ephemeral: true});
                        return;
                    };

                    for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                        charId = res.data.Response.profile.data.characterIds[i];
                        character = res.data.Response.characters.data[charId];
                        if (character.classType == bungieAPI.getClassID(guardianClass)) {
                            not(`Class: ${bungieAPI.getClass(character.classType)}`);
                            userDB.addGuardians(userDB.getBungieTag(discordID), memberId, memberType, charId);

                            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                                .then(async res => {
                                    inf(`Status code: ${res.status}`);
                                    bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,104,202`)
                                        .then(async resProfile => {
                                            inf(`Status code: ${resProfile.status}`);

                                            if(resProfile.data.Response.profileProgression.data==undefined) {
                                                wrn('Account set on private.');
                                                await interaction.editReply({embeds: [getPrivateAccountEmbed(bungieTag)]});
                                                return;
                                            };

                                            const artefactBonus = resProfile.data.Response.profileProgression.data.seasonalArtifact.powerBonus;
                                            var seasonLevel = resProfile.data.Response.characterProgressions.data[charId].progressions[bungieAPI.getSeasonPassHash(16,false)].level;
                                            if(seasonLevel>=100) {
                                                seasonLevel = 100 + resProfile.data.Response.characterProgressions.data[charId].progressions[bungieAPI.getSeasonPassHash(16,true)].level;
                                            };
                                            guardianEmbed = getGuardianEmbed(discordID, res.data.Response, artefactBonus, seasonLevel);
                                            await interaction.editReply({embeds: [guardianEmbed]});
                                        })
                                        .catch(async error => {
                                            err(error.code)
                                            if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                                errorEmbed = getErrorEmbed(error);
                                                await interaction.editReply({embeds: [errorEmbed]});
                                            };
                                            console.error(error);
                                        });
                                })
                                .catch(async error => {
                                    err(error.code)
                                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                        errorEmbed = getErrorEmbed(error);
                                        await interaction.editReply({embeds: [errorEmbed]});
                                    };
                                    console.error(error);
                                });
                        };
                    };
                })
                .catch(async error => {
                    err(error.code)
                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                        errorEmbed = getErrorEmbed(error);
                        await interaction.editReply({embeds: [errorEmbed]});
                    };
                    console.error(error)
                });
        } else {
            bungieAPI.get(`/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(bungieTag)}/`)
            .then(async res => {
                inf(`Status code: ${res.status}`);

                if(bungieAPI.isBungieAPIDown(res)) {
                    inf('Bungie API down.')
                    await interaction.editReply({embeds: [getAPIDownEmbed()]});
                    return;
                };

                if(res.data.Response[0]==undefined) {
                    inf('Wrong Bungie Tag')
                    await interaction.editReply({embeds: [getBungieTagErrorEmbed()]});
                    return;
                };

                const memberId = res.data.Response[0].membershipId;
                if(res.data.Response[0].crossSaveOverride==0) {
                    var memberType = res.data.Response[0].membershipType;
                } else {
                    for (type of res.data.Response) {
                        if (type.crossSaveOverride==type.membershipType) {
                            memberType = type.membershipType;
                            break;
                        };
                    };
                };

                inf(`Requesting bungie profile: ${bungieTag} ...`);

                bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,200`)
                    .then(async res => {
                        inf(`Status code: ${res.status}`);

                        for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                            charId = res.data.Response.profile.data.characterIds[i];
                            character = res.data.Response.characters.data[charId];
                            if (character.classType == bungieAPI.getClassID(guardianClass)) {
                                not(`Class: ${bungieAPI.getClass(character.classType)}`);

                                bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                                    .then(async res => {
                                        inf(`Status code: ${res.status}`);
                                        bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,104,202`)
                                            .then(async resProfile => {
                                                inf(`Status code: ${resProfile.status}`);

                                                if(resProfile.data.Response.profileProgression.data==undefined) {
                                                    wrn('Account set on private.');
                                                    await interaction.editReply({embeds: [getPrivateAccountEmbed(bungieTag)]});
                                                    return;
                                                };

                                                const artefactBonus = resProfile.data.Response.profileProgression.data.seasonalArtifact.powerBonus;
                                                var seasonLevel = resProfile.data.Response.characterProgressions.data[charId].progressions[bungieAPI.getSeasonPassHash(16,false)].level;
                                                if(seasonLevel>=100) {
                                                    seasonLevel = 100 + resProfile.data.Response.characterProgressions.data[charId].progressions[bungieAPI.getSeasonPassHash(16,true)].level;
                                                };
                                                guardianEmbed = getGuardianEmbed(discordID, res.data.Response, artefactBonus, seasonLevel, bungieTag);
                                                await interaction.editReply({embeds: [guardianEmbed]});
                                            })
                                            .catch(async error => {
                                                err(error.code)
                                                if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                                    errorEmbed = getErrorEmbed(error);
                                                    await interaction.editReply({embeds: [errorEmbed]});
                                                };
                                                console.error(error);
                                            });
                                    })
                                    .catch(async error => {
                                        err(error.code)
                                        if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                            errorEmbed = getErrorEmbed(error);
                                            await interaction.editReply({embeds: [errorEmbed]});
                                        };
                                        console.error(error);
                                    });
                            };
                        };
                    })
                    .catch(async error => {
                        err(error.code)
                        if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                            errorEmbed = getErrorEmbed(error);
                            await interaction.editReply({embeds: [errorEmbed]});
                        };
                        console.error(error)
                    });

            })
            .catch(async error => {
                err(error.code)
                if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                    errorEmbed = getErrorEmbed(error);
                    await interaction.editReply({embeds: [errorEmbed]});
                };
                console.error(error)
            });
            
        };
    },
};