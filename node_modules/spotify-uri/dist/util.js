"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
/**
 * URL-decode, also replaces `+` (plus) chars with ` ` (space).
 *
 * @param {String} str
 * @api private
 */
function decode(str) {
    return decodeURIComponent(str).replace(/\+/g, ' ');
}
exports.decode = decode;
/**
 * URL-encode, also turn ` ` (space) chars into `+` (plus).
 *
 * @param {String} str
 * @api private
 */
function encode(str) {
    return escape(str.replace(/ /g, '+'));
}
exports.encode = encode;
//# sourceMappingURL=util.js.map