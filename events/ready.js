//#region libs
const { BungieAPI } = require('../lib/bungie-api.js');
bungieAPI = new BungieAPI();

const { DestinyDatabase } = require('../lib/destinydata.js');
const destinyDB = new DestinyDatabase();

var CronJob = require('cron').CronJob;

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

        var refreshManifestJob = new CronJob(
            '5 19 * * *',
            function() {
                inf('Refreshing manifest ...');
                bungieAPI.getManifest();
            },
            null,
            false,
            'Europe/London'
        );
        not('Refreshing manifest job created.');
        refreshManifestJob.start();
        inf('Refreshing manifest job started.');
    }

};