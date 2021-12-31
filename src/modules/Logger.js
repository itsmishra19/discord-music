/* eslint-disable no-undef */
export class Logger {
    debug(title, message) {
        console.debug(`[Process ${process.pid}] [${title}] ${message}`);
    }

    log(title, message) {
        console.log(`[Process ${process.pid}] [${title}] ${message}`);
    }

    info(message) {
        console.info(`[Process ${process.pid}]`, message);
    }

    error(error) {
        console.error(`[Process ${process.pid}] `, error);
    }
}
