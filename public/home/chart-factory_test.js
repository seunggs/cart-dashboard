/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('Chart', function () {
  var factory;

  beforeEach(module('home'));

  beforeEach(inject(function (Chart) {
    factory = Chart;
  }));

  it('should have someValue be Chart', function () {
    expect(factory.someValue).toEqual('Chart');
  });

  it('should have someMethod return Chart', function () {
    expect(factory.someMethod()).toEqual('Chart');
  });

});
