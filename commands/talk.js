const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior, generateDependencyReport } = require('@discordjs/voice')

module.exports = {
  name: 'talk',
  description: 'talk',
  execute (message, client, func, kv) {
    // if user is not in voice chat, return
    if (message.member.voice.channel === null) {
      console.log('not in vc')
      return message.reply('You need to be in vc for this')
    }
    const resourceId = message.member.voice.channel.id
    // creates VoiceConnection (joins vc), and if there is callback, will play()
    function start (callback, resource) {
      joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.member.voice.channel.guild.id,
        adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator
      })
      if (callback) {
        console.log('callback finished, playing resource')
        play(resource)
      }
    }
    // kills VoiceConnection (disconnects from vc)
    function stop () {
      const connection = getVoiceConnection(message.member.guild.id)
      if (typeof connection !== 'undefined') {
        connection.destroy()
      }
    return
    }
    // creates mp3 file speaking message content
    function createResource () {
      client.commands.get('tts').execute(message, undefined, undefined, undefined, undefined, resourceId)
    }
    // creates AudioPlayer
    function play (resource) {
      const connection = getVoiceConnection(message.member.guild.id)
      // if no VoiceConnection, make one and run callback
      if (typeof connection === 'undefined') {
        console.log('callback executed')
        start('true', resource)
      } else {
        const player = createAudioPlayer({
        })
        // short timeout, without this, function will send old mp3 before it's overwritten
        setTimeout(() => {
          if (resource === undefined) {
            console.log('ping')
            resource = createAudioResource('voice_clips/undefined_0.mp3')
          }
          player.play(resource)
          connection.subscribe(player)
        }, 1000)
      }
    }

    function speak () {
      const resource = createAudioResource('voice_clips/' + resourceId + '_0.mp3')
      console.log(resource + 'speak() resource')
      play(resource)
    }
    // sends speech reply to text question
    async function voiceReply () {
      if (message.content.split(' ').length <= 1) {
        message.reply('Ask a question or something, pal.')
      } else await client.commands.get('chat').execute(message, kv, 1, 'true', client, resourceId)
    }
    switch (func) {
      // connect to vc
      case 'start':
        start()
        break
      // disconnect from vc
      case 'stop':
        stop()
        break
      // say specific phrase
      case 'say':
        createResource()
        play()
        break
      // ask text question, reply in voice
      case 'voiceReply':
        voiceReply()
        break
      // play audio file
      case 'speak':
        speak()
        break
      default:
        start()
    }
  }
}
