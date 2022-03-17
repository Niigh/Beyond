//#region libs
const package = require('../package.json');

const { MessageEmbed } = require('discord.js');

const { BungieAPI } = require('./bungie-api.js');

const db = require('./database-management.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

function getGuardianEmbed (discordID, res) {
    const guardianEmbed = {
        author: {
            name: `${db.getBungieTag(discordID)}: ${bungieAPI.getClass(res.character.data.classType)}`,
            icon_url: ''
        },
        footer: {
            text: `Beyond V${package.version}`
        },
        //image : {
            //url: '../img/icons/armor/class.png',
        //},
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
            text: `Beyond V${package.version}`
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