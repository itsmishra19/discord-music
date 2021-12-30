import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class ResumeCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "resume",
                description: "Resumes the current playing track"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true, isPlaying: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        await dispatcher.player?.setPaused(false);

        ctx.send({
            embeds: [
                makeEmbed("success", `Resumes the player`)
            ]
        });
    }
}
