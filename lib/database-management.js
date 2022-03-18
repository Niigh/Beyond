//#region libs
const Enmap = require("enmap");

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

module.exports = {
    users: new Enmap({
        name: "users",
        dataDir: "./data",
        autoFetch: true,
        fetchAll: false
    }),
    guardians: new Enmap({
        name: "guardian",
        dataDir: "./data",
        autoFetch: true,
        fetchAll: false
    }),

    //Users
    addUser(discordID, memberID, memberType, bungieTag) {
        this.users.set(discordID, {memberID, memberType, bungieTag});
    },

    deleteUser(discordID) {
        this.users.delete(discordID);
    },

    isUserExist(discordID) {
        inf(`Searching for ${discordID}...`);
        if(this.users.get(discordID)==undefined) {
            not('User not found.');
            return false;
        }
        return true;
    },

    getUser(discordID) {
        return this.users.get(discordID);
    },

    getMemberID(discordID) {
        return this.users.get(discordID).memberID;
    },

    getMemberType(discordID) {
        return this.users.get(discordID).memberType;
    },

    getBungieTag(discordID) {
        return this.users.get(discordID).bungieTag;
    },

    //Guardians
    addGuardians(bungieTag, memberID, memberType, characterId) {
        this.guardians.set(memberID, {bungieTag, memberType, characterId});
    },
  }