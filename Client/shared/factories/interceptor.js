(function(window, window){
    angular.module('ticketPriceInterpreter')
    .factory('interceptorFactory', [function(){
        return {
            request: function(config){
                var token = localStorage['ticketPriceInterpreter-token'];
                if(token){
                    config.headers['token'] = JSON.parse(token);
                }
                return config;
            },
            requestError: function(config){
                return config;
            },
            response: function(res){
                return res;
            },
            responseError: function(res){
                return res;
            }
        }
    }])

})(window, window.angular)