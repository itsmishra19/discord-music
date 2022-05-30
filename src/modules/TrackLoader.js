import { makeEmbed } from "../utils/makeEmbed.js";

export class TrackLoader {
    constructor(client) {
        this.client = client;
    }

    async load(options) {
        const dispatcher = this.client.queue.get(options.ctx.guild.id);
        const wasPlaying = dispatcher?.queue.current;

        if (!dispatcher?.player) return null;

        const node = this.client.shoukaku.getNode();

        if (!node) {
            options.ctx.send({
                embeds: [
                    makeEmbed("error", "No lavalink node was found")
                ]
            });
        }
        const response = await node.rest.resolve(this.resolveSource(options.query)).catch(e => console.log(e));

        if (response.type === "NO_MATCHES" || !response.tracks.length) {
            return options.ctx.send({
                embeds: [
                    makeEmbed("error", "Couldn't find any track", true)
                ]
            });
        }

        if (response.loadType === "PLAYLIST_LOADED") {
            for (const track of response.tracks) {
                dispatcher.queue.push(track);
            }

            options.ctx.send({
                embeds: [
                    makeEmbed("info", `All tracks in playlist ${response.playlistName ?? "Unknown Playlist"} was queued`)
                ]
            });
        } else {
            options.ctx.send({
                embeds: [
                    makeEmbed("info", `Successfully queued ${response.tracks[0].info.title}`)
                ]
            });

            dispatcher.queue.push(response.tracks[0]);
        }

        if (!wasPlaying && !dispatcher?.player.paused) await dispatcher.play();
    }

    resolveSource(query) {
        if (this.isValidURL(query)) return null;
        return `ytsearch:${query}`;
    }

    isValidURL(query) {
        try {
            new URL(query);
            return true;
        } catch (e) {
            return false;
        }
    }
}
