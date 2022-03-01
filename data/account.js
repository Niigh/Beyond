//#region libs
require('dotenv').config();

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class GuildData {
    constructor () {
        this.usersLink = [];
    }

    isExistingLinkedUser(discordID) {
        inf(`Searching for ${discordID}...`);
        for (const x of this.usersLink) {
            if (x.discordID==discordID) {
                return true;
            }
        }
        return false;
    }

    getLinkedUser(discordID) {
        for (const x of this.usersLink) {
            if (x.discordID==discordID) {
                inf(`User found: ${x.UniqueBungieName}`);
                return x.UniqueBungieName;
            }
        }
        return null;
    }

    addUser (discordID, membershipID, membershipType, bungieName) {
        const user = new DiscordAPILink(discordID, membershipID, membershipType, bungieName);
        this.usersLink.push(user);
        inf(`New user ${bungieName} added.`);
    }

    getUsersList() {
        for (const x of this.usersLink) {
            console.log(x);
        }
    }

};

class DiscordAPILink {
    constructor (discordID, membershipID, membershipType, bungieName) {
        this.discordID = discordID; //0
        this.BungieMembershipID = membershipID; //-1
        this.BungieMembershipType = membershipType; //-1
        this.UniqueBungieName = bungieName; //Guardian#000
    }
};

module.exports = { GuildData }