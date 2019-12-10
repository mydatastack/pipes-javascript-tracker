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
