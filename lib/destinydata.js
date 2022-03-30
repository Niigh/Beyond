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
        //not(`Request hash ${hashId} in table <${table}>.`)
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

    getSocketsDebug(sockets) {
        sockets.forEach(plug => {
            if(plug.isVisible) {
                const item = JSON.parse(this.sendQuery('DestinyInventoryItemDefinition', plug.plugHash));
                console.log(item);
            }
        });
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