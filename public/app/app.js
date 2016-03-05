var lb = angular.module("lb",[
    'ngRoute'
]);

lb.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: '../template/html/juror-login.html',
            controller: 'loginVerification'
        }).when('/prescreen', {
            templateUrl: '../template/html/prescreen.html',
            controller: 'prescreen'
        });
    }
]);
