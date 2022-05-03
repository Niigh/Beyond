//#region libs
const { BungieAPI } = require('../lib/bungie-api.js');
const bungieAPI = new BungieAPI();

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

        //Emoji
        // client.emojis.cache.forEach((value) => {
        //     if(value.guild.name == 'Emote #3 - Exotic Armor Perks (1/2)' || value.guild.name == 'Emote #4 - Exotic Armor Perks (2/2)') {
        //         console.log(`this.${value.name.charAt(0).toLowerCase() + value.name.slice(1)} = '<:${value.name}:${value.id}>';`);
        //     }
        // });
        

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