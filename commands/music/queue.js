// https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
	name: 'queue',
    description: 'Display songs in the queue.',
    args: false,
	aliases: ['list', 'q', 'ls'],
    usage: '[<page>|all]',
    uses: [
        "`${prefix}queue` - Display the first 10 tracks in the queue.",
        "`${prefix}queue <page>` - Display a page in the queue.",
        "`${prefix}queue all` - Display all tracks in the queue.",
    ].join("\n"),
    arguments: [
        "`<page> : integer` - The page number in the queue list, containing 10 tracks.",
    ].join("\n"),
    // userPermissions: [],
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!serverQueue)
            return message.channel.send("There is no song currently playing!");
        
        let page = 0;
        let count = 10;
        let text = `**Track list:**\nShowing page **1** of **${Math.ceil(serverQueue.songs.length / 10)}**\n`;
        // argument is page
        if (args[0] == 'all') {
            count = serverQueue.songs.length;
            text = `**Track list:**\n`
        }

        if (!isNaN(parseInt(args[0]))) {
            page = parseInt(args[0]) - 1;
            text = `**Track list:**\nShowing page **${page}** of **${Math.ceil(serverQueue.songs.length / 10)}**\n`;
        }

        return message.channel.send(text + getSongsList(serverQueue, page * 10, count));
	},
};

function getSongsList(serverQueue, startIndex, count) {
    let list = "";
    for (let i = startIndex; i < startIndex + count; i++) {
        if (i >= serverQueue.songs.length) break;

        list += `**${i + 1}:** ${serverQueue.songs[i].title} `;
        list += `**[${serverQueue.songs[i].duration}]** `;
        list += `by **${serverQueue.songs[i].channel}**\n`
    }

    return list;
}