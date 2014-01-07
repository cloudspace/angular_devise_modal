'use strict';

describe('DeviseModal', function () {

    function login() {
        element('#login').click();
    }
    function logout() {
        element('#logout').click();
    }
    function request() {
        element('#request').click();
    }
    function requestRestricted() {
        element('#requestRestricted').click();
    }
    function submit() {
        element('.btn-primary').click();
    }
    function dismiss() {
        element('.close').click();
    }
    function response(num) {
        var selector = '#responses';
        if (num) {
            selector += ' li:nth-child(' + num + ')';
        }
        return element(selector).text();
    }
    function json(data) {
        return JSON.stringify(data);
    }
    // instantiate service
    beforeEach(function() {
        browser().navigateTo('/');
    });

    describe('when unauthorized', function() {
        beforeEach(logout);

        describe('when requesting auth restricted data', function() {
            beforeEach(requestRestricted);

            it('pops up modal', function() {
                expect(element('#loginModal').count()).toBe(1);
            });

            it('allows me to authenticate with email', function() {
                var user = {email: 'test@test.com'};
                input('user.email').enter(user.email);
                submit();
                expect(response(2)).toEqual(json(user));
            });

            it('allows me to authenticate with password', function() {
                var user = {password: 'testtest'};
                input('user.password').enter(user.password);
                submit();
                expect(response(2)).toEqual(json(user));
            });

            it('retries a request after login', function() {
                var user = {email: 'test@test.com', password: 'testtest'};
                input('user.email').enter(user.email);
                input('user.password').enter(user.password);
                submit();
                expect(response(1)).toEqual(json({reqNum: 1, user: user}));
            });

            it('rejects request promise on dismiss', function() {
                dismiss();
                expect(response(1)).toEqual(json({reqNum: 1, user: null, fail: true}));
            });

            describe('when multiple requests are made', function() {
                it('resolves all requests', function() {
                    requestRestricted();
                    var user = {email: 'test@test.com', password: 'testtest'};
                    input('user.email').enter(user.email);
                    input('user.password').enter(user.password);
                    submit();
                    expect(response(1)).toEqual(json({reqNum: 1, user: user}));
                    expect(response(2)).toEqual(json({reqNum: 2, user: user}));
                });

                it('rejects all requests on dismiss', function() {
                    requestRestricted();
                    dismiss();
                    expect(response(1)).toEqual(json({reqNum: 1, user: null, fail: true}));
                    expect(response(2)).toEqual(json({reqNum: 2, user: null, fail: true}));
                });
            });

            describe('fails login', function() {
                beforeEach(function() {
                    input('user.email').enter('bademail');
                    submit();
                });
                it('pops up modal again', function() {
                    expect(element('#loginModal').count()).toBe(1);
                });

                it('resolves original request after successful login', function() {
                    var user = {email: 'test@test.com'};
                    input('user.email').enter(user.email);
                    submit();
                    expect(response(1)).toEqual(json({reqNum: 1, user: user}));
                });
            });

        });

        describe('when requesting data', function() {
            beforeEach(request);

            it('does not pop up modal', function() {
                expect(element('#loginModal').count()).toBe(0);
            });
        });
    });

    describe('when authorized', function() {
        beforeEach(login);
        describe('when requesting auth restricted data', function() {
            beforeEach(requestRestricted);

            it('does not pop up modal', function() {
                expect(element('#loginModal').count()).toBe(0);
            });
        });

        describe('when requesting data', function() {
            beforeEach(request);

            it('does not pop up modal', function() {
                expect(element('#loginModal').count()).toBe(0);
            });
        });
    });


});
