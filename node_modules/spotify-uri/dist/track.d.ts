import SpotifyUri from './spotify-uri';
export default class Track extends SpotifyUri {
    type: string;
    id: string;
    constructor(uri: string, id: string);
    static is(v: any): v is Track;
    toURI(): string;
    toURL(): string;
}
