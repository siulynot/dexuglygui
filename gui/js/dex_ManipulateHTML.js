$('.dexdashboard-btn').click(function (e) {
	e.preventDefault();
	console.log('btn-exchangeclose clicked');
	console.log($(this).data());

	$('.navbar-right').children().removeClass('active');
	$('.dexdashboard-btn').parent().addClass("active");

	$('body').css('overflow', 'inherit');
	$('.dextradeshistory').hide();

	$('.dexdebug').hide();
	$('.dexdebug-btn').show();
	$('.dexlogout-btn').show();
	$('.dexdebug-close-btn').hide();
	$('.dextradeshistory-btn').show();

	//$('.screen-coindashboard').show()
	$('.screen-exchange').hide();
	$('.screen-inventory').hide();
	$('.screen-managecoins').hide();
	$('.screen-portfolio').show();
	CheckOrderBookFn(false);
	check_swap_status(false);
	check_bot_list(false);
	check_my_prices(false);
	bot_screen_coin_balance(false);
	bot_screen_sellcoin_balance(false);
	Refresh_active_StockChart(false);
	//check_coin_balance_Interval = setInterval(check_coin_balance(),3000);
	//check_coin_balance();

	CheckPortfolioFn();
	CheckPortfolio_Interval = setInterval(CheckPortfolioFn, 60000);
});