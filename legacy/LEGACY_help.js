//#region libs
require('dotenv').config();

//Discord lib
const MessageEmbed = require('discord.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = class Help {
    constructor(message) {
        this.message=message;
    }

//#region Help dispatch
    command(message, args) {
        switch(args[0]) {
            //Default
            case undefined:
                not("General help send.");
                this.help(message.channel);
                break;
            default:
                err(`r!help ${args} : invalid command`);
                message.channel.send(`Commande invalide : tapez **b!help** pour plus d'informations.`)
                break;
        }
    }
//#endregion
//#region Help
    help(channel) {
        let linesTitle = this.message.help.linesTitle;
        let lines = this.message.help.lines;

        const HELP_EMBED = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(this.message.help.title)
            .addFields(
                {name: linesTitle[0], value: lines[0], inline:false}
            )
            .setTimestamp()

        channel.send(HELP_EMBED);
    }
//#endregion
}