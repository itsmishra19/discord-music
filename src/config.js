import { nodes } from "../lavalink-config.js";

/* eslint-disable no-undef */
export const config = {
    token: process.env.TOKEN,
    isDev: true,
    devGuilds: ["516073932009242624"],
    lavalink: {
        options: {
            moveOnDisconnect: false,
            reconnectTries: 2,
            restTimeout: 10000,
            resumable: true,
            resumableKey: 'discord-music',
            resumableTimeout: 30
        },
        servers: nodes
    }
};
