# discord-ytdl-core
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

# Installing

```sh
$ npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

# Opus [optional]
> Please install opus engine if you want to encode the stream to opus format.

## **Supported Opus Engines**
- **[@discordjs/opus](https://npmjs.com/package/@discordjs/opus)**
- **[node-opus](https://npmjs.com/package/node-opus)**
- **[opusscript](https://npmjs.com/package/opusscript)**

# API
## YTDL(youtubeURL, options)
Similar to ytdl-core but this method allows you to pass custom FFmpeg args in options.

```js
ytdl("https://www.youtube.com/watch?v=QnL5P0tFkwM", {
    filter: "audioonly",
    fmt: "mp3",
    encoderArgs: ['-af', 'bass=g=10']
}).pipe(fs.createWritestream("bass_boosted.mp3"));

```

## YTDL.arbitraryStream(source, options)
This method allows you to play the stream from other sources rather than just `youtube`. Stream source must be a string or stream object (internal.Readable | internal.Duplex).
Through URL: **[https://listen.moe/kpop/opus](https://listen.moe/kpop/opus)**

Using fs:

```js
let stream = fs.createReadStream("./music.mp4");
ytdl.arbitraryStream(stream, {
    fmt: "mp3",
    encoderArgs: ["bass=g=5"]
}).pipe(fs.createWriteStream("./music.mp3"))

```

# Options
This package provides 4 extra options excluding ytdl-core options.
- `seek`: This option takes the time in seconds. 
If this option is provided, it will return the stream from that frame.
Seek option is provided here because discord.js seek doesn't work for `ogg/opus` & `webm/opus` stream.
This option is ignored when the supplied parameter type isn't a number.

- `encoderArgs`: This option takes the Array of FFmpeg arguments.
Invalid args will throw error and crash the process.
This option is ignored when the supplied parameter type isn't array. Invalid FFmpeg args might crash the process.

- `opusEncoded`: This option takes a Boolean value. If true, it returns `opus encoded` stream.
  If `fmt` option isn't provided, it returns `converted` stream type of discord.js. Other values returns `unknown` stream if `opusEncoded` is false.

- `fmt`: Forcefully changes the stream format. Don't use this option for default value. Even though this option changes the format, 
  it returns `opus` stream if `opusEncoded` is set to `true`. 

- Other options are the options for **[ytdl-core](https://npmjs.com/package/ytdl-core)**.

# Example
## Playing Opus Encoded Stream

```js
const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "!play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl("https://www.youtube.com/watch?v=QnL5P0tFkwM", {
            filter: "audioonly",
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(stream, {
                type: "opus"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
```

## Unknown Stream

```js
const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "!play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl("https://www.youtube.com/watch?v=QnL5P0tFkwM", {
            filter: "audioonly",
            opusEncoded: false,
            fmt: "mp3",
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(stream, {
                type: "unknown"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
```

## Converted Stream

```js
const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "!play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl("https://www.youtube.com/watch?v=QnL5P0tFkwM", {
            filter: "audioonly",
            opusEncoded: false,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(stream, {
                type: "converted"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
```

# Downloading the video

```js
const ytdl = require("discord-ytdl-core");
const { createWriteStream } = require ("fs");

const url = "https://www.youtube.com/watch?v=QnL5P0tFkwM";

let stream = ytdl(url, {
    encoderArgs: ["-af", "asetrate=44100*1.25,bass=g=20,dynaudnorm=f=150"],
    fmt: "mp3",
    opusEncoded: false
});

stream.pipe(createWriteStream(__dirname+"/test.mp3"));

```

# Arbitrary Stream

```js
const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "!play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl.arbitraryStream("https://listen.moe/kpop/opus", {
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(stream, {
                type: "opus"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
```

# Other functions
Check out **[ytdl-core](https://npmjs.com/package/ytdl-core)** for other functions.

# Related
- **[ytdl-core-discord](https://npmjs.com/package/ytdl-core-discord)**
- **[discord-player](https://npmjs.com/discord-player)**

# Join our Official Discord Server
- **[Snowflake Studio ❄️](https://discord.gg/uqB8kxh)**

