const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice')

module.exports = {
  name: 'talk',
  description: 'talk',
  execute (message, args, client, func, kv) {
    if (typeof message.member.voice.channel === typeof null) {
      console.log('not in vc')
      return message.reply('You need to be in vc for this')
    }
    function start (callback) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.member.voice.channel.guild.id,
        adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator
      })
      if (callback) {
        play()
      }
    }
    function stop () {
      const connection = getVoiceConnection(message.member.guild.id)
      connection.destroy()
    }

    function createResource () {
      client.commands.get('tts').execute(message)
    }
    function play () {
      console.log('hi')
      const connection = getVoiceConnection(message.member.guild.id)
      if (typeof connection === 'undefined') {
        console.log('gotchu')
        start('true')
      } else {
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
          }
        })
        let resource
        setTimeout(() => {
          console.log('hiya')
          resource = createAudioResource('output_0.mp3')
          player.play(resource)
          connection.subscribe(player)
        }, 1000)
      }
    }

    async function qna () {
      const result = await client.commands.get('chat').execute(message, kv, 1, 'true', client)
    }
    switch (func) {
      case 'start':
        start()
        break
      case 'stop':
        stop()
        break
      case 'play':
        createResource()
        play()
        break
      case 'qna':
        qna()
        break
      case 'speak':
        play()
        break
      default:
        start()
    }

    /* const voiceChannel = message.member.voice.channel
    voiceChannel.join().then(connection => {
      const dispatcher = connection.play('./output_0.mp3')
      dispatcher.on('end', end => { voiceChannel.leave() })
    }).catch(err => console.log(err)) */
  }
}
