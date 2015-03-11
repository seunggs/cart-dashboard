/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('d3', function () {
  var factory;

  beforeEach(module('cartDashboard'));

  beforeEach(inject(function (d3) {
    factory = d3;
  }));

  it('should have someValue be d3', function () {
    expect(factory.someValue).toEqual('d3');
  });

  it('should have someMethod return d3', function () {
    expect(factory.someMethod()).toEqual('d3');
  });

});
