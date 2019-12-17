const spawn = require('child_process').spawn
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const https = require('https')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const apiRegion = process.env.APIREGION || '' 
const apiId =  process.env.APIID || ''
const apiPath = process.env.APIPATH  || ''
const apiKey = process.env.APIKEY || '' 

const s3Region = process.env.S3REGION || ''
const s3Bucket = process.env.S3BUCKET || ''
const s3Folder = apiId 

const contextUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/context.js'
const cookieUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/cookie.js'
const pipesUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/pipes.js'
const privacyUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/privacy.js'
const tagUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/tag.js'
const utilsUrl = 'https://raw.githubusercontent.com/pipes/pipes-javascript-tracker/master/js-tracker/src/utils.js'

const downloadFiles = (url, dest, cb) => {
  const file = fs.createWriteStream(dest)
  const request = https.get(url, response => {
    response.pipe(file)
    file.on('finish', () => file.close(cb))
  }).on('error', err => {
    fs.unlink(dest)
    if (err) cb(err.message)
  })
}


const config = {
  trackingEndpoint: {
    region: apiRegion,
    apiId: apiId,
    path: apiPath,
    key: apiKey
  },
  s3ScriptLocation: {
    region: s3Region,
    bucket: s3Bucket,
    folder: s3Folder
  }
}

const createConfig = () => {
  const data = JSON.stringify(config)
  fs.writeFileSync('/tmp/config.json', data)
}

const buildP = async (input, output) => {
  const command = './node_modules/.bin/webpack --config webpack.config.js' 
  const {stdout, stderr } = await exec(command)
  console.log('stdout', stdout)
  console.log('stderr', stderr)
  return stdout
}

const uploadS3 = (filename, path, bucket, folder) => {
  return new Promise((resolve, reject) => {
  fs.readFile(path + filename, (err, data) => {
    if (err) {throw err}
    const base64data = Buffer.from(data, 'binary')
    s3.putObject({
      Bucket: bucket,
      Key: folder + '/' + filename,
      Body: base64data,
      ContentType: 'application/javascript',
      ACL: 'public-read'
    }, (err, data) => err ? reject(err) : resolve('files uploaded to 3 \n'))
  })
})
}

const handler = async (event, context) => {
    try {
      createConfig()
       
      downloadFiles(contextUrl, '/tmp/context.js', d => console.log(d) || d)
      downloadFiles(cookieUrl, '/tmp/cookie.js', d => console.log(d) || d)
      downloadFiles(pipesUrl, '/tmp/pipes.js', d => console.log(d) || d)
      downloadFiles(privacyUrl, '/tmp/privacy.js', d => console.log(d) || d)
      downloadFiles(tagUrl, '/tmp/tag.js', d => console.log(d) || d)
      downloadFiles(utilsUrl, '/tmp/utils.js', d => console.log(d) || d)
      
      await buildP('/tmp/pipes.js', '/tmp/pipes.min.js')
      await buildP('/tmp/tag.js', '/tmp/tag.min.js')
      
      await uploadS3('pipes.min.js', '/tmp/', s3Bucket, s3Folder)
      await uploadS3('tag.min.js', '/tmp/', s3Bucket, s3Folder)

      return 'success'
    } catch (e) {
      console.log(e)
      return 'error'
    } 

}

module.exports.handler = handler

if (!module.parent) {
  const assert = require('assert')
  const t = async() => {
    assert(await handler({RequestType: 'Create'}) === 'success')
  }
  t()
} 

