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

        //Weapons - 16 types + {Sword + Heavy Grenade Launcher}
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
        this.traceRifle = "",
        this.bow = "",
        this.glaive = "",

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
        this.risenSeason = "<:Risen:956232430497435668>";
        
        //Expansions
        this.witchQueen = "<:WitchQueen:956232429914443777>";

        //Seals
        this.almighty = "<:Almighty:956132678011355186>";
        this.blacksmith = "<:Blacksmith:956132678208454716>";
        this.chosen = "<:Chosen:956132678409801728>";
        this.chronicler = "<:Chronicler:956132678330097674>";
        this.conqueror = "<:Conqueror:956132678472724491>";
        this.cursebreaker = "<:Cursebreaker:956132678535643206>";
        this.deadeye = "<:Deadeye:956132678233645087>";
        this.descendant = "<:Descendant:956132678493671434>";
        this.discipleSlayer = "<:DiscipleSlayer:956132678560808970>";
        this.dreadgen = "<:Dreadgen:956132678690820106>";
        this.enlightened = "<:Enlightened:956132678564982784>";
        this.fatebreaker = "<:Fatebreaker:956132678523056158>";
        this.flawless = "<:Flawless:956132678577565756>";
        this.forerunner = "<:Forerunner:956132678418186250>";
        this.gumshoe = "<:Gumshoe:956132678820839474>";
        this.harbinger = "<:Harbinger:956132678355259422>";
        this.mmxix = "<:MMXIX:956132678112018503>";
        this.mmxx = "<:MMXX:956132678854402148>";
        this.mmxxi = "<:MMXXI:956132678455947305>";
        this.realmwalker = "<:Realmwalker:956132678619525190>";
        this.reckoner = "<:Reckoner:956132678514638858>";
        this.risen = "<:Risen:956132678686621706>";
        this.Rivensbane = "<:Rivensbane:956132678661472286>";
        this.savior = "<:Savior:956132678808248360>";
        this.shadow = "<:Shadow:956132678711771186>";
        this.splicer = "<:Splicer:956132678518849536>";
        this.splintered = "<:Splintered:956132678485291048>";
        this.unbroken = "<:Unbroken:956132678917324810>";
        this.undying = "<:Undying:956132678275575840>";
        this.vidmaster = "<:Vidmaster:956132678569168906>";
        this.warden = "<:Warden:956132678443343963>";
        this.wayfarer = "<:Wayfarer:956132678640492544>";
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
            case 'Almighty':
                return this.almighty;
                break;
            case 'Blacksmith':
                return this.blacksmith;
                break;
            case 'Chosen':
                return this.chosen;
                break;
            case 'Chronicler':
                return this.chronicler;
                break;
            case 'Conqueror':
                return this.conqueror;
                break;
            case 'Cursebreaker':
                return this.cursebreaker;
                break;
            case 'Deadeye':
                return this.deadeye;
                break;
            case 'Descendant':
                return this.descendant;
                break;
            case 'Disciple-Slayer':
                return this.discipleSlayer;
                break;
            case 'Dreadgen':
                return this.dreadgen;
                break;
            case 'Enlightened':
                return this.enlightened;
                break;
            case 'Fatebreaker':
                return this.fatebreaker;
                break;
            case 'Flawless':
                return this.flawless;
                break;
            case 'Forerunner':
                return this.forerunner;
                break;
            case 'Gumshoe':
                return this.gumshoe;
                break;
            case 'Harbinger':
                return this.harbinger;
                break;
            case 'MMXIX':
                return this.mmxix;
                break;
            case 'MMXX':
                return this.mmxx;
                break;
            case 'MMXXI':
                return this.mmxxi;
                break;
            case 'Realmwalker':
                return this.realmwalker;
                break;
            case 'Reckoner':
                return this.reckoner;
                break;
            case 'Risen':
                return this.risen;
                break;
            case 'Rivensbane':
                return this.Rivensbane;
                break;
            case 'Savior':
                return this.savior;
                break;
            case 'Shadow':
                return this.shadow;
                break;
            case 'Splicer':
                return this.splicer;
                break;
            case 'Splintered':
                return this.splintered;
                break;
            case 'Unbroken':
                return this.unbroken;
                break;
            case 'Undying':
                return this.undying;
                break;
            case 'Vidmaster':
                return this.vidmaster;
                break;
            case 'Warden':
                return this.warden;
                break;
            case 'Wayfarer':
                return this.wayfarer;
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
                return this.risenSeason;
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