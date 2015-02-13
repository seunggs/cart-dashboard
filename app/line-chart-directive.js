(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name cartDashboard.directive:lineChart
   * @restrict EA
   * @element
   *
   * @description
   * Multiple datasets allowed in an array format for dataset attribute
   * Put in a single dataset OBJECT or an ARRAY of multiple dataset OBJECTS
   *
   * @example
   * <line-chart height="80" margin="{top: 16, right: 16, left: 16, bottom: 16}" dataset="home.chartData" yDomainZero="true"></line-chart>
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
        hasYAxis: '=',
        hasLabel: '=',
        multiDataset: '=',
        yDomainStartZero: '='
      },
      templateUrl: '/line-chart-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        /*jshint unused:false */

        var multiDataset = scope.multiDataset || false;
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
        scope.render = function (dataArray) {
          // remove all previous items before render
          d3.select(element[0]).selectAll('svg').remove();

          // define color palette in an array
          var colorPalette = ['#79d1ff', '#aedf6e', '#ffcc66', '#ff8e66', '#ff66a0'];

          // copy the data sets so that the original data is intact
          var dataArrayLength;
          var dataset = [];
          var chartNames = [];

          if (multiDataset) {
            dataArrayLength = dataArray.length;
            for (var i=0; i<dataArrayLength; i++) {
              chartNames.push(Object.keys(dataArray[i])[0]);
              dataset.push(angular.copy(dataArray[i][chartNames[i]]));
            }
          } else {
            dataArrayLength = 1;
            chartNames.push(Object.keys(dataArray)[0]);
            dataset.push(angular.copy(dataArray)[chartNames[0]]);
          }

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
          var hasLabel = scope.hasLabel || false;
          var yDomainZero = scope.yDomainZero || false;

          // a function that can parse date
          var parseDate = d3.time.format('%d-%b-%y').parse;

          // add different color to graphs
          var color = d3.scale.category10();

          var x = d3.time.scale()
                         .range([0, width]);
          var y = d3.scale.linear()
                          .range([0, height]);

          if (scope.hasXAxis) {
            var xAxis = d3.svg.axis()
                              .scale(x)
                              .orient('bottom')
                              .ticks(dataset[0].length);
          }

          if (scope.hasYAxis) {
            var yAxis = d3.svg.axis()
                              .scale(y)
                              .orient('left');
          }

          // create plot points for svg path
          var line = d3.svg.line()
                           .x(function (d) { return x(d[0]); })
                           .y(function (d) { return y(d[1]); });

          // create svg canvas for the chart
          var svg = d3.select(element[0]).append('svg')
                                         .attr('width', width + margin.left + margin.right)
                                         .attr('height', height + margin.top + margin.bottom)
                                         .append('g')
                                         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          
          // transform data into d3 compatible form
          for (i=0;i<dataArrayLength;i++) {
            dataset[i].forEach(function (d) {
              d[0] = parseDate(d[0]);
              d[1] = +d[1];
            });
          }

          // first calculate max y domain from all the data sets
          var allYArray = [];
          for (i=0;i<dataArrayLength;i++) {
            for (var j=0;j<dataset[i].length;j++) {
              allYArray.push(dataset[i][j][1]); // create a single array of all y values in all datasets
            }
          }
          var yDomainMin =  Math.min.apply(null, allYArray);
          var yDomainMax =  Math.max.apply(null, allYArray);

          // then use it to calculate the y domain
          x.domain(d3.extent(dataset[0], function (d) { return d[0]; }));
          if (scope.yDomainStartZero) {
            y.domain([yDomainMax, 0]);
          } else {
            y.domain([yDomainMax, yDomainMin]);
          }

          // draw the line(s)
          for (i=0;i<dataArrayLength;i++) {
            svg.append('path')
                .datum(dataset[i])
                .attr('class', 'chart--line')
                .style('stroke', colorPalette[i])
                .attr('d', line(dataset[i]));    
          }

          // add text labels to the lines
          if (hasLabel) {
            for (i=0;i<dataArrayLength;i++) {
              svg.append('text')
                  .attr('transform', 'translate(' + (width) + ',' + (y(dataset[i][0][1])-8) + ')')
                  .attr('text-anchor', 'end')
                  .attr('class', 'chart--text')
                  .text(chartNames[i]);
            }
          }

          // draw the axes
          if (hasXAxis) {
            svg.append('g')
                .attr('class', 'chart--xaxis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
          }

          if (hasYAxis) {
            svg.append('g')
                .attr('class', 'chart--yaxis')
                .call(yAxis);
          }

        }; // end: scope.render function

      }
    };
  }

})();
