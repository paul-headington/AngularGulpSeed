(function () {
    
    'use strict';

    var ng;
    
  angular.module('angular-seed', [
      'ngRoute', 
      'ngAnimate',
      'ngSanitize'
  ])
  

  .config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
      //$locationProvider.hashPrefix('!');
      // routes
      $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  }]);
  
}());

 