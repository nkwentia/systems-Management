'use strict';

describe('Service: Dcards', function () {

  // load the service's module
  beforeEach(module('schoolManApp'));

  // instantiate service
  var Dcards;
  beforeEach(inject(function (_Dcards_) {
    Dcards = _Dcards_;
  }));

  it('should do something', function () {
    expect(!!Dcards).toBe(true);
  });

});
