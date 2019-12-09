(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  trackingEndpoint: {
    region: 'eu-central-1',
    apiId: '16vzxu7np2',
    path: 'dev',
    key: 'api key'
  },
  s3ScriptLocation: {
    region: 'eu-central-1',
    bucket: 'pipesdata.com-js-trackers',
    folder: '16vzxu7np2'
  }

}

},{}],2:[function(require,module,exports){
var config = require('./config')

var scriptUrl = 'https://s3.' 
  + config.s3ScriptLocation.region 
  + './amazonaws.com/' 
  + config.s3ScriptLocation.bucket 
  + '/' 
  + config.s3ScriptLocation.folder 
  + '/pipes.min.js'
 
(function() {
  window.pipes = window.pipes || []
  var pipes = window.pipes;

  if (pipes.init) return;

  if (pipes.invoked) {
    console.error('Pipes tracker included twice')
    return;
  }

  pipes.invoked = true;
  pipes.init = false;

  pipes.commands = [
    'identity',
    'track',
    'page',
    'screen',
    'trackLink',
    'trackForm',
    'disable'
  ]

  pipes.generate = function(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments)   
      args.unshift(method)
      pipes.push(args)
      return pipes
    }
  }

  for (var i = 0; i < pipes.commands.length; i++) {
    var key = pipes.commands[i]
    pipes[key] = pipes.generate(key)
  }

  pipes.load = function(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url; 

    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  }

  pipes.load(scriptUrl)

})()

},{"./config":1}]},{},[2]);
