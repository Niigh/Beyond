//#region libs
/*Environnment variables*/
require('dotenv').config();

const config = require('./config.json');
const env = config.env;

/*Winston*/
const winston = require('winston');

/*Trace File reset*/
const fs = require('fs');
if (fs.existsSync('./logfile.log')) {
    try {
        fs.unlinkSync('./logfile.log');
    } catch(err) {
        console.error(err);
    }
}
//#endregion

//#region trace module
/*Trace init*/
const logFormat = winston.format.printf(log => {
    return `${log.timestamp} : [${log.level}] - ${log.message}`;
});

const traceConfig = {
    level: 'debug',
    /*[ 0:error | 1:warn | 2:info | 3:http | 4:verbose | 5:debug | 6:silly ]*/
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log'}),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat,
    ),
    exitOnError: false,
};

/*env = [dev | prod]*/
if (env === 'prod') {
    traceConfig.level= 'error';
}

const trace = winston.createLogger(traceConfig);

/*Trace shorts*/
module.exports.err = function(m) { return trace.error(m);};
module.exports.wrn = function(m) {return trace.warn(m);};
module.exports.inf = function(m) {return trace.info(m);};
module.exports.not = function(m) {return trace.verbose(m);};
module.exports.dbg = function(m) {return trace.debug(m);};
//#endregion