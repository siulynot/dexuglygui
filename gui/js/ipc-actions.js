
// In renderer process (web page).
const {ipcRenderer} = require('electron')

ShepherdIPCTest = function(data) {
	ipcRenderer.on('shepherd-reply', (event, arg) => {
		console.log(arg) // prints "pong"
	})
	ipcRenderer.send('shepherd-command', data)
}