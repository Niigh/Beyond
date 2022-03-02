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
        }
    }
    return guardianEmbed;
}

module.exports = { getGuardianEmbed };