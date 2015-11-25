(function () {
    
    'use strict';

angular.module('angular-seed')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
      });
  }]);
    
}());