const genius = require('genius-lyrics-api');
const getConfig = require('../../config.js');

module.exports = {
	name: 'lyrics',
    description: 'Look for lyrics on a song',
    // shortDescription: 'Short Description',
    // args: true,
	aliases: ['l'],
    usage: '[<searchterm...>]',
    uses: [
        "\`${prefix}lyrics\` - Look for lyrics on the current song.",
        "\`${prefix}lyrics <searchterm>\` - Look for lyrics on a certain song."
    ].join('\n'),
    arguments: [
        "\`<searchterm...> : string\` - The search term for the song.",
    ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {

        // Get lyrics from arguments
        if (args[0]) {
            searchSong(message, args.join(' '));
            return;
        }

        const serverQueue = client.database.queue.get(message.guild.id);
        
        if (!serverQueue)
            return message.channel.send("The queue is empty!");

        searchSong(message, serverQueue.songs[0].title);
	},
};

function searchSong(message, query) {
    let options = {
        apiKey: getConfig('geniuskey'),
        title: query,
        artist: "",
        optimizeQuery: true,
    }
    let search;

    genius.searchSong(options)
    .then((searchResult) => {
        search = searchResult
        if (searchResult) {
            genius.getLyrics(searchResult[0].url)
            .then((lyrics) => {
                let text = `**[${search[0].title}]**\n${lyrics}`
                return message.channel.send(text, { split: true });
            });
        } else {
            return message.channel.send(`Could not find lyrics for: **${options.title}**`);
        }
    })
    .catch((err) => {
        console.log(err);
        return message.channel.send(`Error: **${err}**`);
    });
}