import { promises as fs } from "fs";
import { parse, resolve } from "path";
import { Collection } from "discord.js";
import { customError } from "../utils/customError.js";
import { pathToFileURL } from "url";

export class CommandManager extends Collection {
    constructor(client, path) {
        super();
        this.client = client;
        this.path = path;
        this.isReady = false;
    }

    async load() {
        const categories = await fs.readdir(resolve(this.path)).catch(err => this.client.logger.error(customError("CATEGORY_LOADER_ERR:", err)));
        for (const category of categories) {
            const files = await fs.readdir(resolve(this.path, category)).catch(err => this.client.logger.error(customError("CMD_LOADER_ERR:", err)));
            const allCmd = await this.client.application.commands.fetch().catch(() => this.client.logger.info(customError("GLOBAL_SLASH_FETCH", "An error occured while fetching slash comamnds")));
            for (const file of files) {
                const path = resolve(this.path, category, file);
                const command = await this.import(path, this.client, { category, path });
                if (command === undefined) this.client.logger.error(customError("INVALID_COMMAND", `Command: ${file} is not a valid command`));
                command.meta = Object.assign(command.meta, { path, category });
                this.set(command.meta.slash.name, command);
                if (!allCmd.find(c => c.name !== command.meta.slash.name)) {
                    if (this.client.config.isDev) {
                        for (const devGuild of this.client.config.devGuilds) {
                            const guild = await this.client.guilds.fetch(devGuild);
                            await guild.commands.create(command.meta.slash)
                                .catch(() => this.client.logger.info(`Missing access on ${guild} [SLASH_COMMAND]`));
                        }
                    } else {
                        await this.client.application.commands.create(command.meta.slash).catch(() => this.client.logger.log(customError("GLOBAL_SLASH_REGISTER", "Error in registering global slash")));
                    }
                }
            }
            this.client.logger.log("CMD_LOAD_CATEGORY", `Registered ${category} category`);
        }
        this.client.logger.log("CMD_LOAD", "Registered all categories");
        this.isReady = true;
    }

    /**
     * @private
     */
    async import(path, ...args) {
        const file = (await import(pathToFileURL(path)).then(m => m[parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
