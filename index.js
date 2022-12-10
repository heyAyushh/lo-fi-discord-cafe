// ./index

const client = require('./client');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  demuxProbe,
  generateDependencyReport
} = require('@discordjs/voice');
const { createReadStream } = require('node:fs');

client.on('ready', async () => {
  console.log(`Bot client Logged in as ${client.user.tag}!`);
  lofiCafe()
});

console.log(generateDependencyReport())

const lofiCafe = async (oldMember, newMember) => {
  try {
    const guild_id = process.env.DISCORD_GUILD_ID;
    const guild = await client.guilds.fetch(guild_id);

    const voiceChannel = await guild.channels.cache.find(chnl => chnl.name.includes('GDP:'));

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    const player = createAudioPlayer({
      // debug: true
    });

    player.play(
      createAudioResource(
        createReadStream('./gdp.mp3')),
      // { inlineVolume: true }
    );

    // console.log(player.state)

    player.on('error', error => {
      // console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
      // player.play(resource);
      console.log(error)
    });

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('stopped')
      player.play(
        createAudioResource(
          createReadStream('./gdp.mp3')
        )
      )
    });

    const subscription = connection.subscribe(player);

    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => subscription.unsubscribe(), 5_000_000);
    }

  } catch (err) {
    console.error(err);
  }
};

process.on('unhandledRejection', (err) => console.log(err));