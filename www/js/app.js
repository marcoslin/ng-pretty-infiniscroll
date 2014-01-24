/*global angular */

var app = angular.module("webapp", ['ngRoute','ngAnimate']);

/* ------------
   ROUTE CONFIG
*/
app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider
        .when('/home', {templateUrl: 'views/home.html'})
        .when('/tinyscrollbar', {templateUrl: 'views/tinyscrollbar.html', controller: 'DataController'})
        .otherwise({redirectTo: '/home'});

}]);




/* ------------
   DIRECTIVES
*/
app.directive("triggerScrollbar", ['$log', function ($log) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, elm, attr) {
            if (scope.$last) {
                $log.log("Setting TinyScrollbar");
                $('#tinyscrollbar1').tinyscrollbar();
            }
        }
    };
}]);




/* ------------
   FACTORY/SERVICE
*/
app.factory("DataSimple", ['$q', '$timeout', function ($q, $timeout) {
    'use strict';
    
    var d = $q.defer();
    
    $timeout(function () {
        var result = [], i;
        for (i = 0; i <= 100; i += 1) {
            result.push("Entry number " + i);
        }
        d.resolve(result);
    }, 0);

    return d.promise;

}]);




/* ------------
   CONTROLLERS
*/
app.controller("DataController", ['$scope', 'DataSimple', function ($scope, DataSimple) {
    'use strict';
    DataSimple.then(function (data) {
        $scope.data = data;
    });
}]);
