
function BarterDEX_Init_CoinsDB() {
	var barterDEX_app_info = ShepherdIPC({ "command": "app_info" });
	console.log(barterDEX_app_info);

	localStorage.setItem('mm_barterdex_app_info', JSON.stringify(barterDEX_app_info));
}

function CoinsDB_UpdatedCoinsDbFile() {
	var update_coinsdb_file = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"update_coins_file"} });
	console.log(update_coins_file);
}


function CoinsDB_DlIcons(icons_array) {
	console.log(icons_array); //Expected value is ["kmd","btc","oot"] if multiple. If single ["kmd"]
	var icons_dl = ShepherdIPC({ "command": "coins_db_dl", "data":{"cmd":"dl_icons","coin_array":icons_array} });
}


function CoinsDB_ReadLocalDB() {
	//var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
	//console.log(coinsdbdir);

	var local_coinsdb = ShepherdIPC({ "command": "coins_db_read_db" });
	//console.log(local_coinsdb)
	return local_coinsdb;
}

