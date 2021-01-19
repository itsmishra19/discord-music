import SpotifyUri from './spotify-uri';
export default class Episode extends SpotifyUri {
    type: string;
    id: string;
    constructor(uri: string, id: string);
    static is(v: any): v is Episode;
    toURI(): string;
    toURL(): string;
}
