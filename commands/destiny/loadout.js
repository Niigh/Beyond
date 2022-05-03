//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

const { BungieAPI } = require('../../lib/bungie-api.js');

const { DestinyDatabase } = require('../../lib/destinydata.js');
const destinyDB = new DestinyDatabase();

const { EmbedBuilder } = require('../../lib/embed-message.js');
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
            option.setName('display')
            .setDescription('The amount of informations you want for your weapon/armor (it\'s ignored for your other stuff).')
            .setRequired(false)
            .addChoice('Extended', 'Extended'))
        .addStringOption(option =>
            option.setName('bungie-tag')
            .setDescription('The guardian you want to get informations for. Leave empty to get your own informations.')
            .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const discordID = interaction.user.id;
        const avatar = interaction.user.avatarURL();
        const guardianClass = interaction.options.getString('class');
        const itemSlot = interaction.options.getString('item-slot');
        const display = interaction.options.getString('display');
        const bungieTag = interaction.options.getString('bungie-tag');

        const bungieAPI = new BungieAPI();

        if(bungieTag==null) {
            if(!userDB.isUserExist(discordID)) {
                inf('Discord user didn\'t linked.');
                await interaction.editReply({embeds: [embedBuilder.getNotLinkedErrorEmbed()]});
                return;
            }

            const memberId = userDB.getMemberID(discordID);
            const memberType = userDB.getMemberType(discordID);
            inf(`Requesting bungie profile: ${userDB.getBungieTag(discordID)} ...`);

            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,103,200`)
                .then(async res => {
                    inf(`Status code: ${res.status}`);

                    if(bungieAPI.isBungieAPIDown(res)) {
                        inf('Bungie API down.');
                        await interaction.editReply({embeds: [embedBuilder.getAPIDownEmbed()]});
                        return;
                    }

                    if(res.data.ErrorCode != 1) {
                        await interaction.editReply({embed: embedBuilder.getRequestErrorEmbed(), ephemeral: true});
                        return;
                    }

                    for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                        const charId = res.data.Response.profile.data.characterIds[i];
                        const character = res.data.Response.characters.data[charId];
                        if (character.classType == bungieAPI.getClassID(guardianClass)) {
                            not(`Class: ${bungieAPI.getClass(character.classType)}`);

                            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                                .then(async res => {
                                    inf(`Status code: ${res.status}`);

                                    const itemHash = res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].itemHash;
                                    const itemInstanceId = res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].itemInstanceId;
                                    const itemState = bungieAPI.getItemState(res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].state);
                                    var emblemMetrics;
                                    if(bungieAPI.getEquippedSlot(itemSlot) == 13 && res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricHash != undefined) {
                                        emblemMetrics = 
                                        [res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricHash, 
                                        res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricObjective];
                                    }

                                    bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Item/${itemInstanceId}/?components=200,300,301,302,304,305,306,308,309,310`)
                                    .then(async res => {
                                        inf(`Status code: ${res.status}`);

                                        // Thumbail
                                        destinyDB.loadDB();
                                        const item = destinyDB.getDetailedEquippedItem(itemHash);

                                        const ornement = destinyDB.getWeaponOrnement(res.data.Response.sockets.data.sockets);
                                        destinyDB.closeDB();

                                        const canvas = Canvas.createCanvas(96, 96);
                                        const context = canvas.getContext('2d');
                                        if(ornement != undefined && ornement.displayProperties.name != 'Default Ornament') {
                                            if(ornement.displayProperties.name != 'Default Ornament') {
                                                const backgroundOrnement = await Canvas.loadImage(bungieAPI.buildURLAsset(ornement.displayProperties.icon));
                                                context.drawImage(backgroundOrnement, 0, 0, canvas.width, canvas.height);
                                            }
                                        } else {
                                            const background = await Canvas.loadImage(bungieAPI.buildURLAsset(item.displayProperties.icon));
                                            context.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        }
                                        
                                        // Masterwork
                                        if(itemState.includes('Masterwork')) {
                                            const masterwork = await Canvas.loadImage('./img/icons/misc/Masterwork.png');
                                            context.drawImage(masterwork, 0, 0, 96, 96);
                                        }
                                        // Watermark
                                        if (item.quality != undefined) {
                                            const watermark = await Canvas.loadImage(bungieAPI.buildURLAsset(item.quality.displayVersionWatermarkIcons));
                                            context.drawImage(watermark, 0, 0, canvas.width, canvas.height);
                                        } else if (item.iconWatermark != undefined) {
                                            const watermark = await Canvas.loadImage(bungieAPI.buildURLAsset(item.iconWatermark));
                                            context.drawImage(watermark, 0, 0, canvas.width, canvas.height);
                                        }

                                        const thumbail = new MessageAttachment(canvas.toBuffer(), 'itemThumbail.png');

                                        const itemSlotID = bungieAPI.getEquippedSlot(itemSlot);
                                        if(itemSlotID>=0 && itemSlotID<=2) {
                                            if (display != 'Extended') {
                                                not('Weapon embed.');

                                                const weaponEmbed = embedBuilder.getWeaponEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState);
                                                await interaction.editReply({embeds: [weaponEmbed], files: [thumbail]});
                                            } else {
                                                not('Extended weapon embed.');

                                                const extendedWeaponEmbed = embedBuilder.geExtendedWeaponEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState);
                                                await interaction.editReply({embeds: [extendedWeaponEmbed], files: [thumbail]});
                                            }
                                        } else if (itemSlotID>=3 && itemSlotID<=7) {
                                            if (display != 'Extended') {
                                                not('Armor embed.');

                                                const armorEmbed = embedBuilder.getArmorEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState);
                                                await interaction.editReply({embeds: [armorEmbed], files: [thumbail]});
                                            } else {
                                                not('Extended armor embed.');

                                                const extendedArmorEmbed = embedBuilder.getExtendedArmorEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState);
                                                await interaction.editReply({embeds: [extendedArmorEmbed], files: [thumbail]});
                                            }
                                            
                                        } else {
                                            switch (itemSlotID) {
                                                case 8:
                                                    not('Ghost embed.');

                                                    const ghostEmbed = embedBuilder.getGhostEmbed(discordID, avatar, res.data.Response, itemHash, itemState);
                                                    await interaction.editReply({embeds: [ghostEmbed], files: [thumbail]});
                                                    break;
                                                case 9:
                                                    not('Sparrow embed.');

                                                    const sparrowEmbed = embedBuilder.getSparrowEmbed(discordID, avatar, res.data.Response, itemHash, itemState);
                                                    await interaction.editReply({embeds: [sparrowEmbed], files: [thumbail]});
                                                    break;
                                                case 10:
                                                    not('Ship embed.');

                                                    const shipEmbed = embedBuilder.getShipEmbed(discordID, avatar, res.data.Response, itemHash, itemState);
                                                    await interaction.editReply({embeds: [shipEmbed], files: [thumbail]});
                                                    break;
                                                case 11:
                                                    not('Subclass embed.');

                                                    const subclassEmbed = embedBuilder.getSubclassEmbed(discordID, avatar, res.data.Response, itemHash);
                                                    await interaction.editReply({embeds: [subclassEmbed]});
                                                    break;
                                                case 13:
                                                    not('Emblem embed.');

                                                    const emblemEmbed = embedBuilder.getEmblemEmbed(discordID, avatar, itemHash, itemState, emblemMetrics);
                                                    await interaction.editReply({embeds: [emblemEmbed]});
                                                    break;
                                                default:
                                                    err('This equipement slot doesn\'t exist.');

                                                    await interaction.editReply({embeds: [embedBuilder.getErrorEmbed({code: 'SLOT_ERROR'})]});
                                                    break;
                                                
                                            }
                                        }
                                    })
                                    .catch(async error => {
                                        err(error.code);
                                        if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                            await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                        }
                                        console.error(error);
                                    });
                                })
                                .catch(async error => {
                                    err(error.code);
                                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                    }
                                    console.error(error);
                                });
                        }
                    }
                })
                .catch(async error => {
                    err(error.code);
                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                    }
                    console.error(error);
                });

        } else {
            bungieAPI.get(`/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(bungieTag)}/`)
            .then(async res => {
                inf(`Status code: ${res.status}`);

                if(bungieAPI.isBungieAPIDown(res)) {
                    inf('Bungie API down.');
                    await interaction.editReply({embeds: [embedBuilder.getAPIDownEmbed()]});
                    return;
                }

                if(res.data.Response[0]==undefined) {
                    inf('Wrong Bungie Tag');
                    await interaction.editReply({embeds: [embedBuilder.getBungieTagErrorEmbed()]});
                    return;
                }

                const memberId = res.data.Response[0].membershipId;
                var memberType;
                if(res.data.Response[0].crossSaveOverride==0) {
                    memberType = res.data.Response[0].membershipType;
                } else {
                    for (const type of res.data.Response) {
                        if (type.crossSaveOverride==type.membershipType) {
                            memberType = type.membershipType;
                            break;
                        }
                    }
                }

                inf(`Requesting bungie profile: ${bungieTag} ...`);

                bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/?components=100,103,200`)
                .then(async res => {
                    inf(`Status code: ${res.status}`);

                    if(bungieAPI.isBungieAPIDown(res)) {
                        inf('Bungie API down.');
                        await interaction.editReply({embeds: [embedBuilder.getAPIDownEmbed()]});
                        return;
                    }

                    if(res.data.ErrorCode != 1) {
                        await interaction.editReply({embed: embedBuilder.getRequestErrorEmbed(), ephemeral: true});
                        return;
                    }

                    for (let i = 0; i < res.data.Response.profile.data.characterIds.length; i++) {
                        const charId = res.data.Response.profile.data.characterIds[i];
                        const character = res.data.Response.characters.data[charId];
                        if (character.classType == bungieAPI.getClassID(guardianClass)) {
                            not(`Class: ${bungieAPI.getClass(character.classType)}`);

                            bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Character/${charId}/?components=200,205`)
                                .then(async res => {
                                    inf(`Status code: ${res.status}`);

                                    const itemHash = res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].itemHash;
                                    const itemInstanceId = res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].itemInstanceId;
                                    const itemState = bungieAPI.getItemState(res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].state);
                                    var emblemMetrics;
                                    if(bungieAPI.getEquippedSlot(itemSlot) == 13 && res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricHash != undefined) {
                                        emblemMetrics = 
                                        [res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricHash, 
                                        res.data.Response.equipment.data.items[bungieAPI.getEquippedSlot(itemSlot)].metricObjective];
                                    }

                                    bungieAPI.get(`/Destiny2/${memberType}/Profile/${memberId}/Item/${itemInstanceId}/?components=200,300,301,302,304,305,306,308,309,310`)
                                    .then(async res => {
                                        inf(`Status code: ${res.status}`);

                                        // Thumbail
                                        destinyDB.loadDB();
                                        const item = destinyDB.getDetailedEquippedItem(itemHash);

                                        const ornement = destinyDB.getWeaponOrnement(res.data.Response.sockets.data.sockets);
                                        destinyDB.closeDB();

                                        const canvas = Canvas.createCanvas(96, 96);
                                        const context = canvas.getContext('2d');
                                        if(ornement != undefined && ornement.displayProperties.name != 'Default Ornament') {
                                            if(ornement.displayProperties.name != 'Default Ornament') {
                                                const backgroundOrnement = await Canvas.loadImage(bungieAPI.buildURLAsset(ornement.displayProperties.icon));
                                                context.drawImage(backgroundOrnement, 0, 0, canvas.width, canvas.height);
                                            }
                                        } else {
                                            const background = await Canvas.loadImage(bungieAPI.buildURLAsset(item.displayProperties.icon));
                                            context.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        }
                                        
                                        // Masterwork
                                        if(itemState.includes('Masterwork')) {
                                            const masterwork = await Canvas.loadImage('./img/icons/misc/Masterwork.png');
                                            context.drawImage(masterwork, 0, 0, 96, 96);
                                        }
                                        // Watermark
                                        if (item.quality != undefined) {
                                            const watermark = await Canvas.loadImage(bungieAPI.buildURLAsset(item.quality.displayVersionWatermarkIcons));
                                            context.drawImage(watermark, 0, 0, canvas.width, canvas.height);
                                        } else if (item.iconWatermark != undefined) {
                                            const watermark = await Canvas.loadImage(bungieAPI.buildURLAsset(item.iconWatermark));
                                            context.drawImage(watermark, 0, 0, canvas.width, canvas.height);
                                        }

                                        const thumbail = new MessageAttachment(canvas.toBuffer(), 'itemThumbail.png');

                                        const itemSlotID = bungieAPI.getEquippedSlot(itemSlot);
                                        if(itemSlotID>=0 && itemSlotID<=2) {
                                            if (display != 'Extended') {
                                                not('Weapon embed.');

                                                const weaponEmbed = embedBuilder.getWeaponEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState, bungieTag);
                                                await interaction.editReply({embeds: [weaponEmbed], files: [thumbail]});
                                            } else {
                                                not('Extended weapon embed.');

                                                const extendedWeaponEmbed = embedBuilder.geExtendedWeaponEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState, bungieTag);
                                                await interaction.editReply({embeds: [extendedWeaponEmbed], files: [thumbail]});
                                            }
                                        } else if (itemSlotID>=3 && itemSlotID<=7) {
                                            if (display != 'Extended') {
                                                not('Armor embed.');

                                                const armorEmbed = embedBuilder.getArmorEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState, bungieTag);
                                                await interaction.editReply({embeds: [armorEmbed], files: [thumbail]});
                                            } else {
                                                not('Extended armor embed.');

                                                const extendedArmorEmbed = embedBuilder.getExtendedArmorEmbed(discordID, avatar, itemSlot, res.data.Response, itemHash, itemState, bungieTag);
                                                await interaction.editReply({embeds: [extendedArmorEmbed], files: [thumbail]});
                                            }
                                            
                                        } else {
                                            switch (itemSlotID) {
                                                case 8:
                                                    not('Ghost embed.');

                                                    const ghostEmbed = embedBuilder.getGhostEmbed(discordID, avatar, res.data.Response, itemHash, itemState, bungieTag);
                                                    await interaction.editReply({embeds: [ghostEmbed], files: [thumbail]});
                                                    break;
                                                case 9:
                                                    not('Sparrow embed.');

                                                    const sparrowEmbed = embedBuilder.getSparrowEmbed(discordID, avatar, res.data.Response, itemHash, itemState, bungieTag);
                                                    await interaction.editReply({embeds: [sparrowEmbed], files: [thumbail]});
                                                    break;
                                                case 10:
                                                    not('Ship embed.');

                                                    const shipEmbed = embedBuilder.getShipEmbed(discordID, avatar, res.data.Response, itemHash, itemState, bungieTag);
                                                    await interaction.editReply({embeds: [shipEmbed], files: [thumbail]});
                                                    break;
                                                case 11:
                                                    not('Subclass embed.');

                                                    const subclassEmbed = embedBuilder.getSubclassEmbed(discordID, avatar, res.data.Response, itemHash, bungieTag);
                                                    await interaction.editReply({embeds: [subclassEmbed]});
                                                    break;
                                                case 13:
                                                    not('Emblem embed.');

                                                    const emblemEmbed = embedBuilder.getEmblemEmbed(discordID, avatar, itemHash, itemState, emblemMetrics, bungieTag);
                                                    await interaction.editReply({embeds: [emblemEmbed]});
                                                    break;
                                                default:
                                                    err('This equipement slot doesn\'t exist.');

                                                    await interaction.editReply({embeds: [embedBuilder.getErrorEmbed({code: 'SLOT_ERROR'})]});
                                                    break;
                                                
                                            }
                                        }
                                    })
                                    .catch(async error => {
                                        err(error.code);
                                        if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                            await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                        }
                                        console.error(error);
                                    });
                                })
                                .catch(async error => {
                                    err(error.code);
                                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                                    }
                                    console.error(error);
                                });
                        }
                    }
                })
                .catch(async error => {
                    err(error.code);
                    if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                        await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                    }
                    console.error(error);
                });
            })
            .catch(async error => {
                err(error.code);
                if(error.code == 'ERR_REQUEST_ABORTED' || error.code=='ECONNABORTED') {
                    await interaction.editReply({embeds: [embedBuilder.getErrorEmbed(error)]});
                }
                console.error(error);
            });
        }
    },
};