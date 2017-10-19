/*** Simple GUI JS ***/

//var CheckOrderbook_Interval = null;
//var CheckPortfolio_Interval = null;
var check_coin_balance_Interval = null;

var coin_pair = ["BTC","KMD"]

$('.coin.pair-one').html(coin_pair[0]);
$('.coin.pair-two').html(coin_pair[1]);

$.each($('.pair-one[data-coin]'), function(index, value) {
	$('.pair-one[data-coin]').attr('data-coin', coin_pair[0]);
});
$.each($('.pair-two[data-coin]'), function(index, value) {
	$('.pair-two[data-coin]').attr('data-coin', coin_pair[1]);
});

$(document).ready(function() {
	var mmstatus = ShepherdIPC({"command":"mmstatus"});
	if (mmstatus !== 'closed') {
		$('.mainbody').show();
		$('.loginbody').hide();
		//var refresh_data = {"coin":" ", "status": "enable"};
		//enable_disable_coin(refresh_data);
		//get_myprices();

		check_coin_balance_Interval = setInterval(check_coin_balance,3000);
		check_coin_balance();
	} else {
		$('.mainbody').hide();
		$('.loginbody').show();
	}
	//$('.set_goal_label_portfolio').html($('.sell_coin_p').selectpicker('val'));
});




$('.btn-receive').click(function() {
	console.log('btn-receive clicked');
	console.log($(this).data());

	if ($(this).data('pair') == 'one') {
		var coin_pair_one = sessionStorage.getItem('coin_pair_one');
		var coin_pair = JSON.parse(coin_pair_one);
	}
	if ($(this).data('pair') == 'two') {
		var coin_pair_two = sessionStorage.getItem('coin_pair_two');
		var coin_pair = JSON.parse(coin_pair_two);
	}

	console.log(coin_pair.smartaddress);

	bootbox.dialog({
	    //title: 'A custom dialog with init',
	    message: '<div style="text-align: center; margin-top: -40px;"><img src="img/cryptologo/'+$(this).data('coin')+'.png" style="border: 10px solid #fff;border-radius: 50px; background: #fff;"/></div><div style="text-align: center;"><div id="receive_addr_qrcode"></div><pre style="font-size: 18px;">'+coin_pair.smartaddress+'</pre class="receive_addr_qrcode_addr"></div>'
	});
	var qrcode = new QRCode("receive_addr_qrcode");
	qrcode.makeCode(coin_pair.smartaddress); // make another code.
	$('#receive_addr_qrcode > img').removeAttr('style');
	$('#receive_addr_qrcode > img').css('display', 'initial');
	$('#receive_addr_qrcode > img').css('border', '9px solid #f1f1f1','border-radius','5px','margin', '5px');
	$('#receive_addr_qrcode > img').css('border-radius','5px');
	$('#receive_addr_qrcode > img').css('margin', '5px');
})


$('.btn-send').click(function() {
	console.log('btn-send clicked');
	console.log($(this).data());
});


$('.btn-enable').click(function() {
	console.log('btn-enable clicked');
	//console.log($(this).data());

	var electrum_option = $('#toggle_pair_one').prop('checked');

	//console.log(electrum_option);

	var enable_data = $(this).data();
	enable_data['electrum'] = electrum_option;
	//console.log(enable_data);

	enable_disable_coin(enable_data);
});

$('.btn-disable').click(function() {
	console.log('btn-disable clicked');
	//console.log($(this).data());

	var electrum_option = $('#toggle_pair_one').prop('checked');

	//console.log(electrum_option);

	var enable_data = $(this).data();
	enable_data['electrum'] = electrum_option;
	//console.log(enable_data);

	enable_disable_coin(enable_data);
});

//$('.toggle_checkbox[data-coin="' + val.coin + '"]')



function check_coin_balance(sig) {
	if (sig == false) {
		clearInterval(check_coin_balance_Interval);
	} else {
		console.log('checking coin balance');
	}
	//Set pair coin settings

	$.each(coin_pair, function(index, val) {
		//console.log(index);
		//console.log(val);

		if (val == 'BTC') {
			if (index == 0) {
				$('#toggle_pair_one').bootstrapToggle('enable')
			} else {
				$('#toggle_pair_two').bootstrapToggle('enable')
			}
		} else {
			if (index == 0) {
				$('#toggle_pair_one').bootstrapToggle('disable')
			} else {
				$('#toggle_pair_two').bootstrapToggle('disable')
			}
		}

		var userpass = sessionStorage.getItem('mm_userpass');
		var ajax_data = {"userpass":userpass,"method":"getcoin","coin": val};
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
				console.log('coin '+ val + ' is disabled');
				$('.btn-send[data-coin="' + val + '"]').hide();
				$('.btn-receive[data-coin="' + val + '"]').hide();
				$('.btn-exchange[data-coin="' + val + '"]').hide();
				$('.btn-inventory[data-coin="' + val + '"]').hide();
				$('.btn-enable[data-coin="' + val + '"]').show();
				$('.btn-disable[data-coin="' + val + '"]').hide();

				if (index == 0) {
					$('.balance.pair-one').html('Coin is disabled.<br>Please enable before trading ')
					$('.balance.pair-one').css( "font-size", "35px" );
					sessionStorage.setItem('coin_pair_one', JSON.stringify({"coin":val,"address":null}));
				} else {
					$('.balance.pair-two').html('Coin is disabled.<br>Please enable before trading ')
					$('.balance.pair-two').css( "font-size", "35px" );
					sessionStorage.setItem('coin_pair_one', JSON.stringify({"coin":val,"address":null}));
				}

				/*if (index == 0) {
					//$('#toggle_pair_one').show();
					//$('#toggle_pair_one').bootstrapToggle('initialize');
				} else {
					//$('#toggle_pair_two').show();
					//$('#toggle_pair_two').bootstrapToggle('initialize');
				}*/

			} else {
				//console.log(data);
				//console.log(data.coin);
				//console.log(data.coin.smartaddress);
				//console.log(val);

				$('.btn-send[data-coin="' + val + '"]').show();
				$('.btn-receive[data-coin="' + val + '"]').show();
				$('.btn-exchange[data-coin="' + val + '"]').show();
				$('.btn-inventory[data-coin="' + val + '"]').show();
				$('.btn-enable[data-coin="' + val + '"]').hide();
				$('.btn-disable[data-coin="' + val + '"]').show();

				if (index == 0) {
					//$('#toggle_pair_one').bootstrapToggle('destroy');
					//$('#toggle_pair_one').hide();
					sessionStorage.setItem('coin_pair_one', JSON.stringify(data.coin));
				} else {
					//$('#toggle_pair_two').bootstrapToggle('destroy');
					//$('#toggle_pair_two').hide();
					sessionStorage.setItem('coin_pair_two', JSON.stringify(data.coin));
				}

				get_balance();
			}

			//if (data.error == 'coin is disabled') {
				//console.log('coin '+ val + ' is disabled');
			//}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			// If fail
			console.log(textStatus + ': ' + errorThrown);
		});
	})

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

function get_coin(data) {
	console.log(data);

	var userpass = sessionStorage.getItem('mm_userpass');
	var ajax_data = {"userpass":userpass,"method":"getcoin","coin":data.coin};
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
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}