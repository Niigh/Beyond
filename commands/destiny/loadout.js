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
        .setName('loadout')
        .setDescription('Show an equipped items informations and stats.')
        
        .addStringOption(option =>
            option.setName('class')
            .setDescription('The guardian class you want to get informations for.')
            .setRequired(true)
            .addChoice('Hunter', 'Hunter')
            .addChoice('Titan', 'Titan')
            .addChoice('Warlock', 'Warlock'))
        .addStringOption(option =>
            option.setName('item-slot')
            .setDescription('The item you want to get informations for.')
            .setRequired(true)
            .addChoice('Subclass', 'Subclass')
            .addChoice('Kinetic', 'Kinetic')
            .addChoice('Energetic', 'Energetic')
            .addChoice('Heavy', 'Heavy')
            .addChoice('Helmet', 'Helmet')
            .addChoice('Gauntlets', 'Gauntlets')
            .addChoice('Chest', 'Chest')
            .addChoice('Legs', 'Legs')
            .addChoice('Class', 'Class')
            .addChoice('Ghost', 'Ghost')
            .addChoice('Sparrow', 'Sparrow')
            .addChoice('Ship', 'Ship')
            .addChoice('Emblem', 'Emblem'))
        .addStringOption(option =>
            option.setName('bungie-tag')
            .setDescription('The guardian you want to get informations for. Leave empty to get your own informations.')
            .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const discordID = interaction.user.id;
        const guardianClass = interaction.options.getString('class');
        const itemSlot = interaction.options.getString('item-slot');
        const bungieTag = interaction.options.getString('bungie-tag');

        bungieAPI = new BungieAPI();

        if(bungieTag==null) {
            if(!userDB.isUserExist(discordID)) {
                inf('Discord user didn\'t linked.')
                await interaction.editReply({embeds: [embedBuilder.getNotLinkedErrorEmbed()]});
                return;
            };

            const memberId = userDB.getMemberID(discordID);
            const memberType = userDB.getMemberType(discordID);
            inf(`Requesting bungie profile: ${userDB.getBungieTag(discordID)} ...`);

            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,200`)
                .then(async res => {
                    if(bungieAPI.isBungieAPIDown(res)) {
                        inf('Bungie API down.')
                        await interaction.editReply({embeds: [embedBuilder.getAPIDownEmbed()]});
                        return;
                    };

                    if(res.data.ErrorCode != 1) {
                        await interaction.editReply({embed: embedBuilder.getRequestErrorEmbed(), ephemeral: true});
                        return;
                    };

                    for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                        charId = res.data.Response.profile.data.characterIds[i];
                        character = res.data.Response.characters.data[charId];
                        if (character.classType == bungieAPI.getClassID(guardianClass)) {
                            not(`Class: ${bungieAPI.getClass(character.classType)}`);

                            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                                .then(async res => {
                                    inf(`Status code: ${res.status}`);

                                    const itemInstanceId = res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].itemInstanceId;

                                    bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Item/${itemInstanceId}/?components=200,300,301,302,304,305,306,308,309,310`)
                                    .then(async res => {
                                        inf(`Status code: ${res.status}`);
                                        console.log(res.data.Response);
                                        console.log(res.data.Response.perks.data);
                                        console.log(res.data.Response.stats.data);
                                        console.log(res.data.Response.sockets.data);
                                        console.log(res.data.Response.reusablePlugs.data.plugs);
                                        console.log(res.data.Response.plugObjectives.data.objectivesPerPlug);

                                    })
                                    .catch(async error => {
                                        err(error.code)
                                        if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                            await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                        };
                                        console.error(error);
                                    });


                                    if(bungieAPI.getEquippedSlot(itemSlot)>=0 && bungieAPI.getEquippedSlot(itemSlot)<=2) {
                                        return;
                                        //await interaction.editReply({embeds: [embedBuilder.getWeaponEmbed(discordID, res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)])]});
                                    } else if (bungieAPI.getEquippedSlot(itemSlot)>=3 && bungieAPI.getEquippedSlot(itemSlot)<=7) {
                                        return;
                                        //await interaction.editReply({embeds: [embedBuilder.getArmorEmbed(discordID, res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)])]});
                                    } else {

                                    };

                            
                                })
                                .catch(async error => {
                                    err(error.code)
                                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                    };
                                    console.error(error);
                                });
                        };
                    };






                })
                .catch(async error => {
                    err(error.code)
                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                    };
                    console.error(error);
                });
        } else {

        };
    },
};