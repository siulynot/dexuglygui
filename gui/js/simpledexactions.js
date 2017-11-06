/*** Simple GUI JS ***/

var CheckOrderbook_Interval = null;
var CheckPortfolio_Interval = null;
var check_coin_balance_Interval = null;
var check_swap_status_Internal = null;
var check_my_prices_Internal = null;
var check_bot_list_Internal = null;
var bot_screen_coin_balance_Internal = null;


/*$.each($('.pair-one[data-coin]'), function(index, value) {
	$('.pair-one[data-coin]').attr('data-coin', coin_pair[0]);
});
$.each($('.pair-two[data-coin]'), function(index, value) {
	$('.pair-two[data-coin]').attr('data-coin', coin_pair[1]);
});*/



$(document).ready(function() {
	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').show();
		$('.loginbody').hide();
		//var refresh_data = {"coin":" ", "status": "enable"};
		//enable_disable_coin(refresh_data);
		//get_myprices();

		//check_coin_balance_Interval = setInterval(check_coin_balance,3000);
		//check_coin_balance();
		CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
		CheckPortfolioFn();
	} else {
		$('.mainbody').hide();
		$('.loginbody').show();
	}
	//$('.set_goal_label_portfolio').html($('.sell_coin_p').selectpicker('val'));
});

$('.porfolio_coins_list tbody').on('click', '.btn-portfoliogo', function() {
	console.log('portfolio coin button clicked')
	console.log($(this).data());
	console.log($(this).data('coin'));
	$('.screen-portfolio').hide();
	$('.screen-coindashboard').show()

	coin = $(this).data('coin');
	$.each($('.coindashboard[data-coin]'), function(index, value) {
		$('.coindashboard[data-coin]').attr('data-coin', coin);
	});

	$.each($('.coinexchange[data-coin]'), function(index, value) {
		//$('.coinexchange[data-coin]').attr('data-coin', coin);
		$('.coinexchange[data-coin]').data('coin', coin);
	});

	selected_coin = {}
	selected_coin.coin = $(this).data('coin');
	selected_coin.coin_name = $(this).data('coinname');
	selected_coin.addr = $(this).data('addr');
	selected_coin.balance = $(this).data('balance');
	console.log(selected_coin);
	sessionStorage.setItem('mm_selectedcoin', JSON.stringify(selected_coin));

	CheckPortfolioFn(false);
	check_coin_balance_Interval = setInterval(check_coin_balance($(this).data()),3000);
});


$('.btn_coindashboard_back').click(function(){
	console.log('btn_coindashboard_back clicked');
	console.log($(this).data());

	$('.screen-portfolio').show();
	$('.screen-coindashboard').hide()

	check_coin_balance(false);
	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
});

$('.btn_coindashboard_receive').click(function() {
	console.log('btn-receive clicked');
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
		}

		bootbox.dialog({
		    //title: 'A custom dialog with init',
			message: '<div style="text-align: center; margin-top: -40px;"><img src="img/cryptologo/'+coin+'.png" style="border: 10px solid #fff;border-radius: 50px; background: #fff;"/></div><div style="text-align: center;"><div id="receive_addr_qrcode"></div><pre style="font-size: 18px;">'+data.coin.smartaddress+'</pre class="receive_addr_qrcode_addr"></div>'
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



$('.btn_coindashboard_enable').click(function() {
	console.log('btn-enable clicked');
	//console.log($(this).data());

	var electrum_option = $('#coindashboard-toggle').prop('checked');

	//console.log(electrum_option);

	var enable_data = $(this).data();
	enable_data['electrum'] = electrum_option;
	//console.log(enable_data);

	enable_disable_coin(enable_data);
});

$('.btn_coindashboard_disable').click(function() {
	console.log('btn-disable clicked');
	//console.log($(this).data());

	var electrum_option = $('#coindashboard-toggle').prop('checked');

	//console.log(electrum_option);

	var enable_data = $(this).data();
	enable_data['electrum'] = electrum_option;
	//console.log(enable_data);

	enable_disable_coin(enable_data);
});


$('.btn_coindashboard_send').click(function(e) {
	e.preventDefault();
	console.log('btn-send clicked');
	console.log($(this).data());
	$('.screen-coindashboard').hide()
	$('.screen-sendcoin').show();
	check_coin_balance(false);
	$('.sendcoin-title').html('Send ('+$('.coindashboard-balance').html()+' '+$(this).data('coin')+')');
	$('.sendcoin-title').data('coin', $(this).data('coin'));
});


$('.btn-sendcoin').click(function(e){
	e.preventDefault();
	console.log('btn-sendcoin clicked');
	//console.log($(this).data());

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	var to_addr = $('#send-toaddr').val();
	var send_amount = $('#send-amount').val();
	//console.log(to_addr);
	//console.log(send_amount);

	var output_data = {};
	output_data[to_addr] = send_amount;
	//console.log(output_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"withdraw","coin": coin, "outputs": [output_data]};
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);



	var a1 = $.ajax({
			async: true,
			data: JSON.stringify(ajax_data),
			dataType: 'json',
			type: 'POST',
			url: url
		}),
		a2 = a1.then(function(data) {
			// .then() returns a new promise
			console.log(data);
			if (data.complete == false) {
				toastr.error('Uncessful Transaction. Please try again.','Tansaction info');
			}
			if (data.complete == true) {
				bootbox.confirm({
					message: `<b>Send</b>: `+send_amount+` `+ajax_data.coin+`<br>
									<b>To</b>: `+to_addr+`<br>`,
					buttons: {
						confirm: {
							label: 'Confirm',
							className: 'btn-primary'
						},
						cancel: {
							label: 'Cancel',
							className: 'btn-default'
						}
					},
					callback: function (result) {
						console.log('This was logged in the callback: ' + result);

						if (result == true) {
							var ajax_data2 = {"userpass":userpass,"method":"sendrawtransaction","coin": coin, "signedtx": data.hex};
							console.log(ajax_data2);

							toastr.info('Transaction Executed', 'Transaction Status');

							$.ajax({
									async: true,
									data: JSON.stringify(ajax_data2),
									dataType: 'json',
									type: 'POST',
									url: url
								})
						} else {
							console.log('Sending Transaction operation canceled.');
							return {'output': 'canceled'};
						}
					}
				});
			}
	});

	a2.done(function(data) {
		console.log(data);
	});
});


$('.btn-sendcoinclose').click(function(e) {
	e.preventDefault();
	console.log('btn-sendcoinclose clicked');
	console.log($(this).data());
	$('.screen-coindashboard').show()
	$('.screen-sendcoin').hide();
	$('#send-toaddr').val('');
	$('#send-amount').val('');
	check_coin_balance_Interval = setInterval(check_coin_balance,3000);
});


$('.btn_coindashboard_inventory').click(function(e) {
	e.preventDefault();
	console.log('btn-inventory clicked');
	console.log($(this).data());

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	$('.screen-coindashboard').hide()
	$('.screen-inventory').show();
	check_coin_balance(false);
	$('.inventory-title').html('Manage Inventory ('+$('.coindashboard-balance').html()+' '+coin+')');
	$('.inventory-title').data('coin', coin);
	$('.coininventory[data-coin]').attr('data-coin', coin);
	//$('.coininventory[data-coin]').attr('data-pair', $(this).data('pair'));
	$('.coininventory[data-coin]').attr('data-addr', selected_coin.addr);
	$('.inventory-sliderTotalCoin').html(' '+coin);

	$('.dex_showinv_alice_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');
	$('.dex_showlist_unspents_tbl tbody').html('<th><div style="text-align: center;">Loading...</div></th>');

	check_coin_inventory(coin);
	check_coin_listunspent($(this).data());

	calc_data = {"coin": coin, "balance": $('.coindashboard-balance').html()};
	clac_coin_inventory(calc_data);
});

$('.btn-inventoryclose').click(function(e) {
	e.preventDefault();
	console.log('btn-inventoryclose clicked');
	//console.log($(this).data());
	$('.screen-coindashboard').show()
	$('.screen-inventory').hide();
	$('.dex_showinv_alice_tbl tbody').empty();
	$('.dex_showlist_unspents_tbl tbody').empty();
	$('.RawJSONInventory-output').empty();
	check_coin_balance_Interval = setInterval(check_coin_balance,3000);
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
	CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);
	check_swap_status_Internal = setInterval(check_swap_status,10000);
	check_swap_status();
	check_bot_list_Internal = setInterval(check_bot_list, 60000);
	check_bot_list();
	check_my_prices_Internal = setInterval(check_my_prices, 60000);
	check_my_prices();
	bot_screen_coin_balance_Internal = setInterval(bot_screen_coin_balance, 30000);
	bot_screen_coin_balance();
});

$('.btn-exchangeclose').click(function(e){
	e.preventDefault();
	console.log('btn-exchangeclose clicked');
	console.log($(this).data());

	$('.screen-coindashboard').show()
	$('.screen-exchange').hide();
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	check_coin_balance_Interval = setInterval(check_coin_balance(),3000);
	check_coin_balance();
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

	pair_price = $('.trading_pair_coin_price').val();
	pair_volume = $('.trading_pair_coin_volume').val();

	bot_data = {}
	bot_data.price = pair_price;
	bot_data.volume = pair_volume;
	bot_data.action = $(this).data('action');

	console.log(bot_data);

	bot_buy_sell(bot_data);
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

	bot_screen_coin_balance();
})


function check_coin_balance(coin_data) {
	console.log(coin_data);
	if (coin_data == false) {
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



	//if (((coin_data == null) ? coin : coin_data.coin) == 'BTC') {
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
	}).done(function(data) {
		// If successful
		//console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);
		}

		if (!data.error === false && data.error == 'coin is disabled') {
			console.log(data.coin);
			console.log('coin '+ data.coin.coin + ' is disabled');
			$('.btn_coindashboard_send[data-coin="' + data.coin.coin + '"]').hide();
			$('.btn_coindashboard_receive[data-coin="' + data.coin.coin + '"]').hide();
			$('.btn_coindashboard_exchange[data-coin="' + data.coin.coin + '"]').hide();
			$('.btn_coindashboard_inventory[data-coin="' + data.coin.coin + '"]').hide();
			$('.btn_coindashboard_enable[data-coin="' + data.coin.coin + '"]').show();
			$('.btn_coindashboard_disable[data-coin="' + data.coin.coin + '"]').hide();

			$('.coindashboard-balance').html('Coin is disabled.<br>Please enable before trading ')
			$('.coindashboard-balance').css( "font-size", "35px" );

		} else {
			//console.log(data);
			console.log(data.coin);
			//console.log(data.coin.smartaddress);
			//console.log(val);

			$('.btn_coindashboard_send[data-coin="' + data.coin.coin + '"]').show();
			$('.btn_coindashboard_receive[data-coin="' + data.coin.coin + '"]').show();
			$('.btn_coindashboard_exchange[data-coin="' + data.coin.coin + '"]').show();
			$('.btn_coindashboard_inventory[data-coin="' + data.coin.coin + '"]').show();
			$('.btn_coindashboard_enable[data-coin="' + data.coin.coin + '"]').hide();
			$('.btn_coindashboard_disable[data-coin="' + data.coin.coin + '"]').show();
			$('.coindashboard-address[data-coin="' + data.coin.coin + '"]').html(data.coin.smartaddress);
			$('.coindashboard-title').html(coin_name + ' (' + data.coin.coin + ')');
			$('.coindashboard-coin').html(data.coin.coin);


			$('.coindashboard-balance').css( "font-size", "55px" );
			$('.coindashboard-balance').html(data.coin.balance);
			$('.coindashboard-height').html(data.coin.height);
			$('.coindashboard-kmdvalue').html(data.coin.KMDvalue);
			$('.btn_coindashboard_inventory[data-addr]').attr('data-addr', data.coin.smartaddress);
		}

		//if (data.error == 'coin is disabled') {
			//console.log('coin '+ val + ' is disabled');
		//}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// If fail
		console.log(textStatus + ': ' + errorThrown);
	});

}


function get_balance() {

	var coin_pair_one = sessionStorage.getItem('coin_pair_one');
	var coin_pair_one = JSON.parse(coin_pair_one);
	var coin_pair_two = sessionStorage.getItem('coin_pair_two');
	var coin_pair_two = JSON.parse(coin_pair_two);
	//console.log(coin_pair_one);
	//console.log(coin_pair_two);

	$.each([coin_pair_one,coin_pair_two], function(index, value) {
		//console.log(index);
		//console.log(value.coin);


		var userpass = sessionStorage.getItem('mm_userpass');
		var ajax_data = {"userpass":userpass,"method":"balance","coin":value.coin,"address":value.smartaddress};
		var url = "http://127.0.0.1:7783";

		$.ajax({
			async: true,
		    data: JSON.stringify(ajax_data),
		    dataType: 'json',
		    type: 'POST',
		    url: url
		}).done(function(data) {
		    // If successful
		   //console.log(value.coin);
		   //console.log(data);
		   if (!data.userpass === false) {
				console.log('first marketmaker api call execution after marketmaker started.')
				sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
				sessionStorage.setItem('mm_userpass', data.userpass);
				sessionStorage.setItem('mm_mypubkey', data.mypubkey);
			}

			if (!data.error == true) {
				if (index == 0) {
					$('.balance.pair-one').css( "font-size", "55px" );
					$('.balance.pair-one').html(data.balance);
				} else {
					$('.balance.pair-two').css( "font-size", "55px" );
					$('.balance.pair-two').html(data.balance);
				}
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
		    // If fail
		    console.log(textStatus + ': ' + errorThrown);
		});
	})
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
			}
	   //toastr.success('Auto goal setup executed!', 'Portfolio Info')
	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function enable_disable_coin(data) {
	console.log(data);

	var electrum_option = data.electrum //If 'false', electrum option selected
	var userpass = sessionStorage.getItem('mm_userpass');
	var url = "http://127.0.0.1:7783";
	
	if (electrum_option == false) {
		console.log(electrum_option);
		console.log("electrum selected for " + data.coin);
		var ajax_data = {"userpass":userpass,"method":"electrum","coin":data.coin,"ipaddr":"46.4.125.2","port":50001};
	} else {
		console.log(electrum_option);
		console.log("native selected for " + data.coin);
		var ajax_data = {"userpass":userpass,"method":data.method,"coin":data.coin};
	}
	
	/*if (data.coin !== ' ' ) {
		console.log('coin value is not empty');
	} else {
		console.log('coin value is empty');
	}
	if (data.coin !== ' ' && data.status == 'enable') {
		
	} else if (data.coin !== ' ' && data.status == 'disable') {
		var ajax_data = {"userpass":userpass,"method":data.status,"coin":data.coin};
	} else if (data.coin == ' ') {
		var ajax_data = {"userpass":userpass,"method":"getcoins"};
	}*/

	console.log(ajax_data);

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

		if (!data.error === false) {
			//console.log(data.error);
			if (data.error == 'couldnt find coin locally installed') { //{error: "couldnt find coin locally installed", coin: "BTC"}
				bootbox.alert({
					title: "Couldn't find "+data.coin+" locally installed",
					message: `<p>It seems you don't have `+data.coin+` wallet installed on your OS. Please check these following points to make sure you have your wallet setup properly:</p>
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
			//get_coins_list(data.coins);
			//$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
		} else {
			sessionStorage.setItem('mm_coininventory', JSON.stringify(data));
			$('.RawJSONInventory-output').html(JSON.stringify(data, null, 2));
			$('.dex_showinv_alice_tbl tbody').empty();
			$.each(data.alice, function(index, val) {
				//console.log(index);
				//console.log(val);
				var inv_alice_table_tr = '';
				inv_alice_table_tr += '<tr>';
					inv_alice_table_tr += '<th rowspan="2" style="width: 30px;">' + index + '</th>';
					inv_alice_table_tr += '<th>coin</th>';
					inv_alice_table_tr += '<th>vout1</th>';
					inv_alice_table_tr += '<th>value1</th>';
					inv_alice_table_tr += '<th>vout2</th>';
					inv_alice_table_tr += '<th>value2</th>';
					inv_alice_table_tr += '<th></th>';
				inv_alice_table_tr += '</tr>';
				inv_alice_table_tr += '<tr>';
					inv_alice_table_tr += '<td>' + val.coin + '</td>';
					inv_alice_table_tr += '<td>' + val.vout + '</td>';
					inv_alice_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
					inv_alice_table_tr += '<td>' + val.vout2 + '</td>';
					inv_alice_table_tr += '<td>' + (parseFloat(val.value2)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
					inv_alice_table_tr += '<td><button class="btn btn-default btn_coiniventory_detail" data-invof="alice" data-index="' + index + '">Detail</button></td>';
				inv_alice_table_tr += '</tr>';

				$('.dex_showinv_alice_tbl tbody').append(inv_alice_table_tr);
			})

		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function check_coin_listunspent(coin_data) {
	console.log(coin_data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"listunspent","coin":coin_data.coin,"address":coin_data.addr};
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

		$('.dex_showlist_unspents_tbl tbody').empty();
		$.each(data, function(index, val) {
			//console.log(index);
			//console.log(val);
			var show_list_unspents_tbl_tr = '';
			show_list_unspents_tbl_tr += '<tr>';
				show_list_unspents_tbl_tr += '<th style="width: 30px;">Index</th>';
				show_list_unspents_tbl_tr += '<th>coin</th>';
				show_list_unspents_tbl_tr += '<th>height</th>';
				show_list_unspents_tbl_tr += '<th>TX Possition</th>';
				show_list_unspents_tbl_tr += '<th>Value</th>';
				show_list_unspents_tbl_tr += '<th>TX Hash</th>';
			show_list_unspents_tbl_tr += '</tr>';
			show_list_unspents_tbl_tr += '<tr>';
				show_list_unspents_tbl_tr += '<td>' + index + '</td>';
				show_list_unspents_tbl_tr += '<td>' + coin_data.coin + '</td>';
				show_list_unspents_tbl_tr += '<td>' + val.height + '</td>';
				show_list_unspents_tbl_tr += '<td>' + val.tx_pos + '</td>';
				show_list_unspents_tbl_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + coin_data.coin + '</td>';
				show_list_unspents_tbl_tr += '<td>' + val.tx_hash + '</td>';
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
	$("#inventory-slider1Total").text(slider1_value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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
	$("#inventory-slider2Total").text(slider2_value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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
	$("#inventory-slider3Total").text(slider3_value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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
	$("#inventory-slider1Total").text(slideEvt.value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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
	$("#inventory-slider2Total").text(slideEvt.value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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
	$("#inventory-slider3Total").text(slideEvt.value*utxo_input);

	var slider1_total = parseFloat($('#inventory-slider1Total').text());
	var slider2_total = parseFloat($('#inventory-slider2Total').text());
	var slider3_total = parseFloat($('#inventory-slider3Total').text());
	var slider_total = slider1_total + slider2_total + slider3_total;
	$('.inventory-sliderTotal').text(slider_total.toFixed(8));

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin_balance = selected_coin.balance;
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


function make_inventory_withdraw(data) {
	//console.log(data);
	coin = data.coin;

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"withdraw","coin": data.coin, "outputs": data.outputs};
	var url = "http://127.0.0.1:7783";

	console.log(ajax_data);

	var a1 = $.ajax({
			async: true,
			data: JSON.stringify(ajax_data),
			dataType: 'json',
			type: 'POST',
			url: url
		}),
		a2 = a1.then(function(data) {
			// .then() returns a new promise
			console.log(data);
			if (data.complete == false) {
				toastr.error('Uncessful Transaction. Please try again.','Tansaction info');
			}
			if (data.complete == true) {
				bootbox.confirm({
					message: 'Please confirm if you are ready to make inventory.',
					buttons: {
						confirm: {
							label: 'Confirm',
							className: 'btn-primary'
						},
						cancel: {
							label: 'Cancel',
							className: 'btn-default'
						}
					},
					callback: function (result) {
						console.log('This was logged in the callback: ' + result);

						if (result == true) {
							var ajax_data2 = {"userpass":userpass,"method":"sendrawtransaction","coin": coin, "signedtx": data.hex};
							console.log(ajax_data2);

							toastr.info('Transaction Executed', 'Transaction Status');

							return $.ajax({
									async: true,
									data: JSON.stringify(ajax_data2),
									dataType: 'json',
									type: 'POST',
									url: url
								})
						} else {
							console.log('Sending Transaction operation canceled.');
							return {'output': 'canceled'};
						}
					}
				});
			}
	});

	a2.done(function(data) {
		console.log(data);
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


function PortfolioTblDataFn(data) {
	//console.log(data);

	$('.portfolio_kmd_equiv').html(data.kmd_equiv);
	$('.portfolio_buycoin').html(data.buycoin);
	$('.portfolio_buyforce').html(data.buyforce);
	$('.portfolio_sellcoin').html(data.sellcoin);
	$('.portfolio_sellforce').html(data.sellforce);
	$('.portfolio_base').html(data.base);
	$('.portfolio_rel').html(data.rel);
	$('.portfolio_relvolume').html(data.relvolume);

	$('.dex_portfolio_coins_tbl tbody').empty();

	$('.porfolio_coins_list tbody').empty();
	$.each(data.portfolio, function(index, val) {
		//console.log(index);
		console.log(val);

		var coin_name = return_coin_name(val.coin)

		var dex_portfolio_coins_tbl_tr = '';

		dex_portfolio_coins_tbl_tr += '<tr>';
			dex_portfolio_coins_tbl_tr += '<td><img src="img/cryptologo/' + val.coin.toLowerCase() + '.png" width="30px;"/> '+ coin_name +' ('+val.coin + ')</td>';
			//dex_portfolio_coins_tbl_tr += '<td>' + val.address + '</td>';
			dex_portfolio_coins_tbl_tr += '<td>' + val.amount + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.price + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.kmd_equiv + '</td>';
            dex_portfolio_coins_tbl_tr += '<td><button class="btn btn-sm btn-default btn-portfoliogo" data-coin="' + val.coin + '" data-coinname="' + coin_name + '" data-addr="' + val.address + '" data-balance="' + val.amount + '"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></td>'
            /*dex_portfolio_coins_tbl_tr += '<td>' + val.perc + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.goal + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.goalperc + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.relvolume + '</td>';
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


$('.portfolio_set_goal_btn').click(function() {
	var percent = $('#portfolio_set_goal').val();
	var coin = $('.sell_coin_p').selectpicker('val');

	console.log('percent ' + percent);
	console.log('coin '+ coin);
	//console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"goal","coin":coin,"val":percent};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   toastr.success('Goal for ' + coin + ' set to: ' + percent, 'Portfolio Info')
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	CheckPortfolioFn();
})


$( ".sell_coin_p" ).change(function() {
	$('.set_goal_label_portfolio').html($('.sell_coin_p').selectpicker('val'));
})


$('.portfolio_set_autogoals_btn').click(function() {
	//var percent = $('#portfolio_set_goal').val();
	//var coin = $('.sell_coin_p').selectpicker('val');

	//console.log('percent ' + percent);
	//console.log('coin '+ coin);
	//console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"goal"};
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
	   toastr.success('Auto goal setup executed!', 'Portfolio Info')
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	CheckPortfolioFn();
})

/* Portfolio section functions END */



/* Auto Trading Bot */

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

	buying_or_selling = $('input[name=trading_pair_options]:checked').val();

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
			//get_coins_list(data.coins);
		} else {
			//console.log(data.asks);

			$('.orderbook_numasks').html(data.numasks);
			$('.orderbook_numbids').html(data.numbids);

			$('.orderbook_bids tbody').empty();
			$.each(data.bids, function(index, val) {
				//console.log(index);
				//console.log(val);
				var mytrade_true = '';
				if (val.pubkey === mypubkey) {
					var mytrade_true = 'class="warning"';
				}
				var orderbook_bids_tr = '';
				orderbook_bids_tr += '<tr ' + mytrade_true + '>';
				orderbook_bids_tr += '<td>' + val.price + '</td>';
				orderbook_bids_tr += '<td>' + val.minvolume + '</td>';
				orderbook_bids_tr += '<td>' + val.maxvolume + '</td>';
				orderbook_bids_tr += '<td>' + val.age + '</td>';
				orderbook_bids_tr += '<td>' + val.numutxos + '</td>';
				orderbook_bids_tr += '</tr>';
				$('.orderbook_bids tbody').append(orderbook_bids_tr);
			})

			$('.orderbook_asks tbody').empty();
			$.each(data.asks, function(index, val) {
				//console.log(index);
				//console.log(val);
				var mytrade_true = '';
				if (val.pubkey === mypubkey) {
					var mytrade_true = 'class="warning"';
				}
				var orderbook_asks_tr = '';
				orderbook_asks_tr += '<tr ' + mytrade_true + '>';
				orderbook_asks_tr += '<td>' + val.price + '</td>';
				orderbook_asks_tr += '<td>' + val.minvolume + '</td>';
				orderbook_asks_tr += '<td>' + val.maxvolume + '</td>';
				orderbook_asks_tr += '<td>' + val.age + '</td>';
				orderbook_asks_tr += '<td>' + val.numutxos + '</td>';
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
		clearInterval(check_my_prices_Internal);
		return
	} else {
		console.log('checking my prices');
	}

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	buying_or_selling = $('input[name=trading_pair_options]:checked').val();

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
		} else {
			//console.log(data);
			$('.exchange_my_orders_tbl tbody').empty();
			if (!data.error === false) {
				var exchange_my_orders_tr = '';
				exchange_my_orders_tr += '<tr>';
				exchange_my_orders_tr += '<td><div style="text-align: center;">' + data.error + ' for pair ' + base_coin + '/' + rel_coin + '</div></td>';
				exchange_my_orders_tr += '</tr>';
				$('.exchange_my_orders_tbl tbody').append(exchange_my_orders_tr);
			} else {
				$.each(data, function(index, val) {
					console.log(index);
					console.log(val);

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

	buying_or_selling = $('input[name=trading_pair_options]:checked').val();
	//console.log(buying_or_selling);

	if(buying_or_selling == 'buying') {
		$('#trading_pair_coin_price_max_min').html('Max');
		$('.trading_pair_lable_text_one').html('Max');
		$('.trading_pair_lable_text_two').html('Buy');
		$('.btn-bot_action').html('BUY');
		$('.btn-bot_action').attr('data-action', 'buy');
	}
	if(buying_or_selling == 'selling') {
		$('#trading_pair_coin_price_max_min').html('Min');
		$('.trading_pair_lable_text_one').html('Min');
		$('.trading_pair_lable_text_two').html('Sell');
		$('.btn-bot_action').html('SELL');
		$('.btn-bot_action').attr('data-action', 'sell');
	}
});

function update_min_max_price_input(){
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	console.log(coin);

	buying_or_selling = $('input[name=trading_pair_options]:checked').val();

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
		clearInterval(check_bot_list_Internal);
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

		$('.exchange_bot_list_tbl tbody').empty();
		$.each(data, function(index, val) {
			console.log(index);
			console.log(val);
			if(!val.error === false) {
				var exchange_bot_list_tr = '';
				exchange_bot_list_tr += '<tr>';
				exchange_bot_list_tr += '<td><div>error</div></td>';
				exchange_bot_list_tr += '<td>-</td>';
				exchange_bot_list_tr += '</tr>';
				$('.exchange_bot_list_tbl tbody').append(exchange_bot_list_tr);
			} else {

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
				exchange_bot_list_tr += '<td>'+val.name+'</td>';
				exchange_bot_list_tr += '<td>'+val.action+'</td>';
				exchange_bot_list_tr += '<td>'+max_min_val+'</td>';
				exchange_bot_list_tr += '<td>'+val.totalrelvolume+'</td>';
				exchange_bot_list_tr += '<td>'+val.trades.length+'</td>';
				exchange_bot_list_tr += '<td style="text-align: center;"><div class="btn-group"><button class="btn btn-info btn_bot_status" data-botid="' + val.botid + '" data-action="status"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></button><button class="btn btn-success btn_bot_resume" data-botid="' + val.botid + '" data-action="resume" ' + disable_resume_btn + '><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button><button class="btn btn-warning btn_bot_pause" data-botid="' + val.botid + '" data-action="pause" ' + disable_pause_btn + '><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></button><button class="btn btn-danger btn_bot_stop" data-botid="' + val.botid + '" data-action="stop" ' + disable_stop_btn + '><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button></div></td>';
				exchange_bot_list_tr += '</tr>';
				$('.exchange_bot_list_tbl tbody').append(exchange_bot_list_tr);
			}
		})
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function bot_buy_sell(bot_data) {
	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	var coin = selected_coin.coin;
	//console.log(coin);

	buying_or_selling = $('input[name=trading_pair_options]:checked').val();

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
	
	if (bot_data.action == 'buy') {
		var ajax_data = {"userpass":userpass,"method":"bot_buy","base":base_coin,"rel":rel_coin,"maxprice":bot_data.price,"relvolume":bot_data.volume};
	}
	if (bot_data.action == 'sell') {
		var ajax_data = {"userpass":userpass,"method":"bot_sell","base":base_coin,"rel":rel_coin,"minprice":bot_data.price,"basevolume":bot_data.volume};
	}

	console.log(ajax_data);

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
			toastr.error(data.error + '<br>Balance: ' + data.balance + ' ' + data.coin, 'Bot Info');
		} else if (data.result == 'success') {
			toastr.success(data.name + ' started <br> Bot ID: ' + data.botid, 'Bot Info');
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	check_bot_list();
}


function bot_stop_pause_resume(bot_data) {
	console.log(bot_data);
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	
	if (bot_data.action == 'pause') {
		var ajax_data = {"userpass":userpass,"method":"bot_pause","botid":bot_data.botid};
	}
	if (bot_data.action == 'resume') {
		var ajax_data = {"userpass":userpass,"method":"bot_resume","botid":bot_data.botid};
	}
	if (bot_data.action == 'stop') {
		var ajax_data = {"userpass":userpass,"method":"bot_stop","botid":bot_data.botid};
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
			toastr.success('Bot ID: ' + bot_data.botid + ' ' + bot_data.action + 'ed', 'Bot Info');
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

			var bot_update_bootbox = bootbox.dialog({
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
							<td>Trades</td>
							<td>` + JSON.stringify(data.trades, null, 2) + `</td>
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


								</div>
							</div>
						</div>
					</div>`,
				closeButton: true,
				size: 'large',

				buttons: {
					cancel: {
						label: "Cancel",
						className: 'btn-danger',
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
							bot_update_data = {}
							bot_update_data.rel = data.rel;
							bot_update_data.base = data.base;
							bot_update_data.botid = data.botid;
							bot_update_data.newprice = $('.trading_pair_coin_newprice').val();
							bot_update_data.newvolume = $('.trading_pair_coin_newvolume').val();

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


function bot_screen_coin_balance(sig) {
	if (sig == false) {
		clearInterval(bot_screen_coin_balance_Internal);
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
			bot_screen_coin_balance();
		} else {
			$('.trading_coin_ticker_name').html('<img src="img/cryptologo/'+coin.toLowerCase()+'.png" style="width: 50px;"> '+ return_coin_name(coin) + ' ('+coin+')');
			$('.trading_coin_balance').html(data.coin.balance + ' <span style="font-size: 35px; font-weight: 100;">' + coin + '</span>');
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


function check_swap_status_details(swap_data) {
	console.log(swap_data);

	var requestid = swap_data.requestid;
	var quoteid = swap_data.quoteid;
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
	}).done(function(data) {
		// If successful
		console.log(data);

		result_answer = (data.result == 'success') ? '<h4><span class="label label-success"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Success</span></h4>' : '<h4><span class="label label-danger"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> ' + data.result + '</span></h4>';
		alice_answer = '<img src="img/cryptologo/'+data.alice.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.alice) + ' ('+data.alice+')';
		bob_answer = '<img src="img/cryptologo/'+data.bob.toLowerCase()+'.png" style="width: 30px;"> '+ return_coin_name(data.bob) + ' ('+data.bob+')';
		iambob_answer = (data.iambob == 0) ? 'Buyer' : 'Seller';

		bootbox.dialog({
			message: `
				<table width="100%" class="table table-striped">
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
						<td>Source Amount</td>
						<td>` + data.srcamount + `</td>
					</tr>
					<tr>
						<td>Result</td>
						<td>` + result_answer + `</td>
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
						<td>` + data.alicepayment + `</td>
					</tr>
					<tr>
						<td>Buyer Tx Fee</td>
						<td>` + data.alicetxfee + `</td>
					</tr>
					<tr>
						<td rowspan=4>Seller Info</td>
						<td>Seller Coin</td>
						<td>` + bob_answer + `</td>
					</tr>
					<tr>
						<td>Seller Deposit</td>
						<td>` + data.bobdeposit + `</td>
					</tr>
					<tr>
						<td>Seller Payment</td>
						<td>` + data.bobpayment + `</td>
					</tr>
					<tr>
						<td>Seller Tx Fee</td>
						<td>` + data.bobtxfee + `</td>
					</tr>
					<tr>
						<td rowspan=5>Other Info</td>
						<td>You are</td>
						<td>` + iambob_answer + `</td>
					</tr>
					<tr>
						<td>Sent Flags</td>
						<td>` + JSON.stringify(data.sentflags, null, 2) + `</td>
					</tr>
					<tr>
						<td>Values</td>
						<td>` + JSON.stringify(data.values, null, 2) + `</td>
					</tr>
					<tr>
						<td>depositspent</td>
						<td>` + data.depositspent + `</td>
					</tr>
					<tr>
						<td>Apayment Spent</td>
						<td>` + data.Apaymentspent + `</td>
					</tr>
				</table>`,
			closeButton: true,
			size: 'large'
		});

	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function check_swap_status(sig) {
	if (sig == false) {
		clearInterval(check_swap_status_Internal);
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
		//console.log(data);

		var reversed_swap_list = data.swaps.reverse();

		$('.exchange_swap_status_tbl tbody').empty();
		$.each(reversed_swap_list, function(index, val) {
			//console.log(index);
			//console.log(val);
			if(!val.error === false) {
				var exchange_swap_status_tr = '';
				exchange_swap_status_tr += '<tr>';
				exchange_swap_status_tr += '<td><div>error</div></td>';
				exchange_swap_status_tr += '<td>-</td>';
				exchange_swap_status_tr += '<td>-</td>';
				exchange_swap_status_tr += '<td>-</td>';
				exchange_swap_status_tr += '</tr>';
				$('.exchange_swap_status_tbl tbody').append(exchange_swap_status_tr);
			} else {
				var exchange_swap_status_tr = '';
				exchange_swap_status_tr += '<tr>';
				exchange_swap_status_tr += '<td>' + val.status + '</td>';
				exchange_swap_status_tr += '<td>' + val.quoteid + '</td>';
				exchange_swap_status_tr += '<td>' + val.requestid + '</td>';
				exchange_swap_status_tr += '<td><button class="btn btn-default swapstatus_details" data-quoteid="' + val.quoteid + '" data-requestid="' + val.requestid + '">Details</button></td>';
				exchange_swap_status_tr += '</tr>';
				$('.exchange_swap_status_tbl tbody').append(exchange_swap_status_tr);
			}
		})
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

/* Swap Status END */