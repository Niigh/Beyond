//#region libs
const pkg = require('../package.json');

const { BungieAPI } = require('./bungie-api.js');
const bungieAPI = new BungieAPI();

const { DestinyDatabase } = require('./destinydata.js');
const destinyDB = new DestinyDatabase();

const db = require('./userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

function getGuardianEmbed (discordID, res) {
    const equipmentData = res.equipment.data;

    destinyDB.loadDB();
    destinyDB.getEquippedItem(equipmentData.items[3].itemHash);

    const guardianEmbed = {
        author: {
            name: `${db.getBungieTag(discordID)}: ${bungieAPI.getClass(res.character.data.classType)}`,
            icon_url: ''
        },
        footer: {
            text: `Beyond/V${pkg.version}`
        },
        thumbnail: {
            url: bungieAPI.buildURLAsset(res.character.data.emblemPath)
          },
        description: `<:LightLevel:844029708077367297> ${res.character.data.light}`,
        fields: [{
            name: "Weapons",
            value: 
            ` K: ${destinyDB.getEquippedItem(equipmentData.items[0].itemHash)[0]}
              E: ${destinyDB.getEquippedItem(equipmentData.items[1].itemHash)[0]}
              H: ${destinyDB.getEquippedItem(equipmentData.items[2].itemHash)[0]}
            `,
            inline: true
        },
        {
            name: "Armor",
            value: 
            ` Head: ${destinyDB.getEquippedItem(equipmentData.items[3].itemHash)[0]}
              Arms: ${destinyDB.getEquippedItem(equipmentData.items[4].itemHash)[0]}
              Chest: ${destinyDB.getEquippedItem(equipmentData.items[5].itemHash)[0]}
              Legs: ${destinyDB.getEquippedItem(equipmentData.items[6].itemHash)[0]}
              Class: ${destinyDB.getEquippedItem(equipmentData.items[7].itemHash)[0]}
            `,
            inline: true
        }]
    }
    destinyDB.closeDB();
    return guardianEmbed;
}

function getThanksEmbed () {
    const thanksEmbed = {
        color: "dfc8ba",
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
            value: "> M4GNUS\n> Noctyel\n> Leaf",
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