/* eslint-disable no-undef */
import { MessageEmbed } from "discord.js";
import { BaseCommand } from "../../base/BaseCommand.js";

export class HelpCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "help",
                description: "Displays all the command available",
                options: [
                    {
                        type: "STRING",
                        name: "command",
                        description: "Command name to view a specific information about command"
                    }
                ]
            },
            category: "General"
        });
    }

    async execute(ctx) {
        const value = ctx.options.getString("command");
        const command = this.client.commands.get(value);

        if (command) {
            const infoEmbed = new MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor({ name: `${this.client.user.username} - Information about ${command.meta.slash.name} command`, iconURL: this.client.user?.displayAvatarURL() })
                .addField("Name", `\`\`\`${command.meta.slash.name}\`\`\``)
                .addField("Description", `\`\`\`${command.meta.slash.description}\`\`\``)
                .addField("Category", `\`\`\`${command.meta.category}\`\`\``);

            return ctx.send({
                embeds: [infoEmbed]
            });
        }

        const categories = this.client.commands.map(c => c.meta.category).filter((item, pos, self) => self.indexOf(item) === pos);

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${this.client.user.username} | Help Menu`)
            .setThumbnail(this.client.user?.displayAvatarURL())
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.avatarURL({ size: 4096, dynamic: true }) });

        for (const category of categories) embed.addField(category, this.client.commands.filter(c => c.meta.category === category).map(c => `\`${c.meta.slash.name}\``).join(", "), true);

        ctx.send({
            embeds: [embed]
        });
    }
}
