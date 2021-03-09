const Discord = require('discord.js');
const fetch = require("node-fetch");

class HTTPResponseError extends Error {
	constructor(response, ...args) {
		this.response = response;
		super(`HTTP Error Response: ${res.status} ${res.statusText}`, ...args);
	}
}

module.exports = {
	name: 'changelog',
    description: 'Shows the bot change log.',
    // shortDescription: 'Short Description',
    // args: true,
	// aliases: ['alias'],
    usage: '[<version>]',
    uses: [
        "`${prefix}changelog` - Shows the tl;dr's of the latest changelogs.",
        "`${prefix}changelog <version>` - Shows a more detailed changelog on a specific version.",
    ].join('\n'),
    arguments: [
        "`<version> : string` - The label of the version.",
    ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    // guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {
        fetch('https://raw.githubusercontent.com/ozer0532/host-discord-bot/master/CHANGELOG.md')
        .then(res => {
            if (res.ok) {
                return res.text();
            } else {
                throw new HTTPResponseError(res);
            }
        })
        .then(res => {
            console.log(args[0]);
            if (args[0]) {
                // Get specific tag
                try {
                    let data = getTag(args[0], res);
                    data += ('\n\nSee the full changelog at https://github.com/ozer0532/host-discord-bot/blob/master/CHANGELOG.md');
    
                    let embed = new Discord.MessageEmbed();
                    embed = embed.setTitle('Changelog - ' + args[0]);
                    embed = embed.setDescription(data);
            
                    return message.channel.send(embed);

                } catch {
                    return message.channel.send(`There is no version with tag ${args[0]}!`);
                }
                
            } else {
                // Get tldr
                let data = getTLDR(res);
                data.push('See the full changelog at https://github.com/ozer0532/host-discord-bot/blob/master/CHANGELOG.md');
                
                let embed = new Discord.MessageEmbed();
                embed = embed.setTitle('Changelog');
                embed = embed.setDescription(data.join('\n\n'));
    
                return message.channel.send(embed);
            }
        })
        .catch(err => {
            console.log("Error: " + err);
        })
	},
};

function getTLDR(text) {
    let tags = [...text.matchAll(/(?<=## )\[.+/g)];
    let desc = [...text.matchAll(/(?<=### TL;DR\n\n).+(\n.+)*/g)];
    let tldr = [];

    for (let i = 0; i < tags.length; i++) {
        tldr.push(`**${tags[i]}**\n${desc[i][0]}`);
    }
    tldr.splice(5);
    return tldr;
}

function getTag(tag, text) {
    let tagRegex = tag.replace(/\./g, '\\.')

    let regex = new RegExp('(?<=## \\[' + tagRegex + '\\].*\n\n+)(.|\\s)+?(?=\n\n((## )|\\[(\\d|\\.|\\w|\\-|\\+)+\\]: ))');
    let desc = text.match(regex);

    // Replace ### with bold    
    desc = desc[0].replace(/### (.+)\n\n/g, '**$1**\n');

    // Replace 1st indent with -->
    desc = desc.replace(/\n\s+-/g, '\n-->');
    
    return desc;
}