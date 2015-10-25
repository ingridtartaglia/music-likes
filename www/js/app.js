(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.5&appId=644508019025673";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

angular.module('starter', ['ionic'])

.run(['$rootScope', '$window', 'srvAuth',
function($rootScope, $window, sAuth) {
    $rootScope.user = {};
    $window.fbAsyncInit = function() {
        FB.init({
            appId: "644508019025673",
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4',
        });
        sAuth.watchLoginChange();
    };
}])

.factory('srvAuth', ['$rootScope', function($rootScope){
    return {
        watchLoginChange: function() {
            var _self = this;
            FB.Event.subscribe('auth.authResponseChange', function(res) {
                if (res.status === 'connected') {
                    _self.getUserInfo();
                }
            });
        },
        getUserInfo: function() {
            var _self = this;
            FB.api('/me', function(res) {
                $rootScope.$apply(function() {
                    $rootScope.user = _self.user = res;
                    if ($rootScope.user) {
                        _self.getUserMusic();
                    }
                });
            });
        },
        getUserMusic: function(){
            FB.api(
                "/" + $rootScope.user.id + "/music",
                function (response) {
                    $rootScope.$apply(function() {
                        if (response && !response.error) {
                            $rootScope.user.likes = response;
                        }
                    });
                }
            );
        },
        logout: function() {
            var _self = this;
            FB.logout(function(response) {
                $rootScope.$apply(function() {
                    $rootScope.user = _self.user = {};
                });
            });
        },
    }

}])
