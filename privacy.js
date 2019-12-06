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
