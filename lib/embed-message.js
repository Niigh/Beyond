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

class embedBuilder {
    constructor() {
        
    }
};

function getGuardianEmbed (discordID, res, artefactBonus, seasonLevel, bungieTag=undefined) {
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
        color: 0xdfc8ba,
        author: {
            name: `${guardianName}`,
            icon_url: ''
        },
        footer: {
            text: `Beyond | V${pkg.version}`
        },
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

function getThanksEmbed () {
    const thanksEmbed = {
        color: 0xdfc8ba,
        author: {
            name: ``,
        },
        description: "",
        footer: {
            text: `Beyond | V${pkg.version}`
        },
        //image : {
            //url: '', // Beyond Logo
        //},
        fields: [{
            name: "FEEDBACK & IDEAS",
            value: 
            "> M4GNUS\n"+
            "> Geai\n",
            inline: false
        },
        {
            name: "TECHNICAL HELP",
            value: "/",
            inline: false
        }]
    };
    return thanksEmbed;
}

function getAPIDownEmbed () {
    const apiDownEmbed = {
        color: 0x000000,
        author: {
            name: ``,
        },
        description:
        `Destiny 2 API is down, it might be a maintenance ongoing. Check again later.\n\n`+
        `More informations on [Bungie.net](https://help.bungie.net/hc/en-us/articles/360049199271-Destiny-Server-and-Update-Status)\n`,
        footer: {
            text: `Beyond | V${pkg.version}`
        },
    };
    return apiDownEmbed;
}

function getBungieTagErrorEmbed () {
    const bungieTagErrorEmbed = {
        color: 0xE66359,
        author: {
            name: ``,
        },
        description:
        `No Bungie profile found. Are your sure about the Bungie tag ?\n`,
        footer: {
            text: `Beyond | V${pkg.version}`
        },
    };
    return bungieTagErrorEmbed;
}

function getPrivateAccountEmbed (bungieTag) {
    const privateAccountEmbed = {
        color: 0xE66359,
        author: {
            name: ``,
        },
        description:
        `${bungieTag} account is set on private, you won\'t be able to access his informations.\n`,
        footer: {
            text: `Beyond | V${pkg.version}`
        },
    };
    return privateAccountEmbed;
}

function getErrorEmbed (error) {
    const errorEmbed = {
        color: 0xC41E3A,
        author: {
            name: ``,
        },
        description:
        `Something went wrong with the command, please try again.\n\n`+
        `> **Error code:** \'${error.code}\'\n\n`+
        `Please contact \`Nigh#0101\` if the issue continue any further.\n`,
        footer: {
            text: `Beyond | V${pkg.version}`
        },
        //image : {
            //url: '', // Beyond Logo
        //},
    };
    return errorEmbed;
}

function getHelpEmbed (helpFile) {
    const helpEmbed = {
        color: 0xdfc8ba,
        author: {
            name: `COMMANDS LIST`,
        },
        description: "",
        footer: {
            text: `Beyond | V${pkg.version}`
        },
        fields:[]
    };

    for(const cat in helpFile) {
        var embedFieldValue = '';
        for (let val = 0; val < helpFile[cat].length; val++) {
            const commandHelp = helpFile[cat][val];
            embedFieldValue += `> **${commandHelp[0]}**: ${commandHelp[1]}\n`
        };
        helpEmbed.fields.push({name: `${cat.toUpperCase()}`, value: embedFieldValue, inline: false});
    };

    return helpEmbed;
}

module.exports = { 
    getGuardianEmbed, 
    getThanksEmbed,
    getBungieTagErrorEmbed,
    getAPIDownEmbed,
    getPrivateAccountEmbed,
    getErrorEmbed,
    getHelpEmbed
};