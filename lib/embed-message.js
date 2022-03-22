//#region libs
const pkg = require('../package.json');

const { BungieAPI } = require('./bungie-api.js');
const bungieAPI = new BungieAPI();

const db = require('./userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

function getGuardianEmbed (discordID, res) {
    equipmentData = res.equipment.data;
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
            ` K: ${equipmentData.items[0].itemHash}
              E: ${equipmentData.items[1].itemHash}
              H: ${equipmentData.items[2].itemHash}
            `,
            inline: true
        },
        {
            name: "Armor",
            value: 
            ` Head: ${equipmentData.items[3].itemHash}
              Arms: ${equipmentData.items[4].itemHash}
              Chest: ${equipmentData.items[5].itemHash}
              Legs: ${equipmentData.items[6].itemHash}
              Class: ${equipmentData.items[7].itemHash}
            `,
            inline: true
        }]
    }
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