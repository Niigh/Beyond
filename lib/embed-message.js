//#region libs
const pkg = require('../package.json');

const { BungieAPI } = require('./bungie-api.js');
const bungieAPI = new BungieAPI();

const { DestinyDatabase } = require('./destinydata.js');
const destinyDB = new DestinyDatabase();

const { DestinyEmote } = require('./destiny-emote.js');
const destinyEmote = new DestinyEmote();

const db = require('./userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

function getGuardianEmbed (discordID, res) {
    const equipmentData = res.equipment.data;

    destinyDB.loadDB();

    const guardianEmbed = {
        color: 0xdfc8ba,
        author: {
            name: `${db.getBungieTag(discordID)}`,
            icon_url: ''
        },
        footer: {
            text: `Beyond/V${pkg.version}`
        },
        thumbnail: {
            url: bungieAPI.buildURLAsset(res.character.data.emblemPath)
          },
        description: 
            `${destinyEmote.getClassEmote(bungieAPI.getClass(res.character.data.classType))} ${destinyDB.getEquippedItem(equipmentData.items[11].itemHash)[0]} ${bungieAPI.getClass(res.character.data.classType)}
             <:LightLevel:844029708077367297> ${res.character.data.light}${destinyDB.getSealTitle(res.character.data.titleRecordHash, res.character.data.genderHash)}
            `,
        fields: [{
            name: "Weapons",
            value: 
            ` K: [${destinyDB.getEquippedItem(equipmentData.items[0].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[0].itemHash}/)
              E: [${destinyDB.getEquippedItem(equipmentData.items[1].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[1].itemHash}/)
              H: [${destinyDB.getEquippedItem(equipmentData.items[2].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[2].itemHash}/)
            `,
            inline: true
        },
        {
            name: "Armor",
            value: 
            ` Head: [${destinyDB.getEquippedItem(equipmentData.items[3].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[3].itemHash}/)
              Arms: [${destinyDB.getEquippedItem(equipmentData.items[4].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[4].itemHash}/)
              Chest: [${destinyDB.getEquippedItem(equipmentData.items[5].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[5].itemHash}/)
              Legs: [${destinyDB.getEquippedItem(equipmentData.items[6].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[6].itemHash}/)
              Class: [${destinyDB.getEquippedItem(equipmentData.items[7].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[7].itemHash}/)
            `,
            inline: true
        },
        {
            name: "Cosmetics",
            value: 
            ` ${destinyEmote.getGhostEmote()} [${destinyDB.getEquippedItem(equipmentData.items[8].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[8].itemHash}/)
              ${destinyEmote.getSparrowEmote()} [${destinyDB.getEquippedItem(equipmentData.items[9].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[9].itemHash}/)
              ${destinyEmote.getShipEmote()} [${destinyDB.getEquippedItem(equipmentData.items[10].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[10].itemHash}/)
              ${destinyEmote.getEmblemEmote()} [${destinyDB.getEquippedItem(equipmentData.items[13].itemHash)[0]}](https://www.light.gg/db/items/${equipmentData.items[13].itemHash}/)
            `,
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