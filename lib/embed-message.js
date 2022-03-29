//#region libs
const pkg = require('../package.json');

const { BungieAPI } = require('./bungie-api.js');
const bungieAPI = new BungieAPI();

const { DestinyDatabase } = require('./destinydata.js');
const destinyDB = new DestinyDatabase();

const { DestinyEmote } = require('./destiny-emote.js');
const destinyEmote = new DestinyEmote();

const userDB = require('./userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

const BEYOND_COLOR = 0xDFC8BA;
const USER_ERROR_COLOR = 0xE66359;
const BOT_ERROR_COLOR = 0xC41E3A;
const API_DOWN_COLOR = 0x000000;

class EmbedBuilder {
    constructor() {
        this.footerContent = `Beyond | V${pkg.version}`;
    }

    getGuardianEmbed (discordID, avatar, res, artefactBonus, seasonLevel, bungieTag=undefined) {
        const equipmentData = res.equipment.data;
    
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        };
    
        const kinetic = destinyDB.getEquippedItem(equipmentData.items[0].itemHash);
        const energetic = destinyDB.getEquippedItem(equipmentData.items[1].itemHash);
        const heavy = destinyDB.getEquippedItem(equipmentData.items[2].itemHash);
    
        const helmet =  destinyDB.getEquippedItem(equipmentData.items[3].itemHash);
        const gauntlets =  destinyDB.getEquippedItem(equipmentData.items[4].itemHash);
        const chest =  destinyDB.getEquippedItem(equipmentData.items[5].itemHash);
        const legs =  destinyDB.getEquippedItem(equipmentData.items[6].itemHash);
        const classItem =  destinyDB.getEquippedItem(equipmentData.items[7].itemHash);
    
        const ghost =  destinyDB.getEquippedItem(equipmentData.items[8].itemHash);
        const sparrow =  destinyDB.getEquippedItem(equipmentData.items[9].itemHash);
        const ship =  destinyDB.getEquippedItem(equipmentData.items[10].itemHash);
        const emblem =  destinyDB.getEquippedItem(equipmentData.items[13].itemHash);
    
        const lightLevel = res.character.data.light;
    
        var mobility = res.character.data.stats[bungieAPI.getArmorStatHash('Mobility')];
        var resilience = res.character.data.stats[bungieAPI.getArmorStatHash('Resilience')];
        var recovery = res.character.data.stats[bungieAPI.getArmorStatHash('Recovery')];
        var discipline = res.character.data.stats[bungieAPI.getArmorStatHash('Discipline')];
        var intellect = res.character.data.stats[bungieAPI.getArmorStatHash('Intellect')];
        var strength = res.character.data.stats[bungieAPI.getArmorStatHash('Strength')];
    
        var seal = destinyDB.getSealTitle(res.character.data.titleRecordHash, res.character.data.genderHash);
        if(!(seal==' ')){
            seal = `\n${destinyEmote.getSealEmote(seal)}${seal}`;
        };
    
        const guardianEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName}`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(res.character.data.emblemPath)
              },
            description: 
                `${destinyEmote.getClassEmote(bungieAPI.getClass(res.character.data.classType))} ${destinyDB.getEquippedItem(equipmentData.items[11].itemHash)[0]} ${bungieAPI.getClass(res.character.data.classType)}${seal}\n\n`+
                `${destinyEmote.getLightLevelEmote()} ${lightLevel-artefactBonus} (+${artefactBonus}) | ${lightLevel}\n`+
                `${destinyEmote.getSeasonEmote('Risen')} Season Pass Lv. ${seasonLevel}`,
            fields: [{
                name: "Stats",
                value: 
                `${destinyEmote.getStatEmote('Mobility')} ${mobility} `+
                `${destinyEmote.getStatEmote('Discipline')} ${discipline} `+
                `${destinyEmote.getStatEmote('Resilience')} ${resilience} `+
                `${destinyEmote.getStatEmote('Intellect')} ${intellect} `+
                `${destinyEmote.getStatEmote('Recovery')} ${recovery} `+
                `${destinyEmote.getStatEmote('Strength')} ${strength}`,
                inline: false
            },
            {
                name: "Weapons",
                value: 
                `${destinyEmote.getWeaponEmote(kinetic[1])} [${kinetic[0]}](https://www.light.gg/db/items/${equipmentData.items[0].itemHash}/)\n`+
                `${destinyEmote.getWeaponEmote(energetic[1],1)} [${energetic[0]}](https://www.light.gg/db/items/${equipmentData.items[1].itemHash}/)\n`+
                `${destinyEmote.getWeaponEmote(heavy[1])} [${heavy[0]}](https://www.light.gg/db/items/${equipmentData.items[2].itemHash}/)\n`,
                inline: true
            },
            {
                name: "Armor",
                value: 
                `${destinyEmote.getArmorEmote(helmet[1])} [${helmet[0]}](https://www.light.gg/db/items/${equipmentData.items[3].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(gauntlets[1])} [${gauntlets[0]}](https://www.light.gg/db/items/${equipmentData.items[4].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(chest[1])} [${chest[0]}](https://www.light.gg/db/items/${equipmentData.items[5].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(legs[1])} [${legs[0]}](https://www.light.gg/db/items/${equipmentData.items[6].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(classItem[1])} [${classItem[0]}](https://www.light.gg/db/items/${equipmentData.items[7].itemHash}/)\n`,
                inline: true
            },
            {
                name: "Cosmetics",
                value: 
                `${destinyEmote.getGhostEmote()} [${ghost[0]}](https://www.light.gg/db/items/${equipmentData.items[8].itemHash}/)\n`+
                `${destinyEmote.getSparrowEmote()} [${sparrow[0]}](https://www.light.gg/db/items/${equipmentData.items[9].itemHash}/)\n`+
                `${destinyEmote.getShipEmote()} [${ship[0]}](https://www.light.gg/db/items/${equipmentData.items[10].itemHash}/)\n`+
                `${destinyEmote.getEmblemEmote()} [${emblem[0]}](https://www.light.gg/db/items/${equipmentData.items[13].itemHash}/)\n`,
                inline: false
            }]
        };
        destinyDB.closeDB();
        return guardianEmbed;
    }

    getWeaponEmbed(discordID, avatar, weaponSlot, weaponHash, weaponState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        };
    
        const weapon = destinyDB.getEquippedItem(weaponSlot.itemHash);
    }

    getArmorEmbed(discordID, avatar, armorSlot, armorHash, armorState, bungieTag=undefined) {
        
    }

    getGhostEmbed(discordID, avatar, ghost, ghostHash, ghostState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        };
    
        const ghostItem = destinyDB.getDetailedEquippedItem(ghostHash);

        const source = destinyDB.getSource(ghostItem.collectibleHash);
        const season = destinyDB.getSeason(ghostItem.collectibleHash);

        const energy = [ghost.instance.data.energy.energyCapacity, ghost.instance.data.energy.energyUsed, ghost.instance.data.energy.energyUnused];

        // Mods
        const ghostModsArray = []
        var ghostModsField = "";
        if (ghost.perks.data == undefined) {
            dbg('No mod equipped.');
            ghostModsField = "No mod equipped.\n";
        } else {
            ghost.perks.data.perks.forEach( item => {
                const mod = destinyDB.getMod(item.perkHash, ghost.sockets.data.sockets);
                ghostModsArray.push([mod[0].displayProperties.name, mod[0].displayProperties.description, mod[1], mod[2]]);
            });
            ghostModsArray.forEach( mod => {
                ghostModsField += `[${mod[0]}](https://www.light.gg/db/items/${mod[3]}/) **| ${mod[2]}** ${destinyEmote.getGhostModEnergy(mod[2])}\n`;
            });
        }

        //Cosmetics
        const ghostCosmeticsArray = destinyDB.getGhostCosmetics(ghost.sockets.data.sockets);
        var ghostCosmeticsField = "";
        ghostCosmeticsField += `SHADER **|** [${ghostCosmeticsArray[0].displayProperties.name}](https://www.light.gg/db/items/${ghostCosmeticsArray[0].hash}/)\n`;
        ghostCosmeticsField += `GHOST PROJECTION **|** [${ghostCosmeticsArray[1].displayProperties.name}](https://www.light.gg/db/items/${ghostCosmeticsArray[1].hash}/)\n`;

        const ghostEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Ghost Shell`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(ghostItem.displayProperties.icon)
              },
            title: `${destinyEmote.getItemLockStateEmote(ghostState.includes('Locked'))}${ghostItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${ghostHash}/`,
            description: 
                `**${ghostItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            fields: [
            {
                name: `ENERGY`,
                value: 
                `**USED : ${energy[1]} / ${energy[0]}**\n`+
                `${destinyEmote.getElementGaugeEmote('Ghost',energy[0],energy[1])}\n\u200b\n`,
                inline: false
            },
            {
                name: `GHOST MODS`,
                value: `${ghostModsField}\u200b\n`,
                inline: false
            },
            {
                name: `GHOST COSMETICS`,
                value: 
                `${ghostCosmeticsField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(ghostItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return ghostEmbed;
    }

    getSparrowEmbed(discordID, avatar, sparrow, sparrowHash, sparrowState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        };

        const sparrowItem = destinyDB.getDetailedEquippedItem(sparrowHash);

        const source = destinyDB.getSource(sparrowItem.collectibleHash);
        const season = destinyDB.getSeason(sparrowItem.collectibleHash);

        const perks = destinyDB.getPerks(sparrow.perks.data.perks);
        var perksField = "";
        perks.forEach(perk => {
            perksField += `${perk}\n`;
        });

        //Cosmetics
        const sparrowShader = destinyDB.getShader(sparrow.sockets.data.sockets);
        var sparrowShaderField = `SHADER **|** [${sparrowShader.displayProperties.name}](https://www.light.gg/db/items/${sparrowShader.hash}/)\n`;

        const sparrowEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Sparrow`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(sparrowItem.displayProperties.icon)
              },
            title: `${destinyEmote.getItemLockStateEmote(sparrowState.includes('Locked'))}${sparrowItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${sparrowHash}/`,
            description: 
                `**${sparrowItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            fields: [
            {
                name: `PERKS`,
                value: 
                `${perksField}\u200b\n`,
                inline: false
            },
            {
                name: `SPARROW COSMETICS`,
                value: 
                `${sparrowShaderField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(sparrowItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return sparrowEmbed;
    }

    getShipEmbed(discordID, avatar, ship, shipHash, shipState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        };

        const shipItem = destinyDB.getDetailedEquippedItem(shipHash);

        const source = destinyDB.getSource(shipItem.collectibleHash);
        const season = destinyDB.getSeason(shipItem.collectibleHash);

        //Cosmetics
        const shipCosmeticsArray = destinyDB.getShipCosmetics(ship.sockets.data.sockets);
        var shipCosmeticsField = "";
        shipCosmeticsField += `SHADER **|** [${shipCosmeticsArray[0].displayProperties.name}](https://www.light.gg/db/items/${shipCosmeticsArray[0].hash}/)\n`;
        shipCosmeticsField += `TRANSMAT EFFECT **|** [${shipCosmeticsArray[1].displayProperties.name}](https://www.light.gg/db/items/${shipCosmeticsArray[1].hash}/)\n`;

        const shipEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Ship`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(shipItem.displayProperties.icon)
              },
            title: `${destinyEmote.getItemLockStateEmote(shipState.includes('Locked'))}${shipItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${shipHash}/`,
            description: 
                `**${shipItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            fields: [
            {
                name: `SPARROW COSMETICS`,
                value: 
                `${shipCosmeticsField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(shipItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return shipEmbed;
    }

    getEmblemEmbed(discordID, avatar, emblem, emblemHash, emblemState, bungieTag=undefined) {
        
    }

    getSubclassEmbed(discordID, avatar, subclass, subclassHash, bungieTag=undefined) {
        
    }

    getAccountLinkErrorEmbed (discordID) {
        const accountLinkErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Your account is already linked : ${userDB.getBungieTag(discordID)}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountLinkErrorEmbed;
    }

    getAccountUnlinkErrorEmbed () {
        const accountUnlinkErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `You don\'t have any linked Bungie profile.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountUnlinkErrorEmbed;
    }

    getAccountLinkedEmbed (bungieTag) {
        const accountLinkedEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description:
            `You linked your account: ${bungieTag}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountLinkedEmbed;
    }

    getAccountUnlinkedEmbed (bungieTag) {
        const accountUnlinkedEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description:
            `You unlinked your account: ${bungieTag}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountUnlinkedEmbed;
    }

    getNotLinkedErrorEmbed () {
        const notLinkedErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Your Bungie Profile isn\'t linked. Please use /link to register your Bungie profile.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return notLinkedErrorEmbed;
    }
    
    getAPIDownEmbed () {
        const apiDownEmbed = {
            color: API_DOWN_COLOR,
            author: {
                name: ``,
            },
            description:
            `Destiny 2 API is down, it might be a maintenance ongoing. Check again later.\n\n`+
            `More informations on [Bungie.net](https://help.bungie.net/hc/en-us/articles/360049199271-Destiny-Server-and-Update-Status)\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return apiDownEmbed;
    }
    getRequestErrorEmbed () {
        const requestErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `An error occured with your account. Is there a Destiny 2 account connected ?\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return requestErrorEmbed;
    }
    
    getBungieTagErrorEmbed () {
        const bungieTagErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `No Bungie profile found. Are your sure about the Bungie tag ?\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return bungieTagErrorEmbed;
    }
    
    getPrivateAccountEmbed (bungieTag) {
        const privateAccountEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `**${bungieTag}** account is set on private, you won\'t be able to access his informations.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return privateAccountEmbed;
    }
    
    getErrorEmbed (error) {
        const errorEmbed = {
            color: BOT_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Something went wrong with the command, please try again.\n\n`+
            `> **Error code:** \`${error.code}\`\n\n`+
            `Please contact \`Nigh#0101\` if the issue continue any further.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return errorEmbed;
    }
    
    getHelpEmbed (helpFile) {
        const helpEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `COMMANDS LIST`,
            },
            description: "",
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            fields:[]
        };
    
        for(const cat in helpFile) {
            var embedFieldValue = '';
            for (let i = 0; i < helpFile[cat].length; i++) {
                const commandHelp = helpFile[cat][i];
                embedFieldValue += `> **${commandHelp[0]}**: ${commandHelp[1]}\n`
            };
            helpEmbed.fields.push({name: `${cat.toUpperCase()}`, value: embedFieldValue, inline: false});
        };
    
        return helpEmbed;
    }

    getThanksEmbed (teamFile) {
        const thanksEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description: "",
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            //image : {
                //url: '', // Beyond Logo
            //},
            fields: []
        };

        for(const cat in teamFile) {
            var embedFieldValue = '';
            for (let i = 0; i < teamFile[cat].length; i++) {
                const teamName = teamFile[cat][i];
                embedFieldValue += `> ${teamName}\n`
            };
            thanksEmbed.fields.push({name: `${cat.toUpperCase()}`, value: embedFieldValue, inline: false});
        };
        return thanksEmbed;
    }
};

module.exports = { EmbedBuilder };