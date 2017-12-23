
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

	// Populate loading screen localization
	$('.language[data-langstr="starting_barterdex"]').text(default_lang.loading.starting_barterdex);
	
	// Populate login screen localization
	$('.language[data-langstr="Welcome_to_BarterDEX"]').text(default_lang.login.welcome_to_barterdex);
	$('.language[data-langstr="please_login"]').text(default_lang.login.please_login);
	$('.language[data-langstr="passphrase"]').text(default_lang.login.passphrase);
	$('.language[data-langstr="login_passphrase_input_placeholder"]').attr('placeholder',default_lang.login.login_passphrase_input_placeholder);
	$('.language[data-langstr="login_btn"]').text(default_lang.login.login_btn);
	$('.language[data-langstr="generate_a_new_passphrase"]').text(default_lang.login.generate_a_new_passphrase);
	
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