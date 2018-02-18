(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('eventCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        

        function getEventData(){
            $http.get('/events/:eventId').then(function(response){
                $scope.artists = response.data ? response.data.artists : [];
                $scope.totalArtists = response.data ? response.data.totalArtists : 0;
            }, function(err){
                console.log(err)
            })
        }

        

       

        function init(){
            getEventData();
        }
        
        init()
    }])
})(window, window.angular)