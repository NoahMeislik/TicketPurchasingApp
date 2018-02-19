(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('eventCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        $scope.eventData =[];
        $scope.startDateTime = [];
        $scope.endDateTime = [];

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

        function getDates() {
            $scope.startDateTime = moment($scope.eventData.StartDateTime).format("dddd, MMMM D YYYY hh:mma Z");
            $scope.endDateTime = moment($scope.eventData.endDateTime).format("dddd, MMMM D YYYY hh:mma Z");
            console.log($scope.startDateTime)
        }

        // function getPresales() {
        //     // check if there are presales
        //     if ($scope.eventData.sales[0][0].presales)
        //     {
        //         var presales = $scope.eventData.sales[0].presales;
        //         for (var i = 0; i < presales.length; i++) {
        //             console.log(presales[i]);
        //         }
        //     }
        // }
       

        function init(){
            getEventData();
            getDates();
            // getPresales();
        }
        
        init()
    }])
})(window, window.angular)