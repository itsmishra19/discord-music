/* eslint-disable no-undef */
import { customError } from "../utils/customError.js";
import { Queue } from "./Queue.js";
import { TrackLoader } from "./TrackLoader.js";

class Dispatcher {
    constructor(options, player) {
        this.client = options.client;
        this.textChannel = options.textChannel;
        this.guild = options.guild;
        this.voiceChannel = options.voiceChannel;
        this.player = player;
        this.queue = new Queue();
        this.tracks = new TrackLoader(options.client);
    }

    async play(options = { noReplace: false }) {
        if (this.queue.length && !this.queue.current) this.queue.next();
        if (!this.queue.current) return null;
        return this.player?.playTrack({ track: this.queue.current.track }, options).setVolume(0.3);
    }
}

export class DispatcherManager extends Map {
    constructor(client, entries) {
        super(entries);
        this.client = client;
    }

    async create(options) {
        const existing = this.get(options.guild.id);
        const node = this.client.shoukaku.getNode();

        if (!existing) {
            const player = await node.joinChannel({
                guildId: options.guild.id,
                channelId: options.voiceChannel.id,
                shardId: options.guild.shardId,
                deaf: true
            }).catch(e => customError("SHOUKAKU_JOIN_CHANNEL", e));

            if (!player) return null;

            const dispatcher = new Dispatcher(options, player);
            this.set(options.guild.id, dispatcher);
            return dispatcher;
        }
        existing.textChannel = options.textChannel;
        return existing;
    }

    async destroy(guildId) {
        const dispatcher = this.get(guildId);
        if (dispatcher?.player) await dispatcher.player.connection.disconnect();
        return this.delete(guildId);
    }
}
