const winston = require('winston');

var options = {
    file: {
        level: 'info',
        filename: '${_dirname}/../logs/error.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    }
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(), // Log Print in console
    ],
    exitOnError: true,
});

logger.stream = {
    write: function (message, encoding) {
        logger.error(message);
    },
};

module.exports = logger;