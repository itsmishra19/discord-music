import SpotifyUri from './spotify-uri';
export default class User extends SpotifyUri {
    type: string;
    user: string;
    constructor(uri: string, user: string);
    static is(v: any): v is User;
    toURI(): string;
    toURL(): string;
}
