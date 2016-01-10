/**
 * @fileOverview
 * baseSearchModel.js
 * Base model for search.
 */

(function (ng, app) {
    'use strict';

    app.factory('common.search.BaseModel',
        [
            '$q',
            'utilsService',
            'notificationService',
            function ($q, utils, notification) {

                //
                // Constructor.
                // service - Service with search function.
                // pageSize - Size of results page.
                function BaseSearchModel(service, pageSize) {
                    if (utils.isUndefinedOrNull(service)) {
                        throw new Error("Service object is undefined.");
                    }
                    this.service = service;
                    this.query = "";
                    this.pageIndex = 0;
                    this.pageSize = pageSize || 10;
                    this.isBusy = false;
                    this.isNothing = true;
                    this.results = {};
                }

                BaseSearchModel.prototype = {
                    //
                    // Search function.
                    search: function (successFn, errorFn, finallyFn, isNewResults) {
                        var self = this;
                        var deferred = $q.defer();

                        if (utils.isUndefinedOrNull(self.service.search)){
                            throw "'search' function in service object is undefined.";
                        }
                        
                        var successFn = successFn || self.defaultSuccessFn.bind(self);
                        var errorFn = errorFn || self.defaultErrorFn.bind(self);
                        var finallyFn = finallyFn || self.defaultFinallyFn.bind(self);
                        if (isNewResults) {
                            self.results = {};
                        }

                        self.isBusy = true;
                        self.isNothing = true;
                        self.service.search(self.query, self.pageIndex, self.pageSize).then(
                                function (data) {
                                    successFn.call(null, data)
                                    deferred.resolve();
                                },
                                function (response) {
                                    errorFn.call(null, response)
                                    deferred.reject();
                                }
                            ).finally(finallyFn.call());

                        return deferred.promise;
                    },
                    //
                    // Default success function.
                    defaultSuccessFn: function (data) {
                        var self = this;
                        if (utils.isUndefinedOrNull(data) ||
                            data.error == true) {
                            self.results = {};
                            self.isNothing = true;
                        } else {
                            self.isNothing = false;
                            self.results = data;
                            // Обработка Circular References ($ref<->obj)
                            utils.resolveReferences(self.results);
                        }
                    },
                    //
                    // Default error function.
                    defaultErrorFn: function (response) {
                        var self = this;
                        notification.error("Search error: " + response.status);
                    },
                    //
                    // Default finally function.
                    defaultFinallyFn: function () {
                        var self = this;
                        self.isBusy = false;
                    }
                };

                return BaseSearchModel;
            }]);
})(angular, fitotrack);