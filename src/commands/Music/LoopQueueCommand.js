import { BaseCommand } from "../../base/BaseCommand.js";
import { LOOP_STATE } from "../../utils/constants.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class LoopQueueCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "loopqueue",
                description: "Loops the whole queue"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        dispatcher.queue.setLoop(LOOP_STATE.QUEUE);

        ctx.send({
            embeds: [
                makeEmbed("success", `Enabled queue loop`, true)
            ]
        });
    }
}
