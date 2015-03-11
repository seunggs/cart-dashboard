(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name cartDashboard.factory:d3
   *
   * @description
   *
   */
  angular
    .module('cartDashboard')
    .factory('d3', d3);

  function d3($window) {
    var d3Service = $window.d3;

    return d3Service;
  }

})();
