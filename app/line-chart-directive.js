(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name cartDashboard.directive:lineChart
   * @restrict EA
   * @element
   * 
   * @Attributes
      > dataset (required): Single dataset in OBJECT form for a single line. 
                            Multiple dataset objects accepted in an ARRAY form.
      > multi-dataset (required): True if inputting multiple dataset objects in ARRAY form. 
                                  False if inputting a single dataset object.
      > height (required)
      > margin (optional): Defaults to 20px all around.
                           Margins around the chart (top, right, bottom, left).
      > has-x-axis (optional): Defaults to false. 
                               When true, puts x axis.
      > has-y-axis (optional): Defaults to false. 
                               When true, puts y axis.
      > has-label (optional): Defaults to false. 
                              When true, puts text label on the top right corner of each line chart.
      > label-type (optional): Defaults to day.
                               Options: 1) long; 2) name; 3) day
      > y-domain-start-zero (optional): Defaults to false. 
                                        When true, Y axis starts at zero rather than the lowest y value.
   *
   * @description
   * Multiple datasets allowed in an array format for dataset attribute
   * Put in a single dataset OBJECT or an ARRAY of multiple dataset OBJECTS
   *
   * @example
   * <line-chart height="352" margin="{top: 24, right: 40, left: 64, bottom: 24}" multi-dataset="true" dataset="home.chartDataArray" y-domain-start-zero="true" has-x-axis="true" has-y-axis="true" has-label="true" label-type="name"></line-chart>
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
        multiDataset: '=',
        margin: '=?',
        hasXAxis: '=?',
        hasYAxis: '=?',
        hasLabel: '=?',
        labelType: '@?',
        yDomainStartZero: '=?',
        showDot: '=?'
      },
      templateUrl: '/line-chart-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*jshint loopfunc: true */

        var i, j; // counter for for loops
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
            for (i=0; i<dataArrayLength; i++) {
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
          var labelType = scope.labelType || 'day';
          var yDomainZero = scope.yDomainZero || false;
          var showDot = scope.showDot || false;

          // add different color to graphs
          var color = d3.scale.category10();

          var x = d3.time.scale()
                         .range([0, width]);
          var y = d3.scale.linear()
                          .range([0, height]);

          var xAxis;
          var yAxis;
          if (scope.hasXAxis) {
            xAxis = d3.svg.axis()
                          .scale(x)
                          .orient('bottom')
                          .tickFormat(d3.time.format('%b %d'))
                          .ticks(dataset[0].length);
          }

          if (scope.hasYAxis) {
            yAxis = d3.svg.axis()
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
          var parseDate = d3.time.format('%d-%b-%y').parse; // a function that can parse date

          for (i=0;i<dataArrayLength;i++) {
            dataset[i].forEach(function (d) {
              d[0] = parseDate(d[0]);
              d[1] = +d[1];
            });
          }

          // first calculate max y domain from all the data sets
          var allYArray = [];
          for (i=0;i<dataArrayLength;i++) {
            for (j=0;j<dataset[i].length;j++) {
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

          // draw the line(s)
          for (i=0;i<dataArrayLength;i++) {
            svg.append('path')
                .datum(dataset[i])
                .attr('class', 'chart--line')
                .style('stroke', colorPalette[i])
                .attr('d', line(dataset[i]));    
          }

          // add circles to the coordinates
          if (showDot) {
            for (i=0;i<dataArrayLength;i++) {
              for (j=0;j<dataset[i].length;j++) {
                svg.append('circle')
                      .datum(dataset[i])
                      .style('fill', colorPalette[i])
                      .attr('r', 3)
                      .attr('cx', function (d) { return x(d[j][0]); })
                      .attr('cy', function (d) { return y(d[j][1]); });
              }
            }
          }

          // add circles and tooltip on mouseover
          var formatTime = d3.time.format('%b %d, %y');
          var circle = svg.append;
          var tooltip = svg.append('div')
                            .attr('class', 'tooltip')
                            .style('opacity', 0);

          for (i=0;i<dataArrayLength;i++) {
            for (j=0;j<dataset[i].length;j++) {
              svg.append('circle')
                    .datum(dataset[i])
                    .style('fill', 'none')
                    .style('stroke', colorPalette[i])
                    .style('opacity', 0)
                    .attr('r', 5)
                    .attr('cx', function (d) { return x(d[j][0]); })
                    .attr('cy', function (d) { return y(d[j][1]); })
                    .on('mouseover', function (d) {
                      div.transition()
                          .duration(200)
                          .style('opacity', 0.9);
                      div.html(formatTime(d[j][0]) + '<br>' + d[j][1]);
                    })
                    .on('mouseout', function (d) {
                      div.transition()
                          .duration(200)
                          .style('opacity', 0);
                    });
            }
          }

          // add text labels to the lines
          var chartText;

          if (hasLabel) {
            for (i=0;i<dataArrayLength;i++) {
              switch (labelType) {
                case 'long':
                  chartText = chartNames[i] + ', last ' + dataset[i].length + ' days';
                  break;
                case 'name':
                  chartText = chartNames[i];
                  break;
                case 'day':
                  chartText = dataset[i].length + ' days';
                  break;
              }

              svg.append('text')
                  .attr('transform', 'translate(' + (width) + ',' + (y(dataset[i][0][1])-8) + ')')
                  .attr('text-anchor', 'end')
                  .attr('class', 'chart--text')
                  .text(chartText);
            }
          }

        }; // end: scope.render function

      }
    };
  }

})();
