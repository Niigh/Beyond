//#region libs
//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class DestinyEmote {
    constructor () {
        //Class
        this.hunter = "<:Hunter:844031780108763146>";
        this.titan = "<:Titan:844031790950776842>";
        this.warlock = "<:Warlock:844031791119073320>";

        //Elements
        this.arc = "<:Arc:957699291160391750>";
        this.solar = "<:Solar:957699291701456916>";
        this.void = "<:Void:957699291663700000>";
        this.stasis = "<:Stasis:957699291273625611>";

        //Energy
        this.energyLocked = "<:EnergyLocked:957951987687755796>";
        this.arcEnergyAvailable = "<:ArcEnergyAvailable:957705235789406328>";
        this.arcEnergyUsed = "<:ArcEnergyUsed:957705233901965402>";
        this.solarEnergyAvailable = "<:SolarEnergyAvailable:957705163890634813>";
        this.solarEnergyUsed = "<:SolarEnergyUsed:957705163911606322>";
        this.voidEnergyAvailable = "<:VoidEnergyAvailable:957705195737976862>";
        this.voidEnergyUsed = "<:VoidEnergyUsed:957705195989631046>";
        this.stasisEnergyAvailable = "<:StasisEnergyAvailable:957704384593166397>";
        this.stasisEnergyUsed = "<:StasisEnergyUsed:957704384962252920>";
        this.kineticEnergyAvailable = "<:EnergyAvailable:957951987742310400>";
        this.kineticEnergyUsed = "<:EnergyUsed:957951987964592148>";

        //Weapons - 16 types + {Sword + Heavy Grenade Launcher}
        this.autoRifle = "<:AutoRifle:956623989474746448>";
        this.bow = "<:Bow:956623990863056926> ";
        this.fusionRifle = "<:FusionRifle:956623989579612220> ";
        this.glaive = "<:Glaive:956623989567017050>";
        this.grenadeLauncher = "<:GrenadeLauncher:956623990523297882>";
        this.handCannon = "<:HandCannon:956623989940297748>";
        this.heavyGrenadelauncher = "<:HeavyGrenadeLauncher:956623989692833802>";
        this.linearFusionRifle = "<:LinearFusionRifle:956623990070313010>";
        this.machineGun = "<:MachineGun:956623990452002836>";
        this.pulseRifle = "<:PulseRifle:956623989852237834>";
        this.rocketLauncher = "<:RocketLauncher:956623989973848094>";
        this.scoutRifle = "<:ScoutRifle:956623990053568602>";
        this.shotgun = "<:Shotgun:956623989718011914>";
        this.sidearm = "<:Sidearm:956623990020010054>";
        this.subMachineGun = "<:SMG:956623989831250000>";
        this.sniperRifle = "<:SniperRifle:956623990204538890>";
        this.sword = "<:Sword:956623990317797416>";
        this.traceRifle = "<:TraceRifle:956623990007410708>";
        
        

        //Armors
        this.helmet = "<:Helmet:956132316223246426>";
        this.gauntlets = "<:Gauntlets:956132316307140649>";
        this.chest = "<:Chest:956132315904475177>";
        this.legs = "<:Legs:956132316219076648>";
        this.class = "<:Class:956132316248440842>";

        //Stats
        this.mobility = "<:Mobility:956879713819844639>";
        this.resilience = "<:Resilience:956879713622700032>";
        this.recovery = "<:Recovery:956879713656274954>";
        this.discipline = "<:Discipline:956879713496875008>";
        this.intellect = "<:Intellect:956879713639493642>";
        this.strength = "<:Strength:956879713597521980>";

        //Misc
        this.light = "<:LightLevel:956217465220784200>";
        this.ghost = "<:Ghost:955830787587072070>";
        this.sparrow = "<:Sparrow:955833777786085436>";
        this.ship = "<:Ship:955833777790287923>";
        this.emblem = "<:Emblem:955835341649084466>";
        this.locked = "<:Locked:957952499107631145>";
        this.enemiesTracker = "<:EnemiesTracker:958392932635922453>";
        this.crucibleTracker = "<:CrucibleTracker:958392932480725022>";

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
        this.dredgen = "<:Dredgen:956132678690820106>";
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
    }

    getItemLockStateEmote(isLocked) {
        if(isLocked) {
            return `${this.locked} `;
        } else {
            return '';
        }
    }

    getKillTrackerEmote(activity) {
        switch (activity) {
            case 'PVE':
                return this.enemiesTracker;
            case 'PVP':
                return this.crucibleTracker;
            default:
                break;
        }
        err('Couldn\'t load the activity tracker emote.');
        return '';
    }

    getClassEmote(className) {
        switch (className) {
            case 'Warlock':
                return this.warlock;
            case 'Titan':
                return this.titan;
            case 'Hunter':
                return this.hunter;
            default:
                break;
        }
        err('Couldn\'t load the class emote.');
        return '';
    }

    getElementEmote(element) {
        switch (element) {
            case 'Arc':
                return this.arc;
            case 'Solar':
                return this.arc;
            case 'Void':
                return this.arc;
            case 'Stasis':
                return this.arc;
            default:
                break;
        }
        err('Couldn\'t load the element emote.');
        return '';
    }

    getGhostModEnergy(energy) {
        const modEnergy = [];

        for (let i = 0; i <energy; i++) {
            modEnergy.push(this.energyLocked);
        }
        const modEnergyString = modEnergy.join(' ');
        return modEnergyString;
    }

    getElementGaugeEmote (element, energyCapacity, energyUsed) {
        const energyGauge = [];
        switch (element) {
            case 'Arc':
                for (let i = 0; i <energyUsed; i++) {
                    energyGauge.push(this.arcEnergyUsed);
                }
                for (let i = 0; i < (energyCapacity-energyUsed); i++) {
                    energyGauge.push(this.arcEnergyAvailable);
                }
                for (let i = 0; i < (10-energyCapacity); i++) {
                    energyGauge.push(this.energyLocked);
                }
                break;
            case 'Solar':
                for (let i = 0; i <energyUsed; i++) {
                    energyGauge.push(this.solarEnergyUsed);
                }
                for (let i = 0; i < (energyCapacity-energyUsed); i++) {
                    energyGauge.push(this.solarEnergyUsed);
                }
                for (let i = 0; i < (10-energyCapacity); i++) {
                    energyGauge.push(this.energyLocked);
                }
                break;
            case 'Void':
                for (let i = 0; i <energyUsed; i++) {
                    energyGauge.push(this.voidEnergyUsed);
                }
                for (let i = 0; i < (energyCapacity-energyUsed); i++) {
                    energyGauge.push(this.voidEnergyUsed);
                }
                for (let i = 0; i < (10-energyCapacity); i++) {
                    energyGauge.push(this.energyLocked);
                }
                break;
            case 'Stasis':
                for (let i = 0; i <energyUsed; i++) {
                    energyGauge.push(this.stasisEnergyUsed);
                }
                for (let i = 0; i < (energyCapacity-energyUsed); i++) {
                    energyGauge.push(this.stasisEnergyUsed);
                }
                for (let i = 0; i < (10-energyCapacity); i++) {
                    energyGauge.push(this.energyLocked);
                }
                break;
            case 'Ghost':
                for (let i = 0; i <energyUsed; i++) {
                    energyGauge.push(this.kineticEnergyUsed);
                }
                for (let i = 0; i < (energyCapacity-energyUsed); i++) {
                    energyGauge.push(this.kineticEnergyAvailable);
                }
                for (let i = 0; i < (10-energyCapacity); i++) {
                    energyGauge.push(this.energyLocked);
                }
                break;
            default:
                err('Couldn\'t load the element gauge emote.');
                break;
        }
        const energyGaugeString = energyGauge.join(' ');
        return energyGaugeString;
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
            case 'Gauntlets':
                return this.gauntlets;
            case 'Chest Armor':
                return this.chest;
            case 'Leg Armor':
                return this.legs;
            case 'Hunter Cloak':
                return this.class;
            case 'Titan Mark':
                return this.class;
            case 'Warlock Bond':
                return this.class;
            default:
                break;
        }
        err('Couldn\'t load the armor emote.');
        return '';
    }

    getStatEmote(statName) {
        switch (statName) {
            case 'Mobility':
                return this.mobility;
            case 'Resilience':
                return this.resilience;
            case 'Recovery':
                return this.recovery;
            case 'Discipline':
                return this.discipline;
            case 'Intellect':
                return this.intellect;
            case 'Strength':
                return this.strength;
        
            default:
                break;
        }
        err('Couldn\'t load the stat emote.');
        return '';
    }

    getWeaponEmote(weapon, slot=undefined) {
        switch (weapon) {
            case 'Auto Rifle':
                return this.autoRifle;
            case 'Bow':
                return this.bow;
            case 'Fusion Rifle':
                return this.fusionRifle;
            case 'Glaive':
                return this.glaive;
            case 'Grenade Launcher':
                if(slot == 1) {
                    return this.grenadeLauncher;
                } else {
                    return this.heavyGrenadelauncher;
                }
                break;
            case 'Hand Cannon':
                return this.handCannon;
            case 'Linear Fusion Rifle':
                return this.linearFusionRifle;
            case 'Machine Gun':
                return this.machineGun;
            case 'Pulse Rifle':
                return this.pulseRifle;
            case 'Rocket Launcher':
                return this.rocketLauncher;
            case 'Scout Rifle':
                return this.scoutRifle;
            case 'Shotgun':
                return this.shotgun;
            case 'Sidearm':
                return this.sidearm;
            case 'Submachine Gun':
                return this.subMachineGun;
            case 'Sniper Rifle':
                return this.sniperRifle;
            case 'Sword':
                return this.sword;
            case 'Trace Rifle':
                return this.traceRifle;
            default:
                break;
        }
        err('Couldn\'t load the weapon emote.');
        return '';
    }

    getSealEmote(seal) {
        switch (seal) {
            case 'Almighty':
                return this.almighty;
            case 'Blacksmith':
                return this.blacksmith;
            case 'Chosen':
                return this.chosen;
            case 'Chronicler':
                return this.chronicler;
            case 'Conqueror':
                return this.conqueror;
            case 'Cursebreaker':
                return this.cursebreaker;
            case 'Deadeye':
                return this.deadeye;
            case 'Descendant':
                return this.descendant;
            case 'Disciple-Slayer':
                return this.discipleSlayer;
            case 'Dredgen':
                return this.dredgen;
            case 'Enlightened':
                return this.enlightened;
            case 'Fatebreaker':
                return this.fatebreaker;
            case 'Flawless':
                return this.flawless;
            case 'Forerunner':
                return this.forerunner;
            case 'Gumshoe':
                return this.gumshoe;
            case 'Harbinger':
                return this.harbinger;
            case 'MMXIX':
                return this.mmxix;
            case 'MMXX':
                return this.mmxx;
            case 'MMXXI':
                return this.mmxxi;
            case 'Realmwalker':
                return this.realmwalker;
            case 'Reckoner':
                return this.reckoner;
            case 'Risen':
                return this.risen;
            case 'Rivensbane':
                return this.Rivensbane;
            case 'Savior':
                return this.savior;
            case 'Shadow':
                return this.shadow;
            case 'Splicer':
                return this.splicer;
            case 'Splintered':
                return this.splintered;
            case 'Unbroken':
                return this.unbroken;
            case 'Undying':
                return this.undying;
            case 'Vidmaster':
                return this.vidmaster;
            case 'Warden':
                return this.warden;
            case 'Wayfarer':
                return this.wayfarer;
            default:
                break;
        }
        err('Couldn\'t load the seal emote.');
        return '';
    }

    getSeasonEmote(season) {
        switch (season) {
            case 'Risen':
                return this.risenSeason;
            default:
                break;
        }
        err('Couldn\'t load the season emote.');
        return '';
    }

    getExpansionEmote(expansion) {
        switch (expansion) {
            case 'Witch Queen':
                return this.witchQueen;
            default:
                break;
        }
        err('Couldn\'t load the expansion emote.');
        return '';
    }

}

module.exports = { DestinyEmote } ;