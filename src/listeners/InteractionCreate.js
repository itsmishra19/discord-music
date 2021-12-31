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
                    const dispatcher = this.client.queue.get(interaction.guild.id);
                    const memberVoiceChannelId = interaction.member.voice.channelId;
                    const botVoiceChannelId = interaction.guild.me.voice.channelId;

                    if (connectionChecking.memberInVoice && !memberVoiceChannelId) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "You must be in a voice channel to use this command!", true)
                            ]
                        });
                    }

                    if (connectionChecking.dispatcherExists && !dispatcher) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "No dispatcher exists for this server", true)
                            ]
                        });
                    }

                    if (connectionChecking.memberInSameVoice && dispatcher && memberVoiceChannelId !== botVoiceChannelId) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "You must be in the same voice channel as me!", true)
                            ]
                        });
                    }

                    if (connectionChecking.isPlaying && !dispatcher.queue.current) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "There is nothing playing right now", true)
                            ]
                        });
                    }

                    if (connectionChecking.hasQueue && !dispatcher.queue.length) {
                        return interaction.reply({
                            embeds: [
                                makeEmbed("error", "The queue is empty", true)
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
