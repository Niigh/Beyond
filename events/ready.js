//#region libs
//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    name: 'ready',
    once:true,
    execute(client) {
        inf(`The bot is online and logged as ${client.user.tag} `);
    },
};