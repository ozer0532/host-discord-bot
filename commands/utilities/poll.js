const Discord = require('discord.js');

const defaultReactions = [
    '0️⃣','1️⃣','2️⃣','3️⃣','4️⃣',
    '5️⃣','6️⃣','7️⃣','8️⃣','9️⃣',
    '🔟','🔴','🟠','🟡','🟢',
    '🔵','🟣','🟤','⚫','⚪',
]

// https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
const emojiRegex = /^[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu

module.exports = {
	name: 'poll',
    description: 'Create a poll from the given options.',
    // shortDescription: 'Short Description',
    // args: true,
	// aliases: ['alias'],
    usage: '<pollquestion...> | {polloptions}',
    // uses: [
    //     "",
    // ].join('\n'),
    arguments: [
        "`<pollquestion...> : string` - The poll question to be asked. (You can also use a line break to split the question with the options).",
        "`{polloptions} : <polloption...> ['|' {polloptions}]` - A list of `<polloption...>`s seperated by a '|' character or a line break.",
        "`<polloption...> : PollOption` - A one-line string representing an option for the poll.",
    ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {
        let text = args.join(' ');

        // Get options and remove empty strings
        let options = text.split(/[\n|]/);
        options.filter(option => /^\s$/.test(option));  // Remove whitespaces only text
        
        // Get question
        let question = options.shift();
        
        if (options.length < 2) {
            return message.channel.send("Please enter at least 2 options!");
        }
        
        if (options.length > 20) {
            return message.channel.send(`Cannot make a poll with more than **20** options! (You entered **${options.length}**)`);
        }
        
        let data = {};
        
        // Get emoji - poll question combination.
        for (let i = 0; i < options.length; i++) {
            let emoji = options[i].match(emojiRegex)
            if (emoji) {
                data[emoji] = options[i].replace(emojiRegex);
            } else {
                data[defaultReactions[i]] = options[i];
            }
        }

        let outputText = Object.entries(data).map((entry) => `${entry[0]} - ${entry[1]}`).join('\n');

        let embed = new Discord.MessageEmbed();
        embed = embed.setTitle(`Poll - ${ question }`);
        embed = embed.setDescription(outputText);

        let pollMessage = await message.channel.send(embed);
        let key;
        try {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++ ) {
                key = keys[i];
                await pollMessage.react(key);
            }
        } catch (error) {
            console.error('One of the emojis failed to react.');
            await message.channel.send(`Failed to react with '${key}'. Reason: ${error}`);
            pollMessage.delete();
        }
	},
};