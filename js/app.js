'use strict';

angular.module('criticalPath', [
     // Dépendances du "module"
     'ngRoute',
 ]).config(['$routeProvider',
    function($routeProvider) {
        // Système de routage
        $routeProvider
            .when('/home', {
                templateUrl: 'index.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
]);















