//#region libs
const bsql = require('better-sqlite3');

const path = require("path"); 

const config = require('../config.json');
const databasePath = config.database_path;

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class DestinyDatabse {
    constructor() {
        this.dbPath = databasePath;
        this.dbParams = {
            readonly: true,
            fileMustExist: true
        };
        this.db;
    };

    loadDB() {
        try {
            this.db = bsql(this.dbPath, this.dbParams);
        } catch (error) {
            err('Couldn\'t open the database.');
            console.error(error);
            return;
        }
        console.log('Database succefully loaded.');
    }

    listTables() {
        this.loadDB();
        console.log(this.sendQuery("SELECT name FROM \"main\".sqlite_master"));
        this.closeDb();
    }

    sendQuery(query, table, hashId) {
        if(arguments.length == 1) {
            not(query);
            return this.db.prepare(query).all();
        };

        if(arguments.length == 3) {
            not(query);
            not(hashId);
            const id = this.getIdFromHash(hash);
            return this.db.prepare(this.buildQuery(table)).get(id);
        };
    }

    buildQuery(table) { 
        return `SELECT * FROM ${table}`;
    }

    getIdFromHash(hash) {
        return hash >> 32;
    }

    closeDb() {
        try {
            this.db.close();
        } catch (error) {
            err('Couldn\'t close the database.');
            console.error(error);
            return;
        };
        console.log('Database\'s connection closed.');
    }
};

module.exports = { DestinyDatabse };