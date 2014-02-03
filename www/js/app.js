/*global angular */

var app = angular.module("webapp", ['ngRoute','ngAnimate','infinite-scroll']);

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

app.directive("lastItem", ['$log', function ($log) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, elm, attr) {
            $log.log("Last item pos: ", elm. offsetTop);
        }
    };
}]);



/* ------------
   FACTORY/SERVICE
*/
app.factory("DataSimple", ['$q', '$timeout', '$log', function ($q, $timeout, $log) {
    'use strict';
    
    var page_size = 20;
    
    return function (page_no) {
        var d = $q.defer(),
            page_no = page_no || 1,
            start_num = (page_no - 1) * page_size + 1,
            end_num = page_no * page_size; 

        $timeout(function () {
            var result = [], i;
            for (i = start_num; i <= end_num; i += 1) {
                result.push("Entry number " + i);
            }
            $log.log("Loading page " + page_no + ", from " + start_num + " to " + end_num);
            d.resolve(result);
        }, 500);
    
        return d.promise;
    }
    
}]);




/* ------------
   CONTROLLERS
*/
app.controller("DataController", ['$scope', 'DataSimple', '$log', function ($scope, DataSimple, $log) {
    'use strict';
    var page_no = 0;
    $scope.data = [];

    $scope.loadMore = function () {
        page_no += 1;
        DataSimple(page_no).then(function (data) {
            Array.prototype.push.apply($scope.data, data);
        });
    };
    
    $scope.loadMore();
    
    /**
     * Scrollbar related.  Move to directive later
     */
    var m_over, m_down;
    $scope.showScrollBar = false;
    
    function DisplayScrollbar() {
        if (m_over) {
            if (!$scope.showScrollBar) {
                $scope.showScrollBar = true;
            }
        } else {
            if (!m_down) {
                if ($scope.showScrollBar) {
                    $scope.showScrollBar = false;
                }
            }
        }
    }
    
    $scope.trigger_m_down = function (is_m_down) {
        //$log.log("trigger_m_down: ", is_m_down);
        m_down = is_m_down;
        DisplayScrollbar();
    };
    
    $scope.trigger_m_over = function (is_m_over) {
        //$log.log("trigger_m_over: ", is_m_over);
        m_over = is_m_over;
        DisplayScrollbar();
    };
    
    function documentMouseListener(event) {
        //console.log("document mouseup");
        if (m_down) {
            m_down = false;
            $scope.$apply(function () {
                DisplayScrollbar();
            });
        }
    };
    
    document.documentElement.addEventListener('mouseup', documentMouseListener);
    $scope.$on("$destroy", function () {
        document.documentElement.removeEventListener('mouseup', documentMouseListener);
    });
    
}]);
