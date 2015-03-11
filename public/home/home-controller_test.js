/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('HomeCtrl', function () {
  var scope;

  beforeEach(module('home'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('HomeCtrl', {$scope: scope});
  }));

  it('should have ctrlName as HomeCtrl', function () {
    expect(scope.home.ctrlName).toEqual('HomeCtrl');
  });

});
