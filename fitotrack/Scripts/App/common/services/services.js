
/**
 * @fileOverview
 * services.js
 * Shared services for App.
 */

(function (ng, app, toastr) {
    'use strict';

    // 
    // Service for invoking toastr notifications
    app.service('notificationService', function () {

        toastr.options.timeOut = 3000; // 2 second toast timeout
        toastr.options.positionClass = 'toast-top-right';

        var logger = {
            error: error,
            info: info,
            success: success,
            warning: warning,
            log: log // straight to console; bypass toast
        };

        function error(message, title) {
            toastr.error(message, title);
            log("Error: " + message);
        }
        function info(message, title) {
            toastr.info(message, title);
            log("Info: " + message);
        }
        function success(message, title) {
            toastr.success(message, title);
            log("Success: " + message);
        }
        function warning(message, title) {
            toastr.warning(message, title);
            log("Warning: " + message);
        }

        // IE and google chrome workaround
        // http://code.google.com/p/chromium/issues/detail?id=48662
        function log() {
            var console = window.console;
            !!console && console.log && console.log.apply && console.log.apply(console, arguments);
        }

        return logger;
    });

    //
    // Internal Utils
    app.factory('utilsService', 
        [
            '_', 
            function (_) {
                var service = {
                    // Check if object is undefined or null.
                    isUndefinedOrNull: function (obj) {
                        return !ng.isDefined(obj) || obj === null || obj === "null";
                    },
                    // Check if object is undefined, null or NaN.
                    isUndefinedOrNullOrNaN: function (obj) {
                        return !ng.isDefined(obj) || obj === null || obj === "null" || isNaN(obj);
                    },
                    // Copy only existing in destination object properties from source.
                    copyOnlyExisting: function (src, dest) {
                        if (src !== null && typeof src === 'object') {
                            _.extend(dest, _(src).pick(_(dest).keys()));
                        }
                    },
                    // Round number to specified digits after dot.
                    roundNumber: function (number, digits) {
                        var multiple = Math.pow(10, digits);
                        var rndedNum = Math.round(number * multiple) / multiple;
                        return rndedNum;
                    },
                    // Resolve references properties.
                    resolveReferences: function (json) {
                        if (typeof json === 'string') {
                            json = JSON.parse(json);
                        }
                        var byid = {}, // all objects by id
                            refs = []; // references to objects that could not be resolved
                        json = (function recurse(obj, prop, parent) {
                            if (typeof obj !== 'object' || !obj) { // a primitive value
                                return obj;
                            }
                            if (Object.prototype.toString.call(obj) === '[object Array]') {
                                for (var i = 0; i < obj.length; i++) {
                                    if ("$ref" in obj[i]) {
                                        obj[i] = recurse(obj[i], i, obj);
                                    } else {
                                        obj[i] = recurse(obj[i], prop, obj);
                                    }
                                }
                                return obj;
                            }
                            if ("$ref" in obj) { // a reference
                                var ref = obj.$ref;
                                if (ref in byid)
                                    return byid[ref];
                                // else we have to make it lazy:
                                refs.push([parent, prop, ref]);
                                return;
                            } else if ("$id" in obj) {
                                var id = obj.$id;
                                delete obj.$id;
                                if ("$values" in obj) // an array
                                    obj = obj.$values.map(recurse);
                                else // a plain object
                                    for (var prop in obj)
                                        obj[prop] = recurse(obj[prop], prop, obj);
                                byid[id] = obj;
                            }
                            return obj;
                        })(json); // run it!

                        for (var i = 0; i < refs.length; i++) { // resolve previously unknown references
                            var ref = refs[i];
                            ref[0][ref[1]] = byid[ref[2]];
                            // Notice that this throws if you put in a reference at top-level
                        }
                        return json;
                    }
                };
                return service;
            }
        ]);

    //
    // Service for communication with server
    app.factory('communicationService', 
        [
            "$q",
            "utilsService",
            "notificationService",
            function ($q, utils, notification) {
                /// <summary>
                /// Server request wrapper function.
                /// <param name="promiseFn">Request promise object.</param>
                /// <param name="successCallback">Request success callback function.</param>
                /// <param name="successMsg">Success message.</param>
                /// <param name="failedCallback">Request failed callback function.</param>
                /// <param name="failedMsg">Error message.</param>
                /// </summary>
                function request(
                    promiseFn,
                    successCallback,
                    successMsg,
                    failedCallback,
                    failedMsg) {
                    //var self = this;
                    var deferred = $q.defer();

                    if (utils.isUndefinedOrNull(promiseFn)) {
                        throw new Error("Parameter 'promiseFn' must be defined!");
                    }

                    // Make Request
                    $q.when(promiseFn).then(
                        function (data) {
                            // Request success
                            if (!utils.isUndefinedOrNull(data)) {
                                // Circular References Handling ($ref<->obj)
                                utils.resolveReferences(data);

                                if (!utils.isUndefinedOrNull(successCallback)) {
                                    successCallback(data);
                                }
                            }
                            if (!utils.isUndefinedOrNull(successMsg)) {
                                notification.success(successMsg);
                            }
                            deferred.resolve(successMsg);
                        },
                        function (response) {
                            // Request error
                            if (!utils.isUndefinedOrNull(failedCallback)) {
                                failedCallback(response);
                            }
                            if (!utils.isUndefinedOrNull(failedMsg))
                            {
                                notification.error(failedMsg, "Error " + response.status);
                            }
                            deferred.reject(response);
                        });

                    return deferred.promise;
                }

                /// <summary>
                /// Function invoker.
                /// <param name="promiseFn">Promise object to invoke.</param>
                /// <param name="successCallback">Success callback function.</param>
                /// <param name="failedCallback">Failed callback function.</param>
                /// </summary>
                //function invoke(
                //    promiseFn,
                //    successCallback,
                //    failedCallback) {

                //    var deferred = $q.defer();

                //    if (utils.isUndefinedOrNull(promiseFn)) {
                //        throw new Error("Parameter 'promiseFn' must be defined!");
                //    }

                //    // Invoke function
                //    $q.when(promiseFn).then(
                //        function (msg) {
                //            // Success
                //            if (!utils.isUndefinedOrNull(successCallback)) {
                //                successCallback();
                //            }
                //            if (!utils.isUndefinedOrNull(msg)) {
                //                notification.success(msg);
                //            }
                //            deferred.resolve();
                //        },
                //        function (response) {
                //            // Error
                //            if (!utils.isUndefinedOrNull(failedCallback)) {
                //                failedCallback();
                //            }

                //            if (!utils.isUndefinedOrNull(response.msg)) {
                //                if (!utils.isUndefinedOrNull(response.code)) {
                //                    notification.error(response.msg, "Error " + response.code);
                //                }
                //                else {
                //                    notification.error(response.msg);
                //                }
                //            }
                //            deferred.reject();
                //        });

                //    return deferred.promise;
                //}

                return {
                    request: request
                };
            }
        ]);

    //
    // Loading indication service singleton
    app.factory('loadingService', function () {
        var service = {
            // Count of 'in progress' requests
            requestCount: 0,
            isLoading: function () {
                return service.requestCount > 0;
            }
        };
        return service;
    });

    //
    // Reusable loading indication service class
    app.factory('LoadingClass', function () {
        function loadingClass() {
            // Count of 'in progress' requests
            this.requestCount = 0;
        }

        loadingClass.prototype = {
            isLoading: function () {
                var self = this;
                return self.requestCount > 0;
            },
            busy: function () {
                var self = this;
                self.requestCount++;
            },
            done: function () {
                var self = this;
                self.requestCount--;
            }
        };

        return loadingClass;
    });
})(angular, fitotrack, toastr);