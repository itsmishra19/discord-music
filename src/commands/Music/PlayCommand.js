import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class PlayCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "play",
                description: "The bot joins your voice channel and play songs",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        required: true,
                        description: "Query for searching and playing"
                    }
                ]
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: false };
    }

    async execute(ctx) {
        const query = ctx.options.getString("query");

        const dispatcher = await this.client.queue.create({
            guild: ctx.guild,
            voiceChannel: ctx.member.voice.channel,
            textChannel: ctx.channel,
            client: this.client
        });

        if (!dispatcher.player) {
            return ctx.send({
                embeds: [
                    makeEmbed("error", "No connection was established")
                ]
            });
        }

        await dispatcher.tracks.load({
            query,
            ctx
        });
    }
}
