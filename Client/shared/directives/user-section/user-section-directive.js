(function(window, angular){
    angular.module('ticketPriceInterpreter')
    .directive('userSection', ['$http', 'userSvc', function($http, userSvc){
        return {
            restrict: "E",
            templateUrl: "/shared/directives/user-section/user-section.html",
            link: function(scope, elem, attrs){
                scope.isLoggedIn = userSvc.isLoggedIn;
                scope.error = '';
                scope.loginUser = {};
                scope.signupUser = {};
                scope.formState = 'login';
                scope.user = userSvc.user.username;

                scope.changeFormState = function(state){
                    scope.formState = state;
                }

                scope.logUserIn = function(isValid){
                    console.log(isValid, scope.loginUser, 'here')
                    $http.post("/user/login-user/", scope.loginUser).then(function(response) {
                        const data = response.data;
                        const status = response.status;
                        if (status !== 200) {
                            // there's an error
                            scope.error = data;

                        } else {
                            // request was successful
                            localStorage.setItem('ticketPriceInterpreter-user', JSON.stringify(response.data.user));
                            localStorage.setItem('ticketPriceInterpreter-token', JSON.stringify(response.data.token));
                            userSvc.isLoggedIn = true;
                            userSvc.user = response.data.user;
                            scope.isLoggedIn = true;
                            window.location.reload();
                        }
                        console.log(data, status, 'data');
                    })
                    // if(!isValid){
                    //     return;
                    // }

                    $http.post('/user/login-user', scope.loginUser)
                    .then(function(response){
                        

                    }).catch(function(error) {
                        console.log(error)
                    })

                }
                scope.logUserOut = function(){
                    scope.isLoggedIn = false;

                    localStorage['ticketPriceInterpreter-token'] = undefined;
                    localStorage.clear();
                    scope.changeFormState('login');
                    window.location.reload();
                        
                }
            }
        }
    }])
})(window, window.angular)