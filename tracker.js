var endpoint = 'http://localhost:8888'

function send(payload, path) {
  var request = new XMLHttpRequest();
  request.open('POST', path, true);
  request.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');
  request.send(JSON.stringify(payload))
}

pipes.pageview = function(x) {
  console.log('from pageview')
  send(x, endpoint); 
}
pipes.identity = function(x) {
  console.log('from identity')
  send(x, endpoint);
}

// replay events from the queue
for (i = 0; i < pipes.length; i++) {
  var key = pipes[i][0]
  var a = pipes[i][1]
  pipes[key](a)
}


