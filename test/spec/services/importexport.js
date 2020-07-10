'use strict';

describe('Service: Importexport', function () {

  // load the service's module
  beforeEach(module('schoolManApp'));

  // instantiate service
  var Importexport;
  beforeEach(inject(function (_Importexport_) {
    Importexport = _Importexport_;
  }));

  it('should do something', function () {
    expect(!!Importexport).toBe(true);
  });

});
