module.exports = {
	name: 'ping',
    description: 'Ping!',
    cooldown: 5,
	execute(message, args, client) {
		message.channel.send('!pong').catch((error) => {
            console.log(error);
        });
        message.channel.send(`Websocket heartbeat: ${client.ws.ping}ms.`);
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
        });
	},
};
