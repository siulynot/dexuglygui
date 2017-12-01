/*** Simple GUI JS ***/

var CheckOrderbook_Interval = null;
var CheckPortfolio_Interval = null;
var check_coin_balance_Interval = null;
var check_swap_status_Interval = null;
var check_my_prices_Interval = null;
var check_bot_list_Interval = null;
var bot_screen_coin_balance_Interval = null;
var bot_screen_sellcoin_balance_Interval = null;
var shell = require('electron').shell;

$(document).ready(function() {
	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').show();
		$('.loginbody').hide();
		CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
		CheckPortfolioFn();

		//check_coin_balance_Interval = setInterval(check_coin_balance,3000);
		//check_coin_balance();

//---- dICO App Settings START ----//
		//CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
		//CheckPortfolioFn();

		var dexmode = sessionStorage.getItem('mm_dexmode');
		var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');

		if (dexmode == 'BarterDEX') {
			$('.navbar-brandname').html('BarterDEX');
			$('#trading_mode_options_trademanual').trigger('click');
			$('#trading_mode_options_tradebot').removeAttr("checked");
			$('#trading_mode_options_trademanual').attr('checked','checked');
			$('.trading_pair_coin_autoprice_mode_span').hide();
			$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
			$('#trading_pair_coin_price_max_min').html('Max');
		}
		if (dexmode == 'dICO') {
			$('.navbar-brandname').html(return_coin_name(selected_dICO_coin) + ' dICO');
			selected_coin = {}
			selected_coin.coin = selected_dICO_coin;
			selected_coin.coin_name = return_coin_name(selected_dICO_coin);
			console.log(selected_coin);
			sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));

			$('.dexdashboard-btn').hide();
			$('.screen-portfolio').hide();
			$('.screen-coindashboard').hide()
			$('.screen-exchange').show();
			$('.coin_ticker').html(selected_dICO_coin);
			$.each($('.coinexchange[data-coin]'), function(index, value) {
				$('.coinexchange[data-coin]').data('coin', selected_dICO_coin);
			});

			check_coin_balance(false);
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
			get_coin_info(selected_dICO_coin);

			//Enableing Manual Trade by auto clicking Manual trade option via JS code.
			$('#trading_mode_options_trademanual').trigger('click');
			$('#trading_mode_options_tradebot').removeAttr("checked");
			$('#trading_mode_options_trademanual').attr('checked','checked');
			$('.trading_method_options').hide();
			$('.trading_buysell_options').hide();
			$('.trading_pair_coin_autoprice_mode_span').hide();
			$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
			$('#trading_pair_coin_price_max_min').html('Max');

			var charts_instruments_data = {}
			charts_instruments_data.symbol = selected_dICO_coin+'/KMD'
			charts_instruments_data.company = 'Komodo Platform';
			ChartsInstruments(charts_instruments_data)
			UpdateDexChart(selected_dICO_coin, 'KMD');
		}

//---- dICO App Settings END ----//

		//$('.trading_selected_trader_label').hide();
		//$('.trading_selected_trader').hide();
		$('.relvol_basevol_coin').html($('.trading_pair_coin').selectpicker('val'));

	} else {
		$('.mainbody').hide();
		$('.loginbody').show();
	}
	//$('.set_goal_label_portfolio').html($('.sell_coin_p').selectpicker('val'));
});


$('.porfolio_coins_list tbody').on('click', '.btn_portfolio_coingoal', function() {
	console.log('portfolio set goal button clicked')
	console.log($(this).data());
	console.log($(this).data('coin'));
	var coin = $(this).data('coin');

	var set_coingoal_bootbox = bootbox.dialog({
		backdrop: true,
		onEscape: true,
		message: `<div class="form-group coingoal_label_div" style="margin-top: 15px; margin-bottom: 0px;">
                      <span style="font-size: 18px;">Set `+$(this).data('coin')+` Goal percentage for your portfolio</span>
                    </div>
                    <div class="input-group col-sm-12 coingoal_div">
                      <span class="input-group-addon coin_ticker" style="font-size: 20px;">`+$(this).data('coin')+`</span>
                      <input type="number" class="form-control coingoal_percentage_bootbox" placeholder="e.g. 12.5" style="height: 64px; font-size: 20px;">
                    </div>`,
		closeButton: true,
		size: 'medium',

		buttons: {
			cancel: {
				label: "Close",
				className: 'btn-default',
				callback: function(){
				}
			},
			ok: {
				label: "Set Goal",
				className: 'btn-primary btn_set_coin_goal_bootbox',
				callback: function(){
					var goal_data = {}
					goal_data.coin = coin;
					goal_data.auto = false;
					goal_data.percent = $('.coingoal_percentage_bootbox').val();

					console.log(goal_data);
					set_coin_goal(goal_data);
				}
			}
		}
	});
	set_coingoal_bootbox.init(function(){
		console.log('set_coingoal_bootbox dialog opened.')
	});


});


$('.porfolio_coins_list tbody').on('click', '.btn-portfoliogo', function() {
	console.log('portfolio coin button clicked')
	console.log($(this).data());
	console.log($(this).data('coin'));
	$('.screen-portfolio').hide();
	$('#trading_mode_options_trademanual').trigger('click');
	$('#trading_mode_options_tradebot').removeAttr("checked");
	$('#trading_mode_options_trademanual').attr('checked','checked');
	$('#trading_pair_options_buying').trigger('click');
	$('#trading_pair_options_selling').removeAttr("checked");
	$('#trading_pair_options_buying').attr('checked','checked');
	$('.trading_pair_coin').selectpicker('val', 'KMD');
	$('.relvol_basevol_coin').html('KMD');
	$('.trading_pair_coin_price').val('');
	$('.trading_pair_destpubkey').val('');
	$('.trading_pair_coin_volume').val('');
	$('.relvol_basevol').html('');
	$('.navbar-right').children().removeClass('active');
	$('.trading_pair_coin_autoprice_mode_span').hide();
	$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
	$('#trading_pair_coin_price_max_min').html('Max');

	$('.trading_sellcoin_ticker_name').empty();
	$('.trading_sellcoin_balance').empty();

	$('.trading_coin_ticker_name').empty();
	$('.trading_coin_balance').empty();
	$('#balance-spinner').show();

	coin = $(this).data('coin');

	if (coin == 'KMD') {
		$('.trading_pair_coin').selectpicker('val', 'BTC');
		$('.relvol_basevol_coin').html('BTC');
	}

	selected_coin = {}
	selected_coin.coin = $(this).data('coin');
	selected_coin.coin_name = $(this).data('coinname');
	selected_coin.addr = $(this).data('addr');
	selected_coin.balance = $(this).data('balance');
	console.log(selected_coin);
	sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));

	//check_coin_balance_Interval = setInterval(check_coin_balance($(this).data()),3000);

	$('.screen-portfolio').hide();
	$('.screen-coindashboard').hide()
	$('.screen-exchange').show();
	$('.coin_ticker').html(coin);
	$.each($('.coinexchange[data-coin]'), function(index, value) {
		$('.coinexchange[data-coin]').data('coin', coin);
	});
	$('.coingoal_label_coin_name').html(return_coin_name(coin) + ' ('+coin+')');

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

	getZeroConfDepositHistory();

	var charts_instruments_data = {}
	charts_instruments_data.symbol = $(this).data('coin')+'/KMD'
	charts_instruments_data.company = 'Komodo Platform';
	ChartsInstruments(charts_instruments_data)
	UpdateDexChart($(this).data('coin'), 'KMD');
});


$('.btn-activatecoins').click(function(e){
	e.preventDefault();
	console.log('btn-activatecoins clicked');
	console.log($(this).data());

	addcoins_dialog();

	//$('.screen-portfolio').hide();
	//$('.screen-addcoins').show();

	//CheckPortfolioFn(false);
	//get_coins_list();



})

/*$('.btn-addcoinsclose').click(function(e){
	e.preventDefault();
	console.log('btn-addcoinsclose clicked');
	console.log($(this).data());

	$('.screen-portfolio').show();
	$('.screen-addcoins').hide();

	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
});

$('.btn-addcoinsrefresh').click(function(e){
	e.preventDefault();
	console.log('btn-addcoinsrefresh clicked');
	console.log($(this).data());

	get_coins_list()
});*/

$('.addcoins_tbl tbody').on('click', '.addcoins_tbl_disable_btn', function() {
	console.log('Disable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "disable"};
	//enable_disable_coin(refresh_data)
	//$('.selectpicker option').filter(function () { return $(this).html() == $(this).data('coin'); }).attr("disabled","disabled");
	//$('.selectpicker').selectpicker('refresh');


});

$('.addcoins_tbl tbody').on('click', '.addcoins_tbl_enable_btn', function() {
	console.log('Enable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "enable"};
	//enable_disable_coin(refresh_data)
	//$('.selectpicker option').filter(function () { return $(this).html() == $(this).data('coin'); }).removeAttr('disabled');
	//$('.selectpicker').selectpicker('refresh');
});

$('#debug-exec').click(function(e) {
	var ajax_data = $('#debug-payload').val();
	var url = "http://127.0.0.1:7783";

	console.warn(ajax_data.indexOf('\\"'));

	$.ajax({
		async: true,
		data: ajax_data.indexOf('\\"') > -1 ? JSON.parse(ajax_data) : JSON.parse(JSON.stringify(ajax_data)),
		dataType: 'json',
		type: 'POST',
		url: url
	}).done(function(data) {
		console.warn('debug exec', data);
		$('#debug-payload-response').html(JSON.stringify(data, null, '\t'));
	});
});


$('.btn-inventoryclose').click(function(e) {
	e.preventDefault();
	console.log('btn-inventoryclose clicked');
	console.log($(this).data());
	$('.screen-exchange').show()
	$('.screen-inventory').hide();
	$('.dex_showinv_alice_tbl tbody').empty();
	$('.dex_showlist_unspents_tbl tbody').empty();
	$('.RawJSONInventory-output').empty();
	//$('.coin_ticker').html($(this).attr('data-coin'));
	//$.each($('.coinexchange[data-coin]'), function(index, value) {
		//$('.coinexchange[data-coin]').data('coin', $(this).attr('data-coin'));
	//});

	check_coin_balance(false);
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

	var dexmode = sessionStorage.getItem('mm_dexmode');
	var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
});

$('.btn-inventoryrefresh').click(function(e) {
	e.preventDefault();
	console.log('btn-inventoryrefresh clicked');
	console.log($(this).data());
	$('.dex_showinv_alice_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');
	$('.dex_showlist_unspents_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');

	check_coin_inventory($(this).data('coin'));
	check_coin_listunspent($(this).data());
});



$('.dex_showinv_alice_tbl tbody').on('click', '.btn_coiniventory_detail', function() {
	//console.log($(this).data());
	var index = $(this).data('index');
	var coininventory = sessionStorage.getItem('mm_coininventory');
	coininventory = JSON.parse(coininventory);
	console.log(coininventory.alice[index]);

	bootbox.dialog({
		onEscape: true,
		backdrop: true,
		message: `
			<table class="table table-striped">
				<tbody>
					<tr>
					<th rowspan="13" style="width: 30px;">` + index + `</th>
					<th>method</th>
					<th>` + coininventory.alice[index].method + `</th>
					</tr>
					<tr>
					<td>gui</td>
					<td>` + coininventory.alice[index].gui + `</td>
					</tr>
					<tr>
					<td>coin</td>
					<td>` + coininventory.alice[index].coin + `</td>
					</tr>
					<tr>
					<td>iambob</td>
					<td>` + coininventory.alice[index].iambob + `</td>
					</tr>
					<tr>
					<td>address</td>
					<td>` + coininventory.alice[index].address + `</td>
					</tr>
					<tr>
					<td>txid</td>
					<td>` + coininventory.alice[index].txid + `</td>
					</tr>
					<tr>
					<td>vout</td>
					<td>` + coininventory.alice[index].vout + `</td>
					</tr>
					<tr>
					<td>value</td>
					<td>` + (parseFloat(coininventory.alice[index].value)/100000000).toFixed(8) + ` ` + coininventory.alice[index].coin + `</td>
					</tr>
					<tr>
					<td>satoshis</td>
					<td>` + coininventory.alice[index].satoshis + `</td>
					</tr>
					<tr>
					<td>txid2</td>
					<td>` + coininventory.alice[index].txid2 + `</td>
					</tr>
					<tr>
					<td>vout2</td>
					<td>` + coininventory.alice[index].vout2 + `</td>
					</tr>
					<tr>
					<td>value2</td>
					<td>` + (parseFloat(coininventory.alice[index].value2)/100000000).toFixed(8) + ` ` + coininventory.alice[index].coin + `</td>
					</tr>
					<tr>
					<td>desthash</td>
					<td>` + coininventory.alice[index].desthash + `</td>
					</tr>
				</tbody>
			</table>`,
		closeButton: true,
		size: 'large'
	});
});



$('.btn-makeinventory').click(function(e) {
	e.preventDefault();
	console.log('btn-makeinventory clicked');
	//console.log($(this).data());

	utxo_input1 = $("#inventory_slider_input1").val();
	utxo_input2 = $("#inventory_slider_input2").val();
	utxo_input3 = $("#inventory_slider_input3").val();
	//console.log(utxo_input1);
	//console.log(utxo_input2);
	//console.log(utxo_input3);

	var slider_input1 = $('#inventory-slider1').val();
	var slider_input2 = $('#inventory-slider2').val();
	var slider_input3 = $('#inventory-slider3').val();
	//console.log(slider_input1);
	//console.log(slider_input2);
	//console.log(slider_input3);

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_addr = selected_coin.addr;
	console.log(coin_addr);

	var withdraw_outputs = []

	for(var i=0; i < slider_input1; i++){
		var tmp_json = {}
		tmp_json[coin_addr] = utxo_input1
		//console.log(tmp_json)
		withdraw_outputs.push(tmp_json)
	}
	for(var i=0; i < slider_input2; i++){
		var tmp_json = {}
		tmp_json[coin_addr] = utxo_input2
		withdraw_outputs.push(tmp_json)
	}
	for(var i=0; i < slider_input3; i++){
		var tmp_json = {}
		tmp_json[coin_addr] = utxo_input3
		withdraw_outputs.push(tmp_json)
	}
	//console.log(withdraw_outputs);

	inventory_data = {};
	inventory_data['coin'] = $(this).data('coin');
	inventory_data['outputs'] = withdraw_outputs;
	console.log(inventory_data);
	make_inventory_withdraw(inventory_data);

});



$('.btn_coindashboard_exchange').click(function(e) {
	e.preventDefault();
	console.log('btn_coindashboard_exchange clicked');
	console.log($(this).data());

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	console.log(selected_coin);
	var coin = selected_coin.coin;

	$('.screen-coindashboard').hide()
	$('.screen-exchange').show();
	$('.coin_ticker').html(coin);

	$.each($('.coinexchange[data-coin]'), function(index, value) {
		//$('.coinexchange[data-coin]').attr('data-coin', coin);
		$('.coinexchange[data-coin]').data('coin', coin);
	});

	/*$('.btn-exchangeclose').attr('data-coin', coin);
	$('.btn-exchangerefresh').attr('data-coin', coin);
	$('.btn-myordersrefresh').attr('data-coin', coin);
	$('.btn-botlistrefresh').attr('data-coin', coin);
	$('.btn-refreshtrading_pair').attr('data-coin', coin);*/
	check_coin_balance(false);
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
});

$('.btn-exchangeclose').click(function(e){
	e.preventDefault();
	console.log('btn-exchangeclose clicked');
	console.log($(this).data());

	//$('.screen-coindashboard').show()
	$('.screen-exchange').hide();
	$('.screen-portfolio').show();
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);
	//check_coin_balance_Interval = setInterval(check_coin_balance(),3000);
	//check_coin_balance();

	$('.porfolio_coins_list tbody').empty();
	var actiavte_portfolio_coins_list_spinner = ''
	actiavte_portfolio_coins_list_spinner += '<th colspan="7">';
      actiavte_portfolio_coins_list_spinner += '<div style="text-align: center; height: 100px;">';
        actiavte_portfolio_coins_list_spinner += '<svg id="portfolio-coins-spinner">';
          actiavte_portfolio_coins_list_spinner += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path2" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path3" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path4" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
        actiavte_portfolio_coins_list_spinner += '</svg>';
      actiavte_portfolio_coins_list_spinner += '</div>';
    actiavte_portfolio_coins_list_spinner += '</th>';
    $('.porfolio_coins_list tbody').append(actiavte_portfolio_coins_list_spinner);
	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
});


$('.btn-exchangerefresh').click(function(e){
	e.preventDefault();
	console.log('btn-exchangerefresh clicked');
	console.log($(this).data());

	CheckOrderBookFn();
});


$('.btn-myordersrefresh').click(function(e){
	e.preventDefault();
	console.log('btn-myordersrefresh clicked');
	console.log($(this).data());

	check_my_prices();
});

$('.btn-botlistrefresh').click(function(e){
	e.preventDefault();
	console.log('btn-botlistrefresh clicked');
	console.log($(this).data());

	check_bot_list();
});


$('.btn-bot_action').click(function(e){
	e.preventDefault();
	console.log('btn-botlistrefresh clicked');
	console.log($(this).data());
	console.log($(this).data('action'));
	console.log($('.btn-bot_action').attr('data-action'))
	console.log($(this).attr('data-action'))

	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();

	if (bot_or_manual == 'tradebot') {

		pair_price = $('.trading_pair_coin_price').val();

		base_volume = $('.trading_pair_coin_volume').val();

		pair_volume = pair_price * base_volume;

		$('.relvol_basevol').html(pair_volume.toFixed(8));

		bot_data = {}
		bot_data.price = pair_price;
		bot_data.volume = pair_volume;
		//bot_data.action = $(this).data('action');
		//bot_data.action = $('.btn-bot_action').attr('data-action');
		bot_data.action = $(this).attr('data-action');

		console.log(bot_data);

		if (pair_volume <= 0.01 || pair_price <= 0.01) {
			console.log('Order is too small. Please try again.');
			toastr.warning('Order is too small. Please try again with bigger order.', 'Order Notification')
		} else {
			//toastr.success('Placing Order', 'Order Notification');
		}

		//bot_buy_sell(bot_data);
		buy_sell_precheck(bot_data);

	} else if (bot_or_manual == 'trademanual') {

		pair_price = $('.trading_pair_coin_price').val();

		base_volume = $('.trading_pair_coin_volume').val();

		pair_volume = pair_price * base_volume;

		$('.relvol_basevol').html(pair_volume.toFixed(8));

		trader_only = $('.trading_pair_destpubkey_yesno').is(":checked");
		trader_pubkey = $('.trading_pair_destpubkey').val();

		trade_data = {}
		trade_data.price = pair_price;
		trade_data.volume = pair_volume;
		trade_data.trader_only = trader_only;
		trade_data.destpubkey = trader_pubkey;
		//trade_data.action = $(this).data('action');
		//trade_data.action = $('.btn-bot_action').attr('data-action');
		trade_data.action = $(this).attr('data-action');

		console.log(trade_data);

		if (pair_volume <= 0.01 || pair_price <= 0.01) {
			console.log('Order is too small. Please try again.');
			toastr.warning('Order is too small. Please try again with bigger order.', 'Order Notification')
		} else {
			//toastr.success('Placing Order', 'Order Notification');
		}

		//manual_buy_sell(trade_data)
		buy_sell_precheck(trade_data);

	} else if (bot_or_manual == 'tradeportfolio') {

		var margin_or_fixed = $('#trading_pair_coin_autoprice_mode').prop('checked');

		var trade_data = {}
		if (margin_or_fixed == true) {
			trade_data.mode = 'margin';
			trade_data.modeval = $('.trading_pair_coin_price').val() / 100;
			//trade_data.action = $(this).data('action');
			//trade_data.action = $('.btn-bot_action').attr('data-action');
			trade_data.action = $(this).attr('data-action');
		} else {
			trade_data.mode = 'fixed';
			trade_data.modeval = $('.trading_pair_coin_price').val();
			//trade_data.action = $(this).data('action');
			//trade_data.action = $('.btn-bot_action').attr('data-action');
			trade_data.action = $(this).attr('data-action');
		}

		console.log(trade_data);
		autoprice_buy_sell(trade_data);
	}
});

$('.trading_pair_coin_price').keyup(function(){
	pair_price = $('.trading_pair_coin_price').val();

	base_volume = $('.trading_pair_coin_volume').val();

	pair_volume = pair_price * base_volume;

	$('.relvol_basevol').html(pair_volume.toFixed(8));
});

$('.trading_pair_coin_volume').keyup(function(){
	pair_price = $('.trading_pair_coin_price').val();

	base_volume = $('.trading_pair_coin_volume').val();

	pair_volume = pair_price * base_volume;

	$('.relvol_basevol').html(pair_volume.toFixed(8));
});


$('.exchange_bot_list_tbl tbody').on('click', '.btn_bot_status', function() {
	console.log('bot status button clicked')
	console.log($(this).data());

	bot_status($(this).data());
});

$('.exchange_bot_list_tbl tbody').on('click', '.btn_bot_resume', function() {
	console.log('bot resume button clicked')
	console.log($(this).data());

	bot_stop_pause_resume($(this).data());
});

$('.exchange_bot_list_tbl tbody').on('click', '.btn_bot_pause', function() {
	console.log('bot pause button clicked')
	console.log($(this).data());

	bot_stop_pause_resume($(this).data());
});

$('.exchange_bot_list_tbl tbody').on('click', '.btn_bot_stop', function() {
	console.log('bot stop button clicked')
	console.log($(this).data());

	bot_stop_pause_resume($(this).data());
});

$('.btn-trading_coin_balance_refresh').click(function(e){
	e.preventDefault();
	console.log('btn-trading_coin_balance_refresh clicked');
	console.log($(this).data());

	bot_screen_sellcoin_balance();
	bot_screen_coin_balance();
})


function check_coin_balance(chk_coin_data) {
	console.log(chk_coin_data);
	if (chk_coin_data == false) {
		clearInterval(check_coin_balance_Interval);
		console.log('checking coin balance stopped.')
		return
	} else {
		console.log('checking coin balance');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	console.log(selected_coin);
	var coin = selected_coin.coin;
	console.log(coin);



	//if (((chk_coin_data == null) ? coin : chk_coin_data.coin) == 'BTC') {
	if (coin == 'BTC') {
		$('#coindashboard-toggle').bootstrapToggle('enable');
	} else {
		$('#coindashboard-toggle').bootstrapToggle('disable');
	}

	$('.coindashboard-title').empty();
	$('.coindashboard-coin').empty();
	$('.coindashboard-balance').empty();
	$('.coindashboard-address[data-coin="' + coin + '"]').empty();
	$(".coindashboard-coinicon").attr("src","img/cryptologo/" + coin.toLowerCase() + ".png");

	var coin_name = return_coin_name(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin": coin};
	var url = "http://127.0.0.1:7783";


	$.ajax({
		async: true,
		data: JSON.stringify(ajax_data),
		dataType: 'json',
		type: 'POST',
		url: url
	}).done(function(chk_coin_output_data) {
		// If successful
		//console.log(data);
		if (!chk_coin_output_data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(chk_coin_output_data.coins));
			sessionStorage.setItem('mm_userpass', chk_coin_output_data.userpass);
			sessionStorage.setItem('mm_mypubkey', chk_coin_output_data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		}

		if (!chk_coin_output_data.error === false && chk_coin_output_data.error == 'coin is disabled') {
			console.log(chk_coin_output_data.coin);
			console.log('coin '+ chk_coin_output_data.coin.coin + ' is disabled');
			$('.btn_coindashboard_send[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();
			$('.btn_coindashboard_receive[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();
			$('.btn_coindashboard_exchange[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();
			$('.btn_coindashboard_inventory[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();
			$('.btn_coindashboard_enable[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.btn_coindashboard_disable[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();

			$('.coindashboard-balance').html('Coin is disabled.<br>Please enable before trading ')
			$('.coindashboard-balance').css( "font-size", "35px" );

		} else {
			//console.log(data);
			console.log(chk_coin_output_data.coin);
			//console.log(chk_coin_output_data.coin.smartaddress);
			//console.log(val);

			$('.btn_coindashboard_send[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.btn_coindashboard_receive[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.btn_coindashboard_exchange[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.btn_coindashboard_inventory[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.btn_coindashboard_enable[data-coin="' + chk_coin_output_data.coin.coin + '"]').hide();
			$('.btn_coindashboard_disable[data-coin="' + chk_coin_output_data.coin.coin + '"]').show();
			$('.coindashboard-address[data-coin="' + chk_coin_output_data.coin.coin + '"]').html(chk_coin_output_data.coin.smartaddress);
			$('.coindashboard-title').html(coin_name + ' (' + chk_coin_output_data.coin.coin + ')');
			$('.coindashboard-coin').html(chk_coin_output_data.coin.coin);


			$('.coindashboard-balance').css( "font-size", "55px" );
			$('.coindashboard-balance').html(chk_coin_output_data.coin.balance);
			$('.coindashboard-height').html(chk_coin_output_data.coin.height);
			$('.coindashboard-kmdvalue').html(chk_coin_output_data.coin.KMDvalue);
			$('.btn_coindashboard_inventory[data-addr]').attr('data-addr', chk_coin_output_data.coin.smartaddress);
		}

		//if (chk_coin_output_data.error == 'coin is disabled') {
			//console.log('coin '+ val + ' is disabled');
		//}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});

}


function get_coin_info(coin) {

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin":coin};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(get_coin_info_output_data) {
	    // If successful
	   console.log(get_coin_info_output_data);
	   if (!get_coin_info_output_data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(get_coin_info_output_data.coins));
			sessionStorage.setItem('mm_userpass', get_coin_info_output_data.userpass);
			sessionStorage.setItem('mm_mypubkey', get_coin_info_output_data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		}

		if (!get_coin_info_output_data.error == true) {
			selected_coin = {}
			selected_coin.coin = coin;
			selected_coin.coin_name = return_coin_name(coin);
			selected_coin.addr = get_coin_info_output_data.coin.smartaddress;
			selected_coin.balance = get_coin_info_output_data.coin.balance;
			console.log(selected_coin);
			sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function get_coins() {
	//console.log(data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoins"};
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

		$.each(data, function(index, val) {
			//console.log(index);
			//console.log(val);
			if (val.status == 'active') {
				console.log(index);
				console.log(val);
			}
		});
	   if (!data.userpass === false) {
				console.log('first marketmaker api call execution after marketmaker started.')
				sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
				sessionStorage.setItem('mm_userpass', data.userpass);
				sessionStorage.setItem('mm_mypubkey', data.mypubkey);

				var dexmode = sessionStorage.getItem('mm_dexmode');
				var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			}
	   //toastr.success('Auto goal setup executed!', 'Portfolio Info')
	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

let electrumCoinsKeepAlive = {};

function enable_disable_coin(enable_disable_coin_data) {
	if (!enable_disable_coin_data.electrum) {
		if (electrumCoinsKeepAlive[enable_disable_coin_data.coin] &&
				enable_disable_coin_data.method === 'disable') {
			clearInterval(electrumCoinsKeepAlive[enable_disable_coin_data.coin]);
			delete electrumCoinsKeepAlive[enable_disable_coin_data.coin];
		} else {
			const _int = setInterval(() => {
				enable_disable_coin({
					method: 'enable',
					coin: enable_disable_coin_data.coin,
					electrum: false,
				});
			}, 3600 * 1000);

			electrumCoinsKeepAlive[enable_disable_coin_data.coin] = _int;
		}
	}

	console.warn('enable disable', enable_disable_coin_data);

	var electrum_option = enable_disable_coin_data.electrum //If 'false', electrum option selected
	var userpass = sessionStorage.getItem('mm_userpass');
	var url = "http://127.0.0.1:7783";

	if (enable_disable_coin_data.method === 'disable') {
		console.warn('disable coin called');
		var ajax_data = {"userpass":userpass,"method":"electrum","coin":enable_disable_coin_data.coin};

		$.ajax({
			async: true,
			data: JSON.stringify(ajax_data),
			dataType: 'json',
			type: 'POST',
			url: url
		}).done(function(disable_coin_output_data) {
			console.log('enable_disable_coin', 'electrum removed');
		});
	}

	if (electrum_option == false) {
		console.log(electrum_option);
		console.log("electrum selected for " + enable_disable_coin_data.coin);
		//var rand_electrum_srv = get_random_electrum_server(data.coin);
		$.each(electrum_servers_list[enable_disable_coin_data.coin], function(index,val){
			var ipaddr = _.keys(val);
			var return_data_ipaddr = ipaddr[0];
			var return_data_port = val[ipaddr[0]];
			console.log(return_data_ipaddr);
			console.log(return_data_port);

			var ajax_data = {"userpass":userpass,"method":"electrum","coin":enable_disable_coin_data.coin,"ipaddr":return_data_ipaddr,"port":return_data_port};

			$.ajax({
				async: true,
				data: JSON.stringify(ajax_data),
				dataType: 'json',
				type: 'POST',
				url: url
			}).done(function(enable_electrum_coin_output_data) {
				// If successful
				console.log(enable_electrum_coin_output_data);
				if (!enable_electrum_coin_output_data.userpass === false) {
					console.log('first marketmaker api call execution after marketmaker started.')
					sessionStorage.setItem('mm_usercoins', JSON.stringify(enable_electrum_coin_output_data.coins));
					sessionStorage.setItem('mm_userpass', enable_electrum_coin_output_data.userpass);
					sessionStorage.setItem('mm_mypubkey', enable_electrum_coin_output_data.mypubkey);

					var dexmode = sessionStorage.getItem('mm_dexmode');
					var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}

					if (ajax_data.status === 'enable') {
						toastr.success(ajax_data.coin+' Enabled','Coin Status');
					}
					if (ajax_data.status === 'disable') {
						toastr.success(ajax_data.coin+' Disabled','Coin Status');
					}
					//get_coins_list(data.coins);
				} else {
					//get_coins_list(data);
					if (electrum_option == false) {
						//get_coins_list('');
						//$('.refresh_dex_balances').trigger('click');
					} else {
						//get_coins_list(data);
					}
				}

				if (!enable_electrum_coin_output_data.error === false) {
					//console.log(data.error);
					toastr.info(enable_electrum_coin_output_data.error,'Coin Status');
					if (enable_electrum_coin_output_data.error == 'couldnt find coin locally installed') { //{error: "couldnt find coin locally installed", coin: "BTC"}
						bootbox.alert({
							onEscape: true,
							backdrop: true,
							title: "Couldn't find "+enable_disable_coin_data.coin+" locally installed",
							message: `<p>It seems you don't have `+enable_disable_coin_data.coin+` wallet installed on your OS. Please check these following points to make sure you have your wallet setup properly:</p>
							<ol>
								<li>Make sure your wallet is installed properly.</li>
								<li>Make sure your wallet is running and synced to network.</li>
								<li>Make sure your wallet has proper RPC settings configured in it's configuration file.</li>
								<li>If you have all the above covered properly, please logout and then login back and try activating the coin again.</li>
							</ol>
							<p>If you still having issues activating the your wallet, please get in touch with our support desk.</p>
							<ul>
								<li><a href="https://support.supernet.org/" target="_blank">https://support.supernet.org</a></li>
							</ul>`,
							size: 'large'
						});
					}
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
			    // If fail
			    console.log(textStatus + ': ' + errorThrown);
			});
		});
	} else {
		console.log(electrum_option);
		console.log("native selected for " + enable_disable_coin_data.coin);
		var ajax_data = {"userpass":userpass,"method":enable_disable_coin_data.method,"coin":enable_disable_coin_data.coin};

		console.log(ajax_data);

		$.ajax({
			async: true,
		    data: JSON.stringify(ajax_data),
		    dataType: 'json',
		    type: 'POST',
		    url: url
		}).done(function(enable_native_coin_output_data) {
			// If successful
			console.log(enable_native_coin_output_data);
			if (!enable_native_coin_output_data.userpass === false) {
				console.log('first marketmaker api call execution after marketmaker started.')
				sessionStorage.setItem('mm_usercoins', JSON.stringify(enable_native_coin_output_data.coins));
				sessionStorage.setItem('mm_userpass', enable_native_coin_output_data.userpass);
				sessionStorage.setItem('mm_mypubkey', enable_native_coin_output_data.mypubkey);

				var dexmode = sessionStorage.getItem('mm_dexmode');
				var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}

				if (ajax_data.status === 'enable') {
					toastr.success(ajax_data.coin+' Enabled','Coin Status');
				}
				if (ajax_data.status === 'disable') {
					toastr.success(ajax_data.coin+' Disabled','Coin Status');
				}
				//get_coins_list(enable_native_coin_output_data.coins);
			} else {
				//get_coins_list(enable_native_coin_output_data);
				if (electrum_option == false) {
					//get_coins_list('');
					//$('.refresh_dex_balances').trigger('click');
				} else {
					//get_coins_list(enable_native_coin_output_data);
				}
			}

			if (!enable_native_coin_output_data.error === false) {
				//console.log(enable_native_coin_output_data.error);
				toastr.info(enable_native_coin_output_data.error,'Coin Status');
				if (enable_native_coin_output_data.error == 'couldnt find coin locally installed') { //{error: "couldnt find coin locally installed", coin: "BTC"}
					bootbox.alert({
						onEscape: true,
						backdrop: true,
						title: "Couldn't find "+enable_disable_coin_data.coin+" locally installed",
						message: `<p>It seems you don't have `+enable_disable_coin_data.coin+` wallet installed on your OS. Please check these following points to make sure you have your wallet setup properly:</p>
						<ol>
							<li>Make sure your wallet is installed properly.</li>
							<li>Make sure your wallet is running and synced to network.</li>
							<li>Make sure your wallet has proper RPC settings configured in it's configuration file.</li>
							<li>If you have all the above covered properly, please logout and then login back and try activating the coin again.</li>
						</ol>
						<p>If you still having issues activating the your wallet, please get in touch with our support desk.</p>
						<ul>
							<li><a href="https://support.supernet.org/" target="_blank">https://support.supernet.org</a></li>
						</ul>`,
						size: 'large'
					});
				}
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
		    // If fail
		    console.log(textStatus + ': ' + errorThrown);
		});
	}

	return
}




function check_coin_inventory(coin) {
	console.log(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"inventory","coin":coin};
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
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			//get_coins_list(data.coins);
			//$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
		} else {
			sessionStorage.setItem('mm_coininventory', JSON.stringify(data));
			$('.RawJSONInventory-output').html(JSON.stringify(data, null, 2));
			$('.dex_showinv_alice_tbl tbody').empty();

			// Disabled since v0.6.8-beta
			/*var inv_alice_table_tr = '';
			inv_alice_table_tr += '<tr>';
				inv_alice_table_tr += '<th>Index</th>';
				inv_alice_table_tr += '<th>Coin</th>';
				inv_alice_table_tr += '<th>Vout1</th>';
				inv_alice_table_tr += '<th>Value1</th>';
				inv_alice_table_tr += '<th>Vout2</th>';
				inv_alice_table_tr += '<th>Value2</th>';
				inv_alice_table_tr += '<th></th>';
			inv_alice_table_tr += '</tr>';
			$('.dex_showinv_alice_tbl tbody').append(inv_alice_table_tr);

			$.each(data.alice, function(index, val) {
				//console.log(index);
				//console.log(val);
					inv_alice_table_tr = '';
					inv_alice_table_tr += '<tr>';
					inv_alice_table_tr += '<td>' + index + '</td>';
					inv_alice_table_tr += '<td>' + val.coin + '</td>';
					inv_alice_table_tr += '<td>' + val.vout + '</td>';
					inv_alice_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
					inv_alice_table_tr += '<td>' + val.vout2 + '</td>';
					inv_alice_table_tr += '<td>' + (parseFloat(val.value2)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
					inv_alice_table_tr += '<td><button class="btn btn-default btn_coiniventory_detail" data-invof="alice" data-index="' + index + '">Detail</button></td>';
				inv_alice_table_tr += '</tr>';

				$('.dex_showinv_alice_tbl tbody').append(inv_alice_table_tr);
			})*/

		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function check_coin_listunspent(coin_listunspent_data) {
	console.log(coin_listunspent_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"listunspent","coin":coin_listunspent_data.coin,"address":coin_listunspent_data.addr};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
		data: JSON.stringify(ajax_data),
		dataType: 'json',
		type: 'POST',
		url: url
	}).done(function(coin_listunspent_output_data) {
		// If successful
		console.log(coin_listunspent_output_data);

		$('.dex_showlist_unspents_tbl tbody').empty();
		var show_list_unspents_tbl_tr = '';
		show_list_unspents_tbl_tr += '<tr>';
			show_list_unspents_tbl_tr += '<th style="width: 30px;">Index</th>';
			show_list_unspents_tbl_tr += '<th>Coin Info</th>';
			show_list_unspents_tbl_tr += '<th>Value info</th>';
			show_list_unspents_tbl_tr += '<th>Transaction Info</th>';
			show_list_unspents_tbl_tr += '</tr>';
		$('.dex_showlist_unspents_tbl tbody').append(show_list_unspents_tbl_tr);
		$.each(coin_listunspent_output_data, function(index, val) {
			//console.log(index);
			//console.log(val);

			if (val.hasOwnProperty('interest') == true) {
				var utxo_interest = val.interest;
			} else {
				var utxo_interest = 'N/A';
			}

			show_list_unspents_tbl_tr = '';
			show_list_unspents_tbl_tr += '<tr>';
				show_list_unspents_tbl_tr += '<td>' + index + '</td>';
				show_list_unspents_tbl_tr += `<td>
												<b>Coin:</b> `+ coin_listunspent_data.coin +`<br>
												<b>Account:</b> `+ val.account +`<br>
												<b>Address:</b> `+ val.address +`<br>
												</td>`;
				show_list_unspents_tbl_tr += `<td>
												<b>Amount:</b> `+ (parseFloat(val.amount)).toFixed(8) + ' ' + coin_listunspent_data.coin +`<br>
												<b>Confirmations:</b> `+ val.confirmations +`<br>
												<b>Interest:</b> `+ utxo_interest +`<br>
												</td>`;
				show_list_unspents_tbl_tr += `<td>
												<b>scriptPubKey:</b> `+ val.scriptPubKey +`<br>
												<b>TxID:</b> `+ val.txid +`<br>
												</td>`;
			show_list_unspents_tbl_tr += '</tr>';

			$('.dex_showlist_unspents_tbl tbody').append(show_list_unspents_tbl_tr);
		})

	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}




$("#inventory_slider_input1").keyup(function(){
	var utxo_input = $("#inventory_slider_input1").val();
	var slider1_value = $("#inventory-slider1").val();
	$("#inventory-slider1Total").text((slider1_value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);


	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});

$("#inventory_slider_input2").keyup(function(){
	utxo_input = $("#inventory_slider_input2").val();
	var slider2_value = $("#inventory-slider2").val();
	$("#inventory-slider2Total").text((slider2_value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);

	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});

$("#inventory_slider_input3").keyup(function(){
	utxo_input = $("#inventory_slider_input3").val();
	var slider3_value = $("#inventory-slider3").val();
	$("#inventory-slider3Total").text((slider3_value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);

	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});



$("#inventory-slider1").slider();
$("#inventory-slider1").on("slide", function(slideEvt) {
	$("#inventory-slider1Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input1").val();
	$("#inventory-slider1Total").text((slideEvt.value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);

	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});

$("#inventory-slider2").slider();
$("#inventory-slider2").on("slide", function(slideEvt) {
	$("#inventory-slider2Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input2").val();
	$("#inventory-slider2Total").text((slideEvt.value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);

	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});

$("#inventory-slider3").slider();
$("#inventory-slider3").on("slide", function(slideEvt) {
	$("#inventory-slider3Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input3").val();
	$("#inventory-slider3Total").text((slideEvt.value*utxo_input).toFixed(8));

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	//var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = $('.inventory-title').data('balance');
	console.log(coin_balance);

	if(slider_total >= coin_balance) {
		$('.inventory-sliderTotal').css('color', 'red');
		$('.inventory-sliderTotalCoin').css('color', 'red');
		$('.btn-makeinventory').attr("disabled", "disabled");
	} else if (slider_total < coin_balance) {
		$('.inventory-sliderTotal').css('color', '');
		$('.inventory-sliderTotalCoin').css('color', '');
		$('.btn-makeinventory').removeAttr("disabled");
	}
});



function clac_coin_inventory(data) {
	console.log(data);

	utxo_input1 = (parseFloat(data.balance)*0.12).toFixed(8);
	utxo_input2 = (parseFloat(data.balance)*0.01).toFixed(8);
	utxo_input3 = (parseFloat(data.balance)*0.1).toFixed(8);
	///console.log(utxo_input1);
	//console.log(utxo_input2);
	//console.log(utxo_input3);
	$("#inventory_slider_input1").val(utxo_input1);
	$("#inventory_slider_input2").val(utxo_input2);
	$("#inventory_slider_input3").val(utxo_input3);


	var slider_input1 = $('#inventory-slider1').val();
	var slider_input2 = $('#inventory-slider2').val();
	var slider_input3 = $('#inventory-slider3').val();
	$("#inventory-slider1Total").text(parseFloat(slider_input1*utxo_input1).toFixed(8));
	$("#inventory-slider2Total").text(parseFloat(slider_input2*utxo_input2).toFixed(8));
	$("#inventory-slider3Total").text(parseFloat(slider_input3*utxo_input3).toFixed(8));

	var slider_total = parseFloat(slider_input1*utxo_input1) + parseFloat(slider_input2*utxo_input2) + parseFloat(slider_input3*utxo_input3);
	console.log(slider_total);

	$('.inventory-sliderTotal').text(slider_total.toFixed(8));
}


function make_inventory_withdraw(mk_inv_data) {
	//console.log(data);
	coin = mk_inv_data.coin;

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"withdraw","coin": mk_inv_data.coin, "outputs": mk_inv_data.outputs};
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);
	console.log(JSON.stringify(ajax_data));


	$.ajax({
	    data: JSON.stringify(ajax_data),
	    //dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(mk_inv_withdraw_data) {
		console.log(mk_inv_withdraw_data);
		var paprsed_mk_inv_withdraw_data = JSON.parse(mk_inv_withdraw_data);

		if (paprsed_mk_inv_withdraw_data.complete == false) {
			toastr.error('Uncessful Transaction. Please try again.','Tansaction info');
		}
		if (paprsed_mk_inv_withdraw_data.complete == true) {
			var mk_inv_confirm_bootbox = bootbox.dialog({
				backdrop: true,
				onEscape: true,
				message: `<p>Sending a transaction to make small deposit change in your address for coin: <b>` + mk_inv_data.coin + `</b></p>
				<p>Please confirm if you wish to proceed sending this transaction. Regular Transaction fee applies to make this deposit change.<p><br>` + JSON.stringify(mk_inv_data.outputs, null, 2),
				closeButton: true,
				size: 'medium',

				buttons: {
					cancel: {
						label: "Cancel",
						className: 'btn-default',
						callback: function(){
						}
					},
					ok: {
						label: "Confirm",
						className: 'btn-primary btn_mk_inv_confirm_bootbox',
						callback: function(){
							mk_inv_sendrawtx(paprsed_mk_inv_withdraw_data, mk_inv_data.coin);
						}
					}
				}
			});
			mk_inv_confirm_bootbox.init(function(){
				console.log('mk_inv_confirm_bootbox dialog opened.')
			});
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function mk_inv_sendrawtx(mk_inv_rawtx_data,mk_inv_rawtx_coin) {
	console.log(mk_inv_rawtx_data);
	console.log(mk_inv_rawtx_coin);
	
	
	
	if (mk_inv_rawtx_data.hasOwnProperty('withdraw')) { console.log(mk_inv_rawtx_data.withdraw.hex); }

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"sendrawtransaction","coin": mk_inv_rawtx_coin, "signedtx": (mk_inv_rawtx_data.hasOwnProperty('withdraw') ? mk_inv_rawtx_data.withdraw.hex : mk_inv_rawtx_data.hex) };
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);
	console.log(JSON.stringify(ajax_data));

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    //dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(mk_inv_sendrawtx_output_data) {
		// If successful
		console.log(mk_inv_sendrawtx_output_data);
		var parsed_mk_inv_sendrawtx_output_data = '';
		try {
			parsed_mk_inv_sendrawtx_output_data = JSON.parse(bot_output_data);
			console.log(parsed_mk_inv_sendrawtx_output_data);

			if ( !parsed_mk_inv_sendrawtx_output_data.hasOwnProperty('error') === false && parsed_mk_inv_sendrawtx_output_data.error === false) {
				toastr.error(parsed_mk_inv_sendrawtx_output_data.error.message, 'Transaction Info');
			} else if (parsed_mk_inv_sendrawtx_output_data.result == null) {
				bootbox.alert('<p>Error making withdraw transaction: </p><br>' + JSON.stringify(parsed_mk_inv_sendrawtx_output_data.error, null, 2));
			} else if (parsed_mk_inv_sendrawtx_output_data.result == 'success') {
				toastr.info('Low no. of UTXOs<br>Please try again in 1 Minute.', 'Transaction Status');
			}
		} catch(e) {
			console.log(e);
			var txid_explorer = '';
			if(mk_inv_rawtx_coin == 'MNZ') {
				txid_explorer = 'https://www.mnzexplorer.com/tx/'
			} else if(mk_inv_rawtx_coin == 'KMD') {
				txid_explorer = 'https://www.kmd.host/tx/'
			} else if(mk_inv_rawtx_coin == 'BTC') {
				txid_explorer = 'https://www.blocktrail.com/BTC/tx/'
			} else if(mk_inv_rawtx_coin == 'ZEC') {
				txid_explorer = 'https://zchain.online/tx/'
			}

			bootbox.alert(`Transaction Sent Successfully. Here's the Transaction ID:<br>
				<a href="#" onclick="shell.openExternal('`+txid_explorer+mk_inv_sendrawtx_output_data+`'); return false;">` + mk_inv_sendrawtx_output_data + `</a>`);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function addcoin_enable_disable_coin(data) {
	//console.log(data.coin);
	//console.log(data.status);
	var electrum_option = $('.toggle_checkbox[data-coin="' + data.coin + '"]').prop('checked'); //If 'false', electrum option selected
	var userpass = sessionStorage.getItem('mm_userpass');


	if (data.coin !== ' ' ) {
		console.log('coin value is not empty');
	} else {
		console.log('coin value is empty');
	}
	if (data.coin !== ' ' && data.status == 'enable') {
		if (electrum_option == false) {
		console.log(electrum_option);
		console.log("electrum selected for " + data.coin);
		var ajax_data = {"userpass":userpass,"method":"electrum","coin":data.coin,"ipaddr":"46.4.125.2","port":50001};
		} else {
			console.log(electrum_option);
			console.log("native selected for " + data.coin);
			var ajax_data = {"userpass":userpass,"method":data.status,"coin":data.coin};
		}
	} else if (data.coin !== ' ' && data.status == 'disable') {
		var ajax_data = {"userpass":userpass,"method":data.status,"coin":data.coin};
	} else if (data.coin == ' ') {
		var ajax_data = {"userpass":userpass,"method":"getcoins"};
	}
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);

	$.ajax({
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

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			if (ajax_data.status === 'enable') {
				toastr.success(ajax_data.coin+' Enabled','Coin Status');
			}
			if (ajax_data.status === 'disable') {
				toastr.success(ajax_data.coin+' Disabled','Coin Status');
			}
			get_coins_list(data.coins);
		} else {
			$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
			//get_coins_list(data);
			if (electrum_option == false) {
				//get_coins_list('');
				$('.refresh_dex_balances').trigger('click');
			} else {
				get_coins_list(data);
			}
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function get_coins_list() {

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	var ajax_data = {"userpass":userpass,"method":"getcoins"};
	console.log(ajax_data)
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

		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			get_coins_list();
			return
		} else {
			$('.addcoins_tbl tbody').empty();

			$.each(data, function(index, val) {
				console.log(index);
				console.log(val);

				var coin_name = return_coin_name(val.coin)

				var addcoins_tbl_tr = '';

				addcoins_tbl_tr += '<tr>';
					addcoins_tbl_tr += '<td><img src="img/cryptologo/' + val.coin.toLowerCase() + '.png" width="30px;"/> '+ coin_name + ' (' + val.coin + ')</td>';
					addcoins_tbl_tr += '<td>' + val.balance + '</td>';
					addcoins_tbl_tr += '<td>' + val.smartaddress + '</td>';
					addcoins_tbl_tr += '<td><span class="label label-uppercase label-' + (( val.status == 'active' ) ? 'grey' : 'default') + '">' + val.status + '</span></td>';
					addcoins_tbl_tr += '<td>' + (parseFloat(val.txfee)/100000000).toFixed(8) + '</td>';
					addcoins_tbl_tr += '<td><input class="toggle_checkbox" type="checkbox" checked data-toggle="toggle" data-on="Native" data-off="Electrum" data-onstyle="grey" data-offstyle="info" data-width="100px" data-coin="' + val.coin + '" disabled></td>';
					addcoins_tbl_tr += '<td style="width: 165px;"> <div class="btn-group" role="group">' + (( val.status == 'active' ) ? '<button class="btn btn-xs btn-warning addcoins_tbl_disable_btn" data-coin="' + val.coin + '">Disable</button>' : '<button class="btn btn-xs btn-success addcoins_tbl_enable_btn" data-coin="' + val.coin + '">Enable</button>') + '</div></td>';
				addcoins_tbl_tr += '</tr>';

				$('.addcoins_tbl tbody').append(addcoins_tbl_tr);

				/*if (val.status == 'active') {
					$('.selectpicker option').filter(function () { return $(this).html() == val.coin; }).removeAttr('disabled');
				}else {
					$('.selectpicker option').filter(function () { return $(this).html() == val.coin; }).attr("disabled","disabled");
				}

				$('.selectpicker').selectpicker('refresh');*/
				$('.toggle_checkbox[data-coin="BTC"]').removeAttr('disabled');
				$('.toggle_checkbox').bootstrapToggle();

				if (!val.electrum === false) {
					console.log(val);
					$('.toggle_checkbox[data-coin="' + val.coin + '"]').prop('checked', false).change()
				}
			})
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});
};


function addcoins_dialog(){

	var bot_update_bootbox = bootbox.dialog({
		onEscape: true,
		backdrop: true,
		message: `
			<div class="row">
				<div class="col-sm-12">
					<div class="panel panel-default">
						<div class="panel-heading">
						<h3 class="panel-title"><strong>Add Coin</strong></h3>
						</div>
						<div class="panel-body"> <!-- panel-body -->

							<div class="col-sm-6">
							<select class="selectpicker addcoin_enable_disable_selection" data-live-search="true" data-hide-disabled="true" data-width="100%"></select>
							</div>
							<div class="col-sm-6">
							<input class="toggle_checkbox toggle_font_lg" id="addcoin_toggle_native_electrum" type="checkbox" checked data-toggle="toggle" data-on="Native Mode" data-off="Electrum Mode" data-onstyle="primary" data-offstyle="info" data-width="100%" data-height="44px">
							</div>


						</div>
					</div>
				</div>
			</div>`,
		closeButton: false,
		size: 'medium',

		buttons: {
			cancel: {
				label: "Cancel",
				className: 'btn-default',
				callback: function(){

				}
			},
			ok: {
				label: "Enable",
				className: 'btn-success btn-addcoins_enable',
				callback: function(){
					var addcoin_data = {}
					addcoin_data.coin = $('.addcoin_enable_disable_selection').selectpicker('val');
					addcoin_data.electrum = $('#addcoin_toggle_native_electrum').prop('checked');
					addcoin_data.method = 'enable';
					console.log(addcoin_data);

					enable_disable_coin(addcoin_data);
					$('.porfolio_coins_list tbody').empty();
					var actiavte_portfolio_coins_list_spinner = ''
					actiavte_portfolio_coins_list_spinner += '<th colspan="7">';
						actiavte_portfolio_coins_list_spinner += '<div style="text-align: center; height: 100px;">';
							actiavte_portfolio_coins_list_spinner += '<svg id="portfolio-coins-spinner">';
								actiavte_portfolio_coins_list_spinner += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
								actiavte_portfolio_coins_list_spinner += '<circle class="path2" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
								actiavte_portfolio_coins_list_spinner += '<circle class="path3" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
								actiavte_portfolio_coins_list_spinner += '<circle class="path4" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
							actiavte_portfolio_coins_list_spinner += '</svg>';
						actiavte_portfolio_coins_list_spinner += '</div>';
					actiavte_portfolio_coins_list_spinner += '</th>';
					$('.porfolio_coins_list tbody').append(actiavte_portfolio_coins_list_spinner);
					CheckPortfolioFn();

				}
			}
		}
	});
	bot_update_bootbox.init(function(){
		$('.addcoin_enable_disable_selection').html(coin_select_options);
		$('.addcoin_enable_disable_selection').selectpicker('render');

		$('.toggle_checkbox').bootstrapToggle();

		//console.log('bot_update_settings dialog opened.')
		//$('.btn-bot_settings_update').attr("disabled", "disabled");
		//$('.trading_pair_coin_newprice').inputNumber();
		//$('.trading_pair_coin_newvolume').inputNumber();

	});
}


/* Portfolio section functions START */


function CheckPortfolioFn(sig) {
	if (sig == false) {
		clearInterval(CheckPortfolio_Interval);
		return 'Check portfolio calls stopped.';
	} else {
		console.log('checking portfolio');
	}

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	var ajax_data = {"userpass":userpass,"method":"portfolio"};
	console.log(ajax_data)
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

		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);
			CheckPortfolioFn();

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			return
		}

		PortfolioTblDataFn(data);
		PortfolioChartUpdate(data.portfolio);
	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function PortfolioTblDataFn(portfolio_tbl_data) {
	console.log(portfolio_tbl_data.portfolio.length);
	if (portfolio_tbl_data.portfolio &&
			portfolio_tbl_data.portfolio.length) {
		$('#portfolio-coins-spinner').hide();
	}

	$('.portfolio_kmd_equiv').html(portfolio_tbl_data.kmd_equiv);
	$('.portfolio_buycoin').html(portfolio_tbl_data.buycoin);
	$('.portfolio_buyforce').html(portfolio_tbl_data.buyforce);
	$('.portfolio_sellcoin').html(portfolio_tbl_data.sellcoin);
	$('.portfolio_sellforce').html(portfolio_tbl_data.sellforce);
	$('.portfolio_base').html(portfolio_tbl_data.base);
	$('.portfolio_rel').html(portfolio_tbl_data.rel);
	$('.portfolio_relvolume').html(portfolio_tbl_data.relvolume);

	$('.dex_portfolio_coins_tbl tbody').empty();

	$('.porfolio_coins_list tbody').empty();
	$.each(portfolio_tbl_data.portfolio, function(index, val) {
		//console.log(index);
		console.log(val);

		var coin_name = return_coin_name(val.coin)

		var dex_portfolio_coins_tbl_tr = '';

		dex_portfolio_coins_tbl_tr += '<tr>';
			dex_portfolio_coins_tbl_tr += '<td><img src="img/cryptologo/' + val.coin.toLowerCase() + '.png" width="30px;"/> '+ coin_name +' ('+val.coin + ')</td>';
			//dex_portfolio_coins_tbl_tr += '<td>' + val.address + '</td>';
			dex_portfolio_coins_tbl_tr += '<td>' + val.amount + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.price + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.goal + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.goalperc + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.kmd_equiv + '</td>';
            dex_portfolio_coins_tbl_tr += `<td>
											<button class="btn btn-sm btn-default btn_portfolio_coingoal" data-coin="` + val.coin + `" data-auto=false>Set Goal <span class="glyphicon glyphicon-export" aria-hidden="true"></span></button>
											<button class="btn btn-sm btn-default btn-portfoliogo" data-coin="` + val.coin + `" data-coinname="` + coin_name + `" data-addr="` + val.address + `" data-balance="` + val.amount + `">Exchange <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>            
											</td>`
            //dex_portfolio_coins_tbl_tr += '<td>' + val.perc + '</td>';
            /*dex_portfolio_coins_tbl_tr += '<td>' + val.relvolume + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.force + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.balanceA + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.valuesumA + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.aliceutil + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.balanceB + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.valuesumB + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.balance + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.bobutil + '</td>';*/
		dex_portfolio_coins_tbl_tr += '</tr>';

		$('.porfolio_coins_list tbody').append(dex_portfolio_coins_tbl_tr);
	})
};

function PortfolioChartUpdate(chart_data) {
	console.log(chart_data)
	var chart = AmCharts.makeChart( "portfolio_chart_current", {
	  "type": "pie",
	  "theme": "light",
	  "dataProvider": chart_data,
	  "valueField": "perc",
	  "titleField": "coin",
	  "startDuration": 0,
	  "innerRadius": 50,
	  "pullOutRadius": 20,
	  "marginTop": 30,
	  "marginBottom": 15,
	  "marginLeft": 0,
	  "marginRight": 0,
	  "pullOutRadius": 0,
	  /*"titles": [
	    {
	      "text": "Current Portfolio Goal"
	    }
	  ],*/
	  "allLabels": [
	    {
	      "y": "46%",
	      "align": "center",
	      "size": 25,
	      "bold": true,
	      "text": "Now",
	      "color": "#555"
	    },
	    {
	      "y": "40%",
	      "align": "center",
	      "size": 15,
	      "text": "Goal",
	      "color": "#555"
	    }
	  ],
	  "export": {
	    "enabled": false
	  }
	});

	var chart2 = AmCharts.makeChart( "portfolio_chart_target", {
	  "type": "pie",
	  "theme": "light",
	  "dataProvider": chart_data,
	  "valueField": "goalperc",
	  "titleField": "coin",
	  "startDuration": 0,
	  "innerRadius": 50,
	  "pullOutRadius": 20,
	  "marginTop": 30,
	  "marginBottom": 15,
	  "marginLeft": 0,
	  "marginRight": 0,
	  "pullOutRadius": 0,
	  /*"titles": [
	    {
	      "text": "Target Portfolio Goal"
	    }
	  ],*/
	  "allLabels": [
	    {
	      "y": "46%",
	      "align": "center",
	      "size": 25,
	      "bold": true,
	      "text": "Target",
	      "color": "#555"
	    },
	    {
	      "y": "40%",
	      "align": "center",
	      "size": 15,
	      "text": "Goal",
	      "color": "#555"
	    }
	  ],
	  "export": {
	    "enabled": false
	  }
	});
}

$('.btn-refreshportfolio').click(function() {
	console.log('clicked refresh button at dex portfolio charts');
	$('.porfolio_coins_list tbody').empty();
	var actiavte_portfolio_coins_list_spinner = ''
	actiavte_portfolio_coins_list_spinner += '<th colspan="7">';
      actiavte_portfolio_coins_list_spinner += '<div style="text-align: center; height: 100px;">';
        actiavte_portfolio_coins_list_spinner += '<svg id="portfolio-coins-spinner">';
          actiavte_portfolio_coins_list_spinner += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path2" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path3" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
          actiavte_portfolio_coins_list_spinner += '<circle class="path4" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
        actiavte_portfolio_coins_list_spinner += '</svg>';
      actiavte_portfolio_coins_list_spinner += '</div>';
    actiavte_portfolio_coins_list_spinner += '</th>';
    $('.porfolio_coins_list tbody').append(actiavte_portfolio_coins_list_spinner);
	CheckPortfolioFn();
});

$('.refresh_dex_potfolio').click(function() {
	console.log('clicked refresh button at dex portfolio charts');
	CheckPortfolioFn();
});

$('.refresh_dex_potfolio_coins').click(function() {
	console.log('clicked refresh button at dex portfolio charts');
	CheckPortfolioFn();
});


$('.portfolio_set_price_btn').click(function() {
	var price = $('#portfolio_set_price').val();
	var base_coin = $('.buy_coin_p').selectpicker('val');
	var rel_coin = $('.sell_coin_p').selectpicker('val');

	console.log('price ' + price);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"setprice","base":base_coin,"rel":rel_coin,"price":price};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   toastr.success('Price for Base: ' + base_coin + ' Rel: ' + rel_coin + ' set to: ' + price + ' ' + rel_coin, 'Portfolio Info')
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

})


$('.portfolio_set_autoprice_btn').click(function() {
	var margin = $('#portfolio_set_autoprice').val();
	var base_coin = $('.buy_coin_p').selectpicker('val');
	var rel_coin = $('.sell_coin_p').selectpicker('val');

	console.log('margin ' + margin);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"autoprice","base":base_coin,"rel":rel_coin,"margin":margin};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   toastr.success('Margin Price for Base: ' + base_coin + ' Rel: ' + rel_coin + ' set to: ' + margin + '% ' + rel_coin, 'Portfolio Info')
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

})


function set_coin_goal(goal_data){
	console.log(goal_data);

	//console.log('AUTO GOAL: ' + goal_data.auto);
	//console.log('GOAL PERCENTAGE: ' + goal_data.percent);
	//console.log('GOAL COIN: '+ goal_data.coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	if (goal_data.auto == false) {
		var ajax_data = {"userpass":userpass,"method":"goal","coin":goal_data.coin,"val":goal_data.percent};
	} else {
		var ajax_data = {"userpass":userpass,"method":"goal"};
	}
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
	   if (goal_data.auto == false){
			toastr.success('Goal for ' + goal_data.coin + ' set to: ' + goal_data.percent +'%', 'Portfolio Info')
	   } else {
			bootbox.alert('Auto Goal executed for all active coins. Make sure you have set Auto Price for these coins.');
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	$('.porfolio_coins_list tbody').empty();
	var actiavte_portfolio_coins_list_spinner = ''
	actiavte_portfolio_coins_list_spinner += '<th colspan="7">';
		actiavte_portfolio_coins_list_spinner += '<div style="text-align: center; height: 100px;">';
			actiavte_portfolio_coins_list_spinner += '<svg id="portfolio-coins-spinner">';
				actiavte_portfolio_coins_list_spinner += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
				actiavte_portfolio_coins_list_spinner += '<circle class="path2" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
				actiavte_portfolio_coins_list_spinner += '<circle class="path3" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
				actiavte_portfolio_coins_list_spinner += '<circle class="path4" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>';
			actiavte_portfolio_coins_list_spinner += '</svg>';
		actiavte_portfolio_coins_list_spinner += '</div>';
	actiavte_portfolio_coins_list_spinner += '</th>';
	$('.porfolio_coins_list tbody').append(actiavte_portfolio_coins_list_spinner);
	CheckPortfolioFn();
}



$('#trading_pair_coin_autoprice_mode').change(function() {
	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();
	var margin_or_fixed = $('#trading_pair_coin_autoprice_mode').prop('checked');
	
	if(bot_or_manual == 'tradeportfolio') {
		if(margin_or_fixed == true) {
			$('#trading_pair_coin_price_max_min').show();
			$('.trading_pair_coin_price').css('border-radius', '0')
			//$('.trading_pair_coin_price').attr("placeholder", "Margin e.g. 0.01");
			if(buying_or_selling == 'buying') {
				$('.btn-bot_action').html('SET AUTO BUY MARGIN %');
				$('.portfolio_info_text').html("Auto buy margin will make automatic buy orders on lower prices based on the specified percentage.");
			}
			if(buying_or_selling == 'selling') {
				$('.btn-bot_action').html('SET AUTO SELL MARGIN %');
				$('.portfolio_info_text').html("Auto sell margin will make automatic sell orders on higher prices based on the specified percentage.");
			}
		} else {
			$('#trading_pair_coin_price_max_min').hide();
			$('.trading_pair_coin_price').css('border-radius', '4px')
			//$('.trading_pair_coin_price').attr("placeholder", "Price e.g. 0.01");
			if(buying_or_selling == 'buying') {
				$('.btn-bot_action').html('SET AUTO BUY PRICE');
				$('.portfolio_info_text').html("Auto buy on fixed price will make automatic buy orders on prices based on the specified price.");
			}
			if(buying_or_selling == 'selling') {
				$('.btn-bot_action').html('SET AUTO SELL PRICE');
				$('.portfolio_info_text').html("Auto sell on fixed price will make automatic sell orders on prices based on the specified price.");
			}
		}
	}
});

$('.btn_set_coin_goal').click(function(e){
	e.preventDefault();
	console.log('btn_set_coin_goal clicked');
	console.log($(this).data());

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var goal_data = {}
	goal_data.coin = coin;
	goal_data.auto = $(this).data('auto');
	goal_data.percent = $('.coingoal_percentage').val();

	//console.log(goal_data);
	set_coin_goal(goal_data);
});

$('.btn-autogoalall').click(function(e){
	e.preventDefault();
	console.log('btn-autogoalall clicked');
	console.log($(this).data());

	var goal_data = {}
	goal_data.auto = $(this).data('auto');

	bootbox.confirm({
		message: "Are you sure you want to set Auto Goal for all active/enabled coins?<br>It will reset your existing coin goals and you have to set individual coin's goal again. Please click Yes button to proceed, or hit No button to cancel.",
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			if (result == true) {
				//console.log(goal_data);
				set_coin_goal(goal_data);
			}
		}
	});
});


function autoprice_buy_sell(autoprice_data) {
	console.log(autoprice_data);
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	var margin_or_fixed = $('#trading_pair_coin_autoprice_mode').prop('checked');

	if(buying_or_selling == 'buying') {
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}
	if(buying_or_selling == 'selling') {
		var base_coin = $('.trading_pair_coin').selectpicker('val');
		var rel_coin = coin;
	}

	//var base_coin = coin;
	//var rel_coin = $('.trading_pair_coin').selectpicker('val');

	console.log('BUYING or SELLING??: ' + buying_or_selling);
	console.log('BASE: ' + base_coin);
	console.log('REL: '+ rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	if (autoprice_data.mode == 'margin') {
		var ajax_data = {"userpass":userpass,"method":"autoprice","base":base_coin,"rel":rel_coin,"margin":autoprice_data.modeval};
	}
	if (autoprice_data.mode == 'fixed') {
		var ajax_data = {"userpass":userpass,"method":"autoprice","base":base_coin,"rel":rel_coin,"fixed":autoprice_data.modeval};
	}

	console.log(ajax_data);

	console.log(JSON.stringify(ajax_data));

	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);

		$('.trading_pair_coin_price').val('');
		$('.trading_pair_coin_volume').val('');
		$('.trading_pair_destpubkey').val('');
		$('.relvol_basevol').html('');

		if (!data.error === false) {
			toastr.error(data.error, 'Trade Info');
		} else if (data.result == 'success') {
			toastr.success('Order Executed', 'Trade Info');
			
			var autoprice_mode = '';
			var percent_on_off = '';
			var autoprice_modeinfo = '';
			var autoprice_modeval = '';
			if (autoprice_data.mode == 'margin'){
				autoprice_mode = 'Margin';
				percent_on_off = '%';
				autoprice_modeinfo = 'Margin Percentage';
				autoprice_modeval = autoprice_data.modeval * 100;
			}
			if (autoprice_data.mode == 'fixed'){
				autoprice_mode = 'Fixed';
				percent_on_off = '';
				autoprice_modeinfo = 'Fixed Price';
				autoprice_modeval = autoprice_data.modeval;

			}
			bootbox.alert(autoprice_mode + ` auto price order executed:<br>
						<b>Buying Currency (base):</b>` + base_coin + ` <br>
						<b>Selling Currency (rel):</b>` + rel_coin + ` <br>
						<b>` + autoprice_modeinfo + `:</b> ` + autoprice_modeval + `` + percent_on_off);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

/* Portfolio section functions END */


/* Manual Tradeing */

$('input[name=trading_mode_options]').change(function() {
	console.log('trading_mode_options changed');

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	//console.log(buying_or_selling);

	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();
	//console.log(bot_or_manual);

	var margin_or_fixed = $('#trading_pair_coin_autoprice_mode').prop('checked');

	if(bot_or_manual == 'tradebot') {
		$('#trading_pair_coin_price_max_min').html('Max');
		$('.trading_pair_lable_text_one').html('Max');
		$('.trading_pair_lable_text_two').html('Buy');
		if(buying_or_selling == 'buying') {
			$('.btn-bot_action').html('BUY');
			$('.relvol_basevol_label').html("It'll cost you");
			$('.btn-bot_action').attr('data-action', 'buy');
		}
		if(buying_or_selling == 'selling') {
			$('.btn-bot_action').html('SELL');
			$('.relvol_basevol_label').html("You'll get");
			$('.btn-bot_action').attr('data-action', 'sell');
		}
		$('.trading_selected_trader_label').hide();
		$('.trading_selected_trader').hide();
		$('.trading_pair_coin_autoprice_mode_span').hide();
		$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
		$('#trading_pair_coin_price_max_min').html('Max');
		$('#trading_pair_coin_price_max_min').show();
		$('.buy_sell_amount_to').show();
		$('#trading_pair_coin_ticker').show();
		$('.trading_pair_coin_volume').show();
		$('.btn-bot_action').removeClass('btn-block');
		$('.btn-bot_action').css('border-top-left-radius','0');
		$('.btn-bot_action').css('border-bottom-left-radius','0');
		$('.buy_sell_button_div').css('margin-top', '0');
		$('.relvol_basevol_amount').show();
		$('.relvol_basevol_label').show();
		$('.portfolio_info_text').hide();
		$('.coingoal_label_div').hide();
		$('.coingoal_div').hide();
	}
	if(bot_or_manual == 'trademanual') {
		//$('#trading_pair_coin_price_max_min').html('Min');
		$('.trading_pair_lable_text_one').html('');
		//$('.trading_pair_lable_text_two').html('Sell');
		if(buying_or_selling == 'buying') {
			$('.btn-bot_action').html('BUY');
			$('.relvol_basevol_label').html("It'll cost you")
			$('.btn-bot_action').attr('data-action', 'buy');
		}
		if(buying_or_selling == 'selling') {
			$('.btn-bot_action').html('SELL');
			$('.relvol_basevol_label').html("You'll get");
			$('.btn-bot_action').attr('data-action', 'sell');
		}
		//$('.btn-bot_action').attr('data-action', 'sell');
		//$('.trading_selected_trader_label').show();
		//$('.trading_selected_trader').show();
		$('.trading_pair_coin_autoprice_mode_span').hide();
		$('#trading_pair_coin_price_max_min').html('Max');
		$('#trading_pair_coin_price_max_min').show();
		$('.buy_sell_amount_to').show();
		$('#trading_pair_coin_ticker').show();
		$('.trading_pair_coin_volume').show();
		$('.btn-bot_action').removeAttr('btn-block');
		$('.btn-bot_action').css('border-top-left-radius','0');
		$('.btn-bot_action').css('border-bottom-left-radius','0');
		$('.buy_sell_button_div').css('margin-top', '0');
		$('.relvol_basevol_amount').show();
		$('.relvol_basevol_label').show();
		$('.portfolio_info_text').hide();
		$('.coingoal_label_div').hide();
		$('.coingoal_div').hide();
	}
	if(bot_or_manual == 'tradeportfolio') {
		$('.trading_pair_lable_text_one').html('Auto')
		$('.trading_selected_trader_label').hide();
		$('.trading_selected_trader').hide();
		$('.trading_pair_coin_autoprice_mode_span').show();
		$('#trading_pair_coin_autoprice_mode').bootstrapToggle('on')
		$('#trading_pair_coin_price_max_min').html('%');
		if(buying_or_selling == 'buying') {
			if(margin_or_fixed == true){
				$('.btn-bot_action').html('SET AUTO BUY MARGIN %');
				$('.portfolio_info_text').html("Auto buy margin will make automatic buy orders on lower prices based on the specified percentage.");
			} else {
				$('.btn-bot_action').html('SET AUTO BUY PRICE');
				$('.portfolio_info_text').html("Auto buy on fixed price will make automatic buy orders on prices based on the specified price.");
			}
		}
		if(buying_or_selling == 'selling') {
			if(margin_or_fixed == true){
				$('.btn-bot_action').html('SET AUTO SELL MARGIN %');
				$('.portfolio_info_text').html("Auto sell margin will make automatic sell orders on higher prices based on the specified percentage.");
			} else {
				$('.btn-bot_action').html('SET AUTO SELL PRICE');
				$('.portfolio_info_text').html("Auto sell on fixed price will make automatic sell orders on prices based on the specified price.");
			}
		}
		$('.btn-bot_action').attr('data-action', 'autoprice');
		$('.buy_sell_amount_to').hide();
		$('#trading_pair_coin_ticker').hide();
		$('.trading_pair_coin_volume').hide();
		$('.btn-bot_action').addClass(' btn-block');
		$('.btn-bot_action').css('border-top-left-radius','4px');
		$('.btn-bot_action').css('border-bottom-left-radius','4px');
		$('.buy_sell_button_div').css('margin-top', '20px');
		$('.relvol_basevol_amount').hide();
		$('.relvol_basevol_label').hide();
		$('.portfolio_info_text').show();
		$('.coingoal_label_div').show();
		$('.coingoal_div').show();
	}
});


function manual_buy_sell(mt_data) {
	console.log(mt_data);
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();

	/*if(buying_or_selling == 'buying') {
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}
	if(buying_or_selling == 'selling') {
		var base_coin = $('.trading_pair_coin').selectpicker('val');
		var rel_coin = coin;
	}*/

	var base_coin = coin;
	var rel_coin = $('.trading_pair_coin').selectpicker('val');

	console.log('BUYING or SELLING??: ' + buying_or_selling);
	console.log('BASE: ' + base_coin);
	console.log('REL: '+ rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	if (mt_data.action == 'buy') {
		var ajax_data = {"userpass":userpass,"method":"buy","base":base_coin,"rel":rel_coin,"price":mt_data.price,"relvolume":mt_data.volume};
		if (mt_data.trader_only == true) {
			ajax_data.destpubkey = mt_data.destpubkey;
		}
	}
	if (mt_data.action == 'sell') {
		var ajax_data = {"userpass":userpass,"method":"sell","base":base_coin,"rel":rel_coin,"price":mt_data.price,"basevolume":mt_data.volume};
		if (mt_data.trader_only == true) {
			ajax_data.destpubkey = mt_data.destpubkey;
		}
	}

	console.log(ajax_data);

	console.log(JSON.stringify(ajax_data));

	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(mt_output_data) {
		// If successful
		console.log(mt_output_data);

		//$('.trading_pair_coin_price').val('');
		//$('.trading_pair_coin_volume').val('');
		$('.trading_pair_destpubkey').val('');
		//$('.relvol_basevol').html('');

		if (!mt_output_data.error === false) {
			toastr.error(mt_output_data.error, 'Bot Info');
			if (mt_output_data.error == 'not enough funds') {
				//toastr.info(mt_output_data.error + '<br>Balance: ' + mt_output_data.balance + ' ' + mt_output_data.coin, 'Bot Info');
				bootbox.alert({
					backdrop: true,
					onEscape: true,
					title: `Looks like you don't have enough UTXOs in your balance.`,
					message: `<p>Not a problem. I have executed the recommended command to make required UTXOs for you.</p>
					<p>If you see the message saying "Executed Auto Split Funds", then please wait for approx. 30 seconds to 1 minute before trying again.</p>
					<p>If you see some outgoing transactions from your barterDEX smartaddress that's sent to the same smartaddress of yours to create some inventory transactions for barterDEX to make required trades.<br>
					Please try in a moment with same or different volume and you should be all good to go.</p>
					<p>If you are still getting the same error again, here are few things you can try:</>
					<ul>
					<li>Please try the "Inventory" button under the coin's logo where you see it's balance.<br>
					That will give you good overview what exactly UTXO means and what you need to do to fix this error.</li>
					<li>Try lower amount of buy which makes final cost in total lower.</li>
					<li>Logout and login back and try lower amount of buy counts total cost lower than previous attempt.</li>
					</ul>`});
				console.log(JSON.stringify(mt_output_data))

				/*if (mt_output_data.withdraw.complete === true) {
					//bot_sendrawtx(mt_output_data);
					toastr.success('Executed Auto Split Funds. Please try in approx. 30 seconds again.', 'Bot Info');
				} else {
					toastr.error('No withdraw info found. Please try again with lower buy amount.', 'Bot Info');
				}*/
			}
		} else if (mt_output_data.result == 'success') {
			toastr.success('Order Executed', 'Trade Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}



/* Manual Tradeing END */



/* Auto Trading Bot */

function setOrderPrice(trade_data) {
	console.log(trade_data);
	//trade_data = JSON.parse(trade_data);
	//console.log(trade_data);
	trade_price_plus = trade_data.price * 1.001;

	$('.trading_pair_coin_price').val(trade_price_plus.toFixed(8));
	toastr.info(`Auto selected price as ${trade_data.price} + 0.1% = ${trade_price_plus.toFixed(8)}`,'Trade Info');

	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();

	if(bot_or_manual == 'tradebot') {

	}
	if(bot_or_manual == 'trademanual') {

		pair_volume = trade_data.maxbuy;
		$('.trading_pair_coin_volume').val(pair_volume.toFixed(8));
		$('.relvol_basevol').html(trade_data.avevolume);
		$('.trading_pair_destpubkey').val(trade_data.pubkey);
	}

}

function CheckOrderBookFn(sig) {
	if (sig == false) {
		clearInterval(CheckOrderbook_Interval);
		return
	} else {
		console.log('checking orderbook');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();

	if(buying_or_selling == 'buying') {
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}
	if(buying_or_selling == 'selling') {
		// Disabled selling option to show opposite pair orderbook result.
		//var base_coin = $('.trading_pair_coin').selectpicker('val');
		//var rel_coin = coin;
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	$('.orderbook_rel_coin').html(rel_coin);
	$('.orderbook_base_coin').html(base_coin);

	var ajax_data = {"userpass":userpass,"method":"orderbook","base":base_coin,"rel":rel_coin};
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			//CheckOrderBookFn();
		} else {
			//console.log(data.asks);

			$('.orderbook_numasks').html(data.numasks);
			$('.orderbook_numbids').html(data.numbids);

			$('.orderbook_bids tbody').empty();
			$.each(data.bids, function(index, val) {
				//console.log(index);
				//console.log(val);
				var colorpbk = coloredPubkey(val.pubkey);

				var mytrade_true = '';
				if (val.pubkey === mypubkey) {
					var mytrade_true = 'class="warning"';
				}
				var orderbook_bids_tr = '';
				orderbook_bids_tr += '<tr ' + mytrade_true + '>';
				orderbook_bids_tr += '<td>' + val.price + '</td>';
				//orderbook_bids_tr += '<td>' + val.minvolume + '</td>';
				//orderbook_bids_tr += '<td>' + val.maxvolume + '</td>';
				orderbook_bids_tr += '<td>' + val.avevolume + '</td>';
				orderbook_bids_tr += '<td>' + val.depth + '</td>';
				//orderbook_bids_tr += '<td>' + colorpbk.firstpart + '<font style="color: #' + colorpbk.colorpart1 + '; background-color: #' + colorpbk.colorpart1 + ';">' + colorpbk.char1 + '</font><font style="color: #' + colorpbk.colorpart2 + '; background-color: #' + colorpbk.colorpart2 + ';">' + colorpbk.char2 + '</font><font style="color: #' + colorpbk.colorpart3 + '; background-color: #' + colorpbk.colorpart3 + ';">' + colorpbk.char3 + '</font>' + colorpbk.lastpart + '</td>';
				orderbook_bids_tr += '<td>' + val.age + '</td>';
				orderbook_bids_tr += '<td>' + val.numutxos + '</td>';
				orderbook_bids_tr += '<td><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span> ' + val.zcredits + '</td>';
				$('.orderbook_bids tbody').append(orderbook_bids_tr);
			})

			$('.orderbook_asks tbody').empty();
			if (data.asks &&
					data.asks.length) {
				$('#orderbook-asks-spinner').hide();
			}
			$.each(data.asks, function(index, val) {
				//console.log(index);
				//console.log(val);
				var colorpbk = coloredPubkey(val.pubkey);

				var mytrade_true = '';
				if (val.pubkey === mypubkey) {
					var mytrade_true = 'class="warning"';
				}

				row_trade_data = {};
				row_trade_data.price = val.price;
				//row_trade_data.minvolume = val.minvolume;
				//row_trade_data.maxvolume = val.maxvolume;
				row_trade_data.avevolume = val.avevolume;
				row_trade_data.numutxos = val.numutxos;
				row_trade_data.depth = val.depth;
				row_trade_data.maxbuy = val.avevolume / val.price;
				row_trade_data.pubkey = val.pubkey;
				//row_trade_data.totalbuy = (val.avevolume / val.price) * val.numutxos;
				var orderbook_asks_tr = '';
				orderbook_asks_tr += '<tr ' + mytrade_true + ' onclick=setOrderPrice(' + JSON.stringify(row_trade_data) + ')>';
				orderbook_asks_tr += '<td>' + val.price + '</td>';
				//orderbook_asks_tr += '<td>' + val.minvolume + ' - ' + val.maxvolume + '</td>';
				//orderbook_asks_tr += '<td>' + row_trade_data.totalbuy.toFixed(8) + '</td>';
				orderbook_asks_tr += '<td>' + val.avevolume + '</td>';
				orderbook_asks_tr += '<td>' + val.depth + '</td>';
				//orderbook_asks_tr += '<td>' + colorpbk.firstpart + '<font style="color: #' + colorpbk.colorpart1 + '; background-color: #' + colorpbk.colorpart1 + ';">' + colorpbk.char1 + '</font><font style="color: #' + colorpbk.colorpart2 + '; background-color: #' + colorpbk.colorpart2 + ';">' + colorpbk.char2 + '</font><font style="color: #' + colorpbk.colorpart3 + '; background-color: #' + colorpbk.colorpart3 + ';">' + colorpbk.char3 + '</font>' + colorpbk.lastpart + '</td>';
				orderbook_asks_tr += '<td>' + val.age + '</td>';
				orderbook_asks_tr += '<td>' + val.numutxos + '</td>';
				orderbook_asks_tr += '<td><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span> ' + val.zcredits + '</td>';
				orderbook_asks_tr += '</tr>';
				$('.orderbook_asks tbody').append(orderbook_asks_tr);
			})
		}

	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	return 'Check orderbook calls stopped.';
}


function check_my_prices(sig){
	if (sig == false) {
		clearInterval(check_my_prices_Interval);
		return
	} else {
		console.log('checking my prices');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();

	if(buying_or_selling == 'buying') {
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}
	if(buying_or_selling == 'selling') {
		var base_coin = $('.trading_pair_coin').selectpicker('val');
		var rel_coin = coin;
	}

	var userpass = sessionStorage.getItem('mm_userpass');
	//var ajax_data = {"userpass":userpass,"method":"myprice","base":base_coin,"rel":rel_coin};
	var ajax_data = {"userpass":userpass,"method":"myprices"};
	console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		} else {
			//console.log(data);
			$('.exchange_my_orders_tbl tbody').empty();
			if (!data.error === false) {
				toastr.error(data.error,'My price info')
				/*if (!data.error == 'authentication error you need to make sure userpass is set') {
					var exchange_my_orders_tr = '';
					exchange_my_orders_tr += '<tr>';
					exchange_my_orders_tr += '<td><div style="text-align: center;">' + data.error + ' for pair ' + base_coin + '/' + rel_coin + '</div></td>';
					exchange_my_orders_tr += '</tr>';
					$('.exchange_my_orders_tbl tbody').append(exchange_my_orders_tr);
				}*/
			} else {
				$.each(data, function(index, val) {
					//console.log(index);
					//console.log(val);

					var base_coin_name = return_coin_name(val.base)
					var rel_coin_name = return_coin_name(val.rel)

					var exchange_my_orders_tr = '';
					exchange_my_orders_tr += '<tr>';
						exchange_my_orders_tr += '<td>'+ val.base + ' (' + base_coin_name + ')</td>';
						exchange_my_orders_tr += '<td>'+ val.rel + ' (' + rel_coin_name + ')</td>';
						exchange_my_orders_tr += '<td>' + val.bid + '</td>';
						exchange_my_orders_tr += '<td>' + val.ask + '</td>';
					exchange_my_orders_tr += '</tr>';
					$('.exchange_my_orders_tbl tbody').append(exchange_my_orders_tr);
				});

				/*var base_coin_name = return_coin_name(data.base)
				var rel_coin_name = return_coin_name(data.rel)

				var exchange_my_orders_tr = '';
				exchange_my_orders_tr += '<tr>';
					exchange_my_orders_tr += '<td>'+ data.base + ' (' + base_coin_name + ')</td>';
					exchange_my_orders_tr += '<td>'+ data.rel + ' (' + rel_coin_name + ')</td>';
					exchange_my_orders_tr += '<td>' + data.bid + '</td>';
					exchange_my_orders_tr += '<td>' + data.ask + '</td>';
				exchange_my_orders_tr += '</tr>';
				$('.exchange_my_orders_tbl tbody').append(exchange_my_orders_tr);*/
			}
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

}


$('.trading_pair_coin').on('change', function (e) {
	var optionSelected = $("option:selected", this);
	var valueSelected = this.value;
	console.log(valueSelected);

	/*var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var charts_instruments_data = {}
	charts_instruments_data.symbol = coin+'/KMD'
	charts_instruments_data.company = 'Komodo Platform';
	ChartsInstruments(charts_instruments_data)
	UpdateDexChart(coin, this.value);*/

	//update_min_max_price_input();

});

$('.btn-refreshtrading_pair').click(function(e){
	e.preventDefault();
	console.log('btn-refreshtrading_pair clicked');
	console.log($(this).data());

	//update_min_max_price_input();
})

$('input[name=trading_pair_options]').change(function() {
	console.log('trading_pair_options changed');

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	console.log(buying_or_selling);

	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();
	console.log(bot_or_manual);

	var margin_or_fixed = $('#trading_pair_coin_autoprice_mode').prop('checked');

	if(buying_or_selling == 'buying') {
		if(bot_or_manual == 'tradeportfolio') {
			$('.trading_pair_lable_text_one').html('Auto')
			$('#trading_pair_coin_price_max_min').html('%');
			if(margin_or_fixed == true) {
				$('.btn-bot_action').html('SET AUTO BUY MARGIN %');
				$('.portfolio_info_text').html("Auto buy margin will make automatic buy orders on lower prices based on the specified percentage.");
			} else {
				$('.btn-bot_action').html('SET AUTO BUY PRICE');
				$('.portfolio_info_text').html("Auto buy on fixed price will make automatic buy orders on prices based on the specified price.");
			}
		} else {
			$('#trading_pair_coin_price_max_min').html('Max');
			$('.trading_pair_lable_text_one').html('Max');
			$('.btn-bot_action').html('BUY');
			$('.btn-bot_action').attr('data-action', 'buy');
			$('.relvol_basevol_label').html("It'll cost you")
		}
		$('.trading_pair_lable_text_two').html('Buy');
		$('.btn-bot_action').attr('data-action', 'buy');
		CheckOrderBookFn();
	}
	if(buying_or_selling == 'selling') {
		if(bot_or_manual == 'tradeportfolio') {
			$('.trading_pair_lable_text_one').html('Auto')
			$('#trading_pair_coin_price_max_min').html('%');
			if(margin_or_fixed == true) {
				$('.btn-bot_action').html('SET AUTO SELL MARGIN %');
				$('.portfolio_info_text').html("Auto sell margin will make automatic sell orders on higher prices based on the specified percentage.");
			} else {
				$('.btn-bot_action').html('SET AUTO SELL PRICE');
				$('.portfolio_info_text').html("Auto sell on fixed price will make automatic sell orders on prices based on the specified price.");
			}
		} else {
			$('#trading_pair_coin_price_max_min').html('Min');
			$('.trading_pair_lable_text_one').html('Min');
			$('.btn-bot_action').html('SELL');
			$('.btn-bot_action').attr('data-action', 'sell');
			$('.relvol_basevol_label').html("You'll get");
		}
		$('.trading_pair_lable_text_two').html('Sell');
		$('.btn-bot_action').attr('data-action', 'sell');
		CheckOrderBookFn();
	}
});

$('.trading_pair_coin').on('changed.bs.select', function (e) {
	$('.trading_pair_coin').selectpicker('val');
	$('.relvol_basevol_coin').html($('.trading_pair_coin').selectpicker('val'));
	bot_screen_sellcoin_balance();
	bot_screen_coin_balance();
});

$('.your_coins_balance_info').on('click', '.coin_balance_enable_native', function() {
	console.log('coin_balance_enable_native clicked');
	console.log($(this).data());

	enable_disable_coin($(this).data());
	bot_screen_sellcoin_balance();
	bot_screen_coin_balance();
});

$('.your_coins_balance_info').on('click', '.coin_balance_enable_electrum', function() {
	console.log('coin_balance_enable_electrum clicked');
	console.log($(this).data());

	enable_disable_coin($(this).data());
	bot_screen_sellcoin_balance();
	bot_screen_coin_balance();
});

$('.your_coins_balance_info').on('click', '.coin_balance_disable', function() {
	console.log('coin_balance_disable clicked');
	console.log($(this).data());

	enable_disable_coin($(this).data());
	bot_screen_sellcoin_balance();
	bot_screen_coin_balance();
});

$('.your_coins_balance_info').on('click', '.coin_balance_receive', function() {
	console.log('coin_balance_receive clicked');
	console.log($(this).data());
	coin = $(this).data('coin');

	var coin_name = return_coin_name(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin": coin};
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
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		}

		bootbox.dialog({
		    //title: 'A custom dialog with init',
		  onEscape: true,
		  backdrop: true,
			message: '<div style="text-align: center; margin-top: -40px;"><img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="border: 10px solid #fff;border-radius: 50px; background: #fff;"/></div><div style="text-align: center;"><div id="receive_addr_qrcode"></div><blockquote style="font-size: 15px; font-weight: 400; color: #c10a0a; background-color: #ffd5d5; #7d0b0b; border-left: 5px solid #f00;">If you are sending a transaction to your barterDEX smartaddress, then <b>please send 3 small transactions instead of 1 big transaction</b> for best experience.</blockquote><pre style="font-size: 18px;">'+data.coin.smartaddress+'</pre class="receive_addr_qrcode_addr"></div>'
		});

		var qrcode = new QRCode("receive_addr_qrcode");
		qrcode.makeCode(data.coin.smartaddress); // make another code.
		$('#receive_addr_qrcode > img').removeAttr('style');
		$('#receive_addr_qrcode > img').css('display', 'initial');
		$('#receive_addr_qrcode > img').css('border', '9px solid #f1f1f1','border-radius','5px','margin', '5px');
		$('#receive_addr_qrcode > img').css('border-radius','5px');
		$('#receive_addr_qrcode > img').css('margin', '5px');

	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});
})


$('.your_coins_balance_info').on('click', '.coin_balance_send', function() {
	console.log('coin_balance_send clicked');
	console.log($(this).data());

	var tx_coin = $(this).data('coin');

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data0 = {"userpass":userpass,"method":"getcoin","coin": tx_coin};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
		data: JSON.stringify(ajax_data0),
		dataType: 'json',
		type: 'POST',
		url: url
	}).done(function(data) {
		console.log(data.coin.balance);
		console.log(data.coin.txfee);
		var coin_balance_send_bootbox = bootbox.dialog({
			onEscape: true,
			backdrop: true,
			message: `
				<div class="row">
					<div class="col-sm-12">
						<div class="panel panel-default">
							<div class="panel-heading">
							<h3 class="panel-title"><strong>Send Transaction (<span class="bot_sending_coin_balance">`+data.coin.balance+`</span> `+ tx_coin+`)</strong></h3>
							</div>
							<div class="panel-body"> <!-- panel-body -->
								<div class="form-group">
									<div class="input-group col-sm-12">
										<span class="input-group-addon coin_ticker" style="font-size: 20px;">To Address</span>
										<input type="text" class="form-control" id="bot_send_toaddr" placeholder="Address" style="height: 64px; font-size: 20px;">
									</div>
								</div>
								<div class="form-group">
									<div class="input-group col-sm-12">
										<span class="input-group-addon coin_ticker" style="font-size: 20px;">Amount</span>
										<input type="number" class="form-control" id="bot_send_amount" placeholder="Amount e.g. 12.5" style="height: 64px; font-size: 20px;">
									</div>
								</div>
								<div class="form-group">
									<span class="input-group-addon">
										<input type="checkbox" id="bot_send_amount_txfee_checkbox" name="bot_send_amount_txfee_checkbox"> Subtract Transaction Fees from the sending amount?
									</span>
									<span class="input-group-addon" style="font-size: 20px;">TxFee: <span class="bot_send_txfee">`+data.coin.txfee / 100000000+`</span></span>
									<span class="input-group-addon" style="font-size: 20px;">Total: <span class="bot_send_total_amount"></span></span>
								</div>
							</div>
						</div>
					</div>
				</div>`,
			closeButton: false,
			size: 'large',
			className: 'custom_class_for_bootbox',

			buttons: {
				cancel: {
					label: "Cancel",
					className: 'btn-default',
					callback: function(){

					}
				},
				ok: {
					label: "Send Transaction",
					className: 'btn-primary bot_send_action',
					callback: function(){
						var to_addr = $('#bot_send_toaddr').val();
						//var send_amount = $('#bot_send_amount').val();
						var send_amount = $('.bot_send_total_amount').html();
						console.log(to_addr);
						console.log(send_amount);

						var output_data = {};
						output_data[to_addr] = send_amount;
						console.log(output_data);


						console.log(tx_coin);
						create_sendtx(tx_coin, output_data);
					}
				}
			}
		});
		coin_balance_send_bootbox.init(function(){
			console.log('coin_balance_send_bootbox dialog opened.')
			$('.bot_send_action').attr("disabled", "disabled");

			$('.bot_sending_coin_balance').click(function(){
				$('#bot_send_amount').val($('.bot_sending_coin_balance').html());
				var send_amount = $('#bot_send_amount').val();
				var send_txfee = $('.bot_send_txfee').html();
				var subtract_txfee = $('#bot_send_amount_txfee_checkbox').is(':checked')
				var send_toaddr = $('#bot_send_toaddr').val();
				console.log(send_amount);
				console.log(subtract_txfee);

				if(subtract_txfee == false) {
					var send_amount_total = parseFloat(send_amount) + parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				} else if (subtract_txfee == true) {
					var send_amount_total = parseFloat(send_amount) - parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				}

				var empty = false;
				if (send_toaddr.length == 0 || send_amount.length == 0) {
					console.log('Send Address is empty');
					console.log('Send Amount is empty');
					empty = true;
				} else if (send_toaddr.length !== 0 && send_amount.length !== 0) {
					console.log('SEND ADDRESS IS :' + send_toaddr);
					console.log('SEND AMOUNT IS :' + send_amount);
					empty = false;
				}
				console.log(empty);


				if (empty){
					$('.bot_send_action').attr("disabled", "disabled");
				} else {
					$('.bot_send_action').removeAttr("disabled");
				}
			});

			$('#bot_send_amount').keyup(function() {
				var send_amount = $('#bot_send_amount').val();
				var send_txfee = $('.bot_send_txfee').html();
				var subtract_txfee = $('#bot_send_amount_txfee_checkbox').is(':checked')
				var send_toaddr = $('#bot_send_toaddr').val();
				console.log(send_amount);
				console.log(subtract_txfee);

				if(subtract_txfee == false) {
					var send_amount_total = parseFloat(send_amount) + parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				} else if (subtract_txfee == true) {
					var send_amount_total = parseFloat(send_amount) - parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				}

				var empty = false;
				if (send_toaddr.length == 0 || send_amount.length == 0) {
					console.log('Send Address is empty');
					console.log('Send Amount is empty');
					empty = true;
				} else if (send_toaddr.length !== 0 && send_amount.length !== 0) {
					console.log('SEND ADDRESS IS :' + send_toaddr);
					console.log('SEND AMOUNT IS :' + send_amount);
					empty = false;
				}
				console.log(empty);


				if (empty){
					$('.bot_send_action').attr("disabled", "disabled");
				} else {
					$('.bot_send_action').removeAttr("disabled");
				}

			});

			$('#bot_send_amount_txfee_checkbox').change(function(){
				var send_amount = $('#bot_send_amount').val();
				var send_txfee = $('.bot_send_txfee').html();
				var subtract_txfee = $('#bot_send_amount_txfee_checkbox').is(':checked')
				var send_toaddr = $('#bot_send_toaddr').val();
				console.log(send_amount);
				console.log(subtract_txfee);

				if(subtract_txfee == false) {
					var send_amount_total = parseFloat(send_amount) + parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				} else if (subtract_txfee == true) {
					var send_amount_total = parseFloat(send_amount) - parseFloat(send_txfee);
					$('.bot_send_total_amount').html(send_amount_total.toFixed(8));
				}

				var empty = false;
				if (send_toaddr.length == 0 || send_amount.length == 0) {
					console.log('Send Address is empty');
					console.log('Send Amount is empty');
					empty = true;
				} else if (send_toaddr.length !== 0 && send_amount.length !== 0) {
					console.log('SEND ADDRESS IS :' + send_toaddr);
					console.log('SEND AMOUNT IS :' + send_amount);
					empty = false;
				}
				console.log(empty);


				if (empty){
					$('.bot_send_action').attr("disabled", "disabled");
				} else {
					$('.bot_send_action').removeAttr("disabled");
				}
			});


		});
	});

});

$('.your_coins_balance_info').on('click', '.coin_balance_inventory', function() {
	console.log('coin_balance_inventory clicked');
	console.log($(this).data());
	coin = $(this).data('coin');
	addr = $(this).data('addr');
	balance = $(this).data('balance');


	$('.screen-exchange').hide()
	$('.screen-inventory').show();
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);

	$('.inventory-title').html('Manage Inventory ('+balance+' '+coin+')');
	$('.inventory-title').data('coin', coin);
	$('.inventory-title').data('balance', balance);
	$('.coininventory[data-coin]').attr('data-coin', coin);
	//$('.coininventory[data-coin]').attr('data-pair', $(this).data('pair'));
	$('.coininventory[data-coin]').attr('data-addr', addr);
	$('.inventory-sliderTotalCoin').html(' '+coin);

	$('.dex_showinv_alice_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');
	$('.dex_showlist_unspents_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');

	check_coin_inventory(coin);
	check_coin_listunspent($(this).data());

	calc_data = {"coin": coin, "balance": balance};
	clac_coin_inventory(calc_data);

});




function create_sendtx(coin,tx_data){
	console.log(tx_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"withdraw","coin": coin, "outputs": [tx_data]};
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);
	console.log(JSON.stringify(ajax_data));


	$.ajax({
		async: true,
		data: JSON.stringify(ajax_data),
		dataType: 'json',
		type: 'POST',
		url: url
	}).done(function(data) {
		// If successful
		console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);
		} else {
			if (data.complete == true) {
				console.log(data.hex);
				if (!data.hasOwnProperty('coin')) { data.coin = coin; }
				bot_sendrawtx(data);
			} else {
				toastr.error('Transaction did not complete. Please try again.', 'Transaction Info');
			}
		}

	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});
}


function update_min_max_price_input(){
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();

	if(buying_or_selling == 'buying') {
		var base_coin = coin;
		var rel_coin = $('.trading_pair_coin').selectpicker('val');
	}
	if(buying_or_selling == 'selling') {
		var base_coin = $('.trading_pair_coin').selectpicker('val');
		var rel_coin = coin;
	}

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	$('.orderbook_rel_coin').html(rel_coin);
	$('.orderbook_base_coin').html(base_coin);

	var ajax_data = {"userpass":userpass,"method":"orderbook","base":base_coin,"rel":rel_coin};
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			//get_coins_list(data.coins);
		} else {
			//console.log(data.asks);
			if(buying_or_selling == 'buying') {
				$('.trading_pair_coin_price').val(data.asks[0].price);
			}
			if(buying_or_selling == 'selling') {
				$('.trading_pair_coin_price').val(data.bids[0].price);
			}
		}

	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function check_bot_list(sig) {
	if (sig == false) {
		clearInterval(check_bot_list_Interval);
		return
	} else {
		console.log('checking bot list');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"bot_statuslist"};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);

		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		} else {
			$('.exchange_bot_list_tbl tbody').empty();
			$.each(data, function(index, val) {
				//console.log(index);
				//console.log(val);
				if(!val.error === false) {
					var exchange_bot_list_tr = '';
					exchange_bot_list_tr += '<tr>';
					exchange_bot_list_tr += '<td><div>error</div></td>';
					exchange_bot_list_tr += '<td>-</td>';
					exchange_bot_list_tr += '</tr>';
					$('.exchange_bot_list_tbl tbody').append(exchange_bot_list_tr);
				} else {

					function botProgressBar(){
						var trades = val.trades;
						//console.log(trades);
						var _out = {};
						_out.total = 0;
						for (let i = 0; i < trades.length; i++) {
							//console.log(_out.total);
							if(!isNaN(trades[i].volume)){
								_out.total += trades[i].volume;
							}
						}

						_out.percent = (_out.total / val.totalbasevolume) * 100
						//console.log(_out.total);
						return _out
					}

					var bot_progress_data = botProgressBar();

					if (!val.paused === false) {
						var disable_resume_btn = ' ';
						var disable_pause_btn = 'disabled="disabled"';
					} else {
						var disable_resume_btn = 'disabled="disabled"';
						var disable_pause_btn = ' ';
					}
					if (!val.stopped === false) {
						var disable_stop_btn = 'disabled="disabled"';
					} else {
						var disable_stop_btn = ' ';
					}

					if (!val.minprice === false){
						var max_min_val = val.minprice;
					}
					if (!val.maxprice === false){
						var max_min_val = val.maxprice;
					}

					var exchange_bot_list_tr = '';
					exchange_bot_list_tr += '<tr>';
						//exchange_bot_list_tr += '<td>'+val.botid+'</td>';
						exchange_bot_list_tr += `<td style="font-size: 14px; font-weight: 200;">
													<span><font style="font-weight: 400;">`+val.name+`</font></span><br>
													<span><font style="font-weight: 400;">Max Price:</font> `+ max_min_val +` `+val.rel+`</span><br>
													<span><font style="font-weight: 400;">Total Spending:</font> `+val.totalrelvolume+` `+val.rel+`</span>
												</td>`;
						//exchange_bot_list_tr += '<td>'+val.action+'</td>';
						//exchange_bot_list_tr += '<td>'+max_min_val+'</td>';
						//exchange_bot_list_tr += '<td>'+val.totalrelvolume+'</td>';
						exchange_bot_list_tr += `<td>
													<div style="font-size: 14px; font-weight: 200;">
													<span><font style="font-weight: 400;">Total to Buy:</font> `+val.totalbasevolume+` `+val.base+`</span><br>
													<!--<span><font style="font-weight: 400;">Total Bought:</font> `+ bot_progress_data.total.toFixed(8) +` `+val.base+`</span><br>-->
													<span><font style="font-weight: 400;">Trade Attempts:</font> `+val.trades.length+`</span>
													</div>
												</td>`;
						exchange_bot_list_tr += '<td style="text-align: center;"><div class="btn-group"><button class="btn btn-sm btn-info btn_bot_status" data-botid="' + val.botid + '" data-action="status"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></button><button class="btn btn-sm btn-success btn_bot_resume" data-botid="' + val.botid + '" data-action="resume" ' + disable_resume_btn + '><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button><button class="btn btn-sm btn-warning btn_bot_pause" data-botid="' + val.botid + '" data-action="pause" ' + disable_pause_btn + '><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></button><button class="btn btn-sm btn-danger btn_bot_stop" data-botid="' + val.botid + '" data-action="stop" ' + disable_stop_btn + '><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button></div></td>';
					exchange_bot_list_tr += '</tr>';
					/*exchange_bot_list_tr += '<tr>'; // bot progress bar disabled
						exchange_bot_list_tr += '<td colspan="5" style="padding: 0;"><div class="progress progress-nomargin"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="' + bot_progress_data.percent.toFixed(2) + '" aria-valuemin="0" aria-valuemax="100" style="-webkit-transition: none !important; transition: none !important; width: ' + bot_progress_data.percent.toFixed(2) + '%; text-shadow: 0px 0px 5px rgba(150, 150, 150, 1);">' + bot_progress_data.percent.toFixed(2) + '%</div></div></td>';
					exchange_bot_list_tr += '</tr>';*/
					$('.exchange_bot_list_tbl tbody').append(exchange_bot_list_tr);
				}
			})
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function buy_sell_precheck(bot_data){
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	var bot_or_manual = $('input[name=trading_mode_options]:checked').val();

	var base_coin = coin;
	var rel_coin = $('.trading_pair_coin').selectpicker('val');

	console.log('BOT OR MANUAL: ' + bot_or_manual);
	console.log('BUYING or SELLING??: ' + buying_or_selling);
	console.log('BASE: ' + base_coin);
	console.log('REL: '+ rel_coin);

	if (base_coin == 'BTC' || rel_coin == 'BTC') {
		console.log("BTC found in trading pair. Confirming BTC tx fee before proceeding.");

		var userpass = sessionStorage.getItem('mm_userpass');
		var ajax_data0 = {"userpass":userpass,"method":"getcoin","coin": 'BTC'};
		var url = "http://127.0.0.1:7783";

		$.ajax({
			async: true,
			data: JSON.stringify(ajax_data0),
			dataType: 'json',
			type: 'POST',
			url: url
		}).done(function(data) {
			//console.log(data.coin.txfee);

			if (!data.error === true && data.error !== 'coin is disabled') {
				toastr.error(data.error, 'Order precheck info');
				if (data.coin.txfee >= 100000) {
					bootbox.alert("Bitcoin Transaction Fee is too high <b>"+ data.coin.txfee / 100000000 + "</b><br> Due to such high BTC transaction fee this order is being stopped to process, since it may affect the completion of this order. Please try agin when Bitcoin transaction fee is lower.");
					return;
				} else if (data.coin.txfee >= 50000) {
					bootbox.confirm({
						message: "Bitcoin Transaction Fee is high <b>"+ data.coin.txfee / 100000000 + "</b><br>It is not recommended to go with your order with such high fees. It may take longer to confirm the transaction and that may affect your order completion. Are you sure you want to continue?",
						buttons: {
							confirm: {
								label: 'Yes',
								className: 'btn-success'
							},
							cancel: {
								label: 'No',
								className: 'btn-danger'
							}
						},
						callback: function (result) {
							console.log('This was logged in the callback: ' + result);
							if (result == true) {
								toastr.success('Okay! Proceeding with your order.','Order Notification');
								if (bot_or_manual == 'tradebot') {
									bot_buy_sell(bot_data);
								} else if (bot_or_manual == 'trademanual') {
									manual_buy_sell(bot_data);
								}
							} else {
								toastr.info('Your oder has been stopped to process.', 'Order Notification');
								return;
							}
						}
					});
				} else {
					console.log("BTC transaction fee seems OK. Proceeding with trade.")
					toastr.success('BTC transaction fee seems OK. Proceeding with trade.', 'Order Notification');
					if (bot_or_manual == 'tradebot') {
						bot_buy_sell(bot_data);
					} else if (bot_or_manual == 'trademanual') {
						manual_buy_sell(bot_data);
					}
				}
			} else {
				toastr.info('Make sure Bitcoin wallet is enabled and running.');
			}
		});
	} else {
		console.log("Trading pair doesn't have BTC in it. Precheck done.")
		toastr.success('Placing Order', 'Order Notification');
		if (bot_or_manual == 'tradebot') {
			bot_buy_sell(bot_data);
		} else if (bot_or_manual == 'trademanual') {
			manual_buy_sell(bot_data);
		}
	}
}

function bot_buy_sell(bot_data) {
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var buying_or_selling = $('input[name=trading_pair_options]:checked').val();

	var base_coin = coin;
	var rel_coin = $('.trading_pair_coin').selectpicker('val');

	console.log('BUYING or SELLING??: ' + buying_or_selling);
	console.log('BASE: ' + base_coin);
	console.log('REL: '+ rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	if (bot_data.action == 'buy') {
		var ajax_data = {"userpass":userpass,"method":"bot_buy","base":base_coin,"rel":rel_coin,"maxprice":bot_data.price,"relvolume":bot_data.volume};
	}
	if (bot_data.action == 'sell') {
		var ajax_data = {"userpass":userpass,"method":"bot_sell","base":base_coin,"rel":rel_coin,"minprice":bot_data.price,"basevolume":bot_data.volume};
	}

	console.log(ajax_data);

	console.log(JSON.stringify(ajax_data));

	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(bot_output_data) {
		// If successful
		console.log(bot_output_data);

		$('.trading_pair_coin_price').val('');
		$('.trading_pair_coin_volume').val('');
		$('.relvol_basevol').html('');

		if (!bot_output_data.error === false) {
			toastr.error(bot_output_data.error, 'Bot Info');
			if (bot_output_data.error == 'not enough funds') {
				//toastr.info(bot_output_data.error + '<br>Balance: ' + bot_output_data.balance + ' ' + bot_output_data.coin, 'Bot Info');
				bootbox.alert({
					backdrop: true,
					onEscape: true,
					title: `Looks like you don't have enough UTXOs in your balance.`,
					message: `<p>Not a problem. I have executed the recommended command to make required UTXOs for you.</p>
					<p>If you see the message saying "Executed Auto Split Funds", then please wait for approx. 30 seconds to 1 minute before trying again.</p>
					<p>If you see some outgoing transactions from your barterDEX smartaddress that's sent to the same smartaddress of yours to create some inventory transactions for barterDEX to make required trades.<br>
					Please try in a moment with same or different volume and you should be all good to go.</p>
					<p>If you are still getting the same error again, here are few things you can try:</>
					<ul>
					<li>Please try the "Inventory" button under the coin's logo where you see it's balance.<br>
					That will give you good overview what exactly UTXO means and what you need to do to fix this error.</li>
					<li>Try lower amount of buy which makes final cost in total lower.</li>
					<li>Logout and login back and try lower amount of buy counts total cost lower than previous attempt.</li>
					</ul>`});
				console.log(JSON.stringify(bot_output_data))

				if (bot_output_data.withdraw.complete === true) {
					bot_sendrawtx(bot_output_data);
					toastr.success('Executed Auto Split Funds. Please try in approx. 30 seconds again.', 'Bot Info');
				} else {
					toastr.error('No withdraw info found. Please try again with lower buy amount.', 'Bot Info');
				}
			}
		} else if (bot_output_data.result == 'success') {
			toastr.success(bot_output_data.name + ' started <br> Bot ID: ' + bot_output_data.botid, 'Bot Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	check_bot_list();
}

function bot_sendrawtx(bot_sendrawtx_data) {
	console.log(bot_sendrawtx_data);
	if (bot_sendrawtx_data.hasOwnProperty('withdraw')) { console.log(bot_sendrawtx_data.withdraw.hex); }
	var coin = bot_sendrawtx_data.coin;
	console.log(coin);



	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"sendrawtransaction","coin": coin, "signedtx": (bot_sendrawtx_data.hasOwnProperty('withdraw') ? bot_sendrawtx_data.withdraw.hex : bot_sendrawtx_data.hex) };
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);
	console.log(JSON.stringify(ajax_data));

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    //dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(bot_sendrawtx_output_data) {
		// If successful
		console.log(bot_sendrawtx_output_data);
		var parsed_bot_sendrawtx_output_data = '';
		try {
			parsed_bot_sendrawtx_output_data = JSON.parse(bot_sendrawtx_output_data);
			console.log(parsed_bot_sendrawtx_output_data);

			if ( !parsed_bot_sendrawtx_output_data.hasOwnProperty('error') === false && parsed_bot_sendrawtx_output_data.error === false) {
				toastr.error(parsed_bot_sendrawtx_output_data.error.message, 'Transaction Info');
			} else if (parsed_bot_sendrawtx_output_data.result == null) {
				bootbox.alert('<p>Error making withdraw transaction: </p><br>' + JSON.stringify(parsed_bot_sendrawtx_output_data.error, null, 2));
			} else if (parsed_bot_sendrawtx_output_data.result == 'success') {
				toastr.info('Low no. of UTXOs<br>Please try again in 1 Minute.', 'Transaction Status');
			}
		} catch(e) {
			console.log(e);
			var txid_explorer = '';
			if(coin == 'MNZ') {
				txid_explorer = 'https://www.mnzexplorer.com/tx/'
			} else if(coin == 'KMD') {
				txid_explorer = 'https://www.kmd.host/tx/'
			} else if(coin == 'BTC') {
				txid_explorer = 'https://www.blocktrail.com/BTC/tx/'
			} else if(coin == 'ZEC') {
				txid_explorer = 'https://zchain.online/tx/'
			}

			bootbox.alert(`Transaction Sent Successfully. Here's the Transaction ID:<br>
				<a href="#" onclick="shell.openExternal('`+txid_explorer+bot_sendrawtx_output_data+`'); return false;">` + bot_sendrawtx_output_data + `</a>`);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}




function bot_stop_pause_resume(bot_data) {
	console.log(bot_data);
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');

	if (bot_data.action == 'pause') {
		var ajax_data = {"userpass":userpass,"method":"bot_pause","botid":bot_data.botid};
		var action_result = 'paused';
	}
	if (bot_data.action == 'resume') {
		var ajax_data = {"userpass":userpass,"method":"bot_resume","botid":bot_data.botid};
		var action_result = 'resumed';
	}
	if (bot_data.action == 'stop') {
		var ajax_data = {"userpass":userpass,"method":"bot_stop","botid":bot_data.botid};
		var action_result = 'stopped';
	}

	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);

		if (!data.error === false) {
			toastr.error(data.error, 'Bot Info');
		} else if (data.result == 'success') {
			toastr.success('Bot ID: ' + bot_data.botid + ' ' + action_result, 'Bot Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	check_bot_list();
}

function bot_settings(bot_data) {
	console.log(bot_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"bot_settings","botid":bot_data.botid,"newprice":bot_data.newprice,"newvolume":bot_data.newvolume};

	console.log(ajax_data);

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

		if (!data.error === false) {
			toastr.error(data.error, 'Bot Info');
		} else if (data.result == 'success') {
			toastr.success('Bot ID: ' + bot_data.botid + ' Updateded', 'Bot Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	check_bot_list();
}


function bot_status(bot_data) {
	console.log(bot_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"bot_status","botid":bot_data.botid};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		console.log(data);

		if (!data.error === false) {
			toastr.error(data.error, 'Bot Info');
		} else if (data.result == 'success') {

			var max_min = null;
			var max_min_val = null;
			if (!data.minprice === false){
				max_min = 'Minimum';
				max_min_val = data.minprice;
			}
			if (!data.maxprice === false){
				max_min = 'Maximum';
				max_min_val = data.maxprice;
			}

			result_answer = (data.result == 'success') ? '<h4><span class="label label-success"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Success</span></h4>' : '<h4><span class="label label-danger"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> ' + data.result + '</span></h4>';
			rel_answer = '<img src="img/cryptologo/'+data.rel.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.rel) + ' ('+data.rel+')';
			base_answer = '<img src="img/cryptologo/'+data.base.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.base) + ' ('+data.base+')';

			rel_form = '<img src="img/cryptologo/'+data.rel.toLowerCase()+'.png" style="width: 50px;"> '+ data.rel;
			base_form = '<img src="img/cryptologo/'+data.base.toLowerCase()+'.png" style="width: 50px;"> '+ data.base;

			buy_sell_text = (data.action == 'buy') ? 'Buy' : 'Sell';
			max_min_text = (data.action == 'buy') ? 'Max' : 'Min';

			// "tradeid": 1750749844, "price": 0.13749702, "volume":

			function renderTradeAttempts(trades) {
				if (trades &&
						trades.length) {
					let _out = {
						request: '',
						trade: '',
						requestNonEmpty: false,
						tradeNonEmpty: false,
					};

					_out.request = `<table width="100%" class="table table-striped">
												<tr>
													<th>Request ID</th>
													<th>Quote ID</th>`;

					for (let i = 0; i < trades.length; i++) {
						if (trades[i].requestid) {
							_out.requestNonEmpty = true;
							_out.request += `<tr>
																<td>${trades[i].requestid}</td>
																<td>${trades[i].quoteid}</td>
															</tr>`;
						}
					}

					_out.request += `</table>`;

					_out.trade = `<table width="100%" class="table table-striped">
												<tr>
													<th>Trade ID</th>
													<th>Status</th>
													<th>Price</th>
													<th>Volume</th>`;

					for (let i = 0; i < trades.length; i++) {
						if (trades[i].tradeid) {
							_out.tradeNonEmpty = true;

							var trade_status = ''
							var trade_price = ''
							var trade_volume = ''
							if (!trades[i].status == true) {
								trade_status = '-'
								trade_price = '-';
								trade_volume = '-';
							} else {
								trade_status = trades[i].status;
								if (trades[i].status !== 'pending') {
									trade_price = trades[i].price;
									trade_volume = trades[i].volume;
								} else {
									trade_price = '-';
									trade_volume = '-';
								}
							}
							console.log(trade_price);
							console.log(trade_volume);

							_out.trade += `<tr>
												<td>${trades[i].tradeid}</td>
												<td>${trade_status}</td>
												<td>${trade_price}</td>
												<td>${trade_volume}</td>
											</tr>`;
						}
					}

					_out.trade += `</table>`;

					return (_out.requestNonEmpty ? _out.request : '') + (_out.tradeNonEmpty ? _out.trade : '');
				} else {
					return '';
				}
			}

			var bot_update_bootbox = bootbox.dialog({
				backdrop: true,
				onEscape: true,
				message: `
					<table width="100%" class="table table-striped">
						<tr>
							<td style="width: 150px;">Auto Trader ID</td>
							<td>` + data.botid + `</td>
						</tr>
						<tr>
							<td>Auto Trade Name</td>
							<td>` + data.name + `</td>
						</tr>
						<tr>
							<td>Trade Action</td>
							<td>` + data.action + `</td>
						</tr>
						<tr>
							<td>Selling Currency</td>
							<td>` + rel_answer + `</td>
						</tr>
						<tr>
							<td>Buying Currency</td>
							<td>` + base_answer + `</td>
						</tr>
						<tr>
							<td>` + max_min + ` Price</td>
							<td>` + max_min_val + ` ` + data.rel + `</td>
						</tr>
						<tr>
							<td>Total Selling Volume</td>
							<td>` + data.totalrelvolume + ` ` + data.rel + `</td>
						</tr>
						<tr>
							<td>Total Buying Volume</td>
							<td>` + data.totalbasevolume + ` ` + data.base + `</td>
						</tr>
						<tr>
							<td>Result</td>
							<td>` + result_answer + `</td>
						</tr>
						<tr>
							<td>Trades Attempts</td>
							<td><div style="max-height: 450px; overflow-y: scroll;">` + renderTradeAttempts(data.trades) + `</div></td>
						</tr>
					</table>

					<div class="row">
						<div class="col-sm-12">
							<div class="panel panel-default">
								<div class="panel-heading">
								<h3 class="panel-title"><strong>Change This Auto Trade's Settings</strong></h3>
								</div>
								<div class="panel-body"> <!-- panel-body -->

									<div class="form-group">
										<span style="float: right; font-size: 18px;"><span>New ` + max_min_text + `</span> Price to <span>` + buy_sell_text + `</span></span>
									</div>
									<div class="input-group col-sm-12">
										<span class="input-group-addon">` + rel_form + `</span>
										<input type="number" class="form-control trading_pair_coin_newprice" placeholder="Price e.g. 0.01" style="height: 64px; font-size: 20px;">
										<span class="input-group-addon" id="trading_pair_coin_price_max_min_update" style="font-size: 20px;">` + max_min_text + `</span>
									</div>
									<div class="form-group" style="margin-top: 15px; margin-bottom: 0px;">
										<span style="font-size: 18px;"><span>New Max</span> Amount to <span>` + buy_sell_text + `</span></span>
									</div>
									<div class="input-group col-sm-12">
										<span class="input-group-addon coin_ticker" id="trading_pair_coin_ticker" style="font-size: 20px;">` + base_form + `</span>
										<input type="number" class="form-control trading_pair_coin_newvolume" placeholder="Amount e.g. 12.5" style="height: 64px; font-size: 20px;">
									</div>
									<div class="input-group col-sm-12">
										<span class="input-group-addon" style="font-size: 30px; font-weight: 200; border: 0; background-color: #fff;">It'll cost you</span>
										<span class="input-group-addon" style="font-size: 40px; font-weight: 100; border: 0; background-color: #fff;"><span class="new_relvol_basevol">0</span> <span style="font-size: 25px; background-color: #fff; font-weight: 100;">` + data.rel.toUpperCase() + `</span></span>
									</div>


								</div>
							</div>
						</div>
					</div>`,
				closeButton: true,
				size: 'large',

				buttons: {
					cancel: {
						label: "Close",
						className: 'btn-default',
						callback: function(){

						}
					},
					ok: {
						label: "Update",
						className: 'btn-primary btn-bot_settings_update',
						callback: function(){
							//console.log($('.trading_pair_coin_newprice').val())
							//console.log($('.trading_pair_coin_newvolume').val())
							//console.log(data.rel);
							//console.log(data.base);

							var newmaxprice = $('.trading_pair_coin_newprice').val();
							var newbasevol = $('.trading_pair_coin_newvolume').val();
							var newrelvolume = newmaxprice * newbasevol;

							bot_update_data = {}
							bot_update_data.rel = data.rel;
							bot_update_data.base = data.base;
							bot_update_data.botid = data.botid;
							bot_update_data.newprice = newmaxprice;
							bot_update_data.newvolume = newrelvolume;

							//console.log(bot_update_data);

							bot_settings(bot_update_data);

						}
					}
				}
			});
			bot_update_bootbox.init(function(){
				console.log('bot_update_settings dialog opened.')
				$('.btn-bot_settings_update').attr("disabled", "disabled");
				$('.trading_pair_coin_newprice').inputNumber();
				$('.trading_pair_coin_newvolume').inputNumber();


				$('.trading_pair_coin_newprice').keyup(function() {

					var newmaxprice = $('.trading_pair_coin_newprice').val();
					var newbasevol = $('.trading_pair_coin_newvolume').val();
					var newrelvolume = newmaxprice * newbasevol;

					$('.new_relvol_basevol').html(newrelvolume.toFixed(8));

					var max_min_newprice = $('.trading_pair_coin_newprice')
					var max_newvolume = $('.trading_pair_coin_newvolume')

					var empty = false;
					if (max_min_newprice.val().length == 0 ) {
						console.log('new price is empty');
						empty = true;
					} else if (max_min_newprice.val().length !== 0 ) {
						console.log('NEW PRICE IS :' + max_min_newprice.val());
						empty = false;
					}
					console.log(empty);


					if (empty){
						$('.btn-bot_settings_update').attr("disabled", "disabled");
					} else {
						$('.btn-bot_settings_update').removeAttr("disabled");
					}

				});

				$('.trading_pair_coin_newvolume').keyup(function() {

					var newmaxprice = $('.trading_pair_coin_newprice').val();
					var newbasevol = $('.trading_pair_coin_newvolume').val();
					var newrelvolume = newmaxprice * newbasevol;

					$('.new_relvol_basevol').html(newrelvolume.toFixed(8));

					var max_min_newprice = $('.trading_pair_coin_newprice')
					var max_newvolume = $('.trading_pair_coin_newvolume')

					var empty = false;
					if (max_newvolume.val().length == 0 ) {
						console.log('new price is empty');
						empty = true;
					} else if (max_newvolume.val().length !== 0 ) {
						console.log('NEW PRICE IS :' + max_newvolume.val());
						empty = false;
					}
					console.log(empty);


					if (empty){
						$('.btn-bot_settings_update').attr("disabled", "disabled");
					} else {
						$('.btn-bot_settings_update').removeAttr("disabled");
					}

				});


			});

			//toastr.success('Bot ID: ' + bot_data.botid + ' ' + bot_data.action + ' presented.', 'Bot Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	check_bot_list();
}

function bot_screen_sellcoin_balance(sig) {
	if (sig == false) {
		clearInterval(bot_screen_sellcoin_balance_Interval);
		return
	} else {
		console.log('checking bot screen coin balance');
	}

	coin = $('.trading_pair_coin').selectpicker('val');
	console.log(coin);

	var coin_name = return_coin_name(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin": coin};
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
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			bot_screen_sellcoin_balance();
		} else {
			if (!data.error === false && data.error === 'coin is disabled') {
				var button_controls = `<br>
				<span>
					<button class="btn btn-primary btn-xs coin_balance_enable_native" style="margin-top: 6px; margin-right: 3px;" data-electrum=true data-method="enable" data-coin="` + coin + `">Enable Native</button>
					<button class="btn btn-warning btn-xs coin_balance_enable_electrum" style="margin-top: 6px;" data-electrum=false data-method="enable" data-coin="` + coin + `">Enable Electrum</button>
				</span>`;
				$('.trading_sellcoin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(coin) + ' ('+coin+')'+button_controls);
				$('.trading_sellcoin_balance').html('Coin is disabled');
				$('#balance-spinner').hide();
				$('.balance-block').show();
			} else {
				//console.warn(data.coin)
				var coin_mode = '';
				if (data.coin.hasOwnProperty('electrum')) {
					coin_mode = '<i class="fa fa-bolt" data-toggle="tooltip" data-placement="top" title="Electrum Mode"></i>'
				} else {
					coin_mode = '<i class="fa fa-shield" data-toggle="tooltip" data-placement="top" title="Native Mode"></i>'
				}
				var button_controls = `<br>
				<span>
					<button class="btn btn-danger btn-xs coin_balance_disable" style="margin-top: 6px;" data-electrum=true data-method="disable" data-coin="` + coin + `">Disable</button>
					<button class="btn btn-warning btn-xs coin_balance_receive" style="margin-top: 6px;" data-coin="` + coin + `">Receive</button>
					<button class="btn btn-success btn-xs coin_balance_send" style="margin-top: 6px;" data-coin="` + coin + `">Send</button>
					<button class="btn btn-info btn-xs coin_balance_inventory" style="margin-top: 6px;" data-coin="` + coin + `" data-addr="` + data.coin.smartaddress + `" data-balance="` + data.coin.balance + `">Inventory</button>
				</span>`;
				$('.trading_sellcoin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(coin) + ' ('+coin+') <small style="vertical-align: top; margin-left: 10px">' + coin_mode + '</small>'+button_controls);
				if (data.coin.hasOwnProperty('electrum')) {
					var electrum_coin_balance_data = {};
					electrum_coin_balance_data.baserel = 'rel';
					electrum_coin_balance_data.coin = coin;
					electrum_coin_balance_data.smartaddress = data.coin.smartaddress;
					electrum_coin_balance(electrum_coin_balance_data);
					//$('.trading_sellcoin_balance').html(data.coin.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + data.coin.smartaddress + '</span>');
				} else {
					$('.trading_sellcoin_balance').html(data.coin.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + data.coin.smartaddress + '</span>');
				}
				$('#balance-spinner').hide();
				$('.balance-block').show();
			}
		}

	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});
}

function bot_screen_coin_balance(sig) {
	if (sig == false) {
		clearInterval(bot_screen_coin_balance_Interval);
		return
	} else {
		console.log('checking bot screen coin balance');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var coin_name = return_coin_name(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin": coin};
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
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
			bot_screen_coin_balance();
		} else {
			if (!data.error === false && data.error === 'coin is disabled') {
				var button_controls = `<br>
				<span>
					<button class="btn btn-primary btn-xs coin_balance_enable_native" style="margin-top: 6px; margin-right: 3px;" data-electrum=true data-method="enable" data-coin="` + coin + `">Enable Native</button>
					<button class="btn btn-warning btn-xs coin_balance_enable_electrum" style="margin-top: 6px;" data-electrum=false data-method="enable" data-coin="` + coin + `">Enable Electrum</button>
				</span>`;
				$('.trading_coin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(coin) + ' ('+coin+')'+button_controls);
				$('.trading_coin_balance').html('Coin is disabled');
			} else {
				var coin_mode = '';
				//console.warn(data.coin)
				if (data.coin.hasOwnProperty('electrum')) {
					coin_mode = '<i class="fa fa-bolt" data-toggle="tooltip" data-placement="top" title="Electrum Mode"></i>'
				} else {
					coin_mode = '<i class="fa fa-shield" data-toggle="tooltip" data-placement="top" title="Native Mode"></i>'
				}
				var button_controls = `<br>
				<span>
					<button class="btn btn-danger btn-xs coin_balance_disable" style="margin-top: 6px;" data-electrum=true data-method="disable" data-coin="` + coin + `">Disable</button>
					<button class="btn btn-warning btn-xs coin_balance_receive" style="margin-top: 6px;" data-coin="` + coin + `">Receive</button>
					<button class="btn btn-success btn-xs coin_balance_send" style="margin-top: 6px;" data-coin="` + coin + `">Send</button>
					<button class="btn btn-info btn-xs coin_balance_inventory" style="margin-top: 6px;" data-coin="` + coin + `" data-addr="` + data.coin.smartaddress + `" data-balance="` + data.coin.balance + `">Inventory</button>
				</span>`;
				$('.trading_coin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(coin) + ' ('+coin+') <small style="vertical-align: top; margin-left: 10px">' + coin_mode + '</small>'+button_controls);
				if (data.coin.hasOwnProperty('electrum')) {
					var electrum_coin_balance_data = {};
					electrum_coin_balance_data.baserel = 'base';
					electrum_coin_balance_data.coin = coin;
					electrum_coin_balance_data.smartaddress = data.coin.smartaddress;
					electrum_coin_balance(electrum_coin_balance_data);
					//$('.trading_coin_balance').html(data.coin.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + data.coin.smartaddress + '</span>');
				} else {
					$('.trading_coin_balance').html(data.coin.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + data.coin.smartaddress + '</span>');
				}
			}

			//$('.trading_coin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(coin) + ' ('+coin+')');
			//$('.trading_coin_balance').html(data.coin.balance + ' <span style="font-size: 80%; font-weight: 100;">' + coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + data.coin.smartaddress + '</span>');
		}

	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});
}


function electrum_coin_balance(coin_balance_data) {
	console.log(coin_balance_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"balance","coin":coin_balance_data.coin,"address":coin_balance_data.smartaddress};
	var url = "http://127.0.0.1:7783/";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(coin_balance_output_data) {
		// If successful
		console.log(coin_balance_output_data);
		if(coin_balance_data.baserel == 'base'){
			$('.trading_coin_balance').html(coin_balance_output_data.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin_balance_data.coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + coin_balance_data.smartaddress + '</span>');
		}
		if(coin_balance_data.baserel == 'rel'){
			$('.trading_sellcoin_balance').html(coin_balance_output_data.balance + ' <span style="font-size: 60%; font-weight: 100;">' + coin_balance_data.coin + '</span><br><span style="font-size: 50%; font-weight: 200;">' + coin_balance_data.smartaddress + '</span>');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

}

/* Auto Trading Bot END */



/* Swap Status */

$('.btn-swapstatusrefresh').click(function() {
	check_swap_status();
})


$('.exchange_swap_status_tbl tbody').on('click', '.swapstatus_details', function() {
	console.log('swapstatus details button clicked')
	console.log($(this).data());

	check_swap_status_details($(this).data());
});


function check_swap_status_details(swap_status_data) {
	console.log(swap_status_data);

	var requestid = swap_status_data.requestid;
	var quoteid = swap_status_data.quoteid;
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"swapstatus","requestid":requestid,"quoteid":quoteid};
	var url = "http://127.0.0.1:7783/";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(swap_status_output_data) {
		// If successful
		console.log(swap_status_output_data);

		if (!swap_status_output_data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(swap_status_output_data.coins));
			sessionStorage.setItem('mm_userpass', swap_status_output_data.userpass);
			sessionStorage.setItem('mm_mypubkey', swap_status_output_data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		} else {
			result_answer = (swap_status_output_data.result == 'success') ? '<h4><span class="label label-success"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Success</span></h4>' : '<h4><span class="label label-danger"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> ' + swap_status_output_data.result + '</span></h4>';
			alice_answer = '<img src="img/cryptologo/'+swap_status_output_data.alice.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(swap_status_output_data.alice) + ' ('+swap_status_output_data.alice+')';
			bob_answer = '<img src="img/cryptologo/'+swap_status_output_data.bob.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(swap_status_output_data.bob) + ' ('+swap_status_output_data.bob+')';
			iambob_answer = (swap_status_output_data.iambob == 0) ? 'Buyer' : 'Seller';


			var bob_explorer = '';
			if(swap_status_output_data.bob == 'MNZ') {
				bob_explorer = 'https://www.mnzexplorer.com/tx/'
			} else if(swap_status_output_data.bob == 'KMD') {
				bob_explorer = 'https://www.kmd.host/tx/'
			} else if(swap_status_output_data.bob == 'BTC') {
				bob_explorer = 'https://www.blocktrail.com/BTC/tx/'
			} else if(swap_status_output_data.bob == 'ZEC') {
				bob_explorer = 'https://zchain.online/tx/'
			} else if(swap_status_output_data.bob == 'LTC') {
				bob_explorer = 'https://bchain.info/LTC/tx/'
			} else if(swap_status_output_data.bob == 'HUSH') {
				bob_explorer = 'https://explorer.myhush.org/tx/'
			}

			var alice_explorer = '';
			if(swap_status_output_data.alice == 'MNZ') {
				alice_explorer = 'https://www.mnzexplorer.com/tx/'
			} else if(swap_status_output_data.alice == 'KMD') {
				alice_explorer = 'https://www.kmd.host/tx/'
			} else if(swap_status_output_data.alice == 'BTC') {
				alice_explorer = 'https://www.blocktrail.com/BTC/tx/'
			} else if(swap_status_output_data.alice == 'ZEC') {
				alice_explorer = 'https://zchain.online/tx/'
			} else if(swap_status_output_data.alice == 'LTC') {
				alice_explorer = 'https://bchain.info/LTC/tx/'
			} else if(swap_status_output_data.alice == 'HUSH') {
				alice_explorer = 'https://explorer.myhush.org/tx/'
			}

			var time = new Date( swap_status_output_data.expiration *1000);
			//var expiration = moment.unix(data.expiration);
			//var now = moment();

			function renderValues(values) {
				let _out = '';

				if (values &&
						values.length) {
					for (let i = 0; i < values.length; i++) {
						_out += `<div>${values[i]}</div>`;
					}
				}

				return _out;
			}

			var simplified_dexdetail_tr = '';
			if (swap_status_output_data.iambob == 0) {
				console.log("I'm Buyer.");
				var total_sell_unit = parseFloat(swap_status_output_data.values[3])+parseFloat(swap_status_output_data.values[6]);
				var single_unit_price = parseFloat(swap_status_output_data.srcamount) / parseFloat(total_sell_unit);
				var price_per_bought_unit = parseFloat(total_sell_unit) / parseFloat(swap_status_output_data.srcamount);
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Price paid in ' + swap_status_output_data.alice + ':</b> ' + swap_status_output_data.values[3].toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Fee paid in ' + swap_status_output_data.alice + ':</b> ' + swap_status_output_data.values[6].toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Total ' + swap_status_output_data.alice + ' paid:</b> ' + total_sell_unit.toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>' + swap_status_output_data.bob + ' received:</b> ' + swap_status_output_data.srcamount.toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>1 ' + swap_status_output_data.alice + ' can buy:</b> ' + swap_status_output_data.srcamount.toFixed(8) + ' / ' + total_sell_unit.toFixed(8) + ' = ~' + single_unit_price.toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Price paid per ' + swap_status_output_data.bob + ':</b> ' + total_sell_unit.toFixed(8) + ' / ' + swap_status_output_data.srcamount.toFixed(8) + ' = ' + price_per_bought_unit.toFixed(8) + '</td></tr>';
			}

			if (swap_status_output_data.iambob == 1) {
				console.log("I'm Seller.");
				var total_sell_unit = parseFloat(swap_status_output_data.values[0])+parseFloat(swap_status_output_data.bobtxfee);
				var units_sold_at_price = parseFloat(swap_status_output_data.values[3]) / parseFloat(total_sell_unit);
				simplified_dexdetail_tr += '<tr><td colspan=2><b>' + swap_status_output_data.bob + ' sold: </b> = ' + swap_status_output_data.values[0].toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Fee paid in ' + swap_status_output_data.bob + ': </b> = ' + swap_status_output_data.bobtxfee + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>Total ' + swap_status_output_data.bob + ' deducted: </b> = ' + total_sell_unit + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>' + swap_status_output_data.alice + ' received: </b> = ' + swap_status_output_data.values[3].toFixed(8) + '</td></tr>';
				simplified_dexdetail_tr += '<tr><td colspan=2><b>' + swap_status_output_data.bob + ' sold at price: </b> = ' + swap_status_output_data.values[3].toFixed(8) + ' / ' + total_sell_unit.toFixed(8) + ' = ' + units_sold_at_price + '</td></tr>';
			}

			var swap_status_details_bootbox = bootbox.dialog({
			//onEscape: true, // DO NOT ENABLE THESE TWO LINES PLEASE. THAT DOESN'T LET THE CLOSE BUTTON ACTIONS EXECUTE IF THESE ARE ENABLED.
			//backdrop: true,
			message: `
					<div class="input-group col-sm-12">
						<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_bobdeposit"><span class="glyphicon glyphicon-save" aria-hidden="true"></span><br>Seller Deposit</div></span>
						<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_alicepayment"><span class="glyphicon glyphicon-transfer" aria-hidden="true"></span><br>Buyer Payment</div></span>
						<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_bobpayment"><span class="glyphicon glyphicon-random" aria-hidden="true"></span><br>Seller Payment</div></span>
						<span class="input-group-addon" style="font-size: 20px; border: 0px; text-align: center;"><div class="swapdetail_alicespend"><span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span><br>All Done!</div></span>
					</div>
					<div class="input-group col-sm-12">
						<span class="input-group-addon swapdetail_info" style="font-size: 20px; border: 0px; background-color: #fff;"></span>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title"><strong>Full Status</strong></h3>
									<button class="btn btn-xs btn-warning btn_kickstart_stuck_trade" style="float: right; margin-right: -6px; margin-top: -20px">KICKSTART STUCK TRADE</button>
								</div>
								<div class=""> <!-- panel-body -->
									<table width="100%" class="table table-striped" style="margin-bottom: 0;">
										<tr>
											<td rowspan=5>Trade info</td>
											<td>Quote ID</td>
											<td>` + swap_status_output_data.quoteid + `</td>
										</tr>
										<tr>
											<td>Request ID</td>
											<td>` + swap_status_output_data.requestid + `</td>
										</tr>
										<tr>
											<td>Trade id</td>
											<td>` + swap_status_output_data.tradeid + `</td>
										</tr>
										<tr>
											<td>Expires In</td>
											<td>` + time + `</td>
										</tr>
										<tr>
											<td>Source Amount</td>
											<td>` + swap_status_output_data.srcamount + `</td>
										</tr>
										<tr>
											<td rowspan=4>Buyer Info</td>
											<td>Buyer Coin</td>
											<td>` + alice_answer + `</td>
										</tr>
										<tr>
											<td>Buyer ID</td>
											<td>` + swap_status_output_data.aliceid + `</td>
										</tr>
										<tr>
											<td>Buyer Payment</td>
											<td class="tbl_alicepayment">` + `<a href="#" onclick="shell.openExternal('`+alice_explorer+swap_status_output_data.alicepayment+`'); return false;">` + swap_status_output_data.alicepayment + `</a></td>
										</tr>
										<tr>
											<td>Buyer Tx Fee</td>
											<td class="tbl_alicetxfee">` + swap_status_output_data.alicetxfee + `</td>
										</tr>
										<tr>
											<td rowspan=4>Seller Info</td>
											<td>Seller Coin</td>
											<td>` + bob_answer + `</td>
										</tr>
										<tr>
											<td>Seller Deposit</td>
											<td class="tbl_bobdeposit">` + `<a href="#" onclick="shell.openExternal('`+bob_explorer+swap_status_output_data.bobdeposit+`'); return false;">` + swap_status_output_data.bobdeposit + `</a></td>
										</tr>
										<tr>
											<td>Seller Payment</td>
											<td class="tbl_bobpayment"><a href="#" onclick="shell.openExternal('`+bob_explorer+swap_status_output_data.bobpayment+`'); return false;">` + swap_status_output_data.bobpayment + `</a></td>
										</tr>
										<tr>
											<td>Seller Tx Fee</td>
											<td class="tbl_bobtxfee">` + swap_status_output_data.bobtxfee + `</td>
										</tr>
										<tr>
											<td rowspan=8>Other Info</td>
											<td colspan=2><b>You are:</b> ` + iambob_answer + `</td>
										</tr>
										`+ simplified_dexdetail_tr +`
										<tr>
											<td colspan=2><b>Sent Flags:</b> <span class="tbl_sentflags">` + JSON.stringify(swap_status_output_data.sentflags, null, 2) + `</span></td>
										</tr>
										<!--<tr>
											<td>Values</td>
											<td class="tbl_values">` + renderValues(swap_status_output_data.values) + `</td>
										</tr>
										<tr>
											<td>depositspent</td>
											<td class="tbl_depositspent">` + swap_status_output_data.depositspent + `</td>
										</tr>
										<tr>
											<td>Apayment Spent</td>
											<td class="tbl_Apaymentspent">`+swap_status_output_data.Apaymentspent+`</td>
										</tr>-->
									</table>
								</div>
							</div>
						</div>

					</div>`,
				closeButton: false,
				size: 'large',
				buttons: {
					cancel: {
						label: "Close",
						className: 'btn-default btn_swap_status_details_close',
						callback: function(){
						}
					}
				}
			});
			swap_status_details_bootbox.init(function(){
				CheckOrderBookFn(false);
				check_swap_status(false);
				check_bot_list(false);
				check_my_prices(false);
				//bot_screen_coin_balance(false);
				//bot_screen_sellcoin_balance(false);

				$('.btn_kickstart_stuck_trade').click(function(e) {
					e.preventDefault();
					console.log('btn_kickstart_stuck_trade clicked');
					var remove_finished_swap_file_status = ShepherdIPC({"command":"remove_finished_swap_file", "requestid":swap_status_output_data.requestid, "quoteid":swap_status_output_data.quoteid});
					if (remove_finished_swap_file_status == 'removed') {
						console.log(`${swap_status_output_data.requestid}-${swap_status_output_data.quoteid}.finished file removed.`);
						toastr.success(`${swap_status_output_data.requestid}-${swap_status_output_data.quoteid}.finished file removed.`,'Swap Status Update');
					} else if (remove_finished_swap_file_status == 'error') {
						console.log(`Failed to remove ${swap_status_output_data.requestid}-${swap_status_output_data.quoteid} file`);
						toastr.error(`Failed to remove ${swap_status_output_data.requestid}-${swap_status_output_data.quoteid} file`,'Swap Status Update');
					}
				});

				var swapdetail_blinker = null;

				function blinker(sig) {
					$.ajax({
						async: true,
						data: JSON.stringify(ajax_data),
						dataType: 'json',
						type: 'POST',
						url: url
					}).done(function(dataforblinker) {
						var bob_explorer = '';
						if(swap_status_output_data.bob == 'MNZ') {
							bob_explorer = 'https://www.mnzexplorer.com/tx/'
						} else if(swap_status_output_data.bob == 'KMD') {
							bob_explorer = 'https://www.kmd.host/tx/'
						} else if(swap_status_output_data.bob == 'BTC') {
							bob_explorer = 'https://www.blocktrail.com/BTC/tx/'
						} else if(swap_status_output_data.bob == 'ZEC') {
							bob_explorer = 'https://zchain.online/tx/'
						} else if(swap_status_output_data.bob == 'LTC') {
							bob_explorer = 'https://bchain.info/LTC/tx/'
						} else if(swap_status_output_data.bob == 'HUSH') {
							bob_explorer = 'https://explorer.myhush.org/tx/'
						}

						var alice_explorer = '';
						if(swap_status_output_data.alice == 'MNZ') {
							alice_explorer = 'https://www.mnzexplorer.com/tx/'
						} else if(swap_status_output_data.alice == 'KMD') {
							alice_explorer = 'https://www.kmd.host/tx/'
						} else if(swap_status_output_data.alice == 'BTC') {
							alice_explorer = 'https://www.blocktrail.com/BTC/tx/'
						} else if(swap_status_output_data.alice == 'ZEC') {
							alice_explorer = 'https://zchain.online/tx/'
						} else if(swap_status_output_data.alice == 'LTC') {
							alice_explorer = 'https://bchain.info/LTC/tx/'
						} else if(swap_status_output_data.alice == 'HUSH') {
							alice_explorer = 'https://explorer.myhush.org/tx/'
						}

						$('.tbl_alicepayment').html(`<a href="#" onclick="shell.openExternal('`+alice_explorer+dataforblinker.alicepayment+`'); return false;">` + dataforblinker.alicepayment + `</a>`);
						$('.tbl_alicetxfee').html(dataforblinker.alicetxfee);
						$('.tbl_bobdeposit').html(`<a href="#" onclick="shell.openExternal('`+bob_explorer+dataforblinker.bobdeposit+`'); return false;">` + dataforblinker.bobdeposit + `</a>`);
						$('.tbl_bobpayment').html(`<a href="#" onclick="shell.openExternal('`+bob_explorer+dataforblinker.bobpayment+`'); return false;">` + dataforblinker.bobpayment + `</a>`);
						$('.tbl_bobtxfee').html(dataforblinker.bobtxfee);;
						$('.tbl_sentflags').html(JSON.stringify(dataforblinker.sentflags), null, 2);
						$('.tbl_values').html(renderValues(dataforblinker.values));
						$('.tbl_depositspent').html(dataforblinker.depositspent);
						$('.tbl_Apaymentspent').html(dataforblinker.Apaymentspent);

						var current_sentflag = get_swapstatus_step(dataforblinker)
						console.log('CURRENT SENT FLAG IS: ' + current_sentflag);
						if (sig == false) {
							clearInterval(swapdetail_blinker);
							return
						} else {
							console.log('swap detail BLINKING');
						}

						if(dataforblinker.bobpayment !== '0000000000000000000000000000000000000000000000000000000000000000'){
							$('.swapdetail_info').html('<h3><i class="fa fa-handshake-o"></i> Barter Completed!! Buyer Received Funds!</h3>');
							blinker(false);
						} else if (current_sentflag == 'alicespend') {
							$('.swapdetail_info').html('<h3>Buyer Received Funds.</h3>');
							$('.swapdetail_alicespend').fadeOut(500);
							$('.swapdetail_alicespend').fadeIn(500);
						} else if (current_sentflag == 'bobpayment') {
							$('.swapdetail_info').html('<h3>Seller Sent Payment.</h3><h3> Waiting for Buyer to confirm Payment..</h3>');
							$('.swapdetail_alicespend').fadeOut(500);
							$('.swapdetail_alicespend').fadeIn(500);
						} else if (current_sentflag == 'alicepayment') {
							$('.swapdetail_info').html('<h3>Buyer Payment Made. Waiting for Seller\'s Payment.</h3>');
							$('.swapdetail_bobpayment').fadeOut(500);
							$('.swapdetail_bobpayment').fadeIn(500);
						} else if (current_sentflag == 'bobdeposit') {
							$('.swapdetail_info').html('<h3>Seller Deposited his security. Waiting for Buyer\'s Payment.</h3>');
							$('.swapdetail_alicepayment').fadeOut(500);
							$('.swapdetail_alicepayment').fadeIn(500);
						} else if(current_sentflag == 'myfee'){
							$('.swapdetail_info').html('<h3>My BarterDEX fee has been paid.</h3>');
							$('.swapdetail_bobdeposit').fadeOut(500);
							$('.swapdetail_bobdeposit').fadeIn(500);
						}
					});
				}

				swapdetail_blinker = setInterval(blinker, 1000);

				$('.btn_swap_status_details_close').click(function(e){
					e.preventDefault();
					console.log('btn_swap_status_details_close clicked');
					blinker(false);

					CheckOrderBookFn();
					CheckOrderbook_Interval = setInterval(CheckOrderBookFn,30000);
					check_swap_status_Interval = setInterval(check_swap_status,20000);
					check_swap_status();
					check_bot_list_Interval = setInterval(check_bot_list, 10000);
					check_bot_list();
					check_my_prices_Interval = setInterval(check_my_prices, 60000);
					check_my_prices();
					//bot_screen_coin_balance_Interval = setInterval(bot_screen_coin_balance, 30000);
					//bot_screen_coin_balance();
					//bot_screen_sellcoin_balance_Interval = setInterval(bot_screen_sellcoin_balance, 30000);
					//bot_screen_sellcoin_balance();

					var dexmode = sessionStorage.getItem('mm_dexmode');
					var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
				})

			});

		}

	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function get_swapstatus_step(swap_data) {
	//console.log(swap_data.sentflags);
	var status = "realtime";
	for(var i = 0; i < swap_data.sentflags.length; i++) {
		if (swap_data.sentflags[i] == 'alicespend') {
			status = "alicespend";
			return status;
			//break;
		} else if (swap_data.sentflags[i] == 'bobpayment') {
			status = "bobpayment";
			return status;
			//break;
		} else if (swap_data.sentflags[i] == 'alicepayment') {
			status = "alicepayment";
			return status;
			//break;
		} else if (swap_data.sentflags[i] == 'bobdeposit') {
			status = "bobdeposit";
			return status;
			//break;
		} else if(swap_data.sentflags[i] == 'myfee'){
			status = "myfee";
			return status;
			//break;
		}
	}
}


function check_swap_status(sig) {
	if (sig == false) {
		clearInterval(check_swap_status_Interval);
		return
	} else {
		console.log('checking swap status');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"swapstatus"};
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

		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);

			var dexmode = sessionStorage.getItem('mm_dexmode');
			var selected_dICO_coin = sessionStorage.getItem('mm_selected_dICO_coin');
			if (dexmode == 'dICO') {
				get_coin_info(selected_dICO_coin);
			}
		} else {
			var reversed_swap_list = data.swaps.reverse();

			$('.exchange_swap_status_tbl tbody').empty();
			/*if (reversed_swap_list &&
					reversed_swap_list.length) {
				$('#exchange-swap-status-spinner').hide();
			}*/
			$('#exchange-swap-status-spinner').hide();
			$.each(reversed_swap_list, function(index, val) {
				//console.log(index);
				//console.log(val);
				if(!val.error === false) {
					var exchange_swap_status_tr = '';
					exchange_swap_status_tr += '<tr>';
					exchange_swap_status_tr += '<td><div style="color: #e53935; font-size: 15px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> error</div></td>';
					exchange_swap_status_tr += '<td>-</td>';
					exchange_swap_status_tr += '<td>-</td>';
					exchange_swap_status_tr += '<td>-</td>';
					exchange_swap_status_tr += '</tr>';
					$('.exchange_swap_status_tbl tbody').append(exchange_swap_status_tr);
				} else {


					if(val.status !== 'realtime') {
						var current_sentflag = get_swapstatus_step(val);
						if(val.bobpayment !== '0000000000000000000000000000000000000000000000000000000000000000'){
							status_color = 'color: #43a047;';
							swap_status = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
						} else if (current_sentflag == 'alicespend') {
							status_color = 'color: #43a047;';
							swap_status = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
						} else if (current_sentflag == 'bobpayment') {
							status_color = 'color: #0277bd;';
							swap_status = '<span class="glyphicon glyphicon-save" aria-hidden="true"></span>';
						} else if (current_sentflag == 'alicepayment') {
							status_color = 'color: #42a5f5;';
							swap_status = '<span class="glyphicon glyphicon-random" aria-hidden="true"></span>';
						} else if (current_sentflag == 'bobdeposit') {
							status_color = 'color: #4527a0;';
							swap_status = '<span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>';
						} else if(current_sentflag == 'myfee'){
							status_color = 'color: #ef6c00;';
							swap_status = '<span class="glyphicon glyphicon-random" aria-hidden="true"></span>';
						}
					} else {
						var status_color = '';
						var swap_status = '<span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>';
					}

					var exchange_swap_status_tr = '';
					exchange_swap_status_tr += '<tr>';
					exchange_swap_status_tr += '<td><div style="'+status_color+' font-size: 15px;">' + swap_status + ' ' + val.status +'</div></td>';
					exchange_swap_status_tr += '<td>' + val.quoteid + '</td>';
					exchange_swap_status_tr += '<td>' + val.requestid + '</td>';
					exchange_swap_status_tr += '<td><button class="btn btn-default swapstatus_details" data-quoteid="' + val.quoteid + '" data-requestid="' + val.requestid + '">Details</button></td>';
					exchange_swap_status_tr += '</tr>';
					$('.exchange_swap_status_tbl tbody').append(exchange_swap_status_tr);
				}
			})
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

/* Swap Status END */



/* Random Color Generator */

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}


function coloredPubkey(pubkey){
	var final_string = {};
	final_string.firstpart = pubkey.slice(0, 3);
	final_string.lastpart = pubkey.slice(61, 64);
	final_string.colorpart1 = intToRGB(hashCode(pubkey.slice(5, 10)));
	final_string.colorpart2 = intToRGB(hashCode(pubkey.slice(10, 20)));
	final_string.colorpart3 = intToRGB(hashCode(pubkey.slice(20, 30)));
	final_string.colorpart4 = intToRGB(hashCode(pubkey.slice(30, 40)));
	final_string.colorpart5 = intToRGB(hashCode(pubkey.slice(40, 50)));
	final_string.colorpart6 = intToRGB(hashCode(pubkey.slice(50, 60)));
	final_string.char1 = final_string.colorpart1.slice(0,1);
	final_string.char2 = final_string.colorpart2.slice(0,1);
	final_string.char3 = final_string.colorpart3.slice(0,1);
	final_string.char4 = final_string.colorpart4.slice(0,1);
	final_string.char5 = final_string.colorpart5.slice(0,1);
	final_string.char6 = final_string.colorpart6.slice(0,1);

	return final_string;

}

/* Random Color Generator */



/* TRADE HISTORY - CREDIT: pbca26 */

function openTradeDetails(index, total) {
	for (let i = 0; i < total; i++) {
		if (i !== index) {
			$(`.trade-details-${i}`).hide();
			$(`.trade-history-toggle-${i}`).html('Show details');
		}
	}

	if ($(`.trade-details-${index}`).is(":visible")) {
		$(`.trade-details-${index}`).hide();
		$(`.trade-history-toggle-${index}`).html('Show details');
	} else {
		$(`.trade-details-${index}`).show();
		$(`.trade-history-toggle-${index}`).html('Hide details');
	}
}

// display rounding
function formatValue(formatValue) {
  const _valueToStr = formatValue.toString();

  if (_valueToStr.indexOf('.') === -1) {
    return formatValue;
  } else {
    if (_valueToStr) {
      const _decimal = _valueToStr.substr(_valueToStr.indexOf('.') + 1, _valueToStr.length);
      let newVal = _valueToStr.substr(0, _valueToStr.indexOf('.') + 1);

      for (let i = 0; i < _decimal.length; i++) {
        if (_decimal[i] === '0') {
          newVal = newVal + _decimal[i];
        } else {
          newVal = newVal + _decimal[i];
          break;
        }
      }

      return newVal;
    }
  }
}

function constructTradesHistory() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"swapstatus"};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
    data: JSON.stringify(ajax_data),
    dataType: 'json',
    type: 'POST',
    url: url,
	}).done(function(data) {
		let out = '';
		let tradesCounter = 0;

		if (data &&
				data.swaps &&
				data.swaps.length) {
			out += `<h4 style="margin-bottom: 35px">Total trades: ${data.swaps.length}</h4>`;

			let tradesOut = `
				<table class="trades-history-table">
					<tr>
						<th>#</th>
						<th>Direction</th>
						<th>Pair</th>
						<th>Sent</th>
						<th>Received</th>
						<th>Rate</th>
						<th>Details</th>
					</tr>
				`;
			const trades = data.swaps;

			for (let i = 0; i < trades.length; i++) {
				const data = trades[i];

				if (data.alice &&
						data.bob) {
					tradesCounter++;
					result_answer = (data.result == 'success') ? '<h4><span class="label label-success"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Success</span></h4>' : '<h4><span class="label label-danger"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> ' + data.result + '</span></h4>';
					alice_answer = '<img src="img/cryptologo/'+data.alice.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.alice) + ' ('+data.alice+')';
					bob_answer = '<img src="img/cryptologo/'+data.bob.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.bob) + ' ('+data.bob+')';
					iambob_answer = (data.iambob == 0) ? 'Buyer' : 'Seller';

					var time = new Date( data.expiration * 1000);

					var simplified_dexdetail_tr = '';
					if (data.iambob == 0) {
						var total_sell_unit = parseFloat(data.values[3])+parseFloat(data.values[6]);
						var single_unit_price = parseFloat(data.srcamount) / parseFloat(total_sell_unit);
						var price_per_bought_unit = parseFloat(total_sell_unit) / parseFloat(data.srcamount);
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Price paid in ' + data.alice + ':</b> ' + data.values[3].toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Fee paid in ' + data.alice + ':</b> ' + data.values[6].toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Total ' + data.alice + ' paid:</b> ' + total_sell_unit.toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>' + data.bob + ' received:</b> ' + data.srcamount.toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>1 ' + data.alice + ' can buy:</b> ' + data.srcamount.toFixed(8) + ' / ' + total_sell_unit.toFixed(8) + ' = ~' + single_unit_price.toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Price paid per ' + data.bob + ':</b> ' + total_sell_unit.toFixed(8) + ' / ' + data.srcamount.toFixed(8) + ' = ' + price_per_bought_unit.toFixed(8) + '</td></tr>';
					}

					if (data.iambob == 1) {
						var total_sell_unit = parseFloat(data.values[0])+parseFloat(data.bobtxfee);
						var units_sold_at_price = parseFloat(data.values[3]) / parseFloat(total_sell_unit);
						simplified_dexdetail_tr += '<tr><td colspan=2><b>' + data.bob + ' sold: </b> = ' + data.values[0].toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Fee paid in ' + data.bob + ': </b> = ' + data.bobtxfee + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>Total ' + data.bob + ' deducted: </b> = ' + total_sell_unit + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>' + data.alice + ' received: </b> = ' + data.values[3].toFixed(8) + '</td></tr>';
						simplified_dexdetail_tr += '<tr><td colspan=2><b>' + data.bob + ' sold at price: </b> = ' + data.values[3].toFixed(8) + ' / ' + total_sell_unit.toFixed(8) + ' = ' + units_sold_at_price + '</td></tr>';
					}

					tradesOut += `
						<tr>
							<td>${i + 1}</td>
							<td>
								<i class="fa fa-arrow-${data.iambob == 0 ? 'right col-green' : 'left col-red'}"></i>&nbsp;
								<span>${ data.iambob == 0 ? 'Buy' : 'Sell' }</span>
							</td>
							<td>
								<span class="${data.iambob == 0 ? '' : 'hide'}">${data.alice} &nbsp;<i class="fa fa-exchange"></i>&nbsp; ${data.bob}</span>
								<span class="${data.iambob == 0 ? 'hide' : ''}">${data.bob} &nbsp;<i class="fa fa-exchange"></i>&nbsp; ${data.alice}</span>
							</td>
							<td>
								<span class="${data.iambob == 0 ? '' : 'hide'}">
									${formatValue(total_sell_unit)} ${data.alice}
								</span>
								<span class="${data.iambob == 0 ? 'hide' : ''}">
									${formatValue(total_sell_unit)} ${data.bob}
								</span>
							</td>
							<td>
								<span class="${data.iambob == 0 ? '' : 'hide'}">
									${formatValue(data.srcamount)} ${data.bob}
								</span>
								<span class="${data.iambob == 0 ? 'hide' : ''}">
									${formatValue(data.values[3])} ${data.alice}
								</span>
							</td>
							<td>
								<span class="${data.iambob == 0 ? '' : 'hide'}">${price_per_bought_unit ? formatValue(price_per_bought_unit) : ''} (${formatValue(total_sell_unit)} / ${formatValue(data.srcamount)})</span>
								<span class="${data.iambob == 0 ? 'hide' : ''}">${units_sold_at_price ? formatValue(units_sold_at_price) : ''} (${formatValue(data.values[3])} / ${formatValue(total_sell_unit)})</span>
							</td>
							<td>
								<button class="btn btn-gray trade-history-toggle-${i}" onClick="openTradeDetails(${i}, ${trades.length})">Show details</buton>
							</td>
						</tr>
						<tr>
							<td colspan="7">
								<div class="trade-details-${i}" style="display: none; margin-top: 15px">
							<div class="input-group col-sm-12">
								<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_bobdeposit"><span class="glyphicon glyphicon-save" aria-hidden="true"></span><br>Seller Deposit</div></span>
								<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_alicepayment"><span class="glyphicon glyphicon-transfer" aria-hidden="true"></span><br>Buyer Payment</div></span>
								<span class="input-group-addon" style="font-size: 20px; border: 0px;"><div class="swapdetail_bobpayment"><span class="glyphicon glyphicon-random" aria-hidden="true"></span><br>Seller Payment</div></span>
								<span class="input-group-addon" style="font-size: 20px; border: 0px; text-align: center;"><div class="swapdetail_alicespend"><span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span><br>All Done!</div></span>
							</div>
							<div class="input-group col-sm-12">
								<span class="input-group-addon swapdetail_info" style="font-size: 20px; border: 0px; background-color: #fff;"></span>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="panel panel-default">
										<div class="panel-heading">
											<h3 class="panel-title"><strong>Full Status</strong></h3>
										</div>
										<div class="">
											<table width="100%" class="table table-striped" style="margin-bottom: 0;">
												<tr>
													<td rowspan=5>Trade info</td>
													<td>Quote ID</td>
													<td>` + data.quoteid + `</td>
												</tr>
												<tr>
													<td>Request ID</td>
													<td>` + data.requestid + `</td>
												</tr>
												<tr>
													<td>Trade id</td>
													<td>` + data.tradeid + `</td>
												</tr>
												<tr>
													<td>Expires In</td>
													<td>` + time + `</td>
												</tr>
												<tr>
													<td>Source Amount</td>
													<td>` + data.srcamount + `</td>
												</tr>
												<tr>
													<td rowspan=4>Buyer Info</td>
													<td>Buyer Coin</td>
													<td>` + alice_answer + `</td>
												</tr>
												<tr>
													<td>Buyer ID</td>
													<td>` + data.aliceid + `</td>
												</tr>
												<tr>
													<td>Buyer Payment</td>
													<td class="tbl_alicepayment">` + data.alicepayment + `</td>
												</tr>
												<tr>
													<td>Buyer Tx Fee</td>
													<td class="tbl_alicetxfee">` + data.alicetxfee + `</td>
												</tr>
												<tr>
													<td rowspan=4>Seller Info</td>
													<td>Seller Coin</td>
													<td>` + bob_answer + `</td>
												</tr>
												<tr>
													<td>Seller Deposit</td>
													<td class="tbl_bobdeposit">` + data.bobdeposit + `</td>
												</tr>
												<tr>
													<td>Seller Payment</td>
													<td class="tbl_bobpayment">` + data.bobpayment + `</td>
												</tr>
												<tr>
													<td>Seller Tx Fee</td>
													<td class="tbl_bobtxfee">` + data.bobtxfee + `</td>
												</tr>
												<tr>
													<td rowspan=7>Other Info</td>
													<td colspan=2><b>You are:</b> ` + iambob_answer + `</td>
												</tr>
												`+ simplified_dexdetail_tr +`
											</table>
										</div>
									</div>
								</div>
							</div>
								</div>
							</td>
						</tr>`;
				}
			}

			tradesOut += '</table>';

			if (tradesCounter > 0) {
				$('#trades-history-content').html(out + tradesOut);
			} else {
				$('#trades-history-content').html('No trade history or swap(s) still in progress');
			}
		} else {
			$('#trades-history-content').html('No trade history or swap(s) still in progress');
		}
	});
}

/* TRADE HISTORY - CREDIT: pbca26 END*/





/* ZEROCONF SETTINGS */

$('.btn-refreshzeroconf_settings').click(function(){
	getZeroConfDepositHistory();
});

$('.zeroconf_deposits_history_tbl tbody').on('click', '.zconf_deposit_txid_link', function(e) {
	e.preventDefault();
	console.log('zconf_deposit_txid_link clicked');
	console.log($(this).data());
	shell.openExternal('https://kmd.explorer.supernet.org/tx/'+$(this).data('txid'));
});

$('.zeroconf_deposits_history_tbl tbody').on('click', '.zconf_deposit_details', function(e) {
	e.preventDefault();
	console.log('zconf_deposit_details clicked');
	console.log($(this).data());
});

$('.zeroconf_deposits_history_tbl tbody').on('click', '.zconf_deposit_claim', function(e) {
	e.preventDefault();
	console.log('zconf_deposit_claim clicked');
	console.log($(this).data());
	var addr = $(this).data('address');
	var expr = $(this).data('expiration');
	ZeroConfClaim(addr, expr);
});

$('.btn_zeroconf_deposit').click(function(e){
	e.preventDefault();
	console.log('btn_zeroconf_deposit clicked');
	var deposit_weeks = $('.zeroconf_weeks_select').selectpicker('val');
	var deposit_amount = $('.zeroconf_deposit_amount').val();
	console.log(deposit_weeks);
	console.log(deposit_amount);
	ZeroConfDeposit(deposit_weeks,deposit_amount);
});

$('.zeroconf_deposit_amount').keyup(function(){
	var deposit_amount = $('.zeroconf_deposit_amount').val();
	//console.log(deposit_amount);

	var empty = false;
	if (deposit_amount < 10) {
		console.log('Send Address is empty or less than 10');
		empty = true;
	}
	//console.log(empty);

	if (empty){
		$('.btn_zeroconf_deposit').attr("disabled", "disabled");
	} else {
		$('.btn_zeroconf_deposit').removeAttr("disabled");
	}
});

function getZeroConfDepositHistory(){
	var zeroconf_deposit_history_data = ShepherdIPC({"command":"read_zeroconf_log", "type":"deposit"});
	//console.log(zeroconf_deposit_history_data);
	var reversed_zeroconf_deposit_history_data = zeroconf_deposit_history_data.reverse();

	$('.zeroconf_deposits_history_tbl tbody').empty();
	$.each(reversed_zeroconf_deposit_history_data, function(index, val) {
		//console.log(index);
		//console.log(val);

		if(!val.error === false) {
			var zeroconf_deposits_history_tr = '';
			zeroconf_deposits_history_tr += '<tr>';
			//zeroconf_deposits_history_tr += '<td>' + index + '</td>';
			zeroconf_deposits_history_tr += '<td><div style="color: #e53935; font-size: 15px;"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> error</div></td>';
			zeroconf_deposits_history_tr += '<td>-</td>';
			zeroconf_deposits_history_tr += '</tr>';
			$('.zeroconf_deposits_history_tbl tbody').append(zeroconf_deposits_history_tr);
		} else {

			var expiration_time = new Date( val.expiration *1000);

			var zeroconf_deposits_history_tr = '';
			zeroconf_deposits_history_tr += '<tr>';
			//zeroconf_deposits_history_tr += '<td>' + index + '</td>';
			zeroconf_deposits_history_tr += `<td>
											<b>Address:</b> ${val.address}<br>
											<b>Deposit:</b> ${val.deposit} KMD<br>
											<b>Expiration:</b> ${expiration_time}<br>
											<b>Transaction ID:</b> <a class="zconf_deposit_txid_link" href="#" data-txid="${val.txid}">Open in Explorer</a>
											</td>`;
			zeroconf_deposits_history_tr += `<td><button class="btn btn-xs btn-default zconf_deposit_details" data-address="` + val.address + `" data-expiration="` + val.expiration + `" style="display: none;">Details</button>
												<button class="btn btn-xs btn-success zconf_deposit_claim" data-address="` + val.address + `" data-expiration="` + val.expiration + `" style="margin: 3px;">Claim Deposit</button>
											</td>`;
			zeroconf_deposits_history_tr += '</tr>';
			$('.zeroconf_deposits_history_tbl tbody').append(zeroconf_deposits_history_tr);
			
		}
	});
}


function ZeroConfDeposit(deposit_weeks, deposit_amount) {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"zeroconf_deposit","weeks":deposit_weeks,"amount":deposit_amount,"broadcast": 1};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(zconf_deposit_data) {
		console.log(zconf_deposit_data);
		var update_deposit_log_file = ShepherdIPC({"command":"update_zeroconf_log", "data":{"logdata": JSON.stringify(zconf_deposit_data),"type":"deposit"}});
		console.log(update_deposit_log_file);
		if (!zconf_deposit_data.error === false) {
			toastr.error(zconf_deposit_data.error, 'ZeroConf Notification');
		}
		if (zconf_deposit_data.result == 'success') {
			var zconf_depoit_bootbox = bootbox.dialog({
				title: 'ZeroConf security deposit sent!',
				message: `<b>Address: </b> ${zconf_deposit_data.address}<br>
						<b>deposit: </b> ${zconf_deposit_data.deposit}<br>
						<b>expiration: </b> ${zconf_deposit_data.expiration}<br>
						<a href="#" class="zconf_deposit_txid_bootbox" data-txid="${zconf_deposit_data.txid}">` + zconf_deposit_data.txid + `</a>`,
				closeButton: false,
				size: 'medium',
				buttons: {
					cancel: {
						label: "Close",
						className: 'btn-default',
						callback: function(){
						}
					}
				}
			})
			zconf_depoit_bootbox.init(function(){
				$('.zconf_deposit_txid_bootbox').click(function(){
					console.log($(this).data());
					shell.openExternal('https://kmd.explorer.supernet.org/tx/'+$(this).data('txid'));
				});
			});
			getZeroConfDepositHistory();
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function ZeroConfClaim(claim_address, claim_expiration) {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"zeroconf_claim","address":claim_address,"expiration":claim_expiration};
	var url = "http://127.0.0.1:7783";

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(zconf_claim_data) {
		console.log(zconf_claim_data);
		var update_claim_log_file = ShepherdIPC({"command":"update_zeroconf_log", "data":{"logdata": JSON.stringify(zconf_claim_data),"type":"claim"}});
		console.log(update_claim_log_file);
		if (!zconf_claim_data.error === false) {
			toastr.error(zconf_claim_data.error, 'ZeroConf Notification');
		}
		if (zconf_claim_data.result == 'success') {
			var zconf_claim_bootbox = bootbox.dialog({
				title: 'ZeroConf security claimed!',
				message: `<b>Claimed: </b> ${zconf_claim_data.claimed}<br>
							<a href="#" class="zconf_claim_txid_bootbox" data-txid="${zconf_claim_data.txids}">` + zconf_claim_data.txids + `</a>`,
				closeButton: false,
				size: 'medium',
				buttons: {
					cancel: {
						label: "Close",
						className: 'btn-default',
						callback: function(){
						}
					}
				}
			})
			zconf_claim_bootbox.init(function(){
				$('.zconf_claim_txid_bootbox').click(function(){
					console.log($(this).data());
					shell.openExternal('https://kmd.explorer.supernet.org/tx/'+$(this).data('txid'));
				});
			});

			bootbox.alert();
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}



$('.info_box_for_zeroconf').click(function(e){
	e.preventDefault();
	console.log('info_box_for_zeroconf clicked');
	bootbox.alert({
		title: `What is High Speed Mode Confirmations Feature?`,
		message: `<p>Use of this feature requires a security deposit, equal to or greater than the amount you wish to actively trade. This deposit is placed in a special multisig address for safe keeping. The following conditions apply:</p>
			<ul>
				<li>The minimum deposit amount is 10 KMD.</li>
				<li>The minimum deposit period is 1 week, and the maximum period is 52 weeks.</li>
                <li>The expiration date is permanently set and recorded within your blockchain transaction at the time of sending the deposit.</li>
                <li>Choose your time period appropriately, as you can only reclaim your deposit after the expiration date.</li>
                <li>Your KMD security deposit will continue to accrue the 5% APR throughout the time period, as usual.</li>
                <li>Upon conclusion, you will receive your deposit and interest, less a security fee of 0.1%.</li>
            </ul>
			<p>IMPORTANT: If you attempt to cheat while using High Speed Mode, both the amount of your offense and an additional penalty fee can be deducted from your deposit and forfeited to the affected parties. The remaining amount in your deposit balance will be claimable at the normal time of expiration.</p>`,
		size: 'large'
	});
})
/* ZEROCONF SETTINGS END */
