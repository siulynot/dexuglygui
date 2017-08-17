const electron = require('electron'),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow,
      path = require('path'),
      url = require('url'),
      os = require('os'),
      osPlatform = os.platform(),
      fsnode = require('fs'),
      fs = require('fs-extra'),
      mkdirp = require('mkdirp'),
      exec = require('child_process').exec,
      spawn = require('child_process').spawn,
      portscanner = require('portscanner'),
      fixPath = require('fix-path'),
      numCPUs = require('os').cpus().length,
      ipc = require('electron').ipcMain;

Promise = require('bluebird');

var ps = require('ps-node'),
      shepherd = '',
      assetChainPorts = require('./ports.js');



// kill rogue marketmaker copies on start
killMarketmaker = function(data) {
      if (data == true) {
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
      }
}