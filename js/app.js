var base_url = "";
var user = "";
var mdp = "";
var query = "";


var data = [
{
	name:"Pression atmosphérique",
	metric:"pression",
	unit:"hPa",
	value:0
},
{
	name:"Température de l' air",
	metric:"pression",
	unit:"°C",
	value:0
},
{
	name:"Humidité relative",
	metric:"pression",
	unit:"%",
	value:0
},
{
	name:"Point de rosée",
	metric:"pression",
	unit:"°C",
	value:0
},
{
	name:"Direction du vent",
	metric:"pression",
	unit:"",
	value:0
},
{
	name:"Vitesse du vent réel",
	metric:"pression",
	unit:"Km/h",
	value:0
},
{
	name:"Vitesse du vent réel",
	metric:"pression",
	unit:"Noeuds/s",
	value:0
},
{
	name:"Tangage",
	metric:"pression",
	unit:"°",
	value:0
},
{
	name:"Roulis",
	metric:"pression",
	unit:"°",
	value:0
},
{
	name:"Latitude GPS",
	metric:"DMS",
	unit:"°C",
	value:0
},
{
	name:"Longitude GPS",
	metric:"pression",
	unit:"DMS",
	value:0
},
{
	name:"Cap Magnétique",
	metric:"pression",
	unit:"°",
	value:0
},
{
	name:"Cap Géographique",
	metric:"pression",
	unit:"°",
	value:0
},
]

var myApp = angular.module('meteoApp', []);
myApp.controller('Ctrl', function ($scope, $http, $timeout, $interval) {
	$scope.data = data;

	$scope.count = 0;
	$scope.ajaxPeriodicall = function() {

		var savePromises = [];

		angular.forEach(data, function(value,key) {
			savePromises[key] = $http({
				url   : base_url+"/db/public/series?q="
				+encodeURIComponent("select * from "+value.metric+"limit 1")
				+"&u="+user+"&p="+mdp,
				method: 'GET'
			});
		});

		$q.all(savePromises).then(function(data){
			$scope.parsingResults(data);
		});

	}; 

	$scope.parsingResults = function (data){
		var temp = {};
		angular.forEach(data, function(value,key) {
			temp.name = value[0].name;
			temp.value = value[0].points[1];
			// Parsing original array to put value
			angular.forEach($scope.data, function(final_data,key2) {
				if (final_data.metric == temp.name) {
					final_data.value = temp.value;
				};
			});
		});
	}

	$scope.start = function() {
		$scope.myCall = $interval($scope.ajaxPeriodicall, 5*1000);        
	};

	$scope.stop = function() {
		$interval.cancel($scope.myCall);   
	};  


});