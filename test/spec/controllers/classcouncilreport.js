'use strict';

describe('Controller: ClasscouncilreportCtrl', function () {

  // load the controller's module
  beforeEach(module('schoolManApp'));

  var ClasscouncilreportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClasscouncilreportCtrl = $controller('ClasscouncilreportCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
