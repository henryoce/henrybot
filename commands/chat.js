const { prefix, huggingface2 } = require('../config.json')
const fetch = require('node-fetch')
let API_URL

module.exports = {
  name: 'chat',
  description: 'chat',
  execute: function (message, kv, apinum, noreply, client) {
    switch (apinum) {
      case 1:
        API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'
        break
      case 2:
        API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill'
        break
      case 3:
        API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-3B'
        break
      case 4:
        API_URL = 'https://api-inference.huggingface.co/models/luca-martial/DialoGPT-Elon'
        break
      case 5:
        API_URL = 'https://api-inference.huggingface.co/models/rsedlr/RickBot'
        break
      case 6:
        API_URL = 'https://api-inference.huggingface.co/models/henryoce/DialoGPT-small-rick-and-morty'
        break
      case 7:
        API_URL = 'https://api-inference.huggingface.co/models/HAttORi/DialoGPT-Medium-zerotwo'
        break
      case 8:
        API_URL = 'https://api-inference.huggingface.co/models/CianB/DialoGPT-small-Shrek2'
        break
      case 9:
        API_URL = 'https://api-inference.huggingface.co/models/person123/DialoGPT-small-petergriffin'
        break
      case 10:
        API_URL = 'https://api-inference.huggingface.co/models/abhiramtirumala/DialoGPT-sarcastic'
        break
      default:
        API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'
    }
    async function send (message) {
      let result = message.content
      const mentionedUser = message.mentions.users.first()
      if (message.content.startsWith(prefix) || typeof mentionedUser !== typeof undefined) {
        result = message.content.substr(message.content.indexOf(' ') + 1)
      }
      let pastUserInputs = await kv.get(`pastUserInputs${apinum}`)
      let generatedResponses = await kv.get(`generatedResponses${apinum}`)
      if (apinum === 1) {
        if (pastUserInputs === undefined && generatedResponses === undefined) {
          pastUserInputs = []
          generatedResponses = []
        } else {
          pastUserInputs = JSON.parse(pastUserInputs)
          generatedResponses = JSON.parse(generatedResponses)
        }
      }

      const payload = {
        inputs: {
          past_user_inputs: pastUserInputs,
          generated_responses: generatedResponses,
          text: result
        }
      }
      // form the request headers with Hugging Face API key
      const headers = {
        Authorization: 'Bearer ' + huggingface2
      }

      // set status to typing
      message.channel.sendTyping()
      // query the server
      const response = await fetch(API_URL, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: headers
      })
      const data = await response.json()
      console.log(data)
      let botResponse = ''
      if (data.hasOwnProperty('generated_text')) {
        botResponse = data.generated_text
      } else if (data.hasOwnProperty('error')) { // error condition
        botResponse = data.error
      }
      // send message to channel as a reply
      if (noreply === 'true') {
        // console.log('skip chat reply')
        // message.reply(botResponse)
        return botResponse
      }
      message.reply(botResponse)
      // console.log(payload)
      // console.log(result)
      if (apinum === 1) {
        if (generatedResponses.length >= 2) {
          generatedResponses.shift()
          pastUserInputs.shift()
        }
        if (generatedResponses[generatedResponses.length - 1] === botResponse) {
          generatedResponses.pop()
          pastUserInputs.pop()
          // console.log('blepu')
        } else {
          pastUserInputs.push(result)
          generatedResponses.push(botResponse)
        }
        await kv.set(`pastUserInputs${apinum}`, JSON.stringify(pastUserInputs))
        await kv.set(`generatedResponses${apinum}`, JSON.stringify(generatedResponses))
      }
    }
    send(message).then(r => {
      if (noreply === 'true') {
        console.log(r + 'CHAT TRANSFER')
        const result = r
        console.log(result + 'CHAT TRANSFER')
        client.commands.get('tts').execute(message, result, client, 'true')
      }
    })
  }
}
