/* module.exports = {
  toggleSkipState,
  skipScene,
  skipNextScene,
  loadSkipFile,
}; */
module.exports = {
  toggleSkipState
};

if (!store.has('settings.skipscenes')) {
  store.set('settings.skipscenes', false);
}

let skipScenes = store.get('settings.skipscenes');

/* extend loacales words */
let i18nPath = path.join(pluginsDir, 'skipscenes', 'assets', 'locales', 'i18n.js');
const i18n = new(require(i18nPath));

/* extend function */
let playVideoExtends = playerjs.playVideo;
playerjs.playVideo = function(videoid) {
  playVideoExtends.apply(this, arguments);

  playlistfile.findOne({ _id: parseInt(videoid) }, function (err, d) {
    if (d !== null) {
      loadSkipFile(d._name, d._path);
    }
  });
};

function loadSkipFile(currentFileName, currentFilePath) {
  const _skipFileName = currentFileName.substring(0, currentFileName.lastIndexOf("."));
  const _skipFilePath = path.dirname(currentFilePath);
  allSkipNum.innerHTML = 0;
  let _skipFileContent = "";

  try {
    _skipFileContent = fse.readFileSync(path.join(_skipFilePath, _skipFileName + '.skip'));
    // throws exception if file not found
  } catch (_) {
    _setSkipState(false); // when file not found, turn off skipping here
    return;
  }
  /**
  * @type {string}
  */
 
  const _skipData = _skipFileContent.toString();
  const __skipDurations = [];
  _skipData.split("\r").forEach(function (_line) {
    _line = _line.replace(/\s/g, "");

    let delim = ":";
    if (new RegExp(`^[0-9]{1,2}${delim}[0-9]{1,2}${delim}[0-9]{1,2}-[0-9]{1,2}${delim}[0-9]{1,2}${delim}[0-9]{1,2}$`).test(_line)) {
      calculateSkipDurations(_line, delim);
      return;
    }

    delim = ".";
    if (new RegExp(`^[0-9]{1,2}${delim}[0-9]{1,2}${delim}[0-9]{1,2}-[0-9]{1,2}${delim}[0-9]{1,2}${delim}[0-9]{1,2}$`).test(_line)) {
      calculateSkipDurations(_line, delim);
    }
  });
  skipDurations = [...__skipDurations];
  _setSkipState();
  allSkipNum.innerHTML = 1;

  function calculateSkipDurations(_line = "", delim = ":") {
    const _lineSplitted = _line.split("-");
    const [__minute0, __second0] = getMinNSec(_lineSplitted[0], delim);
    const [__minute1, __second1] = getMinNSec(_lineSplitted[1], delim);
    if (inRange(__minute0) && inRange(__second0) && inRange(__minute1) && inRange(__second1)) {
      __skipDurations.push([getTimeInSeconds(_lineSplitted[0], delim), getTimeInSeconds(_lineSplitted[1], delim)]);
    }
  }

  function inRange(number = 0) {
    return number >= 0 && number < 60;
  }

  function getMinNSec(timeInStr = "", delimiter = ":") {
    const __timeSplitted = timeInStr.split(delimiter);
    return [parseInt(__timeSplitted[1]), parseInt(__timeSplitted[2])];
  }

  function getTimeInSeconds(timeInStr = "", delimiter = ":") {
    const __timeSplitted = timeInStr.split(delimiter);
    const _tH = parseInt(__timeSplitted[0]);
    const _tM = parseInt(__timeSplitted[1]);
    const _tS = parseInt(__timeSplitted[2]);
    return (_tH * 60 * 60 + _tM * 60 + _tS);
  }
}

function skipNextScene(__currentTimeExact) {
  if (skipScenes) {
    const __currentTime = Math.floor(__currentTimeExact) + 1;
    for (__duration of skipDurations) {
      if (__currentTime >= __duration[0] && __currentTime <= __duration[1]) {
        setTimeout(function () {
          videoplayer.currentTime = __duration[1] + 1;
        }, (__currentTime - __currentTimeExact) * 1000);
        return true;
      }
    }
  }
  return false;
}

function skipScene(__currentTimeExact) {
  if (skipScenes) { // only when skipping is on
    const __currentTime = Math.floor(__currentTimeExact);
    for (__duration of skipDurations) {
      if (__currentTime >= __duration[0] && __currentTime <= __duration[1]) {
        videoplayer.currentTime = __duration[1] + 1;
        return true;
      }
    }
  }
  return false;
}

function toggleSkipState(_switch) {
  if (!skipDurations || !skipDurations.length) {
    _setSkipState(false);
    return;
  }
  _setSkipState(!store.get('settings.skipscenes'));
}

function _setSkipState(_boolState) {
  skipScenes = _boolState === undefined ? store.get('settings.skipscenes') : _boolState;
  store.set('settings.skipscenes', skipScenes);
  if (skipScenes) {
    setToast(i18n.__('skip') + ': ' + i18n.__("on"));
    currSkipNum.innerHTML = 1;
  } else {
    setToast(i18n.__('skip') + ': ' + i18n.__("off"));
    currSkipNum.innerHTML = 0;
  }
}

let skipscenesPluginInfoIcon = `
<a id="skipscenes" class="w3-right clickable" onclick="skipscenesjs.toggleSkipState();">
  <i class="fa fa-sign-out w3-tooltip" aria-hidden="true">
    <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom"> ` + i18n.__('skip') + ` </span>
  </i>
  <span id="currSkipNum">0</span>/<span id="allSkipNum">0</span>
</a>`;

controlsSubRow.innerHTML += skipscenesPluginInfoIcon;
