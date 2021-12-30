import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class JoinCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "join",
                description: "The bot joins your voice channel"
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: false };
    }

    async execute(ctx) {
        const dispatcher = await this.client.queue.create({
            guild: ctx.guild,
            voiceChannel: ctx.member.voice.channel,
            textChannel: ctx.channel
        });

        if (dispatcher?.voiceChannel) {
            ctx.send({
                embeds: [
                    makeEmbed("info", `Connected to ${dispatcher?.voiceChannel?.toString()}`)
                ]
            });
        }

        ctx.send({
            embeds: [
                makeEmbed("error", "No connection was established")
            ]
        });
    }
}
