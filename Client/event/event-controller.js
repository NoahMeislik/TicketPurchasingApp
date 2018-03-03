(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .controller('eventCtrl', ['$scope', '$http', '$state', '$window', 'userSvc', function($scope, $http, $state, $window, userSvc){
        $scope.eventData =[];
        $scope.preSales = [];
        $scope.publicSales = [];
        $scope.purchaseData = {};
        $scope.purchased = true;

        // Recieves data from API endpoint and interprets it
        function getEventData(){
            var requestUrl = `/events/get-event-by-id?eventId=${$state.params.eventID}`
            $http.get(requestUrl).then(function(response){
                $scope.eventData = response.data.event;

                // Sets the date and times for any presales
                if($scope.eventData.sales[0][0].presales){
                    $scope.preSales = $scope.eventData.sales[0][0].presales;
                    for (var i=0; i < $scope.preSales.length; i++){
                        $scope.preSales[i].startDateTime = moment($scope.preSales[i].startDateTime).format("dddd, MMMM D YYYY hh:mma Z");
                        $scope.preSales[i].endDateTime = moment($scope.preSales[i].endDateTime).format("dddd, MMMM D YYYY hh:mma Z");
                    }
                };
                // Sets the dates and times for the onsale start time and end
                $scope.publicSales = $scope.eventData.sales[0][0].public;
                $scope.publicSales.startDateTime = moment($scope.publicSales.startDateTime).format("dddd, MMMM D YYYY hh:mma Z");
                $scope.publicSales.endDateTime = moment($scope.publicSales.endDateTime).format("dddd, MMMM D YYYY hh:mma Z");

                // Sets the dates and Times for the event start and end
                $scope.eventData.startDateTime = moment($scope.eventData.StartDateTime).format("dddd, MMMM D YYYY hh:mma Z");
                $scope.eventData.endDateTime = moment($scope.eventData.endDateTime).format("dddd, MMMM D YYYY hh:mma Z");

                if(response.data.purchased){
                    $scope.purchased = !$scope.purchased
                }
            }, function(err){
                console.log(err)
            })
        }

       $scope.purchaseTicket = function(){
           var postUrl = '/events/purchase-event'
           $scope.purchaseData.eventId = $scope.eventData.eventId
           $http.post(postUrl, $scope.purchaseData).then(function(response){
               console.log("Sent purchase data to DB")
           })
       }

        function init(){
            getEventData();
        }
        
        init()
    }])
})(window, window.angular)