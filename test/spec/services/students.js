'use strict';

describe('Service: Students', function () {

  // load the service's module
  beforeEach(module('schoolManApp'));

  // instantiate service
  var Students;
  beforeEach(inject(function (_Students_) {
    Students = _Students_;
  }));

  it('should do something', function () {
    expect(!!Students).toBe(true);
  });

});
