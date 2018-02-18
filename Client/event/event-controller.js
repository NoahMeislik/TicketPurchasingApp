(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('eventCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        $scope.eventData =[];

        function getEventData(){
            var requestUrl = `/events/get-event-by-id?eventId=${$state.params.eventID}`
            console.log(requestUrl)
            $http.get(requestUrl).then(function(response){
                $scope.eventData = response.data.event;
                console.log($scope.eventData);
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