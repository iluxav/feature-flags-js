var ffDemoApp = angular.module('ffDemoApp', ['ng-ff']);

ffDemoApp.controller('mainCtrl', function ($scope, ffService) {
    $scope.allData=function(){
       return ffService.getData();
    };

    $scope.isRegister = function () {
        return  ffService.flags('register,auth');
    };
    $scope.login = function () {
        return  ffService.flags('auth.login');
    };

    $scope.set = function () {
        var val = ffService.flags('register');
        val == true ? ffService.disable('register') : ffService.enable('register')
    };
});