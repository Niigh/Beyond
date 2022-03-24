//#region libs
require('dotenv').config();
const axios = require('axios');

const pkg = require('../package.json');

const config = require('../config.json');
const localManifestPath = config.manifest_path;
const databasePath = config.database_root_path;

const fs = require('fs');
const unzip = require('unzipper');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class BungieAPI {
    constructor () {
        this.rootPath = 'https://www.bungie.net/Platform'
        this.key = process.env.BUNGIE_API_TOKEN,
        this.axios = axios.create({})
        this.manifestPath = localManifestPath;
        this.destinyDBPath = databasePath;
    }

    get(path) {
        not(`GET ${this.rootPath+path}`);
        return this.axios({
            method: 'get',
            url: this.buildURL(path),
            timeout: 10000,
            headers: {
                'X-API-Key': this.key,
                'User-Agent': `Node.js/${process.versions.node} Beyond/${pkg.version}`
            }
        });
    }

    post(path, data) {
        return this.axios({
            method: 'post',
            url: this.buildURL(path),
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.key,
                'User-Agent': `Node.js/${process.versions.node} Beyond/${pkg.version}`
            },
            data: data
        });
    }

    buildURL(path) {
        return `${this.rootPath}${path}`;
    }

    buildURLAsset(path) {
        return `https://www.bungie.net${path}`;
    }

    isBungieAPIDown(response) {
        return (!(response.data.ErrorStatus === 'Success'));
    }

    getManifest() {
        not('Recovering manifest ...');
        this.get('/Destiny2/Manifest/')
            .then( async res => {
                var manifest = res.data.Response;

                fs.access(localManifestPath, fs.constants.F_OK, error => {
                    if(error!=null) {
                        err('Couldn\'t find the manifest file.')
                        console.error(error);
                        return;
                    };
                });

                not('Reading local manifest ...');
                const localManifestData = fs.readFileSync(localManifestPath);
                if(localManifestData.length!=0) {
                    const localManifest = JSON.parse(localManifestData);
                    if(!this.checkManifestVersion(manifest, localManifest)) {
                        const lastManifestVersion = localManifest.version;
                        inf('Acquiring new manifest ...');
                        fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 4));
                        inf(`New manifest v.${manifest.version} acquired. (last version v.${lastManifestVersion})`);

                        inf('Retrieving Destiny database ...');
                        if(!this.checkDatabaseVersion(localManifest)) {
                            this.getDestinyDatabase(localManifest);
                        };
                    };
                } else {
                    not('No local manifest.');
                    inf(`Manifest version : ${manifest.version}`);
                    inf('Saving new manifest ...');
                    fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 4));

                    const localManifest = JSON.parse(fs.readFileSync(localManifestPath));
                    inf(`New manifest v.${localManifest.version} acquired.`);

                    inf('Retrieving Destiny database ...');
                    if(!this.checkDatabaseVersion(localManifest)) {
                        this.getDestinyDatabase(localManifest);
                    };
                };
            })
            .catch(error => {
                console.error(error);
            });
    }

    checkManifestVersion(manifest, localManifest) {
        inf(`Local manifest version : ${localManifest.version}`);
        inf(`Manifest version : ${manifest.version}`);
        if(localManifest.version!=manifest.version) {
            inf('Local version is older and need to be updated.');
            return false;
        }
        inf('Manifest version up to date.');
        return true;
    }

    refreshManifest() {
        
    }

    getDestinyDatabase(manifest) {
       //Downloading database
        const dbBungiePath = this.buildURLAsset(manifest.mobileWorldContentPaths.en);
        const dbFileName = manifest.mobileWorldContentPaths.en.split("/")[5];
        const dbName = dbFileName.split(".")[0];
        this.axios.get(dbBungiePath, {
            headers: {
                'X-API-Key': this.key,
                'User-Agent': `Node.js/${process.versions.node} Beyond/${pkg.version}`,
            },
            responseType: 'stream'
        })
        .then( async res => {
            res.data.pipe(fs.createWriteStream(`${databasePath}${dbFileName}`));
            res.data.on('end', () => {
                inf('Database updated.');

                //Extracting database
                fs.createReadStream(`${databasePath}${dbFileName}`)
                .pipe(unzip.Extract({
                    path: `${databasePath}${dbName}`
                }))
                .on('entry', () => {
                    inf('Unpacking the database ...');
                })
                .on('close', () => {
                    inf('Database unpacked.');
                    fs.readFile('./config.json','utf8', (error, data) => {
                        if (error){
                            err('Couldn\'t open config.json.');
                            console.log(error);
                        } else {
                            var configObj = JSON.parse(data);
                            configObj.database_path = `${databasePath}${dbName}/${dbName}.content`;
                            const configJson = JSON.stringify(configObj, null, 4);
                            fs.writeFile('./config.json', configJson, 'utf8', () => {
                                not('Succefully added the database path to the config file.');
                            });
                        };
                    });
                    
                })
                .on('error', (error) => {
                    err('Couldn\'t unpack the database.');
                    console.error(error);
                });
            });

        })
        .catch(error => {
            err("Could\'t update the database.");
            console.error(error);
        });
    }

    checkDatabaseVersion(manifest) {
        const dbFileName = manifest.mobileWorldContentPaths.en.split("/")[5];
        const dbFile = fs.readdirSync(databasePath).filter(file => file.endsWith('.content'))[0];

        if(dbFileName==dbFile) {
            inf('Database doesn\'t need to be updated.');
            return true;
        };
        inf('Database need to be updated.');
        return false;
    }

    getPlateform(plateformId) {
        switch (plateformId) {
            case -1:
                return 'All';
                break;
            case 1:
                return 'Xbox';
                break;
            case 2:
                return 'PSN';
                break;
            case 3:
                return 'Steam'
                break;
            case 5:
                return 'Stadia'
                break;
            default:
                break;
        };
        return 'None';
    }

    getClass(classId) {
        switch (classId) {
            case 0:
                return 'Titan';
                break;
            case 1:
                return 'Hunter';
                break;
            case 2:
                return 'Warlock'
                break;
            default:
                break;
        };
        return 'Unknown';
    }

    getClassID(className) {
        switch (className) {
            case 'Titan':
                return 0;
                break;
            case 'Hunter':
                return 1;
                break;
            case 'Warlock':
               return 2;
                break;
            default:
                break;
        };
        return 3;
    }

    getGender(genderHash) {
        switch (genderHash) {
            case '2204441813':
                return 'Female'
                break;
            case '3111576190':
                return 'Male'
                break;
            default:
                break;
        };
    }

    getSeasonPassHash(seasonNumber, isOver100) {
        switch (seasonNumber) {
            case 15: //Lost
                if(!isOver100) {
                    return '4095505052';
                } else {
                    return '1531004716';
                };
                break;
            case 16: //Risen
                if(!isOver100) {
                    return '2069932355';
                } else {
                    return '1787069365';
                };
                break;
            default:
                break;
        };
    }

    isPublicAccount(data) {
        return data[0].isPublic;
    }
};

module.exports = { BungieAPI };