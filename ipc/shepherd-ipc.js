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
      numCPUs = require('os').cpus().length;
      //ipc = require('electron').ipcMain;

Promise = require('bluebird');

var ps = require('ps-node'),
      shepherd = '',
      assetChainPorts = require('./ports.js');


// SETTING OS DIR TO RUN MARKETMAKER FROM
// SETTING APP ICON FOR LINUX AND WINDOWS
if (os.platform() === 'darwin') {
  fixPath();
  var marketmakerBin = path.join(__dirname, '../assets/bin/osx/marketmaker'),
      marketmakerDir = `${process.env.HOME}/Library/Application Support/marketmaker`;
}

if (os.platform() === 'linux') {
  var marketmakerBin = path.join(__dirname, '../assets/bin/linux64/marketmaker'),
      marketmakerDir = `${process.env.HOME}/.marketmaker`;
}

if (os.platform() === 'win32') {
  var marketmakerBin = path.join(__dirname, '../assets/bin/win64/marketmaker.exe');
      marketmakerBin = path.normalize(marketmakerBin);
      marketmakerDir = `${process.env.APPDATA}/marketmaker`;
      marketmakerDir = path.normalize(marketmakerDir);
      marketmakerIcon = path.join(__dirname, '/assets/icons/agama_icons/agama_app_icon.ico');
}

// DEFAULT COINS LIST FOR MARKETMAKER
defaultCoinsListFile = path.join(__dirname, '../assets/coinslist.json');


const {ipcMain} = require('electron');
/*ipcMain.on('shepherd-commandSync', (event, arg) => {
  console.log(arg.command)  // prints "ping"
  event.returnValue = 'pong'
})*/

ipcMain.on('shepherd-command', (event, arg) => {
      console.log(arg)  // prints "ping"
      switch (arg.command) {
            case 'ping':
                  //event.sender.send('shepherd-reply', 'pong');
                  event.returnValue = 'pong'
                  break;
            case 'login':
                  console.log(marketmakerBin);
                  console.log(marketmakerDir);
                  //event.sender.send('shepherd-reply', 'Logged In');
                  event.returnValue = 'Logged In';
                  //const _passphrase = 'scatter quote stumble confirm extra jacket lens abuse gesture soda rebel seed nature achieve hurt shoot farm middle venture fault mesh crew upset cotton';
                  StartMarketMaker({"passphrase":arg.passphrase});
                  break;
            case 'logout':
                  killMarketmaker(true);
                  event.returnValue = 'Logged Out';
                  break;
            case 'mmstatus':
                  portscanner.checkPortStatus(7779, '127.0.0.1', function(error, status) {
                        console.log(status)
                        //event.sender.send('shepherd-reply', status);
                        event.returnValue = status;
                  })
                  break;
      }
})


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


StartMarketMaker = function(data) {
      //console.log(data.passphrase);
    try {
      // check if marketmaker instance is already running
      portscanner.checkPortStatus(7779, '127.0.0.1', function(error, status) {
        // Status is 'open' if currently in use or 'closed' if available
        if (status === 'closed') {
            const _coinsListFile = marketmakerDir+'/coinslist.json'
            
            fs.pathExists(_coinsListFile, (err, exists) => {
                  if (exists === true) {
                        console.log('file exist');
                        data.coinslist = fs.readJsonSync(_coinsListFile, { throws: false });
                        ExecMarketMaker(data);
                  } else if (exists === false) {
                        console.log('file doesn\'t exist');
                        fs.copy(defaultCoinsListFile, _coinsListFile)
                        .then(() => {
                              console.log('file copied!')
                              data.coinslist = fs.readJsonSync(_coinsListFile, { throws: false });
                              ExecMarketMaker(data);
                        })
                        .catch(err => {
                              console.error(err)
                        })
                  }
                  if (err) {
                        console.log(err) // => null
                  }
            })
        } else {
          console.log(`port ${_port} marketmaker is already in use`);
        }
      });
    } catch(e) {
      console.log(`failed to start marketmaker err: ${e}`);
    }
}


ExecMarketMaker = function(data) {
      //console.log(data);
      // start marketmaker via exec
      const _customParam = {
            'gui':'uglygui',
            'client':1,
            'userhome':`${process.env.HOME}`,
            'passphrase': data.passphrase,
            'coins': data.coinslist
      };

      //console.log(JSON.stringify(_customParam))

      //console.log(`exec ${marketmakerBin} ${JSON.stringify(_customParam)}`);

      exec(`${marketmakerBin} '${JSON.stringify(_customParam)}'`, {
            cwd: marketmakerDir,
            maxBuffer: 1024 * 10000 // 10 mb
            }, function(error, stdout, stderr) {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

            if (error !== null) {
              console.log(`exec error: ${error}`);

              /*if (error.toString().indexOf('using -reindex') > -1) {
                cache.io.emit('service', {
                  'komodod': {
                    'error': 'run'
                  }
                });
              }*/
            }
      });
}






