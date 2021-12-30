/* eslint-disable no-undef */
import { BaseEvent } from "../base/BaseEvent.js";
import { CommandContext } from "../structures/CommandContext.js";
import { makeEmbed } from "../utils/makeEmbed.js";

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
                const connectionChecking = cmd?.connectionChecking;
                const context = new CommandContext(interaction);

                if (connectionChecking) {
                    if (connectionChecking.memberInVoice && !interaction.member.voice.channelId) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "You must be in a voice channel to use this command!", true)
                            ]
                        });
                    }

                    if (connectionChecking.dispatcherExists && !this.client.queue.has(interaction.guild.id)) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "No dispatcher exists for this server", true)
                            ]
                        });
                    }

                    if (connectionChecking.memberInSameVoice && interaction.member.voice.channelId !== this.client.queue.get(interaction.guild.id).voiceChannel.id) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "You must be in the same voice channel as me")
                            ]
                        });
                    }
                }

                await interaction.deferReply();
                await cmd.execute(context);
            }
        }
    }
}
