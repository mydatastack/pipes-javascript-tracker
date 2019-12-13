var cookie = require('./cookie')
var context = require('./context')
var utils = require('./utils')
var config = require('./config.json')
var privacy = require('./privacy')

init = true
var anonymousId = false
var doNotTrack = privacy.isDoNotTrackEnabled()
var pipesDisabled = privacy.isPipesDisabled()
var endpoint = constructEndpoint()

function constructEndpoint() {
  var region = config.trackingEndpoint.region
  var apiId = config.trackingEndpoint.apiId
  var path = config.trackingEndpoint.path
  return 'https://' 
    + apiId
    + '.execute-api.'
    + region
    + '.amazonaws.com/'
    + path
}

if (anonymousId == false) getAnonymousIdCookie()

function getAnonymousIdCookie() {
  var cookieValue = cookie.get('pipes_anonymous_id')
  if (cookieValue != undefined) {
    anonymousId = cookieValue;

  } else {
    cookie.set('pipes_anonymous_id', 
      utils.uuidv4(), 
      { expires: utils.cookieExpiration(2) })
  }
}


function disablePipes() {
  cookie.set('pipes_disabled', 
    true, {
    expires: utils.cookieExpiration(10)
    })
}

pipes.page = function(name, properties) {
  var payload = {
    anonymousId: anonymousId,
    type: "page",
    name: name, 
    properties: properties,
    context: context,
    sentAt: utils.timestamp(),
    messageId: utils.uuidv4()
  }
  send(payload); 
}

pipes.screen = function(name, properties) {
  var payload = {
    anonymousId: anonymousId,
    type: "screen",
    name: name, 
    properties: properties,
    context: context,
    sentAt: utils.timestamp(),
    messageId: utils.uuidv4()
  }
  send(payload); 
}

pipes.track = function(name, properties) {
  var payload = {
    anonymousId: anonymousId,
    type: "track",
    event: name, 
    properties: properties, 
    context: context,
    sentAt: utils.timestamp(),
    messageId: utils.uuidv4()
  }
  send(payload)
}

pipes.identity = function(userId, properties) {
  var payload = {
    anonymousId: anonymousId,
    userId: userId, 
    type: 'identity',
    properties: properties,
    context: context,
    sentAt: utils.timestamp(),
    messageId: utils.uuidv4()
  }
  send(payload);
}


pipes.trackLink = function(link, name, properties) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    pipes.track(name, Object.assign({}, properties, {
          id: link.id,
          href: link.href,
          origin: link.origin,
          text: link.text,
          textContent: link.textContent
        }) 
      ) 
    setTimeout(function() {
      location.href = link.href
    }, 300)
  }, true)

}

function deconstructForm(formElement) {
  var length = formElement.elements.length;
  var elements = [];
  var i;
  for (i = 0; i < length; i++) {
    elements.push({
      type: formElement.elements[i].type,
      name: formElement.elements[i].name,
      value: formElement.elements[i].value
  })
  }
  return elements
}

pipes.trackForm = function(form, name, properties) {
  form.addEventListener('click', function(e) {
    e.preventDefault();
    pipes.track(name, Object.assign({}, properties, 
      {
        elements: [deconstructForm(form)]
      }))
    setTimeout(function() {
      location.href = form.href
    }, 300)
  }, true)

}


pipes.disable = function() {
  disablePipes()

}

function send(payload) {
  if (doNotTrack || pipesDisabled) {
    return
  }
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      //console.log('request.status: ', request.status)
    }
  };
  request.open('POST', endpoint, true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send(JSON.stringify(payload))
}

for (i = 0; i < pipes.length; i++) {
  var key = pipes[i][0]
  var first = pipes[i][1]
  var second = pipes[i][2]
  var third = pipes[i][3]
  pipes[key](first, second, third)
}


