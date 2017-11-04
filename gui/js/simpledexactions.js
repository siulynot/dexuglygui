/*** Simple GUI JS ***/

var CheckOrderbook_Interval = null;
var CheckPortfolio_Interval = null;
var check_coin_balance_Interval = null;
var check_swap_status_Internal = null;
var check_my_prices_Internal = null;
var check_bot_list_Internal = null;

var coin_pair = ["BTC","KMD"]

$('.coin.pair-one').html(coin_pair[0]);
$('.coin.pair-two').html(coin_pair[1]);

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
		$('.coinexchange[data-coin]').attr('data-coin', coin);
	});

	selected_coin = {}
	selected_coin.coin = $(this).data('coin');
	selected_coin.coin_name = $(this).data('coinname');
	selected_coin.addr = $(this).data('addr');
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
	console.log('btn-makeinventory clicked');
	console.log($(this).data());

	var selected_coin = JSON.parse(sessionStorage.getItem('mm_selectedcoin'));
	console.log(selected_coin);
	var coin = selected_coin.coin;

	$('.screen-coindashboard').hide()
	$('.screen-exchange').show();
	$('.coin_ticker').html(coin);
	
	$.each($('.coinexchange[data-coin]'), function(index, value) {
		$('.coinexchange[data-coin]').attr('data-coin', coin);
	});

	/*$('.btn-exchangeclose').attr('data-coin', coin);
	$('.btn-exchangerefresh').attr('data-coin', coin);
	$('.btn-myordersrefresh').attr('data-coin', coin);
	$('.btn-botlistrefresh').attr('data-coin', coin);
	$('.btn-refreshtrading_pair').attr('data-coin', coin);*/
	check_coin_balance(false);
	CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);
	check_swap_status_Internal = setInterval(check_swap_status,10000);
	check_bot_list_Internal = setInterval(check_bot_list, 60000);
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
	check_coin_balance_Interval = setInterval(check_coin_balance($(this).data()),3000);
	check_coin_balance($(this).data());
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

$('.exchange_bot_list_tbl tbody').on('click', '.btn_bot_settings', function() {
	console.log('bot settings button clicked')
	console.log($(this).data());
});

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



	if (((coin_data == null) ? coin : coin_data.coin) == 'BTC') {
		$('#coindashboard-toggle').bootstrapToggle('enable');
	} else {
		$('#coindashboard-toggle').bootstrapToggle('disable');
	}

	$('.coindashboard-title').empty();
	$('.coindashboard-coin').empty();
	$('.coindashboard-balance').empty();
	$('.coindashboard-address[data-coin="' + ((coin_data == null) ? coin : coin_data.coin) + '"]').empty();
	$(".coindashboard-coinicon").attr("src","img/cryptologo/" + ((coin_data == null) ? coin : coin_data.coin).toLowerCase() + ".png");

	var coin_name = return_coin_name(((coin_data == null) ? coin : coin_data.coin));

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin": ((coin_data == null) ? coin : coin_data.coin)};
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



$("#inventory-slider1").slider();
$("#inventory-slider1").on("slide", function(slideEvt) {
	$("#inventory-slider1Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input1").val();
	$("#inventory-slider1Total").text(slideEvt.value*utxo_input);

	var slider_input2 = $('#inventory-slider2').val();
	var slider_input3 = $('#inventory-slider3').val();
	var slider_total = parseFloat(slideEvt.value*utxo_input1) + parseFloat(slider_input2*utxo_input2) + parseFloat(slider_input3*utxo_input3);

	$('.inventory-sliderTotal').text(slider_total.toFixed(8));
});

$("#inventory-slider2").slider();
$("#inventory-slider2").on("slide", function(slideEvt) {
	$("#inventory-slider2Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input2").val();
	$("#inventory-slider2Total").text(slideEvt.value*utxo_input);

	var slider_input1 = $('#inventory-slider1').val();
	var slider_input3 = $('#inventory-slider3').val();
	var slider_total = parseFloat(slider_input1*utxo_input1) + parseFloat(slideEvt.value*utxo_input2) + parseFloat(slider_input3*utxo_input3);

	$('.inventory-sliderTotal').text(slider_total.toFixed(8));
});

$("#inventory-slider3").slider();
$("#inventory-slider3").on("slide", function(slideEvt) {
	$("#inventory-slider3Val").text(slideEvt.value);

	utxo_input = $("#inventory_slider_input3").val();
	$("#inventory-slider3Total").text(slideEvt.value*utxo_input);

	var slider_input1 = $('#inventory-slider1').val();
	var slider_input2 = $('#inventory-slider2').val();
	var slider_total = parseFloat(slider_input1*utxo_input1) + parseFloat(slider_input2*utxo_input2) + parseFloat(slideEvt.value*utxo_input3);

	$('.inventory-sliderTotal').text(slider_total.toFixed(8));
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
            dex_portfolio_coins_tbl_tr += '<td><button class="btn btn-sm btn-default btn-portfoliogo" data-coin="' + val.coin + '" data-coinname="' + coin_name + '" data-addr="' + val.address + '"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></td>'
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
	var ajax_data = {"userpass":userpass,"method":"myprice","base":base_coin,"rel":rel_coin};
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
				/*$.each(data, function(index, val) {
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
				});*/

				var base_coin_name = return_coin_name(data.base)
				var rel_coin_name = return_coin_name(data.rel)

				var exchange_my_orders_tr = '';
				exchange_my_orders_tr += '<tr>';
					exchange_my_orders_tr += '<td>'+ data.base + ' (' + base_coin_name + ')</td>';
					exchange_my_orders_tr += '<td>'+ data.rel + ' (' + rel_coin_name + ')</td>';
					exchange_my_orders_tr += '<td>' + data.bid + '</td>';
					exchange_my_orders_tr += '<td>' + data.ask + '</td>';
				exchange_my_orders_tr += '</tr>';
				$('.exchange_my_orders_tbl tbody').append(exchange_my_orders_tr);
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
	var ajax_data = {"userpass":userpass,"method":"bot_list"};
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
				var exchange_bot_list_tr = '';
				exchange_bot_list_tr += '<tr>';
				exchange_bot_list_tr += '<td>' + val + '</td>';
				exchange_bot_list_tr += '<td style="text-align: center;"><div class="btn-group"><button class="btn btn-info btn_bot_status" data-botid="' + val + '" data-action="status">Status</button><button class="btn btn-success btn_bot_resume" data-botid="' + val + '" data-action="resume">Resume</button><button class="btn btn-warning btn_bot_pause" data-botid="' + val + '" data-action="pause">pause</button><button class="btn btn-danger btn_bot_stop" data-botid="' + val + '" data-action="stop">Stop</button><button class="btn btn-primary btn_bot_settingds" data-botid="' + val + '" data-action="settings">Settings</button></div></td>';
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
	
	if (bot_data.action == 'buy') {
		var ajax_data = {"userpass":userpass,"method":"bot_buy","base":base_coin,"rel":rel_coin,"maxprice":bot_data.price,"relvolume":bot_data.volume};
	}
	if (bot_data.action == 'sell') {
		var ajax_data = {"userpass":userpass,"method":"bot_sell","base":base_coin,"rel":rel_coin,"minprice":bot_data.price,"basevolume":bot_data.volume};
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


function bot_status(bot_data) {
	console.log(bot_data);
	
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"bot_pause","botid":bot_data.botid};
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

/* Auto Trading Bot END */



/* Swap Status */

$('.btn-swapstatusrefresh').click(function() {
	check_swap_status();	
})


$('.check_swap_status_btn').click(function() {
	event.preventDefault();
	var requestid = $('#swap_request_id').val();
	var quoteid = $('#swap_quote_id').val();
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"swapstatus","requestid":requestid,"quoteid":quoteid};
	var url = "http://127.0.0.1:7783/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.checkswaplist-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})



$('.exchange_swap_status_tbl tbody').on('click', '.swapstatus_details', function() {
	console.log('swapstatus details button clicked')
	console.log($(this).data());
});


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
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		//console.log(data);

		$('.exchange_swap_status_tbl tbody').empty();
		$.each(data.swaps, function(index, val) {
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