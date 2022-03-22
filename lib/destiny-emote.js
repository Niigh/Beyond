//#region libs
//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class DestinyEmote {
    constructor () {
        //Class
        this.hunter = "",
        this.titan = "",
        this.warlock = "",

        //Elements
        this.arc = "",
        this.solar = "",
        this.void = "",

        //Weapons
        this.autoRifle = "",
        this.fusionRifle = "",
        this.grenadeLauncher = "",
        this.handCannon = "",
        this.heavyGrenadelauncher = "",
        this.linearFusionRifle = "",
        this.machineGun = "",
        this.pulseRifle = "",
        this.rocketLauncher = "",
        this.subMachineGun = "",
        this.scoutRifle = "",
        this.shotgun = "",
        this.sidearm = "",
        this.sniperRifle = "",
        this.sword = "",

        //Armors
        this.helmet = "",
        this.arms = "",
        this.chest = "",
        this.legs = "",
        this.class = "";

        //Misc
        this.light = "<:LightLevel:844029708077367297>";
    };

    getEmote(emoteName) {
        return this.emoteName;
    }
};

module.exports = { DestinyEmote } ;