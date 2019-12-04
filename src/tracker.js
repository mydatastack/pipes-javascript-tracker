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

console.log(
  page_path,
  user_agent,
  page_url, 
  page_title,
  page_referrer

)

var context = function() {

}

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


