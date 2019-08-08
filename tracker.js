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
        console.log('0 = error', request.status)
        console.log('DONE')
      }
    };
    request.open('POST', path, true);
    request.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
    request.send(JSON.stringify(payload))
}

pipes.pageview = function(name, data) {
  var payload = {name: name, data}
  send(payload, endpoint); 
}
pipes.identity = function(name, data) {
  var payload = {name: name, data}
  send(payload, endpoint);
}

pipes.track = function(name, data) {
  console.log(page_referrer)
  var payload = {name: name, data}
  send(payload, endpoint)
}

// replay events from the queue
for (i = 0; i < pipes.length; i++) {
  var key = pipes[i][0]
  var first = pipes[i][1]
  var second = pipes[i][2]
  pipes[key](first, second)
}


