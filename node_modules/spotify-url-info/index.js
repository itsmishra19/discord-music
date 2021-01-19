const spotifyURI = require("spotify-uri");
const { fetch } = require("cross-fetch");
const { parse } = require("himalaya");

const SUPPORTED_TYPES = [
  "album",
  "artist",
  "episode",
  "playlist",
  "track"
];

function getData(url) {
  let parsedURL = {};

  try {
    parsedURL = spotifyURI.parse(url);
  } catch (error) {
    return Promise.reject(new Error(`Couldn't parse ${url} as valid URL`));
  }

  if (!parsedURL.type) {
    return Promise.reject(new Error(`Failed to parse ${url} as Spotify URL`));
  }

  const embedURL = spotifyURI.formatEmbedURL(parsedURL);

  return fetch(embedURL)
    .then(res => res.text())
    .then(parse)
    .then(embed =>
      JSON.parse(
        embed
          .filter(e => e.tagName === "html")[0]
          .children.filter(e => e.tagName === "body")[0]
          .children.filter(
            e =>
              e.tagName === "script" &&
              e.attributes.findIndex(a => a.value === "resource") !== -1
          )[0].children[0].content
      )
    )
    .then(sanityCheck);
}

function parseIntoPreview(data) {
  const track = getFirstTrack(data);
  const images = data.type === "track" ? data.album.images : data.images;
  const date = data.album ? data.album.release_date : data.release_date

  return Promise.resolve({
    date,
    title: data.name,
    type: data.type,
    track: track.name,
    description: data.description || undefined,
    artist: track.artists.map(a => a.name).join(" & "),
    image: images.reduce((a, b) => (a.width > b.width ? a : b)).url,
    audio: track.preview_url,
    link: data.external_urls.spotify,
    embed: `https://embed.spotify.com/?uri=${data.uri}`
  });
}

function getFirstTrack(data) {
  switch (data.type) {
    case "track":
      return data;
    case "playlist":
      return data.tracks.items[0].track;
    case "album":
      return data.tracks.items[0];
    case "artist":
      return data.tracks[0];
    case "episode":
      return {
        artists: data.show.publisher.split(' and ').map(name => ({ name })),
        name: data.show.name,
        preview_url: data.audio_preview_url
      };
    default:
      return data;
  }
}

function sanityCheck(data) {
  if (!data || !data.type || !data.name) {
    return Promise.reject(
      new Error("Data doesn't seem to be of the right shape to parse")
    );
  }

  if (!SUPPORTED_TYPES.includes(data.type)) {
    return Promise.reject(
      new Error(
        `Not an ${SUPPORTED_TYPES.join(', ')}. Only these types can be parsed`
      )
    );
  }
  return Promise.resolve(data);
}

module.exports.getData = getData;

module.exports.getPreview = url => getData(url).then(parseIntoPreview);
