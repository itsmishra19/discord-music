"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const local_1 = __importDefault(require("./local"));
const search_1 = __importDefault(require("./search"));
const playlist_1 = __importDefault(require("./playlist"));
const artist_1 = __importDefault(require("./artist"));
const album_1 = __importDefault(require("./album"));
const track_1 = __importDefault(require("./track"));
const episode_1 = __importDefault(require("./episode"));
const user_1 = __importDefault(require("./user"));
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
const util_1 = require("./util");
/**
 * Parses a "Spotify URI".
 *
 * @param {String} uri
 * @return {Object} parsed Spotify uri object
 * @api public
 */
function parse(input) {
    const uri = spotify_uri_1.default.is(input) ? input.uri : input;
    const { protocol, hostname, pathname = '/', query = '' } = url_1.default.parse(uri);
    if (hostname === 'embed.spotify.com') {
        const parsedQs = querystring_1.default.parse(query || '');
        if (typeof parsedQs.uri !== 'string') {
            throw new Error('fo');
        }
        return parse(parsedQs.uri);
    }
    if (protocol === 'spotify:') {
        const parts = uri.split(':');
        return parseParts(uri, parts);
    }
    if (pathname === null) {
        throw new TypeError('No pathname');
    }
    // `http:` or `https:`
    const parts = pathname.split('/');
    return parseParts(uri, parts);
}
exports.default = parse;
function parseParts(uri, parts) {
    const len = parts.length;
    if (parts[1] === 'embed') {
        parts = parts.slice(1);
    }
    if (parts[1] === 'search') {
        return new search_1.default(uri, util_1.decode(parts.slice(2).join(':')));
    }
    if (len >= 3 && parts[1] === 'local') {
        return new local_1.default(uri, util_1.decode(parts[2]), util_1.decode(parts[3]), util_1.decode(parts[4]), +parts[5]);
    }
    if (len === 3 && parts[1] === 'playlist') {
        return new playlist_1.default(uri, util_1.decode(parts[2]));
    }
    if (len === 3 && parts[1] === 'user') {
        return new user_1.default(uri, util_1.decode(parts[2]));
    }
    if (len >= 5) {
        return new playlist_1.default(uri, util_1.decode(parts[4]), util_1.decode(parts[2]));
    }
    if (len >= 4 && parts[3] === 'starred') {
        return new playlist_1.default(uri, 'starred', util_1.decode(parts[2]));
    }
    if (parts[1] === 'artist') {
        return new artist_1.default(uri, parts[2]);
    }
    if (parts[1] === 'album') {
        return new album_1.default(uri, parts[2]);
    }
    if (parts[1] === 'track') {
        return new track_1.default(uri, parts[2]);
    }
    if (parts[1] === 'episode') {
        return new episode_1.default(uri, parts[2]);
    }
    throw new TypeError(`Could not determine type for: ${uri}`);
}
//# sourceMappingURL=parse.js.map