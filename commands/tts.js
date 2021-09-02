// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech')
const fs = require('fs')
const util = require('util')
const client = new textToSpeech.TextToSpeechClient()

module.exports = {
  name: 'tts',
  description: 'tts',
  execute (message, result, dclient, callback) {
    (async function () {
      let text
      // The text to synthesize
      // var file = fs.readFileSync('responses/text.txt', 'utf8')
      if (typeof result !== typeof undefined) {
        text = (result + '.')
        console.log(text + ' TTS TEXT')
      } else { text = (message.content.substr(message.content.indexOf(' ') + 1) + '.') }
      var newArr = text.match(/[^\.]+\./g)
      // console.log(newArr)

      var charCount = 0
      var textChunk = ''
      var index = 0

      for (var n = 0; n < newArr.length; n++) {
        charCount += newArr[n].length
        textChunk = textChunk + newArr[n]

        // console.log(charCount)

        if (charCount > 4600 || n === newArr.length - 1) {
          // console.log(textChunk)

          // Construct the request
          const request = {
            input: {
              text: textChunk
            },
            // Select the language and SSML voice gender (optional)
            voice: {
              languageCode: 'en-AU',
              ssmlGender: 'MALE',
              name: 'en-AU-Wavenet-D'
            },
            // select the type of audio encoding
            audioConfig: {
              effectsProfileId: [
                'headphone-class-device'
              ],
              pitch: 0.0,
              speakingRate: 1.0,
              audioEncoding: 'MP3'
            }
          }

          // Performs the text-to-speech request
          const [response] = await client.synthesizeSpeech(request)

          console.log(response)

          // Write the binary audio content to a local file
          const writeFile = util.promisify(fs.writeFile)
          await writeFile('output_' + index + '.mp3', response.audioContent, 'binary')
          console.log('Audio content written to file: output.mp3')

          index++

          charCount = 0
          textChunk = ''
        }
      }
      if (callback === 'true') {
        dclient.commands.get('talk').execute(message, [], dclient, 'speak')
      }
    }())
  }
}
