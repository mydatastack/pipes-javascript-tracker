(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// https://github.com/component/cookie/blob/master/index.js
// https://github.com/segmentio/analytics.js-core/blob/master/lib/cookie.js

function set(name, value, options) {
  var options = options || {}
  var str = encode(name) + '=' + encode(value);

  if (value == null) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage)
  }
  console.log(options)

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires;
  if (options.secure) str += '; secure';

  document.cookie = str;
}

function all() {
  var str;
  try {
    str = document.cookie;
  } catch (err) {
    return {}
  }
  return parse(str)
}

function get(name) {
  return all()[name]
}

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1])
  }
  return obj;
}

function encode(value) {
  try {
    return encodeURIComponent(value);
    } catch (e) {
      console.log('encode error')
    }
}

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    console.log('decode error')
  }
}


module.exports = {
  set: set,
  get: get
}

},{}],2:[function(require,module,exports){
var cookie = require('./cookie')
var endpoint = 'http://localhost:8888/'
init = true

var campaign_name = '';
var campaign_source = '';
var campaign_medium = '';
var campaign_term = '';
var campaign_content = '';
var page_path = window.location.pathname;
var page_referrer = document.referrer;
var ip = '0.0.0.0';
var page_search = '';
var page_title = document.title;
var page_url = window.location.href;
var user_agent = navigator.userAgent;
var ts = new Date().toISOString()

function cookieExpiration() {
  var d = new Date();
  d.setTime(d.getTime() + (365*2*24*60*60*1000));
  return d.toUTCString()
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
}


var cookieOptions = {
  expires: cookieExpiration()
}

if (!cookie.get('pipes_anonymous_id')) cookie.set('pipes_anonymous_id', uuidv4(), cookieOptions)

console.log(
  page_path,
  user_agent,
  page_url, 
  page_title,
  page_referrer
)


function send(payload, path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        console.log('request.status: ', request.status)
        console.log('DONE')
      }
    };
    request.open('POST', path, true);
    request.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
    request.send(JSON.stringify(payload))
}

pipes.identity = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint);
}

pipes.track = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint)
}

pipes.pageview = function(name, data) {
  var payload = {
    name: name, 
    data: data, 
    timestamp: ts}
  send(payload, endpoint); 
}

pipes.screenview = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.transaction = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.item = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.reset = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.user = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.track_link = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

pipes.track_form = function(name, data) {
  var payload = {name: name, data: data}
  send(payload, endpoint); 
}

// replay events from the queue
for (i = 0; i < pipes.length; i++) {
  var key = pipes[i][0]
  var first = pipes[i][1]
  var second = pipes[i][2]
  pipes[key](first, second)
}



},{"./cookie":1}]},{},[2]);
