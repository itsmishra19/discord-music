import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";
import { MessageActionRow, MessageButton } from "discord.js";

export class InvigeCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "invite",
                description: "gives the invite link of the bot"
            },
            category: "General"
        });
    }

    async execute(ctx) {
        const invite = await this.client.generateInvite({
            permissions: [
                "ADMINISTRATOR"
            ],
            scopes: ["bot", "applications.commands"]
        });

        ctx.send({
            embeds: [
                makeEmbed("info", `Click on the button below to invite me!`)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL(invite)
                            .setLabel("Invite")
                    )
            ]
        });
    }
}
