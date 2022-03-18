//#region libs
const { BungieAPI } = require('../lib/bungie-api.js');
bungieAPI = new BungieAPI();
//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    name: 'ready',
    once:true,
    execute(client) {
        inf(`The bot is online and logged as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{
                name: 'Destiny 2'
            }],
            status: 'PLAYING'
        });
        inf(`Bot presence set`);
        bungieAPI.getManifest();
    }
};