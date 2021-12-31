import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";
import { formatTime } from "../../utils/formatTime.js";

export class QueueCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "queue",
                description: "Shows the queued tracks"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { dispatcherExists: true, hasQueue: true };
    }

    async execute(ctx) {
        const dispatcher = this.client.queue.get(ctx.guild.id);
        const queue = dispatcher.queue.slice(0, 9);

        ctx.send({
            embeds: [
                makeEmbed("success", `**Up Next:**\n${queue.map((t, i) => `\`${++i}\` - \`${t.info.title}\` - \`${formatTime(t.info.length)}\``)}`)
                    .setAuthor({ name: `Queue for ${ctx.guild.name}}`, iconURL: ctx.guild.iconURL({ dynamic: true }) })
            ]
        });
    }
}
