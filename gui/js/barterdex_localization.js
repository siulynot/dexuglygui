
function BarterDEXInitLang() {
	var barterDEX_settings = ShepherdIPC({"command":"read_settings"});
	console.log(barterDEX_settings.deflang);
	if (barterDEX_settings.deflang == undefined) {
		ShepherdIPC({"command":"reset_settings"});
		BarterDEXDefaultLangFn('en_US');
	} else {
		BarterDEXDefaultLangFn(barterDEX_settings.deflang);
	}
}

function BarterDEXDefaultLangFn(lang_data) {
	//console.log(lang_data);
	var default_lang = ShepherdIPC({"command":"get_lang_data","lang":lang_data});
	sessionStorage.setItem('mm_default_lang', JSON.stringify(default_lang));
	PopulateDefaultLanguage();
}

function PopulateDefaultLanguage() {
	var default_lang = JSON.parse(sessionStorage.getItem('mm_default_lang'));
	//console.log(default_lang);

	// Populate common phrases localization
	$('.language[data-langstr="loading_wait"]').text(default_lang.Common.loading_wait);

	// Populate loading screen localization
	$('.language[data-langstr="starting_barterdex"]').text(default_lang.loading.starting_barterdex);
	
	// Populate login screen localization
	$('.language[data-langstr="Welcome_to_BarterDEX"]').text(default_lang.login.welcome_to_barterdex);
	$('.language[data-langstr="please_login"]').text(default_lang.login.please_login);
	$('.language[data-langstr="passphrase"]').text(default_lang.login.passphrase);
	$('.language[data-langstr="login_passphrase_input_placeholder"]').attr('placeholder',default_lang.login.login_passphrase_input_placeholder);
	$('.language[data-langstr="login_btn"]').text(default_lang.login.login_btn);
	$('.language[data-langstr="generate_a_new_passphrase"]').text(default_lang.login.generate_a_new_passphrase);

	// Populate naviation menu localization
	$('.language[data-langstr="nav_dashboard"]').text(default_lang.Navigation.nav_dashboard);
	$('.language[data-langstr="nav_trade_history"]').text(default_lang.Navigation.nav_trade_history);
	$('.language[data-langstr="nav_close"]').text(default_lang.Navigation.nav_close);
	$('.language[data-langstr="nav_debug"]').text(default_lang.Navigation.nav_debug);
	$('.language[data-langstr="nav_settings"]').text(default_lang.Navigation.nav_settings);
	$('.language[data-langstr="nav_logout"]').text(default_lang.Navigation.nav_logout);

	// Populate debug localization
	$('.language[data-langstr="debug_payload"]').text(default_lang.Debug.debug_payload);
	$('.language[data-langstr="debug_execute"]').text(default_lang.Debug.debug_execute);
	$('.language[data-langstr="debug_response"]').text(default_lang.Debug.debug_response);
	$('.language[data-langstr="debug_playload_input_placeholder"]').attr('placeholder',default_lang.Debug.debug_playload_input_placeholder);

	// Populate portfolio localization
	$('.language[data-langstr="portfolio_portfolio_chart"]').text(default_lang.Portfolio.portfolio_portfolio_chart);
	$('.language[data-langstr="portfolio_add_coins"]').text(default_lang.Portfolio.portfolio_add_coins);
	$('.language[data-langstr="portfolio_portfolio_coins"]').text(default_lang.Portfolio.portfolio_portfolio_coins);
	$('.language[data-langstr="portfolio_auto_goal_all_active_coins"]').text(default_lang.Portfolio.portfolio_auto_goal_all_active_coins);
	$('.language[data-langstr="portfolio_th_coin"]').text(default_lang.Portfolio.portfolio_th_coin);
	$('.language[data-langstr="portfolio_th_balance"]').text(default_lang.Portfolio.portfolio_th_balance);
	$('.language[data-langstr="portfolio_th_price"]').text(default_lang.Portfolio.portfolio_th_price);
	$('.language[data-langstr="portfolio_th_current_percent"]').text(default_lang.Portfolio.portfolio_th_current_percent);
	$('.language[data-langstr="portfolio_th_goal_percent"]').text(default_lang.Portfolio.portfolio_th_goal_percent);
	$('.language[data-langstr="portfolio_th_kmdvalue"]').text(default_lang.Portfolio.portfolio_th_kmdvalue);
	$('.language[data-langstr="portfolio_th_action"]').text(default_lang.Portfolio.portfolio_th_action);

	// Populate inventory localization
	$('.language[data-langstr="inventory_tab_inventory"]').text(default_lang.Inventory.inventory_tab_inventory);

	// Populate exchange localization
	$('.language[data-langstr="exchange_your_balance"]').text(default_lang.Exchange.exchange_your_balance);
	$('.language[data-langstr="exchange_switch_pairs"]').text(default_lang.Exchange.exchange_switch_pairs);
	



	
}

function GetListofAvailableLocalization() {
	//var barterDEX_settings = ShepherdIPC({"command":"read_settings"});
	//console.log(barterDEX_settings.deflang);
	

	var BarterDEX_langauge_files_list = ShepherdIPC({"command":"get_lang_file_list"});

	var langauge_list_options = '';
	$.each(BarterDEX_langauge_files_list, function(index, value) {
		//console.log(index);
		//console.log(value);
		console.log(value.slice(0, -5));
		var temp_lang_code_array = value.split('_');
		var first_word = temp_lang_code_array[0];
		var second_word = temp_lang_code_array[temp_lang_code_array.length-1];
		langauge_list_options += `<option data-content="${GetLanguageName(first_word)} (${GetCountryName(second_word.slice(0, 2))})" data-tokens="${GetLanguageName(first_word)} (${GetCountryName(second_word.slice(0, 2))})">${value.slice(0, -5)}</option>`
	});
	//console.log(langauge_list_options);
	return langauge_list_options;
}