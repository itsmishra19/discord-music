/* eslint-disable no-undef */
import { BaseEvent } from "../base/BaseEvent.js";
import { CommandContext } from "../structures/CommandContext.js";

export class InteractionCreate extends BaseEvent {
    constructor(client) {
        super(client, "interactionCreate");
    }

    async execute(interaction) {
        if (!interaction.inGuild() && interaction.isCommand()) return interaction.reply("Sorry, but this command is only limited to guilds.");
        if (interaction.isCommand()) {
            const cmd = this.client.commands.find(c => c.meta.slash.name === interaction.commandName);
            interaction.guild.restTimestamp = Date.now();
            if (cmd) {
                const context = new CommandContext(interaction);
                await interaction.deferReply();
                await cmd.execute(context);
            }
        }
    }
}
