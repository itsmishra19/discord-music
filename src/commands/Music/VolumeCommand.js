import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class VolumeCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "volume",
                description: "Updates the volume of the player",
                options: [
                    {
                        name: "volume",
                        type: "NUMBER",
                        description: "The volume to update"
                    }
                ]
            },
            category: "Music"
        });
    }

    get connectionChecking() {
        return { memberInVoice: true, dispatcherExists: true, memberInSameVoice: true };
    }

    async execute(ctx) {
        const volume = ctx.options.getNumber("volume");
        const dispatcher = this.client.queue.get(ctx.guild.id);

        if (!volume) {
            return ctx.send({
                embeds: [
                    makeEmbed("info", `The current volume is ${dispatcher?.player.filters.volume * 100}`)
                ]
            });
        }

        if (volume < 1 || volume > 100) {
            return ctx.send({
                embeds: [
                    makeEmbed("error", "The volume must not be less than \`1\` and more than \`100\`", true)
                ]
            });
        }

        await dispatcher.player?.setVolume(volume / 100);

        ctx.send({
            embeds: [
                makeEmbed("success", `Volume has been updated to ${volume}%`)
            ]
        });
    }
}
