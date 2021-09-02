const fs = require('fs')
const insultsRaw = fs.readFileSync('responses/insults.txt', 'utf8')
const insultList = insultsRaw.split('\n')
module.exports = {
  name: 'insult',
  description: 'insult',
  execute (message, args, client) {
    // see if a user was mentioned
    let targetUser = message.mentions.users.first()
    // by default, will assume specific insult num is the second argument
    let insultArgsNum = 1
    // function to return specific / random insult from list
    function insultGen () {
      // check if a specific insult was selected
      const insultNum = args[insultArgsNum]
      if (typeof (insultNum) !== typeof undefined) {
        console.log(insultNum)
        // check insult num is in range of total insults
        if (insultNum >= 0 && insultNum <= insultList.length) {
          console.log('valid num')
          return insultList[insultNum]
        }
      }
      // select random insult
      const rollNum = (Math.floor(Math.random() * (insultList.length)))
      return insultList[rollNum]
    }
    // if no user was mentioned, use msg sender as target
    if (typeof (targetUser) === typeof undefined) {
      targetUser = message.member
      insultArgsNum = 0
      if (message.channel.type === 'dm') {
        targetUser = message.author
      }
    }
    // will not insult if mentioning henry or henrybot
    if (targetUser.id === '162765389074399232' || targetUser.id === '795219509073281074') {
      // if statement stops bot from attacking henry / henrybot on tryInsult or insult members who try to
      if (message.author.id === '162765389074399232' || message.author.id === '795219509073281074') {
        message.channel.send(client.commands.get('random').execute('random.txt'))
      } else message.channel.send(`<@${message.author.id}> ` + insultGen())
    } else message.channel.send(`<@${targetUser.id}> ` + insultGen())
  }
}
