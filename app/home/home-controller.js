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
    $scope.home.chartData = Chart.dataset;
    $scope.home.chartData2 = Chart.dataset2;

    // Get difference from yesterday
    $scope.home.dailyDiff = $scope.home.chartData[0].visitors - $scope.home.chartData[1].visitors;

    // Get current date and time
    $scope.minuteInterval = 1000;

    $scope.home.currentTime = new Date(); // initialize

    $interval(function () { // update every second
      $scope.home.currentTime = new Date();
    }, $scope.minuteInterval);

  }

})();
