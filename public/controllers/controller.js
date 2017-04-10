var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', function($scope, AppService, $interval) {

	$scope.data = [];
	$scope.myData = [10,20,30,40,60, 80, 20, 50];
	var count = 0;
	$scope.start = function() {
		var a = AppService.getSampleData();
		count++;
		if(count >= 10) {
    		$scope.data[0] = $scope.data[1];
    		for(var i=1;i<9;i++) {
    			$scope.data[i] = $scope.data[i+1];
    		}
    		$scope.data[9] = a;
    	} else {
    		$scope.data.push(a);
    	}
    }
    var promise = $interval( function(){ $scope.start(); }, 1000);
    
});

myApp.factory('AppService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var count = 0;

    return {
        getSampleData : function() {
            //console.log('entered service');
            var startTime = new Date(),
                endTime = new Date(startTime.getTime() + 1000),
                request = {
                    startTime : startTime.getTime(),
                    endTime : endTime.getTime(),
                    serverID : "server1"
                };

            var deffered = $q.defer();
            $http.post('/demo', request).then(function(response) {            	
            	deffered.resolve(response);
            });

            return deffered.promise;
        }
    }

}]);

myApp.directive('barsChart', function ($parse) {
     var directiveDefinitionObject = {
         restrict: 'E',
         replace: false,
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           var chart = d3.select(element[0]);
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             .transition().ease("elastic")
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
         } 
      };
      return directiveDefinitionObject;
   });

/*myApp.directive('d3Bars', function() {
    return {
      restrict: 'EA',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
      	var margin = parseInt(attrs.margin) || 20,
          barHeight = parseInt(attrs.barHeight) || 20,
          barPadding = parseInt(attrs.barPadding) || 5;
      	var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

            scope.render = function(data) {
    svg.selectAll('*').remove();
    if (!data) return;
 
    var width = d3.select(element[0]).node().offsetWidth - margin,
        height = scope.data.length * (barHeight + barPadding),
        color = d3.scale.category20(),
        xScale = d3.scale.linear()
          .domain([0, d3.max(d, function(d) {
            return d.$$state.value.config.data.startTime;
          })])
          .range([0, width]);
    svg.attr('height', height);
    svg.selectAll('rect')
      .data(data).enter()
        .append('rect')
        .attr('height', barHeight)
        .attr('width', 140)
        .attr('x', Math.round(margin/2))
        .attr('y', function(d,i) {
          return i * (barHeight + barPadding);
        })
        .attr('fill', function(d) { return color(d.$$state.value.config.data.startTime); })
        .transition()
          .duration(1000)
          .attr('width', function(d) {
            return xScale(d.$$state.value.config.data.startTime);
          });
      }
      scope.$watch('data', function(newVals, oldVals) {
  return scope.render(newVals);
}, true);
 } }});*/