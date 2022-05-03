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
        this.kinetic = "<:Kinetic:957699291235901541>";

        //Ammo types
        this.primaryAmmo = "<:PrimaryAmmo:961206318218219540>";
        this.specialAmmo = "<:SpecialAmmo:961206318323101706>";
        this.heavyAmmo = "<:HeavyAmmo:961206318230822942>";

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
        this.deepsightResonance = "<:DeepsightResonance:960869157451223041>";
        this.crafted = "<:Crafted:960919871879798924>";

        //Currency
        this.adroitElement = "<:AdroitElement:960908002343395359>";
        this.energeticElement = "<:EnergeticElement:960908002414719026>";
        this.mutableElement = "<:MutableElement:960908002586664960>";
        this.ruinousElement = "<:RuinousElement:960908002544734238>";

        this.neutralElement = "<:NeutralElement:960908002473439312>";

        this.drownedElement = "<:DrownedElement:960908002146287691>";
        this.resonantAlloy = "<:ResonantAlloy:960908002486022204>";

        this.ascendantAlloy = "<:AscendantAlloy:960908002536345670>";
        

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

        // Exotic Amor Perks
        this.kintsugi = '<:Kintsugi:970668837139800065>';
        this.alchemicalEtchings = '<:AlchemicalEtchings:970668837219475468>';
        this.illegallyModdedHolster = '<:IllegallyModdedHolster:970668837223669760>';
        this.jumpJets = '<:JumpJets:970668837248827412>';
        this.chaoticExchanger = '<:ChaoticExchanger:970668837282414633>';
        this.hydraulicBoosters = '<:HydraulicBoosters:970668837311741962>';
        this.insatiable = '<:Insatiable:970668837320134726>';
        this.hornsofDoom = '<:HornsofDoom:970668837332738108>';
        this.abyssalExtractors = '<:AbyssalExtractors:970668837366284348>';
        this.glacialGuard = '<:GlacialGuard:970668837374676994>';
        this.andAnotherThing = '<:AndAnotherThing:970668837378863184>';
        this.fusionHarness = '<:FusionHarness:970668837378883605>';
        this.autoLoadingLink = '<:AutoLoadingLink:970668837404028938>';
        this.forceMultiplier = '<:ForceMultiplier:970668837416624130>';
        this.bloodMagic = '<:BloodMagic:970668837433389066>';
        this.bringtheHeat = '<:BringtheHeat:970668837454360646>';
        this.blessingofOrder = '<:BlessingofOrder:970668837454364773>';
        this.assaultBarricade = '<:AssaultBarricade:970668837458559006>';
        this.dynamicDuo = '<:DynamicDuo:970668837471125526>';
        this.bioticEnhancements = '<:BioticEnhancements:970668837471125564>';
        this.burningFists = '<:BurningFists:970668837475340359>';
        this.aeonEnergy = '<:AeonEnergy:970668837475348512>';
        this.beyondTheVeil = '<:BeyondTheVeil:970668837508898836>';
        this.crossCounter = '<:CrossCounter:970668837525651476>';
        this.conductionTines = '<:ConductionTines:970668837555032104>';
        this.clenchedFist = '<:ClenchedFist:970668837559230464>';
        this.adamantineBrace = '<:AdamantineBrace:970668837567619232>';
        this.dreadedVisage = '<:DreadedVisage:970668837567627264>';
        this.devouringRift = '<:DevouringRift:970668837571788820>';
        this.feastofLight = '<:FeastofLight:970668837575991306>';
        this.firewalker = '<:Firewalker:970668837580210187>';
        this.fervidColdsnap = '<:FervidColdsnap:970668837584371712>';
        this.absorptionCells = '<:AbsorptionCells:970668837588578314>';
        this.crystallineTransistor = '<:CrystallineTransistor:970668837592764426>';
        this.actualGrandeur = '<:ActualGrandeur:970668837592768572>';
        this.battleHearth = '<:BattleHearth:970668837601148968>';
        this.doubleDodge = '<:DoubleDodge:970668837613736026>';
        this.graspoftheDevourer = '<:GraspoftheDevourer:970668837622128710>';
        this.burningSouls = '<:BurningSouls:970668837622136852>';
        this.heliumSpirals = '<:HeliumSpirals:970668837622153276>';
        this.embersofLight = '<:EmbersofLight:970668837626327060>';
        this.hawkeyeHack = '<:HawkeyeHack:970668837651484672>';
        this.closeEnough = '<:CloseEnough:970668837664084038>';
        this.gloriousCharge = '<:GloriousCharge:970668837693444127>';
        this.beaconsofEmpowerment = '<:BeaconsofEmpowerment:970668837710213210>';
        this.depthsofDuskfield = '<:DepthsofDuskfield:970668837714419762>';
        this.ascendingAmplitude = '<:AscendingAmplitude:970668837743767602>';
        this.furyConductors = '<:FuryConductors:970668837747966022>';
        this.cauterizingFlame = '<:CauterizingFlame:970668837752168528>';
        this.cerebralUplink = '<:CerebralUplink:970668837810884698>';
        this.resolute = '<:Resolute:970668988159905854>';
        this.scatterCharge = '<:ScatterCharge:970668988285739069>';
        this.relentlessTracker = '<:RelentlessTracker:970668988294107147>';
        this.partingGift = '<:PartingGift:970668988310908989>';
        this.sunfireFurnace = '<:SunfireFurnace:970668988361216022>';
        this.survivalWell = '<:SurvivalWell:970668988415762472>';
        this.theWhispers = '<:TheWhispers:970668988424134717>';
        this.transfusionMatrix = '<:TransfusionMatrix:970668988428345414>';
        this.tomeofDawn = '<:TomeofDawn:970668988445114408>';
        this.ursineGuard = '<:UrsineGuard:970668988449304606>';
        this.theFourthMagic = '<:TheFourthMagic:970668988470272031>';
        this.uncannyArrows = '<:UncannyArrows:970668988474462248>';
        this.upgradedSensorPack = '<:UpgradedSensorPack:970668988482867220>';
        this.warlordsSigil = '<:WarlordsSigil:970668988495458424>';
        this.theDance = '<:TheDance:970668988499656724>';
        this.warlordsEnd = '<:WarlordsEnd:970668988503830579>';
        this.nightmareFuel = '<:NightmareFuel:970668988533182494>';
        this.linearActuators = '<:LinearActuators:970668988533186560>';
        this.wishDragonTeeth = '<:WishDragonTeeth:970668988533186641>';
        this.mechaHolster = '<:MechaHolster:970668988541571092>';
        this.vanishingExecution = '<:VanishingExecution:970668988558348338>';
        this.vampiresCaress = '<:VampiresCaress:970668988562563092>';
        this.vanishingShadow = '<:VanishingShadow:970668988575137832>';
        this.overflowingLight = '<:OverflowingLight:970668988575146025>';
        this.mobiusConduit = '<:MobiusConduit:970668988587724810>';
        this.wraithmetalMail = '<:WraithmetalMail:970668988596097104>';
        this.synapseJunctions = '<:SynapseJunctions:970668988596125786>';
        this.reflectiveVents = '<:ReflectiveVents:970668988600291398>';
        this.vengeance = '<:Vengeance:970668988608679946>';
        this.peregrineStrike = '<:PeregrineStrike:970668988608708708>';
        this.solarRampart = '<:SolarRampart:970668988621291540>';
        this.rapidCooldown = '<:RapidCooldown:970668988642250792>';
        this.spheromatikTrigger = '<:SpheromatikTrigger:970668988646428772>';
        this.rovingAssassin = '<:RovingAssassin:970668988650627092>';
        this.voltaicMirror = '<:VoltaicMirror:970668988654829648>';
        this.ritesofEmber = '<:RitesofEmber:970668988659011594>';
        this.strangeProtractor = '<:StrangeProtractor:970668988688384000>';
        this.planetaryTorrent = '<:PlanetaryTorrent:970668988696756224>';
        this.lightShift = '<:LightShift:970668988696760361>';
        this.sharpEdges = '<:SharpEdges:970668988700979221>';
        this.probabilityMatrix = '<:ProbabilityMatrix:970668988755509258>';
        this.starlessNight = '<:StarlessNight:970668988759703602>';
        this.skitteringStinger = '<:SkitteringStinger:970668988780658688>';
        this.movetoSurvive = '<:MovetoSurvive:970668988797452288>';
        this.seriouslyWatchOut = '<:SeriouslyWatchOut:970668988826791956>';
        this.newTricks = '<:NewTricks:970668988864557136>';
        this.springLoadedMounting = '<:SpringLoadedMounting:970668988961013790>';
        this.scissorFingers = '<:ScissorFingers:970668988965220433>';
    }

    getExoticArmorPerk(perkName) {
        perkName = perkName.replace(/\s+|'+|\-+/g, '');
        perkName = perkName.charAt(0).toLowerCase() + perkName.slice(1);
        return this[perkName];
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

    getDeepsightResonanceEmote() {
        return this.deepsightResonance;
    }

    getCraftedEmote() {
        return this.crafted;
    }

    getCraftingMaterialsEmote(materialName) {
        materialName = materialName.replace(/\s+/g, '');
        materialName = materialName.charAt(0).toLowerCase() + materialName.slice(1);
        return this[materialName];
    }

    getClassEmote(className) {
        className = className.charAt(0).toLowerCase() + className.slice(1);
        return this[className];
    }

    getAmmoTypeEmote(ammoType) {
        ammoType = ammoType.charAt(0).toLowerCase() + ammoType.slice(1) + 'Ammo';
        return this[ammoType];
    }

    getElementEmote(element) {
        switch (element) {
            case 'Arc':
                return this.arc;
            case 'Solar':
                return this.solar;
            case 'Void':
                return this.void;
            case 'Stasis':
                return this.stasis;
            case 'Kinetic':
                return this.kinetic;
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
                    energyGauge.push(this.solarEnergyAvailable);
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
                    energyGauge.push(this.voidEnergyAvailable);
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
            case 'Kinetic':
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
        statName = statName.charAt(0).toLowerCase() + statName.slice(1);
        return this[statName];
    }

    getWeaponEmote(weapon, slot=undefined) {
        if(weapon == 'Grenade Launcher') {
            if(slot == 1) {
                return this.grenadeLauncher;
            } else {
                return this.heavyGrenadelauncher;
            }
        }

        weapon = weapon.replace(/\s+/g, '');
        weapon = weapon.charAt(0).toLowerCase() + weapon.slice(1);

        return this[weapon];
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