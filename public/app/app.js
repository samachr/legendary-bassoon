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
        }).when('/registration', {
            templateUrl: '../template/html/registration.html',
            controller: 'registration'
        }).when('/finished', {
            templateUrl: '../template/html/thanksButNo.html',
            controller: 'thanksButNo'
        }).when('/dashboard', {
            templateUrl: '../template/html/dashboard.html',
            controller: 'dashboard'
        });
    }
]);
