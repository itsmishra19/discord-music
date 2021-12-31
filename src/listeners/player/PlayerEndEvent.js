import { BaseEvent } from "../../base/BaseEvent.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class PlayerEndEvent extends BaseEvent {
    constructor(client) {
        super(client, "playerTrackEnd");
    }

    async execute(_, payload) {
        const dispatcher = this.client.queue.get(payload.guildId);
        dispatcher.queue.next();

        if (dispatcher.queue.current) {
            await dispatcher.play();
        } else {
            dispatcher?.textChannel?.send({
                embeds: [
                    makeEmbed("error", "No more tracks to play leaving the voice channel")
                ]
            });
            await this.client.queue.destroy(payload.guildId);
        }
    }
}
