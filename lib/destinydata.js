//#region libs
const bsql = require('better-sqlite3');

const axios = require('axios');
const fs = require('fs');

const config = require('../config.json');
const databasePath = config.database_path;

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class DestinyDatabase {
    constructor() {
        this.dbPath = databasePath;
        this.dbParams = {
            readonly: true,
            fileMustExist: true
        };
        this.db = undefined;
    }

    //Database management
    loadDB() {
        try {
            this.db = bsql(this.dbPath, this.dbParams);
        } catch (error) {
            err('Couldn\'t open the database.');
            err(`Databse path: <${this.dbPath}>`);
            console.error(error);
            return;
        }
        inf('Database succefully loaded.');
    }

    closeDB() {
        try {
            this.db.close();
        } catch (error) {
            err('Couldn\'t close the database.');
            console.error(error);
            return;
        }
        inf('Database\'s connection closed.');
    }

    listTables() {
        this.loadDB();
        console.log(this.prepare("SELECT name FROM \"main\".sqlite_master").all());
        this.closeDB();
    }

    sendQuery(table, hashId) {
        const id = this.getIdFromHash(hashId);
        return this.db.prepare(String(`SELECT json FROM ${table} WHERE id = ?`)).get(id).json;
    }

    //Destiny data
    getIdFromHash(hash) {
        return hash >> 32;
    }

    getEquippedItem(hash) {
        const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', hash));
        return [this.getItemName(item), this.getItemType(item)];
    }

    getDetailedEquippedItem(hash) {
        const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', hash));
        return item;
    }

    getItemName(item) {
        return item.displayProperties.name;
    }

    getItemType(item) {
        return item.itemTypeDisplayName;
    }

    getItemTier(item) {
        return item.inventory.tiertypeName;
    }

    getSource (collectibleHash) {
        const item = JSON.parse(this.sendQuery('DestinyCollectibleDefinition', collectibleHash));
        return item.sourceString;
    }

    getSeason(collectibleHash) {
        const item = JSON.parse(this.sendQuery('DestinyCollectibleDefinition', collectibleHash));
        const parent = JSON.parse(this.sendQuery('DestinyPresentationNodeDefinition', item.parentNodeHashes.slice(-1)[0]));
        return parent.displayProperties.name;
    }

    getSealTitle(hash, genderHash) {
        if(hash==undefined) {
            return ' ';
        }
        const item = JSON.parse(this.sendQuery('DestinyRecordDefinition', hash));
        return `${item.titleInfo.titlesByGenderHash[genderHash]}`;
    }

    getMod(perkHash, sockets) {
        const item = JSON.parse(this.sendQuery('DestinySandboxPerkDefinition', perkHash));
        const modDetails = this.getSocketsDetailsByName(sockets, item.displayProperties.name);
        return [item, modDetails.plug.energyCost.energyCost, modDetails.hash];
    }

    getPerks(perksArray) {
        const perks = [];
        perksArray.forEach(perk => {
            if(perk.visible == true) {
                perks.push(JSON.parse(this.sendQuery('DestinySandboxPerkDefinition', perk.perkHash)).displayProperties.name);
            }
        });
        return perks;
    }

    getGhostCosmetics(sockets) {
        const shader = this.getSocketsDetailsByPlugCategory(sockets, 'shader');
        const hologram = this.getSocketsDetailsByPlugCategory(sockets, 'hologram');
        return [shader, hologram];
    }

    getShipCosmetics(sockets) {
        const shader = this.getSocketsDetailsByPlugCategory(sockets, 'shader');
        const transmat = this.getSocketsDetailsByPlugCategory(sockets, 'ship.spawnfx');
        return [shader, transmat];
    }

    getShader(sockets) {
        const shader = this.getSocketsDetailsByPlugCategory(sockets, 'shader');
        return shader;
    }

    getMetric(metricHash) {
        const metric = JSON.parse(this.sendQuery('DestinyMetricDefinition', metricHash));
        return metric;
    }

    getEmblemTrackerFields(tracker) {
        const timeInterval = JSON.parse(this.sendQuery('DestinyTraitDefinition', tracker.traitHashes.slice(-1)[0]));
        const activityType = JSON.parse(this.sendQuery('DestinyPresentationNodeDefinition', tracker.parentNodeHashes.slice(-1)[0]));
        return [timeInterval.displayProperties.name, activityType.displayProperties.name];
    }

    getObjectivePlugDebug(objectivesPerPlug) {
        for (const objective in objectivesPerPlug) {
            console.log(`ObjectivePlugHash : ${objective}`);
            const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', objective));
            console.log(item.displayProperties);
        }
        return;
    }

    getObjectivePlugByName(objectivesPerPlug, name) {
        for(const objective in objectivesPerPlug) {
            const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', objective));
            if(item.displayProperties.name.includes(name)) {
                return objectivesPerPlug[objective];
            }
        }
        wrn(`Didn\`t found the objectivePlug <${name}>`);
        return undefined;
    }

    getCraftingMaterialsFromDeepsight(objectivesPerPlug) {
        const craftingMaterials = [];
        for (const objective in objectivesPerPlug) {
            const item = JSON.parse(this.sendQuery('DestinyObjectiveDefinition', objectivesPerPlug[objective][0].objectiveHash));
            if(item.progressDescription.includes('Element')) {
                craftingMaterials.push(item.progressDescription);
            }
        }
        return craftingMaterials;
    }

    getObjectivesByName(objectives, name) {
        for(const objective in objectives) {
            const objectiveHash = objectives[objective].objectiveHash;
            const item = JSON.parse(this.sendQuery('DestinyObjectiveDefinition', objectiveHash));
            if (item.progressDescription == name) {
                return objectives[objective];
            }
        }
        wrn(`Didn\`t found the objective <${name}>`);
        return;
    }

    getAllObjectiveDebug(objectivesPerPlug) {
        for (const objective in objectivesPerPlug) {
            console.log(`ObjectivePlugHash : ${objective}`);
            console.log(`ObjectiveHash : ${objectivesPerPlug[objective][0].objectiveHash}`);
            const item = JSON.parse(this.sendQuery('DestinyObjectiveDefinition', objectivesPerPlug[objective][0].objectiveHash));
            console.log(item.progressDescription);
        }
        return;
    }

    getObjectivesDebug(objectives) {
        for(const objective in objectives) {
            console.log(`ObjectiveHash : ${objectives[objective].objectiveHash}`);
            const objectiveHash = objectives[objective].objectiveHash;
            const item = JSON.parse(this.sendQuery('DestinyObjectiveDefinition', objectiveHash));
            console.log(item.progressDescription);
        }
        return;
    }

    getSockets(socketsArray) {
        const sockets = [];
        socketsArray.forEach(plug => {
            if(plug.isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', plug.plugHash));
                sockets.push(item);
            }
        });
        return sockets;
    }

    getStatMod(socketsArray) {
        const statArray = [];
        if (socketsArray == undefined) {
            dbg('No mod equipped.');
            return undefined;
        } else {
            for (let i = 0; i < 4; i++) {
                const mod = socketsArray[i];
                const statInvestment = this.getStatInvestment(mod.investmentStats);
                if(statInvestment!=undefined) {
                    statArray.push(statInvestment);
                }
            }
            if (statArray!=[]) return statArray;
            return undefined;
        }
    }

    getStatInvestment(investmentStatsArray) {
        for (let i = 0; i < investmentStatsArray.length; i++) {
            const stat = investmentStatsArray[i];
            const item = JSON.parse(this.sendQuery('DestinyStatDefinition', stat.statTypeHash));
            if(this.isStatMod(item)) {
                return [item.displayProperties.name, stat.value];
            }
        }
        return undefined;
    }

    isStatMod(modItem) {
        if(
            modItem.displayProperties.name.includes('Mobility') ||
            modItem.displayProperties.name.includes('Resilience') ||
            modItem.displayProperties.name.includes('Recovery') ||
            modItem.displayProperties.name.includes('Discipline') ||
            modItem.displayProperties.name.includes('Intellect') ||
            modItem.displayProperties.name.includes('Strength')) {
            return true;
        }
        return false;
    }

    getOriginTrait(sockets) {
        for(const plug in sockets){
            if(sockets[plug].isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', sockets[plug].plugHash));
                if(item.plug.plugCategoryIdentifier == 'origins') {
                    return item;
                }
            }
        }
        err('Couldn\'t find any origin trait.');
        return undefined;
    }

    getWeaponMod(sockets) {
        for(const plug in sockets){
            if(sockets[plug].isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', sockets[plug].plugHash));
                if(item.plug.plugCategoryIdentifier == 'v400.weapon.mod_damage') {
                    return item;
                }
            }
        }
        wrn('Couldn\'t find any mod.');
        return undefined;
    }

    getWeaponOrnement(sockets) {
        for(const plug in sockets){
            if(sockets[plug].isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', sockets[plug].plugHash));
                if(item.plug.plugCategoryIdentifier.includes('skin')) {
                    return item;
                }
            }
        }
        wrn('Couldn\'t find any ornement.');
        return undefined;
    }

    getSocketsDebug(sockets) {
        sockets.forEach(plug => {
            if(plug.isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', plug.plugHash));
                console.log(item.displayProperties.name);
                console.log(item);
            }
        });
        return;
    }

    getSocketsDetailsByPlugCategory(sockets, plugCategory) {
        for(const plug in sockets) {
            if(sockets[plug].isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', sockets[plug].plugHash));
                if (item.plug.plugCategoryIdentifier == plugCategory) {
                    return item;
                }
            }
        }
    }

    getSocketsDetailsByName(sockets, name) {
        for(const plug in sockets) {
            if(sockets[plug].isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', sockets[plug].plugHash));
                if (item.displayProperties.name == name) {
                    return item;
                }
            }
        }
    }

    getStatsByName(stats, statName) {
        for(const stat in stats) {
            const item = JSON.parse(this.sendQuery('DestinyStatDefinition', stat));
            if(item.displayProperties.name == statName) {
                return stats[stat];
            }
        }
        return;
    }

    getStatsDebug(stats) {
        for(const stat in stats) {
            const item = JSON.parse(this.sendQuery('DestinyStatDefinition', stat));
            console.log(item.displayProperties.name);
        }
        return;
    }

    getIntrinsicPerk(perksArray) {
        return perksArray[0].displayProperties;
    }

    getExoticArmorPerk(perksArray) {
        for (let i = 0; i < perksArray.length; i++) {
            if(perksArray[i].itemTypeDisplayName == 'Intrinsic') {
                return perksArray[i].displayProperties;
            }
        }
        return;
    }

    getPerksDebug(perks) {
        for(const perk in perks) {
            const item = JSON.parse(this.sendQuery('DestinySandboxPerkDefinition', perks[perk].perkHash));
            if (item.isDisplayable) {
                console.log(item.displayProperties.name);
                console.log(item);
            }
        }
        return;
    }

    async parsePerks() {
        const stmt = this.db.prepare('SELECT * FROM DestinyInventoryItemDefinition');

        for (const item of stmt.iterate()) {
            const itemJson = JSON.parse(item.json);
            if(itemJson.itemTypeAndTierDisplayName!=undefined && itemJson.displayProperties.hasIcon == true && itemJson.displayProperties.name!=undefined){
                if (itemJson.itemTypeAndTierDisplayName == "Exotic Intrinsic"){
                    var itemName = undefined;
                    itemName = itemJson.displayProperties.name.replace(' ', '');
                    itemName = itemJson.displayProperties.name.replace('\\', '');
                    itemName = itemJson.displayProperties.name.replace('/', '');
                    try {
                        const response = await axios({
                            method: 'GET',
                            url:  `https://www.bungie.net${itemJson.displayProperties.icon}`,
                            responseType: 'stream',
                        });
                    
                        const w = response.data.pipe(fs.createWriteStream(`./img/icons/perks/${itemName}.png`));
                        w.on('finish', (console, itemName) => {
                                console.log(`Successfully downloaded ID:${item.id} <${itemName}>!`);
                            });
                    } catch (err) {
                        console.log(`ERROR`);
                        console.log(`ID: ${item.id}`);
                        console.log(`ID: ${item.json}`);
                    throw new Error(err);
                    }
                }
            }
        }
        this.closeDB();
        console.log('PERK SCRAPING DONE !');
        return ;
    }
    
}

module.exports = { DestinyDatabase };