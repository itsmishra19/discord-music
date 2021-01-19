import SpotifyUri from './spotify-uri';
export default class Local extends SpotifyUri {
    type: string;
    artist: string;
    album: string;
    track: string;
    seconds: number;
    constructor(uri: string, artist: string, album: string, track: string, seconds: number);
    static is(v: any): v is Local;
    toURI(): string;
    toURL(): string;
}
