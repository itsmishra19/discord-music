import SpotifyUri from './spotify-uri';
export default class Artist extends SpotifyUri {
    type: string;
    id: string;
    constructor(uri: string, id: string);
    static is(v: any): v is Artist;
    toURI(): string;
    toURL(): string;
}
