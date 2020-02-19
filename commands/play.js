const Discord = require("discord.js")
const fs = require("fs")
const emotes = require ("../config/emojis.json")

module.exports.run = async (client, message, args) => {

    if (!args[0]) return message.channel.send(`**Please enter a music ${emotes.error}**`)

let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);

if(aSongIsAlreadyPlaying){
    // Add the song to the queue
    let song = await client.player.addToQueue(message.guild.id, args.join(" "));
    message.channel.send(`**${song.name} added to queue **`);
} else {
    // Else, play the song
    let song = await client.player.play(message.member.voice.channel, args.join(" "));
    message.channel.send(`**Currently playing ${song.name} ${emotes.music}**`);
    song.queue.on('end', () => {
        message.channel.send('**The queue is empty, please add some songs!**');
    });

    song.queue.on('songChanged', (oldSong, newSong, skipped, repeatMode) => {
        if(repeatMode){
            message.channel.send(`**Repeating, ${newSong}**`);
        } else {
            message.channel.send(`Now playing ${newSong}...`);
        }
    });
}
}
  
module.exports.config = {
  name: "play",
  aliases: ['p']
}