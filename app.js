//url paramerters
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
//charts info
var tempForYAxis = [];
var iconForXAxis = [];
var countBars = 7;
//header info
var headerLocation = document.getElementById("location");
var headerFrequency = document.getElementById("frequency");
//button colors 
var buttons = document.querySelectorAll("button");
function changeButtons(index) {
	if(countBars==7){
		buttons[2].classList.remove('notclicked');
		buttons[2].classList.add('clicked');
		buttons[3].classList.remove('clicked');
		buttons[3].classList.add('notclicked');
	}
	 if(countBars==8){
		buttons[3].classList.remove('notclicked');
		buttons[3].classList.add('clicked');
		buttons[2].classList.remove('clicked');
		buttons[2].classList.add('notclicked');
	}
	 if(lat==latBKK){
		buttons[0].classList.remove('notclicked');
		buttons[0].classList.add('clicked');
		buttons[1].classList.remove('clicked');
		buttons[1].classList.add('notclicked');
	}
	 if(lat==latCNX){
		console.log("in color cnx");
		console.log(buttons[1].classList);
		buttons[1].classList.remove('notclicked');
		buttons[1].classList.add('clicked');
		buttons[0].classList.remove('clicked');
		buttons[0].classList.add('notclicked');
	}
}
//change paramerters each push
function bkkChart() {
	console.log("bkk chart");
	tempForYAxis = [];
	iconForXAxis = [];
	lat = latBKK;
	lon = lonBKK;
	changeButtons(0);
	buildJSON(countBars);
}
function cnxChart() {
	console.log("cnx chart");
	tempForYAxis = [];
	iconForXAxis = [];
	lat = latCNX;
	lon = lonCNX;
	changeButtons(1);
	buildJSON(countBars);
}
function dailyChart() {
	console.log("daily chart");
	tempForYAxis = [];
	iconForXAxis = [];
	frequency = freqDaily;
	countBars = 7;
	changeButtons(2);

	buildJSON(countBars);
}
function threeHoursChart() {
	console.log("three hours chart");
	tempForYAxis = [];
	iconForXAxis = [];
	frequency = freq3Hours;
	countBars = 8;
	changeButtons(3);
	buildJSON(countBars);
}
//build JSON for chart
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
			var locationName = results.results.locationName;
			for (var i = 0; i < countBars; i++) {
				tempForYAxis.push(weatherResults[i].temperature.temp);
				iconForXAxis.push(weatherResults[i].icon);
			}
			headerLocation.innerHTML = "<h3>" + locationName + "</h3>";
			headerFrequency.innerHTML = "<h6>Frequency: " + frequency + "</h6>";
			var barColors = [];
			var green = "#06A77D";
			var yellow = "#F1A208";
			var red = "#F93943";
			var blue = "#7EB2DD";
			for (var i = 0; i < countBars; i++) {
				if (tempForYAxis[i] < 30) { barColors.push(blue); }
				else if (tempForYAxis[i] > 30 && tempForYAxis[i] < 35) { barColors.push(green); }
				else if (tempForYAxis[i] > 35 && tempForYAxis[i] < 40) { barColors.push(yellow); }
				else { barColors.push(red); }
			}
			renderChart(iconForXAxis, tempForYAxis, barColors);
		},
		error: function (response) {
			console.log("this is error");
			console.log(response);
		}
	});
}
//render chart
function renderChart(icon, temperature, barColors) {
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
					image.src = icon[index],
						ctx.drawImage(image, x + 30, yAxis.bottom + 5);
				});
			}
		}],
		data: {
			labels: icon,
			datasets: [{
				label: "Temperature:",
				data: temperature,
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
//main
var main = function () {
	"use strict";
	buildJSON(countBars);
}
$(document).ready(main);