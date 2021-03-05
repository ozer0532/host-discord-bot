// https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
	name: 'move',
    description: 'Moves a song in the queue to a specific order.',
    args: false,
	aliases: ['m', 'reorder'],
    usage: '<index> <newindex>',
    // uses: [
    //     "`${prefix}move <index> <newindex> ` - Moves a song in the queue to a specific order.",
    // ].join("\n"),
    arguments: [
        "`<index> : integer` - The index/order of a song in the queue.",
        "`<newindex> : integer` - The destination index/order in the queue.",
    ].join("\n"),
    // userPermissions: [],
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to reorder the queue!"
            );
        if (!serverQueue)
            return message.channel.send("There is no song currently playing!");
        
        let startIndex = args[0] - 1;
        let count = 1;
        let destIndex = args[1] - 1;

        let removedSongs = serverQueue.songs.splice(startIndex, count);
        serverQueue.songs.splice(destIndex, 0, ...removedSongs);

        if (count == 1) {
            return message.channel.send(`Moved **${removedSongs[0].title}**.`);
        } else {
            return message.channel.send(`Moved **${count}** tracks.`);
        }
	},
};