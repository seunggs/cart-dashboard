(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name home.directive:card
   * @restrict EA
   * @element
   *
   * @attributes
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
      > size (required): 1) sm; 2) md
      > chartHeight (optional)
      > components (optional): Defaults to { num: true, change: true, chart: true, chartType: 'simple'}
                               Pass in objects with desired components
                               Options: 1) num; 2) change; 3) chart; 4) chartType (options: simple, medium, comprehensive)
                               ex) { num: false, change: false, chart: true, chartType: 'comprehensive' }
      > has-label (optional): Defaults to false.
      > label-type (optional): Defaults to day.
                               Options: 1) long; 2) name; 3) day
      > rate (optional): Defaults to false.
                         If the dataset comprises rates rather than numbers, set to true.
      > legend (optional): Defaults to false.
                           When true, shows legend.
   * 
   * @description
   *
   * @example
      <card dataset="home.chartDataArraySm" dataset-right="home.conversionRateObj" multi-dataset="true" multi-dataset-right="false" size="md" components="{ num: false, change: false, chart: true, chartType: 'comprehensive' }" has-label="true" label-type="name" show-dot="true">Visitor vs Conversion vs Conversion Rate, Today</card>
   *
   */
  angular
    .module('home')
    .directive('card', card);

  function card() {
    return {
      restrict: 'EA',
      scope: {
        dataset: '=',
        datasetRight: '=?',
        multiDataset: '=?',
        multiDatasetRight: '=?',
        size: '@',
        margin: '=?',
        chartHeight: '@?',
        components: '=?',
        hasLabel: '=?',
        labelType: '@?',
        rate: '@?',
        showDot: '@?',
        legend: '@?'
      },
      templateUrl: 'home/card-directive.tpl.html',
      replace: false,
      transclude: true,
      controller: function ($scope) {
        $scope.card = {};
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        scope.multiDataset = scope.multiDataset || false;
        scope.multiDatasetRight = scope.multiDatasetRight || false;
        scope.hasLabel = scope.hasLabel || false;
        scope.labelType = scope.labelType || 'day';
        scope.components = scope.components || { num: true, change: true, chart: true, chartType: 'simple'};
        scope.rate = scope.rate || false;
        scope.showDot = scope.showDot || false;
        scope.legend = scope.legend || false;

        // set default height based on size
        switch (scope.size) {
          case 'sm':
            scope.chartHeight = scope.chartHeight || 80;
            scope.margin = scope.margin || {top: 24, right: 16, left: 16, bottom: 16};
            break;
          case 'md':
            scope.chartHeight = scope.chartHeight || 416;
            scope.margin = scope.margin || {top: 56, right: 40, left: 64, bottom: 24};
            break;
        }

        // create an array out of the dataset object if single line
        if (!scope.multiDataset) {
          scope.card.dataArray = scope.dataset[Object.keys(scope.dataset)[0]];
        } else {
          scope.card.dataArray = scope.dataset;
        }

        // calculate difference from previous day
        if (!scope.multiDataset) {
          scope.card.dailyDiff = scope.card.dataArray[0][1] - scope.card.dataArray[1][1];
        }

      }
    };
  }

})();
