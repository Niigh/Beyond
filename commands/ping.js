//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong !'),
    async execute(interaction, bot) {
        inf(`Command ping called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        latency = bot.ws.ping;

        if (latency >= 0 && latency < 120) {
            color = '#A2F546';
        } else if (latency >= 120 && latency < 300) {
            color = '#F5B142';
        } else {
            color = '#F54736';
        }

        const pingEmbed = new MessageEmbed()
            .setColor(color)
            .setDescription(`Pong ! (${latency} ms)`)
            .setTimestamp()
            .setFooter({text: 'Beyond bot\'s ping'});

        await interaction.reply({embeds: [pingEmbed]});
    },
};