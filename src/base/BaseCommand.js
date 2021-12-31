export class BaseCommand {
    constructor(client, meta) {
        this.client = client;
        this.meta = meta;
        if (this.execute === undefined) throw new TypeError(`Class ${this.constructor.name} must have a execute method`);
        if (this.execute.constructor.name !== "AsyncFunction") throw new TypeError(`Class ${this.constructor.name} must have a asynchronus execute method`);
    }
}
