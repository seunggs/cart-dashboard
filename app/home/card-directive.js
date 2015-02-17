(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name home.directive:card
   * @restrict EA
   * @element
   *
   * @attributes
      > dataset (required): Single dataset in OBJECT form for a single line. Multiple dataset objects accepted in an ARRAY form.
      > multi-dataset (optional): Defaults to false. 
                                 True if inputting multiple dataset objects in ARRAY form. 
                                 False if inputting a single dataset object.
      > size (required): 1) sm; 2) md
      > col (required): Bootstrap cols
      > chartHeight (optional)
      > components (optional): Defaults to { num: true, change: true, chart: true, chartType: 'simple'}
                               Pass in objects with desired components
                               Options: 1) num; 2) change; 3) chart; 4) chartType (options: simple, medium, comprehensive)
                               ex) { num: false, change: false, chart: true, chartType: 'comprehensive' }
      > has-label (optional): Defaults to false.
      > label-type (optional): Defaults to day.
                               Options: 1) long; 2) name; 3) day
      > rate (optional): Defaults to false.
   * 
   * @description
   *
   * @example

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
        multiDataset: '=?',
        size: '@',
        col: '@',
        chartHeight: '@?',
        components: '=?',
        hasLabel: '=?',
        labelType: '@?',
        rate: '@?',
        showDot: '@?'
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
        scope.hasLabel = scope.hasLabel || false;
        scope.labelType = scope.labelType || 'day';
        scope.components = scope.components || { num: true, change: true, chart: true, chartType: 'simple'};
        scope.rate = scope.rate || false;
        scope.showDot = scope.showDot || false;
        
        // set default height based on size
        if (scope.size === 'sm') {
          scope.chartHeight = scope.chartHeight || 80;
        } else if (scope.size === 'md') {
          scope.chartHeight = scope.chartHeight || 416;
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
