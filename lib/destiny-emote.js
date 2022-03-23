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
        this.helmet = "<:Helmet:956132316223246426>",
        this.arms = "<:Arms:956132316307140649>",
        this.chest = "<:Chest:956132315904475177>",
        this.legs = "<:Legs:956132316219076648>",
        this.class = "<:Class:956132316248440842>";

        //Misc
        this.light = "<:LightLevel:956217465220784200>";
        this.ghost = "<:Ghost:955830787587072070>";
        this.sparrow = "<:Sparrow:955833777786085436>";
        this.ship = "<:Ship:955833777790287923>";
        this.emblem = "<:Emblem:955835341649084466>";

        //Seasons
        this.risen = "<:Risen:956232430497435668>";
        
        //Expansions
        this.witchQueen = "<:WitchQueen:956232429914443777>";
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
        };
        err('Couldn\'t load the class emote.');
        return '';
    }

    getWeaponEmote(weaponName) {
        switch (weaponName) {
            case value:
                
                break;
            default:
                break;
        }
        err('Couldn\'t load the weapon class emote.');
        return '';
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

    getLightLevelEmote() {
        return this.light;
    }

    getArmorEmote(piece) {
        switch (piece) {
            case 'Helmet':
                return this.helmet;
                break;
            case 'Gauntlets':
                return this.arms;
                break;
            case 'Chest Armor':
                return this.chest;
                break;
            case 'Leg Armor':
                return this.legs;
                break;
            case 'Hunter Cloak':
                return this.class;
                break;
            case 'Titan Mark':
                return this.class;
                break;
            case 'Warlock Bond':
                return this.class;
                break;
            default:
                break;
        };
        err('Couldn\'t load the armor emote.');
        return '';
    }

    getSealEmote(seal) {
        switch (seal) {
            case value:
                
                break;
        
            default:
                break;
        };
        err('Couldn\'t load the seal emote.');
        return '';
    }

    getSeasonEmote(season) {
        switch (season) {
            case 'Risen':
                return this.risen;
                break;
            default:
                break;
        };
        err('Couldn\'t load the season emote.');
        return '';
    }

    getExpansionEmote(expansion) {
        switch (expansion) {
            case 'Witch Queen':
                return this.witchQueen;
                break;
            default:
                break;
        };
        err('Couldn\'t load the expansion emote.');
        return '';
    }

};

module.exports = { DestinyEmote } ;