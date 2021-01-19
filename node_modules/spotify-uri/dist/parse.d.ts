import SpotifyUri from './spotify-uri';
import { ParsedSpotifyUri } from '.';
/**
 * Parses a "Spotify URI".
 *
 * @param {String} uri
 * @return {Object} parsed Spotify uri object
 * @api public
 */
export default function parse(input: string | SpotifyUri): ParsedSpotifyUri;
