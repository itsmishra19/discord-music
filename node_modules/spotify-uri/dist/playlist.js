"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
class Playlist extends spotify_uri_1.default {
    constructor(uri, id, user) {
        super(uri);
        this.type = 'playlist';
        this.id = id;
        if (typeof user === 'string') {
            this.user = user;
        }
    }
    static is(v) {
        return Boolean(v && v.type === 'playlist');
    }
    toURI() {
        if (this.user) {
            if (this.id === 'starred') {
                return `spotify:user:${util_1.encode(this.user)}:${util_1.encode(this.id)}`;
            }
            return `spotify:user:${util_1.encode(this.user)}:playlist:${util_1.encode(this.id)}`;
        }
        return `spotify:playlist:${util_1.encode(this.id)}`;
    }
    toURL() {
        if (this.user) {
            if (this.id === 'starred') {
                return `/user/${util_1.encode(this.user)}/${util_1.encode(this.id)}`;
            }
            return `/user/${util_1.encode(this.user)}/playlist/${util_1.encode(this.id)}`;
        }
        return `/playlist/${util_1.encode(this.id)}`;
    }
}
exports.default = Playlist;
//# sourceMappingURL=playlist.js.map