"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const spotify_uri_1 = __importDefault(require("./spotify-uri"));
class User extends spotify_uri_1.default {
    constructor(uri, user) {
        super(uri);
        this.type = 'user';
        this.user = user;
    }
    static is(v) {
        return Boolean(v && v.type === 'user');
    }
    toURI() {
        return `spotify:${this.type}:${util_1.encode(this.user)}`;
    }
    toURL() {
        return `/${this.type}/${util_1.encode(this.user)}`;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map