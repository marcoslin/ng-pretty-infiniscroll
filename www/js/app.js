/*global angular */

var app = angular.module("webapp", ['ngRoute']);
    
app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider
        .when('/home', {templateUrl: 'views/home.html', controller: 'HomeController'})
        .otherwise({redirectTo: '/home'});

}]);


app.controller("HomeController", ['$scope', function ($scope) {
    'use strict';
    
    var data = [], i;
    
    for (i = 0; i <= 100; i += 1) {
        data.push({ line: i, message: "Line number " + i});
    }
    
    $scope.data = data;

}]);