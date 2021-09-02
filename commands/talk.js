var ffmpeg = require('ffmpeg')
module.exports = {
  name: 'talk',
  description: 'talk',
  execute (message, args) {
    const voiceChannel = message.member.voice.channel
    voiceChannel.join().then(connection => {
      const dispatcher = connection.play('./output_0.mp3')
      dispatcher.on('end', end => { voiceChannel.leave() })
    }).catch(err => console.log(err))
  }
}
