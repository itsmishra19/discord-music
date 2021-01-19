# spotify-url-info

[![npm link](https://img.shields.io/npm/v/spotify-url-info.svg)](https://www.npmjs.com/package/spotify-url-info)
[![Build Status](https://travis-ci.org/karlsander/spotify-url-info.svg?branch=master)](https://travis-ci.org/karlsander/spotify-url-info)

This package can fetch useful metdata for spotify urls without needing a spotify API key. This is accomplished by some very light scraping. My usecase is providing a customized mini player preview.

## Usage

```bash
npm install spotfiy-url-info
```

```javascript
var { getData, getPreview } = require("spotify-url-info");
```

There are two functions: getData provides the full available data, in a shape that is very similar to [what the spotify API returns](https://developer.spotify.com/documentation/web-api/reference/object-model/) and getPreview always returns the same fields for different types of resources (album, artist, playlist, track). The preview track is the first in the Album, Playlist, etc. Both take a spotify URL (play. or open.) as input and return a Promise.

```javascript
await getData("https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas");
```

<details>
<summary>returns a long json response, look at [the web API object model](https://developer.spotify.com/documentation/web-api/reference/object-model/)) </summary>
```json
{
  "album": {
    "album_type": "album",
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu"
        },
        "href": "https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu",
        "id": "5a2w2tgpLwv26BYJf2qYwu",
        "name": "SOPHIE",
        "type": "artist",
        "uri": "spotify:artist:5a2w2tgpLwv26BYJf2qYwu"
      }
    ],
    "external_urls": {
      "spotify": "https://open.spotify.com/album/6ukR0pBrFXIXdQgLWAhK7J"
    },
    "href": "https://api.spotify.com/v1/albums/6ukR0pBrFXIXdQgLWAhK7J",
    "id": "6ukR0pBrFXIXdQgLWAhK7J",
    "images": [
      {
        "height": 640,
        "url":
          "https://i.scdn.co/image/d6f496a6708d22a2f867e5acb84afb0eb0b07bc1",
        "width": 640
      },
      {
        "height": 300,
        "url":
          "https://i.scdn.co/image/838e785a58d2f93791b623a4b1ff4ca8f61bf99c",
        "width": 300
      },
      {
        "height": 64,
        "url":
          "https://i.scdn.co/image/d942cc566126ce31de1c16b12ce49a47c097da43",
        "width": 64
      }
    ],
    "name": "OIL OF EVERY PEARL'S UN-INSIDES",
    "release_date": "2018-06-15",
    "release_date_precision": "day",
    "type": "album",
    "uri": "spotify:album:6ukR0pBrFXIXdQgLWAhK7J"
  },
  "artists": [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu"
      },
      "href": "https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu",
      "id": "5a2w2tgpLwv26BYJf2qYwu",
      "name": "SOPHIE",
      "type": "artist",
      "uri": "spotify:artist:5a2w2tgpLwv26BYJf2qYwu"
    }
  ],
  "disc_number": 1,
  "duration_ms": 232806,
  "explicit": false,
  "external_ids": {
    "isrc": "AUFF01800039"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas"
  },
  "href": "https://api.spotify.com/v1/tracks/5nTtCOCds6I0PHMNtqelas",
  "id": "5nTtCOCds6I0PHMNtqelas",
  "is_local": false,
  "is_playable": true,
  "name": "Immaterial",
  "popularity": 50,
  "preview_url":
    "https://p.scdn.co/mp3-preview/6be8eb12ff18ae09b7a6d38ff1e5327fd128a74e?cid=162b7dc01f3a4a2ca32ed3cec83d1e02",
  "track_number": 8,
  "type": "track",
  "uri": "spotify:track:5nTtCOCds6I0PHMNtqelas",
  "dominantColor": "#87707f"
}
```
</details>

```javascript
await getPreview("https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas");
```

returns

```json
{
  "title": "Immaterial",
  "type": "track",
  "track": "Immaterial",
  "artist": "SOPHIE",
  "image": "https://i.scdn.co/image/d6f496a6708d22a2f867e5acb84afb0eb0b07bc1",
  "audio": "https://p.scdn.co/mp3-preview/6be8eb12ff18ae09b7a6d38ff1e5327fd128a74e?cid=162b7dc01f3a4a2ca32ed3cec83d1e02",
  "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
  "embed": "https://embed.spotify.com/?uri=spotify:track:5nTtCOCds6I0PHMNtqelas",
  "date": "2018-06-15",
  "description": "description of a podcast episode"
}
```

The fields `description` and `date` will be undefined for some types of media that don't have this information.

## Caveats

This uses cheerio to scrape the spotify twitter widget so it is unsanctioned and likely to break. I'll have the tests run on a schedule on travis ci so that I get notified when it will inevitably break. Then I can hopefully fix it. A more stable alternative is scraping the opengraph tags for the links with [open-graph-scraper](https://github.com/jshemas/openGraphScraper). The biggest issues there are no audio previews for artists and the number of requests it can take to get all the needed metadata.

## Changelog

### 1.4.0

- Support for podcast episodes on spotify (contributed by @kikobeats)
- new `description` and `date` fields in the preview object (contributed by @kikobeats)

### 1.3.1

- update dependencies

### 1.3.0

- remove lockfile

### 1.2.0

- now uses Himalaya for html parsing instead of cheerio, its more complex / brittle but the bundle is way smaller so it can be used inside apps

### 1.1.1

- generate embed url for preview with string concatination instead of using spotifyURL package
- bump dependency versions

### 1.1.0

- add embed field to `getPreview` result

### 1.0.0

- first public release
