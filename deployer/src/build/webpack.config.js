const path = require('path')

module.exports = {
  entry: {
    pipes: ['/tmp/pipes.js'],
    tag: ['/tmp/tag.js']
  },
  output: {
    path: path.resolve('/tmp/'),
    filename: '[name].min.js'
  }
}
