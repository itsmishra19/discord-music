export default abstract class SpotifyUri {
    uri: string;
    abstract toURL(): string;
    abstract toURI(): string;
    constructor(uri: string);
    static is(v: any): v is SpotifyUri;
    toEmbedURL(): string;
    toOpenURL(): string;
    toPlayURL(): string;
}
