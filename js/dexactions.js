$('.activate-btc').click(function() {
	console.log('activate btc basilisk');
	var ajax_data = {"prefetchlag":-1,"poll":1,"active":1,"agent":"iguana","method":"addcoin","newcoin":"BTC","startpend":64,"endpend":64,"services":0,"maxpeers":512,"RELAY":0,"VALIDATE":0,"portp2p":8333,"minconfirms":1};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.active-coin-output').html(JSON.stringify(data, null, 2));
	   $('.active-coin-output').append('\n------- BTC Acviated in Basilisk Mode -------');
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
});

$('.activate-kmd').click(function() {
	console.log('activate kmd basilisk');
	var ajax_data = {"unitval":"20","zcash":1,"RELAY":0,"VALIDATE":0,"prefetchlag":-1,"poll":10,"active":1,"agent":"iguana","method":"addcoin","startpend":8,"endpend":8,"services":0,"maxpeers":32,"newcoin":"KMD","name":"Komodo","hasheaders":1,"useaddmultisig":0,"netmagic":"f9eee48d","p2p":7770,"rpc":7771,"pubval":60,"p2shval":85,"wifval":188,"txfee_satoshis":"10000","isPoS":0,"minoutput":10000,"minconfirms":2,"genesishash":"027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71","protover":170002,"genesisblock":"0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a000000000000000000000000000000000000000000000000000000000000000029ab5f490f0f0f200b00000000000000000000000000000000000000000000000000000000000000fd4005000d5ba7cda5d473947263bf194285317179d2b0d307119c2e7cc4bd8ac456f0774bd52b0cd9249be9d40718b6397a4c7bbd8f2b3272fed2823cd2af4bd1632200ba4bf796727d6347b225f670f292343274cc35099466f5fb5f0cd1c105121b28213d15db2ed7bdba490b4cedc69742a57b7c25af24485e523aadbb77a0144fc76f79ef73bd8530d42b9f3b9bed1c135ad1fe152923fafe98f95f76f1615e64c4abb1137f4c31b218ba2782bc15534788dda2cc08a0ee2987c8b27ff41bd4e31cd5fb5643dfe862c9a02ca9f90c8c51a6671d681d04ad47e4b53b1518d4befafefe8cadfb912f3d03051b1efbf1dfe37b56e93a741d8dfd80d576ca250bee55fab1311fc7b3255977558cdda6f7d6f875306e43a14413facdaed2f46093e0ef1e8f8a963e1632dcbeebd8e49fd16b57d49b08f9762de89157c65233f60c8e38a1f503a48c555f8ec45dedecd574a37601323c27be597b956343107f8bd80f3a925afaf30811df83c402116bb9c1e5231c70fff899a7c82f73c902ba54da53cc459b7bf1113db65cc8f6914d3618560ea69abd13658fa7b6af92d374d6eca9529f8bd565166e4fcbf2a8dfb3c9b69539d4d2ee2e9321b85b331925df195915f2757637c2805e1d4131e1ad9ef9bc1bb1c732d8dba4738716d351ab30c996c8657bab39567ee3b29c6d054b711495c0d52e1cd5d8e55b4f0f0325b97369280755b46a02afd54be4ddd9f77c22272b8bbb17ff5118fedbae2564524e797bd28b5f74f7079d532ccc059807989f94d267f47e724b3f1ecfe00ec9e6541c961080d8891251b84b4480bc292f6a180bea089fef5bbda56e1e41390d7c0e85ba0ef530f7177413481a226465a36ef6afe1e2bca69d2078712b3912bba1a99b1fbff0d355d6ffe726d2bb6fbc103c4ac5756e5bee6e47e17424ebcbf1b63d8cb90ce2e40198b4f4198689daea254307e52a25562f4c1455340f0ffeb10f9d8e914775e37d0edca019fb1b9c6ef81255ed86bc51c5391e0591480f66e2d88c5f4fd7277697968656a9b113ab97f874fdd5f2465e5559533e01ba13ef4a8f7a21d02c30c8ded68e8c54603ab9c8084ef6d9eb4e92c75b078539e2ae786ebab6dab73a09e0aa9ac575bcefb29e930ae656e58bcb513f7e3c17e079dce4f05b5dbc18c2a872b22509740ebe6a3903e00ad1abc55076441862643f93606e3dc35e8d9f2caef3ee6be14d513b2e062b21d0061de3bd56881713a1a5c17f5ace05e1ec09da53f99442df175a49bd154aa96e4949decd52fed79ccf7ccbce32941419c314e374e4a396ac553e17b5340336a1a25c22f9e42a243ba5404450b650acfc826a6e432971ace776e15719515e1634ceb9a4a35061b668c74998d3dfb5827f6238ec015377e6f9c94f38108768cf6e5c8b132e0303fb5a200368f845ad9d46343035a6ff94031df8d8309415bb3f6cd5ede9c135fdabcc030599858d803c0f85be7661c88984d88faa3d26fb0e9aac0056a53f1b5d0baed713c853c4a2726869a0a124a8a5bbc0fc0ef80c8ae4cb53636aa02503b86a1eb9836fcc259823e2692d921d88e1ffc1e6cb2bde43939ceb3f32a611686f539f8f7c9f0bf00381f743607d40960f06d347d1cd8ac8a51969c25e37150efdf7aa4c2037a2fd0516fb444525ab157a0ed0a7412b2fa69b217fe397263153782c0f64351fbdf2678fa0dc8569912dcd8e3ccad38f34f23bbbce14c6a26ac24911b308b82c7e43062d180baeac4ba7153858365c72c63dcf5f6a5b08070b730adb017aeae925b7d0439979e2679f45ed2f25a7edcfd2fb77a8794630285ccb0a071f5cce410b46dbf9750b0354aae8b65574501cc69efb5b6a43444074fee116641bb29da56c2b4a7f456991fc92b2","debug":0};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.active-coin-output').html(JSON.stringify(data, null, 2));
	   $('.active-coin-output').append('\n------- KMD Acviated in Basilisk Mode -------');
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
});


$('.active-coin-status').click(function() {
	var ajax_data = {'agent': 'InstantDEX','method': 'allcoins'};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.active-coin-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.blocktrailapi-btn').click(function() {
	var blocktrail_api_key = $('.blocktrailapi-key').val();
	var ajax_data = {"agent":"tradebot","method":"amlp","blocktrail":blocktrail_api_key};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.blocktrail-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.notlp-btn').click(function() {
	var ajax_data = {"agent":"tradebot","method":"notlp"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.blocktrail-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.login-btn').click(function() {
	var _login_type = $('.login_type').val();
	if (_login_type == 'login_main_wallet') {
		var _passphrase = $('.passphrase-text').val();
		$('.step04_smartaddr').show();
		$('.step05_dexparams').show();
		$('.step07_initswap').show();
		$('.step08_checkswaps').show();
	} else {
		$('.step04_smartaddr').hide();
		$('.step05_dexparams').hide();
		$('.step07_initswap').hide();
		$('.step08_checkswaps').hide();
	}
	if (_login_type == 'login_btc_jumblr') {
		var _passphrase = "btc jumblr " + $('.passphrase-text').val();
	}
	if (_login_type == 'login_kmd_jumblr') {
		var _passphrase = "kmd jumblr " + $('.passphrase-text').val();
	}
	if (_login_type == 'login_jumblr') {
		var _passphrase = "jumblr " + $('.passphrase-text').val();
	}
	if (_login_type == 'login_deposit') {
		var _passphrase = "deposit " + $('.passphrase-text').val();
	}

	var ajax_data = {"agent":"bitcoinrpc","method":"walletpassphrase","password":_passphrase,"timeout":8644444};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.passphrase-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})

$('.logout-btn').click(function() {
	var ajax_data = {"agent":"bitcoinrpc","method":"walletlock"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.passphrase-output').html(JSON.stringify(data, null, 2));
	   $('.step04_smartaddr').show();
	   $('.step05_dexparams').show();
	   $('.step07_initswap').show();
	   $('.step08_checkswaps').show();
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.login_btc_jumblr_btn').click(function() {
	
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.passphrase-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})


$('.login_kmd_jumblr_btn').click(function() {
	
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.passphrase-output').html(JSON.stringify(data, null, 2));
	   $('.step04_smartaddr').hide();
	   $('.step05_dexparams').hide();
	   $('.step07_initswap').hide();
	   $('.step08_checkswaps').hide();
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})



$('.list-smartaddress').click(function() {
	var ajax_data = {"agent":"InstantDEX","method":"smartaddresses"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.deposit_key0').html(data[0].coins[0].coin);
	   $('.deposit_val0').html(data[0].coins[0].address);
	   $('.deposit_key1').html(data[0].coins[1].coin);
	   $('.deposit_val1').html(data[0].coins[1].address);

	   $('.jumblr_key0').html(data[1].coins[0].coin);
	   $('.jumblr_val0').html(data[1].coins[0].address);
	   $('.jumblr_key1').html(data[1].coins[1].coin);
	   $('.jumblr_val1').html(data[1].coins[1].address);

	   $('.type0').html(data[2].type);
	   $('.type0_val0').html(data[2].coins[0].coin);
	   $('.type0_val1').html(data[2].coins[0].address);
	   $('.type0_val2').html(data[2].coins[0].dest);
	   $('.type0_val3').html(data[2].coins[0].jumblr_deposit);
	   $('.type0_val4').html(data[2].coins[0].deposit_avail);
	   $('.type0_val5').html(data[2].coins[0].jumblr);
	   $('.type0_val6').html(data[2].coins[0].jumblr_avail);
	   $('.type0_val7').html(JSON.stringify(data[2].coins[0].extra, null, 2));

	   $('.type1').html(data[3].type);
	   $('.type1_val0').html(data[3].coins[0].coin);
	   $('.type1_val1').html(data[3].coins[0].address);
	   $('.type1_val2').html(data[3].coins[0].dest);
	   $('.type1_val3').html(data[3].coins[0].jumblr_deposit);
	   $('.type1_val4').html(data[3].coins[0].deposit_avail);
	   $('.type1_val5').html(data[3].coins[0].jumblr);
	   $('.type1_val6').html(data[3].coins[0].jumblr_avail);
	   $('.type1_val7').html(JSON.stringify(data[3].coins[0].extra, null, 2));

	   $('.smartaddress-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})

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
	//console.log($('.buy_coin').val())
	rel_coin = $('.deposit_coin01').data('coin');
	base_coin = $('.buy_coin').val();

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
	}

	get_price(base_coin, rel_coin);
  
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
	var ajax_data = {"userpass":userpass,"method":"getprice","base":base,"rel":rel};
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
	   	sessionStorage.setItem('mm_userpass', data.userpass);
	   	get_price(base,rel)
	   } else if (!data.error === false) {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info').empty();
	   } else {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.coin_swap_rate_info').empty();
	   	$('.coin_swap_rate_info').html('<b>1 '+base+' = ' + data.price + ' '+rel+' approx.</b>');
	   	//$('.coin_swap_rate_info').html('Theoretical Price<br><b>1 '+base+' = ' + data.theoretical[rel] + ' '+rel+' approx.</b><br>Quotes Price<br><b>1 '+base+' = ' + data.quotes[rel] + ' '+rel+' approx.</b>');
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}

function get_marketmaker_userpass() {
	var userpass = sessionStorage.getItem('mm_userpass');
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
	   	sessionStorage.setItem('mm_userpass', data.userpass);
	   	get_marketmaker_userpass()
	   } else {
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


$('.inv_btn').click(function() {
	var coin = $(this).data('coin');

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
	}
	
	$('.deposit_coin01').data('coin', coin);
	//calc_swap_price('kmdbtc');

	var userpass = sessionStorage.getItem('mm_userpass');
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
	   	sessionStorage.setItem('mm_userpass', data.userpass);
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).trigger( "click" );
	   } else {
	   	$( ".inv_btn" ).removeClass("active")
	   	$( ".inv_btn[data-coin='"+ coin +"']" ).addClass(" active");
	   	$('.initcoinswap-output').html(JSON.stringify(data, null, 2));
	   	$('.inv_table tbody').empty();
	   	$.each(data, function(index, val) {
	   		//console.log(index);
	   		//console.log(val);
	   		var inv_table_tr = '';
	   		inv_table_tr += '<tr>';
              inv_table_tr += '<td>' + (parseFloat(val.value)/100000000).toFixed(8) + ' ' + val.coin + '</td>';
              inv_table_tr += '<td><input class="form-control input-sm trade_pair_maxprice" type="text" name="price" value="" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'"></td>';
              inv_table_tr += '<td><button class="btn btn-default btn-sm inv_autotrade" data-coin="'+val.coin+'" data-txid="'+val.txid+'" data-vout="'+val.vout+'">Trade</button></td>';
            inv_table_tr += '</tr>';
            $('.inv_table tbody').append(inv_table_tr);
	   	})
	   }
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
});


$('.inv_table tbody').on('click', '.inv_autotrade', function() {
	var coin = $(this).data('coin');
	var txid = $(this).data('txid');
	var vout = $(this).data('vout');
	console.log(coin);
	console.log(txid);
	console.log(vout);
	console.log($('.trade_pair_maxprice[data-txid="'+txid+'"][data-vout="'+vout+'"]').val());
})


//{"userpass":"$userpass","method":"orderbook","base":"REVS","rel":"KMD"}

/*
$('.deposit_coin_btn_01').click(function() {
	var get_depsit_addr = $('.deposit_coin_addr').text();
	$('.initcoinswap-output').html('<i>Sending 100 KMD to ' + get_depsit_addr + '<br>processing...</i>');

	var ajax_data = {"coin":"KMD","method":"sendtoaddress","params":[get_depsit_addr, 100]};
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
})

$('.deposit_coin_btn_02').click(function() {
	var get_depsit_addr = $('.deposit_coin_addr').text();
	$('.initcoinswap-output').html('<i>Sending 0.001 KMD fee to ' + get_depsit_addr + '<br>processing...</i>');

	var ajax_data = {"coin":"KMD","method":"sendtoaddress","params":[get_depsit_addr, 0.001]};
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
})

$('.deposit_coin_btn_03').click(function() {
	var get_depsit_addr = $('.deposit_coin_addr').text();
	var deposit_100kmd_worth_btc_btn = $('.deposit_100kmd_worth_btc_btn').text();
	$('.initcoinswap-output').html('<i>Sending ' + deposit_100kmd_worth_btc_btn + ' BTC to ' + get_depsit_addr + '<br>processing...</i>');

	var ajax_data = {"coin":"BTC","method":"sendtoaddress","params":[get_depsit_addr, deposit_100kmd_worth_btc_btn]};
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
})*/

$('.refresh_swap_list_btn').click(function() {
	var ajax_data = {"agent":"InstantDEX","method":"getswaplist"};
	var url = "http://127.0.0.1:7778/";

	$.ajax({
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: 'http://127.0.0.1:7778'
	}).done(function(data) {
	    // If successful
	   console.log(data);
	   $('.checkswaplist-output').html(JSON.stringify(data, null, 2));
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
})