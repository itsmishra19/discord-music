import pkg from "shoukaku";
const { Connectors, Shoukaku } = pkg;
import { resolve } from "path";
import { customError } from "../utils/customError.js";
import { EventManager } from "../modules/EventManager.js";

export class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(new Connectors.DiscordJS(client), client.config.lavalink.servers, client.config.lavalink.options);
        this.events = new EventManager(client, this, resolve(client.cwd, "src", "listeners", "player")).load();
        this.on("ready", (name, resumed) => client.logger.info(`${name} is now connected. ${resumed ? "[reconnected]" : ""}`));
        this.on("error", (name, error) => client.logger.error(customError("LAVALINK_ERR", error.message)));
        this.on("close", (name, code, reason) => client.logger.info(`[WS => ${name}] Connection has been closed with exit code: ${code}. Reason: ${reason || "Unknown"}`));
        if (client.config.isDev) {
            this.on("debug", (name, reason) => client.logger.info(`[WS => ${name}] ${reason || "No reason"}`));
        }
    }
}
