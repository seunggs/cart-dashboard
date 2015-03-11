/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('lineChart', function () {
  var scope
    , element;

  beforeEach(module('cartDashboard', '/line-chart-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<line-chart></line-chart>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.isolateScope().lineChart.name).toEqual('lineChart');
  });

});
