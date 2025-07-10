// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildPresences
	] 
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.PresenceUpdate, (_oldPresence, newPresence) => {
	console.log(newPresence);
})

export default client;

// // Log in to Discord with your client's token
// client.login(DISCORD_TOKEN);