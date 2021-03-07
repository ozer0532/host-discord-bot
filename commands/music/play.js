const ytdl = require('ytdl-core');
const getConfig = require('../../config.js');
const search = require('youtube-search');

// https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
	name: 'play',
    description: 'Play a song.',
    args: true,
	aliases: ['p'],
    usage: '(<url>|<searchterm...>)',
    uses: [
        "`${prefix}play <url>` - Play music from the given URL.",
        "`${prefix}play <searchterm>` - Do a search for a music track.",
    ].join("\n"),
    arguments: [
        "`<url> : string` - The Youtube URL to play music from.",
        "`<searchterm...> : string` - The search term for the song.",
    ].join("\n"),
    // userPermissions: [],
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        // Get voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
            "You need to be in a voice channel to play music!"
            );

        // Check if the argument is a number - then it is a queue selection
        if (!isNaN(args.join(' ')) && args[0] >= 1 && args[0] <= 5) {
            playPickedSong(args[0], message, client);
            return;
        }

        let url = args[0];

        // Check if args is valid URL
        if (!ytdl.validateURL(url)) {
            searchSong(args.join(' '), message, client);
            return;
        }

        execute(url, message, client);
	},
};

async function execute(url, message, client) {
    // get the queue for the server
    const serverQueue = client.database.queue.get(message.guild.id);
    // Get voice channel
    const voiceChannel = message.member.voice.channel;

    // Grab song info from youtube
    const songInfo = await ytdl.getInfo(url);
    let duration = new Date(songInfo.videoDetails.lengthSeconds * 1000)
                .toISOString()
    if ((songInfo.videoDetails.lengthSeconds >= 3600)) duration = duration.substr(11, 8);
    else duration = duration.substr(14, 5);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: duration,
        channel: songInfo.videoDetails.ownerChannelName,
    };

    // Check if the server currently has a queue running
    if (!serverQueue) {
        const queueContract = {
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        // Add the queue to the queues list
        client.database.queue.set(message.guild.id, queueContract);

        // Push the new song
        queueContract.songs.push(song);
        try {
            // Join the vc
            var connection = await voiceChannel.join();
            // Set the connection
            queueContract.connection = connection;
            // Play the music
            play(message.guild, queueContract.songs[0], client);
            message.channel.send(`Playing **${song.title}**`);
        } catch (err) {
            console.log(err);
            // Remove from the vc
            client.database.queue.delete(message.guild.id);
            // Send error
            return message.channel.send(err).catch((error) => {
                console.log(error);
            });
        }
    } else {
        // Push the new song
        serverQueue.songs.push(song);

        // return message
        return message.channel.send(`**${song.title}** has been added to the queue!`);
    }
}

function play(guild, song, client) {
    const serverQueue = client.database.queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        client.database.queue.delete(guild.id);
        return;
    }
    
    // Check if connection is available
    if (serverQueue.connection && serverQueue.connection.status == 4) {
        client.database.queue.delete(guild.id);
        return;
    }
    
    const dispatcher = serverQueue.connection
    .play(ytdl(song.url, {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
            headers: {
              cookie: getConfig("cookie"),
        }},
    }))
    .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], client);
    })
    .on("error", error => { 
        console.error(error);
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], client);
        message.channel.send(`There was an error trying to play **${song.title}**, skipping the track.`);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

async function searchSong(term, message, client) {
    var opts = {
        maxResults: 5,
        key: getConfig("youtubekey"),
        type: "video"
    };

    let searchResult = await message.channel.send('Fetching search results..');

    await search(term, opts, function(err, results) {
        if(err) return console.log(err);
        
        if (results.length == 0) {
            return searchResult.edit("Cannot find the song you're looking for.");
        }

        // console.dir(results);
        Promise.all(results.map(async (value, index) => { 
            let songInfo = await ytdl.getInfo(value.link);
            let duration = new Date(songInfo.videoDetails.lengthSeconds * 1000)
                .toISOString()
            if ((songInfo.videoDetails.lengthSeconds >= 3600)) duration = duration.substr(11, 8);
            else duration = duration.substr(14, 5);
            return `**${index+1}:** ${value.title} **[${duration}]** by **${value.channelTitle}**`;
        })).then((value) => {
            client.database.musicSearchResult.destroy({ where: { userId: message.member.id } });
            client.database.musicSearchResult.create({
                userId: message.member.id,
                guildId: message.guild.id,
                channelId: message.channel.id,
                messageId: searchResult.id,
                results: results.map((value) => value.link).join(' '),
            }).then(() => {
                searchResult.edit(value.join('\n'));
            });
        }).catch((err) => {
            searchResult.edit(`Failed to fetch message. Reason: \`${err}\``);
        })
    });
}

async function playPickedSong(pick, message, client) {
    let searchResult = await client.database.musicSearchResult.findOne({ where: { userId: message.member.id } });

    if (!searchResult) {
        return message.channel.send("Run a search for a song first!")
    }
    
    // Edit previous message
    let guild = client.guilds.resolve(searchResult.guildId);
    if (!guild.available) return;
    let channel = guild.channels.resolve(searchResult.channelId);
    let prevMessage = channel.messages.resolve(searchResult.messageId)
    prevMessage.delete();
    
    // Get selection
    let url = searchResult.results.split(' ')[pick - 1]
    execute(url, message, client);

    // Remove search results from database
    client.database.musicSearchResult.destroy({ where: { userId: message.member.id } });
}