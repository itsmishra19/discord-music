import SpotifyUri from './spotify-uri';
export default class Search extends SpotifyUri {
    type: string;
    query: string;
    constructor(uri: string, query: string);
    static is(v: any): v is Search;
    toURI(): string;
    toURL(): string;
}
