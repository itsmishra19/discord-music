/**
 * URL-decode, also replaces `+` (plus) chars with ` ` (space).
 *
 * @param {String} str
 * @api private
 */
export declare function decode(str: string): string;
/**
 * URL-encode, also turn ` ` (space) chars into `+` (plus).
 *
 * @param {String} str
 * @api private
 */
export declare function encode(str: string): string;
