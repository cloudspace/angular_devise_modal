deviseModal.run(function($modal, $http, Auth, $rootScope) {
    var promise = null;

    // A helper function to reset
    // the reference to the modal's
    // promise.
    function reset() {
        promise = null;
    }

    // A simplified partial function.
    // Only partials the one param passed to it.
    function partial(fn, arg) {
        return function() {
            return fn.call(this, arg);
        };
    }


    // Listen for the 'devise:unauthorized' event, so we can recover from it.
    $rootScope.$on('devise:unauthorized', function(event, response, deferred) {
        function retryRequestAfterLogin() {
            return promise.then(function() {
                // After the user logs in successfully,
                // retry the request
                return $http(response.config);
            }).then(deferred.resolve, partial(deferred.reject, response));
        }

        // If we have already opened the modal,
        // just register this request with its promise.
        if (!promise) {
            // Save a reference to the modal's promise.
            // The promise will clean up the reference after
            // it the modal closes, and will attempt to login
            // the user. Chaining onto this promise will then
            // run after the user logs in.
            promise = $modal.open({
                templateUrl: 'deviseModal.html',
                controller: function ($scope, $modalInstance) {
                    var user = $scope.user = {};
                    $scope.login = function () {
                        $modalInstance.close(user);
                    };

                    $scope.dismiss = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }).result['finally'](reset).then(Auth.login);
        }

        retryRequestAfterLogin();
    });
});
