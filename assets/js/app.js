var apiKey = "G9rl(3Z6evWODYwJhHWHNglpVEhRF(m3UD5yVmBUr7zgFiOCiLPbUw1Z8XG5V3DntWUW5i6X2L0mw)eKVOBOad0=====2"

var latBKK = 13.7563;
var lonBKK = 100.5018;

var latCNX = 18.7677;
var lonCNX = 98.9640;

var freqDaily = "daily";
var freq3Hours = "3Hours";
var interval = 7;

var lat = latBKK;
var lon = lonBKK;
var frequency = freqDaily;

var locationName = "";
var tempForYAxis = [];
var iconForXAxis = [];
var countBars = 7;
const buttons = document.querySelectorAll('.button');
buttons.forEach((button) => {
  let target = button.querySelector('.target');
  function handleMove(e) {
    const x = -50 + (e.pageX - button.offsetLeft - 300 / 2) / 3;
    const y = -10 + (e.pageY - button.offsetTop - 100 / 2) / 3;

    target.style.setProperty('--x', `${ x }px`)
    target.style.setProperty('--y', `${ y }px`)
  }
  button.addEventListener('mousemove', (e) => {
    handleMove(e);
  });
  button.addEventListener('touchmove', (e) => {
    handleMove(e.changedTouches[0]);
  });
});
function bkkChart() {
	console.log("bkk chart");
	tempForYAxis = [];
	iconForXAxis = [];
	lat = latBKK;
	lon = lonBKK;
	buildJSON(countBars)
}
function cnxChart() {
	console.log("cnx chart");
	tempForYAxis = [];
	iconForXAxis = [];
	lat = latCNX;
	lon = lonCNX;
	buildJSON(countBars)
}
function dailyChart() {
	console.log("daily chart");
	tempForYAxis = [];
	iconForXAxis = [];
	frequency = freqDaily;
	countBars = 7;
	buildJSON(countBars)
}
function threeHoursChart() {
	console.log("three hours chart");
	tempForYAxis = [];
	iconForXAxis = [];
	frequency = freq3Hours;
	countBars = 8;
	buildJSON(countBars)
}
var tags = [];
function buildJSON(countBars) {
	console.log("in render chart");
	$.ajax({
		url: "https://api.nostramap.com/Service/V2/GeoLocation/GetWeather",
		dataType: "jsonp",
		type: "GET",
		contentType: "application/json",
		data: {
			key: apiKey,
			lat: lat,
			lon: lon,
			frequency: frequency,
			interval: interval
		},
		success: function (results) {
			console.log("this is success");
			console.log(results);
			var weatherResults = results.results.weather;
			locationName = results.results.locationName;
			for(var i=0; i<countBars; i++){
				tempForYAxis.push(weatherResults[i].temperature.temp);
				iconForXAxis.push(weatherResults[i].icon);
			}
			console.log("prepare axis array");
			console.log(tempForYAxis);
			console.log(iconForXAxis);

			renderChart(iconForXAxis, tempForYAxis);
		},
		error: function (response) {
			console.log("this is error");
			console.log(response);
		}
	});
}
function renderChart(xAxisme, yAxisme) {
	console.log("in render chart");
	console.log(countBars);
	console.log(xAxisme);
	var barColors = [];
	if(countBars==7){
		barColors = ["red", "green", "blue", "orange", "brown", "orange", "brown"];
	}
	else{barColors = ["red", "green", "blue", "orange", "brown", "orange", "brown", "brown"];}
	var xValues = ["Italy", "France", "Spain", "USA", "Argentina", "USA", "Argentina"];
	
	new Chart(document.getElementById("myChart"), {
		type: "bar",
		plugins: [{
		  afterDraw: chart => {      
			var ctx = chart.chart.ctx; 
			var xAxis = chart.scales['x-axis-0'];
			var yAxis = chart.scales['y-axis-0'];
			xAxis.ticks.forEach((value, index) => {  
			  var x = xAxis.getPixelForTick(index);      
			  var image = new Image();
			  image.src = xAxisme[index],
			  ctx.drawImage(image, x + 30, yAxis.bottom + 5);
			});      
		  }
		}],
		data: {
		  labels: xAxisme,
		  datasets: [{
			label: locationName,
			data: yAxisme,
			backgroundColor: barColors
		  }]
		},
		options: {
		  responsive: true,
		  layout: {
			padding: {
			  bottom: 50
			}
		  },
		  legend: {
			display: false
		  },    
		  scales: {
			yAxes: [{ 
			  ticks: {
				beginAtZero: true
			  }
			}],
			xAxes: [{
			  ticks: {
				display: false
			  }   
			}],
		  }
		}
	  });
}
var main = function () {
	"use strict";
	buildJSON(countBars);
	console.log("this is tags");
	console.log(tags);
	var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
	var yValues = [55, 49, 44, 24, 900];

	
	var toDos = [
		"Finish writing this book",
		"Take Gracie to the park",
		"Answer emails",
		"Prep for Monday's class",
		"Make up some new ToDos",
		"Get Groceries"
	];

	$(".tabs span").toArray().forEach(function (element) {
		$(element).on("click", function () {
			var $element = $(element), $content;
			$(".tabs span").removeClass("active");
			$element.addClass("active");
			$(".content").empty();

			if ($element.parent().is(":nth-child(1)")) {
				console.log("First tab clicked.");
				$content = $("<ul>");
				var i;
				for (i = toDos.length - 1; i >= 0; i--) {
					$content.append($("<li>").text(toDos[i]));
				}
			}
			else if ($element.parent().is(":nth-child(2)")) {
				$content = $("<ul>");
				toDos.forEach(function (todo) {
					$content.append($("<li>").text(todo));
				});
			}
			else if ($element.parent().is(":nth-child(3)")) {
				// input a new to-do
				var $input = $("<input>"),
					$button = $("<button>").text("+");

				$button.on("click", function () {
					if ($input.val() !== "") {
						toDos.push($input.val());
						$input.val("");
					}
				});

				$content = $("<div>").append($input).append($button);

			}
			$(".content").append($content);
			return false;
		});
	});
	$(".tabs a:first-child span").trigger("click");
}
$(document).ready(main);