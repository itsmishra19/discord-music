import { BaseEvent } from "../../base/BaseEvent.js";

export class PlayerStartEvent extends BaseEvent {
    constructor(client) {
        super(client, "playerTrackStart");
    }

    async execute(player, payload) {
        console.log(player, payload);
    }
}
