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
      > dataset-right (optional): Defaults to undefined (i.e. doesn't show on the chart)
                                  If present, shows the dataset on the scale of the RIGHT y-axis
                                  Single dataset in OBJECT form for a single line. 
                                  Multiple dataset objects accepted in an ARRAY form.
      > multi-dataset (required): True if inputting multiple dataset objects in ARRAY form.
                                  False if inputting a single dataset object.
      > multi-dataset-right (optional): Defaults to false
                                        True if inputting multiple dataset objects in ARRAY form. 
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
      > y-domain-right-start-zero (optional): Defaults to false. 
                                              When true, Y axis on the RIGHT starts at zero rather than the lowest y value.
      > show-dot (optional): Defaults to false.
                             When true, shows a dot for each coordinate on the line.
      > legend (optional): Defaults to false.
                           When true, shows legend.
   *
   * @description
   * Multiple datasets allowed in an array format for dataset attribute
   * Put in a single dataset OBJECT or an ARRAY of multiple dataset OBJECTS
   *
   * @example
      > simple:
        <line-chart ng-if="components.chartType === 'simple'" height="{{chartHeight}}" margin="{top: 24, right: 16, left: 16, bottom: 16}" dataset="dataset" multi-dataset="multiDataset" has-label="hasLabel" label-type="{{labelType}}"></line-chart
      > comprehensive:
        <line-chart ng-if="components.chartType === 'comprehensive'" height="{{chartHeight}}" margin="{top: 56, right: 40, left: 64, bottom: 24}" dataset="dataset" dataset-right="datasetRight" multi-dataset="multiDataset" multi-dataset-right="multiDatasetRight" y-domain-start-zero="true" has-x-axis="true" has-y-axis="true" has-label="hasLabel" label-type="{{labelType}}" show-dot="showDot"></line-chart>
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
        datasetRight: '=?',
        multiDataset: '=',
        multiDatasetRight: '=?',
        margin: '=?',
        hasXAxis: '=?',
        hasYAxis: '=?',
        hasLabel: '=?',
        labelType: '@?',
        yDomainStartZero: '=?',
        yDomainRightStartZero: '=?',
        showDot: '=?',
        legend: '=?'
      },
      templateUrl: '/line-chart-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*jshint loopfunc: true */

        var i, j; // counter for for loops
        var multiDataset = scope.multiDataset || false;
        var multiDatasetRight = scope.multiDatasetRight || false;

        // browser resize event
        $window.onresize = function () {
          scope.$apply();
        };

        // watch for windows resize event
        scope.$watch(function () {
          return angular.element($window)[0].innerWidth;
        }, function () {
          return scope.render(scope.dataset, scope.datasetRight);
        });

        // watch for change in dataset
        scope.$watchCollection('dataset', function (newVals, oldVals) {
          return scope.render(newVals, scope.datasetRight);
        });

        scope.$watchCollection('datasetRight', function (newVals, oldVals) {
          return scope.render(scope.dataset, newVals);
        });

        // render chart when called
        scope.render = function (dataArray, dataArray2) {
          // remove all previous items before render
          d3.select(element[0]).selectAll('svg').remove();

          // define color palette in an array
          var colorPalette = ['#79d1ff', '#aedf6e', '#ffcc66', '#ff8e66', '#ff66a0'];
          var colorPalette2 = ['#fff', '#ff8e66', '#ff66a0'];

          // copy the data sets so that the original data is intact
          var dataArrayLength;
          var dataset = []; // left y-axis related dataset
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

          // do it for right y-axis dataset
          var dataArray2Length;
          var datasetRight = []; // right y-axis related dataset
          var chartNames2 = [];

          if (scope.datasetRight !== undefined) {
            if (multiDatasetRight) {

              dataArray2Length = dataArray2.length;

              for (i=0; i<dataArray2Length; i++) {
                chartNames2.push(Object.keys(dataArray2[i])[0]);
                datasetRight.push(angular.copy(dataArray2[i][chartNames2[i]]));
              }

            } else {

              dataArray2Length = 1;
              chartNames2.push(Object.keys(dataArray2)[0]);
              datasetRight.push(angular.copy(dataArray2)[chartNames2[0]]);

            }
          }

          // set other constants for the chart
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
          var yDomainStartZero = scope.yDomainStartZero || false;
          var yDomainRightStartZero = scope.yDomainRightStartZero || false;
          var showDot = scope.showDot || false;
          var legend = scope.legend || false;

          // add different color to graphs
          var color = d3.scale.category10();

          var x = d3.time.scale()
                         .range([0, width]);
          var y = d3.scale.linear()
                          .range([0, height]);
          var y2 = d3.scale.linear()
                          .range([0, height]);

          /* create axes */
          var xAxis;
          var yAxis, yAxis2;
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

          // add right y-axis if datasetRight exists
          if (datasetRight.length > 0) {
            yAxis2 = d3.svg.axis()
                            .scale(y2)
                            .orient('right');
          }

          // create plot points for svg path
          var line = d3.svg.line()
                           .x(function (d) { return x(d[0]); })
                           .y(function (d) { return y(d[1]); });

          var line2 = d3.svg.line()
                           .x(function (d) { return x(d[0]); })
                           .y(function (d) { return y2(d[1]); });

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

          if (datasetRight.length > 0) {
            for (i=0;i<dataArray2Length;i++) {
              datasetRight[i].forEach(function (d) {
                d[0] = parseDate(d[0]);
                d[1] = +d[1];
              });
            }
          }

          /* calculate y domain */
          // first calculate max y domain from all datasets on left y-axis
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

          // calculate max y domain from all datasets on right y-axis
          if (datasetRight.length > 0) {
            var allYArray2 = [];
            for (i=0;i<dataArray2Length;i++) {
              for (j=0;j<datasetRight[i].length;j++) {
                allYArray2.push(datasetRight[i][j][1]); // create a single array of all y values in all datasets
              }
            }
            var yDomainMin2 =  Math.min.apply(null, allYArray2);
            var yDomainMax2 =  Math.max.apply(null, allYArray2);

            // then use it to calculate the y domain
            var topAmplifier = 1.4;
            var bottomAmplifier = 1;
            if (scope.yDomainRightStartZero) {
              y2.domain([yDomainMax2 * topAmplifier, 0]);
            } else {
              y2.domain([yDomainMax2 * topAmplifier, yDomainMin2 * bottomAmplifier]);
            }

          }

          /* draw the axes */
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

          if (datasetRight.length > 0) {
            svg.append('g')
                .attr('class', 'chart--yaxis')
                .attr('transform', 'translate(' + width + ' ,0)')
                .call(yAxis2);
          }

          /* draw the line(s) */
          for (i=0;i<dataArrayLength;i++) {
            svg.append('path')
                .datum(dataset[i])
                .attr('class', 'chart--line')
                .style('stroke', colorPalette[i])
                .attr('d', line(dataset[i]));    
          }

          if (datasetRight.length > 0) {
            for (i=0;i<dataArray2Length;i++) {
              svg.append('path')
                  .datum(datasetRight[i])
                  .attr('class', 'chart--line')
                  .style('stroke', colorPalette2[i])
                  .attr('d', line2(datasetRight[i]));    
            }
          }

          /* add circles to the coordinates */
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

            if (datasetRight.length > 0) {
              for (i=0;i<dataArray2Length;i++) {
                for (j=0;j<datasetRight[i].length;j++) {
                  svg.append('circle')
                      .datum(datasetRight[i])
                      .style('fill', colorPalette2[i])
                      .attr('r', 3)
                      .attr('cx', function (d) { return x(d[j][0]); })
                      .attr('cy', function (d) { return y2(d[j][1]); });
                }
              }
            }
          }

          /* add text labels to the lines */
          var chartText;
          var chartText2;

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
                  .attr('transform', 'translate(' + (width) + ',' + (y(dataset[i][0][1])+16) + ')')
                  .attr('text-anchor', 'end')
                  .attr('class', 'chart--text')
                  .text(chartText);
            }

            for (i=0;i<dataArray2Length;i++) {
              switch (labelType) {
                case 'long':
                  chartText2 = chartNames2[i] + ', last ' + datasetRight[i].length + ' days';
                  break;
                case 'name':
                  chartText2 = chartNames2[i];
                  break;
                case 'day':
                  chartText2 = datasetRight[i].length + ' days';
                  break;
              }
              svg.append('text')
                  .attr('transform', 'translate(' + (width) + ',' + (y2(datasetRight[i][0][1])+16) + ')')
                  .attr('text-anchor', 'end')
                  .attr('class', 'chart--text')
                  .text(chartText2);
            }
          }

          /* add legend */
          var legendBox = svg.append('g')
                              .attr('id', 'chart-legend');
          var legendLineWidth = 10;
          var legendMarginBetweenLineText = 15;
          var legendMarginBetweenElements = 15;
          var legendElementWidth = 0;

          if (legend) {
            for (i=0;i<dataArrayLength;i++) {

              legendBox.append('line')
                        .attr('x1', 0 + legendElementWidth)
                        .attr('y1', -4)
                        .attr('x2', legendLineWidth + legendElementWidth)
                        .attr('y2', -4)
                        .attr('stroke-width', 3)
                        .attr('stroke', colorPalette[i]);

              legendBox.append('text')
                        .attr('id', 'chart-legend-text'+i)
                        .attr('class', 'chart--text')
                        .attr('transform', 'translate(' + (legendElementWidth + legendMarginBetweenLineText) + ',0)')
                        .text(chartNames[i]);

              legendElementWidth += d3.select('#chart-legend-text'+i).node().getBBox().width + legendLineWidth + legendMarginBetweenElements; // add text width + line width + margin

            }

            for (i=0;i<dataArray2Length;i++) {

              legendBox.append('line')
                        .attr('x1', 0 + legendElementWidth)
                        .attr('y1', -4)
                        .attr('x2', legendLineWidth + legendElementWidth)
                        .attr('y2', -4)
                        .attr('stroke-width', 3)
                        .attr('stroke', colorPalette2[i]);

              legendBox.append('text')
                        .attr('id', 'chart-legend-text'+dataArrayLength+i)
                        .attr('class', 'chart--text')
                        .attr('transform', 'translate(' + (legendElementWidth + legendMarginBetweenLineText) + ',0)')
                        .text(chartNames2[i]);

              legendElementWidth += d3.select('#chart-legend-text'+dataArrayLength+i).node().getBBox().width + legendLineWidth + legendMarginBetweenElements; // add text width + line width + margin

            }

            legendBox.attr('transform', 'translate(' + (width/2 - legendElementWidth/2) + ',' + (-16) + ')')
          }

          /* add circles and tooltip on mouseover */
          var focus = svg.append('g')
                          .style('display', 'none');

          // append vertical line
          focus.append('line')
                .attr('id', 'chart-focus-line')
                .attr('stroke-dasharray', '4,4')
                .style('stroke', '#666');

          // append circle (no positioning yet) and text
          for (i=0;i<dataArrayLength;i++) {
            focus.append('circle')
                  .attr('id', 'chart-focus-circle'+i)
                  .style('fill', colorPalette[i])
                  .attr('r', 4);
            focus.append('text')
                  .attr('id', 'chart-focus-text'+i)
                  .attr('text-anchor', 'middle')
                  .attr('y', -10)
                  .attr('class', 'chart--text');
          }

          if (datasetRight.length > 0) {
            for (i=0;i<dataArray2Length;i++) {
              focus.append('circle')
                    .attr('id', 'chart-focus-circle-right'+i)
                    .style('fill', colorPalette2[i])
                    .attr('r', 4);
              focus.append('text')
                    .attr('id', 'chart-focus-text-right'+i)
                    .attr('text-anchor', 'middle')
                    .attr('y', -10)
                    .attr('class', 'chart--text');
            }
          }

          // append rect to capture mouse movement
          svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseover', function () { focus.style('display', null); })
                .on('mouseout', function () { focus.style('display', 'none'); })
                .on('mousemove', mousemove);

          // create a bisector function and
          // create a reversed array (we need ascending order for bisector to work)
          var bisectDate = d3.bisector(function (d) { return d[0]; }).left;
          var datasetR = [];
          var datasetRightR = [];

          for (i=0;i<dataArrayLength;i++) {
            datasetR[i] = angular.copy(dataset[i].reverse());
          }

          if (datasetRight.length > 0) {
            for (i=0;i<dataArray2Length;i++) {
              datasetRightR[i] = angular.copy(datasetRight[i].reverse());
            }
          }

          function mousemove() {
            /*jshint validthis:true */
            var x0 = x.invert(d3.mouse(this)[0]);
            var index, d0, d1, d;
            var focusText;
            var index2, dr0, dr1, dr;
            var focusText2;

            for (i=0;i<dataArrayLength;i++) {
              index = bisectDate(datasetR[i], x0, 1);
              d0 = dataset[i][index-1];
              d1 = dataset[i][index];
              d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;

              // draw the vertical line
              focus.select('#chart-focus-line')
                    .attr('x1', x(d[0]))
                    .attr('y1', 0)
                    .attr('x2', x(d[0]))
                    .attr('y2', height);

              focus.select('#chart-focus-circle'+i)
                    .attr('transform', 'translate(' + x(d[0]) + ',' + y(d[1]) + ')');

              focusText = Math.round(d[1] * 10000) / 10000;
              if (d[1] < 1 && d[1] > 0) {
                focusText = (focusText * 100).toFixed(1) + '%';
              }

              focus.select('#chart-focus-text'+i)
                    .attr('transform', 'translate(' + x(d[0]) + ',' + y(d[1]) + ')')
                    .text(focusText);

            }

            if (datasetRight.length > 0) {
              for (i=0;i<dataArray2Length;i++) {
                index2 = bisectDate(datasetRightR[i], x0, 1);
                dr0 = datasetRight[i][index-1];
                dr1 = datasetRight[i][index];
                dr = x0 - dr0[0] > dr1[0] - x0 ? dr1 : dr0;

                focus.select('#chart-focus-circle-right'+i)
                      .attr('transform', 'translate(' + x(dr[0]) + ',' + y2(dr[1]) + ')');

                focusText2 = Math.round(dr[1] * 10000) / 10000;
                if (dr[1] < 1 && dr[1] > 0) {
                  focusText2 = (focusText2 * 100).toFixed(1) + '%';
                }
                focus.select('#chart-focus-text-right'+i)
                      .attr('transform', 'translate(' + x(dr[0]) + ',' + y2(dr[1]) + ')')
                      .text(focusText2);
              }
            }

          }

        }; // end: scope.render function

      }
    };
  }

})();
