import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class SkipCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "skip",
                description: "Skip songs"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true, hasQueue: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        const track = dispatcher.queue.current;

        await dispatcher.player?.stopTrack();

        ctx.send({
            embeds: [
                makeEmbed("success", `Skipped \`${track.info.title}\``)
            ]
        });
    }
}
