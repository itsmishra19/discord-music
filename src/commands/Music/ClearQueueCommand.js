import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class ClearQueueCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "clearqueue",
                description: "Removes all the track from queue"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        const queueLength = dispatcher.queue.length;

        dispatcher.queue.length = 0;

        ctx.send({
            embeds: [
                makeEmbed("success", `Cleared \`${queueLength}\` from queue`, true)
            ]
        });
    }
}
