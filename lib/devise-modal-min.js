// AngularDeviseModal
// -------------------
// v0.2.1
//
// Copyright (c)2014 Justin Ridgewell
// Distributed under MIT license
//
// https://github.com/cloudspace/angular_devise_modal

"use strict";!function(a){var b=a.module("DeviseModal",["Devise","ui.bootstrap"]);b.run(["$modal","$http","Auth","$rootScope",function(a,b,c,d){function e(){g=null}function f(a,b){return function(){return a.call(this,b)}}var g=null;d.$on("devise:unauthorized",function(d,h,i){function j(){return g.then(function(){return b(h.config)}).then(i.resolve,f(i.reject,h))}g||(g=a.open({templateUrl:"deviseModal.html",controller:function(a,b){var c=a.user={};a.login=function(){b.close(c)},a.dismiss=function(){b.dismiss("cancel")}}}).result["finally"](e).then(c.login)),j()})}]),b.run(["$templateCache",function(a){a.put("deviseModal.html",'<div id=loginModal><div class=modal-header><button type=button class=close ng-click=dismiss()>x</button><h3>Have an Account?</h3></div><div class=modal-body><div class=well><form name=loginForm><div class=form-group ng-class="{\'has-error\': emailError}"><label class=control-label>Email</label><input type=email name=email class=form-control ng-model=user.email required=required ng-blur="emailError = !!loginForm.email.$error.email" ng-focus="emailError = false"></div><div class=form-group><label class=control-label for=password>Password</label><input type=password name=password class=form-control ng-model=user.password required=required></div><button class="btn btn-primary" ng-click=login()>Login</button></form></div></div></div>')}])}(angular);