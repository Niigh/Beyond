//#region libs
const pkg = require('../package.json');

const { BungieAPI } = require('./bungie-api.js');
const bungieAPI = new BungieAPI();

const { DestinyDatabase } = require('./destinydata.js');
const destinyDB = new DestinyDatabase();

const { DestinyEmote } = require('./destiny-emote.js');
const destinyEmote = new DestinyEmote();

const userDB = require('./userdata.js');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

const BEYOND_COLOR = 0xDFC8BA;
const USER_ERROR_COLOR = 0xE66359;
const BOT_ERROR_COLOR = 0xC41E3A;
const API_DOWN_COLOR = 0x000000;

class EmbedBuilder {
    constructor() {
        this.footerContent = `Beyond | V${pkg.version}`;
    }

    getGuardianEmbed (discordID, avatar, res, artefactBonus, seasonLevel, bungieTag=undefined) {
        const equipmentData = res.equipment.data;
    
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }
    
        const kinetic = destinyDB.getEquippedItem(equipmentData.items[0].itemHash);
        const energetic = destinyDB.getEquippedItem(equipmentData.items[1].itemHash);
        const heavy = destinyDB.getEquippedItem(equipmentData.items[2].itemHash);
    
        const helmet =  destinyDB.getEquippedItem(equipmentData.items[3].itemHash);
        const gauntlets =  destinyDB.getEquippedItem(equipmentData.items[4].itemHash);
        const chest =  destinyDB.getEquippedItem(equipmentData.items[5].itemHash);
        const legs =  destinyDB.getEquippedItem(equipmentData.items[6].itemHash);
        const classItem =  destinyDB.getEquippedItem(equipmentData.items[7].itemHash);
    
        const ghost =  destinyDB.getEquippedItem(equipmentData.items[8].itemHash);
        const sparrow =  destinyDB.getEquippedItem(equipmentData.items[9].itemHash);
        const ship =  destinyDB.getEquippedItem(equipmentData.items[10].itemHash);
        const emblem =  destinyDB.getEquippedItem(equipmentData.items[13].itemHash);
    
        const lightLevel = res.character.data.light;
    
        var mobility = res.character.data.stats[bungieAPI.getArmorStatHash('Mobility')];
        var resilience = res.character.data.stats[bungieAPI.getArmorStatHash('Resilience')];
        var recovery = res.character.data.stats[bungieAPI.getArmorStatHash('Recovery')];
        var discipline = res.character.data.stats[bungieAPI.getArmorStatHash('Discipline')];
        var intellect = res.character.data.stats[bungieAPI.getArmorStatHash('Intellect')];
        var strength = res.character.data.stats[bungieAPI.getArmorStatHash('Strength')];
    
        var seal = destinyDB.getSealTitle(res.character.data.titleRecordHash, res.character.data.genderHash);
        if(seal!=' '){
            seal = `\n${destinyEmote.getSealEmote(seal)} ${seal}`;
        }
    
        const guardianEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName}`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(res.character.data.emblemPath)
              },
            description: 
                `${destinyEmote.getClassEmote(bungieAPI.getClass(res.character.data.classType))} ${destinyDB.getEquippedItem(equipmentData.items[11].itemHash)[0]} ${bungieAPI.getClass(res.character.data.classType)}${seal}\n\n`+
                `${destinyEmote.getLightLevelEmote()} ${lightLevel-artefactBonus} (+${artefactBonus}) | ${lightLevel}\n`+
                `${destinyEmote.getSeasonEmote('Risen')} Season Pass Lv. ${seasonLevel}`,
            fields: [{
                name: "Stats",
                value: 
                `${destinyEmote.getStatEmote('Mobility')} ${mobility} `+
                `${destinyEmote.getStatEmote('Discipline')} ${discipline} `+
                `${destinyEmote.getStatEmote('Resilience')} ${resilience} `+
                `${destinyEmote.getStatEmote('Intellect')} ${intellect} `+
                `${destinyEmote.getStatEmote('Recovery')} ${recovery} `+
                `${destinyEmote.getStatEmote('Strength')} ${strength}`,
                inline: false
            },
            {
                name: "Weapons",
                value: 
                `${destinyEmote.getWeaponEmote(kinetic[1])} [${kinetic[0]}](https://www.light.gg/db/items/${equipmentData.items[0].itemHash}/)\n`+
                `${destinyEmote.getWeaponEmote(energetic[1],1)} [${energetic[0]}](https://www.light.gg/db/items/${equipmentData.items[1].itemHash}/)\n`+
                `${destinyEmote.getWeaponEmote(heavy[1])} [${heavy[0]}](https://www.light.gg/db/items/${equipmentData.items[2].itemHash}/)\n`,
                inline: true
            },
            {
                name: "Armor",
                value: 
                `${destinyEmote.getArmorEmote(helmet[1])} [${helmet[0]}](https://www.light.gg/db/items/${equipmentData.items[3].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(gauntlets[1])} [${gauntlets[0]}](https://www.light.gg/db/items/${equipmentData.items[4].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(chest[1])} [${chest[0]}](https://www.light.gg/db/items/${equipmentData.items[5].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(legs[1])} [${legs[0]}](https://www.light.gg/db/items/${equipmentData.items[6].itemHash}/)\n`+
                `${destinyEmote.getArmorEmote(classItem[1])} [${classItem[0]}](https://www.light.gg/db/items/${equipmentData.items[7].itemHash}/)\n`,
                inline: true
            },
            {
                name: "Cosmetics",
                value: 
                `${destinyEmote.getGhostEmote()} [${ghost[0]}](https://www.light.gg/db/items/${equipmentData.items[8].itemHash}/)\n`+
                `${destinyEmote.getSparrowEmote()} [${sparrow[0]}](https://www.light.gg/db/items/${equipmentData.items[9].itemHash}/)\n`+
                `${destinyEmote.getShipEmote()} [${ship[0]}](https://www.light.gg/db/items/${equipmentData.items[10].itemHash}/)\n`+
                `${destinyEmote.getEmblemEmote()} [${emblem[0]}](https://www.light.gg/db/items/${equipmentData.items[13].itemHash}/)\n`,
                inline: false
            }]
        };
        destinyDB.closeDB();
        return guardianEmbed;
    }

    getWeaponEmbed(discordID, avatar, weaponSlot, weapon, weaponHash, weaponState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }

        const weaponItem = destinyDB.getDetailedEquippedItem(weaponHash);

        var embedTitle = `${destinyEmote.getItemLockStateEmote(weaponState.includes('Locked'))}${weaponItem.displayProperties.name}`;

        // Fields
        const fieldsArray = [];

        // Deepsight
        const deepsightResonanceField = {name: `DEEPSIGHT`, value: ``, inline: false};
        if(weapon.plugObjectives.data != undefined) {
            const deepsightResonance = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Deepsight Resonance');
            if (deepsightResonance != undefined) {
                const craftingMaterials = destinyDB.getCraftingMaterialsFromDeepsight(weapon.plugObjectives.data.objectivesPerPlug);
                deepsightResonanceField.value = 
                `${destinyEmote.getDeepsightResonanceEmote()} **Attunment Progress** ${deepsightResonance[0].progress/10} / 100 %\n`+
                `> ${destinyEmote.getCraftingMaterialsEmote(craftingMaterials[0])} 12 **|** ${destinyEmote.getCraftingMaterialsEmote('Neutral Element')} 200\n`+
                `> ${destinyEmote.getCraftingMaterialsEmote(craftingMaterials[1])} 12 **|** ${destinyEmote.getCraftingMaterialsEmote('Neutral Element')} 200\n\u200b\n`;
                fieldsArray.push(deepsightResonanceField);
            }
        }

        // Crafted weapon
        const craftedStatsField = {name: `CRAFTED STATS`, value: ``, inline: false};
        if(weapon.plugObjectives.data != undefined) {
            const craftedObjectives = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Shaped Weapon');
            if (craftedObjectives != undefined) {
                embedTitle = `${destinyEmote.getItemLockStateEmote(weaponState.includes('Locked'))} ${destinyEmote.getCraftedEmote()} ${weaponItem.displayProperties.name}`;
                
                const weaponLevel = destinyDB.getObjectivesByName(craftedObjectives, 'Weapon Level').progress;
                const levelProgress = destinyDB.getObjectivesByName(craftedObjectives, 'Level Progress').progress;
                const unixTimestamp = destinyDB.getObjectivesByName(craftedObjectives, 'Shaping Date').progress;

                const shapingDate = new Date(unixTimestamp*1000);
                const shapingDateString = shapingDate.toLocaleString('en-GB', {timeZoneName: 'short', hour12: false});
                
                craftedStatsField.value = 
                `**Lv.** ${weaponLevel} | **Level progress** ${levelProgress/10} / 100%\n`+
                `**Shaped on** ${shapingDateString}`;
                fieldsArray.push(craftedStatsField);
            }
        }

        const sockets = destinyDB.getSockets(weapon.sockets.data.sockets);

        const intrinsic = destinyDB.getIntrinsicPerk(sockets);
        const intrinsicField = `**${intrinsic.name}**\n`;

        // Perks
        const perksField = {name: `PERKS`, value: ``, inline: true};
        const perks = sockets.slice(1,5);
        perksField.value += `**[${perks[0].displayProperties.name}](https://www.light.gg/db/items/${perks[0].hash}/)**\n`;
        perksField.value += `**[${perks[1].displayProperties.name}](https://www.light.gg/db/items/${perks[1].hash}/)**\n`;
        fieldsArray.push(perksField);
        for (let i = 2; i < perks.length; i+=2) {
            const perksFieldAdd = {name: `\u200b`, value: ``, inline: true};
            perksFieldAdd.value += `**[${perks[i].displayProperties.name}](https://www.light.gg/db/items/${perks[i].hash}/)**\n`;
            perksFieldAdd.value += `**[${perks[i+1].displayProperties.name}](https://www.light.gg/db/items/${perks[i+1].hash}/)**\n`;
            fieldsArray.push(perksFieldAdd);
        }

        const trait = destinyDB.getOriginTrait(weapon.sockets.data.sockets);
        const traitField = {name: `ORIGIN TRAIT`, value: `None.`, inline: false};
        if (trait != undefined) {
            traitField.value = `**[${trait.displayProperties.name}](https://www.light.gg/db/items/${trait.hash}/)**\n> ${trait.displayProperties.description}\n`;
        }
        fieldsArray.push(traitField);
        
        const cosmeticsField ={name: `COSMETICS`, value: `\u200b`, inline: false};

        if(weaponItem.inventory.tierTypeName != 'Exotic'){
            //Mod
            const modField ={name: `MOD`, value: `No mod equipped.`, inline: true};
            const mod = destinyDB.getWeaponMod(weapon.sockets.data.sockets);
            if(mod != undefined) {
                modField.value = `**[${mod.displayProperties.name}](https://www.light.gg/db/items/${mod.hash}/)**`;
            }
            fieldsArray.push(modField);
            //Cosmetics
            const shader = destinyDB.getShader(weapon.sockets.data.sockets);
            if(shader != undefined) {
                cosmeticsField.value = `**[${shader.displayProperties.name}](https://www.light.gg/db/items/${shader.hash}/)**`;
                cosmeticsField.inline = true;
            }
        }

        const ornement = destinyDB.getWeaponOrnement(weapon.sockets.data.sockets);
        if(ornement != undefined) {
            cosmeticsField.value = `**[${ornement.displayProperties.name}](https://www.light.gg/db/items/${ornement.hash}/)**`;
        }

        if(cosmeticsField.value != `\u200b`) {
            fieldsArray.push(cosmeticsField);
        }

        const ammoType = bungieAPI.getAmmoType(weaponItem.equippingBlock.ammoType);

        const weaponEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - ${weaponSlot} weapon`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: `attachment://itemThumbail.png`
                },
            title: embedTitle,
            url: `https://www.light.gg/db/items/${weaponHash}/`,
            description:
                `${intrinsicField}\n`+
                `${destinyEmote.getAmmoTypeEmote(ammoType)} **${ammoType} ammo**\n`+
                `${destinyEmote.getElementEmote(bungieAPI.getEnergyType(weaponItem.defaultDamageType))} **${weapon.instance.data.primaryStat.value}**\n`+
                `\u200b\n`,
            fields: fieldsArray,

        };

        destinyDB.closeDB();
        return weaponEmbed;
    }

    geExtendedWeaponEmbed(discordID, avatar, weaponSlot, weapon, weaponHash, weaponState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }

        const weaponItem = destinyDB.getDetailedEquippedItem(weaponHash);

        var image = bungieAPI.buildURLAsset(weaponItem.screenshot);

        var embedTitle = `${destinyEmote.getItemLockStateEmote(weaponState.includes('Locked'))}${weaponItem.displayProperties.name}`;

        // Fields
        const fieldsArray = [];

        // Deepsight
        const deepsightResonanceField = {name: `DEEPSIGHT`, value: ``, inline: false};
        if(weapon.plugObjectives.data != undefined) {
            const deepsightResonance = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Deepsight Resonance');
            if (deepsightResonance != undefined) {
                const craftingMaterials = destinyDB.getCraftingMaterialsFromDeepsight(weapon.plugObjectives.data.objectivesPerPlug);
                deepsightResonanceField.value = 
                `${destinyEmote.getDeepsightResonanceEmote()} **Attunment Progress** ${deepsightResonance[0].progress/10} / 100 %\n`+
                `> ${destinyEmote.getCraftingMaterialsEmote(craftingMaterials[0])} 12 **|** ${destinyEmote.getCraftingMaterialsEmote('Neutral Element')} 200\n`+
                `> ${destinyEmote.getCraftingMaterialsEmote(craftingMaterials[1])} 12 **|** ${destinyEmote.getCraftingMaterialsEmote('Neutral Element')} 200\n\u200b\n`;
                fieldsArray.push(deepsightResonanceField);
            }
        }

        // Crafted weapon
        const craftedStatsField = {name: `CRAFTED STATS`, value: ``, inline: false};
        if(weapon.plugObjectives.data != undefined) {
            const craftedObjectives = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Shaped Weapon');
            if (craftedObjectives != undefined) {
                embedTitle = `${destinyEmote.getItemLockStateEmote(weaponState.includes('Locked'))} ${destinyEmote.getCraftedEmote()} ${weaponItem.displayProperties.name}`;
                
                const weaponLevel = destinyDB.getObjectivesByName(craftedObjectives, 'Weapon Level').progress;
                const levelProgress = destinyDB.getObjectivesByName(craftedObjectives, 'Level Progress').progress;
                const unixTimestamp = destinyDB.getObjectivesByName(craftedObjectives, 'Shaping Date').progress;

                const shapingDate = new Date(unixTimestamp*1000);
                const shapingDateString = shapingDate.toLocaleString('en-GB', {timeZoneName: 'short', hour12: false});
                
                craftedStatsField.value = 
                `**Lv.** ${weaponLevel} | **Level progress** ${levelProgress/10} / 100%\n`+
                `**Shaped on** ${shapingDateString}`;
                fieldsArray.push(craftedStatsField);
            }
        }

        const sockets = destinyDB.getSockets(weapon.sockets.data.sockets);

        const intrinsic = destinyDB.getIntrinsicPerk(sockets);
        const intrinsicField = `**${intrinsic.name} |** ${intrinsic.description}\n`;

        // Perks
        const perksField = {name: `PERKS`, value: ``, inline: true};
        const perks = sockets.slice(1,5);
        perksField.value += `**[${perks[0].displayProperties.name}](https://www.light.gg/db/items/${perks[0].hash}/)**\n`;
        perksField.value += `**[${perks[1].displayProperties.name}](https://www.light.gg/db/items/${perks[1].hash}/)**\n`;
        fieldsArray.push(perksField);
        for (let i = 2; i < perks.length; i+=2) {
            const perksFieldAdd = {name: `\u200b`, value: ``, inline: true};
            perksFieldAdd.value += `**[${perks[i].displayProperties.name}](https://www.light.gg/db/items/${perks[i].hash}/)**\n`;
            perksFieldAdd.value += `**[${perks[i+1].displayProperties.name}](https://www.light.gg/db/items/${perks[i+1].hash}/)**\n`;
            fieldsArray.push(perksFieldAdd);
        }

        const trait = destinyDB.getOriginTrait(weapon.sockets.data.sockets);
        const traitField = {name: `ORIGIN TRAIT`, value: `None.`, inline: false};
        if (trait != undefined) {
            traitField.value = `**[${trait.displayProperties.name}](https://www.light.gg/db/items/${trait.hash}/)**\n> ${trait.displayProperties.description}\n`;
        }
        fieldsArray.push(traitField);
        
        const cosmeticsField ={name: `COSMETICS`, value: `\u200b`, inline: false};

        if(weaponItem.inventory.tierTypeName != 'Exotic'){
            //Mod
            const modField ={name: `MOD`, value: `No mod equipped.`, inline: true};
            const mod = destinyDB.getWeaponMod(weapon.sockets.data.sockets);
            if(mod != undefined) {
                modField.value = `**[${mod.displayProperties.name}](https://www.light.gg/db/items/${mod.hash}/)**`;
            }
            fieldsArray.push(modField);
            //Cosmetics
            const shader = destinyDB.getShader(weapon.sockets.data.sockets);
            if(shader != undefined) {
                cosmeticsField.value = `**[${shader.displayProperties.name}](https://www.light.gg/db/items/${shader.hash}/)**`;
                cosmeticsField.inline = true;
            }
        }

        const ornement = destinyDB.getWeaponOrnement(weapon.sockets.data.sockets);
        if(ornement != undefined) {
            cosmeticsField.value = `**[${ornement.displayProperties.name}](https://www.light.gg/db/items/${ornement.hash}/)**`;
            if(ornement.displayProperties.name != 'Default Ornament') {
                image = bungieAPI.buildURLAsset(ornement.screenshot);
            }
        }

        if(cosmeticsField.value != `\u200b`) {
            fieldsArray.push(cosmeticsField);
        }

        // Trackers
        const trackersField = {name: `TRACKERS`, value: ``, inline: false};

        if(weapon.plugObjectives.data != undefined) {
            const killTracker = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Kill Tracker');
            if (killTracker != undefined) {
                trackersField.value += `${destinyEmote.getKillTrackerEmote('PVE')} Enemies Defeated : ${killTracker[0].progress}\n`;
            }
            const crucibleTracker = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Crucible Tracker');
            if(crucibleTracker != undefined) {
                trackersField.value += `${destinyEmote.getKillTrackerEmote('PVP')} Crucible Opponents Defeated : ${crucibleTracker[0].progress}\n`;
            }
            const catalystTracker = destinyDB.getObjectivePlugByName(weapon.plugObjectives.data.objectivesPerPlug, 'Catalyst');
            if(catalystTracker != undefined && killTracker == undefined && crucibleTracker == undefined) {
                trackersField.value += `${destinyEmote.getKillTrackerEmote('PVE')} Enemies Defeated : ${catalystTracker[0].progress}\n`;
            }
            if (trackersField.value == '') {
                wrn('No trackers found.');
                trackersField.value = 'No trackers found.';
            }
        }
        fieldsArray.push(trackersField);

        //#region Stats
        const statsField = {name: `STATS`, value: ``, inline: true};
        //Specific to weapon types
        var RPM;
        var drawTime;
        var chargeTime;
        var swingSpeed;
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Rounds Per Minute') != undefined) {
            RPM = destinyDB.getStatsByName(weapon.stats.data.stats, 'Rounds Per Minute').value;
            statsField.value += `**RPM** ${RPM}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Draw Time') != undefined) {
            drawTime = destinyDB.getStatsByName(weapon.stats.data.stats, 'Draw Time').value;
            statsField.value += `**Draw Time** ${drawTime}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Charge Time') != undefined) {
            chargeTime = destinyDB.getStatsByName(weapon.stats.data.stats, 'Charge Time').value;
            statsField.value += `**Charge Time** ${chargeTime}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Swing Speed') != undefined) {
            swingSpeed = destinyDB.getStatsByName(weapon.stats.data.stats, 'Swing Speed').value;
            statsField.value += `**Swing Speed** ${swingSpeed}\n`;
        }
        statsField.value += `\n`;

        //Common stats
        const commonStatsField = {name: `\u200b`, value: ``, inline: true};
        //Bow
        var accurency;
        var shieldDuration;

        //Explosives
        var blastRadius;
        var velocity;

        var impact;
        var range;
        var stability;
        var handling;
        var reloadSpeed;
        var magazine;

        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Impact') != undefined) {
            impact = destinyDB.getStatsByName(weapon.stats.data.stats, 'Impact').value;
            commonStatsField.value += `**Impact** ${impact}\n`;
        }

        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Blast Radius') != undefined) {
            blastRadius = destinyDB.getStatsByName(weapon.stats.data.stats, 'Blast Radius').value;
            commonStatsField.value += `**Blast Radius** ${blastRadius}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Velocity') != undefined) {
            velocity = destinyDB.getStatsByName(weapon.stats.data.stats, 'Velocity').value;
            commonStatsField.value += `**Velocity** ${velocity}\n`;
        }

        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Accuracy') != undefined) {
            accurency = destinyDB.getStatsByName(weapon.stats.data.stats, 'Accuracy').value;
            commonStatsField.value += `**Accuracy** ${accurency}\n`;
        }

        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Range') != undefined) {
            range = destinyDB.getStatsByName(weapon.stats.data.stats, 'Range').value;
            commonStatsField.value += `**Range** ${range}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Shield Duration') != undefined) {
            shieldDuration = destinyDB.getStatsByName(weapon.stats.data.stats, 'Shield Duration').value;
            commonStatsField.value += `**Shield Duration** ${shieldDuration}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Stability') != undefined) {
            stability = destinyDB.getStatsByName(weapon.stats.data.stats, 'Stability').value;
            commonStatsField.value += `**Stability** ${stability}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Handling') != undefined) {
            handling = destinyDB.getStatsByName(weapon.stats.data.stats, 'Handling').value;
            commonStatsField.value += `**Handling** ${handling}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Reload Speed') != undefined) {
            reloadSpeed = destinyDB.getStatsByName(weapon.stats.data.stats, 'Reload Speed').value;
            commonStatsField.value += `**Reload Speed** ${reloadSpeed}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Magazine') != undefined) {
            magazine = destinyDB.getStatsByName(weapon.stats.data.stats, 'Magazine').value;
            commonStatsField.value += `**Magazine** ${magazine}\n`;
        }

        //Swords
        var chargeRate;
        var guardResistance;
        var guardEfficiency;
        var guardEndurance;

        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Charge Rate') != undefined) {
            chargeRate = destinyDB.getStatsByName(weapon.stats.data.stats, 'Charge Rate').value;
            commonStatsField.value += `**Charge Rate** ${chargeRate}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Resistance') != undefined) {
            guardResistance = destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Resistance').value;
            commonStatsField.value += `**Guard Resistance** ${guardResistance}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Efficiency') != undefined) {
            guardEfficiency = destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Efficiency').value;
            commonStatsField.value += `**Guard Efficiency** ${guardEfficiency}\n`;
        }
        if(destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Endurance') != undefined) {
            guardEndurance = destinyDB.getStatsByName(weapon.stats.data.stats, 'Guard Endurance').value;
            commonStatsField.value += `**Guard Endurance** ${guardEndurance}\n`;
        }
        

        //Hidden stats
        var aimAssist;
        var zoom;
        var recoilDirection;

        if(destinyDB.getStatsByName(weaponItem.stats.stats, 'Aim Assistance') != undefined && destinyDB.getStatsByName(weapon.stats.data.stats, 'Swing Speed') == undefined) {
            aimAssist = destinyDB.getStatsByName(weaponItem.stats.stats, 'Aim Assistance').value;
            statsField.value += `**Aim Assistance** ${aimAssist}\n`;
        }
        if(destinyDB.getStatsByName(weaponItem.stats.stats, 'Zoom') != undefined && destinyDB.getStatsByName(weapon.stats.data.stats, 'Swing Speed') == undefined) {
            zoom = destinyDB.getStatsByName(weaponItem.stats.stats, 'Zoom').value;
            statsField.value += `**Zoom** ${zoom}\n`;
        }
        if(destinyDB.getStatsByName(weaponItem.stats.stats, 'Recoil Direction') != undefined && destinyDB.getStatsByName(weapon.stats.data.stats, 'Swing Speed') == undefined) {
            recoilDirection = destinyDB.getStatsByName(weaponItem.stats.stats, 'Recoil Direction').value;
            statsField.value += `**Recoil Direction** ${recoilDirection}\n`;
        }

        fieldsArray.push(statsField);
        fieldsArray.push(commonStatsField);
        //#endregion

        const ammoType = bungieAPI.getAmmoType(weaponItem.equippingBlock.ammoType);
        const source = destinyDB.getSource(weaponItem.collectibleHash);

        const extendedWeaponEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - ${weaponSlot} weapon`,
                icon_url: avatar
            },
            footer: {
                text: `(Extended diplay) `+this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: `attachment://itemThumbail.png`
                },
            title: embedTitle,
            url: `https://www.light.gg/db/items/${weaponHash}/`,
            description: 
                `**${weaponItem.flavorText}**\n`+
                `*${source}*\n\n`+
                `${destinyEmote.getAmmoTypeEmote(ammoType)} **${ammoType} ammo**\n`+
                `${destinyEmote.getElementEmote(bungieAPI.getEnergyType(weaponItem.defaultDamageType))} **${weapon.instance.data.primaryStat.value}**\n\n`+
                `${intrinsicField}\u200b\n`,
            fields: fieldsArray,
            image : {
                url: image
            }
        };

        destinyDB.closeDB();
        return extendedWeaponEmbed;
    }

    getArmorEmbed(discordID, avatar, armorSlot, armorHash, armorState, bungieTag=undefined) {
        
    }

    getGhostEmbed(discordID, avatar, ghost, ghostHash, ghostState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }
    
        const ghostItem = destinyDB.getDetailedEquippedItem(ghostHash);

        const source = destinyDB.getSource(ghostItem.collectibleHash);
        const season = destinyDB.getSeason(ghostItem.collectibleHash);

        const energy = [ghost.instance.data.energy.energyCapacity, ghost.instance.data.energy.energyUsed, ghost.instance.data.energy.energyUnused];

        // Mods
        const ghostModsArray = [];
        var ghostModsField = "";
        if (ghost.perks.data == undefined) {
            dbg('No mod equipped.');
            ghostModsField = "No mod equipped.\n";
        } else {
            ghost.perks.data.perks.forEach( item => {
                const mod = destinyDB.getMod(item.perkHash, ghost.sockets.data.sockets);
                ghostModsArray.push([mod[0].displayProperties.name, mod[0].displayProperties.description, mod[1], mod[2]]);
            });
            ghostModsArray.forEach( mod => {
                ghostModsField += `[${mod[0]}](https://www.light.gg/db/items/${mod[3]}/) **| ${mod[2]}** ${destinyEmote.getGhostModEnergy(mod[2])}\n`;
            });
        }

        //Cosmetics
        const ghostCosmeticsArray = destinyDB.getGhostCosmetics(ghost.sockets.data.sockets);
        var ghostCosmeticsField = "";
        ghostCosmeticsField += `SHADER **|** [${ghostCosmeticsArray[0].displayProperties.name}](https://www.light.gg/db/items/${ghostCosmeticsArray[0].hash}/)\n`;
        ghostCosmeticsField += `GHOST PROJECTION **|** [${ghostCosmeticsArray[1].displayProperties.name}](https://www.light.gg/db/items/${ghostCosmeticsArray[1].hash}/)\n`;

        const ghostEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Ghost Shell`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: `attachment://itemThumbail.png`
              },
            title: `${destinyEmote.getItemLockStateEmote(ghostState.includes('Locked'))}${ghostItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${ghostHash}/`,
            description: 
                `**${ghostItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            fields: [
            {
                name: `ENERGY`,
                value: 
                `**USED : ${energy[1]} / ${energy[0]}**\n`+
                `${destinyEmote.getElementGaugeEmote('Kinetic',energy[0],energy[1])}\n\u200b\n`,
                inline: false
            },
            {
                name: `GHOST MODS`,
                value: `${ghostModsField}\u200b\n`,
                inline: false
            },
            {
                name: `GHOST COSMETICS`,
                value: 
                `${ghostCosmeticsField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(ghostItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return ghostEmbed;
    }

    getSparrowEmbed(discordID, avatar, sparrow, sparrowHash, sparrowState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }

        const sparrowItem = destinyDB.getDetailedEquippedItem(sparrowHash);

        const source = destinyDB.getSource(sparrowItem.collectibleHash);
        const season = destinyDB.getSeason(sparrowItem.collectibleHash);

        const perks = destinyDB.getPerks(sparrow.perks.data.perks);
        var perksField = "";
        perks.forEach(perk => {
            perksField += `${perk}\n`;
        });

        //Cosmetics
        const sparrowShader = destinyDB.getShader(sparrow.sockets.data.sockets);
        var sparrowShaderField = `SHADER **|** [${sparrowShader.displayProperties.name}](https://www.light.gg/db/items/${sparrowShader.hash}/)\n`;

        const sparrowEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Sparrow`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: `attachment://itemThumbail.png`
              },
            title: `${destinyEmote.getItemLockStateEmote(sparrowState.includes('Locked'))}${sparrowItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${sparrowHash}/`,
            description: 
                `**${sparrowItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n`,
            fields: [
            {
                name: `PERKS`,
                value: 
                `${perksField}\u200b\n`,
                inline: false
            },
            {
                name: `SPARROW COSMETICS`,
                value: 
                `${sparrowShaderField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(sparrowItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return sparrowEmbed;
    }

    getShipEmbed(discordID, avatar, ship, shipHash, shipState, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }

        const shipItem = destinyDB.getDetailedEquippedItem(shipHash);

        const source = destinyDB.getSource(shipItem.collectibleHash);
        const season = destinyDB.getSeason(shipItem.collectibleHash);

        //Cosmetics
        const shipCosmeticsArray = destinyDB.getShipCosmetics(ship.sockets.data.sockets);
        var shipCosmeticsField = "";
        shipCosmeticsField += `SHADER **|** [${shipCosmeticsArray[0].displayProperties.name}](https://www.light.gg/db/items/${shipCosmeticsArray[0].hash}/)\n`;
        shipCosmeticsField += `TRANSMAT EFFECT **|** [${shipCosmeticsArray[1].displayProperties.name}](https://www.light.gg/db/items/${shipCosmeticsArray[1].hash}/)\n`;

        const shipEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Ship`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: `attachment://itemThumbail.png`
              },
            title: `${destinyEmote.getItemLockStateEmote(shipState.includes('Locked'))}${shipItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${shipHash}/`,
            description: 
                `**${shipItem.flavorText}**\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            fields: [
            {
                name: `SPARROW COSMETICS`,
                value: 
                `${shipCosmeticsField}\u200b\n`,
                inline: false
            }],
            image : {
                url: bungieAPI.buildURLAsset(shipItem.screenshot)
            }
        };
        destinyDB.closeDB();
        return shipEmbed;
    }

    getEmblemEmbed(discordID, avatar, emblemHash, emblemState, emblemMetrics, bungieTag=undefined) {
        destinyDB.loadDB();
    
        var guardianName;
        if (bungieTag!=undefined) {
            guardianName = bungieTag;
        } else {
            guardianName = userDB.getBungieTag(discordID);
        }

        const emblemItem = destinyDB.getDetailedEquippedItem(emblemHash);

        var emblemTrackerString = "";
        if (emblemMetrics != undefined) {
            const emblemTracker = destinyDB.getMetric(emblemMetrics[0]);
            const trackerCat = destinyDB.getEmblemTrackerFields(emblemTracker);
            var progress = emblemMetrics[1].progress.toString().split(".");
            progress[0] = progress[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            progress.join(".");
            emblemTrackerString += `**${trackerCat[0]} // ${trackerCat[1]} // ${emblemTracker.displayProperties.name}**\n> \`${progress}\``;
        }

        const source = destinyDB.getSource(emblemItem.collectibleHash);
        const season = destinyDB.getSeason(emblemItem.collectibleHash);

        const emblemEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `${guardianName} - Emblem`,
                icon_url: avatar
            },
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            thumbnail: {
                url: bungieAPI.buildURLAsset(emblemItem.displayProperties.icon)
              },
            title: `${destinyEmote.getItemLockStateEmote(emblemState.includes('Locked'))}${emblemItem.displayProperties.name}`,
            url: `https://www.light.gg/db/items/${emblemHash}/`,
            description: 
                `${emblemTrackerString}\n\n`+
                `${season}\n`+
                `*${source}*\n\u200b\n`,
            image : {
                url: bungieAPI.buildURLAsset(emblemItem.secondaryIcon)
            }
        };
        destinyDB.closeDB();
        return emblemEmbed;
    }

    getSubclassEmbed(discordID, avatar, subclass, subclassHash, bungieTag=undefined) {
        
    }

    getAccountLinkErrorEmbed (discordID) {
        const accountLinkErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Your account is already linked : ${userDB.getBungieTag(discordID)}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountLinkErrorEmbed;
    }

    getAccountUnlinkErrorEmbed () {
        const accountUnlinkErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `You don\'t have any linked Bungie profile.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountUnlinkErrorEmbed;
    }

    getAccountLinkedEmbed (bungieTag) {
        const accountLinkedEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description:
            `You linked your account: ${bungieTag}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountLinkedEmbed;
    }

    getAccountUnlinkedEmbed (bungieTag) {
        const accountUnlinkedEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description:
            `You unlinked your account: ${bungieTag}\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return accountUnlinkedEmbed;
    }

    getNotLinkedErrorEmbed () {
        const notLinkedErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Your Bungie Profile isn\'t linked. Please use /link to register your Bungie profile.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return notLinkedErrorEmbed;
    }
    
    getAPIDownEmbed () {
        const apiDownEmbed = {
            color: API_DOWN_COLOR,
            author: {
                name: ``,
            },
            description:
            `Destiny 2 API is down, it might be a maintenance ongoing. Check again later.\n\n`+
            `More informations on [Bungie.net](https://help.bungie.net/hc/en-us/articles/360049199271-Destiny-Server-and-Update-Status)\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return apiDownEmbed;
    }
    getRequestErrorEmbed () {
        const requestErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `An error occured with your account. Is there a Destiny 2 account connected ?\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return requestErrorEmbed;
    }
    
    getBungieTagErrorEmbed () {
        const bungieTagErrorEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `No Bungie profile found. Are your sure about the Bungie tag ?\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return bungieTagErrorEmbed;
    }
    
    getPrivateAccountEmbed (bungieTag) {
        const privateAccountEmbed = {
            color: USER_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `**${bungieTag}** account is set on private, you won\'t be able to access his informations.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return privateAccountEmbed;
    }
    
    getErrorEmbed (error) {
        const errorEmbed = {
            color: BOT_ERROR_COLOR,
            author: {
                name: ``,
            },
            description:
            `Something went wrong with the command, please try again.\n\n`+
            `> **Error code:** \`${error.code}\`\n\n`+
            `Please contact \`Nigh#0101\` if the issue continue any further.\n`,
            footer: {
                text: this.footerContent
            },
            timestamp: new Date()
        };
        return errorEmbed;
    }
    
    getHelpEmbed (helpFile) {
        const helpEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: `COMMANDS LIST`,
            },
            description: "",
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            fields:[]
        };
    
        for(const cat in helpFile) {
            var embedFieldValue = '';
            for (let i = 0; i < helpFile[cat].length; i++) {
                const commandHelp = helpFile[cat][i];
                embedFieldValue += `> **${commandHelp[0]}**: ${commandHelp[1]}\n`;
            }
            helpEmbed.fields.push({name: `${cat.toUpperCase()}`, value: embedFieldValue, inline: false});
        }
    
        return helpEmbed;
    }

    getThanksEmbed (teamFile) {
        const thanksEmbed = {
            color: BEYOND_COLOR,
            author: {
                name: ``,
            },
            description: "",
            footer: {
                text: this.footerContent
            },
            timestamp: new Date(),
            //image : {
                //url: '', // Beyond Logo
            //},
            fields: []
        };

        for(const cat in teamFile) {
            var embedFieldValue = '';
            for (let i = 0; i < teamFile[cat].length; i++) {
                const teamName = teamFile[cat][i];
                embedFieldValue += `> ${teamName}\n`;
            }
            thanksEmbed.fields.push({name: `${cat.toUpperCase()}`, value: embedFieldValue, inline: false});
        }
        return thanksEmbed;
    }
}

module.exports = { EmbedBuilder };