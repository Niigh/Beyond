//#region libs
const bsql = require('better-sqlite3');

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
        this.db;
    };

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
        };
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
        return [this.getItemName(item), this.getItemType(item)]
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

    getSealTitle(hash, genderHash) {
        if(hash==undefined) {
            return ' ';
        }
        const item = JSON.parse(this.sendQuery('DestinyRecordDefinition', hash));
        return `${item.titleInfo.titlesByGenderHash[genderHash]}`;
    }
};

module.exports = { DestinyDatabase };