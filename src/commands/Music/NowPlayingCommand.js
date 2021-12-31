import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";
import { formatTime } from "../../utils/formatTime.js";

export class NowPlayingCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "nowplaying",
                description: "Shows the current playing track"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, isPlaying: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        const currentTrack = dispatcher.queue.current;

        ctx.send({
            embeds: [
                makeEmbed("success", `\`${currentTrack.info.title}\``)
                    .addFields(
                        { name: "Author", value: `\`${currentTrack.info.author}\``, inline: true },
                        { name: "Duration", value: `\`${formatTime(currentTrack.info.length)}\``, inline: true }
                    )
                    .setTitle("Now Playing")
            ]
        });
    }
}
