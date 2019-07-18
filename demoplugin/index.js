/* 

Used and avilable variables:

const windowtitle = document.getElementById('windowtitle');
const content = document.getElementById('content');
const toasts = document.getElementById('toasts');
const videoplayer = document.getElementById('videoplayer');
const subtitleContainer = document.getElementById("subtitleContainer");
const playing = document.getElementById('playing');
const controls = document.getElementById('controls');
const controlsMainRow = document.getElementById('controls-main-row');
const controlsSubRow = document.getElementById('controls-sub-row');
const playbutton = document.getElementById('playbutton');
const pausebutton = document.getElementById('pausebutton');
const currSubNum = document.getElementById('currSubNum');
const allSubNum = document.getElementById('allSubNum');
const currLangNum = document.getElementById('currLangNum');
const allLangNum = document.getElementById('allLangNum');
const playlistholder = document.getElementById('playlistholder');
const playlist = document.getElementById('playlist');
const searchinplaylist = document.getElementById('searchinplaylist');
const searchinplaylisticon = document.getElementById('searchinplaylisticon');
const playprogressholder = document.getElementById('playprogressholder');
const playprogress = document.getElementById('playprogress');
const elapsedtime = document.getElementById('elapsedtime');
const reamingtime = document.getElementById('reamingtime');
const loadingoverlay = document.getElementById('loading-overlay');
const modalsholder = document.getElementById('modalsholder');
const pluginsmodal = document.getElementById('pluginsmodal');
const pluginsmodalcontent = document.getElementById('pluginsmodalcontent');

let d = new Date();
let nowYear = d.getFullYear();
let nowMonth = d.getMonth() + 1;
let nowDay = d.getDate();
const todayDate = nowYear + "-" + nowMonth + "-" + nowDay;

const os = process.platform;
const desktopEnv = require('desktop-env');
const electron = require('electron');
const {remote, ipcRenderer} = require('electron');
const app = electron.app || electron.remote.app;
const currentWindow = remote.getCurrentWindow();
const Mousetrap = require('mousetrap');
const {dialog} = require('electron').remote;
const fse = require('fs-extra');
const http = require('http');
const path = require('path');
const srt2vtt = require('srt2vtt');
const request = require('request');
const unzipper = require('unzipper');
const co = require('co');
const npminstall = require('npminstall');

const Datastore = require('nedb');
const appDir = app.getPath('userData');
const pluginsDir = path.join(appDir, 'plugins');
const pluginsfile = new Datastore({ filename: appDir + '/plugins.db', autoload: true });
const playlistfile = new Datastore({ filename: appDir + '/playlist.db', autoload: true });

const Store = require('electron-store');
const store = new Store();

const playerjs = require('./js/player.js');
const playlistjs = require('./js/playlist.js');
const pluginsjs = require('./js/plugins.js');


Usable and avilable functions:

function openExternalLink(link)        -> open a link in the default browser [string]
function changeTheme(currAppTheme)     -> change the theme in realtime [string]
function setLanguage(language)         -> change the language with relaunch [string]
function setSubtitleLanguage(language) -> change the subtitle language file in realtime [string]
toggleFullScreen()                     -> set, reset fullscreen video mode
toggleAllwaysOnTop()                   -> set, reset window always on top mode
toggleControlsAwaysOnTop()             -> set, reset player's controls panel always show mode
setToast(toast)                        -> set and show a short message in the left-top corner [string]
showControls()                         -> show player's controls panel
hideControls()                         -> hide player's controls panel
showHidePlugins()                      -> show or hide plugins modal (list of plugins)
getVideoTime(ms)                       -> give back a formatted time form miliseconds ex.: videoplayer.currentTime

playerjs.handlePlayPause(operation) -> play or pause video [string]
playerjs.playVideo(videoid)         -> play a video by id [int]
playerjs.playPrev()                 -> play the previous video
playerjs.playNext()                 -> play the next video
playerjs.volumeControl(setto)       -> increse, decrease video volume [string "up" or "down"]
playerjs.volumeMute()               -> decrease video volume to 0
playerjs.seekVideo(goto)            -> seek video position by 5 sec [string "forward" or "backward"]
playerjs.loopVideo()                -> loop the mediafile playing
playerjs.toggleShowSubtitle()       -> show, hide subtitle (if have correct named file)
playerjs.changeSubtitle()           -> rotate subtitle files (if have correct named files)
playerjs.changeAudioTrack()         -> rotate audio tracks in the video (not supperted yet in chromium..)

playlistjs.toggleShowPlaylist()               -> show, hide playlist
playlistjs.fillPlaylist()                     -> (re)fill playlist from playlist file
playlistjs.searchInPlaylist(searchedText)     -> (re)fill playlist from playlist file by searched text [string]
playlistjs.addToPlaylist(newvideos)           -> add to playlist file and playlist [Array -> see more in app/js/playlist.js]
playlistjs.savePlaylist()                     -> save the current playlist file content to user friendly player's owned playlist file (.pppl)
playlistjs.readPlaylistFile(playlistfilepath) -> read the user friendly player's owned playlist file (.pppl) and refill the playlist file and the playlist [string]
playlistjs.deleteVideo(videoID)               -> remove the video from the playlist file and the playlist by id [int]


Languages:

The currently supported languages '.json' files located is "locales" folder.

Example to use:
setToast(i18n.__('playlist') + ' ' + i18n.__('off'));

If you want add new words to the list, you must copy the 'locales' folder, somewhere to your plugin dierctory system.
This is depends on the 'electron-store' npm package, so you need define in the plugins.json:
"dependencies": { "electron-store": "1.3.0" },
See example usage in the "Skip Scenes" plugin.


Plugin functions calls

You must export your plugin functions (what u want use outside this file).
The index file variable will is your plugin name (lovercase english letters only) + "js".
This file is "demopluginjs".
See more at bellow in example code.

*/

module.exports = {
  showPluginLocationInConsole
};

console.log("Hello from the demo plugin!");

let pluginDirPath = path.join(pluginsDir, 'demolugin');

function showPluginLocationInConsole() {
  currentWindow.webContents.openDevTools();
  console.log("%cThe plugin folder location is: " + pluginDirPath, 'background: #222; color: #bada55');
}

let demoPluginInfoIcon = `
<a id="demoinfo" class="w3-left clickable" onclick="demopluginjs.showPluginLocationInConsole();">
  <i class="fa fa-smile-o w3-tooltip" aria-hidden="true">
    <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom"> Demo plugin </span>
  </i>
</a>`;

controlsSubRow.innerHTML += demoPluginInfoIcon;

/*

Thanks for your contribution and have a nice day!

Krisztián

*/
