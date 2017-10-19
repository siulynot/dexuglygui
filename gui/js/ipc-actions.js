var CheckMM_Interval = null;

// In renderer process (web page).
const {ipcRenderer} = require('electron')

ShepherdIPC = function(data) {
	/*ipcRenderer.on('shepherd-reply', (event, arg) => {
		console.log(arg) // prints "pong"
	})
	ipcRenderer.sendSync('shepherd-command', data)*/
	
	// USING SYNCHRONOUS METHOD TO SEND AND RECIVE IPC COMMANDS/REPLIES
	//console.log(ipcRenderer.sendSync('shepherd-commandSync', 'ping')) // prints "pong"
	let shepherdreply = ipcRenderer.sendSync('shepherd-command', data);
	//console.log(shepherdreply);
	return shepherdreply;
}


$('.dexlogout-btn').click(function(e) {
	e.preventDefault();
	var shepherdresult = ShepherdIPC({"command":"logout"});
	$('.mainbody').fadeOut();
	$('.loginbody').fadeIn();
	//CheckOrderBookFn(false);
	//CheckPortfolioFn(false);
	check_coin_balance(false);
	sessionStorage.clear();
});

$('.login-btn').click(function(e) {
	e.preventDefault();
	var passphrase = $('.loginPassphrase').val();
	var shepherdresult = ShepherdIPC({"command":"login","passphrase":passphrase});
	$('.loginPassphrase').val('');
	$('.mainbody').hide();
	$('.loginbody').hide();
	CheckMM_Interval = setInterval(CheckMMStatus,1000);
	$('.loadingbody').fadeIn();
});

CheckMMStatus = function(sig) {
	if (sig == false) {
		clearInterval(CheckMM_Interval);
	} else {
		console.log('Checking MarketMaker Status');
	}

	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').fadeIn();
		$('.loginbody').fadeOut();
		$('.loadingbody').hide();
		/*var refresh_data = {"coin":" ", "status": "enable"};
		enable_disable_coin(refresh_data);
		get_myprices();
		CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);*/
		check_coin_balance_Interval = setInterval(check_coin_balance,3000);
		clearInterval(CheckMM_Interval);
	} else {
		$('.mainbody').fadeOut();
		$('.loginbody').fadeout();
		$('.loadingbody').fadeIn();
	}
}