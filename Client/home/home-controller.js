(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('homeCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        $scope.artists =[]
        $scope.popularEvents = []
        $scope.preSales = []
        $scope.queuedEvent = {}

        $scope.userLoggedIn = userSvc.isLoggedIn;

        function getArtists(){
            $http.get('/artists/get-popular-artists').then(function(response){
                $scope.artists = response.data ? response.data.artists : [];
            }, function(err){
                console.log(err)
            })
        }

        function getPopularEvents(){
            $http.get('/events/get-popular-events').then(function(response){
                $scope.popularEvents = response.data ? response.data.popularEvents : [];
            }, function(err){
                console.log(err)
            })
        }

        $scope.queueForPurchase = function(eventID)
        {
            $scope.queuedEvent.eventID = eventID
            $http.post('/events/queue-event/', $scope.queuedEvent).then(function(response){
                console.log('sent to queue')
                init()
            }, function(err){
                console.log(err)
            })
        }

        function init(){
            getArtists();
            getPopularEvents();
        }
        
        init()
    }])
})(window, window.angular)