(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pagePath = window.location.pathname;
var pageReferrer = document.referrer;
var ip = '0.0.0.0';
var pageSearch = '';
var pageTitle = document.title;
var pageUrl = window.location.href;
var userAgent = navigator.userAgent;
var sHeight = window.screen.width 
var sWidht = window.screen.height 
var sDensity = window.screen.density 

function utmCheck(param) {
  return param ? param : '';
}

function parseQueryString() {
  var urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: utmCheck(urlParams.get('utm_source')),
    utm_medium: utmCheck(urlParams.get('utm_medium')),
    utm_campaign: utmCheck(urlParams.get('utm_campaign')),
    utm_term: utmCheck(urlParams.get('utm_term')),
    utm_content: utmCheck(urlParams.get('utm_content')),
  }
}

function tmz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getLanguage() {
  var l = navigator.language 
    || navigator.browserLanguage
    || navigator.systemLanguage
    || navigator.userLanguage;
  return l
}


var context = {
  app: {
    name: '',
    version: '',
    build: '',
    namespace: ''
  },
  campaign: parseQueryString(),
  device: {
    id: '',
    manufacturer: '',
    model: '',
    name: '',
    type: '',
    token: '',
  },
  ip: ip,
  library: {
    name: 'pipes.js',
    version: '1.0'
  },
  locale: getLanguage(),
  location: {
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    speed: 0
  },
  network: {
    bluetooth: false,
    carrier: '',
    cellular: false,
    wifi: false
  },
  os: {
    name: '',
    version: ''
  },
  page: {
    path: pagePath,
    referrer: pageReferrer,
    search: pageSearch,
    title: pageTitle,
    url: pageUrl 
  },
  referrer: {
    type: '',
    name:'',
    url: '',
    link: ''
  },
  screen: {
    height: sHeight,
    width: sWidht,
    density: sDensity
  },
  timezone: tmz(), 
  userAgent: userAgent,
}

module.exports = context

},{}],2:[function(require,module,exports){
// https://github.com/component/cookie/blob/master/index.js
// https://github.com/segmentio/analytics.js-core/blob/master/lib/cookie.js

function set(name, value, options) {
  var options = options || {}
  var str = encode(name) + '=' + encode(value);

  if (value == null) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage)
  }

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

function remove(name, date) {
  var date = 'Max-Age=-99999999;';
  var str = encode(name) + '=; ' + date
  document.cookie = str;
}


module.exports = {
  set: set,
  get: get,
  remove: remove
}

},{}],3:[function(require,module,exports){
var cookie = require('./cookie')
var context = require('./context')
var utils = require('./utils')
var endpoint = 'http://localhost:8888/'
var privacy = require('./privacy')

init = true
var anonymousId = false
var doNotTrack = privacy.isDoNotTrackEnabled()
var pipesDisabled = privacy.isPipesDisabled()

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
  send(payload, endpoint); 
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
  send(payload, endpoint); 
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
  send(payload, endpoint)
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
  send(payload, endpoint);
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
    pipes.track(name, Object.assign({}, properties, context,
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

function send(payload, path) {
  if (doNotTrack || pipesDisabled) {
    return
  }
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

// replay events from the queue
for (i = 0; i < pipes.length; i++) {
  var key = pipes[i][0]
  var first = pipes[i][1]
  var second = pipes[i][2]
  var third = pipes[i][3]
  pipes[key](first, second, third)
}



},{"./context":1,"./cookie":2,"./privacy":4,"./utils":5}],4:[function(require,module,exports){
var cookie = require('./cookie')

function isDoNotTrackEnabled() {
  var doNotTrackOption = window.doNotTrack || window.navigator.doNotTrack || window.navigator.msDoNotTrack

  if (doNotTrackOption == undefined) {
    return false
  }

  if (doNotTrackOption.charAt(0) === '1' || doNotTrackOption === 'yes') {
    return true
  }

  return false
}

function isPipesDisabled() {
  var cookieValue = cookie.get('pipes_disabled')
  if (cookieValue == undefined) {
    return false
  } 
  return true
}

module.exports = {
  isDoNotTrackEnabled: isDoNotTrackEnabled,
  isPipesDisabled: isPipesDisabled
}

},{"./cookie":2}],5:[function(require,module,exports){
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
}

function cookieExpiration(years) {
  var d = new Date();
  d.setTime(d.getTime() + (365*Number(years)*24*60*60*1000));
  return d.toUTCString()
}


function ts() {
  return new Date().toISOString()
}

module.exports = {
  uuidv4: uuidv4,
  cookieExpiration: cookieExpiration,
  timestamp: ts
}

},{}]},{},[3]);
