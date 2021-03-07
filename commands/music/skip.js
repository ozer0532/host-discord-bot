// https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
	name: 'skip',
    description: 'Skips a song in queue.',
    args: false,
	aliases: ['s', 'remove', 'rm'],
    usage: '[<index>|<range>]',
    uses: [
        "`${prefix}skip` - Skip the current track.",
        "`${prefix}skip <index>` - Skip a track in the queue.",
        "`${prefix}skip <range>` - Skip a range of tracks in the queue.",
    ].join('\n'),
    arguments: [
        "`<index> : integer` - The index/order of a song in the queue.",
        "`<range> : range` - The range (in the format `m-n`)  of songs in the queue.",
    ].join('\n'),
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");

        // If there is no argument
        if (args[0] === undefined) {
            serverQueue.connection.dispatcher.end();
            return;
        }

        // Argument is a range
        let range = args[0].split("-");
        if (range.length == 2 && !isNaN(parseInt(range[0])) && !isNaN(parseInt(range[1]))) {
            startIndex = parseInt(range[0]); endIndex = parseInt(range[1]);
            if (startIndex > endIndex) {
                return message.channel.send(`The start index must not be larger than the end index!`);
            }
            if (startIndex <= 0 || endIndex > serverQueue.songs.length) {
                return message.channel.send(`The range must be between 1 and ${serverQueue.songs.length}!`);
            }

            let skipCurrent = startIndex == 1;
            if (skipCurrent) startIndex = 2;
    
            let count = endIndex - startIndex + 1;
            serverQueue.songs.splice(startIndex - 1, count);
            
            if (skipCurrent) {
                serverQueue.connection.dispatcher.end();
                return message.channel.send(`Skipped **${count + 1}** tracks.`);
            }

            return message.channel.send(`Skipped **${count}** tracks.`);
        }
        
        // Argument is an index
        if (!isNaN(parseInt(args[0]))) {
            let index = parseInt(args[0]);
            let deleted;
            if (index == 1) {
                deleted = serverQueue.songs[0];
                serverQueue.connection.dispatcher.end();
            } else {
                if (serverQueue.songs.length < index || index <= 0) 
                    return message.channel.send(`There is no song number ${index} in the queue!`);
                deleted = serverQueue.songs.splice(index - 1, 1)[0];
            }
            return message.channel.send(`Skipped **${deleted.title}**`);
        }
	},
};
