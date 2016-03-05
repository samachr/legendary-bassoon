'use strict';

/* App Module */

var lbApp = angular.module('lbApp', [
  'ngRoute',
  'lbControllers'
]);

lbApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/juror-login.html',
        controller: 'loginCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
