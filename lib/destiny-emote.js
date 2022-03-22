//#region libs
//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class DestinyEmote {
    constructor () {
        //Class
        this.hunter = "<:Hunter:844031780108763146>",
        this.titan = "<:Titan:844031790950776842>",
        this.warlock = "<:Warlock:844031791119073320>",

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
        this.ghost = "<:Ghost:955830787587072070>";
        this.sparrow = "<:Sparrow:955833777786085436>";
        this.ship = "<:Ship:955833777790287923>";
        this.emblem = "<:Emblem:955835341649084466>";
    };

    getClassEmote(className) {
        switch (className) {
            case 'Warlock':
                return this.warlock;
                break;
            case 'Titan':
                return this.titan;
                break;
            case 'Hunter':
                return this.hunter;
                break;
            default:
                break;
        }
        err('Couldn\'t load the class emote.')
        return undefined;
    }

    getWeaponEmote(weaponName) {
        return;
    }

    getGhostEmote() {
        return this.ghost;
    }

    getSparrowEmote() {
        return this.sparrow;
    }

    getShipEmote() {
        return this.ship;
    }

    getEmblemEmote() {
        return this.emblem;
    }

};

module.exports = { DestinyEmote } ;