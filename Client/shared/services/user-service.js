(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .service('userSvc', [function(){
        var self = this;
        self.isLoggedIn = false;
        self.user = {};

        self.checkLoggedIn = function(){
            var user = self.parseJson(localStorage.getItem('ticketPriceInterpreter-user'));

            if(user){
                self.isLoggedIn = true;
                self.user = user;
            }
        }
        self.parseJson = function(data) {
            try {
                return JSON.parse(data)
            } catch (error) {
                return null;
            }
        }



        self.checkLoggedIn();
    }])
})(window, window.angular)