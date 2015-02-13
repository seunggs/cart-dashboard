(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name home.controller:HomeCtrl
   * @requires $scope
   *
   * @description
   *
   */
  angular
    .module('home')
    .controller('HomeCtrl', HomeCtrl);

  function HomeCtrl($scope, Chart, $interval) {
    $scope.home = {};
    $scope.home.ctrlName = 'HomeCtrl';

    // Retrieve chart data
    $scope.home.visitorDataObj = Chart.datasetArray[0];
    $scope.home.conversionDataObj = Chart.datasetArray[1];
    $scope.home.errorDataObj = Chart.datasetArray[2];
    $scope.home.chartDataArray = Chart.datasetArray;

    $scope.home.visitorDataArray = Chart.datasetArray[0][Object.keys(Chart.datasetArray[0])[0]];
    $scope.home.conversionDataArray = Chart.datasetArray[1][Object.keys(Chart.datasetArray[1])[0]];
    $scope.home.errorDataArray = Chart.datasetArray[2][Object.keys(Chart.datasetArray[2])[0]];

    // Get difference from yesterday
    $scope.home.visitorDailyDiff = $scope.home.visitorDataArray[0][1] - $scope.home.visitorDataArray[1][1];
    $scope.home.conversionDailyDiff = $scope.home.conversionDataArray[0][1] - $scope.home.conversionDataArray[1][1];
    $scope.home.errorDailyDiff = $scope.home.errorDataArray[0][1] - $scope.home.errorDataArray[1][1];

    // Get current date and time
    $scope.minuteInterval = 1000;

    $scope.home.currentTime = new Date(); // initialize

    $interval(function () { // update every second
      $scope.home.currentTime = new Date();
    }, $scope.minuteInterval);

  }

})();
