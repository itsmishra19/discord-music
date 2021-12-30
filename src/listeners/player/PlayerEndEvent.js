import { BaseEvent } from "../../base/BaseEvent.js";

export class PlayerEndEvent extends BaseEvent {
    constructor(client) {
        super(client, "playerTrackEnd");
    }

    async execute(_, payload) {
        const dispatcher = this.client.queue.get(payload.guildId);
        dispatcher.queue.next();

        if (dispatcher.queue.current) {
            await dispatcher.play();
        }
    }
}
