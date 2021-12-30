export class BaseEvent {
    constructor(client, name) {
        this.client = client;
        this.name = name;
        if (this.execute === undefined) throw new TypeError(`Class ${this.constructor.name} must have a execute method`);
        if (this.execute.constructor.name !== "AsyncFunction") throw new TypeError(`Class ${this.constructor.name} must have a asynchronus execute method`);
    }
}
