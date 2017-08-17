const electron = require('electron'),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow,
      path = require('path'),
      url = require('url'),
      os = require('os'),
      spawn = require('child_process').spawn,
      exec = require('child_process').exec,
      { Menu } = require('electron'),
      portscanner = require('portscanner'),
      osPlatform = os.platform(),
      fixPath = require('fix-path'),
      ipc = require('electron').ipcMain,
      fs = require('fs-extra'),
      mkdirp = require('mkdirp');


const appBasicInfo = {
  name: 'BarterDEX',
  version: '0.3.0-beta'
};

app.setName(appBasicInfo.name);
app.setVersion(appBasicInfo.version);

if (osPlatform === 'linux') {
  process.env.ELECTRON_RUN_AS_NODE = true;
  // console.log(process.env);
}


// kill rogue marketmaker copies on start
//if (appConfig.killIguanaOnStart) {
  let marketmakerGrep;

  switch (osPlatform) {
    case 'darwin':
      marketmakerGrep = "ps -p $(ps -A | grep -m1 marketmaker | awk '{print $1}') | grep -i marketmaker";
      break;
    case 'linux':
      marketmakerGrep = 'ps -p $(pidof marketmaker) | grep -i marketmaker';
      break;
    case 'win32':
      marketmakerGrep = 'tasklist';
      break;
  }
  
  exec(marketmakerGrep, function(error, stdout, stderr) {
    if (stdout.indexOf('marketmaker') > -1) {
      const pkillCmd = osPlatform === 'win32' ? 'taskkill /f /im marketmaker.exe' : 'pkill -15 marketmaker';

      console.log('found another marketmaker process(es)');

      exec(pkillCmd, function(error, stdout, stderr) {
        console.log(`${pkillCmd} is issued`);

        if (error !== null) {
          console.log(`${pkillCmd} exec error: ${error}`);
        };
      });
    }

    if (error !== null) {
      console.log(`${marketmakerGrep} exec error: ${error}`);
    };
  });
//}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 800})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gui/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
