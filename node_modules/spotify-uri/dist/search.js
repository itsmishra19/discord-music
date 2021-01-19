"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
class Search extends spotify_uri_1.default {
    constructor(uri, query) {
        super(uri);
        this.type = 'search';
        this.query = query;
    }
    static is(v) {
        return Boolean(v && v.type === 'search');
    }
    toURI() {
        return `spotify:search:${util_1.encode(this.query)}`;
    }
    toURL() {
        return `/search/${util_1.encode(this.query)}`;
    }
}
exports.default = Search;
//# sourceMappingURL=search.js.map