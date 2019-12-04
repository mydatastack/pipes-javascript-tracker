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
    'pageview',
    'screenview',
    'transaction',
    'item',
    'reset',
    'user',
    'track_link',
    'track_form' 
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

  pipes.load = function(url, key) {
    var apiKey = key
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;

    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  }

  pipes.load('./tracker.js', '30934533345')

})()
