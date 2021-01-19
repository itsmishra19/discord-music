"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
class Local extends spotify_uri_1.default {
    constructor(uri, artist, album, track, seconds) {
        super(uri);
        this.type = 'local';
        this.artist = artist;
        this.album = album;
        this.track = track;
        this.seconds = seconds;
    }
    static is(v) {
        return Boolean(v && v.type === 'local');
    }
    toURI() {
        return `spotify:local:${util_1.encode(this.artist)}:${util_1.encode(this.album)}:${util_1.encode(this.track)}:${this.seconds}`;
    }
    toURL() {
        return `/local/${util_1.encode(this.artist)}/${util_1.encode(this.album)}/${util_1.encode(this.track)}/${this.seconds}`;
    }
}
exports.default = Local;
//# sourceMappingURL=local.js.map