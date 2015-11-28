(function () {
    'use strict';

angular.module('angular-seed')
  .controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    
    console.log("home controller loaded");

      $scope.test = "testing...";
    
  }]);
    
}());