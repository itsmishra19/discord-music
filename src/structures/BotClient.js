import { Client } from "discord.js";
import { resolve } from "path";
import { config } from "../config.js";
import { Logger } from "../modules/Logger.js";
import { CommandManager } from "../modules/CommandManager.js";
import { EventManager } from "../modules/EventManager.js";
import { DispatcherManager } from "../modules/DispatcherManager.js";
import { ShoukakuHandler } from "./Shoukaku.js";

export class BotClient extends Client {
    constructor(options) {
        super(options);

        this.config = config;
        this.cwd = process.cwd();
        this.logger = new Logger();
        this.shoukaku = new ShoukakuHandler(this);
        this.queue = new DispatcherManager(this);

        this.commands = new CommandManager(this, resolve(this.cwd, "src", "commands"));
        this.events = new EventManager(this, this, resolve(this.cwd, "src", "listeners"));
    }

    async build() {
        await this.events.load();
        this.on("ready", async () => this.commands.load());
        await this.login(this.config.token);
        return this;
    }
}
