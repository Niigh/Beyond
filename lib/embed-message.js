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

function getGuardianEmbed (discordID, res, artefactBonus) {
    const equipmentData = res.equipment.data;

    destinyDB.loadDB();

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

    const guardianEmbed = {
        color: 0xdfc8ba,
        author: {
            name: `${userDB.getBungieTag(discordID)}`,
            icon_url: ''
        },
        footer: {
            text: `Beyond | V${pkg.version}`
        },
        thumbnail: {
            url: bungieAPI.buildURLAsset(res.character.data.emblemPath)
          },
        description: 
            `${destinyEmote.getClassEmote(bungieAPI.getClass(res.character.data.classType))} ${destinyDB.getEquippedItem(equipmentData.items[11].itemHash)[0]} ${bungieAPI.getClass(res.character.data.classType)}\n`+
            `${destinyEmote.getLightLevelEmote()} ${lightLevel-artefactBonus} (+${artefactBonus}) | ${lightLevel}\n`+
            `${destinyEmote.getSeasonEmote('Risen')} Season Pass L. ${0}${destinyDB.getSealTitle(res.character.data.titleRecordHash, res.character.data.genderHash)}`,
        fields: [{
            name: "Weapons",
            value: 
            `K: [${kinetic[0]}](https://www.light.gg/db/items/${equipmentData.items[0].itemHash}/)\n`+
            `E: [${energetic[0]}](https://www.light.gg/db/items/${equipmentData.items[1].itemHash}/)\n`+
            `H: [${heavy[0]}](https://www.light.gg/db/items/${equipmentData.items[2].itemHash}/)\n`,
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
    }
    destinyDB.closeDB();
    return guardianEmbed;
}

function getThanksEmbed () {
    const thanksEmbed = {
        color: 0xdfc8ba,
        author: {
            name: `THANKS TO`,
        },
        description: "",
        footer: {
            text: `Beyond/V${pkg.version}`
        },
        //image : {
            //url: '', // Beyond Logo
        //},
        fields: [{
            name: "FEEDBACK & IDEAS",
            value: "> M4GNUS",
            inline: false
        },
        {
            name: "TECHNICAL HELP",
            value: "/",
            inline: false
        }]
    }
    return thanksEmbed;
}

module.exports = { 
    getGuardianEmbed, 
    getThanksEmbed
};