
var Refresh_active_StockChart_Interval = null;

var gChart;

$(function() {
    "use strict";

    var isDebugMode = window.location.port === '63342';
    var isFullWindowMode = isDebugMode || ((StockChartX.Environment.isMobile && $(window).width() < 768) || StockChartX.Environment.isPhone);

    /*var symbolsFilePath = StockChartX.Environment.isMobile ? "data/symbols.mobile.json" : "data/symbols.json";
    $.get(symbolsFilePath, function(symbols) {
        console.log(symbols);
        StockChartX.getAllInstruments = function() { return symbols; }
    });*/

    gChart = $('#chartContainer').StockChartX({
        width: $('#chartContainer').parent().width(),
        height: 360,
        //fullWindowMode: isFullWindowMode
    });

    gChart.update();

    if (!StockChartX.Environment.isPhone) {
        var myIndicator = new MyCustomMACD();
        gChart.addIndicators([myIndicator, TASdk.BollingerBands]);
    }
    

    var ind = gChart.addIndicators(StockChartX.VolumeIndicator);
    ind.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, 5);
    //ind.chartPanel.setHeightRatio(50/gChart.size.height);

    gChart.on(StockChartX.ChartEvent.SYMBOL_ENTERED, function(event) {
        // TODO: Load data for the new symbol
        gChart.showWaitingBar();
        gChart.instrument = event.value;
        setTimeout(function(){
            gChart.update();
            gChart.hideWaitingBar();
        }, 2000);
    });
    gChart.on(StockChartX.ChartEvent.TIME_FRAME_CHANGED, function(event) {
        // TODO: Process time frame change
        console.log(event.value.interval + ' ' + event.value.periodicity);
        console.log(JSON.stringify(event.value));
        sessionStorage.setItem('mm_chartinterval', JSON.stringify(event.value));
        Refresh_active_StockChart();
    });
    gChart.on(StockChartX.ChartEvent.MORE_HISTORY_REQUESTED, function() {
        console.log("TODO: Load more history!");
    });


    if (!StockChartX.Environment.isPhone) {
        // test
        var scale1 = gChart.addValueScale();
        scale1.leftPanelVisible = true;
        scale1.rightPanelVisible = false;

        var scale2 = gChart.addValueScale();

        gChart.indicators[2].valueScale = scale1;
        gChart.indicators[1].valueScale = scale2;
    }

    gChart.updateIndicators();
    gChart.setNeedsAutoScale();
    gChart.update();

    !StockChartX.Environment.isMobile && gChart.recordRange(1000);
	//gChart.dateScale.customFormat = "HH:mm:ss";
    gChart.update();
    gChart.hideWaitingBar();


    
});

$(window).resize(function() {
	//console.log($(window).width());
	gChart.size = {width: $('#chartContainer').parent().width()};
	gChart.update();
});

function ChartsInstruments(instrument_data){
	console.log(instrument_data);
	gChart.instrument = {
		symbol: instrument_data.symbol,
		company: instrument_data.company,
		exchange: "BarterDEX"
	};
	gChart.timeInterval = StockChartX.TimeSpan.MILLISECONDS_IN_DAY;
	gChart.removeDrawings();
	gChart.setNeedsUpdate(!0);
	gChart.setNeedsAutoScaleAll();
	gChart.update();
}



function ConvertJSONToCSV(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var str = '';

	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			if (line != '') line += ','
				line += array[i][index];
			}

		str += line + '\r\n';
	}

	return str;
}

function clearChartData() {
    var dataSeries = gChart.barDataSeries();

    dataSeries.date.clear();
    dataSeries.open.clear();
    dataSeries.high.clear();
    dataSeries.low.clear();
    dataSeries.close.clear();
    dataSeries.volume.clear();
}

function UpdateDexChart(chartbase, chartrel)  {

	var chart_interval = sessionStorage.getItem('mm_chartinterval');
	chart_interval = JSON.parse(chart_interval);
	console.log(chart_interval);
	$('.scxTimeFramePicker-button-value').html(chart_interval.interval);
	$('.scxTimeFramePicker-button-units').html(chart_interval.periodicity);

	var timescal_value = 60;
	if (chart_interval.periodicity == "") {
		var timescal_value = chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 minute"]').addClass(' active');
		} else if (chart_interval.interval == '5') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="5 minutes"]').addClass(' active');
		} else if (chart_interval.interval == '10') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="10 minutes"]').addClass(' active');
		} else if (chart_interval.interval == '15') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="15 minutes"]').addClass(' active');
		}
	} else if (chart_interval.periodicity == "h") {
		var timescal_value = 60 * chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 hour"]').addClass(' active');
		} else if (chart_interval.interval == '4') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="4 hours"]').addClass(' active');
		}
	} else if (chart_interval.periodicity == "d") {
		var timescal_value = 24 * 60 * chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 day"]').addClass(' active');
		}
	} else if (chart_interval.periodicity == "w") {
		var timescal_value = 7 * 24 * 60 * chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 week"]').addClass(' active');
		}
	} else if (chart_interval.periodicity == "m") {
		var timescal_value = 30 * 24 * 60 * chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 month"]').addClass(' active');
		}
	} else if (chart_interval.periodicity == "y") {
		var timescal_value = 256 * 24 * 60 * chart_interval.interval * 60;
		if (chart_interval.interval == '1') {
			$('.scxToolbarButton-dropdownElement.active').removeClass('active');
			$('.scxToolbarButton-dropdownElement[title="1 year"]').addClass(' active');
		}
	}

	gChart.showWaitingBar();
	clearChartData();
	gChart.update();

	var userpass = sessionStorage.getItem('mm_userpass');
	var mypubkey = sessionStorage.getItem('mm_mypubkey');
	var ajax_data = {"userpass":userpass,"method":"tradesarray","base":chartbase,"rel":chartrel,"timescale":timescal_value,"starttime":0,"endtime":0};
	//var url = "http://5.9.253.196:7782/api/stats/";
	var url = "http://127.0.0.1:7783";
	console.log(ajax_data);

	$.ajax({
		async: true,
	    data: JSON.stringify(ajax_data),
	    dataType: 'json',
	    type: 'POST',
	    url: url
	}).done(function(dex_chart_output_data) {
		//console.log(dex_chart_output_data);
		gChart.setNeedsAutoScaleAll();
		parseBars(dex_chart_output_data, false);
	}).fail(function(jqXHR, textStatus, errorThrown) {
	    // If fail
	    console.log(textStatus + ': ' + errorThrown);
	});
}


function parseBars(data, isIntraday) {
	var dataSeries = gChart.barDataSeries();
	data.reverse();

	$.each(data, function(index,value) {
		//console.log(index);
		//console.log(value);
		var time = new Date( value[0] *1000);
		//console.log(time);

		dataSeries.date.add(time);
		dataSeries.open.add(parseFloat(value[1]));
		dataSeries.high.add(parseFloat(value[2]));
		dataSeries.low.add(parseFloat(value[3]));
		dataSeries.close.add(parseFloat(value[4]));
		dataSeries.volume.add(parseInt(value[5], 10));

	});
	gChart.updateComputedDataSeries();
	gChart.update();
	gChart.hideWaitingBar();
}




function Refresh_active_StockChart(sig) {
	if (sig == false) {
		clearInterval(Refresh_active_StockChart_Interval);
		return
	} else {
		console.log('Refreshing active StockCharts every minute.');
	}
	UpdateDexChart($('.trading_pair_coin').selectpicker('val'), $('.trading_pair_coin2').selectpicker('val'));
}