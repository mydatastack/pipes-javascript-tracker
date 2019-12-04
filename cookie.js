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
  if (options.expires) str += '; expires=' + options.expries.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
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
    console.log('docode error')
  }
}

module.exports = {set}
