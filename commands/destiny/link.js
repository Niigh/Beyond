//#region libs
const { SlashCommandBuilder } = require('@discordjs/builders');

const { BungieAPI } = require(`../../lib/bungie-api.js`);

//Trace module
const {err, wrn, inf, not, dbg} = require('../../trace.js');
//#endregion

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link you Guardian\'s tag')
        .addStringOption(options =>
            options.setName('bungie-tag')
            .setDescription('Link your Bungie tag to your Discord account')
            .setRequired(true))
        .addStringOption(options =>
            options.setName('plateform')
            .setDescription('Only needed if the user does not have Cross Save activated. This will be ignored otherwise')
            .setRequired(false)
            .addChoice('PSN', 'PSN')
            .addChoice('Xbox', 'Xbox')
            .addChoice('Steam', 'Steam')
            .addChoice('Stadia', 'Stadia')),
    async execute(interaction, guildData) {
        inf(`Command link called by ${interaction.user.tag} (ID: ${interaction.user.id}) in channel ID <${interaction.channel.id}>`);
        const discordID = interaction.user.id;
        const bungieTag = interaction.options.getString('bungie-tag');

        if(guildData.isExistingLinkedUser(discordID)) {
            inf('This user is already registered.');
            await interaction.reply({content: `Your account is already linked : ${guildData.getLinkedUser(discordID).UniqueBungieName}`, ephemeral: true});
            return;
        }

        bungieAPI = new BungieAPI();
        bungieAPI.get(`/Destiny2/SearchDestinyPlayer/-1/${bungieTag}/`)
            .then(res => {
                //console.log(`statusCode: ${res.status}`)
                //console.log(res.data.Response)
                if(bungieAPI.isBungieAPIDown(res)) {
                    await interaction.reply('Destiny 2 API is down, it might be a maintenance ongoing. Check again later.');
                    return;
                };
              })
            .catch(error => {
                console.error(error)
            })
        
        //{ memID, memType } = guildData.GetValidDestinyMembership();

        await interaction.reply('You linked your account.');
    },
};