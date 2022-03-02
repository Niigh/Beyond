//#region libs
require('dotenv').config();
const axios = require('axios');

//Trace module
const {err, wrn, inf, not, dbg} = require('../trace.js');
//#endregion

class BungieAPI {
    constructor () {
        this.rootPath = 'https://www.bungie.net/Platform'
        this.key = process.env.BUNGIE_API_TOKEN,
        this.axios = axios.create({})
        this.manifest;
    };

    get(path) {
        not(`GET ${this.rootPath+path}`);
        return this.axios.get(this.buildURL(path), {
            headers: {
                'X-API-Key': this.key,
                'User-Agent': `Node.js/${process.versions.node} Beyond/1.0`
            }
        })
    };

    post(path, data) {
        return this.axios({
            method: 'post',
            url: this.buildURL(path),
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.key,
                'User-Agent': `Node.js/${process.versions.node} Beyond/1.0`
            },
            data: data
        })
    };

    buildURL(path) {
        return `${this.rootPath}${path}`
    };

    isBungieAPIDown(response) {
        return (!(response.data.ErrorStatus === 'Success'));
    };

    getManifest() {

    };

    getPlateform(plateformId) {
        var plateform = 'None';
        switch (plateformId) {
            case -1:
                plateform = 'All';
                break;
            case 1:
                plateform = 'Xbox';
                break;
            case 2:
                plateform = 'PSN';
                break;
            case 3:
                plateform = 'Steam'
                break;
            case 5:
                plateform = 'Stadia'
                break;
            default:
                break;
        }

        return plateform
    };

    getClass(classId) {
        var className = 'Unknown';
        switch (classId) {
            case 0:
                className = 'Titan';
                break;
            case 1:
                className = 'Hunter';
                break;
            case 2:
                className = 'Warlock'
                break;
            default:
                break;
        }
        return className
    };

    getClassID(className) {
        var classId = 3;
        switch (className) {
            case 'Titan':
                classId = 0;
                break;
            case 'Hunter':
                classId = 1;
                break;
            case 'Warlock':
                classId = 2;
                break;
            default:
                break;
        }
        return classId
    };

    isPublicAccount(data) {
        return data[0].isPublic;
    };
};

module.exports = { BungieAPI };