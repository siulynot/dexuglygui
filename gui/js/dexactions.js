var CheckOrderbook_Interval = null;
var CheckPortfolio_Interval = null;

$(document).ready(function() {
	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').show();
		$('.loginbody').hide();
		var refresh_data = {"coin":" ", "status": "enable"};
		enable_disable_coin(refresh_data);
		get_myprices();
		CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);
	} else {
		$('.mainbody').hide();
		$('.loginbody').show();
	}
	$('.set_goal_label_portfolio').html($('.sell_coin_p').selectpicker('val'));
});


$('.dexnav_exchange').click(function(e){
	e.preventDefault();
	//console.log('exchange menu clicked');
	$('.section').hide();
	$('.section-exchange').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
	CheckPortfolioFn(false);
	CheckOrderbook_Interval = setInterval(CheckOrderBookFn,3000);
});

$('.dexnav_portfolio').click(function(e){
	e.preventDefault();
	//console.log('portfolio menu clicked');
	$('.section').hide();
	$('.section-portfolio').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
	CheckOrderBookFn(false);
	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn,60000);
});

$('.dexnav_balances').click(function(e){
	e.preventDefault();
	//console.log('balances menu clicked');
	$('.section').hide();
	$('.section-balances').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
	CheckOrderBookFn(false);
	CheckPortfolioFn(false);
});

$('.dexnav_myprices').click(function(e){
	e.preventDefault();
	//console.log('myprices menu clicked');
	$('.section').hide();
	$('.section-myprices').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
	CheckOrderBookFn(false);
	CheckPortfolioFn(false);
});



$('.dexratio-btn').click(function() {
	var _dexratio = $('.dexratio-val').val();
	var ajax_data = {"ratio":_dexratio,"agent":"InstantDEX","method":"DEXratio"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.dexparams-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.showwalletinfo').click(function() {
	$('.checkwallet-output').html('<i>processing...</i>');
	$('.coin_balance').html('');
	$('.coin_mainaddr').html('');
	$('.coin_id').html('')
	var ajax_data = {"agent":"SuperNET","method":"activehandle"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.checkwallet-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.show-btcbalance').click(function() {
	$('.checkwallet-output').html('<i>processing...</i>');
	$('.coin_balance').html('<i>processing...</i>');
	var ajax_activehandle = {"agent":"SuperNET","method":"activehandle"};
	var url = "http://127.0.0.1:7778/";

	var a1 = $.ajax({
				data: JSON.stringify(ajax_activehandle),
				dataType: 'json',
				type: 'POST',
				url: 'http://127.0.0.1:7778'
	        }),
	    a2 = a1.then(function(data) {
	    		console.log(data);
	    		$('.coin_mainaddr').html(data.BTC);
	    		$('.coin_id').html('Bitcoin (BTC)')
	    		var ajax_dexgetbalance = {"agent":"dex","method":"getbalance","address":data.BTC,"symbol":"BTC"}
    			//return data
	            // .then() returns a new promise
	            return $.ajax({
	            	data: JSON.stringify(ajax_dexgetbalance),
					dataType: 'json',
					type: 'POST',
					url: 'http://127.0.0.1:7778'
	            });
	         });

	a2.done(function(data) {
	    console.log(data);
	    $('.checkwallet-output').html(JSON.stringify(data, null, 2));
	    $('.coin_balance').html(data.balance);
	});
})


$('.show-kmdbalance').click(function() {
	$('.checkwallet-output').html('<i>processing...</i>');
	$('.coin_balance').html('<i>processing...</i>');
	var ajax_activehandle = {"agent":"SuperNET","method":"activehandle"};
	var url = "http://127.0.0.1:7778/";

	var a1 = $.ajax({
				data: JSON.stringify(ajax_activehandle),
				dataType: 'json',
				type: 'POST',
				url: 'http://127.0.0.1:7778'
	        }),
	    a2 = a1.then(function(data) {
	    		console.log(data);
	    		$('.coin_mainaddr').html(data.KMD);
	    		$('.coin_id').html('Komodo (KMD)')
	    		var ajax_dexgetbalance = {"agent":"dex","method":"getbalance","address":data.KMD,"symbol":"KMD"}
    			//return data
	            // .then() returns a new promise
	            return $.ajax({
	            	data: JSON.stringify(ajax_dexgetbalance),
					dataType: 'json',
					type: 'POST',
					url: 'http://127.0.0.1:7778'
	            });
	         });

	a2.done(function(data) {
	    console.log(data);
	    $('.checkwallet-output').html(JSON.stringify(data, null, 2));
	    $('.coin_balance').html(data.balance);
	});
})


$('.send_tx_addr_btn').click(function() {
	var selected_coin = $('.send_tx_coin').val();
	var send_to_addr = $('.send_tx_addr').val();
	var send_coin_amount = $('.send_tx_amount').val();
	var confirm_send = confirm('Sending ' + send_coin_amount + ' ' + selected_coin + ' to ' + send_to_addr);
	if (confirm_send == true) {
		console.log('Sending Transaction');
		$('.checkwallet-output').html('<i>Sending ' + send_coin_amount + ' ' + selected_coin + ' to ' + send_to_addr + '<br>processing...</i>');

		var ajax_data = {"coin":selected_coin,"method":"sendtoaddress","params":[send_to_addr, send_coin_amount]};
		var url = "http://127.0.0.1:7778/";

		$.ajax({
		    data: JSON.stringify(ajax_data),
		    dataType: 'json',
		    type: 'POST',
		    url: 'http://127.0.0.1:7778'
		}).done(function(data) {
		    // If successful
		   console.log(data);
		   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
		}).fail(function(jqXHR, textStatus, errorThrown) {
		    // If fail
		    console.log(textStatus + ': ' + errorThrown);
		});
	} else {
		console.log('Canceled Transaction');
		$('.checkwallet-output').html('Canceled Transaction.');
	}

})


$( ".buy_coin" ).change(function() {
//$('.buy_coin').click(function() {
	//var coin = $(this).data('coin');
	coin = $('.buy_coin').selectpicker('val');
	//console.log($('.buy_coin').val())
	console.log($('.buy_coin').selectpicker('val'))
	//rel_coin = $('.deposit_coin01').data('coin');
	var rel_coin = $('.sell_coin').selectpicker('val');
	//base_coin = $('.buy_coin').val();
	base_coin = coin;

	$('.lp_sell_coin').text(rel_coin);
	$('.autotrade_buy_coin').text(coin);

	sessionStorage.setItem('dex_base_coin', base_coin);
	sessionStorage.setItem('dex_rel_coin', rel_coin);

  	

	get_price(base_coin, rel_coin);

	get_myprices();
  
  	
});


$('.switch_buy_sell_pairs').click(function() {
	console.log('switch button clicked...')
	var current_buy_coin = $('.buy_coin').selectpicker('val');
	var current_sell_coin = $('.sell_coin').selectpicker('val');

	console.log(current_sell_coin);
	console.log(current_buy_coin);

	$('.buy_coin').selectpicker('val',current_buy_coin);
	$('.sell_coin').selectpicker('val',current_sell_coin);
});

function get_price(base,rel) {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"orderbook","base":base,"rel":rel};
	var ajax_data2 = {"userpass":userpass,"method":"orderbook","base":rel,"rel":base};
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
	   	get_coins_list(data.coins);
	   	get_price(base,rel)
	   } else if (!data.error === false) {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info1').empty();
	   } else {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info1').empty();
	   	if (!data.bids[0].price === false) {
	   		$('.coin_swap_rate_info1').html('<b>1 '+base+' = ' + data.bids[0].price + ' '+rel+' approx.</b>');
	   	} else {
	   		$('.coin_swap_rate_info1').html('<b>Base price not found!</b>');
	   	}
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});


	$.ajax({
	    data: JSON.stringify(ajax_data2),
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
	   	get_coins_list(data.coins);
	   	get_price(base,rel)
	   } else if (!data.error === false) {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info1').empty();
	   } else {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info2').empty();
	   	if (!data.asks[0].price === false) {
	   		$('.coin_swap_rate_info2').html('<b>1 '+rel+' = ' + data.asks[0].price + ' '+base+' approx.</b>');
	   	} else {
	   		$('.coin_swap_rate_info2').html('<b>Rel price not found!</b>');
	   	}
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

$('.refresh_estimate_price').click(function() {
	//rel_coin = $('.deposit_coin01').data('coin');
	//base_coin = $('.buy_coin').val();
	var base_coin = $('.buy_coin').selectpicker('val');
	var rel_coin = $('.sell_coin').selectpicker('val');

	get_price(base_coin, rel_coin);
})

function get_marketmaker_userpass() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"getpeers"};
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
	   	get_coins_list(data.coins);
	   	get_marketmaker_userpass()
	   } else {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

$('.refresh_inv_table').click(function() {
	var coin = $(this).data('coin');
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"inventory","coin":coin};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   data = inv_kmd_data
	   if (!data.userpass === false) {
	   	console.log('first marketmaker api call execution after marketmaker started.')
	   	sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
	   	sessionStorage.setItem('mm_userpass', data.userpass);
	   	sessionStorage.setItem('mm_mypubkey', data.mypubkey);
	   	get_coins_list(data.coins);
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
	   } else {
	   	$( ".inv_btn" ).removeClass("active")
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).addClass(" active");
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.inv_alice_table tbody').empty();
	   	//var test_data = {"result":"success","alice":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout":0,"value":"200000000","satoshis":"200000000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"200000000","txid2":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"5824cc681ad3615c44c962a3fecb2fb6c328d9cdc52281597e9cb51ee5e41094","vout":0,"value":"200000000","satoshis":"200000000","txid2":"25c6cc193e61f102a69a0e71992a08c00fb2368166460aa20823d561517133c3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}],"bob":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"177688888","txid2":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout2":0,"value2":"200000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout":0,"value":"10000000","satoshis":"8800000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}]};
	   	//console.log(test_data);
	   	$.each(data.alice, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_alice_table_tr = '';
	   		inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
              inv_alice_table_tr += '<td><input class="form-control input-sm trade_pair_maxprice" type="text" name="price" value="" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'"></td>';
              inv_alice_table_tr += '<td><button class="btn btn-default btn-sm inv_autotrade" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'">Trade</button></td>';
            inv_alice_table_tr += '</tr>';
            $('.inv_alice_table tbody').append(inv_alice_table_tr);
	   	})

	   	/*$('.inv_bob_table tbody').empty();
	   	$.each(data.bob, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_bob_table_tr = '';
	   		inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
              //inv_bob_table_tr += '<td><input class="form-control input-sm trade_pair_maxprice" type="text" name="price" value="" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'"></td>';
              inv_bob_table_tr += '<td><button class="btn btn-default btn-sm inv_lp_setprice" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'" data-toggle="modal" data-target="#LP_Mode_SetPrice">Set Max Trade Price</button></td>';
            inv_bob_table_tr += '</tr>';
            $('.inv_bob_table tbody').append(inv_bob_table_tr);
	   	})*/

	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$( ".sell_coin" ).change(function() {
//$('.inv_btn').click(function() {
	//var coin = $(this).data('coin');
	coin = $('.buy_coin').selectpicker('val');
	$('.refresh_inv_table').data('coin',coin);

	
	$('.deposit_coin01').data('coin', coin);
	//calc_swap_price('kmdbtc');

	//rel_coin = $('.deposit_coin01').data('coin');
	rel_coin = $('.buy_coin').selectpicker('val');
	base_coin = coin;

	$('.lp_sell_coin').text(rel_coin);
	$('.autotrade_buy_coin').text(coin);

	sessionStorage.setItem('dex_base_coin', base_coin);
	sessionStorage.setItem('dex_rel_coin', rel_coin);
	
	get_price(base_coin, rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"inventory","coin":coin};
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
	   	get_coins_list(data.coins);
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
	   } else {
	   	$( ".inv_btn" ).removeClass("active")
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).addClass(" active");
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.inv_alice_table tbody').empty();
	   	//var test_data = {"result":"success","alice":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout":0,"value":"200000000","satoshis":"200000000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"200000000","txid2":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"5824cc681ad3615c44c962a3fecb2fb6c328d9cdc52281597e9cb51ee5e41094","vout":0,"value":"200000000","satoshis":"200000000","txid2":"25c6cc193e61f102a69a0e71992a08c00fb2368166460aa20823d561517133c3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}],"bob":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"177688888","txid2":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout2":0,"value2":"200000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout":0,"value":"10000000","satoshis":"8800000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}]};
	   	//console.log(test_data);
	   	$.each(data.alice, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_alice_table_tr = '';
	   		inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
              inv_alice_table_tr += '<td><input class="form-control input-sm trade_pair_maxprice" type="text" name="price" value="" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'"></td>';
              inv_alice_table_tr += '<td><button class="btn btn-default btn-sm inv_autotrade" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'">Trade</button></td>';
            inv_alice_table_tr += '</tr>';
            $('.inv_alice_table tbody').append(inv_alice_table_tr);
	   	})

	   	/*$('.inv_bob_table tbody').empty();
	   	$.each(data.bob, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_bob_table_tr = '';
	   		inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
              //inv_bob_table_tr += '<td><input class="form-control input-sm trade_pair_maxprice" type="text" name="price" value="" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'"></td>';
              inv_bob_table_tr += '<td><button class="btn btn-default btn-sm inv_lp_setprice" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'" data-amount="'+val.value+'">Set Max Trade Price</button></td>';
            inv_bob_table_tr += '</tr>';
            $('.inv_bob_table tbody').append(inv_bob_table_tr);
	   	})*/


	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
});


$('.buy_coin_btn').click(function(){
	var amount = $('#buy_amount').val();
	var price = $('#buy_price').val();

	//var base_coin = sessionStorage.getItem('dex_base_coin');
	var base_coin = $('.buy_coin').selectpicker('val'); //the currency you want to buy 
	//var rel_coin = sessionStorage.getItem('dex_rel_coin');
	var rel_coin = $('.sell_coin').selectpicker('val'); //the currency you are paying with 

	console.log('amount ' + amount);
	console.log('price ' + price);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"buy","base":base_coin,"rel":rel_coin,"relvolume":amount,"price":price};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   if (data.error == 'cant find utxo that is big enough') {
			toastr.error('cant find utxo that is big enough', 'Buy Info')
	   }
	   if (data.error == 'invalid parameter') {
			toastr.error('invalid parameter', 'Buy Info')
	   }
	   if (data.error == 'cant find ordermatch utxo') {
			toastr.error('cant find ordermatch utxo', 'Buy Info')
	   }
	   if (data.error == 'cant find alice utxo that is big enough') {
			toastr.error('cant find alice utxo that is big enough', 'Buy Info')
	   }
	   if (data.error == 'cant find ordermatch utxo, need to change relvolume to be closer to available') {
			toastr.error('cant find ordermatch utxo, need to change relvolume to be closer to available', 'Sell Info')
	   }
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

});

$('.sell_coin_btn').click(function(){
	var amount = $('#sell_amount').val();
	var price = $('#sell_price').val();

	//var base_coin = sessionStorage.getItem('dex_base_coin');
	var base_coin = $('.buy_coin').selectpicker('val');
	//var rel_coin = sessionStorage.getItem('dex_rel_coin');
	var rel_coin = $('.sell_coin').selectpicker('val');

	console.log('amount ' + amount);
	console.log('price ' + price);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"sell","base":base_coin,"rel":rel_coin,"basevolume":amount,"price":price};
	var url = "http://127.0.0.1:7783";

	console.log('command executed:');
	console.log(ajax_data);

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   if (data.error == 'cant find utxo that is big enough') {
			toastr.error('cant find utxo that is big enough', 'Sell Info')
	   }
	   if (data.error == 'invalid parameter') {
			toastr.error('invalid parameter', 'Sell Info')
	   }
	   if (data.error == 'cant find ordermatch utxo') {
			toastr.error('cant find ordermatch utxo', 'Sell Info')
	   }
	   if (data.error == 'cant find alice utxo that is big enough') {
			toastr.error('cant find alice utxo that is big enough', 'Sell Info')
	   }
	   if (data.error == 'cant find ordermatch utxo, need to change relvolume to be closer to available') {
			toastr.error('cant find ordermatch utxo, need to change relvolume to be closer to available', 'Sell Info')
	   }
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

});


/*$('.lp_set_price_btn').click(function(){
	var price = $('#lp_set_price').val();

	//var base_coin = sessionStorage.getItem('dex_base_coin');
	var base_coin = $('.buy_coin').selectpicker('val');
	//var rel_coin = sessionStorage.getItem('dex_rel_coin');
	var rel_coin = $('.sell_coin').selectpicker('val');

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
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	get_myprices();
})*/


/*$('.inv_alice_table tbody').on('click', '.inv_autotrade', function() {
	var coin = $(this).data('coin');
	var txid = $(this).data('txid');
	var vout = $(this).data('vout');
	var maxprice = $('.trade_pair_maxprice[data-txid="'+txid+'"][data-vout="'+vout+'"]').val()
	console.log(coin);
	console.log(txid);
	console.log(vout);
	console.log(maxprice);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"autotrade","txid":txid,"vout":vout,"coin":"REVS","maxprice":maxprice};
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.inv_bob_table tbody').on('click', '.inv_lp_setprice', function() {
	var coin = $(this).data('coin');
	var txid = $(this).data('txid');
	var vout = $(this).data('vout');
	var amount = $(this).data('amount');
	var amount_parsed = (parseFloat(amount)/100000000).toFixed(8)

	$('.tbl_lp_selected_utxo_txid').text(txid);
	$('.tbl_lp_selected_utxo_vout').text(vout);
	$('.tbl_lp_selected_utxo_amount').text(amount_parsed + ' ' +coin);
	$('#LP_Mode_SetPrice').modal('show')
});*/




function CheckOrderBookFn(sig) {
	if (sig == false) {
		clearInterval(CheckOrderbook_Interval);
	} else {
		console.log('checking orderbook');
	}

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	//var base_coin = sessionStorage.getItem('dex_base_coin');
	var base_coin = $('.buy_coin').selectpicker('val');
	//var rel_coin = sessionStorage.getItem('dex_rel_coin');
	var rel_coin = $('.sell_coin').selectpicker('val');
	
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
		//console.log(data);
		if (!data.userpass === false) {
			console.log('first marketmaker api call execution after marketmaker started.')
			sessionStorage.setItem('mm_usercoins', JSON.stringify(data.coins));
			sessionStorage.setItem('mm_userpass', data.userpass);
			sessionStorage.setItem('mm_mypubkey', data.mypubkey);
			get_coins_list(data.coins);
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
				orderbook_bids_tr += '<td class="col-xs-3">' + val.price + '</td>';
				orderbook_bids_tr += '<td class="col-xs-3">' + val.minvolume + '</td>';
				orderbook_bids_tr += '<td class="col-xs-3">' + val.maxvolume + '</td>';
				orderbook_bids_tr += '<td class="col-xs-3">' + val.age + '</td>';
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
				orderbook_asks_tr += '<td class="col-xs-3">' + val.price + '</td>';
				orderbook_asks_tr += '<td class="col-xs-3">' + val.minvolume + '</td>';
				orderbook_asks_tr += '<td class="col-xs-3">' + val.maxvolume + '</td>';
				orderbook_asks_tr += '<td class="col-xs-3">' + val.age + '</td>';
				orderbook_asks_tr += '</tr>';
				$('.orderbook_asks tbody').append(orderbook_asks_tr);
			})
		}

	   //$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

	get_myprices();

	return 'Check orderbook calls stopped.';
}


$('.refresh_dex_balances').click(function() {
	console.log('clicked refresh button at dex balance screen')
	var refresh_data = {"coin":" ", "status": "enable"};
	enable_disable_coin(refresh_data)
});

$('.dex_balances_tbl tbody').on('click', '.dex_balances_tbl_disable_btn', function() {
	//console.log('Disable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "disable"};
	enable_disable_coin(refresh_data)
	//$('.selectpicker option').filter(function () { return $(this).html() == $(this).data('coin'); }).attr("disabled","disabled");
	//$('.selectpicker').selectpicker('refresh');


});

$('.dex_balances_tbl tbody').on('click', '.dex_balances_tbl_enable_btn', function() {
	//console.log('Enable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "enable"};
	enable_disable_coin(refresh_data)
	//$('.selectpicker option').filter(function () { return $(this).html() == $(this).data('coin'); }).removeAttr('disabled');
	//$('.selectpicker').selectpicker('refresh');
});


function enable_disable_coin(data) {
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

function get_coins_list(data) {
	console.log(data);
	$('.dex_balances_tbl tbody').empty();

	$.each(data, function(index, val) {
		//console.log(index);
		//console.log(val);

		var coin_name = return_coin_name(val.coin)

		var dex_balances_tbl_tr = '';

		dex_balances_tbl_tr += '<tr>';
			dex_balances_tbl_tr += '<td><img src="img/cryptologo/' + val.coin.toLowerCase() + '.png" width="30px;"/> '+ coin_name + ' (' + val.coin + ')</td>';
			//dex_balances_tbl_tr += '<td>' + coin_name + '</td>';
			//dex_balances_tbl_tr += '<td>0.00000000</td>';
			dex_balances_tbl_tr += '<td>' + val.smartaddress + '</td>';
			dex_balances_tbl_tr += '<td><span class="label label-uppercase label-' + (( val.status == 'active' ) ? 'grey' : 'default') + '">' + val.status + '</span></td>';
			dex_balances_tbl_tr += '<td>' + (parseFloat(val.txfee)/100000000).toFixed(8) + '</td>';
			dex_balances_tbl_tr += '<td><input class="toggle_checkbox" type="checkbox" checked data-toggle="toggle" data-on="Native" data-off="Electrum" data-onstyle="grey" data-offstyle="info" data-width="100px" data-coin="' + val.coin + '" disabled></td>';
			dex_balances_tbl_tr += '<td style="width: 165px;"> <div class="btn-group" role="group">' + (( val.status == 'active' ) ? '<button class="btn btn-xs btn-warning dex_balances_tbl_disable_btn" data-coin="' + val.coin + '">Disable</button>' : '<button class="btn btn-xs btn-success dex_balances_tbl_enable_btn" data-coin="' + val.coin + '">Enable</button>') + ' <button class="btn btn-xs btn-primary dex_balances_tbl_showinv_btn" data-coin="' + val.coin + '" ' + (( val.status == 'active' ) ? '' : 'disabled') +'>Show Inventory</button></div></td>';
		dex_balances_tbl_tr += '</tr>';

		$('.dex_balances_tbl tbody').append(dex_balances_tbl_tr);

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
};

$('.refresh_dex_myprices').click(function() {
	get_myprices();
});

function get_myprices() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"myprices"};
	var url = "http://127.0.0.1:7783";

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
			get_coins_list(data.coins);
		} else {
			$('.dex_myprices_tbl tbody').empty();

			$.each(data, function(index, val) {
				//console.log(index);
				//console.log(val);

				var base_coin_name = return_coin_name(val.base)
				var rel_coin_name = return_coin_name(val.rel)

				var dex_myprices_tbl_tr = '';

				dex_myprices_tbl_tr += '<tr>';
					dex_myprices_tbl_tr += '<td>'+ val.base + ' (' + base_coin_name + ')</td>';
					dex_myprices_tbl_tr += '<td>'+ val.rel + ' (' + rel_coin_name + ')</td>';
					dex_myprices_tbl_tr += '<td>' + val.bid + '</td>';
					dex_myprices_tbl_tr += '<td>' + val.ask + '</td>';
				dex_myprices_tbl_tr += '</tr>';

				$('.dex_myprices_tbl tbody').append(dex_myprices_tbl_tr);
			})
		}

	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

$('.dex_balances_tbl tbody').on('click', '.dex_balances_tbl_showinv_btn', function() {
	var coin = $(this).data('coin');
	$('[data-inventorycoin]').text(coin);
	
	console.log('inventory button clicked for: ' + coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"inventory","coin":coin};
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
	   	//$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
	   } else {
	   	$('.RawJSONInventory-output').html(JSON.stringify(data, null, 2));
	   	$('.dex_showinv_alice_tbl tbody').empty();
	   	//var test_data = {"result":"success","alice":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout":0,"value":"200000000","satoshis":"200000000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"200000000","txid2":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"5824cc681ad3615c44c962a3fecb2fb6c328d9cdc52281597e9cb51ee5e41094","vout":0,"value":"200000000","satoshis":"200000000","txid2":"25c6cc193e61f102a69a0e71992a08c00fb2368166460aa20823d561517133c3","vout2":0,"value2":"10000000","desthash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}],"bob":[{"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"bbf1d0304bfa2f8f96d2c06480782c5078f7c32a968772b850b022c9ceb5074b","vout":0,"value":"200000000","satoshis":"177688888","txid2":"dcd082d5ecde2c37021561d375bd62b6752e61184d3a4da02069c7724ae44912","vout2":0,"value2":"200000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}, {"method":"notified","method2":"notified","coin":"KMD","now":1497477754,"address":"RNjAhmqZoPpadLF6sfFXTcTPmyXHnBdFvA","txid":"53b4f0be9310625b3284b0cd193a64ec5960e951b89f3cd2d51a40cb2f7d0fa3","vout":0,"value":"10000000","satoshis":"8800000","txid2":"7711afa7cdb3880a3813fd3b5252eae27ce2e25801ee689b1da0e1aca9d0d509","vout2":0,"value2":"10000000","srchash":"9200ad4422472041ade4bb26511acaa7eb53b7132f0cbb45bc30448a10cbc441"}]};
	   	//console.log(test_data);
	   	$.each(data.alice, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_alice_table_tr = '';
	   		inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<th rowspan="13" style="width: 30px;">' + index + '</th>';
              inv_alice_table_tr += '<th>method</th>';
              inv_alice_table_tr += '<th>' + val.method + '</th>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>gui</td>';
              inv_alice_table_tr += '<td>' + val.gui + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>coin</td>';
              inv_alice_table_tr += '<td>' + val.coin + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>iambob</td>';
              inv_alice_table_tr += '<td>' + val.iambob + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>address</td>';
              inv_alice_table_tr += '<td>' + val.address + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>txid</td>';
              inv_alice_table_tr += '<td>' + val.txid + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>vout</td>';
              inv_alice_table_tr += '<td>' + val.vout + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>value</td>';
              inv_alice_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>satoshis</td>';
              inv_alice_table_tr += '<td>' + val.satoshis + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>txid2</td>';
              inv_alice_table_tr += '<td>' + val.txid2 + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>vout2</td>';
              inv_alice_table_tr += '<td>' + val.vout2 + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>value2</td>';
              inv_alice_table_tr += '<td>' + (parseFloat(val.value2)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
            inv_alice_table_tr += '</tr>';
            inv_alice_table_tr += '<tr>';
              inv_alice_table_tr += '<td>desthash</td>';
              inv_alice_table_tr += '<td>' + val.desthash + '</td>';
            inv_alice_table_tr += '</tr>';

            $('.dex_showinv_alice_tbl tbody').append(inv_alice_table_tr);
	   	})

	   	$('.dex_showinv_bob_tbl tbody').empty();
	   	$.each(data.bob, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_bob_table_tr = '';
	   		inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<th rowspan="13" style="width: 30px;">' + index + '</th>';
              inv_bob_table_tr += '<th>method</th>';
              inv_bob_table_tr += '<th>' + val.method + '</th>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>gui</td>';
              inv_bob_table_tr += '<td>' + val.gui + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>coin</td>';
              inv_bob_table_tr += '<td>' + val.coin + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>iambob</td>';
              inv_bob_table_tr += '<td>' + val.iambob + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>address</td>';
              inv_bob_table_tr += '<td>' + val.address + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>txid</td>';
              inv_bob_table_tr += '<td>' + val.txid + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>vout</td>';
              inv_bob_table_tr += '<td>' + val.vout + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>value</td>';
              inv_bob_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>satoshis</td>';
              inv_bob_table_tr += '<td>' + val.satoshis + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>txid2</td>';
              inv_bob_table_tr += '<td>' + val.txid2 + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>vout2</td>';
              inv_bob_table_tr += '<td>' + val.vout2 + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>value2</td>';
              inv_bob_table_tr += '<td>' + (parseFloat(val.value2)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
            inv_bob_table_tr += '</tr>';
            inv_bob_table_tr += '<tr>';
              inv_bob_table_tr += '<td>srchash</td>';
              inv_bob_table_tr += '<td>' + val.srchash + '</td>';
            inv_bob_table_tr += '</tr>';
            $('.dex_showinv_bob_tbl tbody').append(inv_bob_table_tr);
	   	})

	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
	
	$('.coins_balance_panel').fadeOut();
	$('.inventory_panel').fadeIn();
});

$('.backto_dex_balances').click(function() {
	$('.coins_balance_panel').fadeIn();
	$('.inventory_panel').fadeOut();
	$('.dex_showinv_tbl').empty();
	$('[data-inventorycoin]').text('');
});

function return_coin_name(coin) {
	var coin_name = '';

	switch (coin) {
		case 'KMD':
			coin_name = 'Komodo';
			break;
		case 'BTC':
			coin_name = 'Bitcoin';
			break;
		case 'MNZ':
			coin_name = 'Monaize';
			break;
		case '888':
			coin_name = 'OctoCoin';
			break;
		case 'ARG':
			coin_name = 'ArcticCoin';
			break;
		case 'REVS':
			coin_name = 'REVS';
			break;
		case 'JUMBLR':
			coin_name = 'JUMBLR';
			break;
		case 'DOGE':
			coin_name = 'Dogecoin';
			break;
		case 'HUSH':
			coin_name = 'Hushcoin';
			break;
		case 'DGB':
			coin_name = 'Digibyte';
			break;
		case 'GLT':
			coin_name = 'GlobalToken';
			break;
		case 'MZC':
			coin_name = 'Mazacoin';
			break;
		case 'SYS':
			coin_name = 'Syscoin';
			break;
		case 'UIS':
			coin_name = 'Unitus';
			break;
		case 'UNO':
			coin_name = 'Unobtanium';
			break;
		case 'ZER':
			coin_name = 'Zero';
			break;
		case 'ZET':
			coin_name = 'Zetacoin';
			break;
		case 'ZEC':
			coin_name = 'Zcash';
			break;
		case 'BTM':
			coin_name = 'Bitmark';
			break;
		case 'CARB':
			coin_name = 'Carboncoin';
			break;
		case 'ANC':
			coin_name = 'Anoncoin';
			break;
		case 'FRK':
			coin_name = 'Franko';
			break;
		case 'GAME':
			coin_name = 'Gamecredits';
			break;
		case 'LTC':
			coin_name = 'Litecoin';
			break;
		case 'SUPERNET':
			coin_name = 'SUPERNET';
			break;
		case 'WLC':
			coin_name = 'Wireless';
			break;
		case 'PANGEA':
			coin_name = 'Pangea';
			break;
		case 'DEX':
			coin_name = 'InstantDEX';
			break;
		case 'BET':
			coin_name = 'BET';
			break;
		case 'CRYPTO':
			coin_name = 'Crypto777';
			break;
		case 'COQUI':
			coin_name = 'COQUI';
			break;
		case 'HODLC':
			coin_name = 'HODLC';
			break;
		case 'SHARK':
			coin_name = 'SHARK';
			break;
		case 'BOTS':
			coin_name = 'BOTS';
			break;
		case 'MGW':
			coin_name = 'MultiGateway';
			break;
		case 'MVP':
			coin_name = 'MVP';
			break;
		case 'KV':
			coin_name = 'KeyValue';
			break;
		case 'CEAL':
			coin_name = 'Ceal';
			break;
		case 'DASH':
			coin_name = 'Dash';
			break;
		case 'MESH':
			coin_name = 'SuperMesh';
			break;
		case 'CRW':
			coin_name = 'Crown';
			break;
		case 'HUC':
			coin_name = 'Huntercoin';
			break;
		case 'PIVX':
			coin_name = 'PIVX';
			break;
		case 'BDL':
			coin_name = 'Bitdeal';
			break;
		case 'ARC':
			coin_name = 'Arcticcoin';
			break;
		case 'ZCL':
			coin_name = 'ZClassic';
			break;
		case 'VIA':
			coin_name = 'Viacoin';
			break;
		case 'ERC':
			coin_name = 'Europecoin';
			break;
		case 'FAIR':
			coin_name = 'Faircoin';
			break;
		case 'FLO':
			coin_name = 'Florincoin';
			break;
		case 'SXC':
			coin_name = 'Sexcoin';
			break;
		case 'CREA':
			coin_name = 'Creativecoin';
			break;
		case 'TRC':
			coin_name = 'Terracoin';
			break;
		case 'BTA':
			coin_name = 'Bata';
			break;
		case 'SMC':
			coin_name = 'Smartcoin';
			break;
		case 'NMC':
			coin_name = 'Namecoin';
			break;
		case 'NAV':
			coin_name = 'Navcoin';
			break;
		case 'MOON':
			coin_name = 'Mooncoin';
			break;
		case 'EMC2':
			coin_name = 'Einsteinium';
			break;
		case 'I0C':
			coin_name = 'I0Coin';
			break;
		case 'STRAT':
			coin_name = 'Stratis';
			break;
		case 'MUE':
			coin_name = 'MonetaryUnit';
			break;
		case 'MONA':
			coin_name = 'MonaCoin';
			break;
		case 'XMY':
			coin_name = 'Myriad';
			break;
		case 'MAC':
			coin_name = 'Machinecoin';
			break;
		case 'BTX':
			coin_name = 'Bitcore';
			break;
		case 'XRE':
			coin_name = 'RevolverCoin';
			break;
		case 'LBC':
			coin_name = 'LBRY Credits';
			break;
		case 'SIB':
			coin_name = 'SIBCoin';
			break;
		case 'VTC':
			coin_name = 'Vertcoin';
			break;
		case 'HUSH':
			coin_name = 'Hush';
			break;
		case 'AUD':
			coin_name = 'Australian Dollar';
			break;
		case 'BGN':
			coin_name = 'Bulgarian Lev';
			break;
		case 'CAD':
			coin_name = 'Canadian Dollar';
			break;
		case 'CHF':
			coin_name = 'Swiss Franc';
			break;
		case 'CNY':
			coin_name = 'Chinese Yuan';
			break;
		case 'CZK':
			coin_name = 'Czech Koruna';
			break;
		case 'DKK':
			coin_name = 'Danish Krone';
			break;
		case 'EUR':
			coin_name = 'Euro';
			break;
		case 'GBP':
			coin_name = 'Pound Sterling';
			break;
		case 'HKD':
			coin_name = 'Hong Kong Dollar';
			break;
		case 'HRK':
			coin_name = 'Croatian Kuna';
			break;
		case 'HUF':
			coin_name = 'Hungarian Forint';
			break;
		case 'IDR':
			coin_name = 'Indonesian Rupiah';
			break;
		case 'ILS':
			coin_name = 'Israeli Shekel';
			break;
		case 'INR':
			coin_name = 'Indian Rupee';
			break;
		case 'JPY':
			coin_name = 'Japanese Yen';
			break;
		case 'KRW':
			coin_name = 'South Korean Won';
			break;
		case 'MXN':
			coin_name = 'Mexican Peso';
			break;
		case 'MYR':
			coin_name = 'Malaysian Ringgit';
			break;
		case 'NOK':
			coin_name = 'Norwegian Krone';
			break;
		case 'NZD':
			coin_name = 'New Zealand Dollar';
			break;
		case 'PHP':
			coin_name = 'Philippine Peso';
			break;
		case 'PLN':
			coin_name = 'Polish Zloty';
			break;
		case 'BRL':
			coin_name = 'Brazilian Real';
			break;
		case 'RON':
			coin_name = 'Romanian Leu';
			break;
		case 'RUB':
			coin_name = 'Russian Ruble';
			break;
		case 'SEK':
			coin_name = 'Swedish Krona';
			break;
		case 'SGD':
			coin_name = 'Singapore Dollar';
			break;
		case 'THB':
			coin_name = 'Thai Baht';
			break;
		case 'TRY':
			coin_name = 'Turkish Lira';
			break;
		case 'USD':
			coin_name = 'US Dollar';
			break;
		case 'ZAR':
			coin_name = 'South African Rand';
			break;

	}
	return coin_name;
}

$('.refresh_swap_list_btn').click(function() {
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
	   console.log(data);
	   $('.checkswaplist-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
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
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7783";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
		// If successful
		//console.log(data);
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

	$.each(data.portfolio, function(index, val) {
		//console.log(index);
		//console.log(val);

		var coin_name = return_coin_name(val.coin)

		var dex_portfolio_coins_tbl_tr = '';

		dex_portfolio_coins_tbl_tr += '<tr>';
			dex_portfolio_coins_tbl_tr += '<td>'+ val.coin + '</td>';
			//dex_portfolio_coins_tbl_tr += '<td>' + val.address + '</td>';
			dex_portfolio_coins_tbl_tr += '<td></td>';
			dex_portfolio_coins_tbl_tr += '<td>' + val.amount + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.price + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.kmd_equiv + '</td>';
            dex_portfolio_coins_tbl_tr += '<td>' + val.perc + '</td>';
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
            dex_portfolio_coins_tbl_tr += '<td>' + val.bobutil + '</td>';
		dex_portfolio_coins_tbl_tr += '</tr>';

		$('.dex_portfolio_coins_tbl tbody').append(dex_portfolio_coins_tbl_tr);
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
	  //"marginTop": 30,
	  //"marginBottom": 15,
	  //"marginLeft": 0,
	  //"marginRight": 0,
	  //"pullOutRadius": 0,
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
	  //"marginTop": 30,
	  //"marginBottom": 15,
	  //"marginLeft": 0,
	  //"marginRight": 0,
	  //"pullOutRadius": 0,
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

$('.refresh_dex_potfolio_charts').click(function() {
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



