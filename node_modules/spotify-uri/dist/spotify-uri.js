"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpotifyUri {
    constructor(uri) {
        this.uri = uri;
    }
    static is(v) {
        return Boolean(v && typeof v.uri === 'string');
    }
    toEmbedURL() {
        return `https://embed.spotify.com/?uri=${this.toURI()}`;
    }
    toOpenURL() {
        return `http://open.spotify.com${this.toURL()}`;
    }
    toPlayURL() {
        return `https://play.spotify.com${this.toURL()}`;
    }
}
exports.default = SpotifyUri;
//# sourceMappingURL=spotify-uri.js.map