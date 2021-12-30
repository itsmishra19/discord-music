import { BaseEvent } from "../base/BaseEvent.js";

export class ReadyEvent extends BaseEvent {
    constructor(client) {
        super(client, "playerTrackStart");
    }

    async execute(player, payload) {
        console.log(player, payload);
    }
}
