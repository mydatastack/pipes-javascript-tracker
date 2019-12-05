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
