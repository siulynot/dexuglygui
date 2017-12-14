var CheckMM_Interval = null;
var CheckDefaultLogin_Interval = null;

$(document).ready(function() {
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	if (mypubkey !== '739860d6114f01f8bae9e1132945c4d4523a423d97c3573b84d4caf9cb8f0c78') {
		var loginstate = sessionStorage.getItem('mm_loginstate');
		if (loginstate == null || loginstate == 'default') {
			var shepherdresult = ShepherdIPC({"command":"login","passphrase":"default"});
			$('.mainbody').hide();
			$('.loginbody').hide();
			CheckMM_Interval = setInterval(CheckMMStatus,1000);
			$('.loadingbody').fadeIn();
		} else if (loginstate == 'loggedout') {
			$('.mainbody').hide();
			$('.loginbody').fadeIn();
			$('.loadingbody').fadeOut();
		}
	} else {
		$('.mainbody').hide();
		$('.loginbody').fadeIn();
		$('.loadingbody').fadeOut();
	}
});


// In renderer process (web page).
const {ipcRenderer} = require('electron')

const dICO_coin = 'MNZ';

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



$('.dexdashboard-btn').click(function(e){
	e.preventDefault();
	console.log('btn-exchangeclose clicked');
	console.log($(this).data());

	$('.navbar-right').children().removeClass('active');
	$('.dexdashboard-btn').parent().addClass( "active" );

	$('body').css('overflow', 'inherit');
	$('.dextradeshistory').hide();

	$('.dexdebug').hide();
	$('.dexdebug-btn').show();
	$('.dexlogout-btn').show();
	$('.dexdebug-close-btn').hide();
	$('.dextradeshistory-btn').show();

	//$('.screen-coindashboard').show()
	$('.screen-exchange').hide();
	$('.screen-inventory').hide();
	$('.screen-portfolio').show();
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);
	Refresh_active_StockChart(false);
	//check_coin_balance_Interval = setInterval(check_coin_balance(),3000);
	//check_coin_balance();

	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
});


$('.dextradeshistory-btn').click(function(e) {

	$('.screen-portfolio').hide();
	$('.screen-coindashboard').hide();
	$('.screen-exchange').hide();
	$('.dexdebug').hide();
	
	$('.dextradeshistory').show();
	$('.navbar-right').children().removeClass('active');
	$('.dextradeshistory-btn').parent().addClass( "active" );
	constructTradesHistory();

	CheckPortfolioFn(false);
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);

	check_coin_balance(false);
	Refresh_active_StockChart(false);
	
	/*if ($('.dextradeshistory').is(":visible")) {
		$('body').css('overflow', 'inherit');
		$('.dextradeshistory').hide();
		$('.dextradeshistory-btn').html('Trades history');
		$('.navbar-right').children().removeClass('active');
	} else {
		$('body').css('overflow', 'hidden');
		//$('.dextradeshistory-btn').html('Dashboard');
		$('.dextradeshistory').show();
		$('.navbar-right').children().removeClass('active');
		$('.dextradeshistory-btn').parent().addClass( "active" );
		constructTradesHistory();
	}*/
});

$('.dexlogout-btn').click(function(e) {
	e.preventDefault();
	//var shepherdresult = ShepherdIPC({"command":"logout"});
	$('.mainbody').fadeOut();
	$('.loginbody').fadeIn();

	LoginWithPassphrase('default','logout');

	CheckPortfolioFn(false);
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);

	check_coin_balance(false);
	Refresh_active_StockChart(false);
	//sessionStorage.clear();
});

$('.dexdebug-btn').click(function(e) {
	$('.navbar-right').children().removeClass('active');
	$('.dexdebug').show();
	//$('.dexlogout-btn').hide();
	//$('.dexdebug-close-btn').show();
	//$('.dexdebug-btn').hide();
	//$('.dextradeshistory-btn').hide();
	//$('.dexdashboard-btn').hide();
	//$('.dexsettings-btn').hide();

	$('.screen-portfolio').hide();
	$('.screen-coindashboard').hide();
	$('.screen-exchange').hide();

	$('.navbar-right').children().removeClass('active');
	$('.dexdebug-btn').parent().addClass( "active" );


	CheckPortfolioFn(false);
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);

	check_coin_balance(false);
	Refresh_active_StockChart(false);
});

$('.dexdebug-close-btn').click(function(e) {
	$('.dexdebug').hide();
	$('.dexdebug-btn').show();
	$('.dexlogout-btn').show();
	$('.dexdebug-close-btn').hide();
	$('.dextradeshistory-btn').show();
	$('.dexdashboard-btn').show();
	$('.dexsettings-btn').show();
	$('.navbar-right').children().removeClass('active');
});

$('.login-genpass-btn').click(function(e){
	e.preventDefault();

	var login_gen_pass = bootbox.dialog({
		backdrop: true,
		onEscape: true,
		message: `
<form>
  <div class="form-group">
    <label>New Passphrase</label>
    <div class="input-group">
      <input type="text" class="form-control btn_gen_pass_input1">
    <span class="input-group-btn">
	    <button class="btn btn-info btn_gen_pass_regenpass" type="button"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Regen</button>
	</span>
    </div>
  </div>
  <div class="form-group">
    <label>Verify Passphrase</label>
    <input type="text" class="form-control btn_gen_pass_input2" placeholder="Repat the passphrase here as shown in first input field">
  </div>
  <div class="form-group">
  	<div class="col-sm-12 input-group"><p>To generate a new passphrase click on "Regen" button.</p>
	<p>Make sure to save this new passphrase.<br> To confirm if you have saved it, please type in the passphrase in "Verify Passphrase" field.</p></div></div>
  </div>
</form>`,
		closeButton: false,
		size: 'large',

		buttons: {
			cancel: {
				label: "Close",
				className: 'btn-default',
				callback: function(){

				}
			},
			ok: {
				label: "Login with new passphrase",
				className: 'btn-primary btn_gen_pass_regenpass_login',
				callback: function(){
					var pass_input1 = $('.btn_gen_pass_input1').val();
					var pass_input2 = $('.btn_gen_pass_input2').val();
					console.log(pass_input1);
					//console.log(pass_input2);

					$('.loginPassphrase').val(pass_input2);
					$('.login-btn').trigger('click');
				}
			}
		}
	});
	login_gen_pass.init(function(){
		console.log('dialog opened.')
		$('.btn_gen_pass_regenpass_login').attr("disabled", "disabled");
		$('.btn_gen_pass_input1').val(PassPhraseGenerator.generatePassPhrase(128));

		$('.btn_gen_pass_regenpass').click(function(e){
			e.preventDefault();
			console.log('btn_gen_pass_regenpass clicked');
			$('.btn_gen_pass_input1').val(PassPhraseGenerator.generatePassPhrase(128));
		})

		$('.btn_gen_pass_input1').keyup(function() {

			var pass_input1 = $('.btn_gen_pass_input1').val();
			var pass_input2 = $('.btn_gen_pass_input2').val();
			//console.log(pass_input1);
			//console.log(pass_input2);

			if (pass_input1 !== pass_input2){
				$('.btn_gen_pass_regenpass_login').attr("disabled", "disabled");
			} else {
				$('.btn_gen_pass_regenpass_login').removeAttr("disabled");
			}

		});

		$('.btn_gen_pass_input2').keyup(function() {

			var pass_input1 = $('.btn_gen_pass_input1').val();
			var pass_input2 = $('.btn_gen_pass_input2').val();
			//console.log(pass_input1);
			//console.log(pass_input2);

			if (pass_input1 !== pass_input2){
				$('.btn_gen_pass_regenpass_login').attr("disabled", "disabled");
			} else {
				$('.btn_gen_pass_regenpass_login').removeAttr("disabled");
			}

		});


	});


});

$('.login-btn').click(function(e) {
	e.preventDefault();
	var passphrase = $('.loginPassphrase').val();
	LoginWithPassphrase(passphrase,'login');
	//var shepherdresult = ShepherdIPC({"command":"login","passphrase":passphrase});
	$('.loginPassphrase').val('');
	$('.mainbody').hide();
	$('.loginbody').hide();
	//CheckMM_Interval = setInterval(CheckMMStatus,1000);
	$('.loadingbody').fadeIn();

	var dexmode = $('.login_mode_options').selectpicker('val');
	if (dexmode == 'BarterDEX') {
		loginBarterdEX();
	}
	if (dexmode == 'dICO') {
		logindICO(dICO_coin);
	}

	BarterDEXSettingsFn();
});


$('.dexsettings-btn').click(function(e){
	e.preventDefault();

	var barterDEX_settings = ShepherdIPC({"command":"read_settings"});

	var dex_settings_bootbox = bootbox.dialog({
		backdrop: true,
		onEscape: true,
		message: `
			<div class="form-group">
				<span style="float: left; font-size: 18px;">Enable Experimental Features?</span>
			</div>
			<div class="btn-group btn-group-justified colors" data-toggle="buttons">
				<label class="btn btn-info label_experimental_features_enable">
				<input type="radio" name="experimental_features" id="experimental_features_enable" value="enable" autocomplete="off">YES</label>
				<label class="btn btn-info label_trading_pair_options_disable active">
				<input type="radio" name="experimental_features" id="trading_pair_options_disable" value="disable" autocomplete="off" checked>NO</label>
			</div>

			<div class="form-group col-sm-3" style="margin-top: 10px; padding: 0;">
				<span style="float: left; font-size: 18px;">Default Theme:</span>
			</div>
			<div class="input-group col-sm-2" style="margin: 10px 0;">
				<select class="selectpicker settings_theme_select" data-hide-disabled="true" data-width="30%">
					<option data-content="Dark Theme" data-tokens="Dark Theme">dark</option>
					<option data-content="Light Theme" data-tokens="Light Theme">light</option>
				</select>
			</div>`,
		closeButton: false,
		size: 'large',

		buttons: {
			cancel: {
				label: "Close",
				className: 'btn-default',
				callback: function(){
				}
			},
			reset: {
				label: "Reset Settings",
				className: 'btn-warning btn_dex_reset_settings',
				callback: function(){
					ShepherdIPC({"command":"reset_settings"});
					$('#trading_mode_options_trademanual').trigger('click');
					setTimeout(function(){ BarterDEXSettingsFn(); }, 1000);
				}
			},
			ok: {
				label: "Save Settings",
				className: 'btn-primary btn_dex_save_settings',
				callback: function(){
					var experimental_features = $('input[name=experimental_features]:checked').val();
					var selected_theme = $('.settings_theme_select').selectpicker('val');
					barterDEX_settings.theme = selected_theme;
					
					console.log(experimental_features);
					if (experimental_features == 'enable') {
						barterDEX_settings.experimentalFeatures = true;
					}
					if (experimental_features == 'disable') {
						barterDEX_settings.experimentalFeatures = false;
						$('#trading_mode_options_trademanual').trigger('click');
					}

					console.log(barterDEX_settings);
					ShepherdIPC({"command":"update_settings", "data":barterDEX_settings});
					BarterDEXSettingsFn();
					toastr.info('Settings update processed.', 'BarterDEX Settings');
				}
			}
		}
	});
	dex_settings_bootbox.init(function(){
		$('.settings_theme_select').selectpicker('render');
		console.log('settings dialog opened.');
		//var barterDEX_settings = ShepherdIPC({"command":"read_settings"});
		console.log(barterDEX_settings);
		if (barterDEX_settings.experimentalFeatures == false) {
			$('.label_experimental_features_enable').removeClass('active');
			$('.label_trading_pair_options_disable').addClass(' active');
			$('#experimental_features_enable').removeAttr('checked');
			$('#trading_pair_options_disable').attr('checked','checked');
		} else {
			$('.label_experimental_features_enable').addClass(' active');
			$('.label_trading_pair_options_disable').removeClass('active');
			$('#experimental_features_enable').attr('checked','checked');
			$('#trading_pair_options_disable').removeAttr('checked');
		}
		if (barterDEX_settings.theme == 'dark') {
			$('.settings_theme_select').selectpicker('val', 'dark');
		}
		if (barterDEX_settings.theme == 'light') {
			$('.settings_theme_select').selectpicker('val', 'light');
		}
	});
});

function loginBarterdEX(){
	$('.navbar-brandname').html('BarterDEX');
	$('.screen-portfolio').show();
	$('.screen-coindashboard').hide();
	$('.screen-exchange').hide();
	$('.btn-exchangeclose').show();
	$('.trading_method_options').show();
	$('.trading_buysell_options').show();
	$('.dexdashboard-btn').show();

	$('#trading_mode_options_trademanual').trigger('click');
	$('#trading_mode_options_tradebot').removeAttr("checked");
	$('#trading_mode_options_trademanual').attr('checked','checked');
}

function logindICO(coin){
	console.log('LOGIN TO dICO OPTION SEELCTED.')
	console.log('COIN SELECTED: ' + coin)
	$('.mainbody').hide();
	$('.loginbody').hide();
	$('.btn-exchangeclose').hide();
	$('.trading_method_options').hide();
	$('.trading_buysell_options').hide();
	$('.dexdashboard-btn').hide();

	$('.navbar-brandname').html(return_coin_name(coin) + ' dICO');
	sessionStorage.setItem('mm_dexmode', 'dICO');
	sessionStorage.setItem('mm_selected_dICO_coin', coin);

	selected_coin = {}
	selected_coin.coin = coin;
	selected_coin.coin_name = return_coin_name(coin);;
	console.log(selected_coin);
	sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));

	$('.screen-portfolio').hide();
	$('.screen-coindashboard').hide()
	$('.screen-exchange').show();
	$('.coin_ticker').html(coin);
	$.each($('.coinexchange[data-coin]'), function(index, value) {
		$('.coinexchange[data-coin]').data('coin', coin);
	});

	CheckPortfolioFn(false);
	CheckOrderBookFn();
	CheckOrderbook_Interval = setInterval(CheckOrderBookFn,30000);
	check_swap_status_Interval = setInterval(check_swap_status,20000);
	check_swap_status();
	check_bot_list_Interval = setInterval(check_bot_list, 10000);
	check_bot_list();
	check_my_prices_Interval = setInterval(check_my_prices, 60000);
	check_my_prices();
	bot_screen_coin_balance_Interval = setInterval(bot_screen_coin_balance, 30000);
	bot_screen_coin_balance();
	bot_screen_sellcoin_balance_Interval = setInterval(bot_screen_sellcoin_balance, 30000);
	bot_screen_sellcoin_balance();
	Refresh_active_StockChart_Interval = setInterval(Refresh_active_StockChart, 60000);
	Refresh_active_StockChart();

	$('#trading_mode_options_trademanual').trigger('click');
	$('#trading_mode_options_tradebot').removeAttr("checked");
	$('#trading_mode_options_trademanual').attr('checked','checked');
	$('.trading_method_options').hide();
	$('.trading_buysell_options').hide();
	$('.trading_pair_coin_autoprice_mode_span').hide();
	$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
	$('#trading_pair_coin_price_max_min').html('Max');

	var charts_instruments_data = {}
	charts_instruments_data.symbol = coin+'/KMD'
	charts_instruments_data.company = 'Komodo Platform';
	ChartsInstruments(charts_instruments_data)
	UpdateDexChart(coin, 'KMD');
}

CheckMMStatus = function(sig) {
	if (sig == false) {
		clearInterval(CheckMM_Interval);
	} else {
		console.log('Checking MarketMaker Status');
	}

	var mmstatus = ShepherdIPC({"command":"mmstatus"});

	if (mmstatus !== 'closed') {
		console.log(mmstatus);
		clearInterval(CheckMM_Interval);
		CheckDefaultLogin_Interval = setInterval(CheckDefaultLogin,1000);
	} else {
		$('.mainbody').hide();
		$('.loginbody').hide();
		$('.loadingbody').fadeIn();
	}
	
	/*if (mmstatus !== 'closed') {
		var userpass = sessionStorage.getItem('mm_userpass');
		var mypubkey = sessionStorage.getItem('mm_mypubkey');
		console.log('mypubkey: '+mypubkey);
		console.log('userpass: '+userpass);
		if (mypubkey == '739860d6114f01f8bae9e1132945c4d4523a423d97c3573b84d4caf9cb8f0c78') {
			$('.mainbody').hide();
			$('.loadingbody').fadeOut();
			$('.loginbody').fadeIn();
			clearInterval(CheckPortfolio_Interval);
		} else {
			$('.mainbody').fadeIn();
			$('.loginbody').fadeOut();
			$('.loadingbody').hide();
			console.log(mypubkey);
			
		}
		CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
		CheckPortfolioFn();
		clearInterval(CheckMM_Interval);
	} else {
		$('.mainbody').hide();
		$('.loginbody').hide();
		$('.loadingbody').fadeIn();
	}*/
}


CheckDefaultLogin = function(sig) {
	if (sig == false) {
		clearInterval(CheckDefaultLogin_Interval);
	} else {
		console.log("Checking if it's default login");
	}

	var userpass = '1d8b27b21efabcd96571cd56f91a40fb9aa4cc623d273c63bf9223dc6f8cd81f';
	var ajax_data = {"userpass":userpass,"method":"enable","coin":""};
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		//console.log(data);

		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);
			sessionStorage.setItem('mm_loginstate', 'default');
			sessionStorage.removeItem('mm_usercoins');
			sessionStorage.removeItem('mm_selectedcoin');

			if (data.mypubkey == '739860d6114f01f8bae9e1132945c4d4523a423d97c3573b84d4caf9cb8f0c78') {
				$('.mainbody').hide();
				$('.loadingbody').fadeOut();
				$('.loginbody').fadeIn();
				clearInterval(CheckDefaultLogin_Interval);
			}
			//return
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


LoginWithPassphrase = function(login_passphrase,action_mode) {
	console.log('Login using passphrase from Login form input');

	var userpass = '1d8b27b21efabcd96571cd56f91a40fb9aa4cc623d273c63bf9223dc6f8cd81f';
	var ajax_data = {"userpass":userpass,"method":"passphrase","passphrase":login_passphrase,"gui":"simplegui"};
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);

		sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
		sessionStorage.setItem('mm_userpass', data.userpass);
		sessionStorage.setItem('mm_mypubkey', data.mypubkey);

		if (action_mode == 'login') {
			sessionStorage.setItem('mm_loginstate', 'loggedin');
			$('.mainbody').fadeIn();
			$('.loginbody').fadeOut();
			$('.loadingbody').hide();

			CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
			CheckPortfolioFn();
		}

		if (action_mode == 'logout') {
			sessionStorage.setItem('mm_loginstate', 'loggedout');
			sessionStorage.removeItem('mm_usercoins');
			sessionStorage.removeItem('mm_selectedcoin');
			$('.mainbody').fadeOut();
			$('.loginbody').fadeIn();
			$('.loadingbody').hide();
		}


	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}



function BarterDEXSettingsFn() {
	var barterDEX_settings = ShepherdIPC({"command":"read_settings"});
	console.log(barterDEX_settings);
	if (barterDEX_settings.experimentalFeatures == false) {
		$('.btn-autogoalall').hide();
		$('.trading_method_options').hide();
		$('#portfolio_chart_current').addClass(' col-sm-offset-3');
		$('#portfolio_chart_target').hide();
	} else {
		$('.btn-autogoalall').show();
		$('.trading_method_options').show();
		$('#portfolio_chart_current').removeClass('col-sm-offset-3');
		$('#portfolio_chart_target').show();
	}

	if (barterDEX_settings.theme == 'dark') {
		$('#dark_css_style').prop('disabled', false);
	}
	if (barterDEX_settings.theme == 'light') {
		$('#dark_css_style').prop('disabled', true);
	}
};


