function searchYQL() {
	if($.txtStockCode.value != "")
	{
		$.txtStockCode.blur();
		var query = 'select * from yahoo.finance.quotes where symbol = "' + $.txtStockCode.value + '"';
		Titanium.Yahoo.yql(query, function(e){		
			var data = e.data;			
			if(data.quote.ErrorIndicationreturnedforsymbolchangedinvalid === null)
			{
				$.lblCompanyName.text = data.quote.Name;
				$.lblDaysLow.text = 'Days Low: ' + data.quote.DaysLow;
				$.lblDaysHigh.text = 'Days High: ' + data.quote.DaysHigh;
				$.lblLastOpen.text = 'Last Open: ' + data.quote.Open;
				$.lblLastClose.text = 'Last Close: ' + data.quote.PreviousClose;
				$.lblVolume.text = 'Volume: ' + data.quote.Volume;
				/*if(data.quote.PreviousClose >= data.quote.Open)
				{
					imgStockDirection.image = 'arrow-up.png';
				}
				else{
					imgStockDirection.image = 'arrow-down.png';
				}*/ 
// Get today's date and break that up into month, day, and year values
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
     
    //now create the two dates formatted in yyyy-mm-dd format for YQL query
    var today = year + '-' + month + '-' + day; //today
     
    //get the date 12 weeks ago.. 1000 milliseconds * seconds in minute * minutes in hour * 2016 hours (12 weeks, 12 * 7 days)
    var currentTimeMinus12Weeks = new Date((new Date()).getTime() - (1000 * 60 * 60 * 2016));
    var month2 = currentTimeMinus12Weeks.getMonth() + 1;
    var day2 = currentTimeMinus12Weeks.getDate();
    var year2 = currentTimeMinus12Weeks.getFullYear();   
    var todayMinus12Weeks = year2 + '-' + month2 + '-' + day2; //today - 12 weeks
     
    //perform a historical query for the stock code for our chart
    var query2 = 'select * from yahoo.finance.historicaldata where symbol = "' + $.txtStockCode.value + '" and startDate = "' + todayMinus12Weeks + '" and endDate = "' + today + '"';  
     
    //execute the query and get the results
    Titanium.Yahoo.yql(query2, function(e) {
        var data = e.data;  
        var chartData = [];
                 
        //loop our returned json data for the last 12 weeks
        for(var i = (data.quote.length -1); i >= 0; i--)
        {
            //push this timeframes close value into our chartData array
            chartData.push(parseFloat(data.quote[i].Close)); 
             
            if(i == (data.quote.length - 1)) {  
              $.twelveWeekStartLabel.text = data.quote[i].Close;
            }
            if(i == 0) {  
              $.twelveWeekEndLabel.text = data.quote[i].Close;
            }
        }
         
        //raphael expects an array of arrays so lets do that
        var formattedChartData = [chartData];
         
        //fire an event that will pass the chart data across to the chart.html file
        //where it will be rendered by the Raphael JS chart engine
        Ti.App.fireEvent('renderChart', { data: formattedChartData, startDate:  todayMinus12Weeks, endDate: today } );    
    });


			}
			else
			{
				alert('No stock information could be found for ' + $.txtStockCode.value + "!");
			}	
		});		
	}
	else
	{
		alert('You must provide a stock code to search upon, e.g. AAPL or YHOO');
	}
}
$.index.open();
