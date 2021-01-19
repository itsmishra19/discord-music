import SpotifyUri from './spotify-uri';
export default class Playlist extends SpotifyUri {
    type: string;
    id: string;
    user?: string;
    constructor(uri: string, id: string, user?: string);
    static is(v: any): v is Playlist;
    toURI(): string;
    toURL(): string;
}
