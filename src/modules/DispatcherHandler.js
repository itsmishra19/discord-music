import { makeEmbed } from "../utils/makeEmbed.js";
import { customError } from "../utils/customError.js";
import { Queue } from "./Queue.js";

class Dispatcher {
    constructor(options, player) {
        this.textChannel = options.textChannel;
        this.guild = options.guild;
        this.voiceChannel = options.voiceChannel;
        this.player = player;
        this.queue = new Queue();
    }
}

export class DispatcherHandler extends Map {
    constructor(client, entries) {
        super(entries);
        this.client = client;
    }

    async create(options) {
        const existing = this.get(options.guild.id);
        const node = this.client.shoukaku.getNode();

        if (!node) {
            return options.textChannel.send({
                embeds: [
                    makeEmbed("error", "No lavalink node is available")
                ]
            });
        }

        if (!existing) {
            const player = await node.joinChannel({
                guildId: options.guild.id,
                channelId: options.voiceChannel.id,
                shard: options.guild.shardId,
                deaf: true
            }).catch(e => customError("SHOUKAKU_JOIN_CHANNEL", e));

            const dispatcher = new Dispatcher(options, player);
            this.set(options.guild.id, dispatcher);
            return dispatcher;
        } else {
            existing.textChannel = options.textChannel;
            return existing;
        }
    }

    async destroy(guildId) {
        const dispatcher = this.get(guildId);
        if (dispatcher?.player) await dispatcher.player.connection.disconnect();
        return this.delete(guildId);
    }
}