import { BaseEvent } from "../base/BaseEvent.js";

export class ReadyEvent extends BaseEvent {
    constructor(client) {
        super(client, "ready");
    }

    async execute() {
        this.client.logger.info(`${this.client.user.tag} is online on ${this.client.guilds.cache.size} guilds`);
    }
}
