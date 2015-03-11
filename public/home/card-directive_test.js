/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('card', function () {
  var scope
    , element;

  beforeEach(module('home', 'home/card-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<card></card>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.isolateScope().card.name).toEqual('card');
  });

});
