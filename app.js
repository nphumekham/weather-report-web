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

// var locationName = "";
var tempForYAxis = [];
var iconForXAxis = [];
var countBars = 7;

var headerLocation       = document.getElementById("location");


var buttons = document.querySelectorAll("button");
function changeButtons(index) {
	console.log("here is "+buttons[2]);
	console.log('test')
	buttons.forEach(function(btn){
	  btn.classList.remove('highlight');
	  btn.classList.add('green');
	})
	buttons[index].classList.remove('green');
	buttons[index].classList.add('highlight');
}
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
			for(var i=0; i<countBars; i++){
				tempForYAxis.push(weatherResults[i].temperature.temp);
				iconForXAxis.push(weatherResults[i].icon);
			}
			console.log("prepare axis array");
			console.log(tempForYAxis);
			console.log(iconForXAxis);
			headerLocation.innerHTML = "<h2>"+locationName+"</h2>";
			renderChart(iconForXAxis, tempForYAxis);
		},
		error: function (response) {
			console.log("this is error");
			console.log(response);
		}
	});
}
function renderChart(xAxis, yAxis) {
	console.log("in render chart");
	console.log(countBars);
	console.log(xAxis);
	var barColors = [];
	if(countBars==7){
		barColors = ["#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208"];
	}
	else{barColors = ["#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208", "#F1A208"];}
	
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
			  image.src = xAxis[index],
			  ctx.drawImage(image, x + 30, yAxis.bottom + 5);
			});      
		  }
		}],
		data: {
		  labels: xAxis,
		  datasets: [{
			label: "Temperature:",
			data: yAxis,
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
}
$(document).ready(main);