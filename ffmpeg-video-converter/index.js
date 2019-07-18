/* Only Windows & Linux support ffmpeg, as i know */
const ffmpeg = require('fluent-ffmpeg');

if (os === 'win32') {
  ffmpeg.setFfmpegPath(path.join(__dirname, 'node_modules', '_ffmpeg-binaries@3.2.2-3@ffmpeg-binaries', 'bin', 'ffmpeg.exe'));
  ffmpeg.setFfprobePath(path.join(__dirname, 'node_modules', '_ffmpeg-binaries@3.2.2-3@ffmpeg-binaries', 'bin', 'ffprobe.exe'));
} else {
  ffmpeg.setFfmpegPath(path.join(__dirname, 'node_modules', '_ffmpeg-binaries@3.2.2-3@ffmpeg-binaries', 'bin', 'ffmpeg'));
  ffmpeg.setFfprobePath(path.join(__dirname, 'node_modules', '_ffmpeg-binaries@3.2.2-3@ffmpeg-binaries', 'bin', 'ffprobe'));
}

let pluginStyles = `
<style>
span#aacconvertspan {position:absolute;top:25px;left:0;cursor:pointer;font-family:sans-serif;}
span#aacconvertspanclose {position:absolute;top:25px;left:88px;cursor:pointer;}
div.fileconvertbox {font-size:8px;font-weight:bold;}
</style>
`;
document.head.innerHTML += pluginStyles;

let aacConvertLabel = `
<span id="aacconvertspan" class="w3-tag w3-green w3-round w3-left w3-small" style="display:none;">AC3 => AAC</span>
<span id="aacconvertspanclose" class="w3-tag w3-red w3-round w3-left w3-small" style="display:none;" onclick="w3.hide('#aacconvertspan');w3.hide('#aacconvertspanclose');">&times;</span>
`;
modalsholder.innerHTML += aacConvertLabel;

let fileConvertModal = `
<div id="convertmodal" class="w3-modal">
  <div class="w3-modal-content w3-animate-zoom w3-card-4">
    <header class="w3-container"> 
      <span onclick="w3.hide('#convertmodal');" class="w3-button w3-display-topright w3-round">&times;</span>
      <h2> ` + i18n.__('converting') + ` </h2>
    </header>
    <div class="w3-modal-content">
      <div id="convertmodalcontent" class="w3-container">
        <!-- fill it on conversions -->
      </div>
    </div>
  </div>
</div>`;
modalsholder.innerHTML += fileConvertModal;

const convertmodal = document.getElementById('convertmodal');
const convertmodalcontent = document.getElementById('convertmodalcontent');

/* extend event function */
let playlistOnDropExtends = playlist.ondrop;
playlist.ondrop = function(e) {
  playlistOnDropExtends.apply(this, arguments);

  let convertvideos = [];
  
  let iDroppedItemIdx = 0;

  for (let f of e.dataTransfer.files) {

    let filePath = f.path;
    let fileName = f.name;

    if (fileName === '') {
      // On Linux f.name is empty when contains unicode characters (é, á, etc)
      let filePathParts = filePath.split('/');
      let lastFilePathPart = filePathParts.length - 1;
      fileName = filePathParts[lastFilePathPart];
    }

    let droppedIsDir = fse.lstatSync(filePath).isDirectory();
    
    if (droppedIsDir) {

      let folderFiles = fse.readdirSync(filePath);
      for (let ii = 0; ii < folderFiles.length; ii++) {

        let fileInFolderPath = path.join(filePath, folderFiles[ii]);
        let fileInFolderName = folderFiles[ii];
        let fileInFolderExt = path.extname(folderFiles[ii]);

        if ( supportedFileExts.indexOf(fileInFolderExt) === -1 ) {

          if (fileInFolderExt === '.avi' || fileInFolderExt === '.wmv') {
            
            let convertvideo = {
              name: fileInFolderName,
              path: fileInFolderPath
            };
            convertvideos.push(convertvideo);

          }

        }

      }

    } else {
      
      if ( supportedFileTypes.indexOf(f.type) === -1 ) {

        let fileExt = path.extname(e.dataTransfer.files[iDroppedItemIdx].path);
        
        if (fileExt === '.avi' || fileExt === '.wmv') {
          
          let convertvideo = {
            name: fileName,
            path: filePath
          };
          convertvideos.push(convertvideo);

        }

      }
      
    }

    iDroppedItemIdx++;

  }

  if (convertvideos.length > 0) {
    prepare2Convert(convertvideos);
  }

  return false;
};

/* extend 2nd event function */
let videoplayerOnDropExtends = videoplayer.ondrop;
videoplayer.ondrop = function(e) {
  videoplayerOnDropExtends.apply(this, arguments);
  
  let convertvideos = [];

  let iDroppedItemIdx = 0;

  for (let f of e.dataTransfer.files) {

    let filePath = f.path;
    let fileName = f.name;

    if (fileName === '') {
      let filePathParts = filePath.split('/');
      let lastFilePathPart = filePathParts.length - 1;
      fileName = filePathParts[lastFilePathPart];
    }

    let droppedIsDir = fse.lstatSync(filePath).isDirectory();
    
    if (droppedIsDir) {
      
      let folderFiles = fse.readdirSync(filePath);
      for (let ii = 0; ii < folderFiles.length; ii++) {

        let fileInFolderPath = path.join(filePath, folderFiles[ii]);
        let fileInFolderName = folderFiles[ii];
        let fileInFolderExt = path.extname(folderFiles[ii]);

        if ( supportedFileExts.indexOf(fileInFolderExt) === -1 ) {

          if (fileInFolderExt === '.avi' || fileInFolderExt === '.wmv') {
              
            let convertvideo = {
              name: fileInFolderName,
              path: fileInFolderPath
            };
            convertvideos.push(convertvideo);

          }

        }

      }

    } else {
      
      if ( supportedFileTypes.indexOf(f.type) === -1 ) {

        let fileExt = path.extname(e.dataTransfer.files[iDroppedItemIdx].path);
        
        if (fileExt === '.avi' || fileExt === '.wmv') {
            
          let convertvideo = {
            name: fileName,
            path: filePath
          };
          convertvideos.push(convertvideo);

        }

      }
      
    }

    iDroppedItemIdx++;

  }

  if (convertvideos.length > 0) {
    prepare2Convert(convertvideos);
  }

  return false;
};

videoplayer.onplaying = function() {

  let currentPlayedPath = videoplayer.src;
  let currentPlayedFile = path.basename(currentPlayedPath);
  // search mkv audio codecs (ac3 audio codec in mkv containers currently not supported in html5 videoplayer)
  if (path.extname(currentPlayedFile) === '.mkv') {
    getAudioEncoding(currentPlayedPath);
  }

};

/* functions */

function prepare2Convert(convertvideos) {
        
  let convertFilesPromises = [];

  convertmodalcontent.innerHTML = '';
  w3.show('#convertmodal');
  
  for (let i = 0; i < convertvideos.length; i++) {

    let videoDir = path.dirname(convertvideos[i].path);
    let fileNameOnly = convertvideos[i].name.slice(0, -4);

    let input = convertvideos[i].path;
    let output = path.join(videoDir, fileNameOnly + '.mp4');

    let fileconvertbox = `
    <div id="convertbox-` + i + `" class="w3-panel w3-round w3-dark-grey fileconvertbox">
      <p>` + input + `</p>
      <div class="progressholder w3-light-grey w3-round-xlarge">
        <div id="cprs-` + i + `" class="progress w3-round-xlarge w3-center" style="width:0%;"></div>
      </div>
      <p>` + output + `</p>
    </div>`;
    convertmodalcontent.innerHTML += fileconvertbox;
    
    convertFilesPromises.push(convert2MP4(i, input, output));
  }

  Promise.all(convertFilesPromises)
  .then( (results) => {
    console.log('All done: ' + results);
    w3.hide('#convertmodal');
  })
  .catch( (e) => {
    console.log('Convert error: ' + e);
  });

}

function convert2MP4(boxnum, input, output) {

  return new Promise ( (resolve, reject) => {
    
    ffmpeg(input)
    .inputOptions([
      '-threads 1'
    ])
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      reject(err.message);
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + input + ' - ' + progress.percent + '% done');
      document.getElementById('cprs-' + boxnum).style.width = Math.floor(progress.percent) + '%'
      document.getElementById('cprs-' + boxnum).style.backgroundColor = 'var(--apphighlight)'
      document.getElementById('cprs-' + boxnum).innerHTML = Math.floor(progress.percent) + '%'
    })
    .on('end', function() {
      console.log('Processing finished!');
      document.getElementById('convertbox-' + boxnum).outerHTML = '';
      
      let newid = playlist.getElementsByTagName('li').length;
      let newvideos = [];

      newid++;
      let outputfilename = path.basename(output);

      let newvideo = {
        _id: newid,
        _name: outputfilename,
        _path: output
      };
      newvideos.push(newvideo);

      playlistjs.addToPlaylist(newvideos);

      resolve(output);
    })
    .renice(-5)
    .save(output);

  });

}

function convert2AAC(b) {
  
  w3.hide('#aacconvertspan');

  let fileconvertboxes = playlist.getElementsByClassName('fileconvertbox').length;
  let boxnum = fileconvertboxes + 1;
  let input = document.getElementById("aacconvertspan").getAttribute("data");
  let videoDir = path.dirname(input);
  let fileName = path.basename(input);
  let fileNameOnly = fileName.slice(0, -4);
  let output = path.join(videoDir, fileNameOnly + '_aac.mkv');

  w3.show('#convertmodal');
  
  let fileconvertbox = `
  <div id="convertbox-` + boxnum + `" class="w3-panel w3-round w3-dark-grey fileconvertbox">
    <p>` + input + `</p>
    <div class="progressholder w3-light-grey w3-round-xlarge">
      <div id="cprs-` + boxnum + `" class="progress w3-round-xlarge w3-center" style="width:0%;"></div>
    </div>
    <p>` + output + `</p>
  </div>`;
  convertmodalcontent.innerHTML += fileconvertbox;
  
  return new Promise ( (resolve, reject) => {
    
    ffmpeg(input)
    .inputOptions([
      '-threads 1'
    ])
    .audioCodec('aac')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      reject(err.message);
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + input + ' - ' + progress.percent + '% done');
      document.getElementById('cprs-' + boxnum).style.width = Math.floor(progress.percent) + '%'
      document.getElementById('cprs-' + boxnum).innerHTML = Math.floor(progress.percent) + '%'
    })
    .on('end', function() {
      console.log('Processing finished!');
      document.getElementById('convertbox-' + boxnum).outerHTML = '';
      
      let newid = playlist.getElementsByTagName('li').length;
      let newvideos = [];

      newid++;
      let outputfilename = path.basename(output);

      let newvideo = {
        _id: newid,
        _name: outputfilename,
        _path: output
      };
      newvideos.push(newvideo);

      playlistjs.addToPlaylist(newvideos);

      w3.hide('#convertmodal');

      resolve(output);
    })
    .renice(-5)
    .save(output);

  });

}

function getAudioEncoding(mkvpath) {

  ffmpeg.ffprobe(mkvpath, function(err, metadata) {

    let streams = metadata.streams.length;

    for (let i = 0; i < streams; i++) {

      if (metadata.streams[i].codec_type === 'audio') {

        if (metadata.streams[i].codec_name === 'ac3') {
          console.log('Note: The ac3 codec is not supported in html5 videoplayers. :( Maybe later..')
          document.getElementById("aacconvertspan").setAttribute("data", mkvpath); 
          document.getElementById("aacconvertspan").setAttribute("onclick", "convert2AAC();");
          w3.show("#aacconvertspan");
          w3.show("#aacconvertspanclose");
          break;
        }

      }

    }

  });

}
