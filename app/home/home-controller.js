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
    
    var i, j;

    // Retrieve chart data
    $scope.home.visitorDataObj = Chart.datasetArray[0];
    $scope.home.conversionDataObj = Chart.datasetArray[1];
    $scope.home.errorDataObj = Chart.datasetArray[2];
    $scope.home.chartDataArray = Chart.datasetArray;

    // Retrieve array from each chart data
    $scope.home.visitorDataArray = $scope.home.visitorDataObj[Object.keys($scope.home.visitorDataObj)[0]];
    $scope.home.conversionDataArray = $scope.home.conversionDataObj[Object.keys($scope.home.conversionDataObj)[0]];
    $scope.home.errorDataArray = $scope.home.errorDataObj[Object.keys($scope.home.errorDataObj)[0]];

    // Create an object for conversion rate
    $scope.home.conversionRateArray = []; // first create an array
    for (i=0;i<$scope.home.visitorDataArray.length;i++) {
      for (j=0;j<1;j++) {
        $scope.home.conversionRateArray.push([$scope.home.conversionDataArray[i][0], $scope.home.conversionDataArray[i][1] / $scope.home.visitorDataArray[i][1]]);
      }
    }
    $scope.home.conversionRateObj = {
      'Conversion Rate': $scope.home.conversionRateArray
    };

    // Create an object for bounce rate
    $scope.home.bounceRateArray = []; // first create an array
    for (i=0;i<$scope.home.visitorDataArray.length;i++) {
      for (j=0;j<1;j++) {
        $scope.home.bounceRateArray.push([$scope.home.conversionDataArray[i][0], 1 - $scope.home.conversionDataArray[i][1] / $scope.home.visitorDataArray[i][1]]);
      }
    }
    $scope.home.bounceRateObj = {
      'Bounce Rate': $scope.home.bounceRateArray
    };

    // Get current date and time
    $scope.minuteInterval = 1000;

    $scope.home.currentTime = new Date(); // initialize

    $interval(function () { // update every second
      $scope.home.currentTime = new Date();
    }, $scope.minuteInterval);

  }

})();
