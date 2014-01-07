AngularDeviseModal [![Build Status](https://travis-ci.org/cloudspace/angular_devise_modal.png)](http://travis-ci.org/cloudspace/angular_devise_modal)
=============

A small AngularJS module to seamlessly authenticate users when accessing
restricted data.


Dependencies
------------

This module depends on
[AngularDevise](https://github.com/cloudspace/angular_devise) and [UI
Bootstrap](https://github.com/angular-ui/bootstrap).


Downloading
-----------

AngularDeviseModal is registered as `angular-devise-modal` in
[bower](http://sindresorhus.com/bower-components/#!/search/angular-devise-modal).

```bash
bower install --save angular-devise-modal
```

You can then use the main file at
`angular-devise-modal/lib/devise-modal-min.js`.


Usage
-----

Just register `DeviseModal` as a dependency for your module.

Then, if a `401 Unauthorized` response is received, a modal will pop up
asking for the user's login credentials. After the user logs in, the
original request will be retried and will be fulfilled with the retry's
promise. If the user decides to dismiss the modal, the original request
will be rejected with its response.

If multiple requests cause a 401, all the requests will be queued using
a single modal. Once the user logs in, all the queued requests will
retried and resolved, or rejected with their responses.


Configuration
-------------

By default, the modal only asks for and email and password. This can be
changed by manually specifying the partial template used to render the
modal. The only requirements are:
 1. Any needed form elements be namespaced under `user`
 2. The login button calls the `login()` function.
 3. The dismiss button calls the `dismiss()` function.

```html
<script type="text/ng-template" id="deviseModal.html">
    <div class="" id="loginModal">
        <div class="modal-header">
            <button type="button" class="close" ng-click="dismiss()">x</button>
            <h3>Have an Account?</h3>
        </div>
        <div class="modal-body">
            <div class="well">
                <form name="loginForm">
                    <div class="form-group" ng-class="{'has-error': emailError}">
                        <label class="control-label">Email</label>
                        <input type="email" name="email" class="form-control"
                        ng-model="user.email" required="required"  ng-blur="emailError = !!loginForm.email.$error.email"
                        ng-focus="emailError = false" />
                    </div>

                    <div class="form-group">
                        <label class="control-label" for="password">Password</label>
                        <input type="password" name="password" class="form-control" ng-model="user.password" required="required" />
                    </div>

                    <button class="btn btn-primary" ng-click="login()">Login</button>
                </form>
            </div>
        </div>
    </div>
</script>
```

**OR**

```javascript
angular.module('DeviseModal').
    run(function($templateCache) {
        $templateCache.put('deviseModal.html', '<div>Modal Template</div>');
    });
```

Credits
-------

[![Cloudspace](http://cloudspace.com/assets/images/logo.png)](http://cloudspace.com/)

AngularDevise is maintained by [Cloudspace](http://cloudspace.com/), and
is distributed under the [MIT License](/LICENSE.md).
