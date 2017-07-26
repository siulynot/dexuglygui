$(document).ready(function() {
	var refresh_data = {"coin":" ", "status": "enable"};
	enable_disable_coin(refresh_data);
	get_myprices();
});


$('.dexnav_exchange').click(function(e){
	e.preventDefault();
	//console.log('exchange menu clicked');
	$('.section').hide();
	$('.section-exchange').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
});

$('.dexnav_portfolio').click(function(e){
	e.preventDefault();
	//console.log('portfolio menu clicked');
	$('.section').hide();
	$('.section-portfolio').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
});

$('.dexnav_balances').click(function(e){
	e.preventDefault();
	//console.log('balances menu clicked');
	$('.section').hide();
	$('.section-balances').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
});

$('.dexnav_myprices').click(function(e){
	e.preventDefault();
	//console.log('myprices menu clicked');
	$('.section').hide();
	$('.section-myprices').show();
	$('.dexnav_top_l li').removeClass('active');
	//$(this).parent().get( 0 ).addClass('active');
	$(this).parent().addClass(" active");
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


//$( ".buy_coin" ).change(function() {
$('.buy_coin').click(function() {
	var coin = $(this).data('coin');
	//console.log($('.buy_coin').val())
	rel_coin = $('.deposit_coin01').data('coin');
	//base_coin = $('.buy_coin').val();
	base_coin = coin;

	$('.lp_sell_coin').text(rel_coin);
	$('.autotrade_buy_coin').text(coin);

	sessionStorage.setItem('dex_base_coin', base_coin);
	sessionStorage.setItem('dex_rel_coin', rel_coin);

  	switch (base_coin) {
		case 'KMD':
			$('.deposit_coin02').html('<img src="img/komodo.png" width="40px">');
			break;
		case 'BTC':
			$('.deposit_coin02').html('<img src="img/bitcoin.png" width="40px">');
			break;
		case 'REVS':
			$('.deposit_coin02').html('<b>REVS</b>');
			break;
		case 'JUMBLR':
			$('.deposit_coin02').html('<b>JUMBLR</b>');
			break;
		case 'DOGE':
			$('.deposit_coin02').html('<b>Dogecoin</b>');
			break;
		case 'HUSH':
			$('.deposit_coin02').html('<b>Hushcoin</b>');
			break;
		case 'DGB':
			$('.deposit_coin02').html('<b>Digibyte</b>');
			break;
		case 'MZC':
			$('.deposit_coin02').html('<b>Mazacoin</b>');
			break;
		case 'SYS':
			$('.deposit_coin02').html('<b>Syscoin</b>');
			break;
		case 'UNO':
			$('.deposit_coin02').html('<b>Unobtanium</b>');
			break;
		case 'ZET':
			$('.deposit_coin02').html('<b>Zetacoin</b>');
			break;
		case 'ZEC':
			$('.deposit_coin02').html('<b>Zcash</b>');
			break;
		case 'BTM':
			$('.deposit_coin02').html('<b>Bitmark</b>');
			break;
		case 'CARB':
			$('.deposit_coin02').html('<b>Carboncoin</b>');
			break;
		case 'ANC':
			$('.deposit_coin02').html('<b>Anoncoin</b>');
			break;
		case 'FRK':
			$('.deposit_coin02').html('<b>Franko</b>');
			break;
		case 'GAME':
			$('.deposit_coin02').html('<b>Gamecredits</b>');
			break;
		case 'LTC':
			$('.deposit_coin02').html('<b>Litecoin</b>');
			break;
		case 'SUPERNET':
			$('.deposit_coin02').html('<b>SUPERNET</b>');
			break;
		case 'WLC':
			$('.deposit_coin02').html('<b>Wireless</b>');
			break;
		case 'PANGEA':
			$('.deposit_coin02').html('<b>Pangea</b>');
			break;
		case 'DEX':
			$('.deposit_coin02').html('<b>InstantDEX</b>');
			break;
		case 'BET':
			$('.deposit_coin02').html('<b>BET</b>');
			break;
		case 'CRYPTO':
			$('.deposit_coin02').html('<b>Crypto777</b>');
			break;
		case 'HODL':
			$('.deposit_coin02').html('<b>HODL</b>');
			break;
		case 'SHARK':
			$('.deposit_coin02').html('<b>SHARK</b>');
			break;
		case 'BOTS':
			$('.deposit_coin02').html('<b>BOTS</b>');
			break;
		case 'MGW':
			$('.deposit_coin02').html('<b>MultiGateway</b>');
			break;
		case 'MVP':
			$('.deposit_coin02').html('<b>MVP</b>');
			break;
		case 'KV':
			$('.deposit_coin02').html('<b>KeyValue</b>');
			break;
		case 'CEAL':
			$('.deposit_coin02').html('<b>Ceal</b>');
			break;
		case 'MESH':
			$('.deposit_coin02').html('<b>SuperMesh</b>');
			break;
	}

	get_price(base_coin, rel_coin);

	$( ".buy_coin" ).removeClass("active")
	$( ".buy_coin[data-coin='"+ coin +"']" ).addClass(" active");

	get_myprices();
  
  	/*var ajax_data = {"agent":"InstantDEX","method":"smartaddresses"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
		$(data).each(function(index, value) {
			//console.log(index);
			//console.log(value);
			if (value.type == $('.buy_coin').val()) {
				//console.log(value.coins);
				$('.initcoinswap-output').html(JSON.stringify(value.coins[0], null, 2));
				$('.smartaddr_type').html($('.buy_coin').val().toUpperCase())
				$('.deposit_coin_code').html(value.coins[0].coin.toUpperCase())
				$('.deposit_coin_addr').html(value.coins[0].address)
				$('.swap_deposit_addr').html(value.coins[0].address);
  				$('.swap_recieve_addr').html(value.coins[0].dest);
  				$('.deposit_coin_sourceamount').html(value.coins[0].sourceamount + ' ' + value.coins[0].coin.toUpperCase());

				$('#deposit_coin_qrcode').html('');
				var qrcode = new QRCode("deposit_coin_qrcode", {
									width: 96,
									height: 96,
									colorDark : "#000000",
									colorLight : "#ffffff",
									correctLevel : QRCode.CorrectLevel.H
								});
				qrcode.makeCode(value.coins[0].address);

			}
		});
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});*/
});


function get_price(base,rel) {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"orderbook","base":base,"rel":rel};
	var ajax_data2 = {"userpass":userpass,"method":"orderbook","base":rel,"rel":base};
	var url = "http://127.0.0.1:7779";

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
	   	$('.coin_swap_rate_info1').html('<b>1 '+base+' = ' + data.bids[0].price + ' '+rel+' approx.</b>');
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
	   	$('.coin_swap_rate_info2').html('<b>1 '+rel+' = ' + data.asks[0].price + ' '+base+' approx.</b>');
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

$('.refresh_estimate_price').click(function() {
	rel_coin = $('.deposit_coin01').data('coin');
	base_coin = $('.buy_coin').val();

	get_price(base_coin, rel_coin);
})

function get_marketmaker_userpass() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"getpeers"};
	var url = "http://127.0.0.1:7779";

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
	var url = "http://127.0.0.1:7779";

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


$('.inv_btn').click(function() {
	var coin = $(this).data('coin');
	$('.refresh_inv_table').data('coin',coin);

	switch (coin) {
		case 'KMD':
			$('.deposit_coin01').html('<img src="img/komodo.png" width="40px">');
			break;
		case 'BTC':
			$('.deposit_coin01').html('<img src="img/bitcoin.png" width="40px">');
			break;
		case 'REVS':
			$('.deposit_coin01').html('<b>REVS</b>');
			break;
		case 'JUMBLR':
			$('.deposit_coin01').html('<b>JUMBLR</b>');
			break;
		case 'DOGE':
			$('.deposit_coin01').html('<b>Dogecoin</b>');
			break;
		case 'HUSH':
			$('.deposit_coin01').html('<b>Hushcoin</b>');
			break;
		case 'DGB':
			$('.deposit_coin01').html('<b>Digibyte</b>');
			break;
		case 'MZC':
			$('.deposit_coin01').html('<b>Mazacoin</b>');
			break;
		case 'SYS':
			$('.deposit_coin01').html('<b>Syscoin</b>');
			break;
		case 'UNO':
			$('.deposit_coin01').html('<b>Unobtanium</b>');
			break;
		case 'ZET':
			$('.deposit_coin01').html('<b>Zetacoin</b>');
			break;
		case 'ZEC':
			$('.deposit_coin01').html('<b>Zcash</b>');
			break;
		case 'BTM':
			$('.deposit_coin01').html('<b>Bitmark</b>');
			break;
		case 'CARB':
			$('.deposit_coin01').html('<b>Carboncoin</b>');
			break;
		case 'ANC':
			$('.deposit_coin01').html('<b>Anoncoin</b>');
			break;
		case 'FRK':
			$('.deposit_coin01').html('<b>Franko</b>');
			break;
		case 'GAME':
			$('.deposit_coin01').html('<b>Gamecredits</b>');
			break;
		case 'LTC':
			$('.deposit_coin01').html('<b>Litecoin</b>');
			break;
		case 'SUPERNET':
			$('.deposit_coin01').html('<b>SUPERNET</b>');
			break;
		case 'WLC':
			$('.deposit_coin01').html('<b>Wireless</b>');
			break;
		case 'PANGEA':
			$('.deposit_coin01').html('<b>Pangea</b>');
			break;
		case 'DEX':
			$('.deposit_coin01').html('<b>InstantDEX</b>');
			break;
		case 'BET':
			$('.deposit_coin01').html('<b>BET</b>');
			break;
		case 'CRYPTO':
			$('.deposit_coin01').html('<b>Crypto777</b>');
			break;
		case 'HODL':
			$('.deposit_coin01').html('<b>HODL</b>');
			break;
		case 'SHARK':
			$('.deposit_coin01').html('<b>SHARK</b>');
			break;
		case 'BOTS':
			$('.deposit_coin01').html('<b>BOTS</b>');
			break;
		case 'MGW':
			$('.deposit_coin01').html('<b>MultiGateway</b>');
			break;
		case 'MVP':
			$('.deposit_coin01').html('<b>MVP</b>');
			break;
		case 'KV':
			$('.deposit_coin01').html('<b>KeyValue</b>');
			break;
		case 'CEAL':
			$('.deposit_coin01').html('<b>Ceal</b>');
			break;
		case 'MESH':
			$('.deposit_coin01').html('<b>SuperMesh</b>');
			break;
	}
	
	$('.deposit_coin01').data('coin', coin);
	//calc_swap_price('kmdbtc');

	rel_coin = $('.deposit_coin01').data('coin');
	base_coin = coin;

	$('.lp_sell_coin').text(rel_coin);
	$('.autotrade_buy_coin').text(coin);

	sessionStorage.setItem('dex_base_coin', base_coin);
	sessionStorage.setItem('dex_rel_coin', rel_coin);
	
	get_price(base_coin, rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"inventory","coin":coin};
	var url = "http://127.0.0.1:7779";

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


$('.autotrade_buy_coin_btn').click(function(){
	var amount = $('#autotrade_amount').val();
	var price = $('#autotrade_price').val();

	var base_coin = sessionStorage.getItem('dex_base_coin');
	var rel_coin = sessionStorage.getItem('dex_rel_coin');

	console.log('amount ' + amount);
	console.log('price ' + price);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"autotrade","base":base_coin,"rel":rel_coin,"relvolume":amount,"price":price};
	var url = "http://127.0.0.1:7779";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   if (data.error == 'cant find utxo that is big enough') {
			toastr.error('cant find utxo that is big enough', 'Autotrade Info')
	   }
	   $('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});

});


$('.lp_set_price_btn').click(function(){
	var price = $('#lp_set_price').val();

	var base_coin = sessionStorage.getItem('dex_base_coin');
	var rel_coin = sessionStorage.getItem('dex_rel_coin');

	console.log('price ' + price);
	console.log('base '+ base_coin);
	console.log('rel ' + rel_coin);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"setprice","base":base_coin,"rel":rel_coin,"price":price};
	var url = "http://127.0.0.1:7779";

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
})


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
	var url = "http://127.0.0.1:7779";

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


var check_orderbook = setInterval(function() {
	console.log('checking orderbook')

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var base_coin = sessionStorage.getItem('dex_base_coin');
	var rel_coin = sessionStorage.getItem('dex_rel_coin');
	
	$('.orderbook_rel_coin').html(rel_coin);
	$('.orderbook_base_coin').html(base_coin);

	var ajax_data = {"userpass":userpass,"method":"orderbook","base":base_coin,"rel":rel_coin};
	//console.log(ajax_data)
	var url = "http://127.0.0.1:7779";

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
				orderbook_bids_tr += '<td class="col-xs-6">' + val.price + '</td>';
				orderbook_bids_tr += '<td class="col-xs-6">' + val.volume + '</td>';
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
				orderbook_asks_tr += '<td class="col-xs-6">' + val.price + '</td>';
				orderbook_asks_tr += '<td class="col-xs-6">' + val.volume + '</td>';
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

}, 1000);


$('.refresh_dex_balances').click(function() {
	console.log('clicked refresh button at dex balance screen')
	var refresh_data = {"coin":" ", "status": "enable"};
	enable_disable_coin(refresh_data)
});

$('.dex_balances_tbl tbody').on('click', '.dex_balances_tbl_disable_btn', function() {
	//console.log('Disable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "disable"};
	enable_disable_coin(refresh_data)
});

$('.dex_balances_tbl tbody').on('click', '.dex_balances_tbl_enable_btn', function() {
	//console.log('Enable this coin:' + $(this).data('coin'));
	var refresh_data = {"coin":$(this).data('coin'), "status": "enable"};
	enable_disable_coin(refresh_data)
});


function enable_disable_coin(data) {
	//console.log(data.coin);
	//console.log(data.status);
	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":data.status,"coin":data.coin};
	var url = "http://127.0.0.1:7779";

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
			$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
			get_coins_list(data);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function get_coins_list(data) {
	//console.log(data);
	$('.dex_balances_tbl tbody').empty();

	$.each(data, function(index, val) {
		//console.log(index);
		//console.log(val);

		var coin_name = return_coin_name(val.coin)

		var dex_balances_tbl_tr = '';

		dex_balances_tbl_tr += '<tr>';
			dex_balances_tbl_tr += '<td>'+ val.coin + '</td>';
			dex_balances_tbl_tr += '<td>' + coin_name + '</td>';
			dex_balances_tbl_tr += '<td>0.00000000</td>';
			dex_balances_tbl_tr += '<td>' + val.smartaddress + '</td>';
			dex_balances_tbl_tr += '<td><span class="label label-uppercase label-' + (( val.status == 'active' ) ? 'grey' : 'default') + '">' + val.status + '</span></td>';
			dex_balances_tbl_tr += '<td>' + (parseFloat(val.txfee)/100000000).toFixed(8) + '</td>';
			dex_balances_tbl_tr += '<td>' + (( val.status == 'active' ) ? '<button class="btn btn-xs btn-warning dex_balances_tbl_disable_btn" data-coin="' + val.coin + '">Disable</button>' : '<button class="btn btn-xs btn-success dex_balances_tbl_enable_btn" data-coin="' + val.coin + '">Enable</button>') + '</td>';
		dex_balances_tbl_tr += '</tr>';

		$('.dex_balances_tbl tbody').append(dex_balances_tbl_tr);
	})
};

$('.refresh_dex_myprices').click(function() {
	get_myprices();
});

function get_myprices() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"myprices"};
	var url = "http://127.0.0.1:7779";

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

function return_coin_name(coin) {
	var coin_name = '';

	switch (coin) {
		case 'KMD':
			coin_name = 'Komodo';
			break;
		case 'BTC':
			coin_name = 'Bitcoin';
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
		case 'MZC':
			coin_name = 'Mazacoin';
			break;
		case 'SYS':
			coin_name = 'Syscoin';
			break;
		case 'UNO':
			coin_name = 'Unobtanium';
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
		case 'HODL':
			coin_name = 'HODL';
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
		case 'MESH':
			coin_name = 'SuperMesh';
			break;
	}
	return coin_name;
}

$('.refresh_swap_list_btn').click(function() {
	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"swapstatus"};
	var url = "http://127.0.0.1:7779";

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
	var url = "http://127.0.0.1:7779/";

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