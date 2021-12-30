import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class StopCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "stop",
                description: "Stops the queue"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true };
    }

    async execute(ctx) {
        await this.client.queue.destroy(ctx.guild.id);

        ctx.send({
            embeds: [
                makeEmbed("success", `Successfully destroyed the player and left the voice channel`)
            ]
        });
    }
}
