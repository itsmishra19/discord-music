import { BaseCommand } from "../../base/BaseCommand.js";
import { LOOP_STATE } from "../../utils/constants.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class LoopCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "loop",
                description: "Loops the current track"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);

        dispatcher.queue.setLoop(LOOP_STATE.SINGLE);

        ctx.send({
            embeds: [
                makeEmbed("success", `Enabled track loop`, true)
            ]
        });
    }
}
