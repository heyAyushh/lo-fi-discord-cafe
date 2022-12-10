// ./client

const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates
  ]
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;