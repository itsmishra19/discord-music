/* eslint-disable @typescript-eslint/no-base-to-string */
import { Colors, ColorResolvable, EmbedBuilder } from "discord.js";
import { Emojis, embedInfoColor } from "../constants";
import { Client } from "../structures/Client";


type hexColorsType = "error" | "info" | "success" | "warn";
const hexColors: Record<hexColorsType, ColorResolvable> = {
    error: Colors.Red,
    info: embedInfoColor,
    success: Colors.Green,
    warn: Colors.Yellow
};

export class Util {
    public constructor(public readonly client: Client) {}

    public static async formatMS(ms: number): Promise<string> {
        if (isNaN(ms)) throw new Error("value is not a number.");
        const prettyMs = await import("pretty-ms");
        return prettyMs.default(ms, {
            verbose: true,
            compact: false,
            secondsDecimalDigits: 0
        });
    }

    public static createEmbed(type: hexColorsType, message?: string, emoji = false): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(hexColors[type]);

        if (message) embed.setDescription(message);
        if (type === "error" && emoji) embed.setDescription(`${Emojis.No} **|** ${message!}`);
        if (type === "success" && emoji) embed.setDescription(`${Emojis.Yes} **|** ${message!}`);
        return embed;
    }

    public static paginate(text: string, limit = 2000): string[] {
        const lines = text.trim().split("\n");
        const pages = [];
        let chunk = "";

        for (const line of lines) {
            if (chunk.length + line.length > limit && chunk.length > 0) {
                pages.push(chunk);
                chunk = "";
            }

            if (line.length > limit) {
                const lineChunks = line.length / limit;

                for (let i = 0; i < lineChunks; i++) {
                    const start = i * limit;
                    const end = start + limit;
                    pages.push(line.slice(start, end));
                }
            } else {
                chunk += `${line}\n`;
            }
        }

        if (chunk.length > 0) {
            pages.push(chunk);
        }

        return pages;
    }

    public static chunk<T>(arr: T[], len: number): T[][];
    public static chunk(arr: string, len: number): string[];
    public static chunk(...args: any[]): any[] {
        const [arr, len] = args as [any, number];
        const rest: (typeof arr)[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        for (let i = 0; i < arr.length; i += len) { rest.push(arr.slice(i, i + len)); }
        return rest;
    }

    public static isURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
