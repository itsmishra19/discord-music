import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class PingCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "ping",
                description: "gives the ping of the bot"
            },
            category: "General"
        });
    }

    async execute(ctx) {
        ctx.send({
            embeds: [
                makeEmbed("info", `\`\`\`REST Latency: ${Date.now() - ctx.guild.restTimestamp}ms\nWS Latency: ${this.client.ws.ping}ms\`\`\``).setFooter({ text: `Requested by ${ctx.author.tag}` })
            ]
        });
    }
}
