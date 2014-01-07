// A placeholder for transforming our request to include
// the currentUser.
var addUserToRequest;
// A wrapper around our transform, that way we can modify
// transformRequest with runtime data.
function addUserToRequestWrapper() {
    return addUserToRequest.apply(this, arguments);
}

angular.module('testApp', ['DeviseModal', 'ui.bootstrap', 'ngRoute']).
    config(function($routeProvider, $httpProvider, AuthProvider) {
    $routeProvider.otherwise({
        controller: 'ctrl',
        template: [
            '<a id="login" ng-click="login()">login</a>',
            '<a id="logout" ng-click="logout()">logout</a>',
            '<a id="request" ng-click="request()">request</a>',
            '<a id="requestRestricted" ng-click="requestRestricted()">requestRestricted</a>',
            '<ol id="responses">',
            '<li ng-repeat="response in responses">{{ response }}</li>',
            '</ol>'
        ].join('&nbsp;&nbsp;&nbsp;')
    });
    // Push our transform function into the first spot in the middleware.
    $httpProvider.defaults.transformRequest.unshift(addUserToRequestWrapper);
    // Our server returns the entire POST data, while devise
    // just returns the user. Compensate for that.
    AuthProvider.parse(function(response) {
        return response.data.user;
    });
}).
    controller('ctrl', function($scope, Auth, $http) {
    // A request counter;
    var reqNum = 0;

    // Make Auth.login() write to our reponses.
    var _login = Auth.login;
    Auth.login = function() {
        return _login.apply(this, arguments).then(set(++reqNum));
    };

    addUserToRequest = function(data) {
        if (!data) { data = {}; }
        // Add current user, unless it is already set (i.e. a login attempt)
        if (!data.user || !Object.keys(data.user).length) { data.user = Auth._currentUser; }
        return data;
    };
    $scope.responses = [];

    function set(num) {
        return function(data) {
            $scope.responses[num - 1] = data;
        };
    }
    function failParse(data) {
        data = parse(data);
        data.fail = true;
        return data;
    }
    function parse(response) {
        return response.data;
    }

    $scope.login = function() {
        Auth._currentUser = {password: 'password'};
    };
    $scope.logout = function() {
        Auth._currentUser = null;
    };
    $scope.request = function() {
        $http.post('/unauth', {reqNum: ++reqNum}).
            then(parse, failParse).then(set(reqNum));
    };
    $scope.requestRestricted = function() {
        $http.post('/auth', {reqNum: ++reqNum}).
            then(parse, failParse).then(set(reqNum));
    };
});

