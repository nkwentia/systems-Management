'use strict';

describe('Service: Myclasses', function () {

  // load the service's module
  beforeEach(module('schoolManApp'));

  // instantiate service
  var Myclasses;
  beforeEach(inject(function (_Myclasses_) {
    Myclasses = _Myclasses_;
  }));

  it('should do something', function () {
    expect(!!Myclasses).toBe(true);
  });

});
