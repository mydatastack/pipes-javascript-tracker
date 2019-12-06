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
