const fs = require('fs')
module.exports = {
  name: 'test',
  description: 'test',
  execute: function (message, args) {
    console.log(args)
  }
}
