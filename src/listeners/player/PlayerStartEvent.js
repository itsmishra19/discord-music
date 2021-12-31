import { BaseEvent } from "../../base/BaseEvent.js";
import { makeEmbed } from "../../utils/makeEmbed.js";

export class PlayerStartEvent extends BaseEvent {
    constructor(client) {
        super(client, "playerTrackStart");
    }

    async execute(_, payload) {
        const dispatcher = this.client.queue.get(payload.guildId);

        if (dispatcher) {
            dispatcher?.textChannel?.send({
                embeds: [
                    makeEmbed("info", `\`${dispatcher.queue.current.info.title}\``).setTitle("Now Playing")
                ]
            });
        }
    }
}
