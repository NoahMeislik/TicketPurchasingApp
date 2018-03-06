(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('homeCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        $scope.artists =[]
        $scope.popularEvents = []
        $scope.statistics = {}
        $scope.totalArtists = 0
        $scope.totalEvents = 0
        $scope.totalQueuedEvents = 0
        $scope.totalPurchasedEvents = 0;
        $scope.queuedEvent = {};
        $scope.purchasedEvents = []
        $scope.isAdmin = userSvc.isAdmin
        $scope.userLoggedIn = userSvc.isLoggedIn;
        console.log(userSvc['isAdmin']);

        function getArtists(){
            
            $http.get('/artists/get-popular-artists').then(function(response){
                $scope.artists = response.data ? response.data.artists : [];
                $scope.totalArtists = response.data ? response.data.totalArtists : 0;
            }, function(err){
                console.log(err)
            })
        }

        function getPopularEvents(){
            $http.get('/events/get-popular-events').then(function(response){
                $scope.popularEvents = response.data ? response.data.popularEvents : [];
                $scope.totalEvents = response.data ? response.data.totalEvents : 0;

            }, function(err){
                console.log(err)
            })
        }

        function getStatistics(){
            $http.get('/statistics/get-profit').then(function(response){
                $scope.statistics.profit = response.data ? response.data.profit : {};
            }, function(err){
                console.log(err)
            })
        }



        function getQueuedEvents(){
            $http.get('/events/get-queued-events').then(function(response){
                $scope.queuedEvents = response.data ? response.data.queuedEvents : [];
                $scope.totalQueuedEvents = response.data ? response.data.totalQueuedEvents : 0;
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
                $state.reload();
            }, function(err){
                console.log(err)
            })
        }

        function getPurchasedEvents(){
            $http.get('/purchase/get-purchased-events').then(function(response){
                $scope.purchasedEvents = response.data ? response.data.purchasedEvents : [];
                $scope.totalPurchasedEvents = response.data ? response.data.totalPurchasedEvents : 0;
            }, function(err){
                console.log(err);
            })
        }

        $scope.goToEvent = function(eventId) {
            $state.go('event', {eventID: eventId})
        }



        function init(){
            getArtists();
            getPopularEvents();
            getQueuedEvents();
            getPurchasedEvents();
            getStatistics();
        }
        
        init()
    }])
})(window, window.angular)