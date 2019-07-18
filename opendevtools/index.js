module.exports = {
  toggleDevTools
};

function toggleDevTools() {
  let DevIsOpened = currentWindow.webContents.isDevToolsOpened()
  if (DevIsOpened) {
    currentWindow.webContents.closeDevTools();
    w3.removeClass('#devtools','activated');
  } else {
    currentWindow.webContents.openDevTools();
    w3.addClass('#devtools','activated');
  }
}

let devtoolsPluginInfoIcon = `
<a id="devtools" class="w3-left clickable" onclick="opendevtoolsjs.toggleDevTools();">
  <i class="fa fa-terminal w3-tooltip" aria-hidden="true">
    <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom"> DevTools </span>
  </i>
</a>`;

controlsSubRow.innerHTML += devtoolsPluginInfoIcon;
