
function BarterDEX_Init_CoinsDB() {
	var barterDEX_app_info = ShepherdIPC({ "command": "app_info" });
	console.log(barterDEX_app_info);

	localStorage.setItem('mm_barterdex_app_info', JSON.stringify(barterDEX_app_info));
	CoinsDB_ManageCoinsJson();


	//Populate drop down select coins options in app//
	$('.trading_pair_coin').html(CoinDB_coin_json_select_options());
	$('.trading_pair_coin2').html(CoinDB_coin_json_select_options());

	$('.sell_coin').html(CoinDB_coin_json_select_options());
	$('.buy_coin').html(CoinDB_coin_json_select_options());

	$('.sell_coin_p').html(CoinDB_coin_json_select_options());
	$('.buy_coin_p').html(CoinDB_coin_json_select_options());

	// Startup coins select options populated with all coins db select options //
	$('.addcoin_coinsdb_select').html(CoinDB_manage_coin_select_options());
	$('.addcoin_startup_select').html(CoinDB_coin_json_select_options());
}

function CoinsDB_UpdatedCoinsDbFile() {
	var update_coinsdb_file = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"update_coins_file"} });
	console.log(update_coinsdb_file);
}


function CoinsDB_Dl_Extra(icons_array) {
	console.log(icons_array);
	var icons_dl = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"dl_icons","coin_array":icons_array} });
	var explorers_dl = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"dl_coin_explorers","coin_array":icons_array} });
	var electrums_dl = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"dl_coin_electrums","coin_array":icons_array} });
}


function CoinsDB_ReadLocalDB() {
	var local_coinsdb = ShepherdIPC({ "command": "coins_db_read_db" });
	//console.log(local_coinsdb)
	return local_coinsdb;
}


function CoinsDB_ManageCoinsJson(coins_json_action, coins_json_data) {
	
	var default_coinsdb_json_array = ["BTC","KMD"]

	switch (coins_json_action) {
		case 'add':
			console.log('Adding: ' + coins_json_data);
			if (JSON.parse(localStorage.getItem('mm_coinsdb_json_array')) == null) {
				console.warn(`localStorage object mm_coinsdb_json_array not found. Creating with default values...`);
				localStorage.setItem('mm_coinsdb_json_array', JSON.stringify(default_coinsdb_json_array));
			} else {
				var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
				if (_.contains(lstore_coinsdb_json_array, coins_json_data) == false) {
					lstore_coinsdb_json_array.push(coins_json_data);
					localStorage.setItem('mm_coinsdb_json_array', JSON.stringify(_.sortBy(lstore_coinsdb_json_array)));
					console.log(`Coin ${coins_json_data} added to the local array.`);
					CoinsDB_Dl_Extra([`${coins_json_data}`])
					return lstore_coinsdb_json_array;
				} else {
					console.warn(`Coin ${coins_json_data} already exists in local array`);
					CoinsDB_Dl_Extra([`${coins_json_data}`])
					return lstore_coinsdb_json_array
				}
			}
			break;
		case 'remove':
			console.log('Removing: ' + coins_json_data);
			var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
			if (_.contains(lstore_coinsdb_json_array, coins_json_data) == false) {
				console.warn(`Coin ${coins_json_data} does't exists in local array. Remove coin action terminated.`);
				return lstore_coinsdb_json_array;
			} else {
				console.log(`Coin ${coins_json_data} found in local array. Updating local array with updated list...`)
				lstore_coinsdb_json_array = _.without(lstore_coinsdb_json_array, coins_json_data);
				localStorage.setItem('mm_coinsdb_json_array', JSON.stringify(_.sortBy(lstore_coinsdb_json_array)));
				console.log(`Coin ${coins_json_data} removed from the local array.`);
				return lstore_coinsdb_json_array;
			}
			
			break;
		case 'reset':
			console.log('Resetting localStorage Coins DB array...');
			localStorage.setItem('mm_coinsdb_json_array', JSON.stringify(default_coinsdb_json_array));
			CoinsDB_ManageCoinsDetails('reset');
			return default_coinsdb_json_array;
		default:
			console.warn(`No action specified. Executing default action...`);
			if (JSON.parse(localStorage.getItem('mm_coinsdb_json_array')) == null) {
				console.warn(`localStorage object mm_coinsdb_json_array not found. Creating with default values...`);
				localStorage.setItem('mm_coinsdb_json_array', JSON.stringify(default_coinsdb_json_array));
			} else {
				var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
				return lstore_coinsdb_json_array;
			}
	}
}

function CoinsDB_ManageCoinsDetails(coins_detail_action) {
	//TODO
	var default_coins_detail_list = [{"coin": "KMD", "fname": "Komodo","name":"komodo","eth":false},{"coin": "BTC", "fname": "Bitcoin","name":"bitcoin","eth":false}]

	var local_coinsdb = ShepherdIPC({ "command": "coins_db_read_db" });
	var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
	switch (coins_detail_action) {
		case 'gen':
			console.log(`Generating coins.json file...`);
			console.log(lstore_coinsdb_json_array);
			var processed_coins_db = [];
			$.each(lstore_coinsdb_json_array, function(index, value){
				//console.log(index);
				//console.log(value);
				$.each(local_coinsdb, function(db_index, db_val) {
					if (db_val.coin == value) {
						//console.log(db_val);
						if (db_val.etomic != undefined) {
							console.log(`${db_val.coin} is ETOMIC`);
							db_val.eth = true
							console.log(db_val);
							processed_coins_db.push(db_val);
						} else {
							db_val.eth = false
							console.log(db_val);
							processed_coins_db.push(db_val);
						}
					}
				});
			});
			console.log(processed_coins_db);
			var update_coins_json_file = ShepherdIPC({ "command": "coins_db_update_coins_json_file", "data": processed_coins_db });
			//console.log(update_coins_json_file);
			break;
		case 'reset':
			console.log('Resetting existing coins.json file...');
			var update_coins_json_file = ShepherdIPC({ "command": "coins_db_update_coins_json_file", "data": [] });
		default:
			console.log(`Default action. No action selected.`);
			break;
		}

	/*
	
	ShepherdIPC({ "command": "coinsdb_manage", "data": ["BTC", "CHIPS", "JST", "KMD", "OOT"] });

	ShepherdIPC({ "command": "coins_db_update_coins_json_file", "data": [{"coin": "KMD", "Name": "Komodo","explorer":["https://www.kmd.host/tx/"],"eth":false,"electrum":[{"electrum2.cipig.net":10001},{"electrum1.cipig.net":10001}]},{"coin": "BTC", "Name": "Bitcoin","explorer":["https://www.blocktrail.com/BTC/tx/"],"eth":false,"electrum":[{"electrum2.cipig.net":10000},{"electrum1.cipig.net":10000}]}] });
	
	*/
}


function CoinsDB_GetCoinDetails(coin_code) {
	//console.log(coin_code)
	var coins_detail_list = [{"coin": "KMD", "fname": "Komodo","name":"komodo","eth":false},{"coin": "BTC", "fname": "Bitcoin","name":"bitcoin","eth":false}]
	//var coins_detail_list = [{"coin": "KMD", "Name": "Komodo","explorer":["https://www.kmd.host/tx/"],"eth":false,"electrum":[{"electrum2.cipig.net":10001},{"electrum1.cipig.net":10001}]},{"coin": "BTC", "Name": "Bitcoin","explorer":["https://www.blocktrail.com/BTC/tx/"],"eth":false,"electrum":[{"electrum2.cipig.net":10000},{"electrum1.cipig.net":10000}]}]

	var coin_explorers = ShepherdIPC({ "command": "coins_db_read_explorers", "coin": coin_code });
	var coin_electrums = ShepherdIPC({ "command": "coins_db_read_electrums", "coin": coin_code });
	var local_coins_json = ShepherdIPC({ "command": "coins_db_read_coins_json" });
	var local_coins_json = local_coins_json.concat(coins_detail_list);

	var coin_details = '';
	$.each(local_coins_json, function(index, value){
		//console.log(index);
		//console.log(value);
		if (coin_code == value.coin) {
			coin_details = value;
			coin_details.explorer = coin_explorers;
			coin_details.electrum = coin_electrums;
		}
	});

	return coin_details;
}

function CoinDB_coin_json_select_options() {
	var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
	//console.log(coinsdbdir);

	var coins_detail_list = [{"coin": "KMD", "fname": "Komodo","name":"komodo","eth":false},{"coin": "BTC", "fname": "Bitcoin","name":"bitcoin","eth":false}]
	var local_coins_json = ShepherdIPC({ "command": "coins_db_read_coins_json" });
	var local_coins_json = local_coins_json.concat(coins_detail_list);
	
	var options_data = '';
	$.each(local_coins_json, function(index, value){
		//console.log(index);
		//console.log(value);
		//console.log(value.coin.toLowerCase());
		options_data += `
<option data-content="<img src='${coinsdbdir}/icons/${value.coin.toLowerCase()}.png' width='30px;'/> ${value.fname} (${value.coin})" data-tokens="${value.coin.toLowerCase()} ${value.fname} ">${value.coin}</option>`;
	})
	//console.log(options_data);

	return options_data
}

function CoinDB_manage_coin_select_options() {
	var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
	//console.log(coinsdbdir);

	var coin_db_img_url = 'https://raw.githubusercontent.com/jl777/coins/master/icons/';

	var coins_detail_list = [{"coin": "KMD", "fname": "Komodo","name":"komodo","eth":false},{"coin": "BTC", "fname": "Bitcoin","name":"bitcoin","eth":false}]
	var local_coins_db = ShepherdIPC({ "command": "coins_db_read_db" });
	if (local_coins_db.length == 0) {
		console.log('local coins db is empty!');
		CoinsDB_UpdatedCoinsDbFile();
		var lstore_coinsdb_json_array = JSON.parse(localStorage.getItem('mm_coinsdb_json_array'));
		CoinsDB_Dl_Extra(lstore_coinsdb_json_array);
		setTimeout(function(){
			$('.addcoin_coinsdb_select').selectpicker('destroy');
			$('.addcoin_coinsdb_select').html(CoinDB_manage_coin_select_options());
			$('.addcoin_coinsdb_select').selectpicker('render');
		}, 5 * 1000);
	}
	var local_coins_db = local_coins_db.concat(coins_detail_list);
	
	var options_data = '';
	$.each(local_coins_db, function(index, value){
		//console.log(index);
		//console.log(value);
		//console.log(value.coin.toLowerCase());
		options_data += `
<option data-content="<img src='${coin_db_img_url}${value.coin.toLowerCase()}.png' width='30px;'/> ${value.fname} (${value.coin})" data-tokens="${value.coin.toLowerCase()} ${value.fname} ">${value.coin}</option>`;
	})
	//console.log(options_data);

	return options_data
}