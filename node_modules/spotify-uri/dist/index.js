"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const parse_1 = __importDefault(require("./parse"));
const search_1 = __importDefault(require("./search"));
const local_1 = __importDefault(require("./local"));
const playlist_1 = __importDefault(require("./playlist"));
const artist_1 = __importDefault(require("./artist"));
const album_1 = __importDefault(require("./album"));
const track_1 = __importDefault(require("./track"));
const user_1 = __importDefault(require("./user"));
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
function parseSpotifyUri(uri) {
    return parse_1.default(uri);
}
(function (parseSpotifyUri) {
    parseSpotifyUri.SpotifyUri = spotify_uri_1.default;
    parseSpotifyUri.Local = local_1.default;
    parseSpotifyUri.Search = search_1.default;
    parseSpotifyUri.Playlist = playlist_1.default;
    parseSpotifyUri.Artist = artist_1.default;
    parseSpotifyUri.Album = album_1.default;
    parseSpotifyUri.Track = track_1.default;
    parseSpotifyUri.User = user_1.default;
    parseSpotifyUri.parse = parse_1.default;
    function formatURI(input) {
        const uri = typeof input === 'string' ? parseSpotifyUri.parse(input) : input;
        return uri.toURI();
    }
    parseSpotifyUri.formatURI = formatURI;
    function formatEmbedURL(input) {
        const uri = typeof input === 'string' ? parseSpotifyUri.parse(input) : input;
        return uri.toEmbedURL();
    }
    parseSpotifyUri.formatEmbedURL = formatEmbedURL;
    function formatOpenURL(input) {
        const uri = typeof input === 'string' ? parseSpotifyUri.parse(input) : input;
        return uri.toOpenURL();
    }
    parseSpotifyUri.formatOpenURL = formatOpenURL;
    function formatPlayURL(input) {
        const uri = typeof input === 'string' ? parseSpotifyUri.parse(input) : input;
        return uri.toPlayURL();
    }
    parseSpotifyUri.formatPlayURL = formatPlayURL;
})(parseSpotifyUri || (parseSpotifyUri = {}));
module.exports = parseSpotifyUri;
//# sourceMappingURL=index.js.map