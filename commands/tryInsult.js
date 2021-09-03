const Keyv = require('keyv')
const keyvault = new Keyv()
module.exports = {
  name: 'tryInsult',
  description: 'tryInsult',
  execute (message, args, client, kv) {
    async function tryInsult () {
      const dbMsgCount = 'msgCount_' + `${message.guild.id}`
      const msgCount = await keyvault.get(dbMsgCount)
      console.log(msgCount)
      if (typeof msgCount === typeof undefined) {
        await keyvault.set(dbMsgCount, 252)
      } else await keyvault.set(dbMsgCount, msgCount + 1)
      if (msgCount >= 300) {
        // message.channel.send(insultGen())
        await keyvault.set(dbMsgCount, 1)
        const response = Math.round(Math.random())
        if (response === 1) {
          setTimeout(() => { client.commands.get('insult').execute(message, 'fog', client) }, 240000)
        } else {
          setTimeout(() => { client.commands.get('chat').execute(message, kv, 1) }, 240000)
        }
      }
    }
    tryInsult()
  }
}
