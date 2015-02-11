(function () {
  'use strict';

  /* @ngdoc object
   * @name cartDashboard
   * @requires $urlRouterProvider
   *
   * @description
   *
   */
  angular
    .module('cartDashboard', [
      'ui.router',
      'home'
    ]);

  angular
    .module('cartDashboard')
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }

})();
