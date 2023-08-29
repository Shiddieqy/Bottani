/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end



// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

for (var i = 0; i < 10; i++) {
	createSeries("value" + i, "Series With an eventual very long name #" + i);
}

// Create series
function createSeries(s, name) {
	var series = chart.series.push(new am4charts.LineSeries());
    series.tooltip.getFillFromObject = false;

	series.dataFields.valueY = "value" + s;
	series.dataFields.dateX = "date";
	series.name = name;

	var segment = series.segments.template;
	segment.interactionsEnabled = true;
    series.strokeWidth = 3;
	var hoverState = segment.states.create("hover");
	hoverState.properties.strokeWidth = 5;

	var dimmed = segment.states.create("dimmed");
	dimmed.properties.stroke = am4core.color("#dadada");

	segment.events.on("over", function(event) {
		processOver(event.target.parent.parent.parent);
	});

	segment.events.on("out", function(event) {
		processOut(event.target.parent.parent.parent);
	});

	var data = [];
	var value = Math.round(Math.random() * 100) + 100;
	for (var i = 1; i < 100; i++) {
		value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 30 + i / 5);
		var dataItem = { date: new Date(2018, 0, i) };
		dataItem["value" + s] = value;
		data.push(dataItem);
	}

	series.data = data;
	return series;
}

chart.legend = new am4charts.Legend();
chart.legend.position = "right";
chart.legend.scrollable = true;
chart.legend.itemContainers.template.events.on("over", function(event) {
	processOver(event.target.dataItem.dataContext);
})

chart.legend.itemContainers.template.events.on("out", function(event) {
	processOut(event.target.dataItem.dataContext);
})

function processOver(hoveredSeries) {
	// hoveredSeries.toFront();
    hoveredSeries.fillOpacity = 0.0;
  
	hoveredSeries.segments.each(function(segment) {
		segment.setState("hover");
	})

	chart.series.each(function(series) {
		if (series != hoveredSeries) {
			series.segments.each(function(segment) {
				segment.setState("dimmed");
			})
			series.bulletsContainer.setState("dimmed");
      series.fillOpacity = 0;
		}
	});
}

function processOut(hoveredSeries) {
	chart.series.each(function(series) {
		series.segments.each(function(segment) {
			segment.setState("default");
		})
		series.bulletsContainer.setState("default");
	});
}