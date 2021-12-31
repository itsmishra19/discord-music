import { promises as fs } from "fs";
import { parse, resolve } from "path";
import { pathToFileURL } from "url";
import { customError } from "../utils/customError.js";

export class EventManager {
    constructor(client, emitter, path) {
        this.client = client;
        this.emitter = emitter;
        this.path = path;
    }

    async load() {
        const files = await fs.readdir(resolve(this.path)).catch(err => this.client.logger.error(customError("EVENTS_LOADER_ERR:", err)));
        for (const file of files.filter(x => x.endsWith(".js"))) {
            const event = await this.import(resolve(this.path, file), this.client);
            if (event === undefined) throw new Error(`EVENT: ${file} is not a valid event file`);
            this.emitter.on(event.name, (...args) => event.execute(...args));
        }
        this.client.logger.log("EVENT_LOAD", `Loaded all events in ${this.emitter.constructor.name} emitter`);
    }

    /**
     * @private
     */
    async import(path, ...args) {
        const file = (await import(pathToFileURL(path)).then(m => m[parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
