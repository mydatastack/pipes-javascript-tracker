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


