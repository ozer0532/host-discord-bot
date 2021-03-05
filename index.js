const fs = require('fs');
const getConfig = require('./config.js');
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Get all commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
        command.folder = folder;
		client.commands.set(command.name, command);
	}
}

const cooldowns = new Discord.Collection();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite'
});

const MusicSearchResult = sequelize.define('music_search_result', {
    userId: {
        type: Sequelize.STRING,
        unique: true,
    },
    guildId: Sequelize.STRING,
    channelId: Sequelize.STRING,
    messageId: Sequelize.STRING,
    results: Sequelize.STRING,
});

const Tags = sequelize.define('tags', {
    name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
});

client.database = {
    tags: Tags,
    queue: new Discord.Collection(),
    musicSearchResult: MusicSearchResult,
}

client.once('ready', () => {
    Tags.sync({ force: true });
    MusicSearchResult.sync({ force: true });
	console.log('Ready!');
});

client.login(getConfig("token"));

client.on('message', async message => {
    // Ignores message if it doesn't start with a prefix or is sent by a bot
    if (!message.content.startsWith(getConfig("prefix")) || message.author.bot) return;

    // Get arguments and command
    const args = message.content.slice(getConfig("prefix").length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Ignores message if it is not a valid command
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
    
    // Ignores command if it is for guilds only
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // Check if the bot has permission to do the action
    if (command.botPermissions) {
        const botPerms = message.channel.permissionsFor(message.guild.me.user);
     	if (!botPerms || !botPerms.has(command.botPermissions)) {
     		return message.reply('I do not have the permission to do this!');
     	}
    }

    // Check if the user has permission to do the action
    if (command.userPermissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
     	if (!authorPerms || !authorPerms.has(command.userPermissions)) {
     		return message.reply('You do not have the permissions to do this!');
     	}
    }
    
    // Check if arguments are applicable
    if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${getConfig("prefix")}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply).catch((error) => {
            console.log(error);
        });
    }
    
    // Set cooldown if cooldown is enabled for a command
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    // Check cooldown timer
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        let result = command.execute(message, args, client);

        // Case for execution result is a promise
        if (result !== undefined && result.catch !== undefined) {
            result.catch((error) => {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            })
        }
    } catch (error) {
        // Case for execution result is NOT a promise
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
    return;
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Check if our state changed
    if (newState.member.id == newState.guild.me.id) {
        if (newState.connection == null) {
            resetVoiceChannelData(newState.guild.id);
        }
    }
})

const resetVoiceChannelData = function(guildID) {
    let serverQueue = client.database.queue.get(guildID);

    if (!serverQueue) return;

    if (serverQueue.connection && serverQueue.connection.dispatcher) {
        serverQueue.connection.dispatcher.end();
    }
    serverQueue.voiceChannel.leave();

    client.database.queue.delete(guildID);
}

// Catch errors to prevent the bot from exitting
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});