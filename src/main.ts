import "dotenv/config";

import { Client } from "./structures/Client";
import { GatewayIntentBits } from "discord.js";
import { join } from "path";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
    baseUserDirectory: join(__dirname)
});


void client.login(process.env.TOKEN);
