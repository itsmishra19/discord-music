import "dotenv/config";
import { BotClient } from "./structures/BotClient.js";
import { customError } from "./utils/customError.js";
import { Intents } from "discord.js";

const clientOptions = {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
    retryLimit: 3
};

export const client = new BotClient(clientOptions);

client.build();

process.on("unhandledRejection", e => {
    if (e instanceof Error) {
        client.logger.error(e);
    } else {
        client.logger.error(customError("PromiseError"));
    }
});

process.on("uncaughtException", e => {
    client.logger.log(e);
    process.exit(1);
});
