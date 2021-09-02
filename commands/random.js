const fs = require('fs')
module.exports = {
  name: 'random',
  description: 'picks random item from list of newline seperated items',
  execute (fileName) {
    const responses = fs.readFileSync('responses/' + fileName, 'utf8').split('\n')
    const rollNum = (Math.floor(Math.random() * (responses.length)))
    return responses[rollNum]
  }
}
