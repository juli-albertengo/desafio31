//TODO: Desafio Clase 31 - Logger

const log4js = require('log4js');
log4js.configure({
  appenders: {
    miLoggerConsole: {type: "console"},
    miLoggerFileWarning: {type: 'file', filename: 'warn.log'},
    miLoggerFileError: {type: 'file', filename: 'error.log'}
  },
  categories: {
    default: {appenders: ["miLoggerConsole"], level:"trace"},
    console: { appenders: ["miLoggerConsole"], level: "info" },
    archivoWarn: { appenders: ["miLoggerFileWarning"], level: "warn"},
    archivoError: { appenders: ["miLoggerFileError"], level: "error"},
  }
});

const loggerConsole = log4js.getLogger('console');
const loggerWarn = log4js.getLogger('archivoWarn');
const loggerError = log4js.getLogger('archivoError');

module.exports = {loggerConsole, loggerWarn, loggerError}