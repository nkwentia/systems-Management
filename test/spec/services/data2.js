'use strict';

describe('Service: Data2', function () {

  // load the service's module
  beforeEach(module('schoolManApp'));

  // instantiate service
  var Data2;
  beforeEach(inject(function (_Data2_) {
    Data2 = _Data2_;
  }));

  it('should do something', function () {
    expect(!!Data2).toBe(true);
  });

});
