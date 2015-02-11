(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name cartDashboard.directive:lineChart
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
   * <line-chart height="80" margin="{top: 16, right: 16, left: 16, bottom: 16}" dataset="home.chartData"></line-chart>
   *
   */
  angular
    .module('cartDashboard')
    .directive('lineChart', lineChart);

  function lineChart(d3, $window) {
    return {
      restrict: 'EA',
      scope: {
        dataset: '=',
        margin: '=',
        hasXAxis: '=',
        hasYAxis: '='
      },
      templateUrl: '/line-chart-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        /*jshint unused:false */

        // browser resize event
        $window.onresize = function () {
          scope.$apply();
        };

        // watch for windows resize event
        scope.$watch(function () {
          return angular.element($window)[0].innerWidth;
        }, function () {
          return scope.render(scope.dataset);
        });

        // watch for change in dataset
        scope.$watchCollection('dataset', function (newVals, oldVals) {
          return scope.render(newVals);
        });

        // render chart when called
        scope.render = function (data) {
          // remove all previous items before render
          d3.selectAll('svg').remove();

          // copy the data so that the original data is intact
          var dataset = angular.copy(data);

          var margin = {
            top: parseInt(scope.margin.top) || 20,
            right: parseInt(scope.margin.right) || 20,
            bottom: parseInt(scope.margin.bottom) || 20,
            left: parseInt(scope.margin.left) || 20
          };
          var width = parseInt(attrs.width) - (margin.left + margin.right) || element.parent()[0].offsetWidth - (margin.left + margin.right);
          var height = parseInt(attrs.height) - (margin.top + margin.bottom);
          var hasXAxis = scope.hasXAxis || false;
          var hasYAxis = scope.hasYAxis || false;

          var parseDate = d3.time.format('%d-%b-%y').parse;

          var x = d3.time.scale()
                         .range([0, width]);
          var y = d3.scale.linear()
                          .range([0, height]);

          if (hasXAxis) {
            var xAxis = d3.svg.axis()
                              .scale(x)
                              .orient('bottom');
          }

          if (hasYAxis) {
            var yAxis = d3.svg.axis()
                              .scale(y)
                              .orient('left');
          }

          var line = d3.svg.line()
                           .x(function (d) { return x(d.date); })
                           .y(function (d) { return y(d.visitors); });

          var svg = d3.select(element[0]).append('svg')
                                         .attr('width', width + margin.left + margin.right)
                                         .attr('height', height + margin.top + margin.bottom)
                                         .append('g')
                                         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          
          dataset.forEach(function (d) {
            d.date = parseDate(d.date);
            d.visitors = -d.visitors;
          });

          x.domain(d3.extent(dataset, function (d) { return d.date; }));
          y.domain(d3.extent(dataset, function (d) { return d.visitors; }));

          svg.append('path')
             .attr('d', line(dataset));

        }; // end: scope.render function

      }
    };
  }

})();
