(function(window, angular){
    angular.module('ticketPriceInterpreter', ['ui.router'])

    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/home/home.html',
            controller: 'homeCtrl'
        })

        // $httpProvider.interceptors.push('interceptorFactory');




    }])
})(window, window.angular)