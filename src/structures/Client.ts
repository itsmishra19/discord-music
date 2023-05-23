import { SapphireClient } from "@sapphire/framework";
import { ClientOptions } from "discord.js";
import { Util } from "../utils/Util";

export class Client extends SapphireClient {
    public readonly util = new Util(this);
    public constructor(opt: ClientOptions) {
        super(opt);
    }

    public async login(token: string | undefined): Promise<string> {
        return super.login(token);
    }
}

declare module "@sapphire/framework" {
    interface SapphireClient {
        util: Util;
    }
}
