//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdown Beyond'),
    async execute(interaction, bot) {
        inf(`Command shutdown called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        if(interaction.user.id != 325595011993567232) {
            await interaction.reply('You can\'t use this command');
        } else {
            await interaction.reply('Beyond shutting down ...').then(() => {
                bot.destroy();
            });
        }
    },
};