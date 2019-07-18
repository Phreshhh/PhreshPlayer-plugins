let loadedLanguage;
let storedLanguage = store.get('settings.language');;

let app = electron.app ? electron.app : electron.remote.app;

module.exports = i18n;

function i18n() {

  if (storedLanguage !== undefined && storedLanguage !== "") {

    loadedLanguage = JSON.parse(fse.readFileSync(path.join(__dirname, storedLanguage + '.json'), 'utf8'));

  } else {

    if(fse.existsSync(path.join(__dirname, app.getLocale() + '.json'))) {
      loadedLanguage = JSON.parse(fse.readFileSync(path.join(__dirname, app.getLocale() + '.json'), 'utf8'));
    }
    else {
      loadedLanguage = JSON.parse(fse.readFileSync(path.join(__dirname, 'en.json'), 'utf8'));
    }

  }


}

i18n.prototype.__ = function(phrase) {
	let translation = loadedLanguage[phrase];
  if(translation === undefined) {
    translation = phrase;
  }
	return translation;
}
