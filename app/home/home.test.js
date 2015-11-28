(function () {
    
'use strict';

describe('Controller: HomeController', function () {

  // load the controller's module
  beforeEach(module('angular-seed'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();
    MainCtrl = $controller('HomeController', {
      $scope: scope
    });
  }));

  it('should start a scope var test with a value of testing...', function () {
    
    expect(scope.test).toEqual('testing...')
  });

 
});
    
}());
