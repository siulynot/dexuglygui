/*** Added GUI Features (related more towards UX than towards DEX) ***/

/** DEX COINS MANAGEMENT SETTINGS **/
// Startup Coins Actions ////////////////////
$('.btn-managecoins').click(function(e){
	e.preventDefault();
	console.log('btn-managecoins clicked');

	$('.screen-portfolio').hide();
	$('.screen-coindashboard').hide();
	$('.screen-exchange').hide();
	$('.screen-inventory').hide();
	$('.dexdebug').hide();
	$('.dextradeshistory').hide();
	$('.screen-managecoins').show();

	$('.navbar-right').children().removeClass('active');
	$('.screen-managecoins').css("height", $(document).height());

	RefreshDEXManageCoinsFn();
	RefreshCoinsDBLocalDBList();
})

$('.dex_mng_coins_list tbody').on('click', '.btn_dex_mng_coins_list_remove', function(e) {
	e.preventDefault();
	console.log('btn-btn_dex_mng_coins_list_remove clicked');
	console.log($(this).data());

	var tmp_remove_coin_obj = {coin: $(this).data('coin'), electrum: false, method: "enable"}
	ManageDEXCoins('remove',tmp_remove_coin_obj);
	RefreshDEXManageCoinsFn();
	toastr.info($(this).data('coin') + ' removed from Startup Coins list.', 'DEX Coins Mangement')
});

$('.btn-refreshmanagecoins').click(function(e){
	e.preventDefault();
	console.log('btn-refreshmanagecoins clicked');
	RefreshDEXManageCoinsFn();
})

$('.btn-managecoins_add_to_startup').click(function(e){
	e.preventDefault();
	console.log('btn-managecoins_add_to_startup clicked');
	var addcoin_startup_data = {};
	addcoin_startup_data.coin = $('.addcoin_startup_select').selectpicker('val');
	addcoin_startup_data.electrum = $('#addcoin_toggle_startup_native_electrum').prop('checked');
	addcoin_startup_data.method = 'enable';

	console.log(addcoin_startup_data);
	ManageDEXCoins('add',addcoin_startup_data);
	RefreshDEXManageCoinsFn();
	toastr.info(addcoin_startup_data.coin + ' added to Startup Coins list.', 'DEX Coins Mangement')
})

function RefreshDEXManageCoinsFn() {
	var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
	var lstore_default_coins_list_array = JSON.parse(localStorage.getItem('mm_default_coins_list'));
	var default_lang = JSON.parse(sessionStorage.getItem('mm_default_lang'));
	$('.dex_mng_coins_list tbody').empty();
	var dex_mng_coins_list_tr = '<tr><td>COIN</td><td>MODE</td><td>ACTIONS</td></tr>';
	$.each(lstore_default_coins_list_array, function(index,value) {
		//console.log(index);
		//console.log(value);
		dex_mng_coins_list_tr += `<tr><td><img src='${coinsdbdir}/icons/${value.coin.toLowerCase()}.png' width='30px;'/> ${CoinsDB_GetCoinDetails(value.coin).fname} (${value.coin})</td><td>${ (value.electrum == false ? "Electrum" : "Native")}</td><td><button class="btn btn-xs btn-danger btn_dex_mng_coins_list_remove" data-coin="${value.coin}">Remove</button></td></tr>`
	});
	$('.dex_mng_coins_list tbody').append(dex_mng_coins_list_tr);
	toastr.info('Default Startup Coins list refreshed', 'DEX Coins Mangement')
}

// Startup Coins Actions END ////////////////////




// CoinsDB Actions ////////////////////

$('.dex_mng_local_db_coins_list tbody').on('click', '.dex_mng_local_db_coins_list_remove', function(e) {
	e.preventDefault();
	console.log('btn-dex_mng_local_db_coins_list_remove clicked');
	console.log($(this).data());

	CoinsDB_ManageCoinsJson("remove", $(this).data('coin'));
	CoinsDB_ManageCoinsDetails('gen');
	RefreshCoinsDBLocalDBList();
	//setTimeout(function(){ }, 1 * 1000);
	toastr.info($(this).data('coin') + ' removed from Local Coins DB.', 'DEX Coins DB Mangement')
	$('.app-notifications').show();
	$('.alert_coindb').show();
});

$('.dex_mng_local_db_coins_list tbody').on('click', '.dex_mng_local_db_coins_list_detail', function(e) {
	e.preventDefault();
	console.log('btn-dex_mng_local_db_coins_list_detail clicked');
	console.log($(this).data());

	var selected_coin = $(this).data('coin');
	var default_lang = JSON.parse(sessionStorage.getItem('mm_default_lang'));

	var local_db_detail_bootbox = bootbox.dialog({
		onEscape: true,
		backdrop: true,
		message: `
			<div class="row">
				<div class="col-sm-6">
					<table class="table table-striped local_db_detail_explorers" width="100%" style="margin-bottom: 0;">
						<thead>
							<tr>
								<td>Explorer URL</td>
							</tr>
						</thead>
						<tbody>
							
						</tbody>
					</table>
				</div>
				<div class="col-sm-6">
					<table class="table table-striped local_db_detail_electrums" width="100%" style="margin-bottom: 0;">
						<thead>
							<tr>
								<td>Electrum Server</td>
								<td>Port</td>
							</tr>
						</thead>
						<tbody>
							
						</tbody>
					</table>
				</div>
			</div>`,
		closeButton: false,
		size: 'large',

		buttons: {
			ok: {
				label: `${default_lang.Common.btn_ok_caps}`,
				className: 'btn-default',
				callback: function () {
					
				}
			}
		}
	});
	local_db_detail_bootbox.init(function () {
		console.log(selected_coin);
		var explorers_list = CoinsDB_GetCoinDetails(selected_coin).explorer;
		var electrums_list = CoinsDB_GetCoinDetails(selected_coin).electrum;
		//console.log(explorers_list);
		console.log(electrums_list);

		//List all explorers list
		$('.local_db_detail_explorers tbody').empty();
		var local_db_detail_explorers_tr = '';
		$.each(explorers_list, function(exp_index, exp_value) {
			local_db_detail_explorers_tr += `<tr><td>${exp_value}</td></tr>`;
		});
		$('.local_db_detail_explorers tbody').append(local_db_detail_explorers_tr);

		//List all electrum servers list
		$('.local_db_detail_electrums tbody').empty();
		var local_db_detail_electrums_tr = '';
		$.each(electrums_list, function(elec_index, elec_value) {
			var ipaddr = _.keys(elec_value);
			var return_data_ipaddr = ipaddr[0];
			var return_data_port = elec_value[ipaddr[0]];
			//console.log(return_data_ipaddr);
			//console.log(return_data_port);
			local_db_detail_electrums_tr += `<tr><td>${return_data_ipaddr}</td><td>${return_data_port}</td></tr>`;
		});
		$('.local_db_detail_electrums tbody').append(local_db_detail_electrums_tr);
	});
});

$('.btn-managecoins_add_to_localdb').click(function(e){
	e.preventDefault();
	console.log('btn-managecoins_add_to_localdb clicked');
	var addcoin_localdb_coin =  $('.addcoin_coinsdb_select').selectpicker('val');
	console.log(addcoin_localdb_coin);
	CoinsDB_ManageCoinsJson("add", addcoin_localdb_coin);
	setTimeout(function(){
		CoinsDB_ManageCoinsDetails('gen');
		RefreshCoinsDBLocalDBList();
		toastr.success('Local Coins Database Updated.', 'DEX Coins DB Mangement')
		$('.app-notifications').show();
		$('.alert_coindb').show();
	}, 1 * 1000);
});


$('.btn-refreshlocalcoinsdb').click(function(e){
	e.preventDefault();
	console.log('btn-refreshlocalcoinsdb clicked');
	RefreshCoinsDBLocalDBList();
})

$('.btn-fetchcoinsdbupdate').click(function(e){
	e.preventDefault();
	console.log('btn-fetchcoinsdbupdate clicked');

	CoinsDB_UpdatedCoinsDbFile();
	setTimeout(function(){
		$('.addcoin_coinsdb_select').selectpicker('destroy');
		$('.addcoin_coinsdb_select').html(CoinDB_manage_coin_select_options());
		$('.addcoin_coinsdb_select').selectpicker('render');
		toastr.success('Refreshed latest Coins Database.', 'DEX Coins DB Mangement')
	}, 5 * 1000);
	toastr.info('Fetching latest Coins Database.', 'DEX Coins DB Mangement')
})

$('.btn-updatelocalcoinsdb').click(function(e){
	e.preventDefault();
	console.log('btn-updatelocalcoinsdb clicked');

	var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
	CoinsDB_Dl_Extra(lstore_coinsdb_json_array);
	toastr.info('Fetching latest Explorers & Electrum server info for local coins database.', 'DEX Coins DB Mangement')
})

$('.btn-resetlocalcoinsdb').click(function(e){
	e.preventDefault();
	console.log('btn-resetlocalcoinsdb clicked');

	CoinsDB_ManageCoinsJson('reset');
	RefreshCoinsDBLocalDBList();
	$('.app-notifications').show();
	$('.alert_coindb').show();
	$('.alert_coindb').html(`<strong>Local DB Update: </strong> Local Coins DB set to default state. You can update local db from coins db list or just restart now to complete this udpate.`);
	toastr.success('Local Coins DB set to default state. Please restart BarterDEX App to complete db setup.', 'DEX Coins DB Mangement')
})

function RefreshCoinsDBLocalDBList() {
	var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
	var local_coins_json = ShepherdIPC({ "command": "coins_db_read_coins_json" });
	
	$('.dex_mng_local_db_coins_list tbody').empty();
	var dex_mng_local_db_coins_list_tr = `<tr><td>COIN</td>
											<td>ETH TOKEN</td>
											<td>ACTIONS</td>
										</tr>`;
	$.each(local_coins_json, function(index,value) {
		//console.log(index);
		console.log(value);
		dex_mng_local_db_coins_list_tr += `<tr>
									<td><img src='${coinsdbdir}/icons/${value.coin.toLowerCase()}.png' width='30px;'/> ${CoinsDB_GetCoinDetails(value.coin).fname} (${value.coin})</td>
									<td>${ (value.eth == true ? `<span class="label label-info">TRUE</span>` : `<span class="label label-warning">FALSE</span>`)}</td>
									<td>
										<button class="btn btn-xs btn-danger dex_mng_local_db_coins_list_remove" data-coin="${value.coin}">Remove</button>
										<button class="btn btn-xs btn-info dex_mng_local_db_coins_list_detail" data-coin="${value.coin}">Detail</button>
									</td>
								</tr>`
	});
	$('.dex_mng_local_db_coins_list tbody').append(dex_mng_local_db_coins_list_tr);
	toastr.info('Local Coins DB list refreshed', 'DEX Coins DB Mangement')

}


// CoinsDB Actions END ////////////////////


/** DEX COINS MANAGEMENT SETTINGS END **/
