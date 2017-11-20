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

const killmm = require('./killmm');

// SETTING OS DIR TO RUN MARKETMAKER FROM
// SETTING APP ICON FOR LINUX AND WINDOWS
if (os.platform() === 'darwin') {
  fixPath();
  var BarterDEXBin = path.join(__dirname, '../assets/bin/osx/marketmaker'),
      BarterDEXDir = `${process.env.HOME}/Library/Application Support/BarterDEX`;
}

if (os.platform() === 'linux') {
  var BarterDEXBin = path.join(__dirname, '../assets/bin/linux64/marketmaker'),
      BarterDEXDir = `${process.env.HOME}/.BarterDEX`;
}

if (os.platform() === 'win32') {
  var BarterDEXBin = path.join(__dirname, '../assets/bin/win64/marketmaker.exe');
      BarterDEXBin = path.normalize(BarterDEXBin);
      BarterDEXDir = `${process.env.APPDATA}/BarterDEX`;
      BarterDEXDir = path.normalize(BarterDEXDir);
      BarterDEXIcon = path.join(__dirname, '/assets/icons/barterdex/barterdex.ico');
}

// DEFAULT COINS LIST FOR MARKETMAKER
defaultCoinsListFile = path.join(__dirname, '../assets/coins.json');


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
                  console.log(BarterDEXBin);
                  console.log(BarterDEXDir);
                  //event.sender.send('shepherd-reply', 'Logged In');
                  event.returnValue = 'Logged In';
                  //const _passphrase = 'scatter quote stumble confirm extra jacket lens abuse gesture soda rebel seed nature achieve hurt shoot farm middle venture fault mesh crew upset cotton';
                  StartMarketMaker({"passphrase":arg.passphrase});
                  break;
            case 'logout':
                  killmm(true);
                  event.returnValue = 'Logged Out';
                  break;
            case 'mmstatus':
                  portscanner.checkPortStatus(7783, '127.0.0.1', function(error, status) {
                        console.log(status)
                        //event.sender.send('shepherd-reply', status);
                        event.returnValue = status;
                  })
                  break;
      }
})


StartMarketMaker = function(data) {
      //console.log(data.passphrase);
    try {
      // check if marketmaker instance is already running
      portscanner.checkPortStatus(7783, '127.0.0.1', function(error, status) {
        // Status is 'open' if currently in use or 'closed' if available
        if (status === 'closed') {
            const _coinsListFile = BarterDEXDir+'/coins.json'

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
          console.log(`port 7783 marketmaker is already in use`);
        }
      });
    } catch(e) {
      console.log(`failed to start marketmaker err: ${e}`);
    }
}

let mmid;
ExecMarketMaker = function(data) {
      //console.log(data);
      // start marketmaker via exec
      /*if (os.platform() === 'win32') {
        const _customParam = {
              'gui':'uglygui',
              'client':1,
              'userhome':`${process.env.APPDATA}`,
              'passphrase': data.passphrase,
              'coins': data.coinslist
        };
      }
      else {
        const _customParam = {
              'gui':'uglygui',
              'client':1,
              'userhome':`${process.env.HOME}`,
              'passphrase': data.passphrase,
              'coins': data.coinslist
        };
      }*/

      const _customParam = {
              'gui':'simplegui',
              'client':1,
              'profitmargin': 0.01,
              'userhome':`${process.env.HOME}`,
              'passphrase': data.passphrase,
              'coins': data.coinslist
        };

      //console.log(JSON.stringify(_customParam))
      //console.log(`exec ${BarterDEXBin} ${JSON.stringify(_customParam)}`);

      let params = _customParam;
      if (osPlatform !== 'win32') {
	    params = JSON.stringify(_customParam);
            params = `'${params}'`;
      } else {
            BarterDEXBin = '"'+BarterDEXBin+'"';
            params.userhome = process.env.APPDATA;
            if (!!params.coins) { // if not undefined and true
 		delete params.coins; // for Windows we should use coins.json file, and don't pass coins in command line
            }
            //console.log('[Decker] BarterDEXBin = '+BarterDEXBin+', BarterDEXDir = '+BarterDEXDir);
	    params = JSON.stringify(_customParam);
            params = params.replace(/"/g, '\\"');
            params = '"' + params +'"';

      }

      //console.log(`[Decker] exec ${BarterDEXBin} ${params}`);
      /*var out = fs.openSync(`${BarterDEXDir}/out.log`, 'a');
      var err = fs.openSync(`${BarterDEXDir}/out.log`, 'a');

      var cp = require('child_process');
      console.log(params);
      console.log(BarterDEXBin);
      var child = cp.spawn(BarterDEXBin, [params], { detached: true, stdio: [ 'ignore', out, err ] });
      child.unref();*/

      var logStream = fs.createWriteStream(`${BarterDEXDir}/logFile.log`, {flags: 'a'});

      console.log('mm start');
      console.log(`${BarterDEXBin} ${params}`)
      mmid = exec(`${BarterDEXBin} ${params}`, {
            cwd: BarterDEXDir,
            maxBuffer: 1024 * 50000 // 50 mb
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

      mmid.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
      }).pipe(logStream);

      mmid.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
      }).pipe(logStream);
}
