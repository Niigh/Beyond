require('dotenv').config();
const axios = require('axios');

const {err, wrn, inf, not, dbg} = require('../trace.js');

class BungieAPI {
    constructor () {
        this.rootPath = 'https://www.bungie.net/Platform'
        this.key = process.env.BUNGIE_API_TOKEN,
        this.axios = axios.create({})
    };

    get(path) {
        inf(`GET ${this.rootPath+path}`);
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

    buildURL = function buildURL(path) {
        return `${this.rootPath}${encodeURIComponent(path)}`
    };
    
};

module.exports = { BungieAPI };