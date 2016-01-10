
;
;
/*! main.js */
;
;
var InVision = angular.module("InVision", ["ngResource", "ui"]);
(function (ng, app) {
    app.config(
    function ($routeProvider) {
        /** @ngInject */
        var routes = [
        {
            resource: "/loading",
            action: "loading"
        },
        {
            resource: "/dashboard",
            action: "standard.dashboard.default"
        },
        {
            resource: "/dashboard/intro",
            action: "standard.dashboard.intro"
        },
        {
            resource: "/activity",
            action: "standard.activity.default"
        },
        {
            resource: "/activity/intro",
            action: "standard.activity.intro"
        },
        {
            resource: "/new-features",
            action: "standard.new-features.default"
        },
        {
            resource: "/team",
            action: "standard.team.list"
        },
        {
            resource: "/team/:userID/activity",
            action: "standard.team.detail.activity"
        },
        {
            resource: "/team/:userID/profile",
            action: "standard.team.detail.profile"
        },
        {
            resource: "/team/:userID/account",
            action: "standard.team.detail.account"
        },
        {
            resource: "/team/:userID/notifications",
            action: "standard.team.detail.notifications"
        },
        {
            resource: "/resources",
            action: "standard.resources"
        },
        {
            resource: "/projects/:projectID",
            action: "standard.project.detail"
        },
        {
            resource: "/projects/:projectID/screens",
            action: "standard.project.detail.screens.list"
        },
        {
            resource: "/projects/:projectID/assets",
            action: "standard.project.detail.assets"
        },
        {
            resource: "/projects/:projectID/comments/:readFilter/:statusFilter/:typeFilter",
            action: "standard.project.detail.comments"
        },
        {
            resource: "/projects/:projectID/comments",
            action: "standard.project.detail.comments"
        },
        {
            resource: "/projects/:projectID/screens/archive",
            action: "standard.project.detail.screens.archive"
        },
        {
            resource: "/projects",
            action: "standard.projects"
        },
        {
            resource: "/projects/activate/:id",
            action: "standard.projects.activate"
        },
        {
            resource: "/projects/:projectID/activity",
            action: "standard.project.detail.activity"
        },
        /*
        {
        resource: "/projects/:projectID/apps",
        action: "standard.project.detail.apps"
        },
        */
        {
            resource: "/console/:projectID/:screenID/preview",
            action: "console.preview"
        },
        {
            resource: "/console/:projectID/:screenID/build",
            action: "console.build"
        },
        {
            resource: "/console/:projectID/:screenID/comments",
            action: "console.comments"
        },
        {
            resource: "/console/:projectID/:screenID/comments/:commentID",
            action: "console.comments"
        },
        {
            resource: "/console/:projectID/:screenID/history",
            action: "console.history"
        },
        {
            resource: "/console/:projectID/:screenID/comments/:commentID/sketch/",
            action: "console.comments.sketch"
        },
        {
            resource: "/console/:projectID/:screenID/comments/:commentID/sketch/:sketchID",
            action: "console.comments.sketch"
        }
        ];
        angular.forEach(
        routes,
        function (route, index, collection) {
            $routeProvider.when(
            route.resource,
            {
                resource: route.resource,
                action: route.action
            }
            );
        }
        );
        $routeProvider.otherwise(
        {
            redirectTo: "/activity"
        }
        );
    }
    );
    app.config(
    function ($httpProvider) {
        /** @ngInject */
        var httpInterceptorFor401Response = function ($window, $q) {
            var interceptor = function (request) {
                var interceptedResponse = request.then(
                function () {
                    return (request);
                },
                function (httpResponse) {
                    if (httpResponse.status === 401) {
                        $window.setTimeout(
                        function () {
                            $window.location.href = "./";
                        },
                        100
                        );
                        return ($q.defer().promise);
                    }
                    return (request);
                }
                );
                return (interceptedResponse);
            };
            return (interceptor);
        };
        var httpInterceptorForHttpActivityTracking = function (httpActivityService) {
            var interceptor = function (request) {
                request.then(
                function (httpResponse) {
                    var isPostRequest = (httpResponse.config.method !== "GET");
                    var isBlacklisted = (httpResponse.config.data && ("X-Do-Not-Track-As-Post" in httpResponse.config.data));
                    var trackAsPost = (isPostRequest && !isBlacklisted);
                    httpActivityService.requestCompleted(trackAsPost);
                },
                function (httpResponse) {
                    var isPostRequest = (httpResponse.config.method !== "GET");
                    var isBlacklisted = (httpResponse.config.data && ("X-Do-Not-Track-As-Post" in httpResponse.config.data));
                    var trackAsPost = (isPostRequest && !isBlacklisted);
                    httpActivityService.requestCompleted(trackAsPost);
                }
                );
                return (request);
            };
            return (interceptor);
        };
        $httpProvider.responseInterceptors.push(httpInterceptorFor401Response);
        $httpProvider.responseInterceptors.push(httpInterceptorForHttpActivityTracking);
    }
    );
    app.provider(
    "$exceptionHandler",
    {
        $get: function (errorLogService) {
            /** @ngInject */
            return (errorLogService.exceptionHandler);
        }
    }
    );
    app.run(
    function ($http, httpActivityService) {
        /** @ngInject */
        function startInterceptor(data, getHeaders) {
            var isPostRequest = ("Content-Type" in getHeaders());
            var isBlacklisted = (ng.isString(data) && (data.indexOf("X-Do-Not-Track-As-Post") != -1));
            var trackAsPost = (isPostRequest && !isBlacklisted);
            httpActivityService.requestStarted(trackAsPost);
            return (data);
        }
        function addTimezoneOffsetHeader(data, getHeaders) {
            var headers = getHeaders();
            var now = new Date();
            if (now.getTimezoneOffset) {
                headers["X-Timezone-Offset"] = -now.getTimezoneOffset();
            }
            return (data);
        }
        $http.defaults.transformRequest.push(startInterceptor);
        $http.defaults.transformRequest.push(addTimezoneOffsetHeader);
    }
    );
})(angular, InVision);
;
;
/*! debouncer.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("Debouncer", DebouncerFactory);
    /** @ngInject */
    function DebouncerFactory(_) {
        var Debouncer = function (duration) {
            function canProceed() {
                var now = new Date();
                if (!lastInvokedAt) {
                    lastInvokedAt = now;
                    return (true);
                }
                if (isTooSoon(lastInvokedAt, now, duration)) {
                    lastInvokedAt = now;
                    return (false);
                } else {
                    lastInvokedAt = now;
                    return (true);
                }
            }
            function isTooSoon(previousTime, currentTime, duration) {
                var delta = (currentTime.getTime() - previousTime.getTime());
                return (delta < duration);
            }
            if (ng.isUndefined(duration)) {
                throw (new Error("InvalidArgument"));
            }
            var lastInvokedAt = null;
            return ({
                canProceed: canProceed
            });
        };
        Debouncer.ONE_SECOND = (1 * 1000);
        Debouncer.TWO_SECONDS = (2 * 1000);
        Debouncer.THREE_SECONDS = (3 * 1000);
        Debouncer.FOUR_SECONDS = (4 * 1000);
        Debouncer.FIVE_SECONDS = (5 * 1000);
        return (Debouncer);
    }
})(angular, InVision);
;
;
/*! partial-cache.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("PartialCache", PartialCacheFactory);
    /** @ngInject */
    function PartialCacheFactory($window, beforeUnloadService) {
        function PartialCache(name, maxAge) {
            this._name = ("partialCache:" + name);
            this._maxAge = (maxAge || (2 * PartialCache.WEEK));
            this._cache = {};
            try {
                this._supportsLocalStorage = (("localStorage" in $window) && ($window.localStorage !== null));
            } catch (error) {
                this._supportsLocalStorage = false;
            }
            if (this._supportsLocalStorage) {
                var initialData = $window.localStorage.getItem(this._name);
                if (initialData) {
                    this._cache = ng.fromJson(initialData);
                    $window.localStorage.removeItem(this._name);
                    this._clearExpiredEntries();
                }
            }
            beforeUnloadService.push(this, this._save);
            return (this);
        }
        PartialCache.MINUTE = (60 * 1000);
        PartialCache.HOUR = (60 * PartialCache.MINUTE);
        PartialCache.DAY = (24 * PartialCache.HOUR);
        PartialCache.WEEK = (7 * PartialCache.DAY);
        PartialCache.MONTH = (30 * PartialCache.DAY);
        PartialCache.prototype = {
            deleteResponse: function (cacheKey) {
                var localCacheKey = this._getLocalCacheKey(cacheKey);
                if (this._cache[localCacheKey]) {
                    delete (this._cache[localCacheKey]);
                }
            },
            filterResponses: function (comparator, context) {
                context = (context || {});
                var isDirty = false;
                for (var cacheKey in this._cache) {
                    var entry = this._cache[cacheKey];
                    if (
                    this._cache.hasOwnProperty(cacheKey) &&
                    (comparator.call(context, entry.response) !== true) // Check for non-truth.
                    ) {
                        delete (this._cache[cacheKey]);
                        isDirty = true;
                    }
                }
            },
            getResponse: function (cacheKey) {
                var localCacheKey = this._getLocalCacheKey(cacheKey);
                var entry = this._cache[localCacheKey];
                if (!entry) {
                    return (null);
                }
                if (this._isExpired(entry)) {
                    delete (this._cache[localCacheKey]);
                    return (null);
                }
                return (entry.response);
            },
            rejectResponses: function (comparator, context) {
                context = (context || {});
                var isDirty = false;
                for (var cacheKey in this._cache) {
                    var entry = this._cache[cacheKey];
                    if (
                    this._cache.hasOwnProperty(cacheKey) &&
                    (comparator.call(context, entry.response) === true) // Check for truth.
                    ) {
                        delete (this._cache[cacheKey]);
                        isDirty = true;
                    }
                }
            },
            setResponse: function (cacheKey, response) {
                var localCacheKey = this._getLocalCacheKey(cacheKey);
                this._cache[localCacheKey] = {
                    response: ng.copy(response),
                    createdAt: (new Date()).getTime()
                };
            },
            updateAllResponses: function (operator, context) {
                context = (context || {});
                var isDirty = false;
                for (var cacheKey in this._cache) {
                    if (this._cache.hasOwnProperty(cacheKey)) {
                        var entry = this._cache[cacheKey];
                        if (this._isExpired(entry)) {
                            delete (this._cache[cacheKey]);
                        } else {
                            operator.call(context, entry.response);
                            isDirty = true;
                        }
                    }
                }
            },
            updateResponse: function (cacheKey, operator, context) {
                var localCacheKey = this._getLocalCacheKey(cacheKey);
                var entry = this._cache[localCacheKey];
                context = (context || {});
                if (!entry) {
                    return;
                }
                if (this._isExpired(entry)) {
                    delete (this._cache[localCacheKey]);
                    return;
                }
                operator.call(context, entry.response);
            },
            updateResponses: function (comparator, operator, context) {
                context = (context || {});
                var isDirty = false;
                for (var cacheKey in this._cache) {
                    if (this._cache.hasOwnProperty(cacheKey)) {
                        var entry = this._cache[cacheKey];
                        if (this._isExpired(entry)) {
                            delete (this._cache[cacheKey]);
                        } else if (comparator.call(context, entry.response)) {
                            operator.call(context, entry.response);
                            isDirty = true;
                        }
                    }
                }
            },
            _clearExpiredEntries: function () {
                for (var cacheKey in this._cache) {
                    if (
                    this._cache.hasOwnProperty(cacheKey) &&
                    this._isExpired(this._cache[cacheKey])
                    ) {
                        delete (this._cache[cacheKey]);
                    }
                }
            },
            _getLocalCacheKey: function (cacheKey) {
                return ("cache-key:" + cacheKey);
            },
            _isExpired: function (entry) {
                var now = (new Date()).getTime();
                return ((entry.createdAt + this._maxAge) < now);
            },
            _save: function () {
                if (!this._supportsLocalStorage) {
                    return;
                }
                var serializedCache = ng.toJson(this._cache);
                try {
                    $window.localStorage.setItem(this._name, serializedCache);
                } catch (error) {
                    $window.localStorage.removeItem(this._name);
                }
            }
        };
        return (PartialCache);
    }
})(angular, InVision);
;
;
/*! pub-sub.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("PubSub", PubSubFactory);
    /** @ngInject */
    function PubSubFactory(_) {
        var PubSub = function () {
            function off(eventType, callback) {
                var eventConfig = parseEventConfig(eventType);
                if (!subscriptions.hasOwnProperty(eventConfig.type)) {
                    return;
                }
                subscriptions[eventConfig.type] = _.reject(
                subscriptions[eventConfig.type],
                function (subscription) {
                    if (callback) {
                        return (
                        (subscription.namespace === eventConfig.namespace) &&
                        (subscription.callback === callback)
                        );
                    } else {
                        return (subscription.namespace === eventConfig.namespace);
                    }
                }
                );
            }
            function on(eventType, callback, context) {
                if (_.isArray(eventType)) {
                    _.forEach(
                    eventType,
                    function (eventType) {
                        on(eventType, callback, context);
                    }
                    );
                    return;
                }
                var eventConfig = parseEventConfig(eventType);
                if (!subscriptions.hasOwnProperty(eventConfig.type)) {
                    subscriptions[eventConfig.type] = [];
                }
                subscriptions[eventConfig.type].push({
                    namespace: eventConfig.namespace,
                    callback: callback,
                    context: (context || {})
                });
            }
            function parseEventConfig(eventType) {
                var parts = eventType.split(".");
                return ({
                    type: parts.shift(),
                    namespace: (parts.join(",") || null)
                });
            }
            function trigger(eventType, eventData) {
                var eventConfig = parseEventConfig(eventType);
                if (eventConfig.type === "*") {
                    throw (new Error("IllegalEventType"));
                }
                if (!subscriptions.hasOwnProperty(eventConfig.type)) {
                    return;
                }
                var eventArguments = arguments;
                eventArguments[0] = {
                    type: eventConfig.type,
                    namespace: eventConfig.namespace
                };
                _.forEach(
                subscriptions[eventConfig.type],
                function (subscription) {
                    if (
                    (eventConfig.namespace === null) ||
                    (eventConfig.namespace === subscription.namespace)
                    ) {
                        subscription.callback.apply(subscription.context, eventArguments);
                    }
                }
                );
                _.forEach(
                subscriptions["*"],
                function (subscription) {
                    subscription.callback.apply(subscription.context, eventArguments);
                }
                );
            }
            var subscriptions = {};
            subscriptions["*"] = [];
            return ({
                off: off,
                on: on,
                trigger: trigger
            });
        };
        return (PubSub);
    }
})(angular, InVision);
;
;
/*! app-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("AppController", Controller);
    /** @ngInject */
    function Controller($scope, $route, $routeParams, $location, config, requestContext, sessionService, modelEvents, _, $window, $timeout) {
        function authenticateSession() {
            sessionService.authenticate().then(
            function () {
                $location.path(initiallyRequestedRoute);
            },
            function () {
            }
            );
        }
        function isRouteRedirect(route) {
            return (!route.current.action);
        }
        $scope.clearBodyStyle = function () {
            $scope.bodyStyle = {};
        };
        $scope.clearSecondaryBodyClass = function () {
            $scope.secondaryBodyClass = "";
        };
        $scope.openModalWindow = function () {
            var modalData = _.toArray(arguments);
            var modalType = modalData.shift();
            $scope.$broadcast("openModalWindow", modalType, modalData);
        };
        $scope.setBodyClass = function (className) {
            $scope.bodyClass = className;
        };
        $scope.updateBodyStyle = function (style) {
            _.merge($scope.bodyStyle, style);
        };
        $scope.setWindowTitle = function (title) {
            $scope.windowTitle = title + " - InVision";
        };
        $scope.setSecondaryBodyClass = function (className) {
            $scope.secondaryBodyClass = className;
        };
        var renderContext = requestContext.getRenderContext()
        if ($location.path() === "/loading") {
            var initiallyRequestedRoute = "/";
        } else {
            var initiallyRequestedRoute = ($location.path() || "/");
        }
        $scope.windowTitle = "InVision v2.0";
        $scope.bodyClass = "";
        $scope.secondaryBodyClass = "";
        $scope.bodyStyle = {};
        $scope.subview = renderContext.getNextSection();
        $scope.featureAnnouncementsLastUpdatedAt = config.lastFeatureAnnouncement;
        $scope.$on("$destroy", function (event) {
            modelEvents.off("newFeatureAnnounced.app");
        });
        $scope.$on("$locationChangeStart", function (event) {
            if ($scope.uploading) {
                $scope.openModalWindow("uploadInProgress", $location.path());
                event.preventDefault();
            }
        });
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            $scope.subview = renderContext.getNextSection();
        }
        );
        $scope.$on(
        "$routeChangeSuccess",
        function (event, currentRoute, previousRoute) {
            if (isRouteRedirect($route)) {
                return;
            }
            if (!sessionService.isAuthenticated()) {
                if ($route.current.action !== "loading") {
                    return (
                    $location.path("/loading")
                    );
                }
            } else if ($route.current.action === "loading") {
                return (
                $location.path("/")
                );
            }
            requestContext.setContext($route.current.action, $routeParams);
            $scope.$broadcast("requestContextChanged", requestContext);
        }
        );
        $scope.$on("screenUploadStart", function (event) {
            $scope.uploading = true;
        });
        $scope.$on("screenUploadStop", function (event) {
            $scope.uploading = false;
        });
        modelEvents.on(
        "newFeatureAnnounced.app",
        function (event, utcArray) {
            $scope.featureAnnouncementsLastUpdatedAt = moment.utc(utcArray).valueOf();
            $scope.$broadcast("newFeatureAnnounced");
        }
        );
        authenticateSession();
    }
})(angular, InVision);
;
;
/*! activity-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("activity.ActivityController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $location, requestContext, sessionService, _) {
        $scope.exitTour = function () {
            $scope.showDashboardTour = false;
        }
        var renderContext = requestContext.getRenderContext("standard.dashboard");
        $scope.showDashboardTour = false;
        $scope.$on(
        "tour:exit",
        function () {
            $scope.showDashboardTour = false;
            $scope.$broadcast("dashboard:exitTour");
        }
        );
        $scope.setWindowTitle("Activity");
        if (renderContext.getNextSection() === "intro") {
            $scope.openModalWindow("video", "42653619");
        } else if (!sessionService.user.hasSeenDashboardTour) {
            sessionService.user.hasSeenDashboardTour = true;
            $scope.showDashboardTour = true;
        }
        if ($location.search().hasOwnProperty("annualUpgrade")) {
            $location.search("annualUpgrade", null);
            $scope.openModalWindow("annualUpgrade");
        }
        $window._kmq.push(['record', 'Projects Dashboard (home) page viewed']);
    }
})(angular, InVision);
;
;
/*! list-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("activity.ListController", Controller);
    /** @ngInject */
    function Controller($scope, $location, Deferred, projectService, dashboardActivityPartial, dateHelper, hashKeyCopier, userService, _) {
        function addActivityToActivityPeriods(activity) {
            for (var i = 0 ; i < $scope.activityPeriods.length ; i++) {
                var existingActivity = $scope.activityPeriods[i];
                if (existingActivity.offset === activity.offset) {
                    _.extendExistingProperties(
                    existingActivity,
                    hashKeyCopier.copyHashKeys(existingActivity, activity)
                    );
                    return (activity);
                }
            }
            $scope.activityPeriods.push(activity);
            return (activity);
        }
        function applyDateLabels(activity) {
            var d = dateHelper.removeTime(activity.offset);
            if (activity.durationInDays === 1) {
                if (dateHelper.isToday(d)) {
                    activity.primaryDateLabel = "Today";
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                } else if (dateHelper.isYesterday(d)) {
                    activity.primaryDateLabel = "Yesterday";
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                } else {
                    activity.primaryDateLabel = dateHelper.formatDate(d, "ddd");
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                }
            } else {
                activity.primaryDateLabel = ("Week Of " + dateHelper.formatDate(d, "mmmm d"));
                activity.secondaryDateLabel = null;
            }
            return (activity);
        }
        function applyProjectEventCount(activity) {
            for (var i = 0, length = activity.projects.length ; i < length ; i++) {
                var project = activity.projects[i];
                project.eventCount = (project.comments.count + project.screensAdded.length + project.screensUpdated.length + project.views.length + project.members.length);
            }
            return (activity);
        }
        function applyRemoteData(activity) {
            if (activity.alreadyAddedToActivityPeriods) {
                return;
            }
            activity.alreadyAddedToActivityPeriods = true;
            activity = augmentActivity(activity);
            addActivityToActivityPeriods(activity);
            updateHasMoreActivityToLoad();
        }
        function augmentActivity(activity) {
            activity = applyDateLabels(activity);
            activity = applyProjectEventCount(activity);
            sortActivityProjects(activity.projects);
            augmentProjects(activity.projects);
            return (activity);
        }
        function augmentCollaborators(members) {
            for (var i = 0, length = members.length ; i < length ; i++) {
                var user = members[i];
                user.shortName = userService.getShortName(user.name);
                user.initials = userService.getInitials(user.name);
                user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            }
            return (members);
        }
        function augmentComments(comments) {
            for (var s = 0, sLength = comments.screens.length ; s < sLength ; s++) {
                var screen = comments.screens[s];
                for (var u = 0, uLength = screen.users.length ; u < uLength ; u++) {
                    var user = screen.users[u];
                    user.shortName = userService.getShortName(user.name);
                    user.initials = userService.getInitials(user.name);
                    user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
                }
            }
            return (comments);
        }
        function augmentProject(project) {
            project.isRendered = !project.isMinimizedInTimeline;
            augmentComments(project.comments);
            augmentScreens(project.screensAdded);
            augmentScreens(project.screensUpdated);
            augmentViews(project.views);
            augmentCollaborators(project.members);
            return (project);
        }
        function augmentProjects(projects) {
            for (var i = 0, length = projects.length ; i < length ; i++) {
                augmentProject(projects[i]);
            }
            return (projects);
        }
        function augmentScreens(screens) {
            for (var i = 0, length = screens.length ; i < length ; i++) {
                var screen = screens[i];
                screen.shortUserName = userService.getShortName(screen.userName);
            }
            return (screens);
        }
        function augmentViews(views) {
            for (var i = 0, length = views.length ; i < length ; i++) {
                var user = views[i];
                user.shortName = userService.getShortName(user.name);
                user.initials = userService.getInitials(user.name);
                user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
                if (user.isAnonymous) {
                    user.shortName = "Anonymous";
                }
            }
            return (views);
        }
        function getLastKnownOffset() {
            return (
            _.last($scope.activityPeriods).offset
            );
        }
        function getOffsetsForCurrentWeek() {
            var offsets = [];
            var currentDay = dateHelper.today();
            if (currentDay.getDay() === 0) {
                offsets.push(currentDay.getTime());
                currentDay = dateHelper.addDays(currentDay, -1);
            }
            for (var i = currentDay.getDay() ; i >= 1 ; i--) {
                offsets.push(currentDay.getTime());
                currentDay = dateHelper.addDays(currentDay, -1);
            }
            return (offsets);
        }
        function loadActivityStream() {
            $scope.isLoadingActivity = true;
            var offsets = getOffsetsForCurrentWeek();
            var promises = [];
            for (var i = 0 ; i < offsets.length ; i++) {
                promises.push(
                dashboardActivityPartial.get(offsets[i], 1)
                );
            }
            Deferred.handleAllPromises(
            promises,
            function (promise1, promise2, promiseN) {
                $scope.isLoadingActivity = false;
                var projectCount = 0;
                for (var i = 0 ; i < arguments.length ; i++) {
                    applyRemoteData(arguments[i].activity);
                    projectCount += arguments[i].activity.projects.length;
                }
                if (!projectCount) {
                    $scope.loadMoreActivity();
                }
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your activity stream. Try refreshing your browser.");
            }
            );
        }
        function sortActivityProjects(projects) {
            projects.sort(
            function (a, b) {
                return (a.updatedAt > b.updatedAt ? -1 : 1);
            }
            );
            return (projects);
        }
        function updateHasMoreActivityToLoad() {
            var activity = _.last($scope.activityPeriods);
            $scope.hasMoreActivityToLoad = (activity.offset > activity.minimumOffset);
        }
        $scope.loadMoreActivity = function () {
            $scope.isLoadingPastActivity = true;
            var lastKnownOffset = getLastKnownOffset();
            var pastOffset = dateHelper.addDays(lastKnownOffset, -7).getTime();
            Deferred.handlePromise(
            dashboardActivityPartial.get(pastOffset, 7),
            function (response) {
                $scope.isLoadingPastActivity = false;
                applyRemoteData(response.activity);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your past activity. Try refreshing your browser.");
            }
            );
        };
        $scope.toggleProject = function (project) {
            project.isRendered = true;
            project.isMinimizedInTimeline = !project.isMinimizedInTimeline;
            Deferred.handlePromise(
            projectService.setIsMinimizedInTimeline(project.id, project.isMinimizedInTimeline),
            function () {
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't save your activity stream setting. Try refreshing your browser.");
            }
            );
        };
        $scope.viewUser = function (user, project) {
            if (user.relationship === "teamMember") {
                $location.path("/team/" + user.id + "/activity");
            } else if (user.relationship === "affiliate") {
                $scope.openModalWindow("affiliateActivity", user.id, project.id);
            } else {
            }
        };
        $scope.isLoadingActivity = false;
        $scope.isLoadingPastActivity = false;
        $scope.activityPeriods = [];
        $scope.hasMoreActivityToLoad = false;
        loadActivityStream();
    }
})(angular, InVision);
;
;
/*! projects-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("activity.ProjectsController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, dashboardProjectsPartial, sessionService, modelEvents, dateHelper, hashKeyCopier, _) {
        function applyIsNewToProjects() {
            var cutOff = dateHelper.addDays(dateHelper.today(), -3).getTime();
            for (var i = 0, length = $scope.projects.length ; i < length ; i++) {
                $scope.projects[i].isNew = ($scope.projects[i].startedAt >= cutOff);
            }
        }
        function applyRemoteData(projects, subscription) {
            $scope.projects = hashKeyCopier.copyHashKeys($scope.projects, projects);
            applyIsNewToProjects();
            sortProjects();
            updateProjectBreakdowns();
            $scope.subscription = subscription;
        }
        function getActiveProjects() {
            return (
            _.withProperty($scope.projects, "isArchived", false)
            );
        }
        function getArchivedProjects() {
            return (
            _.withProperty($scope.projects, "isArchived", true)
            );
        }
        function getFavoriteProjects() {
            return (
            _.withProperty(getActiveProjects(), "isFavorite", true)
            );
        }
        function getProjectsOwnedByMe() {
            return (
            _.withProperty(getActiveProjects(), "userID", sessionService.user.id)
            );
        }
        function getProjectsOwnedByOthers() {
            return (
            _.withoutProperty(getActiveProjects(), "userID", sessionService.user.id)
            );
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            dashboardProjectsPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.projects, response.subscription);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your projects. Try refreshing your browser.");
            }
            );
        }
        function sortProjects() {
            $scope.projects.sort(
            function (a, b) {
                return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            }
            );
        }
        function updateProjectBreakdowns() {
            $scope.favoriteProjects = getFavoriteProjects();
            $scope.projectsOwnedByMe = getProjectsOwnedByMe();
            $scope.projectsOwnedByOthers = getProjectsOwnedByOthers();
            $scope.archivedProjects = getArchivedProjects();
        }
        $scope.activateProject = function (project) {
            if ($scope.subscription.canArchiveProjects) {
                $scope.openModalWindow("activateProject", project.id);
            } else {
                $scope.openModalWindow("changePlan");
            }
        };
        $scope.openNewProjectModal = function () {
            $scope.openModalWindow("newProject");
        };
        $scope.openShareModal = function (project) {
            $scope.openModalWindow("share", project.id);
        };
        $scope.toggleArchivedProjects = function () {
            $scope.isShowingArchivedProjects = !$scope.isShowingArchivedProjects;
        };
        $scope.toggleFavoriteStatus = function (project) {
            project.isFavorite = !project.isFavorite;
            projectService.setFavoriteStatus(project.id, project.isFavorite);
            updateProjectBreakdowns();
        };
        $scope.isLoading = false;
        $scope.projects = [];
        $scope.favoriteProjects = [];
        $scope.projectsOwnedByMe = [];
        $scope.projectsOwnedByOthers = [];
        $scope.archivedProjects = [];
        $scope.isShowingArchivedProjects = false;
        $scope.subscription = null;
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("projectCreated.projects");
            modelEvents.off("projectDeleted.projects");
            modelEvents.off("projectUpdated.projects");
            modelEvents.off("projectUserAdded.projects");
            modelEvents.off("subscriptionChanged.projects");
        }
        );
        modelEvents.on(
        "projectCreated.projects",
        function () {
            loadRemoteData();
        }
        );
        modelEvents.on(
        "projectDeleted.projects",
        function (event, projectID) {
            var projects = _.withoutProperty($scope.projects, "id", projectID);
            applyRemoteData(projects, $scope.subscription);
        }
        );
        modelEvents.on(
        "projectUpdated.projects",
        function (event, project) {
            var cachedProject = _.extendExistingProperties(
            _.findWithProperty($scope.projects, "id", project.id),
            project
            );
            if (cachedProject) {
                applyRemoteData($scope.projects, $scope.subscription);
            }
        }
        );
        modelEvents.on(
        "projectUserAdded.projects",
        function (event, projectID, userID) {
            if (userID === sessionService.user.id) {
                loadRemoteData();
            }
        }
        );
        modelEvents.on(
        "subscriptionChanged.dashboardProjects",
        function (event, subscription) {
            $scope.subscription = subscription;
        }
        );
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! tour-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("activity.TourController", Controller);
    /** @ngInject */
    function Controller($scope, $location, $window, $timeout, Deferred, accountService, _) {
        function markDashboardTourAsSeen() {
            Deferred.handlePromise(
            accountService.sawDashbourdTour(true),
            function (response) {
            },
            function (response) {
            }
            );
        }
        $scope.setTourStep = function (tourStep) {
            $scope.tourStep = tourStep;
            if (tourStep == "welcomeMessage" || tourStep == "exiting") {
                $scope.tourBarMode = "inactive";
            } else {
                $scope.tourBarMode = "active";
                $scope.setBodyClass("l-standard tour-open");
                if (tourStep == "activityStream") {
                    $scope.setBodyClass("l-standard tour-open tour_step1");
                    $scope.tourHasMoreSteps = true;
                } else if (tourStep == "projects") {
                    $window.scrollTo(0, 0);
                    $scope.setBodyClass("l-standard tour-open tour_step2");
                    $scope.tourHasMoreSteps = false;
                }
            }
        };
        $scope.playGettingStartedVideo = function () {
            $scope.openModalWindow("video", "42653619");
        };
        $scope.exitTour = function () {
            $scope.setTourStep("exiting");
            $scope.setBodyClass("l-standard");
            tourExitTimeout = $timeout(function () {
                $scope.$emit("tour:exit");
            }, 500);
        }
        var tourExitTimeout = null;
        $scope.tourStep = "welcomeMessage";
        $scope.tourBarMode = "inactive";
        $scope.tourHasMoreSteps = true;
        $scope.$on("$destroy", function () {
            $timeout.cancel(tourExitTimeout);
        });
        markDashboardTourAsSeen();
    }
})(angular, InVision);
;
;
/*! base-controller.js */
;
;
(function (ng, app, _) {
    "use strict";
    app.value("BaseController", Controller);
    /** @ngInject */
    function Controller($scope) {
        assignPrototypeMethods(Controller, this);
        this.scope = $scope;
        this._isActiveController = true;
        this.scope.$on(
        "requestContextChanged",
        this.bindMethod("handleRequestContextChanged")
        );
        this.scope.$on(
        "$destroy",
        this.bindMethod("handleDestroy")
        );
        return (Controller);
    }
    Controller.prototype = {
        bindMethod: function (method) {
            if (ng.isString(method)) {
                method = this[method];
            }
            return (
            ng.bind(this, method)
            );
        },
        handleAllPromises: function (promises, successCallback, errorCallback, runOnce) {
            var _this = this;
            var results = [];
            var hasError = false;
            var hasRun = false;
            successCallback = (successCallback || ng.noop);
            errorCallback = (errorCallback || ng.noop);
            var handleSuccess = function (index, response) {
                results[index] = response;
                if (hasError || _.contains(results, null)) {
                    return;
                }
                if (runOnce && hasRun) {
                    return;
                }
                hasRun = true;
                successCallback.apply(_this, results);
            };
            var handleError = function (index, response) {
                if (hasError) {
                    return;
                }
                hasError = true;
                errorCallback.call(_this, response);
            };
            for (var i = 0, length = promises.length ; i < length ; i++) {
                results.push(null);
            }
            _.forEach(
            promises,
            function (promise, index) {
                _this.handlePromise(
                promise,
                function (response) {
                    handleSuccess(index, response);
                },
                function (response) {
                    handleError(index, response);
                },
                "@success",
                "@error"
                );
            }
            );
        },
        handleAsyncCallback: function (callback) {
            var _this = this;
            var callbackDecorator = function () {
                if (!_this._isActiveController) {
                    return;
                }
                callback.apply(_this, arguments);
            }
            return (callbackDecorator);
        },
        handleDestroy: function () {
            this._isActiveController = false;
        },
        handlePromise: function (promise, successCallback, errorCallback, updateCallback, mistakeCallback) {
            promise.then(
            this.handleAsyncCallback(successCallback || ng.noop),
            this.handleAsyncCallback(errorCallback || ng.noop)
            );
            if (updateCallback) {
                if (updateCallback === "@success") {
                    updateCallback = successCallback;
                }
                promise.update(
                this.handleAsyncCallback(updateCallback)
                );
            }
            if (mistakeCallback) {
                if (mistakeCallback === "@error") {
                    mistakeCallback = errorCallback;
                }
                promise.mistake(
                this.handleAsyncCallback(mistakeCallback)
                );
            }
            return (promise);
        },
        handleRequestContextChanged: function (requestContext) {
            return;
        },
        initialize: function () {
            return;
        },
        isActiveController: function () {
            return (this._isActiveController);
        },
        render: function () {
            return;
        }
    };
    function assignPrototypeMethods(constructorMethod, context) {
        for (var methodName in constructorMethod.prototype) {
            if (
            constructorMethod.prototype.hasOwnProperty(methodName) &&
            !context[methodName]
            ) {
                context[methodName] = constructorMethod.prototype[methodName];
            }
        }
    }
})(angular, InVision, _);
;
;
/*! base-modal-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("BaseModalController", BaseModalController);
    /** @ngInject */
    function BaseModalController(BaseController) {
        /** @ngInject */
        function Controller($scope) {
            BaseController.call(this, $scope);
            assignPrototypeMethods(Controller, this);
            this.scope.isModalOpen = false;
            this.scope.openModal = this.bindMethod("openModal");
            this.scope.closeModal = this.bindMethod("closeModal");
            this.scope.$on("closeModalWindow", this.bindMethod("closeModal"));
            return (Controller.prototype);
        }
        Controller.prototype = {
            closeModal: function () {
                this.scope.isModalOpen = false;
            },
            openModal: function () {
                this.scope.isModalOpen = true;
            }
        };
        return (Controller);
    }
    function assignPrototypeMethods(constructorMethod, context) {
        for (var methodName in constructorMethod.prototype) {
            if (
            constructorMethod.prototype.hasOwnProperty(methodName) &&
            !context[methodName]
            ) {
                context[methodName] = constructorMethod.prototype[methodName];
            }
        }
    }
})(angular, InVision);
;
;
/*! build-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("console.BuildController", Controller);
    /** @ngInject */
    function Controller(_, $timeout, $scope, BaseController, requestContext, hotspotService, screenService, templateService, Deferred, $location) {
        $scope.saveHotspot = function (hotspot, screen) {
            var promise = Deferred.handlePromise(
            hotspotService.saveHotspot(hotspot, screen),
            null,
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't save your hotspot. Try refreshing your browser.");
            }
            );
            return (promise);
        };
        $scope.deleteHotspot = function (hotspot) {
            if (hotspot.isSaved) {
                hotspotService.deleteHotspot(hotspot);
            }
            var hotSpotsMinusDeleted = _.reject($scope.hotspots, function (h) {
                return h === hotspot;
            });
            $scope.setHotspots(hotSpotsMinusDeleted);
        };
        $scope.saveFixedHeaderHeight = function (screen) {
            screenService.setFixedHeaderHeight(screen);
        }
        $scope.saveFixedFooterHeight = function (screen) {
            screenService.setFixedFooterHeight(screen);
        }
        $scope.startScreenAnchorSetter = function (hotspotID) {
            $scope.isShowingScreenAnchorSetter = true;
            $scope.hotspotIDForScreenAnchorSetter = hotspotID;
            $scope.$apply;
        }
        $scope.closeScreenAnchorSetter = function () {
            $scope.isShowingScreenAnchorSetter = false;
            $scope.$apply;
        }
        $scope.setScreenAnchorPosition = function (position) {
            $scope.screenAnchorPosition = position;
        }
        $scope.setIsEditingFixedHeaderHeight = function (value) {
            $scope.isEditingFixedHeaderHeight = value;
        }
        $scope.setIsEditingFixedFooterHeight = function (value) {
            $scope.isEditingFixedFooterHeight = value;
        }
        $scope.floor = function (value) {
            return Math.floor(value);
        }
        $scope.ceil = function (value) {
            return Math.ceil(value);
        }
        var renderContext = requestContext.getRenderContext("console.build", ["projectID", "screenID"]);
        $scope.isShowingScreenAnchorSetter = false;
        $scope.hotspotIDForScreenAnchorSetter = 0;
        $scope.screenAnchorPosition = 0;
        $scope.setWindowTitle("Build Mode");
        $scope.isEditingFixedHeaderHeight = false;
        $scope.isEditingFixedFooterHeight = false;
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            if (requestContext.hasParamChanged("projectID") ||
            requestContext.hasParamChanged("screenID")) {
            }
        }
        );
    }
})(angular, InVision);
;
;
/*! comments-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("console.CommentsController", Controller);
    /** @ngInject */
    function Controller(_, $timeout, $scope, $location, BaseController, requestContext, conversationService, sessionService, projectService, Deferred, moment, modelEvents) {
        function applyFilters() {
            var conversations = $scope.conversations;
            updateFilterCounts();
            showConversations(conversations);
            applyShowCompletedFilter(conversations);
            applyTypeFilter(conversations);
            showConversationsNotAffectedByFiltering(conversations);
        }
        function applyShowCompletedFilter(conversations) {
            if (!$scope.filters.showCompleted.value) {
                hideConversations(
                _.withProperty(conversations, "isComplete", true)
                );
            }
        }
        function applyTypeFilter(conversations) {
            if ($scope.filters.type.value === "comments") {
                hideConversations(
                _.withProperty(conversations, "isForDevelopment", true)
                );
            } else if ($scope.filters.type.value === "dev-notes") {
                hideConversations(
                _.withProperty(conversations, "isForDevelopment", false)
                );
            }
        }
        function clearExcludedConversationIDs() {
            conversationIDsNotAffectedByFiltering = [];
        }
        function excludeConversationIDFromFiltering(id) {
            conversationIDsNotAffectedByFiltering.push(id);
            showConversationsNotAffectedByFiltering($scope.conversations);
        }
        function getConversation(conversationID) {
            return _.findWithProperty($scope.conversations, "id", conversationID);
        }
        function getSessionKeyForDefaultUserIDs() {
            var sessionKeyForDefaultUserIDs = "defaultUserIDs-" + $scope.projectID;
            return sessionKeyForDefaultUserIDs;
        }
        function hideConversations(conversations) {
            _.setProperty(conversations, "isShown", false);
        }
        function navigateToComments() {
            $location.path("/console/" + $scope.projectID + "/" + $scope.screenID + "/comments");
        }
        function showConversations(conversations) {
            _.setProperty(conversations, "isShown", true);
        }
        function showConversationsNotAffectedByFiltering(conversations) {
            showConversations(
            _.withPropertyRange($scope.conversations, "id", conversationIDsNotAffectedByFiltering)
            );
        }
        function sortUnreadConversations(conversations) {
            conversations.sort(
            function (a, b) {
                var commentA = _.last(a.comments);
                var commentB = _.last(b.comments);
                return (commentA.createdAt < commentB.createdAt ? -1 : 1);
            }
            );
            return (conversations);
        }
        function updateFilterCounts() {
            var conversations = $scope.conversations;
            if (!$scope.filters.showCompleted.value) {
                conversations = _.withoutProperty(conversations, "isComplete", true);
            }
            $scope.typeFilterOptions[0].count = conversations.length;
            $scope.typeFilterOptions[1].count = _.withProperty(conversations, "isForDevelopment", false).length;
            $scope.typeFilterOptions[2].count = _.withProperty(conversations, "isForDevelopment", true).length;
            if ($scope.filters.type.value === "all") {
                $scope.filters.showCompleted.count = _.withProperty($scope.conversations, "isComplete", true).length;
            } else if ($scope.filters.type.value === "comments") {
                $scope.filters.showCompleted.count = _.where($scope.conversations, { isForDevelopment: false, isComplete: true }).length;
            } else if ($scope.filters.type.value === "dev-notes") {
                $scope.filters.showCompleted.count = _.where($scope.conversations, { isForDevelopment: true, isComplete: true }).length;
            }
        }
        function updateUnreadConversations() {
            var conversations = _.filter(
            $scope.conversations,
            function (conversation) {
                return (
                (conversation.isUnread && !conversation.isComplete)
                ||
                _.contains(visitedUnreadConversationIDs, conversation.id)
                );
            }
            );
            $scope.unreadConversations = sortUnreadConversations(conversations);
            updateVisibleUnreadConversations();
        }
        function updateVisibleUnreadConversations() {
            $scope.visibleUnreadConversations = $scope.unreadConversations;
            $scope.hiddenUnreadConversations = [];
            if ($scope.unreadConversations.length > $scope.unreadConversationCapacity) {
                $scope.visibleUnreadConversations = $scope.unreadConversations.slice(0, $scope.unreadConversationCapacity);
                $scope.hiddenUnreadConversations = $scope.unreadConversations.slice($scope.unreadConversationCapacity);
            }
        }
        $scope.areConversationsDirty = function () {
            return (hasActiveConversationWithDirtyData);
        };
        $scope.changeShowCompletedFilter = function () {
            clearExcludedConversationIDs();
            $scope.closeAllConversationPanels();
            navigateToComments();
            applyFilters();
        };
        $scope.changeTypeFilter = function (option) {
            clearExcludedConversationIDs();
            $scope.closeAllConversationPanels();
            navigateToComments();
            $scope.filters.type = option;
            applyFilters();
        };
        $scope.closeAllConversationPanels = function () {
            hasActiveConversationWithDirtyData = false;
            _.setProperty($scope.conversations, "isConversationPanelVisible", false);
            _.each(
            _.withoutProperty($scope.conversations, "isSaved", true),
            function (conversation) {
                $scope.deleteConversation(conversation);
            }
            );
        };
        $scope.deleteConversation = function (conversation) {
            if (conversation.id) {
                conversationService.deleteConversation(conversation);
            }
            $scope.setConversations(
            _.reject($scope.conversations, function (c) {
                return conversation === c;
            })
            );
            navigateToComments();
        };
        $scope.getDefaultUserIDs = function () {
            return (defaultUserIDs);
        };
        $scope.isConversationActive = function () {
            var activeConversation = _.findWithProperty($scope.conversations, "isConversationPanelVisible", true);
            return (!!activeConversation);
        };
        $scope.isProjectMember = _.memoize(function (userID) {
            if (userID === $scope.userID) {
                return true;
            }
            var isMember = false;
            _.each($scope.projectMembers, function (member) {
                if (member.id === userID) {
                    isMember = true;
                    return false;
                }
            });
            return isMember;
        });
        $scope.markCommentsAsRead = function (conversation) {
            conversation.isUnread = false;
            var comments = _.filter(conversation.comments, function (comment) {
                return comment.isUnread === true;
            });
            var commentIDs = _.pluck(comments, 'id');
            modelEvents.trigger("console:conversation:read", conversation);
            _.setProperty(conversation.comments, "isUnread", false);
            if (commentIDs.length) {
                conversationService.markCommentsAsRead(commentIDs);
            }
        };
        $scope.setConversationsAsDirty = function () {
            hasActiveConversationWithDirtyData = true;
        };
        $scope.setDefaultUserIDs = function (userIDs) {
            sessionService.set(
            getSessionKeyForDefaultUserIDs(),
            userIDs
            );
            defaultUserIDs = userIDs;
        };
        $scope.showConversationPanel = function (conversationID) {
            if (!conversationID) {
                return;
            }
            var conversation = _.findWithProperty($scope.conversations, "id", conversationID);
            if (conversation) {
                conversation.isConversationPanelVisible = true;
                if (conversation.isUnread) {
                    visitedUnreadConversationIDs.push(conversationID);
                }
            } else {
                navigateToComments();
            }
        };
        $scope.saveConversation = function (conversation, callback) {
            var promise = conversationService.saveConversation(conversation);
            Deferred.handlePromise(
            promise,
            function (savedConversation) {
                modelEvents.trigger("console:conversation:saved", conversation);
                if (!conversation.isSaved) {
                    conversation.id = savedConversation.id;
                    conversation.label = savedConversation.label;
                    conversation.comments = [];
                }
                conversation.isSaved = true;
                if (callback) {
                    callback(conversation.id);
                }
            },
            function () {
            }
            );
        };
        $scope.saveConversationIsCompleteStatus = function (conversation) {
            excludeConversationIDFromFiltering(conversation.id);
            $scope.saveConversation(conversation);
        };
        $scope.updateUnreadConversationCapacity = function (capacity) {
            $scope.unreadConversationCapacity = capacity;
            updateVisibleUnreadConversations();
        };
        $scope.startSketchBuilder = function () {
            $scope.isShowingSketchBuilder = true;
            $scope.isBottomBarShown = false;
        }
        $scope.hideSketchBuilder = function () {
            $scope.isShowingSketchBuilder = false;
            $scope.isBottomBarShown = true;
        }
        $scope.clearCommentSketches = function () {
            $scope.tempSketches = [];
        }
        $scope.deleteTempSketch = function (tempID) {
            $scope.tempSketches = _.withoutProperty($scope.tempSketches, "tempID", tempID);
        }
        $scope.startSketchViewer = function (sketch, isTemp) {
            if (sketch.sketchID !== undefined) {
                sketch.id = sketch.sketchID;
            }
            $scope.sketchViewerSketch = sketch;
            $scope.sketchViewerSketchIsTemp = (sketch.tempID !== undefined ? true : false);
            $scope.isShowingSketchViewer = true;
            $scope.isBottomBarShown = false;
            $scope.$apply;
        }
        $scope.closeSketchViewer = function () {
            $scope.sketchViewerSketch = {};
            $scope.sketchViewerSketchIsTemp = false;
            $scope.isShowingSketchViewer = false;
            $scope.isBottomBarShown = true;
            $scope.$apply;
        }
        var renderContext = requestContext.getRenderContext("console.comments", ["projectID", "screenID", "commentID"]);
        var conversationIDsNotAffectedByFiltering = [];
        var visitedUnreadConversationIDs = [];
        var defaultUserIDs = sessionService.get(getSessionKeyForDefaultUserIDs(), []);
        var hasActiveConversationWithDirtyData = false;
        $scope.commentID = requestContext.getParamAsInt("commentID");
        $scope.typeFilterOptions = [
        {
            label: "All Types",
            value: "all",
            count: 0
        },
        {
            label: "Comments",
            value: "comments",
            count: 0
        },
        {
            label: "Dev Notes",
            value: "dev-notes",
            count: 0
        }
        ];
        $scope.filters = {
            type: $scope.typeFilterOptions[0],
            showCompleted: {
                value: false,
                count: 0
            }
        };
        $scope.unreadConversations = [];
        $scope.visibleUnreadConversations = [];
        $scope.hiddenUnreadConversations = [];
        $scope.unreadConversationCapacity = 10;
        $scope.isShowingSketchBuilder = false;
        $scope.isShowingSketchViewer = false;
        $scope.sketchViewerSketchIsTemp = false;
        $scope.sketchViewerSketch = {};
        $scope.tempSketches = [];
        $scope.$on("$destroy", function () {
            var conversation = _.find($scope.conversations, function (conversation) {
                return conversation.id == $scope.commentID;
            });
            if (conversation) {
                $scope.markCommentsAsRead(conversation);
            }
        });
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            hasActiveConversationWithDirtyData = false;
            if (requestContext.haveParamsChanged(["projectID", "screenID"])) {
                clearExcludedConversationIDs();
                visitedUnreadConversationIDs = [];
            }
            if (requestContext.hasParamChanged("commentID")) {
                $scope.commentID = requestContext.getParamAsInt("commentID");
                $scope.closeAllConversationPanels();
                if ($scope.commentID) {
                    excludeConversationIDFromFiltering($scope.commentID);
                    $scope.showConversationPanel($scope.commentID);
                }
            }
        }
        );
        $scope.$on(
        "conversationsChanged",
        function (event, conversations) {
            updateUnreadConversations();
            applyFilters();
            $scope.showConversationPanel($scope.commentID);
        }
        );
        $scope.setWindowTitle("Comment Mode");
        if (requestContext.getParamAsInt("commentID")) {
            excludeConversationIDFromFiltering($scope.commentID);
        }
        if ($scope.conversations.length) {
            updateUnreadConversations();
            applyFilters();
            $scope.showConversationPanel($scope.commentID);
        }
    }
})(angular, InVision);
;
;
/*! history-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("console.HistoryController", Controller);
    /** @ngInject */
    function Controller($location, $scope, requestContext, $window, _, $timeout, modelEvents, moment, Deferred, screenHistoryService, userService) {
        function loadRemoteData() {
            Deferred.handlePromise(
            screenHistoryService.get($scope.screenID),
            function (response) {
                $scope.screenVersions = response.versions;
                $scope.screenComments = response.comments;
                $scope.activateVersion(_.last($scope.screenVersions));
            },
            function (response) {
            }
            );
        }
        function augmentVersion(version) {
            var start, end;
            version.imageUrl = "/screens/" + $scope.screen.id + "/" + version.version;
            version.isCurrent = (version.endedAt === '');
            version.lifespanHumanized = "";
            version.createdByUsersAvatar = "/avatars/" + version.avatarID;
            version.createdByUserInitials = userService.getInitials(version.userName);
            version.createdByUserHasSystemAvatar = userService.isSystemAvatar(version.avatarID);
            version.shortUserName = userService.getShortName(version.userName);
            version.timeLabel = moment(version.createdAt).format("MMM D [at] h:mma");
            start = moment(version.createdAt);
            if (!version.isCurrent) {
                end = moment(version.endedAt);
            } else {
                end = moment();
            }
            version.lifespanHumanized = start.from(end, true);
        }
        function augmentUser(user) {
            user.shortName = userService.getShortName(user.userName);
            user.initials = userService.getInitials(user.userName);
            user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            return user;
        }
        function augmentUsers(users) {
            _.each(users, augmentUser);
            return users;
        }
        function getIndexOfDisplayedVersion() {
            var versionIndex = _.indexOfWithProperty($scope.screenVersions, "version", $scope.activeVersion.version);
            return versionIndex;
        }
        function handleConfigUpdateOrLoad(config) {
            var cssToApply = {};
            if (!$scope.isFullBrowser) {
                return;
            }
            cssToApply.backgroundColor = "#" + config.backgroundColor;
            if (config.alignment != "center") {
                cssToApply["float"] = config.alignment;
            } else {
                cssToApply.margin = "0 auto";
                cssToApply["float"] = "none";
            }
            if (_.isObject(config.backgroundImage)
            && config.backgroundImage.id > 0) {
                cssToApply.backgroundImage = "url('/backgrounds/" + config.backgroundImage.id + "/" + config.backgroundImage.imageVersion + "')";
                var backgroundPositionY = "0";
                if ($scope.subview == "build") {
                    backgroundPositionY = "47px";
                }
                switch (config.backgroundImagePosition) {
                    case "center":
                        cssToApply.backgroundRepeat = "no-repeat";
                        cssToApply.backgroundPosition = "50% " + backgroundPositionY;
                        break;
                    case "tile":
                        cssToApply.backgroundRepeat = "repeat";
                        cssToApply.backgroundPosition = "0 " + backgroundPositionY;
                        break;
                    case "tile-horizontally":
                        cssToApply.backgroundRepeat = "repeat-x";
                        cssToApply.backgroundPosition = "0 " + backgroundPositionY;
                        break;
                    default:
                        break;
                }
            } else {
                cssToApply.backgroundImage = "none";
            }
            $scope.screenFloat = { "float": cssToApply["float"] };
            $scope.updateBodyStyle(cssToApply);
            if (!_.isUndefined($scope.bodyStyle.backgroundPosition)) {
                var currentBackgroundPosition = $scope.bodyStyle.backgroundPosition;
                var currentBackgroundPositionX = currentBackgroundPosition.split(" ")[0];
                var backgroundPositionY = "0";
                $scope.updateBodyStyle({ "backgroundPosition": currentBackgroundPositionX + " " + backgroundPositionY });
            }
        }
        $scope.activateVersion = function (version) {
            augmentVersion(version);
            $scope.activeVersion = version;
            $scope.activeVersionParticipants = augmentUsers($scope.screenComments[version.version]);
            $scope.totalCommentsThisVersion = _.reduce($scope.activeVersionParticipants, function (sum, commentors) {
                return sum + commentors.commentCount;
            }, 0);
            var versionIndex = _.indexOfWithProperty($scope.screenVersions, "version", version.version);
            $scope.hasPreviousVersion = versionIndex > 0;
            $scope.hasNextVersion = versionIndex < ($scope.screenVersions.length - 1);
            handleConfigUpdateOrLoad($scope.config);
        };
        $scope.toggleExpandedView = function () {
            $scope.isFullBrowser = !$scope.isFullBrowser;
            if ($scope.isFullBrowser) {
                $scope.clearBodyStyle();
                handleConfigUpdateOrLoad($scope.config);
            } else {
                $scope.clearBodyStyle();
                $scope.updateBodyStyle({ "background": "url(/assets/apps/d/img/history_pattern.png) repeat" });
            }
        };
        $scope.closeExpandedView = function () {
            $scope.isFullBrowser = false;
            $scope.clearBodyStyle();
            $scope.updateBodyStyle({ "background": "url(/assets/apps/d/img/history_pattern.png) repeat" });
        };
        $scope.previousVersion = function () {
            var versionIndex = getIndexOfDisplayedVersion();
            var previousVersionIndex = Math.max(versionIndex - 1, 0);
            $scope.activateVersion($scope.screenVersions[previousVersionIndex]);
        };
        $scope.nextVersion = function () {
            var versionIndex = getIndexOfDisplayedVersion();
            var nextVersionIndex = Math.min(versionIndex + 1, $scope.screenVersions.length - 1);
            $scope.activateVersion($scope.screenVersions[nextVersionIndex]);
        };
        var renderContext = requestContext.getRenderContext("console.history", ["projectID", "screenID"]);
        $scope.screenComments = {};
        $scope.screenVersions = [];
        $scope.activeVersion = null;
        $scope.totalCommentsThisVersion = 0;
        $scope.showSuccessMessage = false;
        $scope.isFullBrowser = false;
        $scope.hasNextVersion = false;
        $scope.hasPreviousVersion = false;
        $scope.screenFloat = { "float": "none" };
        $scope.$on("$destroy", function () {
            modelEvents.trigger("screenConfig:changed", $scope.config);
            modelEvents.off("screenUploaded.historyMode");
        });
        $scope.$on(
        "historyImageLoaded",
        function (event, imageElement) {
            $scope.$emit("consoleImageLoaded", imageElement);
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            if (requestContext.hasParamChanged("screenID")) {
                loadRemoteData();
            }
        }
        );
        modelEvents.on(
        "screenUploaded.historyMode",
        function (event, screen) {
            if (screen.projectID !== $scope.projectID) {
                return;
            }
            loadRemoteData(screen);
        }
        );
        modelEvents.on(
        "screenConfig:changed",
        function (event, newConfig) {
            if (_.isUndefined(newConfig)) {
                return;
            }
            handleConfigUpdateOrLoad(newConfig);
        }
        );
        $scope.setWindowTitle("History Mode");
        $scope.clearBodyStyle();
        $scope.updateBodyStyle({ "background": "url(/assets/apps/d/img/history_pattern.png) repeat" });
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! preview-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("console.PreviewController", Controller);
    /** @ngInject */
    function Controller($location, $scope, BaseController, requestContext, $window, _, $timeout, hotspotService, screenService, Deferred) {
        function overlayScreen(hotspot) {
            var screenID,
            screen;
            if (hotspot.targetTypeID === hotspotService.targetTypes.lastScreenVisited) {
                screenID = $scope.navigateToPreviousScreen("preview", true);
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.previousScreenInSort) {
                screen = $scope.navigateToPreviousScreenInSort(true);
                $scope.openScreenAsOverlay(screen);
                return;
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.nextScreenInSort) {
                screen = $scope.navigateToNextScreenInSort(true);
                $scope.openScreenAsOverlay(screen);
                return;
            } else {
                screenID = hotspot.targetScreenID;
            }
            Deferred.handlePromise(
            screenService.getByID(screenID, true),
            function (screen) {
                $scope.openScreenAsOverlay(screen);
            },
            function (response) {
            }
            );
        }
        $scope.applyHotspotNavigation = function (hotspot, eventType) {
            if ($scope.project.isMobile && hotspot.transitionTypeID > 1) {
                if (hotspot.targetTypeID === hotspotService.targetTypes.lastScreenVisited) {
                    if ($scope.previousScreenQueue.length) {
                        var id = $scope.previousScreenQueue[$scope.previousScreenQueue.length - 1];
                        var targetScreen = $scope.getScreenByID(id);
                    }
                } else if (hotspot.targetTypeID === hotspotService.targetTypes.previousScreenInSort) {
                    var targetScreen = $scope.getPreviousScreenInSort($scope.screenID);
                } else if (hotspot.targetTypeID === hotspotService.targetTypes.nextScreenInSort) {
                    var targetScreen = $scope.getNextScreenInSort($scope.screenID);
                } else {
                    var targetScreen = $scope.getScreenByID(hotspot.targetScreenID);
                }
                if (targetScreen && !isNaN(targetScreen.id)) {
                    $scope.transitionData = {
                        transitionTypeID: hotspot.transitionTypeID,
                        currentScreenID: $scope.screen.id,
                        currentScreenImageVersion: $scope.screen.imageVersion,
                        targetScreenID: targetScreen.id,
                        targetScreenImageVersion: targetScreen.imageVersion
                    }
                    $scope.setIsTransitioning(true);
                }
            }
            if (_.isUndefined(eventType)) {
                eventType = "click";
            }
            if (eventType == "click" && hotspot.eventTypeID == 8 && !$scope.project.isMobile) {
                return false;
            } else if (eventType == "hover" && (hotspot.eventTypeID != 8 || $scope.project.isMobile)) {
                return false;
            }
            if (hotspot.eventTypeID == 8 && !$scope.project.isMobile) {
                if (!hotspot.metaData.stayOnScreen) { // if we're staying on the current screen, we need an overlay
                    overlayScreen(hotspot);
                    return false;
                }
                else { // maintain scroll position by default if we're changing screens
                    $scope.maintainScrollPositionOnNextScreenLoad();
                }
            }
            $scope.setIsHotspotNavigation(true);
            if (hotspot.targetTypeID === hotspotService.targetTypes.lastScreenVisited) {
                $scope.navigateToPreviousScreen("preview");
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.previousScreenInSort) {
                $scope.navigateToPreviousScreenInSort();
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.nextScreenInSort) {
                $scope.navigateToNextScreenInSort();
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.externalUrl) {
                $scope.navigateToExternalUrl(hotspot.metaData.url, hotspot.metaData.isOpenInNewWindow);
            } else if (hotspot.targetTypeID === hotspotService.targetTypes.positionOnScreen) {
                if (hotspot.metaData.isSmoothScroll) {
                    var animateTime = 500;
                } else {
                    var animateTime = 0;
                }
                if ($scope.project.isMobile) {
                    var scrollOffset = hotspot.metaData.scrollOffset * ($scope.project.mobileTemplate.viewportWidth / $scope.screen.width);
                    $scope.scrollMobileViewport(scrollOffset, animateTime);
                } else {
                    $("body, html").animate(
                    { scrollTop: hotspot.metaData.scrollOffset },
                    animateTime
                    );
                }
            } else {
                $scope.navigateToScreen(hotspot.targetScreenID, "preview");
            }
            if (hotspot.isScrollTo) {
                $scope.maintainScrollPositionOnNextScreenLoad();
            }
        };
        $scope.hideOverlay = function () {
            $scope.overlayImage = "";
        };
        $scope.setIsTransitioning = function (value) {
            $scope.isTransitioning = value;
        }
        var renderContext = requestContext.getRenderContext("console.preview", ["projectID", "screenID"]);
        $scope.overlayImage = "";
        $scope.setWindowTitle("Preview Mode");
        $scope.isTransitioning = false;
        $scope.transitionData = {};
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
        }
        );
    }
})(angular, InVision);
;
;
/*! dashboard-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("dashboard.DashboardController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $location, $timeout, requestContext) {
        $scope.isGoogleMapsApiLoaded = false;
        var renderContext = requestContext.getRenderContext("standard.dashboard");
        $scope.$on("googleMapsLoaded", function () {
            $timeout(function () {
                $scope.isGoogleMapsApiLoaded = true;
            }, 0);
        });
        $scope.$on('teamDataChanged', function (event, args) {
            $scope.$broadcast('updateStats', args)
        });
        if (!$scope.isEnterpriseUser) {
            $location.path("/");
        }
        $scope.setWindowTitle("Enterprise Dashboard");
        $window._kmq.push(['record', 'Enterprise Dashboard page viewed']);
    }
})(angular, InVision);
;
;
/*! dashboard-map-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("dashboard.DashboardMapController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $location, $timeout, Deferred, dashboardMapService, dashboardStatPartial, requestContext, sessionService, modelEvents, moment, userService, _) {
        function addMarkerForUser(user, openInfoBox) {
            var latLong = new $window.google.maps.LatLng(user.latitude, user.longitude);
            var marker = new $window.google.maps.Marker({
                position: latLong,
                customInfo: user,
                optimized: false
            });
            var existingMarker = null;
            for (var i = 0; i < $scope.myMarkers.length; i++) {
                if ($scope.myMarkers[i].customInfo.id === user.id) {
                    existingMarker = $scope.myMarkers[i];
                }
            }
            if (_.isNull(existingMarker)) {
                $scope.myMarkers.push(marker);
            } else {
                marker = existingMarker;
            }
            addMarkerToMap(marker, $scope.myMap);
            if (openInfoBox) {
                $scope.myInfoBox.open($scope.myMap, marker);
            }
        }
        function addMarkerToMap(marker, map) {
            marker.setMap(map);
        }
        function removeMarkerFromMap(marker) {
            marker.setMap(null);
        }
        function addMarkerForUserID(userID) {
            var user = _.findWithProperty(allTeamMembers, "id", userID);
            if (!_.isUndefined(user)) {
                augmentUserWithMarker(user);
                loadMapMarkerForUser(user);
            }
        }
        function augmentUser(user) {
            user.initials = userService.getInitials(user.name);
            user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            return (user);
        }
        function augmentUsers(users) {
            _.each(users, augmentUser);
            return (users);
        }
        function augmentUsersWithMarkers(users) {
            _.forEach(users, augmentUserWithMarker);
            return users;
        }
        function augmentUserWithMarker(user) {
            if ((user.latitude === "") || (user.longitude === "")) {
                var coordinates = getRandomCoordinates();
                user.latitude = coordinates.latitude;
                user.longitude = coordinates.longitude;
            }
            if (_.isUndefined(user.mapMarker)) {
                var latLong = new $window.google.maps.LatLng(
                user.latitude,
                user.longitude
                );
                var marker = new $window.google.maps.Marker({
                    position: latLong,
                    customInfo: user
                });
                user.mapMarker = marker;
            }
        }
        function getRandomCoordinates() {
            var options = [
            {
                latitude: 19.611544,
                longitude: -155.505981
            },
            {
                latitude: -17.640096,
                longitude: -149.454575
            },
            {
                latitude: 18.177169,
                longitude: -76.712036
            },
            {
                latitude: 21.796483,
                longitude: -72.282486
            }
            ];
            return (
            options[_.random(options.length - 1)]
            );
        }
        function getMarkerForUserID(userID) {
            var marker = _.find($scope.myMarkers, function (marker) {
                return (marker.customInfo.id === userID);
            });
            return marker;
        }
        function loadDataIntoScopeFromMarker(marker) {
            var user = marker.customInfo;
            $scope.mapPopup.user.name = user.name;
            $scope.mapPopup.user.initials = user.initials;
            $scope.mapPopup.user.avatarUrl = "/avatars/" + user.avatarID;
        }
        function showNextActivityItem() {
            var currentActivity = teamActivityQueue.pop();
            $scope.myInfoBox.close();
            if (_.isUndefined(currentActivity)) {
                $window.clearInterval(teamActivityDisplayTimer);
                return;
            }
            switch (currentActivity.action) {
                case "screenAdded":
                    screenAdded(currentActivity);
                    break;
                case "screenReplaced":
                    screenReplaced(currentActivity);
                    break;
                case "commentCreated":
                    commentCreated(currentActivity);
                    break;
                case "devNoteCreated":
                    commentCreated(currentActivity);
                    break;
                case "collaboratorAdded":
                    collaboratorAdded(currentActivity);
                    break;
                case "shareLinkViewed":
                    shareLinkViewed(currentActivity);
                    break;
                case "projectCreated":
                    projectCreated(currentActivity);
                    break;
                default:
                    break;
            }
        }
        function processTeamActivity(newTeamActivity) {
            var currentActivity = null,
            usersMarker = null,
            throttle = 10;
            teamActivityQueue = teamActivityQueue.concat(newTeamActivity);
            if (teamActivityQueue.length < 4) {
                throttle = 24;
            } else if (teamActivityQueue.length <= 10) {
                throttle = 12;
            } else if (teamActivityQueue.length <= 20) {
                throttle = 6;
            }
            showNextActivityItem();
            teamActivityDisplayTimer = $window.setInterval(showNextActivityItem, throttle * 1000);
        }
        function continuallyPollForActivity() {
            if (_.isNull(onlineUserTimerID)) {
                loadOnlineUsersInTeam();
                onlineUserTimerID = $window.setInterval(
                loadOnlineUsersInTeam,
                60 * 1000
                );
            }
            if (_.isNull(userActivityTimerID)) {
                loadRemoteActivity();
                userActivityTimerID = $window.setInterval(
                loadRemoteActivity,
                60 * 1000
                );
            }
        }
        function loadRemoteActivity() {
            Deferred.handlePromise(
            dashboardMapService.getRecentEvents($scope.user.id),
            function (response) {
                if (response.teamActivity.length > 0) {
                    processTeamActivity(response.teamActivity);
                    $scope.$emit('teamDataChanged', response.teamActivity);
                }
            },
            function (response) {
            }
            );
        }
        function loadOnlineUsersInTeam() {
            Deferred.handlePromise(
            dashboardStatPartial.get($scope.user.id, 1, 365),
            function (response) {
                var onlineTeamMembers = augmentUsers(response.onlineTeamMembers);
                var onlineStakeholders = augmentUsers(response.onlineStakeholders);
                removeStaleMarkers();
                allTeamMembers = response.teamMembers.concat(onlineStakeholders);
                augmentUsersWithMarkers(allTeamMembers);
                augmentUsersWithMarkers(onlineTeamMembers);
                loadMapMarkers(onlineTeamMembers);
                loadMapMarkers(onlineStakeholders);
                $scope.onlineUserCount = onlineTeamMembers.length;
                $scope.shareViewerCount = onlineStakeholders.length;
            },
            function (response) {
            }
            );
        }
        function initialize() {
            $scope.myMarkers = [];
            loadOnlineUsersInTeam();
            continuallyPollForActivity();
        }
        function loadMapMarkers(usersToAddMarkersFor) {
            _.forEach(usersToAddMarkersFor, loadMapMarkerForUser);
        }
        function loadMapMarkerForUser(user) {
            addMarkerForUser(user, false);
        }
        function zoomMapToShowAllMarkers(map) {
            var bounds = new google.maps.LatLngBounds();
            _.forEach($scope.myMarkers, function (marker) {
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        }
        function triggerMapEvent(eventConfig) {
            var userMarker = getMarkerForUserID(eventConfig.userID);
            if (_.isUndefined(userMarker)) {
                addMarkerForUserID(eventConfig.userID);
                userMarker = getMarkerForUserID(eventConfig.userID);
            }
            if (_.isUndefined(userMarker)) {
                loadOnlineUsersInTeam();
                return;
            }
            updateMarkerFreshness(userMarker);
            loadDataIntoScopeFromMarker(userMarker);
            $scope.mapPopup.hasAction = true;
            $scope.mapPopup.screenLink = eventConfig.screenLink;
            $scope.mapPopup.projectLink = eventConfig.projectLink;
            $scope.mapPopup.projectName = eventConfig.projectName;
            $scope.mapPopup.action = eventConfig.action;
            $scope.myInfoBox.open($scope.myMap, userMarker);
        }
        function getProjectDetailUrl(projectID) {
            return ("/d/main#/projects/" + projectID);
        }
        function getScreenDetailUrl(projectID, screenID) {
            return ("/d/main#/console/" + projectID + "/" + screenID + "/preview");
        }
        function updateMarkerFreshness(marker) {
            marker.customInfo.considerInactiveAt = moment(marker.customInfo.considerInactiveAt).add("minutes", 1).valueOf();
        }
        function removeStaleMarkers() {
            for (var i = 0; i < $scope.myMarkers.length; i++) {
                var user = $scope.myMarkers[i].customInfo;
                if ($scope.user.id !== user.id
                && moment().utc().isAfter(user.considerInactiveAt)) {
                    $scope.myMarkers[i].setMap(null);
                    $scope.myMarkers.splice(i, 1);
                }
            }
        }
        function commentCreated(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    isInstant: true,
                    type: "commentCreated",
                    quantity: data.actionOccuredXTimes
                },
                screenLink: getScreenDetailUrl(data.projectID, data.screenID),
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            if (data.action === "devNoteCreated") {
                event.action.type = "devNoteCreated";
            }
            triggerMapEvent(event);
        }
        function screenAdded(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    isInstant: true,
                    type: "screenAdded",
                    quantity: data.actionOccuredXTimes
                },
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            if (data.actionOccuredXTimes === 1) {
                event.screenLink = getScreenDetailUrl(data.projectID, data.screenID);
            }
            triggerMapEvent(event);
        }
        function screenReplaced(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    isInstant: true,
                    type: "screenReplaced",
                    quantity: data.actionOccuredXTimes
                },
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            if (data.actionOccuredXTimes === 1) {
                event.screenLink = getScreenDetailUrl(data.projectID, data.screenID);
            }
            triggerMapEvent(event);
        }
        function collaboratorAdded(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    isInstant: true,
                    type: "collaboratorAdded",
                    quantity: data.actionOccuredXTimes
                },
                screenLink: "",
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            triggerMapEvent(event);
        }
        function shareLinkViewed(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    isInstant: true,
                    type: "viewedShareLink",
                    quantity: data.actionOccuredXTimes
                },
                screenLink: "",
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            triggerMapEvent(event);
        }
        function projectCreated(data) {
            var event = {
                userID: data.userID,
                hasAction: true,
                action: {
                    type: "createdProject",
                    quantity: data.actionOccuredXTimes
                },
                screenLink: "",
                projectLink: getProjectDetailUrl(data.projectID),
                projectName: data.projectName
            };
            triggerMapEvent(event);
        }
        $scope.onMapClick = function () {
            $scope.myInfoBox.close();
        };
        $scope.onMapIdle = function () {
            if (mapJustLoaded) {
                zoomMapToShowAllMarkers($scope.myMap);
                mapJustLoaded = false;
            }
        };
        $scope.markerClicked = function (marker) {
            $scope.mapPopup.hasAction = false;
            loadDataIntoScopeFromMarker(marker);
            $scope.myInfoBox.open($scope.myMap, marker);
        };
        $scope.swapSizeState = function () {
            $scope.isFullScreen = (!$scope.isFullScreen);
            if ($scope.isFullScreen) {
                var el = document.getElementById("map-container"),
                rfs = el.requestFullScreen ||
                el.webkitRequestFullScreen ||
                el.mozRequestFullScreen;
                rfs.call(el);
            } else {
                var el = document,
                efs = el.cancelFullScreen ||
                el.webkitCancelFullScreen ||
                el.mozCancelFullScreen;
                efs.call(el);
            }
        };
        var renderContext = requestContext.getRenderContext("standard.dashboard");
        var allTeamMembers = [];
        var userActivityTimerID = null;
        var onlineUserTimerID = null;
        var teamActivityDisplayTimer = null;
        var teamActivityQueue = [];
        var mapJustLoaded = true;
        $scope.mapInfoBoxConfig = {
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(-133, -120),
            zIndex: null,
            boxStyle: {
                opacity: 1,
                width: "250px"
            },
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(30, 30),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false
        };
        $scope.mapOptions = {
            center: new $window.google.maps.LatLng(40.687537, -74.064331),
            zoom: 3,
            minZoom: 2,
            maxZoom: 12,
            panControl: false,
            streetViewControl: false,
            mapTypeId: $window.google.maps.MapTypeId.TERRAIN,
            mapTypeControlOptions: {
                mapTypeIds: $window.google.maps.MapTypeId.TERRAIN
            }
        };
        $scope.mapPopup = {
            user: {
                name: '',
                avatarUrl: ''
            },
            hasAction: false,
            action: {
                type: '',
                quantity: 0,
                subtype: '',
                isInstant: false
            },
            screenLink: '',
            projectLink: ''
        };
        $scope.myMarkers = [];
        $scope.onlineUserCount = 0;
        $scope.shareViewerCount = 0;
        $scope.isFullScreen = false;
        $scope.canUseFullScreenApi = false;
        $scope.remoteCalls = 0;
        $scope.$on("$destroy", function () {
            $window.clearInterval(onlineUserTimerID);
            $window.clearInterval(userActivityTimerID);
            $window.clearInterval(teamActivityDisplayTimer);
        });
        $scope.$watch("onlineUserCount", function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue > oldValue) {
                zoomMapToShowAllMarkers($scope.myMap);
            }
        });
        initialize();
    }
})(angular, InVision);
;
;
/*! dashboard-stats-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("dashboard.DashboardStatsController", Controller);
    /** @ngInject */
    function Controller($scope, $timeout, requestContext, $location, Deferred, modelEvents, dashboardStatPartial, dateHelper, moment, _, projectOverviewService, projectService, dashboardMapService, userService) {
        function applyRemoteData(stats, users, projects) {
            $scope.stats.projectCount = stats.totalProjects;
            $scope.stats.screenCount = stats.totalScreens;
            $scope.stats.stakeholderCount = stats.totalStakeholderViews;
            $scope.stats.commentCount = stats.totalComments;
            $scope.stats.revisionsPerScreen = stats.totalRevsPerScreen;
            $scope.stats.commentsPerProject = stats.totalCommentsPerProject;
            _.defaults($scope.stats, getDefaultStats());
            var userViews = [];
            var i = 0;
            var projectViews = [];
            _.forEach(users, function (user) {
                i++;
                if ($.trim(user.viewer_location) === "," ||
                $.trim(user.viewer_location) === "-, -") {
                    user.viewer_location = "";
                }
                userViews.push({
                    avatarID: user.avatarID,
                    userID: user.userID,
                    userName: user.name.replace(/Anonymous User/, "Anonymous"),
                    userInitials: userService.getInitials(user.name),
                    userHasSystemAvatar: userService.isSystemAvatar(user.avatarID),
                    location: user.viewer_location,
                    revisions: user.totalRevisions,
                    comments: user.totalComments,
                    rank: i
                });
            });
            viewStore['users'] = userViews;
            i = 0;
            _.forEach(projects, function (project) {
                i++;
                projectViews.push({
                    projectID: project.projectID,
                    name: project.name,
                    createdAt: project.createdAt,
                    revisions: project.totalRevisions,
                    comments: project.totalComments,
                    people: project.totalPeople,
                    homeScreenID: project.homeScreenID,
                    rank: i
                });
            });
            viewStore['projects'] = projectViews;
            $scope.projectViews['users'] = getViewsForPagination(viewStore, "users");
            $scope.projectViews['projects'] = getViewsForPagination(viewStore, "projects");
            $scope.setCurrentPage(1, "users");
            $scope.setCurrentPage(1, "projects");
            $scope.pagination.users.totalResults = userViews.length;
            $scope.pagination.projects.totalResults = projectViews.length;
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            $scope.timespans = createTimespans(new Date(), new Date(2001, 0, 1));
            var timespan = "";
            if (!$scope.selectedTimespan) {
                $scope.selectedTimespan = getDefaultTimespan();
            }
            timespan = $scope.selectedTimespan;
            var startTime = Math.min(timespan.start.unix(), new Date(2001, 0, 1));
            var endTime = timespan.end.unix() + (moment().zone() * 60);
            Deferred.handlePromise(
            projectOverviewService.getStatsByUser($scope.user.id, startTime, endTime),
            function (statsData) {
                $scope.isLoading = false;
                applyRemoteData(statsData.stats, statsData.users, statsData.projects);
            }
            );
        }
        function clearStats() {
            _.each($scope.statJustChanged, function (stat) {
                stat = false;
            });
        }
        function createTimespan(date, spanRange, earliestDate) {
            var range = spanRange || "day";
            /*
            range can be "day", "week", "earlier"
            "day" maps to beginging of date to end of date passed in
            "lastWeek" maps to begining of day that is -1 week from date to date end
            "earlier" maps from epoch to end of date
            */
            var timespan = {};
            switch (range) {
                case "day":
                    timespan.isDefault = false;
                    timespan.start = moment(date).startOf("day");
                    timespan.end = moment(date).endOf("day");
                    timespan.label = dateHelper.formatRecentDate(date, "ddd");
                    break;
                case "lastWeek":
                    timespan.start = moment(date).clone().startOf("day").subtract("weeks", 1);
                    timespan.end = moment(date).clone().endOf("day");
                    timespan.label = "Last 7 Days";
                    timespan.isDefault = true;
                    break;
                case "last2Weeks":
                    timespan.start = moment(date).clone().startOf("day").subtract("weeks", 2);
                    timespan.end = moment(date).clone().endOf("day");
                    timespan.label = "Last 2 Weeks";
                    timespan.isDefault = false;
                    break;
                case "lastMonth":
                    timespan.start = moment(date).clone().startOf("day").subtract("month", 1);
                    timespan.end = moment(date).clone().endOf("day");
                    timespan.label = "Last Month";
                    timespan.isDefault = false;
                    break;
                case "earlier":
                    timespan.start = moment.utc(earliestDate);
                    timespan.end = moment.utc(date);
                    timespan.label = "Overall";
                    timespan.isDefault = false;
                    break;
            }
            return timespan;
        }
        function createTimespans(currentDate, projectStartDate) {
            var timeSpans = [];
            var today = moment(currentDate);
            var yesterday = today.clone().subtract("days", 1);
            var tmpDate = today.clone().subtract("days", 2);
            timeSpans.push(createTimespan(today, "day", projectStartDate));
            timeSpans.push(createTimespan(yesterday, "day", projectStartDate));
            /*
            if( today.day() != 1 && today.day() != 2 ) {
            for( 
            tmpDate = today.clone().subtract( "days", 2 ) ;
            tmpDate.day() != 0; 
            tmpDate.subtract( "days", 1 ) 
            ) {
            timeSpans.push( createTimespan( tmpDate, "day", projectStartDate ) );
            }
            }*/
            timeSpans.push(createTimespan(moment(), "lastWeek", projectStartDate));
            timeSpans.push(createTimespan(moment(), "last2Weeks", projectStartDate));
            timeSpans.push(createTimespan(moment(), "lastMonth", projectStartDate));
            timeSpans = _.filter(timeSpans, function (timeSpan) {
                if (_.isUndefined(projectStartDate)) {
                    return true;
                } else {
                    var isTimeSpanAfterProject = (
                    timeSpan.end.isAfter(moment(projectStartDate).startOf("day")) ||
                    timeSpan.end.isSame(moment(projectStartDate).startOf("day"))
                    );
                    return (isTimeSpanAfterProject);
                }
            });
            return timeSpans;
        }
        function emphasizeStat(stat) {
            $scope.statJustChanged[stat] = true;
            $timeout(
            function () {
                $scope.statJustChanged[stat] = false;
            },
            6 * 1000
            );
        }
        function getViewsForPagination(viewCollection, type) {
            var views = viewCollection[type];
            var pagination = $scope.pagination[type];
            var startIndex = (pagination.currentPage - 1) * pagination.resultsPerPage;
            var endIndex = 0;
            endIndex = startIndex + pagination.resultsPerPage;
            $scope.pagination[type].firstResultBeingViewed = startIndex + 1;
            $scope.pagination[type].lastResultBeingViewed = _.min([endIndex, views.length]);
            $scope.pagination[type].hasMorePages = (endIndex < views.length);
            return views.slice(startIndex, endIndex);
        }
        function getDefaultTimespan() {
            return (_.find($scope.timespans, "isDefault"));
        }
        function getDefaultStats() {
            return ({
                projectCount: 0,
                screenCount: 0,
                projectViews: 0,
                stakeholderCount: 0,
                revisionsPerScreen: 0,
                commentCount: 0,
                commentsPerProject: 0
            });
        }
        $scope.setTimespan = function (timespan) {
            clearStats();
            $scope.respondingToRemoteData = false;
            $scope.selectedTimespan = timespan;
            loadRemoteData();
        };
        $scope.setResultsPerPage = function (type) { // we just add 10 to the number of results per page
            $scope.pagination[type].resultsPerPage += 10;
            $scope.setCurrentPage(1, type);
            $scope.projectViews[type] = getViewsForPagination(viewStore, type);
        };
        $scope.setCurrentPage = function (pageNum, type) {
            var maxPages = Math.ceil(viewStore[type].length / $scope.pagination[type].resultsPerPage);
            var tmpPageNum = Math.max(pageNum, 1);
            tmpPageNum = Math.min(tmpPageNum, maxPages);
            $scope.pagination[type].currentPage = tmpPageNum;
            $scope.projectViews[type] = getViewsForPagination(viewStore, type);
        };
        $scope.hasLocation = function (loc) {
            if (!loc) {
                return "noLocation";
            }
            return "";
        }
        $scope.stats = {
            projectCount: 0,
            screenCount: 0,
            stakeholderCount: 0,
            projectViews: 0,
            revisionsPerScreen: 0,
            commentCount: 0,
            commentsPerProject: 0
        };
        $scope.pagination = {
            users: {
                resultsPerPage: 10,
                currentPage: 1,
                hasMorePages: false,
                firstResultBeingViewed: 1,
                lastResultBeingViewed: 1,
                totalResults: 0
            },
            projects: {
                resultsPerPage: 10,
                currentPage: 1,
                hasMorePages: false,
                firstResultBeingViewed: 1,
                lastResultBeingViewed: 1,
                totalResults: 0
            }
        }
        $scope.projectViews = {
            users: [],
            projects: []
        };
        $scope.projectViewStats = [];
        $scope.timespans = [];
        $scope.statJustChanged = {
            projectCount: false,
            screenCount: false,
            stakeholderCount: false,
            commentCount: false,
            revisionsPerScreen: false,
            commentsPerProject: false
        };
        $scope.respondingToRemoteData = false;
        $scope.$on('updateStats', function (event, args) {
            if ($scope.selectedTimespan.label != 'Yesterday') {
                $scope.respondingToRemoteData = true;
                loadRemoteData();
            }
        });
        $scope.$watch('stats', function (newValue, oldValue) {
            if ($scope.respondingToRemoteData) { // don't update anything in response to changing the date selector
                _.each(newValue, function (val, stat) {
                    if (val != oldValue[stat]) {
                        emphasizeStat(stat);
                    }
                });
                $scope.respondingToRemoteData = false;
            }
        }, true);
        $scope.$on(
        "$destroy",
        function () {
        }
        );
        var viewStore = {
            users: [],
            projects: []
        };
        var renderContext = requestContext.getRenderContext("standard.dashboard");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! console-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("layouts.ConsoleController", Controller);
    /** @ngInject */
    function Controller(_, BaseController, sessionService, $rootScope, $scope, $window, $location, $timeout, requestContext, templateService, projectService, conversationService, consolePartial, modelEvents, screenService, hotspotService, Deferred, hashKeyCopier, userService) {
        function adjustBackgroundPosition(subview) {
            if (!_.isUndefined($scope.bodyStyle.backgroundPosition)) {
                var currentBackgroundPosition = $scope.bodyStyle.backgroundPosition;
                var currentBackgroundPositionX = currentBackgroundPosition.split(" ")[0];
                var backgroundPositionY = "0";
                if (subview === "build" || subview === "comments") {
                    backgroundPositionY = "47px";
                }
                $scope.updateBodyStyle({ "backgroundPosition": currentBackgroundPositionX + " " + backgroundPositionY });
            }
        }
        function augmentConversation(conversation) {
            conversation.isShown = true;
            conversation.isUnread = hasUnreadComments(conversation);
            conversation.isSaved = (conversation.id !== 0);
            conversation.isConversationPanelVisible = false;
            _.each(
            conversation.comments,
            function (comment) {
                comment.userInitials = userService.getInitials(comment.userName);
                comment.userHasSystemAvatar = userService.isSystemAvatar(comment.avatarID);
                comment.html = conversationService.getHtmlForComment(comment.comment);
            }
            );
            return (conversation);
        }
        function augmentConversations(conversations) {
            _.each(conversations, augmentConversation);
            return (conversations);
        }
        function augmentScreen(screen) {
            screen.workflowStatus = "In Progress";
            screen.isCompleted = false;
            screen.isApproved = false;
            if (screen.workflowStatusID === screenService.workflowStatus.COMPLETE) {
                screen.workflowStatus = "Needs Approval";
                screen.isCompleted = true;
                screen.isApproved = false;
            } else if (screen.workflowStatusID === screenService.workflowStatus.COMPLETE_AND_APPROVED) {
                screen.workflowStatus = "Approved";
                screen.isCompleted = false;
                screen.isApproved = true;
            }
            return (screen);
        }
        function augmentScreens(screens) {
            _.each(screens, augmentScreen);
            return (screens);
        }
        function getNextAvailableConversationLabel() {
            var labels = _.pluck($scope.conversations, "label");
            var maxLabel = _.max(
            labels,
            function (label) {
                return (parseInt(label, 10));
            }
            );
            return ((parseInt(maxLabel, 10) || 0) + 1);
        }
        function hasUnreadComments(conversation) {
            return (!!_.findWithProperty(conversation.comments, "isUnread", true));
        }
        function hideMenus() {
            $scope.hideScreenMenu();
            $scope.hideConfigMenu();
            $scope.hideWorkflowStatusMenu();
            $scope.hideReplaceScreenUploader();
        }
        function setProjectAndScreenID() {
            $scope.addScreenToPreviousScreenQueue($scope.screenID);
            $scope.projectID = requestContext.getParamAsInt("projectID");
            $scope.screenID = requestContext.getParamAsInt("screenID");
        }
        function addUploadedScreen(screen) {
            var existingScreen = _.findWithProperty($scope.screens, "id", screen.id);
            if (existingScreen) {
                _.extend(existingScreen, screen);
            } else {
                screen.unreadConversationCount = 0;
                screen.conversationCount = 0;
                screen.hotspotCount = 0;
                screen.updatedByUserName = sessionService.user.name;
                $scope.screens.push(screen);
            }
        }
        function checkProcessingScreens() {
            $scope.isCheckProcessingScreens = true;
            var processingScreens = _.filterWithProperty($scope.screens, "isProcessed", false);
            var screenIDsToCheck = _.difference(
            _.pluck(processingScreens, "id"),
            $scope.checkingProcessingScreenIDs
            );
            for (var i = 0; i < screenIDsToCheck.length; i++) {
                $scope.checkingProcessingScreenIDs.push(screenIDsToCheck[i]);
                Deferred.handlePromise(
                screenService.getByID(screenIDsToCheck[i], true),
                function (screen) {
                    if (screen.isProcessed == true) {
                        updateScreenInCollection(screen);
                    }
                    $scope.checkingProcessingScreenIDs = _.without(
                    $scope.checkingProcessingScreenIDs,
                    screen.id
                    );
                },
                function (response) {
                    $scope.openModalWindow("error", "For some reason, we can't check your screen's status. Try refreshing your browser.");
                    $scope.checkingProcessingScreenIDs = _.without(
                    $scope.checkingProcessingScreenIDs,
                    screen.id
                    );
                }
                );
            }
            processingScreens = _.filterWithProperty($scope.screens, "isProcessed", false);
            if (processingScreens.length > 0) {
                $timeout(checkProcessingScreens, 2000);
            } else {
                $scope.isCheckProcessingScreens = false;
            }
        }
        function updateScreenInCollection(screen) {
            var matchingScreen = _.findWithProperty($scope.screens, "id", screen.id);
            if (matchingScreen) {
                _.extendExistingProperties(matchingScreen, screen);
            }
        }
        function convertBottomPositionedHotspots() {
            for (var h = 0; h < $scope.hotspots.length; h++) {
                if ($scope.hotspots[h].isBottomAligned) {
                    $scope.hotspots[h].y = $scope.screen.height - ($scope.hotspots[h].y + $scope.hotspots[h].height);
                }
            }
        }
        function getScreen(screenID) {
            return _.findWithProperty($scope.screens, "id", screenID);
        }
        function getScreenIndex(screenID) {
            return (
            _.indexOfWithProperty($scope.screens, "id", screenID)
            );
        }
        function loadConfig(screen) {
            $scope.config = _.pick(screen,
            "alignment",
            "backgroundColor",
            "backgroundImagePosition"
            );
            if (!_.isUndefined($scope.config.backgroundImagePosition)) {
                switch ($scope.config.backgroundImagePosition) {
                    case "50% 0 no-repeat":
                        $scope.config.backgroundImagePosition = "center";
                        break;
                    case "repeat":
                        $scope.config.backgroundImagePosition = "tile";
                        break;
                    case "0 0 repeat-x":
                        $scope.config.backgroundImagePosition = "tile-horizontally";
                        break;
                }
            }
            if (_.isNumber(screen.backgroundImageID)) {
                $scope.config.backgroundImage = getBackgroundById(screen.backgroundImageID);
            } else {
                $scope.config.backgroundImage = getBackgroundById(0);
            }
        }
        function getBackgroundById(backgroundId) {
            return (
            _.find(
            $scope.backgroundImages,
            function (aBackground) {
                return (aBackground.id == backgroundId);
            }
            )
            );
        }
        function getBackgroundPath(background) {
            return ("url('/backgrounds/" + background.id + "/" + background.imageVersion + "')");
        }
        function getDefaultIsImageLoading() {
            return (true);
        }
        $scope.getNextScreenInSort = function (currentScreenID) {
            var currentScreenIndex = getScreenIndex(currentScreenID || $scope.screenID);
            if (
            (currentScreenIndex === -1) ||
            (currentScreenIndex === ($scope.screens.length - 1))
            ) {
                return (null);
            }
            return ($scope.screens[currentScreenIndex + 1]);
        }
        $scope.getPreviousScreenInSort = function (currentScreenID) {
            var currentScreenIndex = getScreenIndex(currentScreenID || $scope.screenID);
            if (
            (currentScreenIndex === -1) ||
            (currentScreenIndex === 0)
            ) {
                return (null);
            }
            return ($scope.screens[currentScreenIndex - 1]);
        }
        function getScreenNextOrPreviousScreen(currentScreenID, nextOrPrevious) {
            var movesInDirection = (nextOrPrevious == "next") ? 1 : -1;
            var targetScreenIndex = 0;
            var targetScreen = null;
            var currentScreenID = currentScreenID || $scope.screenID;
            var currentScreenIndex = 0;
            _.find($scope.screens,
            function (screen, index) {
                if (screen.id === currentScreenID) {
                    currentScreenIndex = index;
                    return true;
                }
            }
            );
            targetScreenIndex = currentScreenIndex + movesInDirection;
            if ($scope.screens.length > targetScreenIndex
            && targetScreenIndex >= 0) {
                return $scope.screens[targetScreenIndex];
            } else {
                return $scope.screens[currentScreenIndex];
            }
        }
        function getScreensToPreload(currentScreenID) {
            var screenIDIndex = {}
            var nextScreen = $scope.getNextScreenInSort(currentScreenID);
            var previousScreen = $scope.getPreviousScreenInSort(currentScreenID);
            if (nextScreen) {
                screenIDIndex[nextScreen.id] = true;
            }
            if (previousScreen) {
                screenIDIndex[previousScreen.id] = true;
            }
            for (var i = 0, length = $scope.hotspots.length ; i < length ; i++) {
                var hotspot = $scope.hotspots[i];
                if (hotspot.targetScreenID) {
                    screenIDIndex[hotspot.targetScreenID] = true;
                }
            }
            var screensToPreload = _.filter(
            $scope.screens,
            function (screen) {
                return (screenIDIndex.hasOwnProperty(screen.id));
            }
            );
            return (screensToPreload);
        }
        function addConversation(conversationID) {
            var conversationExists = _.findWithProperty($scope.conversations, "id", conversationID);
            if (!conversationExists) {
                Deferred.handlePromise(
                conversationService.getConversation(conversationID),
                function (conversation) {
                    $scope.conversations.push(augmentConversation(conversation));
                    $scope.$broadcast("conversationsChanged");
                },
                function () {
                }
                );
                $scope.loadStakeholders();
            }
        }
        function deleteConversation(conversationID) {
            $scope.conversations = _.rejectWithProperty($scope.conversations, "id", conversationID);
            $scope.$broadcast("conversationsChanged");
        }
        function hasSeenTourForThisMode(seenModes, subviewForTour) {
            var consoleModeAsInt = 1;
            var hasSeen = true;
            if (seenModes === LAST_CONSOLE_TOUR_STEP) {
                return true;
            }
            if (subviewForTour === "preview") {
                consoleModeAsInt = 1;
            }
            if (subviewForTour === "build") {
                consoleModeAsInt = 2;
            }
            if (subviewForTour === "comments") {
                consoleModeAsInt = 4;
            }
            if (subviewForTour === "history") {
                consoleModeAsInt = 8;
            }
            if (subviewForTour === "config") {
                consoleModeAsInt = 16;
            }
            hasSeen = ((seenModes & consoleModeAsInt) > 0);
            return hasSeen;
        }
        function loadTourStepIfNeeded(subviewOrConfig) {
            if (!hasSeenTourForThisMode(sessionService.user.hasSeenConsoleIntroModal, subviewOrConfig)) {
                if ($scope.isConsoleTourOpen) {
                    $rootScope.$broadcast("consoleSubviewChanged", subviewOrConfig);
                } else {
                    $scope.openModalWindow("consoleFirstUse", subviewOrConfig);
                }
            } else if ($scope.isConsoleTourOpen) {
                $rootScope.$broadcast("consoleSubviewChanged", subviewOrConfig, true);
            }
        }
        $scope.reloadHotspots = function () {
            Deferred.handleAllPromises(
            [
            hotspotService.getByScreenID($scope.screenID)
            ],
            function (hotspots) {
                $scope.hotspots = hotspots;
                convertBottomPositionedHotspots();
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we can't load your screen's hotspots. Try refreshing your browser.");
            }
            );
        };
        $scope.setHotspots = function (hotspots) {
            $scope.hotspots = hotspots;
        };
        $scope.startNewConversation = function (x, y, isForDevelopment) {
            var conversation = augmentConversation({
                id: 0,
                x: x,
                y: y,
                screenID: $scope.screenID,
                label: getNextAvailableConversationLabel(),
                isPrivate: false,
                isForDevelopment: isForDevelopment,
                isComplete: false,
                subscribers: []
            });
            conversation.isConversationPanelVisible = true;
            $scope.conversations.push(conversation);
            $scope.$broadcast("conversationsChanged");
        };
        $scope.markScreenAsRead = function () {
            Deferred.handlePromise(
            screenService.markScreenAsRead($scope.screenID)
            );
        };
        $scope.getScreenByID = function (screenID) {
            return _.findWithProperty($scope.screens, "id", screenID);
        }
        $scope.loadData = function (isFullLoad) {
            if (!isFullLoad) {
                $scope.screen = getScreen($scope.screenID);
            }
            $scope.isLoading = true;
            $scope.isDataLoading = true;
            $scope.isImageLoading = getDefaultIsImageLoading();
            Deferred.handleAllPromises(
            [
            consolePartial.get($scope.screenID)
            ],
            function (consolePartialResponse) {
                if (isFullLoad) {
                    $scope.project = consolePartialResponse.project;
                    $scope.projects = consolePartialResponse.projects;
                    $scope.screens = augmentScreens(consolePartialResponse.activeScreens);
                    $scope.dividers = consolePartialResponse.dividers;
                    $scope.mergeScreensAndDividersForDisplay();
                    $scope.projectOwnerSubscription = consolePartialResponse.projectOwnerSubscription;
                    $scope.backgroundSwatches = consolePartialResponse.projectBackgroundColors;
                    $scope.templates = consolePartialResponse.templates;
                    $scope.projectOwner = consolePartialResponse.projectOwner;
                    $scope.projectOwner.firstName = $scope.projectOwner.name.split(/\s/)[0];
                    $scope.isOwnedByUser = ($scope.user.id == $scope.project.userID);
                    $scope.templates = _.setProperty($scope.templates, "isDeleted", false);
                    $scope.backgroundImages = consolePartialResponse.projectBackgroundImages;
                    $scope.backgroundImages.unshift({ id: 0, clientFilename: " " });
                    $scope.projectMembers = _.rejectWithProperty($scope.projectMembers, "id", $scope.userID);
                    $scope.projectMembers = _.setProperty(consolePartialResponse.projectMembers, "isNotify", false);
                    $scope.projectStakeholders = _.setProperty(consolePartialResponse.projectStakeholders, "isNotify", false);
                    $scope.project.mobileTemplate = _.withProperty($scope.mobileDeviceTemplates, "mobileDeviceID", $scope.project.mobileDeviceID)[0];
                    $scope.project.appIconScreen = _.withProperty($scope.screens, "clientFilename", "apple-touch-icon.png")[0] || "";
                    $scope.project.homeScreen = $scope.screens[0];
                    $scope.applyScreenDisplayScale();
                }
                $scope.hotspots = consolePartialResponse.hotspots;
                $scope.screensToPreload = hashKeyCopier.copyHashKeys($scope.screensToPreload, getScreensToPreload($scope.screenID));
                var openConversation = _.findWithProperty($scope.conversations, "isConversationPanelVisible", true);
                $scope.conversations = augmentConversations(consolePartialResponse.conversations);
                if (openConversation) {
                    var conversationToOpen = _.findWithProperty($scope.conversations, "id", openConversation.id);
                    if (conversationToOpen) {
                        conversationToOpen.isConversationPanelVisible = true;
                    }
                }
                $scope.$broadcast("conversationsChanged");
                $scope.screen = getScreen($scope.screenID);
                loadConfig($scope.screen);
                $scope.isDataLoading = false;
                $scope.isLoading = $scope.isImageLoading;
                if ($scope.project.isOverQuota) {
                    $location.path("/projects/" + $scope.project.id);
                }
                if ($scope.screen.isUnread) {
                    $scope.screen.isUnread = false;
                    $scope.markScreenAsRead();
                }
                $scope.subview = (renderContext.getNextSection() || "preview");
                convertBottomPositionedHotspots();
            },
            function () {
                $scope.openModalWindow("error", "Sorry, you aren't a collaborator on the project you tried to access. Please inform the project owner.");
                $location.path("/");
            }
            );
        };
        $scope.loadStakeholders = function () {
            $scope.isLoading = true;
            var promise = Deferred.handlePromise(
            projectService.getStakeholders($scope.projectID),
            function (response) {
                $scope.isLoading = false;
                $scope.projectStakeholders = _.setProperty(response, "isNotify", false);
            }
            );
            return (promise);
        };
        $scope.addScreenToPreviousScreenQueue = function (screenID) {
            if (screenID && !isNavigatingToPreviousScreen) {
                $scope.previousScreenQueue.push(screenID);
            }
            isNavigatingToPreviousScreen = false;
        };
        $scope.setIsProjectMenuActive = function (isProjectMenuActive) {
            $scope.isProjectMenuActive = isProjectMenuActive;
        };
        $scope.closeProjectMenu = function () {
            closingProjectMenu = $timeout(function () {
                $scope.isProjectMenuActive = false;
            }, 100);
        };
        $scope.openProjectMenu = function () {
            $timeout.cancel(closingProjectMenu);
            $scope.isProjectMenuActive = true;
        };
        $scope.mergeScreensAndDividersForDisplay = function () {
            var displayObjectsTemp = [];
            for (var s = 0; s < $scope.screens.length; s++) {
                var dividers = _.filter($scope.dividers, function (divider) {
                    return divider.position == s;
                });
                if (dividers.length) {
                    for (var d = 0; d < dividers.length; d++) {
                        displayObjectsTemp.push(dividers[d]);
                    }
                }
                var screenObj = $scope.screens[s];
                screenObj.type = "screenObj";
                displayObjectsTemp.push(screenObj);
            }
            var dividers = _.filter($scope.dividers, function (divider) {
                return divider.position >= $scope.screens.length;
            });
            if (dividers) {
                for (var d = 0; d < dividers.length; d++) {
                    displayObjectsTemp.push(dividers[d]);
                }
            }
            $scope.displayObjects = hashKeyCopier.copyHashKeys($scope.displayObject, displayObjectsTemp);
        }
        $scope.applyScreenDisplayScale = function () {
            for (var s = 0; s < $scope.screens.length; s++) {
                if ($scope.project.isMobile) {
                    $scope.screens[s].displayScale = ($scope.project.mobileTemplate.viewportWidth / $scope.screens[s].width);
                } else {
                    $scope.screens[s].displayScale = 1;
                }
            }
        }
        $scope.toggleScreenMenuUploader = function () {
            if ($scope.isScreenMenuUploaderVisible) {
                $scope.isScreenMenuUploaderVisible = false;
            }
            else {
                $scope.isScreenMenuUploaderVisible = true;
            }
        };
        $scope.activateScreenMenuUploader = function () {
            $scope.isScreenMenuUploaderVisible = true;
        };
        $scope.activateTemplateMode = function () {
            $scope.templateMode = true;
        };
        $scope.activateThumbnailView = function () {
            $scope.screenMenuView = "thumbnails";
        };
        $scope.deactivateTemplateMode = function () {
            $scope.templateMode = false;
        };
        $scope.toggleScreenMenu = function (event) {
            if ($scope.isScreenMenuActive) {
                $scope.hideScreenMenu();
            }
            else {
                $scope.showScreenMenu();
            }
            event.preventDefault();
            return false;
        };
        $scope.hideScreenMenu = function () {
            $scope.isScreenMenuActive = false;
            $scope.isBrowseMode = false;
        };
        $scope.showScreenMenu = function (isBrowseMode, browseForHotspotID) {
            hideMenus();
            if (isBrowseMode) {
                $scope.isBrowseMode = true;
                $scope.browseForHotspotID = browseForHotspotID;
            }
            $scope.isScreenMenuActive = true;
        };
        $scope.selectScreen = function (screen, mode) {
            if ($scope.isBrowseMode) {
                $scope.$broadcast("hotspot.browse.screen.selected", screen.id, $scope.browseForHotspotID);
                $scope.hideScreenMenu();
            }
            else {
                if (screen.id == $scope.screenID) {
                    $scope.hideScreenMenu();
                }
                $scope.navigateToScreen(screen.id, mode);
            }
        };
        $scope.hideWorkflowStatusMenu = function () {
            $scope.isWorkflowStatusMenuActive = false;
        };
        $scope.setWorkflowStatus = function (workflowStatusID) {
            if ($scope.screen.workflowStatusID == workflowStatusID) {
                return ($scope.hideWorkflowStatusMenu());
            }
            Deferred.handlePromise(
            screenService.setWorkflowStatus($scope.screen.id, workflowStatusID),
            function (respons) {
                if (
                (workflowStatusID != 1) &&
                $scope.projectMembers.length > 1
                ) {
                    $scope.openModalWindow("workflowStatusNotification", $scope.screen.projectID, $scope.screen.id);
                }
            },
            function (resposne) {
                $scope.openModalWindow("error", "For some reason we couldn't update your screen status. Try refreshing your browser.");
            }
            );
            $scope.screen.workflowStatusID = workflowStatusID;
            augmentScreen($scope.screen);
            $scope.hideWorkflowStatusMenu();
        };
        $scope.showWorkflowStatusMenu = function () {
            hideMenus();
            $scope.isWorkflowStatusMenuActive = true;
        };
        $scope.toggleWorkflowStatusMenu = function ($event) {
            if ($scope.isWorkflowStatusMenuActive) {
                $scope.hideWorkflowStatusMenu();
            } else {
                $scope.showWorkflowStatusMenu();
            }
        };
        $scope.toggleConfigMenu = function (event) {
            if ($scope.isConfigMenuActive) {
                $scope.hideConfigMenu();
            }
            else {
                $scope.showConfigMenu();
            }
            event.preventDefault();
            return false;
        };
        $scope.hideConfigMenu = function () {
            if ($scope.isConfigMenuActive) {
                $scope.config = ng.copy($scope.configBackup);
            }
            $scope.isConfigMenuActive = false;
        };
        $scope.showConfigMenu = function () {
            hideMenus();
            $scope.isConfigMenuActive = true;
            if (_.isUndefined($scope.config)) {
                loadConfig($scope.screen);
            }
            $scope.configBackup = ng.copy($scope.config);
            if (!_.isUndefined($scope.config.backgroundImage)) {
                $scope.config.backgroundImage = getBackgroundById($scope.config.backgroundImage.id);
            }
            loadTourStepIfNeeded("config");
        };
        $scope.saveConfig = function () {
            $scope.isConfigMenuActive = false;
            if ($scope.config.applyToAll === true) {
                $scope.configBackup = ng.copy($scope.config);
                projectService.setConfigDefaults($scope.projectID, $scope.config);
                _.forEach($scope.screens, function (screen) {
                    screen.backgroundColor = $scope.config.backgroundColor;
                    screen.backgroundImageID = $scope.config.backgroundImage.id;
                    screen.backgroundImagePosition = $scope.config.backgroundImagePosition;
                    screen.alignment = $scope.config.alignment;
                    screenService.saveConfig(screen);
                });
                $scope.config.applyToAll = false;
            }
            else {
                $scope.configBackup = ng.copy($scope.config);
                $scope.screen.backgroundColor = $scope.config.backgroundColor;
                $scope.screen.backgroundImageID = $scope.config.backgroundImage.id;
                $scope.screen.backgroundImagePosition = $scope.config.backgroundImagePosition;
                $scope.screen.alignment = $scope.config.alignment;
                screenService.saveConfig($scope.screen);
            }
        };
        $scope.getConversations = function () {
            return $scope.conversations;
        };
        $scope.setConversations = function (conversations) {
            $scope.conversations = conversations;
            $scope.$broadcast("conversationsChanged");
        };
        $scope.navigateToExternalUrl = function (url, isOpenInNewWindow) {
            var newWindow = $window.open(url, "_blank");
            newWindow.focus();
        };
        $scope.navigateToNextScreenInSort = function (returnOnly) {
            if (_.isUndefined(returnOnly)) {
                returnOnly = false;
            }
            var nextScreen = $scope.getNextScreenInSort($scope.screenID);
            if (nextScreen) {
                if (returnOnly) {
                    return nextScreen;
                } else {
                    $scope.navigateToScreen(nextScreen.id, $scope.subview);
                }
            }
        };
        $scope.navigateToPreviousScreen = function (mode, returnOnly) {
            if (_.isUndefined(returnOnly)) {
                returnOnly = false;
            }
            if ($scope.previousScreenQueue.length) {
                var hasFoundPreviousScreen = false;
                while (!hasFoundPreviousScreen && $scope.previousScreenQueue.length) {
                    var id = $scope.previousScreenQueue.pop();
                    if (id !== $scope.screenID) {
                        hasFoundPreviousScreen = true;
                        isNavigatingToPreviousScreen = true;
                        if (returnOnly) {
                            return id;
                        } else {
                            $scope.navigateToScreen(id, mode);
                        }
                    }
                }
            }
        };
        $scope.navigateToPreviousScreenInSort = function (returnOnly) {
            if (_.isUndefined(returnOnly)) {
                returnOnly = false;
            }
            var previousScreen = $scope.getPreviousScreenInSort($scope.screenID);
            if (previousScreen) {
                if (returnOnly) {
                    return previousScreen;
                } else {
                    $scope.navigateToScreen(previousScreen.id, $scope.subview);
                }
            }
        };
        $scope.navigateToScreen = function (screenID, mode) {
            hideMenus();
            mode = mode || "preview";
            $location.path("/console/" + $scope.projectID + "/" + screenID + "/" + mode);
        };
        $scope.openShareModal = function () {
            $scope.openModalWindow("share", $scope.project.id, $scope.screenID);
        };
        $scope.toggleReplaceScreenUploader = function () {
            if ($scope.isScreenReplaceUploaderActive) {
                $scope.$broadcast("toggleScreenReplaceUploader", { showUploader: false });
            } else {
                hideMenus();
                $scope.$broadcast("toggleScreenReplaceUploader", { showUploader: true });
            }
        };
        $scope.hideReplaceScreenUploader = function () {
            if ($scope.isScreenReplaceUploaderActive) {
                $scope.$broadcast("toggleScreenReplaceUploader", { showUploader: false });
            }
        };
        $scope.showReplaceScreenUploader = function () {
            if (!$scope.isScreenReplaceUploaderActive) {
                $scope.$broadcast("toggleScreenReplaceUploader", { showUploader: true });
            }
        };
        $scope.setIsBottomBarShown = function (isBottomBarShown) {
            hideMenus();
            $scope.isBottomBarShown = isBottomBarShown;
        };
        $scope.saveTemplate = function (template, successCallback) {
            Deferred.handleAllPromises(
            [
            templateService.saveTemplate(template)
            ],
            function (response) {
                template.id = response.id;
                if (successCallback) {
                    successCallback();
                }
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we can't save your template. Try refreshing your browser.");
            }
            );
        };
        $scope.deleteTemplate = function (template) {
            template.isDeleted = true;
            $scope.$broadcast("templateDeleted");
            if (template.id) {
                Deferred.handlePromise(
                templateService.deleteTemplate(template),
                function () {
                    $scope.hotspots = _.rejectWithProperty($scope.hotspots, "templateID", template.id);
                    $scope.templates = _.rejectWithProperty($scope.templates, "id", template.id);
                },
                function () {
                    $scope.openModalWindow("error", "For some reason, we can't delete your template. Try refreshing your browser.");
                }
                );
            }
        };
        $scope.duplicateTemplate = function (template, event) {
            if (!template.id) {
                return;
            }
            Deferred.handleAllPromises(
            [
            templateService.duplicateTemplate(template.id)
            ],
            function (template) {
                $scope.templates.push(template);
                $scope.$broadcast("templateDuplicated");
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we can't duplicate your template. Try refreshing your browser.");
            }
            );
            event.stopPropagation();
            event.preventDefault();
            return false;
        };
        $scope.addTemplateToScreen = function (templateID, screenID, reloadHotspots) {
            if (reloadHotspots === undefined) {
                reloadHotspots = true;
            }
            var template = _.findWithProperty($scope.templates, "id", templateID);
            template.screens = template.screens || [];
            if (_.contains(template.screens, screenID) === false) {
                template.screens.push(screenID);
                Deferred.handleAllPromises(
                [
                templateService.addScreen(templateID, screenID)
                ],
                function (template) {
                    if (reloadHotspots) {
                        $scope.reloadHotspots();
                    }
                },
                function () {
                    $scope.openModalWindow("error", "For some reason, we can't add this screen to your template. Try refreshing your browser.");
                }
                );
            }
        };
        $scope.removeTemplateFromScreen = function (templateID, screenID) {
            var template = _.findWithProperty($scope.templates, "id", templateID);
            template.screens = template.screens || [];
            template.screens = _.reject(template.screens, function (id) {
                return id === screenID;
            });
            Deferred.handleAllPromises(
            [
            templateService.removeScreen(templateID, screenID)
            ],
            function (template) {
                $scope.hotspots = _.rejectWithProperty($scope.hotspots, "templateID", template.id);
            },
            function () {
                $scope.reloadHotspots();
            }
            );
        };
        $scope.getActiveTemplateCount = function (screenID) {
            var activeCount = 0;
            _.each($scope.templates, function (template) {
                if (_.indexOf(template.screens, screenID) !== -1 &&
                !template.isDeleted) {
                    activeCount++;
                }
            });
            return activeCount;
        };
        $scope.isTemplateActiveForScreen = function (templateID, screenID) {
            var isActive = false;
            _.each($scope.templates, function (template) {
                if (template.id === templateID) {
                    if (_.indexOf(template.screens, screenID) !== -1) {
                        isActive = true;
                        return false;
                    }
                }
            });
            return isActive;
        };
        $scope.setIsImageLoading = function (isImageLoading) {
            $scope.isImageLoading = isImageLoading;
            $scope.isLoading = true;
        };
        $scope.toggleTemplateForScreen = function (templateID, screenID) {
            var template = _.findWithProperty($scope.templates, "id", templateID);
            if (_.contains(template.screens, screenID)) {
                $scope.removeTemplateFromScreen(templateID, screenID);
            }
            else {
                $scope.addTemplateToScreen(templateID, screenID);
            }
        };
        var LAST_CONSOLE_TOUR_STEP = 31;
        var renderContext = requestContext.getRenderContext("console", ["projectID", "screenID"]);
        var isNavigatingToPreviousScreen = false;
        var closingProjectMenu = null;
        $scope.config = {
            applyToAll: false,
            alignment: "center",
            backgroundColor: "",
            backgroundImage: null,
            backgroundImagePosition: "center" // center, tile, tile-horizontally
        };
        $scope.screenFloat = { "float": "none" };
        $scope.screenMenuView = "thumbnails";
        $scope.isScreenMenuActive = false;
        $scope.isScreenMenuUploaderVisible = false;
        $scope.isScreenReplaceUploaderActive = false;
        $scope.isWorkflowStatusMenuActive = false;
        $scope.projectID = null;
        $scope.screenID = null;
        $scope.previousScreenQueue = [];
        $scope.project = null;
        $scope.screen = null;
        $scope.screens = [];
        $scope.screensToPreload = [];
        $scope.isLoading = true;
        $scope.isDataLoading = true;
        $scope.isImageLoading = getDefaultIsImageLoading();
        $scope.isBottomBarShown = true;
        $scope.isCheckProcessingScreens = false;
        $scope.checkingProcessingScreenIDs = [];
        $scope.subview = null;
        $scope.tourSubview = null;
        $scope.user = sessionService.user;
        $scope.userID = sessionService.user.id;
        $scope.projectOwnerSubscription = null;
        $scope.projectBackgroundImages = [];
        $scope.backgroundSwatches = [];
        $scope.projectMembers = [];
        $scope.isConsoleTourOpen = false;
        $scope.mobileDeviceTemplates = [
        {
            mobileDeviceID: 0,
            className: "desktop",
            viewportHeight: "",
            viewportWidth: ""
        },
        {
            mobileDeviceID: 1,
            className: "iphone-portrait",
            viewportHeight: "548",
            viewportWidth: "320"
        },
        {
            mobileDeviceID: 2,
            className: "iphone-landscape",
            viewportHeight: "300",
            viewportWidth: "570"
        },
        {
            mobileDeviceID: 3,
            className: "ipad-portrait",
            viewportHeight: "752",
            viewportWidth: "578"
        },
        {
            mobileDeviceID: 4,
            className: "ipad-landscape",
            viewportHeight: "561",
            viewportWidth: "770"
        }
        ];
        $scope.conversations = [];
        $scope.$watch(
        "screens",
        function (newValue) {
            if (!$scope.isCheckProcessingScreens && $scope.screens.length > 0) {
                checkProcessingScreens();
            }
            $scope.mergeScreensAndDividersForDisplay();
        },
        true
        );
        $scope.$watch(
        "config",
        function (newConfig) {
            modelEvents.trigger("screenConfig:changed", newConfig);
        },
        true
        );
        $scope.$watch(
        "subview",
        function (newSubview) {
            if (newSubview !== "preview") {
                $scope.isBottomBarShown = true;
            }
            adjustBackgroundPosition(newSubview);
            loadTourStepIfNeeded($scope.subview);
        }
        );
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("screenUploaded.console");
            modelEvents.off("subscriptionChanged.console");
            modelEvents.off("console:conversation:read");
            modelEvents.off("console:conversation:saved");
            modelEvents.off("screenConfig:changed");
            modelEvents.off("screenConfig:changed");
            modelEvents.off("conversationAdded");
            modelEvents.off("conversationDeleted");
            modelEvents.off("projectStakeholderRemoved");
            modelEvents.off("dividerCreated.console");
            modelEvents.off("dividerUpdated.console");
            modelEvents.off("dividerPositionsUpdated.console");
            modelEvents.off("dividerDeleted.console");
            $scope.clearBodyStyle();
            $rootScope.$broadcast("closingConsole");
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            setProjectAndScreenID();
            hideMenus();
            if (requestContext.hasParamChanged("projectID")) {
                $scope.loadData(true);
                $scope.subview = null;
            } else if (requestContext.hasParamChanged("screenID")) {
                $scope.loadData(false);
                $scope.subview = (renderContext.getNextSection() || "preview");
            } else if (!$scope.isLoading) {
                $scope.subview = (renderContext.getNextSection() || "preview");
                $scope.loadData(false);
            }
        }
        );
        $scope.$on(
        "consoleImageLoaded",
        function (event, imageElement) {
            $scope.isImageLoading = false;
            $scope.isLoading = $scope.isDataLoading;
        }
        );
        $scope.$on(
        "consoleTourClosed",
        function () {
            $scope.tourSubview = null;
            $scope.isConsoleTourOpen = false;
        }
        );
        $scope.$on(
        "consoleTourOpened",
        function (event, mode) {
            $scope.tourSubview = mode;
            $scope.isConsoleTourOpen = true;
        }
        );
        $scope.$on(
        "consoleTourChangedModes",
        function (event, mode) {
            $scope.tourSubview = mode;
        }
        );
        modelEvents.on(
        "screenConfig:changed",
        function (event, newConfig) {
            var cssToApply = {};
            if (_.isUndefined(newConfig)) {
                return;
            }
            if ($scope.subview === "history") {
                return;
            }
            cssToApply.backgroundColor = "#" + newConfig.backgroundColor;
            if (newConfig.alignment != "center") {
                cssToApply["float"] = newConfig.alignment;
            } else {
                cssToApply.margin = "0 auto";
                cssToApply["float"] = "none";
            }
            if (_.isObject(newConfig.backgroundImage)
            && newConfig.backgroundImage.id > 0) {
                cssToApply.backgroundImage = getBackgroundPath(newConfig.backgroundImage);
                var backgroundPositionY = "0";
                if ($scope.subview == "build") {
                    backgroundPositionY = "47px";
                }
                switch (newConfig.backgroundImagePosition) {
                    case "center":
                        cssToApply.backgroundRepeat = "no-repeat";
                        cssToApply.backgroundPosition = "50% " + backgroundPositionY;
                        break;
                    case "tile":
                        cssToApply.backgroundRepeat = "repeat";
                        cssToApply.backgroundPosition = "0 " + backgroundPositionY;
                        break;
                    case "tile-horizontally":
                        cssToApply.backgroundRepeat = "repeat-x";
                        cssToApply.backgroundPosition = "0 " + backgroundPositionY;
                        break;
                    default:
                        break;
                }
            } else {
                cssToApply.backgroundImage = "none";
            }
            $scope.screenFloat = { "float": cssToApply["float"] };
            $scope.updateBodyStyle(cssToApply);
            adjustBackgroundPosition($scope.subview);
        }
        );
        modelEvents.on(
        "subscriptionChanged.console",
        function (newPlan) {
            $scope.loadData(true);
        }
        );
        modelEvents.on(
        "screenUploaded.console",
        function (event, screen) {
            if (screen.projectID !== $scope.projectID) {
                return;
            }
            addUploadedScreen(screen);
        }
        );
        modelEvents.on(
        "conversationAdded",
        function (event, conversationID, screenID) {
            if ($scope.subview === "comments" &&
            $scope.screenID === screenID) {
                addConversation(conversationID);
            }
            var screen = _.findWithProperty($scope.screens, "id", screenID);
            if (screen) {
                screen.conversationCount++;
                screen.unreadConversationCount++;
            }
        });
        modelEvents.on(
        "conversationDeleted",
        function (event, conversationID) {
            if ($scope.subview === "comments") {
                deleteConversation(conversationID);
            }
        });
        modelEvents.on(
        "console:conversation:read",
        function (event, conversation) {
            var screen = _.findWithProperty($scope.screens, "id", conversation.screenID);
            if (screen) {
                screen.unreadConversationCount = Math.max(0, screen.unreadConversationCount - 1);
            }
        }
        );
        modelEvents.on(
        "projectStakeholderRemoved",
        function (event, projectID, userID) {
            $scope.projectStakeholders = _.rejectWithProperty($scope.projectStakeholders, "id", userID);
        }
        );
        modelEvents.on(
        "dividerCreated.console",
        function (event, divider) {
            $scope.dividers.push(divider);
            $scope.mergeScreensAndDividersForDisplay();
        }
        );
        modelEvents.on(
        "dividerDeleted.console",
        function (event, dividerID) {
            if (_.findWithProperty($scope.dividers, "dividerID", dividerID)) {
                $scope.dividers = _.withoutProperty($scope.dividers, "dividerID", dividerID);
                $scope.mergeScreensAndDividersForDisplay();
            }
        }
        );
        modelEvents.on(
        "dividerUpdated.console",
        function (event, response) {
            for (var d = 0; d < $scope.dividers.length; d++) {
                if ($scope.dividers[d].dividerID == response.dividerID) {
                    $scope.dividers[d].label = response.label;
                    break;
                }
            }
            for (var d = 0; d < $scope.displayObjects.length; d++) {
                if ($scope.displayObjects[d].dividerID == response.dividerID) {
                    $scope.displayObjects[d].label = response.label;
                    break;
                }
            }
        }
        );
        modelEvents.on(
        "dividerPositionsUpdated.console",
        function (event, dividers, screens) {
            var isPositionChanged = false;
            for (var sd = 0; sd < $scope.dividers.length; sd++) {
                for (var d = 0; d < dividers.length; d++) {
                    if ($scope.dividers[sd].dividerID == dividers[d].dividerID &&
                    $scope.dividers[sd].position != dividers[d].position
                    ) {
                        isPositionChanged = true;
                        break;
                    }
                }
            }
            if (isPositionChanged) {
                $scope.dividers = dividers;
                $scope.mergeScreensAndDividersForDisplay();
            }
        }
        );
        $scope.setBodyClass("l-console");
        $window.olark('api.box.hide');
        setProjectAndScreenID();
        $scope.loadData(true);
    }
})(angular, InVision);
;
;
/*! loading-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("layouts.LoadingController", Controller);
    /** @ngInject */
    function Controller($scope) {
    }
})(angular, InVision);
;
;
/*! modal-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("layouts.ModalController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        var originalBodyClass = "";
        $scope.subview = null;
        $scope.nextSubview = null;
        $scope.$on(
        "modalWindowHidden",
        function (event) {
            $scope.subview = $scope.nextSubview;
            $scope.nextSubview = null;
            if ($scope.subview === null) {
                $scope.setBodyClass(originalBodyClass);
            }
        }
        );
        $scope.$on(
        "openModalWindow",
        function (event, modalType, modalData) {
            if ($scope.subview === null) {
                modalWindowRequest.setRequest(modalType, modalData);
                $scope.subview = modalType;
                originalBodyClass = $scope.bodyClass;
                $scope.setBodyClass($scope.bodyClass + " modal-open");
            } else if (modalType === "error" && $scope.subview === modalType) {
                return;
            } else {
                modalWindowRequest.setRequest(modalType, modalData, true); // TRUE == suppress fade
                $scope.nextSubview = modalType;
                $scope.$broadcast("closeModalWindowWithoutFade");
            }
        }
        );
    }
})(angular, InVision);
;
;
/*! standard-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("layouts.StandardController", Controller);
    /** @ngInject */
    function Controller($scope, $window, Deferred, requestContext, accountService, sessionService, modelEvents, moment, standardPartial, dateHelper, $location, userService) {
        function applyRemoteData(projects) {
            $scope.projects = sortProjects(projects);
            applyShouldShowSampleScreens();
            applyScreenCountFormatting();
        }
        function applyScreenCountFormatting() {
            for (var i = 0, length = $scope.projects.length ; i < length ; i++) {
                if ($scope.projects[i].screenCount !== 1) {
                    $scope.projects[i].formattedScreenCount = $scope.projects[i].screenCount + ' screens';
                } else {
                    $scope.projects[i].formattedScreenCount = $scope.projects[i].screenCount + ' screen';
                }
            }
        }
        function applyShouldShowSampleScreens() {
            var nonSampleProjects = _.filterWithProperty($scope.projects, "isSample", false);
            var highestScreenCount = _.maxProperty(nonSampleProjects, "screenCount");
            $scope.showSampleScreens = (highestScreenCount === 0);
        }
        function isEnterprisePlan(subscription) {
            var enterprisePlanIds = [20, 22, 23, 24];
            return (_.contains(enterprisePlanIds, subscription.subscriptionPlanID));
        }
        function loadProjectsData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            standardPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.projects);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your projects. Try refreshing your browser.");
            }
            );
        }
        function showOrHideNewFeatureLink() {
            $scope.shouldShowNewFeatureLink = (($scope.user.featureAnnouncementsLastViewedAt / 1000) < ($scope.featureAnnouncementsLastUpdatedAt / 1000));
        }
        function sortProjects(projects) {
            projects.sort(
            function (a, b) {
                if (a.isFavorite && !b.isFavorite) {
                    return (-1);
                } else if (!a.isFavorite && b.isFavorite) {
                    return (1);
                } else {
                    return (a.name < b.name ? -1 : 1);
                }
            }
            );
            return (projects);
        }
        $scope.updateProjectLastAccessed = function (projectID) {
            for (var p = 0; p <= $scope.projects.length; p++) {
                if ($scope.projects[p].id == projectID) {
                    var UTCtimestamp = new Date().getTime();
                    $scope.projects[p].lastAccessedAt = UTCtimestamp;
                    break;  // escape loop if we found the project
                }
            }
        }
        $scope.closeProjectsMenu = function () {
            $scope.showProjectsMenu = false;
        };
        $scope.hideMacAppAdvert = function () {
            $scope.showMacAppAdvert = false;
            accountService.markMacAppAdvertisementClosed();
        };
        $scope.hideNewFeatureLink = function () {
            $scope.shouldShowNewFeatureLink = false;
        };
        $scope.hideTeamSetupTip = function (tipId) {
            if (tipId === 1) {
                $scope.showTeamSetupTip1 = false;
            } else {
                $scope.showTeamSetupTip2 = false;
            }
            accountService.markTeamSetupTipClosed(tipId);
        };
        $scope.logout = function () {
            try {
                $window.localStorage.clear();
            } catch (error) {
            }
        };
        $scope.openChangePlanModal = function () {
            if ($scope.isEnterpriseUser) {
                $scope.openModalWindow("changePlanEnterprise");
            } else {
                $scope.openModalWindow("changePlan");
            }
        };
        $scope.openContactUsModal = function () {
            if (!$scope.isEnterpriseUser) {
                $scope.openModalWindow("contactUs");
            } else {
                $scope.openModalWindow("contactUsEnterprise");
            }
        };
        $scope.openGettingStartedModal = function () {
            $scope.openModalWindow("gettingStarted");
        };
        $scope.openMacAppAdvertModal = function () {
            $scope.openModalWindow("macAppAdvert");
        };
        $scope.setShowSampleScreens = function (shouldShowSampleScreens) {
            $scope.showSampleScreens = shouldShowSampleScreens;
        };
        var renderContext = requestContext.getRenderContext("standard");
        $scope.user = sessionService.user;
        if (sessionService.subscription.expiresAt) {
            $scope.daysUntilSubscriptionExpires = moment(sessionService.subscription.expiresAt).diff(moment(), "days");
        }
        else {
            $scope.daysUntilSubscriptionExpires = 99999;
        }
        $scope.subview = renderContext.getNextSection();
        $scope.copyrightYear = (new Date()).getFullYear();
        $scope.shouldShowNewFeatureLink = false;
        $scope.projects = [];
        $scope.showProjectsMenu = false;
        $scope.isEnterpriseUser = isEnterprisePlan(sessionService.subscription);
        $scope.showSampleScreens = false;
        $scope.showMacAppAdvert = (!$scope.user.hasClosedMacAppAdvert);
        $scope.showTeamSetupTip1 = (!$scope.user.hasClosedTeamSetupTip1);
        $scope.showTeamSetupTip2 = (!$scope.user.hasClosedTeamSetupTip2);
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("accountUpdated.standardLayout");
            modelEvents.off("newFeatureAnnounced.standardLayout");
            modelEvents.off("projectCreated.standardLayout");
            modelEvents.off("projectDeleted.standardLayout");
            modelEvents.off("projectUpdated.standardLayout");
            modelEvents.off("screenSortUpdated.standardLayout");
            modelEvents.off("subscriptionChanged.standardLayout");
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            $scope.subview = renderContext.getNextSection();
            $scope.showProjectsMenu = false;
        }
        );
        $scope.$on("newFeatureAnnounced", showOrHideNewFeatureLink);
        modelEvents.on(
        "accountUpdated.standardLayout",
        function (event, account) {
            $scope.user.name = account.name;
            $scope.user.avatarID = account.avatarID;
            $scope.user.initials = userService.getInitials(account.name);
            $scope.user.hasSystemAvatar = userService.isSystemAvatar(account.avatarID);
            $scope.user.featureAnnouncementsLastViewedAt = account.featureAnnouncementsLastViewedAt;
            showOrHideNewFeatureLink();
        }
        );
        modelEvents.on(
        "projectCreated.standardLayout",
        function () {
            loadProjectsData();
        }
        );
        modelEvents.on(
        "projectDeleted.standardLayout",
        function (event, projectID) {
            $scope.projects = _.withoutProperty($scope.projects, "id", projectID);
        }
        );
        modelEvents.on(
        "projectUpdated.standardLayout",
        function (event, project) {
            if (project.isArchived || !project.isFavorite) {
                $scope.projects = _.withoutProperty($scope.projects, "id", project.id);
                return;
            }
            var cachedProject = _.findWithProperty($scope.projects, "id", project.id);
            if (cachedProject) {
                _.extendExistingProperties(cachedProject, project);
            } else {
                loadProjectsData();
            }
        }
        );
        modelEvents.on("screenSortUpdated.standardLayout", loadProjectsData);
        modelEvents.on(
        "subscriptionChanged.standardLayout",
        function (event, newPlan) {
            $scope.isEnterpriseUser = isEnterprisePlan(newPlan);
            if (newPlan.price === 0) {
                $window.olark('api.box.show');
            } else {
                $window.olark('api.box.hide');
            }
            if (newPlan.expiresAt) {
                $scope.daysUntilSubscriptionExpires = moment(newPlan).diff(moment(), "days");
            }
            else {
                $scope.daysUntilSubscriptionExpires = 99999;
            }
        }
        );
        showOrHideNewFeatureLink();
        $scope.setBodyClass("l-standard");
        if (sessionService.subscription.price === 0) {
            $window.olark('api.box.show');
        }
        loadProjectsData();
    }
})(angular, InVision);
;
;
/*! activate-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ActivateProjectController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, modalWindowRequest, _) {
        $scope.activateProject = function () {
            Deferred.handlePromise(
            projectService.activateProject($scope.projectID),
            function (project) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.errorMessage = response.message;
            }
            );
        };
        $scope.deleteProject = function () {
            $scope.openModalWindow("deleteProject", $scope.projectID);
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.projectName = modalWindowRequest.getData(1);
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! affiliate-activity-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.AffiliateActivityController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, affiliateActivityModalPartial, modalWindowRequest, dateHelper, userService, _) {
        function applyRemoteData(user, viewings) {
            $scope.user = user;
            $scope.user.initials = userService.getInitials(user.name);
            $scope.user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            $scope.viewings = augmentViewings(viewings);
            $scope.viewCount = viewings.length;
            $scope.commentCount = _.sumProperty(viewings, "commentCount");
        }
        function augmentViewings(viewings) {
            var today = dateHelper.today().getTime();
            var yesterday = dateHelper.yesterday().getTime();
            for (var i = 0 ; i < viewings.length ; i++) {
                var viewing = viewings[i];
                viewing.isDateStamp = true;
                viewing.dateLabel = dateHelper.formatDate(viewing.startedAt, "mm/dd/yyyy");
                viewing.timeLabel = dateHelper.formatTime(viewing.startedAt, "h:mmtt");
                if (viewing.startedAt >= today) {
                    viewing.dateLabel = "Today";
                    viewing.isDateStamp = false;
                } else if (viewing.startedAt >= yesterday) {
                    viewing.dateLabel = "Yesterday";
                    viewing.isDateStamp = false;
                }
            }
            viewings = _.sortOnProperty(viewings, "startedAt", "desc");
            return (viewings);
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            affiliateActivityModalPartial.get($scope.userID, $scope.projectID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.user, response.viewings);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load that stakeholder. Try refreshing your browser.");
            }
            );
        }
        $scope.userID = modalWindowRequest.getData(0);
        $scope.projectID = modalWindowRequest.getData(1);
        $scope.isLoading = false;
        $scope.user = null;
        $scope.viewings = [];
        $scope.viewCount = 0;
        $scope.commentCount = 0;
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! alert-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.AlertController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.alertMessage = modalWindowRequest.getData(0);
    }
})(angular, InVision);
;
;
/*! annual-upgrade-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.AnnualUpgradeController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, modalWindowRequest, changePlansPartial, subscriptionService, billingService, sessionService, Deferred, modelEvents, _) {
        function loadRemoteData() {
            Deferred.handlePromise(
            changePlansPartial.get(),
            function (response) {
                var currentPlan = response.currentPlan;
                var projects = response.projects;
                var plans = response.plans;
                var isCurrentPlanFree = isEquivalentToFreePlan(currentPlan.subscriptionPlanID);
                $scope.user.projectCount = projects.length;
                $scope.user.maxProjectMembersInAnyProject = (_.maxProperty(projects, "projectMemberCount") || 0);
                var isOverProjectQuota = ($scope.user.projectCount > currentPlan.maxProjectCount);
                var isOverProjectMemberQuota = ($scope.user.maxProjectMembersInAnyProject > currentPlan.maxProjectMemberCount);
                var isOverAnyQuota = (isOverProjectQuota || isOverProjectMemberQuota);
                if (isOverAnyQuota
                || currentPlan.subscriptionPlanID == PLAN_IDS.custom
                || isCurrentPlanFree
                || currentPlan.termLength != 1
                ) {
                    $scope.showAllPlans();
                }
                $scope.rawPlans = plans;
                $scope.plans = preparePlansForDisplay(currentPlan, plans);
                $scope.currentPlan = currentPlan;
                $scope.yearlySavings = getYearlySavings(currentPlan, plans);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your subscription information. Try refreshing your browser.");
            },
            true
            );
        };
        function getYearlySavings(currentPlan, plans) {
            var costOfYearOnCurrent = currentPlan.price * 12;
            var yearlyPlan = _.first(
            _.where(plans,
            {
                "monthlyPlanEquiv": currentPlan.subscriptionPlanID,
                "termLength": 12
            })
            );
            return (costOfYearOnCurrent - yearlyPlan.price);
        }
        function preparePlansForDisplay(currentPlan, plans) {
            var isCurrentPlanFree = isPlanFree(currentPlan);
            var filteredPlans = _.where(
            _.rejectWithProperty(plans, "termLength", 24),
            {
                "monthlyPlanEquiv": currentPlan.subscriptionPlanID
            }
            );
            var planToFeature = _.where(filteredPlans,
            {
                "monthlyPlanEquiv": currentPlan.subscriptionPlanID,
                "termLength": 12
            }
            );
            _.each(filteredPlans, function (plan) {
                plan.className = plan.name.toLowerCase().replace(/\s/gi, '-');
                plan.isShownByDefault = true;
                plan.isFeatured = (_.first(planToFeature).id === plan.id);
                plan.isCurrent = (plan.id === currentPlan.subscriptionPlanID);
            });
            return filteredPlans;
        };
        function isPlanFree(plan) {
            return plan.price == 0;
        };
        function isEquivalentToFreePlan(planID) {
            return (
            planID == PLAN_IDS.freeMonthly
            || planID == PLAN_IDS.freeOneYear
            || planID == PLAN_IDS.freeTwoYear
            );
        }
        $scope.closeModalWindow = function () {
            $scope.closeModalWindow();
        };
        $scope.showAllPlans = function () {
            $scope.openModalWindow("changePlan", { showAllPlans: true, subview: "oneYear" });
        };
        $scope.changePlanTo = function ($event, plan) {
            $event.preventDefault();
            $scope.selectedPlan = plan;
            var termForAlternativeOption = (plan.termLength == 1) ? 12 : 1;
            var isZeroCost = isPlanFree(plan);
            var isOverProjectQuota = ($scope.user.projectCount > plan.maxProjectCount);
            var isOverProjectMemberQuota = ($scope.user.maxProjectMembersInAnyProject > plan.maxProjectMemberCount);
            var planData = {
                "isProrated": false,
                "prorateAmount": 0,
                "selectedPlan": plan,
                "alternativeTermOption": null
            };
            if (!isZeroCost) {
                isGoingToBillingModal = true;
                return ($scope.openModalWindow("changePlanBilling", planData));
            }
            Deferred.handlePromise(
            subscriptionService.changePlan($scope.selectedPlan),
            function (newPlan) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't change your subscription plan. Try refreshing your browser.");
            }
            );
        }
        var PLAN_IDS = {
            freeMonthly: 1,
            freeOneYear: 16,
            freeTwoYear: 17,
            starterMonthly: 2,
            starterOneYear: 18,
            starterTwoYear: 19,
            professionalMonthly: 3,
            professionalOneYear: 8,
            professionalTwoYear: 9,
            studioMonthly: 4,
            studioOneYear: 10,
            studioTwoYear: 11,
            studioPlusMonthly: 7,
            studioPlusOneYear: 12,
            studioPlusTwoYear: 13,
            agencyMonthly: 5,
            agencyOneYear: 14,
            agencyTwoYear: 15,
            enterprise: 20,
            custom: 21
        };
        var isGoingToBillingModal = false;
        var modalData = (modalWindowRequest.getData(0) || {});
        _.defaults(modalData, { showAllPlans: false });
        $scope.plans = [];
        $scope.selectedPlan = null;
        $scope.showOverProjectWarning = false;
        $scope.showOverProjectMemberWarning = false;
        $scope.yearlySavings = 0;
        $scope.user = {
            projectCount: 0,
            maxProjectMembersInAnyProject: 0
        };
        $scope.$on(
        "$destroy",
        function () {
        }
        );
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! archive-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ArchiveProjectController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, modalWindowRequest, _) {
        $scope.archiveProject = function () {
            Deferred.handlePromise(
            projectService.archiveProject($scope.projectID),
            function (project) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.errorMessage = response.message;
            }
            );
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! change-plan-billing-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.filter('numberFormat', function () {
        return function (number, format) {
            var out = "";
            var minLength = format.length;
            var leftZeroPad = format.search(/9/) + 2;
            var numsInFormat = (minLength - leftZeroPad) + 2;
            var numberAsStr = Number(number).toString();
            if (numberAsStr.length >= minLength) {
                out = numberAsStr;
            } else if (numberAsStr.length > numsInFormat) {
                leftZeroPad = minLength - numberAsStr.length;
                out = new Array(Math.max(leftZeroPad + 1, 0)).join('0');
                out += numberAsStr;
            } else {
                out = new Array(Math.max(leftZeroPad - 1, 0)).join('0');
                out += numberAsStr;
            }
            return out;
        }
    });
    app.controller("modal.ChangePlanBillingController", Controller);
    /** @ngInject */
    function Controller(
    $scope,
    $window,
    modalWindowRequest,
    subscriptionService,
    billingService,
    sessionService,
    modelEvents,
    Deferred, _) {
        function loadRemoteData() {
            Deferred.handleAllPromises(
            [
            subscriptionService.getCurrentPlan(),
            billingService.getPaymentInfo()
            ],
            function (currentPlan, billingInfo) {
                var isCurrentPlanFree = (currentPlan.price == 0);
                $scope.currentPlan = currentPlan;
                if (billingInfo.lastFourDigits && billingInfo.lastFourDigits.length == 4) {
                    $scope.creditCardNumber = "**** **** **** " + billingInfo.lastFourDigits;
                    $scope.creditCardCVV = "***";
                    $scope.creditCardFullName = billingInfo.name;
                    $scope.creditCardExpiryMonth = billingInfo.expirationMonth;
                    $scope.creditCardExpiryYear = billingInfo.expirationYear;
                }
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your subscription information. Try refreshing your browser.");
            },
            true
            );
        };
        function calculateYearlySavings(selectedPlan, alternativePlan) {
            if (selectedPlan.termLength !== 1) {
                return 0;
            }
            return (selectedPlan.price * alternativePlan.termLength) - alternativePlan.price;
        };
        function makeRequestToChangePlan(plan) {
            $scope.submissionInProgress = true;
            setButtonLabel();
            Deferred.handlePromise(
            subscriptionService.changePlan(
            plan
            ),
            function (newPlan) {
                $scope.submissionInProgress = false;
                setButtonLabel();
                $scope.openModalWindow("changePlanConfirm", newPlan, isDowngrade);
            },
            function (response) {
                $scope.submissionInProgress = false;
                setButtonLabel();
                $scope.creditCardErrorMessage = response.message;
            }
            );
        }
        function setButtonLabel() {
            if ($scope.submissionInProgress) {
                $scope.buttonLabel = "Please Wait...";
            } else if (!_.isUndefined($scope.selectedPlan.transitionType) &&
            $scope.selectedPlan.transitionType === "downgrade") {
                $scope.buttonLabel = "Choose This Plan";
            } else {
                $scope.buttonLabel = "Upgrade Your Account";
            }
        }
        $scope.goBackToPlans = function () {
            $scope.openModalWindow("changePlan");
        };
        $scope.changePlan = function () {
            $scope.$broadcast("autofillCheck.update");
            var hasCardInfoChanged = $scope.creditCard.$dirty;
            var hasCardNameChanged = $scope.creditCard.creditCardFullName.$dirty;
            var hasAnyNonNameCardInfoChanged = (
            $scope.creditCard.creditCardNumber.$dirty ||
            $scope.creditCard.creditCardCVV.$dirty ||
            $scope.creditCard.creditCardExpiryMonth.$dirty ||
            $scope.creditCard.creditCardExpiryYear.$dirty
            );
            if ($scope.creditCardNumber.length == 0) {
                $scope.creditCardErrorMessage = "Please enter a valid card number.";
                return;
            }
            if (hasCardInfoChanged) {
                var firstName = $scope.creditCardFullName.split(/\s/).splice(0, 1).toString();
                var lastName = $scope.creditCardFullName.split(/\s/).splice(-1, 1).toString();
                $scope.creditCardNumber = $scope.creditCardNumber.replace(/\D/g, '');
                var isAMEX = $scope.creditCardNumber.match(/^3[47][0-9]{13}$/);
                if (isAMEX && $scope.creditCardCVV.length !== 4) {
                    $scope.creditCardErrorMessage = "The CVV must be 4 digits for American Express cards.";
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    return;
                } else if ((!isAMEX) && $scope.creditCardCVV.length !== 3) {
                    $scope.creditCardErrorMessage = "The CVV must be 3 digits for your card.";
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    return;
                }
                $scope.submissionInProgress = true;
                setButtonLabel();
                $scope.creditCardErrorMessage = "";
                $scope.shouldShowInternationalErrorInfo = false;
                Deferred.handlePromise(
                billingService.changeCreditCard(
                hasAnyNonNameCardInfoChanged,
                false,
                firstName,
                lastName,
                $scope.creditCardNumber,
                $scope.creditCardExpiryMonth,
                $scope.creditCardExpiryYear,
                $scope.creditCardCVV
                ),
                function (paymentInfo) {
                    try {
                        if ($window.__adroll_loaded) {
                            $window.adroll_segments = "converted-upgrade";
                            __adroll.render_pixel_code(adroll_adv_id, adroll_pix_id);
                        }
                    } catch (exception) { }
                    modelEvents.trigger("billingInfo:updated", paymentInfo);
                    makeRequestToChangePlan($scope.selectedPlan);
                },
                function (response) {
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    $scope.creditCardErrorMessage = response.message;
                    $scope.creditCardErrorCount++;
                    if ($scope.creditCardErrorCount >= 2) {
                        $scope.shouldShowInternationalErrorInfo = true;
                    }
                    modelEvents.trigger("billingInfo:error", response);
                }
                );
            } else {
                makeRequestToChangePlan($scope.selectedPlan);
            }
        };
        $scope.clearCardValues = function () {
            if ($scope.creditCard.creditCardNumber.$pristine) {
                $scope.creditCardNumber = "";
            }
            if ($scope.creditCard.creditCardCVV.$pristine) {
                $scope.creditCardCVV = "";
            }
            /* Don't clear theses as they'll still be sent propperly.
            if( $scope.creditCard.creditCardFullName.$pristine ) {
            $scope.creditCardFullName = "";
            }
            if( $scope.creditCard.creditCardExpiryYear.$pristine ) {
            $scope.creditCardExpiryYear = "";
            }
            if( $scope.creditCard.creditCardExpiryMonth.$pristine ) {
            $scope.creditCardExpiryMonth = "";
            }
            */
        };
        $scope.swapForAlternativePlan = function () {
            var temp = null;
            temp = $scope.selectedPlan;
            $scope.selectedPlan = $scope.alternativePlan;
            $scope.alternativePlan = temp;
        };
        var currentDate = new Date();
        var nextDefaultExpirationDate = null;
        var isDowngrade = false;
        $scope.monthsInForm = _.range(1, 13);
        $scope.yearsInForm = _.range(currentDate.getFullYear(), currentDate.getFullYear() + 10);
        if (currentDate.getMonth() == 11) {
            nextDefaultExpirationDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        } else {
            nextDefaultExpirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
        $scope.creditCardFullName = sessionService.user.name;
        $scope.creditCardNumber = "";
        $scope.creditCardCVV = "";
        $scope.creditCardExpiryYear = nextDefaultExpirationDate.getFullYear();
        $scope.creditCardExpiryMonth = nextDefaultExpirationDate.getMonth() + 1;
        var upgradeData = modalWindowRequest.getData(0);
        $scope.selectedPlan = upgradeData.selectedPlan;
        isDowngrade = ($scope.selectedPlan.transitionType == "downgrade");
        $scope.hasAlternativePlan = false;
        if (!_.isNull(upgradeData.alternativeTermOption)) {
            $scope.hasAlternativePlan = true;
        }
        $scope.alternativePlan = upgradeData.alternativeTermOption;
        $scope.yearlySaving = calculateYearlySavings;
        $scope.isProrated = upgradeData.isProrated;
        $scope.prorateAmount = upgradeData.prorateAmount;
        $scope.creditCardErrorMessage = "";
        $scope.creditCardErrorCount = 0;
        $scope.shouldShowInternationalErrorInfo = false;
        $scope.submissionInProgress = false;
        $scope.buttonLabel = "";
        $scope.showCoupon = false;
        $scope.carouselStartPos = 1;
        setButtonLabel();
        $scope.$on(
        "$destroy",
        function () {
            $window._kiq.push(['hideSurvey']);
            if (sessionService.subscription.price > 0) {
                $window.olark('api.box.hide');
            }
        }
        );
        $window.olark('api.box.show');
        $window._kmq.push(['record', 'Billing Page Viewed']);
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! change-plan-billing-enterprise-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ChangePlanBillingEnterpriseController", Controller);
    /** @ngInject */
    function Controller(
    $scope,
    $window,
    modalWindowRequest,
    subscriptionService,
    billingService,
    sessionService,
    modelEvents,
    Deferred, _) {
        function loadRemoteData() {
            Deferred.handleAllPromises(
            [
            subscriptionService.getCurrentPlan(),
            billingService.getPaymentInfo()
            ],
            function (currentPlan, billingInfo) {
                var isCurrentPlanFree = (currentPlan.price === 0);
                $scope.currentPlan = currentPlan;
                setSalesRepBasedOnNote(currentPlan.notes);
                if (billingInfo.lastFourDigits && billingInfo.lastFourDigits.length === 4) {
                    $scope.creditCardNumber = "**** **** **** " + billingInfo.lastFourDigits;
                    $scope.creditCardCVV = "***";
                    $scope.creditCardFullName = billingInfo.name;
                    $scope.creditCardExpiryMonth = billingInfo.expirationMonth;
                    $scope.creditCardExpiryYear = billingInfo.expirationYear;
                }
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your subscription information. Try refreshing your browser.");
            },
            true
            );
        }
        function setSalesRepBasedOnNote(note) {
            var possibleRepEmail = note.match(/(\w*@invisionapp\.com)/);
            if (!_.isNull(possibleRepEmail) && !_.isUndefined(SALES_REPS[possibleRepEmail[0]])) {
                $scope.salesRep = SALES_REPS[possibleRepEmail[0]];
            } else {
                $scope.salesRep = SALES_REPS["clark@invisionapp.com"];
            }
        }
        function makeRequestToChangePlan(plan, coupon) {
            $scope.submissionInProgress = true;
            setButtonLabel();
            Deferred.handlePromise(
            subscriptionService.changePlan(
            plan,
            coupon
            ),
            function (newPlan) {
                $scope.submissionInProgress = false;
                setButtonLabel();
                $scope.openModalWindow("changePlanConfirmEnterprise", newPlan);
            },
            function (response) {
                $scope.submissionInProgress = false;
                setButtonLabel();
                $scope.creditCardErrorMessage = response.message;
            }
            );
        }
        function setButtonLabel() {
            if ($scope.submissionInProgress) {
                $scope.buttonLabel = "Please Wait...";
            } else if (!_.isUndefined($scope.selectedPlan.transitionType) &&
            $scope.selectedPlan.transitionType === "downgrade") {
                $scope.buttonLabel = "Choose This Plan";
            } else {
                $scope.buttonLabel = "Upgrade Your Account";
            }
        }
        $scope.changePlan = function () {
            $scope.$broadcast("autofillCheck.update");
            var hasCardInfoChanged = $scope.creditCard.$dirty;
            var hasCardNameChanged = $scope.creditCard.creditCardFullName.$dirty;
            var hasAnyNonNameCardInfoChanged = (
            $scope.creditCard.creditCardNumber.$dirty ||
            $scope.creditCard.creditCardCVV.$dirty ||
            $scope.creditCard.creditCardExpiryMonth.$dirty ||
            $scope.creditCard.creditCardExpiryYear.$dirty
            );
            if (hasCardInfoChanged) {
                var firstName = $scope.creditCardFullName.split(/\s/).splice(0, 1).toString();
                var lastName = $scope.creditCardFullName.split(/\s/).splice(-1, 1).toString();
                var isAMEX = $scope.creditCardNumber.match(/^3[47][0-9]{13}$/);
                if (isAMEX && $scope.creditCardCVV.length !== 4) {
                    $scope.creditCardErrorMessage = "The CVV must be 4 digits for American Express cards.";
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    return;
                } else if ((!isAMEX) && $scope.creditCardCVV.length !== 3) {
                    $scope.creditCardErrorMessage = "The CVV must be 3 digits for your card.";
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    return;
                }
                $scope.submissionInProgress = true;
                setButtonLabel();
                $scope.creditCardErrorMessage = "";
                $scope.shouldShowInternationalErrorInfo = false;
                Deferred.handlePromise(
                billingService.changeCreditCard(
                hasAnyNonNameCardInfoChanged,
                false,
                firstName,
                lastName,
                $scope.creditCardNumber,
                $scope.creditCardExpiryMonth,
                $scope.creditCardExpiryYear,
                $scope.creditCardCVV
                ),
                function (paymentInfo) {
                    modelEvents.trigger("billingInfo:updated", paymentInfo);
                    makeRequestToChangePlan($scope.selectedPlan, $scope.coupon);
                },
                function (response) {
                    $scope.submissionInProgress = false;
                    setButtonLabel();
                    $scope.creditCardErrorMessage = response.message;
                    $scope.creditCardErrorCount++;
                    if ($scope.creditCardErrorCount >= 2) {
                        $scope.shouldShowInternationalErrorInfo = true;
                    }
                    modelEvents.trigger("billingInfo:error", response);
                }
                );
            } else {
                makeRequestToChangePlan($scope.selectedPlan, $scope.coupon);
            }
        };
        $scope.clearCardValues = function () {
            if ($scope.creditCard.creditCardNumber.$pristine) {
                $scope.creditCardNumber = "";
            }
            if ($scope.creditCard.creditCardCVV.$pristine) {
                $scope.creditCardCVV = "";
            }
            /* Don't clear theses as they'll still be sent propperly.
            if( $scope.creditCard.creditCardFullName.$pristine ) {
            $scope.creditCardFullName = "";
            }
            if( $scope.creditCard.creditCardExpiryYear.$pristine ) {
            $scope.creditCardExpiryYear = "";
            }
            if( $scope.creditCard.creditCardExpiryMonth.$pristine ) {
            $scope.creditCardExpiryMonth = "";
            }
            */
        };
        $scope.swapForAlternativePlan = function () {
            var temp = null;
            temp = $scope.selectedPlan;
            $scope.selectedPlan = $scope.alternativePlan;
            $scope.alternativePlan = temp;
        };
        var SALES_REPS = {
            "clark@invisionapp.com":
            {
                headshot: "clark-headshot.png",
                phone: "1-877-932-7111",
                email: "clark@invisionapp.com"
            },
            "ryanduffy@invisionapp.com":
            {
                headshot: "ryan-headshot.png",
                phone: "916-532-7020",
                email: "ryanduffy@invisionapp.com"
            },
            "ahad@invisionapp.com":
            {
                headshot: "ahad-headshot.png",
                phone: "214-995-3125",
                email: "ahad@invisionapp.com"
            },
            "stuart@invisionapp.com":
            {
                headshot: "stuart-headshot.png",
                phone: "214-995-3125",
                email: "stuart@invisionapp.com"
            }
        };
        var currentDate = new Date();
        var nextDefaultExpirationDate = null;
        $scope.monthsInForm = _.range(1, 13);
        $scope.yearsInForm = _.range(currentDate.getFullYear(), currentDate.getFullYear() + 10);
        if (currentDate.getMonth() == 11) {
            nextDefaultExpirationDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        } else {
            nextDefaultExpirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
        $scope.creditCardFullName = sessionService.user.name;
        $scope.creditCardNumber = "";
        $scope.creditCardCVV = "";
        $scope.creditCardExpiryYear = nextDefaultExpirationDate.getFullYear();
        $scope.creditCardExpiryMonth = nextDefaultExpirationDate.getMonth() + 1;
        var upgradeData = modalWindowRequest.getData(0);
        $scope.selectedPlan = upgradeData.selectedPlan;
        $scope.hasAlternativePlan = false;
        if (!_.isNull(upgradeData.alternativeTermOption)) {
            $scope.hasAlternativePlan = true;
        }
        $scope.alternativePlan = upgradeData.alternativeTermOption;
        $scope.isProrated = upgradeData.isProrated;
        $scope.prorateAmount = upgradeData.prorateAmount;
        $scope.creditCardErrorMessage = "";
        $scope.creditCardErrorCount = 0;
        $scope.shouldShowInternationalErrorInfo = false;
        $scope.submissionInProgress = false;
        $scope.buttonLabel = "";
        $scope.salesRep = SALES_REPS.clark;
        $scope.price = $scope.selectedPlan.price;
        $scope.coupon = "";
        $scope.showCoupon = false;
        setButtonLabel();
        $scope.$on(
        "$destroy",
        function () {
            $window._kiq.push(['hideSurvey']);
            if (sessionService.subscription.price > 0) {
                $window.olark('api.box.hide');
            }
        }
        );
        $scope.$watch(
        "coupon",
        function (newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            if (newVal === "enterprise-loyalty") {
                $scope.price = $scope.selectedPlan.price * .8;
            } else if (newVal === "enterprise-bonus") {
                $scope.price = $scope.selectedPlan.price * .5;
            } else if (newVal === "thanks-jiffy" && $scope.selectedPlan.price === 30000) {
                $scope.price = $scope.selectedPlan.price - 26500;
            } else {
                $scope.price = $scope.selectedPlan.price;
            }
        });
        $window.olark('api.box.show');
        $window._kmq.push(['record', 'Billing Page Viewed']);
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! change-plan-confirm-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ChangePlanConfirmController", Controller);
    /** @ngInject */
    function Controller($scope, $location, sessionService, modalWindowRequest, _) {
        $scope.openMyInfo = function () {
            $location.path("/team/" + sessionService.user.id + "/profile");
            $scope.closeModalWindow();
        };
        $scope.selectedPlan = modalWindowRequest.getData(0);
        $scope.isDowngrade = modalWindowRequest.getData(1, false);
        $scope.isCompany = sessionService.user.isCompany;
        $scope.carouselStartPos = 2;
    }
})(angular, InVision);
;
;
/*! change-plan-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ChangePlanController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, modalWindowRequest, changePlansPartial, subscriptionService, billingService, sessionService, Deferred, modelEvents, accountService, moment, _) {
        function loadRemoteData() {
            Deferred.handlePromise(
            changePlansPartial.get(),
            function (response) {
                var currentPlan = response.currentPlan;
                var projects = response.projects;
                var plans = response.plans;
                var lastUpgradeDate = response.lastUpgradeDate;
                var user = response.user;
                var isCurrentPlanFree = isEquivalentToFreePlan(currentPlan.subscriptionPlanID);
                if (isCurrentPlanFree) {
                    $scope.allPlansShown = true;
                    plans = _.filter(
                    plans,
                    function (plan) {
                        return (
                        plan.id !== PLAN_IDS.studioPlusMonthly &&
                        plan.id !== PLAN_IDS.studioPlusOneYear &&
                        plan.id !== PLAN_IDS.studioPlusTwoYear
                        );
                    }
                    );
                }
                if (currentPlan.subscriptionPlanID === PLAN_IDS.enterprise_trial ||
                currentPlan.subscriptionPlanID === PLAN_IDS.enterprise ||
                currentPlan.subscriptionPlanID === PLAN_IDS.enterprise_tier2 ||
                currentPlan.subscriptionPlanID === PLAN_IDS.enterprise_tier3
                ) {
                    $scope.openModalWindow("changePlanEnterprise")
                }
                $scope.subview = 'monthly';
                $scope.user.projectCount = projects.length;
                $scope.user.maxProjectMembersInAnyProject = (_.maxProperty(projects, "projectMemberCount") || 0);
                $scope.rawPlans = plans;
                $scope.plans = preparePlansForDisplay(currentPlan, plans);
                $scope.currentPlan = currentPlan;
                setQualarooData(currentPlan, user, lastUpgradeDate, projects);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your subscription information. Try refreshing your browser.");
            },
            true
            );
        }
        function setQualarooData(currentPlan, user, lastUpgradeDate, projects) {
            var qualarooData = {};
            qualarooData["Signup Date"] = moment(user.createdAt).format("MMM D, YYYY");
            qualarooData["Plan"] = currentPlan.name;
            qualarooData["Project Count"] = projects.length;
            qualarooData["Over-quota Project Count"] = (_.filterWithProperty(projects, "isOverQuota", true).length || 0);
            if (_.isNumber(lastUpgradeDate)) {
                qualarooData["Last Upgrade Date"] = moment(lastUpgradeDate).format("MMM D, YYYY");
            }
            if (_.isNumber(currentPlan.projectGracePeriodEndsAt)) {
                qualarooData["Grace Period Ended At"] = moment(currentPlan.projectGracePeriodEndsAt).format("MMM D, YYYY");
            }
            $window._kiq.push(['set', qualarooData]);
        }
        function makeBytesHumanReadable(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '-';
            } else if (bytes === 0) {
                return 0;
            }
            if (typeof precision === 'undefined') {
                precision = 1;
            }
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
        function preparePlansForDisplay(currentPlan, plans) {
            var isCurrentPlanFree = isPlanFree(currentPlan);
            var tmpPlans = {
                monthly: _.where(plans, { termLength: 1 }),
                oneYear: _.where(plans, { termLength: 12 }),
                twoYear: _.where(plans, { termLength: 24 })
            };
            var groupPlansByType = function (plan) {
                if (plan.maxProjectCount > currentPlan.maxProjectCount) {
                    return "upgrade";
                } else if (plan.maxProjectCount === currentPlan.maxProjectCount) {
                    if (plan.termLength === currentPlan.termLength ||
                    isEquivalentToFreePlan(currentPlan.subscriptionPlanID)) {
                        return "current";
                    } else if (plan.termLength < currentPlan.termLength) {
                        return "upgrade";
                    } else {
                        return "upgrade";
                    }
                } else {
                    return "aDowngrade";
                }
            };
            tmpPlans.monthly = _.groupBy(tmpPlans.monthly, groupPlansByType);
            tmpPlans.oneYear = _.groupBy(tmpPlans.oneYear, groupPlansByType);
            tmpPlans.twoYear = _.groupBy(tmpPlans.twoYear, groupPlansByType);
            var planMetaMapping = {
                "free": {
                    initiallyShownIds: [
                    PLAN_IDS.freeMonthly,
                    PLAN_IDS.starterMonthly,
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.freeOneYear,
                    PLAN_IDS.starterOneYear,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.freeTwoYear,
                    PLAN_IDS.starterTwoYear,
                    PLAN_IDS.professionalTwoYear,
                    PLAN_IDS.studioTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: [
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.professionalTwoYear
                    ]
                },
                "starter": {
                    initiallyShownIds: [
                    PLAN_IDS.starterMonthly,
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.starterOneYear,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.starterTwoYear,
                    PLAN_IDS.professionalTwoYear,
                    PLAN_IDS.studioTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: [
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.professionalTwoYear
                    ]
                },
                "professional": {
                    initiallyShownIds: [
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.studioPlusMonthly,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.studioPlusOneYear,
                    PLAN_IDS.professionalTwoYear,
                    PLAN_IDS.studioTwoYear,
                    PLAN_IDS.studioPlusTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: [
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.studioTwoYear
                    ]
                },
                "studio": {
                    initiallyShownIds: [
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.studioPlusMonthly,
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.studioPlusOneYear,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.studioTwoYear,
                    PLAN_IDS.studioPlusTwoYear,
                    PLAN_IDS.agencyTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: [
                    PLAN_IDS.studioPlusMonthly,
                    PLAN_IDS.studioPlusOneYear,
                    PLAN_IDS.studioPlusTwoYear
                    ]
                },
                "studioPlus": {
                    initiallyShownIds: [
                    PLAN_IDS.studioPlusMonthly,
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.studioPlusOneYear,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.studioPlusTwoYear,
                    PLAN_IDS.agencyTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: [
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.agencyTwoYear
                    ]
                },
                "agency": {
                    initiallyShownIds: [
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.agencyTwoYear,
                    PLAN_IDS.enterprise
                    ],
                    featuredIds: []
                },
                "custom": {
                    initiallyShownIds: [
                    PLAN_IDS.freeMonthly,
                    PLAN_IDS.starterMonthly,
                    PLAN_IDS.professionalMonthly,
                    PLAN_IDS.studioMonthly,
                    PLAN_IDS.studioPlusMonthly,
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.freeOneYear,
                    PLAN_IDS.starterOneYear,
                    PLAN_IDS.professionalOneYear,
                    PLAN_IDS.studioOneYear,
                    PLAN_IDS.studioPlusOneYear,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.freeTwoYear,
                    PLAN_IDS.starterTwoYear,
                    PLAN_IDS.professionalTwoYear,
                    PLAN_IDS.studioTwoYear,
                    PLAN_IDS.studioPlusTwoYear,
                    PLAN_IDS.agencyTwoYear
                    ],
                    featuredIds: []
                },
                "enterprise": {
                    initiallyShownIds: [
                    PLAN_IDS.agencyMonthly,
                    PLAN_IDS.agencyOneYear,
                    PLAN_IDS.agencyTwoYear
                    ],
                    featuredIds: []
                }
            };
            var planMapping = {};
            planMapping[PLAN_IDS.freeMonthly] = planMetaMapping.free;
            planMapping[PLAN_IDS.freeOneYear] = planMetaMapping.free;
            planMapping[PLAN_IDS.freeTwoYear] = planMetaMapping.free;
            planMapping[PLAN_IDS.starterMonthly] = planMetaMapping.starter;
            planMapping[PLAN_IDS.starterOneYear] = planMetaMapping.starter;
            planMapping[PLAN_IDS.starterTwoYear] = planMetaMapping.starter;
            planMapping[PLAN_IDS.professionalMonthly] = planMetaMapping.professional;
            planMapping[PLAN_IDS.professionalOneYear] = planMetaMapping.professional;
            planMapping[PLAN_IDS.professionalTwoYear] = planMetaMapping.professional;
            planMapping[PLAN_IDS.studioMonthly] = planMetaMapping.studio;
            planMapping[PLAN_IDS.studioOneYear] = planMetaMapping.studio;
            planMapping[PLAN_IDS.studioTwoYear] = planMetaMapping.studio;
            planMapping[PLAN_IDS.studioPlusMonthly] = planMetaMapping.studioPlus;
            planMapping[PLAN_IDS.studioPlusOneYear] = planMetaMapping.studioPlus;
            planMapping[PLAN_IDS.studioPlusTwoYear] = planMetaMapping.studioPlus;
            planMapping[PLAN_IDS.agencyMonthly] = planMetaMapping.agency;
            planMapping[PLAN_IDS.agencyOneYear] = planMetaMapping.agency;
            planMapping[PLAN_IDS.agencyTwoYear] = planMetaMapping.agency;
            planMapping[PLAN_IDS.enterprise] = planMetaMapping.enterprise;
            planMapping[PLAN_IDS.enterprise_tier2] = planMetaMapping.enterprise;
            planMapping[PLAN_IDS.enterprise_tier3] = planMetaMapping.enterprise;
            planMapping[PLAN_IDS.enterprise_trial] = planMetaMapping.enterprise;
            planMapping[PLAN_IDS.custom] = planMetaMapping.custom;
            var plansToShow = planMapping[currentPlan.subscriptionPlanID].initiallyShownIds;
            var plansToFeature = planMapping[currentPlan.subscriptionPlanID].featuredIds;
            $scope.showEnterprisePlan = _.contains(plansToShow, PLAN_IDS.enterprise);
            if (currentPlan.subscriptionPlanID === PLAN_IDS.custom) {
                canShowDowngrades = true;
                $scope.showAllPlans();
            } else if (
            currentPlan.subscriptionPlanID === PLAN_IDS.professionalMonthly ||
            currentPlan.subscriptionPlanID === PLAN_IDS.professionalOneYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.professionalTwoYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioMonthly ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioOneYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioTwoYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioPlusMonthly ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioPlusOneYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.studioPlusTwoYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.agencyMonthly ||
            currentPlan.subscriptionPlanID === PLAN_IDS.agencyOneYear ||
            currentPlan.subscriptionPlanID === PLAN_IDS.agencyTwoYear
            ) {
                $scope.showAllPlans();
            }
            _.each(tmpPlans, function (planTermGroup, key, list) {
                _.each(planTermGroup, function (planTransitionType, outerKey, list) {
                    _.each(planTransitionType, function (plan, key, list) {
                        if (isEquivalentToFreePlan(plan.id)) {
                            plan.id = PLAN_IDS.freeMonthly;
                        }
                        plan.className = plan.name.toLowerCase().replace(/\s/gi, '-');
                        plan.isShownByDefault = _.contains(plansToShow, plan.id);
                        plan.isFeatured = _.contains(plansToFeature, plan.id);
                        plan.isCurrent = (plan.id === currentPlan.subscriptionPlanID);
                        plan.assetAllowanceHumanReadable = makeBytesHumanReadable(plan.maxAssetByteCount, 0);
                        if (outerKey === "aDowngrade") {
                            plan.transitionType = "downgrade";
                        } else {
                            plan.transitionType = outerKey;
                        }
                    });
                });
            });
            return tmpPlans;
        }
        function isPlanFree(plan) {
            return plan.price === 0;
        }
        function isEquivalentToFreePlan(planID) {
            return (
            planID === PLAN_IDS.freeMonthly
            || planID === PLAN_IDS.freeOneYear
            || planID === PLAN_IDS.freeTwoYear
            );
        }
        $scope.closeModalWindow = function () {
            $window.olark('api.box.hide');
            $scope.closeModalWindow();
        };
        $scope.showSubview = function (subview) {
            $scope.subview = subview;
        };
        $scope.showAllPlans = function () {
            $scope.allPlansShown = true;
        };
        $scope.shouldShowPlanLevelType = function (planLevelType) {
            if (canShowDowngrades) {
                return true;
            } else {
                return (planLevelType !== "aDowngrade");
            }
        };
        $scope.getLinkLabel = function (plan, planLevelType) {
            if (plan.isCurrent) {
                return "Current Plan";
            } else if ($scope.currentPlan.subscriptionPlanID === PLAN_IDS.custom
            || $scope.currentPlan.subscriptionPlanID === PLAN_IDS.enterprise
            || planLevelType === 'upgrade') {
                return "Choose Plan";
            } else if (planLevelType === 'aDowngrade') {
                return "Downgrade";
            }
        };
        $scope.changePlanTo = function ($event, plan) {
            $event.preventDefault();
            $scope.selectedPlan = plan;
            var termForAlternativeOption = (plan.termLength == 1) ? 12 : 1;
            var isZeroCost = isPlanFree(plan);
            var isOverProjectQuota = ($scope.user.projectCount > plan.maxProjectCount);
            var isOverProjectMemberQuota = false; // = ( $scope.user.maxProjectMembersInAnyProject > plan.maxProjectMemberCount );
            var planData = {
                "isProrated": false,
                "prorateAmount": 0,
                "selectedPlan": plan,
                "alternativeTermOption": _.where(
                $scope.rawPlans,
                {
                    termLength: termForAlternativeOption,
                    monthlyPlanEquiv: plan.monthlyPlanEquiv
                }
                )[0]
            };
            if (isOverProjectQuota) {
                return ($scope.showOverProjectWarning = true);
            }
            if (isOverProjectMemberQuota) {
                return ($scope.showOverProjectMemberWarning = true);
            }
            if (!isZeroCost) {
                isGoingToBillingModal = true;
                if (!canShowDowngrades) {
                    return ($scope.openModalWindow("changePlanBilling", planData));
                } else {
                    return ($scope.openModalWindow("downgradePlanBilling", planData));
                }
            }
            Deferred.handlePromise(
            subscriptionService.changePlan($scope.selectedPlan),
            function (newPlan) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't change your subscription plan. Try refreshing your browser.");
            }
            );
        };
        $scope.sendUsersDetailsToSales = function () {
            $scope.enterprisePlanRequestSent = true;
            accountService.sendEnterpriseInfoRequest();
        };
        var canShowDowngrades = false;
        var qualarooTimer = null;
        var PLAN_IDS = {
            freeMonthly: 1,
            freeOneYear: 16,
            freeTwoYear: 17,
            starterMonthly: 2,
            starterOneYear: 18,
            starterTwoYear: 19,
            professionalMonthly: 3,
            professionalOneYear: 8,
            professionalTwoYear: 9,
            studioMonthly: 4,
            studioOneYear: 10,
            studioTwoYear: 11,
            studioPlusMonthly: 7,
            studioPlusOneYear: 12,
            studioPlusTwoYear: 13,
            agencyMonthly: 5,
            agencyOneYear: 14,
            agencyTwoYear: 15,
            enterprise: 20,
            custom: 21,
            enterprise_tier2: 22,
            enterprise_tier3: 23,
            enterprise_trial: 24
        };
        var calledWithSubview = "";
        var isGoingToBillingModal = false;
        var modalData = (modalWindowRequest.getData(0) || {});
        _.defaults(modalData, {
            showAllPlans: false,
            subview: "",
            canShowDowngrades: false
        });
        canShowDowngrades = modalData.canShowDowngrades;
        calledWithSubview = modalData.subview;
        $scope.subview = "oneYear";
        $scope.allPlansShown = modalData.showAllPlans;
        $scope.showEnterprisePlan = false;
        $scope.plans = {
            monthly: [],
            oneYear: [],
            twoYear: []
        };
        $scope.selectedPlan = null;
        $scope.showOverProjectWarning = false;
        $scope.showOverProjectMemberWarning = false;
        $scope.user = {
            projectCount: 0,
            maxProjectMembersInAnyProject: 0
        };
        $scope.shouldShowShowAllPlansLink = true;
        $scope.enterprisePlanRequestSent = false;
        $scope.carouselStartPos = 0;
        $scope.$on(
        "$destroy",
        function () {
            var hasPaidPlan = sessionService.subscription.price > 0;
            $timeout.cancel(qualarooTimer);
            if (!isGoingToBillingModal) {
                $window._kiq.push(['hideSurvey']);
                if (hasPaidPlan) {
                    $window.olark('api.box.hide');
                }
            }
        }
        );
        $window.olark('api.box.show');
        if ($scope.allPlansShown) {
            $window._kiq.push(['showSurvey', 89346, true]);
        } else {
            $window._kmq.push(['record', 'Upgrade modal viewed']);
            qualarooTimer = $timeout(
            function () {
                $window._kiq.push(['showSurvey', 104396, true]);
            },
            (8 * 1000)
            );
        }
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! change-plan-enterprise-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ChangePlanEnterpriseController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, modalWindowRequest, changePlansPartial, subscriptionService, billingService, sessionService, Deferred, modelEvents, accountService, _, moment) {
        function loadRemoteData() {
            Deferred.handlePromise(
            changePlansPartial.get(),
            function (response) {
                var currentPlan = response.currentPlan;
                var projects = response.projects;
                var plans = getEnterprisePlans();
                var assetSizeUsed = response.totalAssetFileSizeUsed;
                $scope.user.projectCount = projects.length;
                $scope.user.maxProjectMembersInAnyProject = (_.maxProperty(projects, "projectMemberCount") || 0);
                $scope.user.assetSizeUsed = assetSizeUsed;
                $scope.rawPlans = plans;
                $scope.plans = plans;
                $scope.currentPlan = currentPlan;
                $scope.isTrial = (currentPlan.subscriptionPlanID === PLAN_IDS.enterprise_trial);
                if ($scope.isTrial) {
                    $scope.daysLeftInTrial = moment(currentPlan.expiresAt).diff(moment(), "days");
                    if ($scope.daysLeftInTrial < 0) {
                        $scope.daysLeftInTrial = 0;
                    }
                } else {
                    $scope.openModalWindow("contactUsEnterprise");
                    $scope.daysLeftInTrial = 0;
                }
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your subscription information. Try refreshing your browser.");
            },
            true
            );
        }
        function getEnterprisePlans() {
            var plans = [
            {
                subscriptionPlanID: PLAN_IDS.enterprise,
                id: PLAN_IDS.enterprise,
                name: "Tier 1",
                maxProjectCount: PSEUDO_UNLIMITED,
                maxProjectMemberCount: PSEUDO_UNLIMITED,
                maxAssetStorage: PSEUDO_UNLIMITED,
                price: 5000
            },
            {
                subscriptionPlanID: PLAN_IDS.enterprise_tier2,
                id: PLAN_IDS.enterprise_tier2,
                name: "Tier 2",
                maxProjectCount: PSEUDO_UNLIMITED,
                maxProjectMemberCount: PSEUDO_UNLIMITED,
                maxAssetStorage: PSEUDO_UNLIMITED,
                price: 10000
            }
            /*
            ,
            { 
            subscriptionPlanID: PLAN_IDS.enterprise_tier3,
            id: PLAN_IDS.enterprise_tier3,
            name: "Tier 3",
            maxProjectCount: PSEUDO_UNLIMITED,
            maxProjectMemberCount: PSEUDO_UNLIMITED,
            maxAssetStorage: 50,
            price: 30000
            }
            */
            ];
            return plans;
        }
        $scope.closeModalWindow = function () {
            $window.olark('api.box.hide');
            $scope.closeModalWindow();
        };
        $scope.showSubview = function (subview) {
            $scope.subview = subview;
        };
        $scope.showAllPlans = function () {
            $scope.allPlansShown = true;
        };
        $scope.getLinkLabel = function (plan, planLevelType) {
            if (plan.isCurrent) {
                return "Current Plan";
            } else {
                return "Choose Plan";
            }
        };
        $scope.isUnlimitedPlan = function (plan) {
            return (true);
        };
        $scope.changePlanTo = function ($event, plan) {
            $event.preventDefault();
            if (plan.maxProjectCount === 0) {
                plan.maxProjectCount = "Unlimited";
            }
            var planData = {
                "isProrated": false,
                "prorateAmount": 0,
                "selectedPlan": plan
            };
            $scope.selectedPlan = plan;
            var isOverProjectQuota = ($scope.user.projectCount > plan.maxProjectCount);
            var isOverProjectMemberQuota = false;
            if (isOverProjectQuota) {
                return ($scope.showOverProjectWarning = true);
            }
            if (isOverProjectMemberQuota) {
                return ($scope.showOverProjectMemberWarning = true);
            }
            accountService.sendEnterpriseChangePlan($scope.selectedPlan);
            $scope.openModalWindow("changePlanBillingEnterprise", planData);
        };
        $scope.sendUsersDetailsToSales = function () {
            $scope.enterprisePlanRequestSent = true;
            accountService.sendEnterpriseInfoRequest();
        };
        var qualarooTimer = null;
        var PSEUDO_UNLIMITED = 999999;
        var PLAN_IDS = {
            enterprise: 20,
            enterprise_tier2: 22,
            enterprise_tier3: 23,
            enterprise_trial: 24
        };
        var calledWithSubview = "";
        var isGoingToBillingModal = false;
        var modalData = (modalWindowRequest.getData(0) || {});
        _.defaults(modalData, { showAllPlans: false, subview: "" });
        calledWithSubview = modalData.subview;
        $scope.subview = "plans";
        $scope.allPlansShown = modalData.showAllPlans;
        $scope.showEnterprisePlan = false;
        $scope.plans = [];
        $scope.selectedPlan = null;
        $scope.showOverProjectWarning = false;
        $scope.showOverProjectMemberWarning = false;
        $scope.user = {
            projectCount: 0,
            maxProjectMembersInAnyProject: 0,
            email: sessionService.user.email
        };
        $scope.shouldShowShowAllPlansLink = true;
        $scope.enterprisePlanRequestSent = false;
        $scope.isTrial = false;
        $scope.daysLeftInTrial = 0;
        $scope.$on(
        "$destroy",
        function () {
            $window.olark('api.box.hide');
        }
        );
        $window.olark('api.box.show');
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! change-project-type-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.changeProjectType", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, modalWindowRequest, projectService, _) {
        $scope.selectDeviceType = function (deviceType) {
            $scope.selectedDeviceType = deviceType;
            if (deviceType == "desktop") {
                $scope.mobileDeviceID = 0;
                $scope.isMobile = 0;
            } else if (deviceType == "iPhone") {
                $scope.mobileDeviceID = $scope.iPhoneOrientation;
                $scope.isMobile = 1;
            } else if (deviceType == "iPad") {
                $scope.mobileDeviceID = $scope.iPadOrientation;
                $scope.isMobile = 1;
            }
        }
        $scope.submitForm = function (form) {
            if ($scope.mobileDeviceID < 0 || $scope.isMobile < 0) {
                return false;
            }
            projectService.setProjectType($scope.projectID,
            $scope.isMobile,
            $scope.mobileDeviceID
            );
            $scope.closeModalWindow();
        }
        $scope.project = modalWindowRequest.getData(0);
        $scope.projectID = $scope.project.id;
        $scope.selectedDeviceType = "";
        $scope.iPhoneOrientation = 1;
        $scope.iPadOrientation = 3;
        $scope.mobileDeviceID = -1;
        $scope.isMobile = -1;
        if ($scope.project.isMobile === "") {
            modalWindowRequest.setSuppressClose(true);
        } else { // the project has been set up before. set some defaults for the modal to show the current settings.
            switch ($scope.project.mobileDeviceID) {
                case 0:
                    $scope.selectedDeviceType = "desktop";
                    $scope.selectDeviceType("desktop");
                    break;
                case 1:
                    $scope.selectedDeviceType = "iPhone";
                    $scope.iPhoneOrientation = 1;
                    $scope.selectDeviceType("iPhone");
                    break;
                case 2:
                    $scope.selectedDeviceType = "iPhone";
                    $scope.iPhoneOrientation = 2;
                    $scope.selectDeviceType("iPhone");
                    break;
                case 3:
                    $scope.selectedDeviceType = "iPad";
                    $scope.iPadOrientation = 3;
                    $scope.selectDeviceType("iPad");
                    break;
                case 4:
                    $scope.selectedDeviceType = "iPad";
                    $scope.iPadOrientation = 4;
                    $scope.selectDeviceType("iPad");
                    break;
            }
        }
    }
})(angular, InVision);
;
;
/*! clickable-wireframes-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ClickableWireframesController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.playPencilVideo = function () {
            $scope.openModalWindow("video", "43985491");
        };
    }
})(angular, InVision);
;
;
/*! console-first-use-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ConsoleFirstUse", Controller);
    /** @ngInject */
    function Controller($rootScope, $scope, $timeout, Deferred, requestContext, accountService, sessionService, modalWindowRequest, _) {
        function init(modalData) {
            $rootScope.$broadcast("consoleTourOpened", $scope.subview);
            $timeout(function () {
                $scope.subview = modalData;
            }, 0);
        }
        function markConsoleIntroStepAsSeen(stepAsInt) {
            var sumOfSteps = (tourStepsSeen | stepAsInt);
            Deferred.handlePromise(
            accountService.sawConsoleIntroModal(sumOfSteps),
            function (response) {
                sessionService.update();
                tourStepsSeen = sumOfSteps;
            },
            function (response) {
            }
            );
        }
        function getIndexOfSubview() {
            for (var i = 0; i < SUBVIEWS.length; i++) {
                if (SUBVIEWS[i] === $scope.subview) {
                    return i;
                }
            }
            return 0;
        }
        function getCurrentConsoleModeAsInt(consoleMode) {
            if (consoleMode === "preview") return 1;
            if (consoleMode === "build") return 2;
            if (consoleMode === "comments") return 4;
            if (consoleMode === "history") return 8;
            if (consoleMode === "config") return 16;
        }
        $scope.closeTour = function () {
            $rootScope.$broadcast("consoleTourClosed");
            $scope.closeModalWindow();
        };
        $scope.backStep = function () {
            var currentIndex = getIndexOfSubview();
            if (currentIndex > 0) {
                $scope.subview = SUBVIEWS[currentIndex - 1];
            }
        };
        $scope.nextStep = function () {
            var currentIndex = getIndexOfSubview();
            if (currentIndex + 1 < SUBVIEWS.length) {
                $scope.subview = SUBVIEWS[currentIndex + 1];
            }
        };
        var SUBVIEWS = [
        "preview",
        "build",
        "comments",
        "history",
        "config"
        ];
        var tourStepsSeen = sessionService.user.hasSeenConsoleIntroModal;
        var renderContext = requestContext.getRenderContext("console");
        var currentConsoleMode = renderContext.getNextSection();
        var modalData = (modalWindowRequest.getData(0) || "preview");
        $scope.subview = null;
        $scope.$on(
        "requestContextChanged",
        function () {
            currentConsoleMode = renderContext.getNextSection();
        }
        );
        $scope.$on(
        "closingConsole", function () {
            $scope.closeModalWindow();
        }
        );
        $scope.$on(
        "consoleSubviewChanged", function (event, subview, forceTourClose) {
            var forceTourClose = forceTourClose || false;
            if (forceTourClose) {
                $scope.closeTour();
            } else {
                $scope.subview = subview;
            }
        }
        );
        $scope.$watch(
        "subview",
        function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            markConsoleIntroStepAsSeen(getCurrentConsoleModeAsInt(newValue));
            $rootScope.$broadcast('consoleTourChangedModes', newValue);
        }
        );
        init(modalData);
    }
})(angular, InVision);
;
;
/*! contact-us-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ContactUsController", Controller);
    /** @ngInject */
    function Controller($scope, $timeout, Deferred, accountService, sessionService, modalWindowRequest, _) {
        function isEnterprisePlan(subscription) {
            var enterprisePlanIds = [20, 22, 23, 24];
            return (_.contains(enterprisePlanIds, subscription.subscriptionPlanID));
        }
        $scope.submitForm = function () {
            if (!$scope.bugOrFeature.length) {
                $scope.errorMessage = "Please select if this is a feature request or a bug/support request.";
                return;
            }
            if (!$scope.description.length) {
                $scope.errorMessage = "Please enter either a question or a comment.";
                return;
            }
            Deferred.handlePromise(
            accountService.submitSupportTicket($scope.bugOrFeature, $scope.description),
            function (response) {
                $scope.errorMessage = null;
                $scope.subview = "confirmation";
            },
            function (response) {
                $scope.errorMessage = "We had a problem submitting your support ticket.";
            }
            );
        };
        $scope.subview = "form";
        $scope.description = "";
        $scope.bugOrFeature = "";
        $scope.replyToEmail = sessionService.user.email;
        $scope.isEnterpriseUser = isEnterprisePlan(sessionService.subscription);
        $scope.errorMessage = null;
        if ($scope.isEnterpriseUser) {
            $timeout(function () {
                $scope.openModalWindow("contactUsEnterprise")
            }, 10);
        }
    }
})(angular, InVision);
;
;
/*! contact-us-enterprise-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ContactUsEnterpriseController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, accountService, sessionService, modalWindowRequest, _) {
        $scope.submitForm = function () {
            if (!$scope.bugOrFeature.length) {
                $scope.errorMessage = "Please select if this is a feature request or a bug/support request.";
                return;
            }
            if (!$scope.description.length) {
                $scope.errorMessage = "Please enter either a question or a comment.";
                return;
            }
            Deferred.handlePromise(
            accountService.submitSupportTicket($scope.bugOrFeature, $scope.description, true),
            function (response) {
                $scope.errorMessage = null;
                $scope.subview = "confirmation";
            },
            function (response) {
                $scope.errorMessage = "We had a problem submitting your support ticket.";
            }
            );
        };
        $scope.subview = "form";
        $scope.description = "";
        $scope.bugOrFeature = "";
        $scope.replyToEmail = sessionService.user.email;
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! convert-to-company-tour-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ConvertToCompanyTourController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, modalWindowRequest, _) {
        $scope.nextStep = function () {
            if ($scope.subview === 'step1') {
                $scope.subview = 'step2';
            } else if ($scope.subview === 'step2') {
                $scope.subview = 'step3';
            } else if ($scope.subview === 'step3') {
                $scope.closeModalWindow();
            }
        };
        $scope.subview = "step1";
    }
})(angular, InVision);
;
;
/*! delete-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.DeleteProjectController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, modalWindowRequest, _) {
        $scope.deleteProject = function () {
            if (!$scope.isConfirmed) {
                $scope.errorMessage = "Please confirm that you understand the ramifications of your action.";
                return;
            }
            Deferred.handlePromise(
            projectService.deleteProject($scope.projectID),
            function (response) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.errorMessage = response.message;
            }
            );
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.isConfirmed = false;
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! duplicate-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.DuplicateProjectController", Controller);
    /** @ngInject */
    function Controller($scope, $location, Deferred, projectService, modalWindowRequest, _) {
        $scope.duplicateProject = function () {
            if (!submissionInProgress) {
                submissionInProgress = true;
                Deferred.handlePromise(
                projectService.duplicateProject($scope.projectID),
                function (project) {
                    $location.path("/projects/" + project.id);
                    $scope.closeModalWindow();
                },
                function (response) {
                    submissionInProgress = false;
                    $scope.errorMessage = response.message;
                }
                );
            }
        };
        var submissionInProgress = false;
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! error-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ErrorController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.errorMessage = modalWindowRequest.getData(0);
    }
})(angular, InVision);
;
;
/*! getting-started-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.GettingStartedController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.openContactUsModal = function () {
            $scope.openModalWindow("contactUs");
        };
        $scope.openMacAppModal = function () {
            $scope.openModalWindow("macAppAdvert");
        };
        $scope.playGettingStartedVideo = function () {
            $scope.openModalWindow("video", "42653619");
        };
        $scope.playPencilVideo = function () {
            $scope.openModalWindow("video", "43985491");
        };
        $scope.showSubview = function (subview) {
            $scope.subview = subview;
        };
        $scope.subview = "helpVideos";
    }
})(angular, InVision);
;
;
/*! gravatar-avatar-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.GravatarAvatarController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, accountService, sessionService, validationService, modalWindowRequest, _) {
        function getErrorMessageForResponse(response) {
            if (validationService.isNotFound(response)) {
                return ("We could not find a Gravatar image using that email address.");
            } else {
                return (response.message);
            }
        }
        $scope.saveAvatar = function () {
            if (! /^[^@]+@[^.]+\..+$/.test($scope.email)) {
                $scope.errorMessage = "Please enter a valid email address.";
                return;
            }
            Deferred.handlePromise(
            accountService.importGravatarAvatar($scope.email),
            function (account) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.errorMessage = getErrorMessageForResponse(response);
            }
            );
        };
        $scope.email = sessionService.user.email;
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! high-fidelity-prototypes-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.HighFidelityPrototypesController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
    }
})(angular, InVision);
;
;
/*! mac-app-advert-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.MacAppAdvertController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.playMacAppVideo = function () {
            $scope.openModalWindow("video", "49918256");
        };
    }
})(angular, InVision);
;
;
/*! mobile-demos-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.MobileDemosController", Controller);
    /** @ngInject */
    function Controller($scope, _) {
        $scope.showState = function (state) {
            $scope.state = state;
        };
        $scope.state = 1;
    }
})(angular, InVision);
;
;
/*! new-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.NewProjectController", Controller);
    /** @ngInject */
    function Controller($scope, $location, Deferred, projectService, accountService, sessionService, newProjectModalPartial, validationService, modalWindowRequest, modelEvents, userService, _) {
        function applyRemoteData(teamMembers) {
            $scope.possibleOwners = augmentTeamMembers(teamMembers);
            $scope.projectOwner = getDefaultProjectOwner($scope.possibleOwners);
        }
        function augmentTeamMembers(teamMembers) {
            for (var i = 0, length = teamMembers.length ; i < length ; i++) {
                var user = teamMembers[i];
                user.shortName = userService.getShortName(user.name);
                user.remainingProjectQuota = Math.max((user.maxProjectCount - user.projectCount), 0);
                user.hasUnlimitedProjects = (user.maxProjectCount === 999999);
                user.hasEnterprisePlan = isEnterprisePlan(user.subscriptionPlanID);
            }
            sortTeamMembers(teamMembers);
            return (teamMembers);
        }
        function getDefaultProjectOwner(teamMembers) {
            var lastSelectedProjectOwner = _.findWithProperty(teamMembers, "isLastSelectedProjectOwner", true);
            var enterpriseLead = _.findWithProperty(teamMembers, "hasEnterprisePlan", true);
            return (lastSelectedProjectOwner || enterpriseLead || teamMembers[0]);
        }
        function getErrorMessageForResponse(response) {
            if (validationService.isMissingField(response)) {
                return ("Please enter a project name.");
            } else if (validationService.isInvalidField(response)) {
                return ("Project names can only contain limited punctuation. Try removing non-alpha-numeric characters.");
            } else if (validationService.isAlreadyExists(response)) {
                return ("Project names must be unique to a given user. Please select a different project name.");
            } else if (validationService.isForbidden(response)) {
                return ("You no longer allowed to create projects under that user's account.");
            } else {
                return (response.message);
            }
        }
        function isEnterprisePlan(planID) {
            return (
            (planID === 24) ||	// Enterprise - trial.
            (planID === 20) ||	// Enterprise - Tier 1.
            (planID === 22) ||	// Enterprise - Tier 2.
            (planID === 23)		// Enterprise - Tier 3.
            );
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            newProjectModalPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.teamMembers);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your team members. Try refreshing your browser.");
            }
            );
        }
        function sortTeamMembers(teamMembers) {
            teamMembers.sort(
            function (a, b) {
                if (a.isTeamLead) {
                    return (-1);
                } else if (b.isTeamLead) {
                    return (1);
                }
                return (a.remainingProjectQuota <= b.remainingProjectQuota ? 1 : -1);
            }
            );
            return (teamMembers);
        }
        $scope.saveProject = function () {
            if (!$scope.projectName) {
                $scope.errorMessage = "Please enter a project name.";
                return;
            }
            if (!$scope.projectOwner) {
                $scope.errorMessage = "Please select a project owner.";
                return;
            }
            var request = projectService.save({
                userID: $scope.projectOwner.id,
                name: $scope.projectName,
                isFavorite: true,
                isMobile: $scope.isMobile,
                mobileDeviceID: $scope.mobileDeviceID
            });
            if (!submissionInProgress) {
                submissionInProgress = true;
                Deferred.handlePromise(
                request,
                function (project) {
                    $scope.closeModalWindow();
                    $location.path("/projects/" + project.id);
                },
                function (response) {
                    submissionInProgress = false;
                    $scope.errorMessage = getErrorMessageForResponse(response);
                }
                );
            }
        };
        $scope.selectOwner = function (member) {
            $scope.projectOwner = member;
        };
        $scope.openTeamSetupVideo = function () {
            $scope.openModalWindow("video", "66614411");
        };
        $scope.hideTeamSetupTip = function (tipId) {
            if (tipId === 1) {
                $scope.shouldShowTeamSetupTip1 = false;
            }
            accountService.markTeamSetupTipClosed(tipId);
        };
        $scope.setIsMobile = function (isMobile) {
            $scope.isMobile = isMobile;
        }
        var submissionInProgress = false;
        $scope.isLoading = false;
        $scope.projectName = "";
        $scope.projectOwner = null;
        $scope.possibleOwners = [];
        $scope.errorMessage = null;
        $scope.shouldShowTeamSetupTip1 = !(sessionService.user.hasClosedTeamSetupTip1);
        $scope.isMobile = false;
        $scope.mobileDeviceID = 1;
        $scope.initLoad = true;
        $scope.$watch(
        "mobileDeviceID",
        function (newValue, oldValue) {
            if ($scope.initLoad) {
                $scope.isMobile = false;
                $scope.initLoad = false;
            } else {
                $scope.isMobile = true;
            }
        }
        );
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("accountUpdated.newProject");
        }
        );
        modelEvents.on(
        "accountUpdated.newProject",
        function (event, account) {
            sessionService.update();
        });
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! new-team-member-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.NewTeamMemberController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, teamInvitationService, newTeamMemberModalPartial, sessionService, modalWindowRequest, _) {
        function applyRemoteData(projects) {
            $scope.projects = augmentProjects(projects);
            sortProjects();
            updateProjectBreakdowns();
        }
        function augmentProjects(projects) {
            return (
            _.setProperty(projects, "isSelectedForInvite", false)
            );
        }
        function getProjectsOwnedByMe() {
            return (
            _.withProperty($scope.projects, "userID", sessionService.user.id)
            );
        }
        function getProjectsOwnedByOthers() {
            return (
            _.withoutProperty($scope.projects, "userID", sessionService.user.id)
            );
        }
        function getSelectedProjectIDs() {
            var selectedProjects = _.withProperty($scope.projects, "isSelectedForInvite", true);
            var ids = _.pluck(selectedProjects, "id");
            return (ids.join(","));
        }
        function loadRemoteData() {
            $scope.isLoadingProjects = true;
            Deferred.handlePromise(
            newTeamMemberModalPartial.get(),
            function (response) {
                $scope.isLoadingProjects = false;
                applyRemoteData(response.projects);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your projects. Try refreshing your browser.");
            }
            );
        }
        function sortProjects() {
            _.sortOnProperty($scope.projects, "name");
        }
        function updateProjectBreakdowns() {
            $scope.projectsOwnedByMe = getProjectsOwnedByMe();
            $scope.projectsOwnedByOthers = getProjectsOwnedByOthers();
        }
        $scope.inviteTeamMember = function () {
            if (!submissionInProgress) {
                if (
                !$scope.email ||
                ($scope.email.search(/^[^@\s]+@[^\s]+\.\w+$/i) === -1)
                ) {
                    $scope.errorMessage = "Please enter a valid email address.";
                    return;
                }
                submissionInProgress = true;
                var request = teamInvitationService.send(
                $scope.email,
                $scope.canCreateProjectsForLead,
                getSelectedProjectIDs()
                );
                Deferred.handlePromise(
                request,
                function (invitation) {
                    $scope.closeModalWindow();
                },
                function (response) {
                    submissionInProgress = false;
                    $scope.errorMessage = response.message;
                }
                );
            }
        };
        $scope.email = (modalWindowRequest.getData(0) || "");
        $scope.isLoadingProjects = false;
        $scope.projects = [];
        $scope.projectsOwnedByMe = [];
        $scope.projectsOwnedByOthers = [];
        $scope.canCreateProjectsForLead = false;
        $scope.errorMessage = null;
        var submissionInProgress = false;
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! pdf-export-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.PDFExportController", Controller);
    /** @ngInject */
    function Controller($scope, $location, Deferred, projectService, modalWindowRequest, _) {
        $scope.exportPDF = function () {
            $('#pdfExportLoadForm').submit(); // just doing a standard submit here
            $scope.closeModalWindow();
        };
        $scope.openChangePlanModal = function () {
            $scope.openModalWindow("changePlan");
        }
        $scope.downloadSample = function () {
            document.location.href = '/d/pdfexport/sample/';
        }
        var submissionInProgress = false;
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.projectInfo = projectService.getByID($scope.projectID);
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! project-members-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.ProjectMembersController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, teamInvitationService, accountService, projectService, projectMembersModalPartial, modalWindowRequest, validationService, sessionService, $timeout, userService, _) {
        function applyRemoteData(project, teamMembers) {
            var currentSubscription = sessionService.subscription;
            $scope.maxProjectMemberCount = (currentSubscription.maxProjectMemberCount - 1);
            $scope.subscriptionPlanName = currentSubscription.name.replace("Enterprise - ", "");
            $scope.project = project;
            $scope.teamMembers = augmentTeamMembers(teamMembers);
            $scope.isProjectOwner = (sessionService.user.id === project.userID);
        }
        function augmentTeamMembers(teamMembers) {
            for (var i = 0, length = teamMembers.length ; i < length ; i++) {
                var user = teamMembers[i];
                user.isSelectedForProject = user.isProjectMember;
                user.initials = userService.getInitials(user.name);
                user.shortName = userService.getShortName(user.name);
                user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            }
            sortTeamMembers(teamMembers);
            return (teamMembers);
        }
        function getUserIDsToAdd() {
            var newMembers = _.where(
            $scope.teamMembers,
            {
                isProjectMember: false,
                isSelectedForProject: true
            }
            );
            return (
            _.pluck(newMembers, "id")
            );
        }
        function getUserIDsToRemove() {
            var oldMembers = _.where(
            $scope.teamMembers,
            {
                isProjectMember: true,
                isSelectedForProject: false
            }
            );
            return (
            _.pluck(oldMembers, "id")
            );
        }
        function loadRemoteData() {
            $scope.isLoadingTeamMembers = true;
            Deferred.handlePromise(
            projectMembersModalPartial.get($scope.projectID),
            function (response) {
                $scope.isLoadingTeamMembers = false;
                applyRemoteData(response.project, response.teamMembers);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your team members. Try refreshing your browser.");
            }
            );
        }
        function sortTeamMembers(teamMembers) {
            teamMembers.sort(
            function (a, b) {
                if (a.isSelectedForProject && b.isSelectedForProject) {
                    return (a.name < b.name ? -1 : 1);
                }
                if (a.isSelectedForProject) {
                    return (-1);
                }
                if (b.isSelectedForProject) {
                    return (1);
                }
                return (a.name < b.name ? -1 : 1);
            }
            );
            return (teamMembers);
        }
        $scope.updateTeamMembers = function () {
            var promises = [];
            var addUserIDs = getUserIDsToAdd();
            var removeUserIDs = getUserIDsToRemove();
            var updateWithExistingUsers = (addUserIDs.length || removeUserIDs.length);
            var updateWithUsersByEmail = $scope.email.length;
            if (!(updateWithExistingUsers || updateWithUsersByEmail)) {
                return ($scope.closeModalWindow());
            }
            if (updateWithUsersByEmail) {
                if (!(/^[^@]+@[^.]+\..+$/i).test($scope.email)) {
                    $scope.errorMessage = "Please enter a valid email address.";
                    return;
                }
            }
            if (updateWithExistingUsers && updateWithUsersByEmail) {
                promises = [
                teamInvitationService.send($scope.email, false, $scope.projectID),
                projectService.changeUsersOnProject($scope.projectID, addUserIDs, removeUserIDs)
                ];
            } else if (updateWithExistingUsers) {
                promises = [
                projectService.changeUsersOnProject($scope.projectID, addUserIDs, removeUserIDs)
                ];
            } else if (updateWithUsersByEmail) {
                promises = [
                teamInvitationService.send($scope.email, false, $scope.projectID)
                ];
            }
            Deferred.handleAllPromises(promises,
            function () {
                if (updateWithUsersByEmail) {
                    $scope.numberOfUsersInvited = $scope.email.split(",").length;
                    $scope.newMemberCount = 0;
                    $scope.removedMemberCount = 0;
                } else {
                    $scope.closeModalWindow();
                }
            },
            function (response) {
                if (validationService.isOverQuota(response)) {
                    $scope.isOverQuota = true;
                } else if (validationService.isInvalidField(response)) {
                    $scope.errorMessage = "Please enter a valid email address.";
                } else {
                    $scope.openModalWindow("error", "For some reason, we couldn't update the selected team members on this project. Try refreshing your browser.");
                }
            }
            );
        };
        $scope.sendEnterpriseInfoRequest = function () {
            accountService.sendEnterpriseInfoRequest("requestsMoreCollaborators");
            $scope.extraCollabRequestSent = true;
        };
        $scope.openShareModal = function (project) {
            $scope.openModalWindow("share", project.id);
        };
        $scope.toggleTeamMemberSelection = function (teamMember) {
            $scope.isOverQuota = false;
            teamMember.isSelectedForProject = !teamMember.isSelectedForProject;
            if (teamMember.isProjectMember) {
                if (teamMember.isSelectedForProject) {
                    $scope.removedMemberCount--;
                } else {
                    $scope.removedMemberCount++;
                }
            } else {
                if (teamMember.isSelectedForProject) {
                    $scope.newMemberCount++;
                } else {
                    $scope.newMemberCount--;
                }
            }
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.isLoadingTeamMembers = false;
        $scope.project = null;
        $scope.teamMembers = [];
        $scope.isProjectOwner = false;
        $scope.teamFilter = null;
        $scope.newMemberCount = 0;
        $scope.removedMemberCount = 0;
        $scope.email = "";
        $scope.errorMessage = null;
        $scope.isOverQuota = false;
        $scope.extraCollabRequestSent = false;
        $scope.subscriptionPlanName = "";
        $scope.numberOfUsersInvited = 0;
        $scope.$on("$destroy", function () {
        });
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! save-project-offline-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.SaveProjectOfflineController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
    }
})(angular, InVision);
;
;
/*! team-invite-joined-confirmation-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.TeamInviteJoinedConfirmationController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, $location, modalWindowRequest, sessionService, Deferred, modelEvents, userService, _) {
        $scope.closeModalWindow = function () {
            $scope.closeModalWindow();
        };
        var modalData = (modalWindowRequest.getData(0) || {});
        _.defaults(modalData, {
            leadName: "",
            leadAvatar: "",
            leadEmail: "",
            firstProjectName: "",
            projectCount: 0
        });
        $scope.firstProjectName = modalData.firstProjectName;
        $scope.projectCount = modalData.projectCount;
        $scope.leadUser = {
            name: modalData.leadName,
            initials: userService.getInitials(modalData.leadName),
            hasSystemAvatar: userService.isSystemAvatar(modalData.leadAvatar),
            avatarID: modalData.leadAvatar,
            email: modalData.leadEmail
        };
        $scope.currentUser = {
            name: sessionService.user.name,
            initials: sessionService.user.initials,
            hasSystemAvatar: sessionService.user.hasSystemAvatar,
            avatarID: sessionService.user.avatarID,
            email: sessionService.user.email
        };
        $scope.$on(
        "$destroy",
        function () {
        }
        );
        $location.search("showAcceptConfirmation", null);
        $location.search("leadName", null);
        $location.search("leadEmail", null);
        $location.search("leadAvatar", null);
        $location.search("firstProjectName", null);
        $location.search("projectCount", null);
        if ($scope.leadUser.name.length == 0) {
            $scope.$broadcast("closeModalWindowWithoutFade");
        }
    }
})(angular, InVision);
;
;
/*! transfer-project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.TransferProjectController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, teamService, sessionService, transferProjectModalPartial, validationService, modalWindowRequest, _) {
        function applyRemoteData(project, currentProjectOwner, possibleOwners) {
            $scope.project = project;
            $scope.possibleOwners = possibleOwners;
            $scope.currentProjectOwner = currentProjectOwner;
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            transferProjectModalPartial.get($scope.projectID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.project,
                response.teamMembers
                );
            },
            function () {
                $scope.errorMessage = "There was a problem loading the project.";
            }
            );
        }
        function isProjectOwnersEmail(email) {
            return (
            $scope.currentProjectOwner.email === email
            );
        }
        $scope.transferProject = function () {
            if (!$scope.transferProjectToEmail) {
                $scope.errorMessage = "Please enter the email address of the new project owner.";
                return;
            }
            if (isProjectOwnersEmail($scope.transferProjectToEmail)) {
                return ($scope.closeModalWindow());
            }
            if (!submissionInProgress) {
                submissionInProgress = true;
                Deferred.handlePromise(
                projectService.transferOwnership($scope.projectID, $scope.transferProjectToEmail),
                function (project) {
                    $scope.closeModalWindow();
                },
                function (response) {
                    submissionInProgress = false;
                    if (validationService.isOverQuota(response)) {
                        $scope.errorMessage = "Due to the number of collaborators on this project, the selected user must upgrade their account before they can take ownership of this project.";
                    } else if (validationService.isAlreadyExists(response)) {
                        $scope.errorMessage = "The selected user already has a project with the given name. You must rename this project before you transfer it - project names must be unique for each user.";
                    } else {
                        $scope.errorMessage = response.message;
                    }
                }
                );
            }
        };
        var submissionInProgress = false;
        $scope.isLoading = false;
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.project = null;
        $scope.currentProjectOwner = null;
        $scope.possibleOwners = [];
        $scope.transferProjectToEmail = "";
        $scope.errorMessage = null;
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! twitter-avatar-conroller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.TwitterAvatarController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, accountService, validationService, modalWindowRequest, _, sessionService) {
        function getErrorMessageForResponse(response) {
            if (validationService.isNotFound(response)) {
                return ("We could not find a Twitter account with the given username.");
            } else {
                return (response.message);
            }
        }
        $scope.saveAvatar = function () {
            if (!$scope.twitterUsername.length) {
                $scope.errorMessage = "Please enter your twitter username.";
                return;
            }
            Deferred.handlePromise(
            accountService.importTwitterAvatar($scope.twitterUsername),
            function (account) {
                $scope.closeModalWindow();
            },
            function (response) {
                $scope.errorMessage = getErrorMessageForResponse(response);
            }
            );
        };
        $scope.twitterUsername = sessionService.user.twitterUsername;
        $scope.errorMessage = null;
    }
})(angular, InVision);
;
;
/*! upload-in-progress-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.UploadInProgressController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _, $location) {
        var targetRoute = modalWindowRequest.getData(0);
        $scope.cancelNavigation = function () {
            $scope.closeModalWindow();
        };
        $scope.acceptNavigation = function () {
            $scope.$emit("screenUploadStop");
            $location.path(targetRoute);
            $scope.closeModalWindow();
        };
    }
})(angular, InVision);
;
;
/*! video-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.VideoController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.videoID = modalWindowRequest.getData(0);
        $scope.footerText = null;
        switch ($scope.videoID) {
            case "43985491":
                $scope.footerText = "pencil";
                break;
        }
    }
})(angular, InVision);
;
;
/*! workflow-status-notification-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.WorkflowStatusNotificationController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, screenService, workflowStatusNotificationModalPartial, modalWindowRequest, userService, _) {
        function applyRemoteData(users) {
            $scope.users = augmentUsers(users);
        }
        function augmentUser(user) {
            user.isSelectedForNotification = false;
            user.shortName = userService.getShortName(user.name);
            user.initials = userService.getInitials(user.name);
            user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            return (user);
        }
        function augmentUsers(users) {
            _.each(users, augmentUser)
            sortUsers(users);
            return (users);
        }
        function getSelectedUserIDs() {
            var selectedUsers = _.withProperty($scope.users, "isSelectedForNotification", true);
            var ids = _.pluck(selectedUsers, "id");
            return (ids.join(","));
        }
        function loadRemoteData() {
            $scope.isLoadingUsers = true;
            Deferred.handlePromise(
            workflowStatusNotificationModalPartial.get($scope.projectID),
            function (response) {
                $scope.isLoadingUsers = false;
                applyRemoteData(response.users);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your project collaborators. Try refreshing your browser.");
            }
            );
        }
        function sortUsers(users) {
            return (_.sortOnProperty(users, "name", "asc"));
        }
        $scope.notifyCollaborators = function () {
            var userIDs = getSelectedUserIDs();
            if (!userIDs) {
                return (
                $scope.closeModalWindow()
                );
            }
            Deferred.handlePromise(
            screenService.sendWorkflowStatusNotification($scope.screenID, userIDs),
            function () {
                $scope.closeModalWindow();
            },
            function () {
                $scope.errorMessage = "For some reason, we couldn't notify the selected collaborators. Try refreshing your browser.";
            }
            );
        };
        $scope.toggleUserSelection = function (user) {
            user.isSelectedForNotification = !user.isSelectedForNotification;
            if (user.isSelectedForNotification) {
                $scope.selectedCount++;
            } else {
                $scope.selectedCount--;
            }
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.screenID = modalWindowRequest.getData(1);
        $scope.isLoadingUsers = false;
        $scope.users = [];
        $scope.selectedCount = 0;
        $scope.errorMessage = null;
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! existing-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.share.ExistingController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, shareService, existingSharesModalPartial, _) {
        function applyRemoteData(shares, shareUrl) {
            $scope.shares = shares;
            $scope.shareUrl = shareUrl;
            $scope.shortShareUrl = shareUrl.replace(new RegExp("^https?://", "i"), "");
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            existingSharesModalPartial.get($scope.projectID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.shares,
                response.shareUrl
                );
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't load your shares.");
            }
            );
        }
        $scope.revokeAllShares = function () {
            $scope.shares = [];
            Deferred.handlePromise(
            shareService.revokeAllShares($scope.projectID),
            function (response) {
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't revoke your shares.");
            }
            );
        };
        $scope.revokeShare = function (share) {
            $scope.shares = _.rejectWithProperty($scope.shares, "id", share.id);
            Deferred.handlePromise(
            shareService.revokeShare(share.id),
            function (response) {
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't revoke that share.");
            }
            );
        };
        $scope.isLoading = false;
        $scope.shares = [];
        $scope.shareUrl = "";
        $scope.shortShareUrl = "";
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! new-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.share.NewController", Controller);
    /** @ngInject */
    function Controller($scope, $location, Deferred, shareService, newShareModalPartial, validationService, _) {
        function applyRemoteData(share, shareUrl, screens) {
            screens = _.sortOnProperty(screens, "sort");
            screens = _.setProperty(screens, "isHome", false);
            screens[0].name = (screens[0].name + " ( Home )");
            $scope.screens = screens;
            $scope.shareUrl = shareUrl;
            $scope.form.shareID = share.id;
            $scope.form.startScreen = _.findWithProperty(screens, "id", share.screenID);
            $scope.form.isCommentingAllowed = share.isCommentingAllowed;
            $scope.form.isNavigateAllowed = share.isNavigateAllowed;
            $scope.form.isResizeWindow = share.isResizeWindow;
            $scope.form.isLoadAllScreens = share.isLoadAllScreens;
            $scope.form.isUserTesting = share.isUserTesting;
            $scope.form.isAnonymousViewingAllowed = share.isAnonymousViewingAllowed;
            $scope.form.password = share.password;
            $scope.form.key = share.key;
            if ($scope.form.isAnonymousViewingAllowed) {
                $scope.form.isRequireUserIdentification = false;
            }
            else {
                $scope.form.isRequireUserIdentification = true;
            }
        }
        function getSmsErrorMessage(response) {
            if (validationService.isForbidden(response)) {
                return ("You have reached your SMS limit for the hour. Please try again shortly.");
            } else {
                return ("We were unable to send an SMS message to that phone number.");
            }
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            newShareModalPartial.get($scope.projectID, $scope.screenID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.share,
                response.shareUrl,
                response.screens
                );
            },
            function (response) {
                $scope.openModalWindow("error", "You cannot share this project until you upload at least one screen.");
            }
            );
        }
        $scope.openShareInNewWindow = function () {
            if ($scope.form.isShareGenerated) {
                window.open($scope.shareUrl + $scope.form.key, "_blank");
            }
        }
        $scope.sendEmail = function () {
            if (!(/[^@]+@[^.]+\.\w+/i).test($scope.form.emails)) {
                $scope.errorMessage = "Please include at least one email address.";
                return;
            }
            $scope.form.emails = $scope.form.emails.replace(new RegExp("[\\s,;]+", "g"), ", ");
            $scope.showSuccessMessage = false;
            Deferred.handlePromise(
            shareService.sendEmail($scope.form.shareID, $scope.form.emails, $scope.form.message),
            function (response) {
                $scope.showSuccessMessage = true;
                $scope.errorMessage = null;
            },
            function (response) {
                $scope.errorMessage = "We were unable to send your email. Please double-check your email address(es).";
            }
            );
        };
        $scope.sendSMS = function () {
            var phoneNumber = $scope.form.phoneNumber.replace(/[^\d]+/g, "");
            if (phoneNumber.length !== 10) {
                $scope.errorMessage = "At this time, we only support 10-digit U.S. phone numbers.";
                return;
            }
            $scope.showSuccessMessage = false;
            Deferred.handlePromise(
            shareService.sendSMS($scope.form.shareID, phoneNumber),
            function (response) {
                $scope.showSuccessMessage = true;
                $scope.errorMessage = null;
            },
            function (response) {
                $scope.errorMessage = getSmsErrorMessage(response);
            }
            );
        };
        $scope.showShareMethodView = function (shareMethodView) {
            $scope.shareMethodView = shareMethodView;
            $scope.showSuccessMessage = false;
            $scope.errorMessage = null;
        };
        $scope.toggleEmailMessage = function () {
            $scope.showEmailMessage = !$scope.showEmailMessage;
        };
        $scope.updatePassword = function () {
            if (!$scope.form.isUsingPassword && $scope.form.password) {
                $scope.form.password = "";
                $scope.updateShare();
            }
        };
        $scope.updateShare = function () {
            $scope.form.isShareGenerated = false;
            if ($scope.form.isRequireUserIdentification) {
                $scope.form.isAnonymousViewingAllowed = false;
            }
            else {
                $scope.form.isAnonymousViewingAllowed = true;
            }
            $scope.showSuccessMessage = false;
            Deferred.handlePromise(
            shareService.createShare(
            $scope.projectID,
            $scope.form.startScreen.id,
            $scope.form.isCommentingAllowed,
            $scope.form.isNavigateAllowed,
            $scope.form.isResizeWindow,
            $scope.form.isLoadAllScreens,
            $scope.form.isUserTesting,
            $scope.form.isAnonymousViewingAllowed,
            $scope.form.password
            ),
            function (response) {
                $scope.form.shareID = response.id;
                $scope.form.startScreen = _.findWithProperty($scope.screens, "id", response.screenID);
                $scope.form.isCommentingAllowed = response.isCommentingAllowed;
                $scope.form.isNavigateAllowed = response.isNavigateAllowed;
                $scope.form.isResizeWindow = response.isResizeWindow;
                $scope.form.isLoadAllScreens = response.isLoadAllScreens;
                $scope.form.isUserTesting = response.isUserTesting;
                $scope.form.isAnonymousViewingAllowed = response.isAnonymousViewingAllowed;
                $scope.form.password = response.password;
                $scope.form.key = response.key;
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't create that share. This was unexpected!");
            }
            );
        };
        $scope.isLoading = false;
        $scope.screens = [];
        $scope.shareUrl = "";
        $scope.form = {
            shareID: 0,
            startScreen: null,
            isCommentingAllowed: false,
            isNavigateAllowed: false,
            isResizeWindow: false,
            isLoadAllScreens: false,
            isUserTesting: false,
            isAnonymousViewingAllowed: false,
            isUsingPassword: false,
            password: "",
            key: "",
            phoneNumber: "",
            emails: "",
            message: "",
            isShareGenerated: false
        };
        $scope.showSuccessMessage = false;
        $scope.shareMethodView = "clipboard";
        $scope.errorMessage = null;
        $scope.showEmailMessage = false;
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! share-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("modal.share.ShareController", Controller);
    /** @ngInject */
    function Controller($scope, modalWindowRequest, _) {
        $scope.showSubview = function (section) {
            $scope.subview = section;
        };
        $scope.projectID = modalWindowRequest.getData(0);
        $scope.screenID = modalWindowRequest.getData(1, 0);
        $scope.subview = "new";
    }
})(angular, InVision);
;
;
/*! new-features-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("newFeatures.newFeaturesController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, _, accountService, releaseNotificationService, moment) {
        function loadRemoteData() {
            Deferred.handlePromise(
            releaseNotificationService.getReleaseNotifications(),
            function (announcements) {
                var showThese = [];
                showThese = _.map(announcements, function (announcement) {
                    return {
                        title: announcement.title,
                        createdAtMonthDay: moment.utc(announcement.createdAt).format("MMM D"),
                        createdAtYear: moment.utc(announcement.createdAt).year(),
                        content: announcement.content
                    };
                });
                $scope.featureAnnouncements = showThese;
            }
            );
        }
        function updateFeatureAnnouncementsLastViewedAt() {
            Deferred.handlePromise(
            accountService.updateFeatureAnnouncementsLastViewedAt(
            moment.utc().format("YYYY-MM-DD HH:mm:ss")
            ),
            function (response) {
            },
            function (response) {
            }
            );
        }
        $scope.$on("$destroy", function () {
            $scope.hideNewFeatureLink();
        });
        $scope.$on("newFeatureAnnounced", function () {
            loadRemoteData();
        });
        var renderContext = requestContext.getRenderContext("standard.new-features.default");
        $scope.isLoading = false;
        $scope.featureAnnouncements = [];
        $scope.setWindowTitle("New Features!");
        updateFeatureAnnouncementsLastViewedAt();
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! apps-controller-DISABLED.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.AppsController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, _, appsService) {
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            appsService.getApps(),
            function (response) {
                $scope.isLoading = false;
                $scope.currentApps = response;
            },
            function () {
            }
            );
        }
        $scope.addToNotificationList = function (app) {
            Deferred.handlePromise(
            appsService.addNotification(app.id),
            function (response) {
                app.added = true;
            },
            function (response) {
            }
            );
        };
        var renderContext = requestContext.getRenderContext("standard.project.detail.apps", "projectID");
        $scope.currentApps = [];
        $scope.isLoading = false;
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            if (requestContext.hasParamChanged("projectID")) {
                loadRemoteData();
            }
        }
        );
        $scope.setWindowTitle("Project Apps");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! asset-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.AssetController", Controller);
    /** @ngInject */
    function Controller($scope, _) {
        $scope.hideDeleteConfirmation = function () {
            $scope.isShowingDeleteConfirmation = false;
        };
        $scope.showDeleteConfirmation = function () {
            $scope.hideAllOverlays();
            $scope.isShowingDeleteConfirmation = true;
        };
        $scope.showShareOverlay = function () {
            $scope.hideAllOverlays();
            $scope.isShowingShareOverlay = true;
            $scope.isShowingTools = true;
            $scope.setAssetsSortableDisabled(true);
        };
        $scope.hideShareOverlay = function (event) {
            if (_.isUndefined(event) || event.target.className == 'confirmation shareOverlay') {
                $scope.isShowingShareOverlay = false;
                $scope.isShowingTools = false;
                $scope.setAssetsSortableDisabled(false);
            }
        };
        $scope.showMetaOverlay = function () {
            $scope.hideAllOverlays();
            $scope.isShowingMetaOverlay = true;
            $scope.isShowingTools = true;
        }
        $scope.hideMetaOverlay = function () {
            $scope.isShowingMetaOverlay = false;
            $scope.isShowingTools = false;
        }
        $scope.hideAllOverlays = function () {
            $scope.hideShareOverlay();
            $scope.hideDeleteConfirmation();
            $scope.hideMetaOverlay();
        }
        $scope.isShowingDeleteConfirmation = false;
        $scope.isShowingShareOverlay = false;
        $scope.isShowingMetaOverlay = false;
        $scope.isShowingTools = false;
    }
})(angular, InVision);
;
;
/*! assets-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.AssetsController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, accountService, assetService, _, projectAssetsPartial, Deferred, modelEvents, sessionService, $filter, $timeout, dateHelper, userService) {
        function loadRemoteData() {
            $scope.isLoading = true;
            $scope.isCheckProcessingAssets = false;
            $scope.checkingProcessingAssetsIDs = [];
            Deferred.handlePromise(
            projectAssetsPartial.get(requestContext.getParamAsInt("projectID")),
            function (response) {
                $scope.hasValidSubscription = response.permissions[0].canUseAssets;
                applyRemoteData(response.assets);
                $scope.isLoading = false;
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't load your assets. Try refreshing your browser.");
            }
            );
        }
        function applyRemoteData(assets) {
            $scope.selectedAssetCount = 0;
            assets = augmentAssets(assets);
            $scope.assets = getMergedAssetsForPerformance($scope.assets, assets);
            $scope.shouldSeeTour = $scope.shouldSeeTour && ($scope.assets.length === 0);
            applyAssets();
        }
        function getMergedAssetsForPerformance(oldAssets, newAssets) {
            for (var o = 0, oLength = oldAssets.length ; o < oLength ; o++) {
                var oldAsset = oldAssets[o];
                for (var n = 0, nLength = newAssets.length ; n < nLength ; n++) {
                    var newAsset = newAssets[n];
                    if (oldAsset.id === newAsset.id) {
                        newAsset.$$hashKey = oldAsset.$$hashKey;
                        break;
                    }
                }
            }
            return (newAssets);
        }
        function applyAssets() {
            $scope.processingAssets = getProcessingAssets();
            if ($scope.processingAssets.length && !$scope.isCheckProcessingAssets) {
                thumbnailTimer = $timeout(loadRemoteData, 2000);
                $scope.isCheckProcessingAssets = true;
            }
            if (!$scope.assets.length) {
                $scope.isShowingUploader = true;
            }
            var knownFileTypes = ['pdf', 'ai', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'gif', 'key', 'graffle', 'psd', 'psb', 'sketch', 'doc', 'docx'];
            for (var a = 0; a < $scope.assets.length; a++) {
                var fileExtension = $scope.assets[a].clientFilename.split('.').pop().toLowerCase();
                $scope.assets[a].fileExtension = fileExtension;
                if (knownFileTypes.indexOf(fileExtension) >= 0) {
                    $scope.assets[a].fileType = fileExtension;
                } else {
                    $scope.assets[a].fileType = 'generic';
                }
            }
            for (var a = 0; a < $scope.assets.length; a++) {
                $scope.assets[a].formattedCreatedAt = dateHelper.formatRecentDate($scope.assets[a].createdAt, 'mmm dd') + ' at ' + dateHelper.formatTime($scope.assets[a].createdAt, 'h:mmtt');
                $scope.assets[a].formattedUpdatedAt = dateHelper.formatRecentDate($scope.assets[a].updatedAt, 'mmm dd') + ' at ' + dateHelper.formatTime($scope.assets[a].updatedAt, 'h:mmtt');
            }
        }
        function augmentAsset(asset) {
            if (asset.createdByUserName) {
                asset.createdByInitials = userService.getInitials(asset.createdByUserName);
                asset.createdByHasSystemAvatar = userService.isSystemAvatar(asset.createdByAvatarID);
            }
            if (asset.updatedByUserName) {
                asset.updatedByInitials = userService.getInitials(asset.updatedByUserName);
                asset.updatedByHasSystemAvatar = userService.isSystemAvatar(asset.updatedByAvatarID);
            }
            return (asset);
        }
        function augmentAssets(assets) {
            _.each(assets, augmentAsset);
            return (assets);
        }
        function getProcessingAssets() {
            return _.withoutProperty($scope.assets, "isProcessed", true);
        }
        function addUploadedAsset(asset) {
            var existingAsset = _.findWithProperty($scope.assets, "id", asset.id);
            asset = augmentAsset(asset);
            if (existingAsset) {
                _.extendExistingProperties(existingAsset, asset);
            } else {
                $scope.assets.push(asset);
            }
            loadRemoteData();
        }
        $scope.closeTour = function () {
            $scope.shouldSeeTour = false;
            accountService.markAssetTourClosed();
            sessionService.user.hasSeenAssetTour = true;
        };
        $scope.toggleUploader = function () {
            $scope.isShowingUploader = !$scope.isShowingUploader;
        };
        $scope.deleteAsset = function (asset) {
            Deferred.handlePromise(
            assetService.deleteAsset(asset.id),
            function () {
                $scope.$emit("assets:deleted", asset);
                loadRemoteData();
            },
            function () {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't delete that asset.");
            }
            );
            $scope.assets = _.withoutProperty($scope.assets, "id", asset.id);
        };
        $scope.toggleSubscribeToAsset = function (asset) {
            if (!asset.isSubscribed) {
                Deferred.handlePromise(
                assetService.subscribeToAsset(asset.id),
                function () {
                    loadRemoteData();
                },
                function () {
                    $scope.openModalWindow("error", "For some reason, we couldn't subscribe to that asset.");
                }
                );
            } else {
                Deferred.handlePromise(
                assetService.unSubscribeToAsset(asset.id),
                function () {
                    loadRemoteData();
                },
                function () {
                    $scope.openModalWindow("error", "For some reason, we couldn't unsubscribe to that asset.");
                }
                );
            }
        };
        $scope.openAssetsVideo = function () {
            $scope.openModalWindow("video", "64846864");
        };
        $scope.isCompanyUser = function (emailAddress) {
            return (emailAddress.indexOf("@invisionapp.com") != -1);
        }
        var renderContext = requestContext.getRenderContext("standard.project.detail.assets", "projectID");
        var LAST_SORT_VALUE = 999999;
        var thumbnailTimer = null;
        $scope.projectID = requestContext.getParamAsInt("projectID");
        $scope.isLoading = false;
        $scope.isShowingUploader = false;
        $scope.assets = [];
        $scope.processingAssets = [];
        $scope.assetFilter = "";
        $scope.hasValidSubscription = false;
        $scope.shouldSeeTour = (!sessionService.user.hasSeenAssetTour);
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("assetUploaded.projectAssets");
            $timeout.cancel(thumbnailTimer);
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            $scope.projectID = requestContext.getParamAsInt("projectID");
            $scope.subview = (renderContext.getNextSection() || "list");
            $scope.isShowingUploader = false;
            if (requestContext.hasParamChanged("projectID")) {
                loadRemoteData();
            }
        }
        );
        $scope.$on(
        "projectAssets:dragEnter",
        function () {
            $scope.isShowingUploader = true;
        }
        );
        modelEvents.on(
        "assetUploaded.projectAssets",
        function (event, asset) {
            if (asset.projectID !== $scope.projectID) {
                return;
            }
            addUploadedAsset(asset);
        }
        );
        $scope.$on(
        "assets:sortUpdate",
        function () {
            var assetIDs = _.pluck($scope.assets, "id");
            assetService.updateSort($scope.projectID, assetIDs);
            for (var i = 0, length = $scope.assets.length ; i < length ; i++) {
                $scope.assets[i].sort = i;
            }
        }
        );
        $scope.setWindowTitle("Project Assets");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! comments-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.CommentsController", Controller);
    /** @ngInject */
    function Controller($scope, $timeout, $location, requestContext, Deferred, projectService, conversationService, projectConversationsPartial, sessionService, dateHelper, modelEvents, hashKeyCopier, userService, _) {
        function applyFiltersToUrl() {
            var readFilter = $scope.filters.read.value;
            var statusFilter = $scope.filters.status.value;
            var typeFilter = $scope.filters.type.value;
            var searchFilter = $scope.filters.search;
            $location.path("/projects/" + $scope.projectID + "/comments/" + readFilter + "/" + statusFilter + "/" + typeFilter);
            if (searchFilter) {
                $location.search("search", searchFilter);
            } else {
                $location.search("search", null);
            }
        }
        function applyLocalFilters() {
            clearLocalFilters();
            var screens = $scope.activity.screens;
            applyReadFilterToScreens(screens, $scope.filters.read.value);
            applyTypeFilterToScreens(screens, $scope.filters.type.value);
            applySearchFilterToScreens(screens, $scope.filters.search);
            updateAggregates();
        }
        function applyLocalFiltersWithSearchOptimization() {
            applySearchFilterToScreens($scope.activity.screens, $scope.filters.search);
            updateAggregates();
        }
        function applyReadFilterToConversations(conversations, isUnread) {
            var conversationsToHide = _.withoutProperty(conversations, "isUnread", isUnread);
            _.setProperty(conversationsToHide, "isShown", false);
        }
        function applyReadFilterToScreens(screens, filterValue) {
            if (filterValue === "all") {
                return;
            }
            _.each(
            screens,
            function (screen) {
                if (!screen.isShown) {
                    return;
                }
                applyReadFilterToConversations(screen.conversations, true);
                screen.isShown = _.containsWithProperty(screen.conversations, "isShown", true);
            }
            );
        }
        function applyRemoteData(project, projectMembers, projectStakeholders, activity, commentFilters) {
            $scope.project = project;
            $scope.projectMembers = projectMembers;
            $scope.projectStakeholders = projectStakeholders;
            var currentUser = _.findWithProperty($scope.projectMembers, "id", $scope.userID);
            $scope.projectMembers = _.rejectWithProperty($scope.projectMembers, "id", $scope.userID);
            $scope.projectMembers.push(currentUser);
            augmentScreens(activity.screens);
            $scope.activity = hashKeyCopier.copyHashKeys($scope.activity, activity);
            if (_.isUndefined(commentFilters.status) || commentFilters.status.length === 0) {
                $scope.loadFiltersFromUser = false;
            }
            if ($scope.loadFiltersFromUser) {
                $scope.filters.read = _.findWithProperty($scope.readFilterOptions, "value", commentFilters.read);
                $scope.filters.type = _.findWithProperty($scope.typeFilterOptions, "value", commentFilters.type);
                $scope.filters.status = _.findWithProperty($scope.statusFilterOptions, "value", commentFilters.status);
            }
            applyLocalFilters();
            if ($scope.loadFiltersFromUser) {
                applyFiltersToUrl();
            }
            $scope.loadFiltersFromUser = false;
        }
        function applySearchFilterToConversations(conversations, substring) {
            var conversationsToHide = _.filter(
            conversations,
            function (conversation) {
                return (conversation.searchText.indexOf(substring) === -1);
            }
            );
            _.setProperty(conversationsToHide, "isShown", false);
        }
        function applySearchFilterToScreens(screens, filterValue) {
            if (!filterValue) {
                return;
            }
            filterValue = filterValue.toLowerCase();
            _.each(
            screens,
            function (screen) {
                if (!screen.isShown) {
                    return;
                }
                applySearchFilterToConversations(screen.conversations, filterValue);
                screen.isShown = _.containsWithProperty(screen.conversations, "isShown", true);
            }
            );
        }
        function applyTypeFilterToConversations(conversations, isForDevelopment) {
            var conversationsToHide = _.withoutProperty(conversations, "isForDevelopment", isForDevelopment);
            _.setProperty(conversationsToHide, "isShown", false);
        }
        function applyTypeFilterToScreens(screens, filterValue) {
            if (filterValue === "all") {
                return;
            }
            _.each(
            screens,
            function (screen) {
                if (!screen.isShown) {
                    return;
                }
                applyTypeFilterToConversations(screen.conversations, (filterValue === "dev-notes"));
                screen.isShown = _.containsWithProperty(screen.conversations, "isShown", true);
            }
            );
        }
        function augmentComment(comment) {
            comment.isShown = true;
            comment.dateLabel = dateHelper.formatRecentDate(comment.updatedAt, "mmm d");
            comment.timeLabel = dateHelper.formatTime(comment.updatedAt, "h:mmtt");
            comment.userInitials = userService.getInitials(comment.userName);
            comment.userHasSystemAvatar = userService.isSystemAvatar(comment.avatarID);
            comment.html = conversationService.getHtmlForComment(comment.comment);
            return (comment);
        }
        function augmentConversation(conversation) {
            conversation.isShown = true;
            conversation.isCommentInputVisible = false;
            conversation.newComment = "";
            conversation.notifyOthers = "";
            conversation.showNotifyOthers = false;
            conversation.isNotifySettingsVisible = false;
            conversation.hiddenCommentCount = 0;
            _.each(
            conversation.comments,
            function (comment, i) {
                augmentComment(comment);
                if (i == 0 || i > conversation.comments.length - 3 || comment.isUnread) {
                    comment.isShown = true;
                } else {
                    comment.isShown = false;
                    conversation.hiddenCommentCount++;
                }
            }
            );
            conversation.searchText = getConversationSearchText(conversation);
            return (conversation);
        }
        function augmentConversations(conversations) {
            _.each(conversations, augmentConversation);
            return (conversations);
        }
        function augmentScreen(screen) {
            screen.isShown = true;
            screen.dateLabel = dateHelper.formatRecentDate(screen.updatedAt, "mmm d, yyyy");
            screen.timeLabel = dateHelper.formatTime(screen.updatedAt, "h:mmtt");
            screen.conversationCount = 0;
            screen.commentCount = 0;
            augmentConversations(screen.conversations);
            return (screen);
        }
        function augmentScreens(screens) {
            _.each(screens, augmentScreen);
            return (screens);
        }
        function clearLocalFilters() {
            var screens = $scope.activity.screens;
            for (var i = 0, length = screens.length ; i < length ; i++) {
                var screen = screens[i];
                screen.isShown = true;
                _.setProperty(screen.conversations, "isShown", true);
            }
        }
        function getBestReadFilterOption() {
            var option = _.findWithProperty($scope.readFilterOptions, "value", requestContext.getParam("readFilter"));
            if (!option) {
                option = $scope.readFilterOptions[0];
            }
            return (option);
        }
        function getBestSearchFilter() {
            if ($location.search().search === true) {
                return ("");
            }
            return ($location.search().search || "");
        }
        function getBestStatusFilterOption() {
            var option = _.findWithProperty($scope.statusFilterOptions, "value", requestContext.getParam("statusFilter"));
            if (!option) {
                option = $scope.statusFilterOptions[1];
            }
            return (option);
        }
        function getBestTypeFilterOption() {
            var option = _.findWithProperty($scope.typeFilterOptions, "value", requestContext.getParam("typeFilter"));
            if (!option) {
                option = $scope.typeFilterOptions[1];
            }
            return (option);
        }
        function getConversationSearchText(conversation) {
            var commentData = _.pluck(conversation.comments, "comment");
            var searchText = commentData.join("~").toLowerCase();
            return (searchText);
        }
        function handleProjectStakeholderRemoved(event, projectID, userID) {
            $scope.projectStakeholders = _.rejectWithProperty($scope.projectStakeholders, "id", userID);
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            $scope.activity = [];
            Deferred.handlePromise(
            projectConversationsPartial.get($scope.projectID, $scope.filters.status.value),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.project,
                response.projectMembers,
                response.projectStakeholders,
                response.conversations,
                response.commentFilters
                );
            },
            function () {
                $scope.openModalWindow("error", "For some reason we couldn't load your comments. Try refreshing your browser.");
            }
            );
        };
        function saveConversation(conversation) {
            var promise = conversationService.saveConversation(conversation);
            Deferred.handlePromise(
            promise,
            null,
            function () {
            }
            );
        }
        function updateAggregates() {
            $scope.commentCount = 0;
            _.each(
            $scope.activity.screens,
            function (screen) {
                if (!screen.isShown) {
                    return;
                }
                var visibleConversations = _.withProperty(screen.conversations, "isShown", true);
                screen.conversationCount = visibleConversations.length;
                screen.commentCount = _.flatten(_.pluck(visibleConversations, "comments"), true).length;
                $scope.commentCount += screen.commentCount;
            }
            );
        }
        function updateUserCommentFilters() {
            Deferred.handlePromise(
            projectConversationsPartial.updateFilters($scope.filters),
            function (response) {
            },
            function () {
            }
            );
        }
        $scope.cancelEditingComment = function (comment) {
            comment.isEditing = false;
            if (comment.originalComment) {
                comment.comment = comment.originalComment;
            }
        };
        $scope.changeReadFilter = function (newFilter) {
            if ($scope.filters.read === newFilter) {
                return;
            }
            $scope.filters.read = newFilter;
            applyLocalFilters();
            applyFiltersToUrl();
            $scope.filtersChangedByUser = true;
        };
        $scope.changeStatusFilter = function (newFilter) {
            if ($scope.filters.status === newFilter) {
                return;
            }
            $scope.filters.status = newFilter;
            loadRemoteData();
            applyFiltersToUrl();
            $scope.filtersChangedByUser = true;
        };
        $scope.changeTypeFilter = function (newFilter) {
            if ($scope.filters.type === newFilter) {
                return;
            }
            $scope.filters.type = newFilter;
            applyLocalFilters();
            applyFiltersToUrl();
            $scope.filtersChangedByUser = true;
        };
        $scope.clearSearchText = function () {
            $scope.filters.search = "";
        };
        $scope.closeConversationPanel = function (conversation) {
            conversation.newComment = "";
            conversation.notifyOthers = "";
            conversation.isCommentInputVisible = false;
            conversation.isNotifySettingsVisible = false;
        };
        $scope.deleteComment = function (comment, conversation, screen) {
            conversationService.deleteComment(comment);
            conversation.comments = _.rejectWithProperty(conversation.comments, "id", comment.id);
            conversation.searchText = getConversationSearchText(conversation);
            updateAggregates();
        };
        $scope.deleteSketch = function (sketchID, comment) {
            conversationService.deleteSketch(sketchID);
            comment.sketches = _.rejectWithProperty(comment.sketches, "sketchID", sketchID);
        };
        $scope.deleteConversation = function (conversation, screen) {
            conversationService.deleteConversation(conversation);
            screen.conversations = _.withoutProperty(screen.conversations, "id", conversation.id);
            var visibleConversations = _.withProperty(screen.conversations, "isShown", true);
            if (!visibleConversations.length) {
                screen.isShown = false;
            }
            updateAggregates();
        };
        $scope.editComment = function (comment, conversation) {
            $scope.stopEditingComments(conversation);
            comment.isEditing = true;
            comment.originalComment = comment.comment;
        };
        $scope.getNotifyCount = function (conversation) {
            var count = 0;
            _.each($scope.projectMembers, function (user) {
                if (user.isNotify) {
                    count++;
                }
            });
            _.each($scope.projectStakeholders, function (user) {
                if (user.isNotify) {
                    count++;
                }
            });
            if (conversation.notifyOthers) {
                var others = conversation.notifyOthers.split(",");
                count += others.length;
            }
            return count;
        };
        $scope.hideConversation = function (screen, conversation) {
            conversation.isShown = false;
            applyLocalFilters();
        };
        $scope.hideDeleteConfirmation = function (conversation) {
            conversation.isDeleting = false;
        };
        $scope.isStakeholdersShowing = function (conversation) {
            var isStakeholdersListEmpty = !$scope.projectStakeholders.length;
            if (conversation.isPrivate || conversation.isForDevelopment || isStakeholdersListEmpty) {
                return false;
            } else {
                return true;
            }
        };
        $scope.loadStakeholders = function () {
            var promise = Deferred.handlePromise(
            projectService.getStakeholders($scope.projectID),
            function (response) {
                $scope.projectStakeholders = response;
            }
            );
            return (promise);
        };
        $scope.markCompleted = function (conversation) {
            conversation.isComplete = !conversation.isComplete;
            saveConversation(conversation);
            if (conversation.isUnread) {
                $scope.markRead(conversation);
            }
        };
        $scope.markRead = function (conversation) {
            var comments = _.filter(conversation.comments, function (comment) {
                return comment.isUnread === true;
            });
            var commentIDs = _.pluck(comments, 'id');
            _.setProperty(conversation.comments, "isUnread", false);
            if (commentIDs.length) {
                conversationService.markCommentsAsRead(commentIDs);
                conversation.isUnread = false;
            }
        };
        $scope.markAllAsRead = function (screens) {
            _.each(screens, function (screen, key) {
                if (screen.isShown === true) {
                    _.each(screen.conversations, function (conversation, key) {
                        if (conversation.isShown === true) {
                            $scope.markRead(conversation);
                        }
                    });
                }
            });
        };
        $scope.removeConversation = function (screen, conversation) {
            screen.conversations = _.without(screen.conversations, conversation);
            applyLocalFilters();
        };
        $scope.removeStakeholder = function (stakeholder) {
            projectService.removeStakeholderFromProject($scope.projectID, stakeholder.id);
        };
        $scope.saveComment = function (comment, conversation, screen) {
            if (!comment.comment) {
                return;
            }
            comment.isEditing = false;
            comment.originalComment = comment.comment;
            comment.html = conversationService.getHtmlForComment(comment.comment);
            if (comment.id) {
                var notify = {
                    members: [],
                    stakeholders: [],
                    others: [],
                    unsubscribe: []
                };
            } else {
                var memberIDs = _.filterWithProperty($scope.projectMembers, "isNotify", true);
                var stakeholderIDs = _.filterWithProperty($scope.projectStakeholders, "isNotify", true);
                var notify = {
                    members: _.pluck(memberIDs, "id"),
                    stakeholders: _.pluck(stakeholderIDs, "id"),
                    others: [],
                    unsubscribe: []
                };
                var membersToUnsubscribe = _.filterWithProperty($scope.projectMembers, "isNotify", false);
                var stakeholdersToUnsubscribe = _.filterWithProperty($scope.projectStakeholders, "isNotify", false);
                notify.unsubscribe = _.pluck(membersToUnsubscribe, "id");
                notify.unsubscribe = notify.unsubscribe.concat(_.pluck(stakeholdersToUnsubscribe, "id"));
                if (conversation.notifyOthers) {
                    notify.others = conversation.notifyOthers.split(",");
                }
            }
            comment.notify = notify;
            comment.conversationID = conversation.id;
            Deferred.handlePromise(
            conversationService.saveComment(comment),
            function (savedComment) {
                if (!comment.id) {
                    augmentComment(savedComment);
                    conversation.comments.push(savedComment);
                    updateAggregates();
                    conversation.subscribers = notify.members.concat(notify.stakeholders);
                }
                if (notify.others.length) {
                    $scope.loadStakeholders().then(
                    function (stakeholders) {
                        var newUserIDs = [];
                        _.each(
                        stakeholders,
                        function (stakeholder) {
                            if (
                            _.contains(notify.subscribers, stakeholder.id) ||
                            _.contains(notify.unsubscribe, stakeholder.id)
                            ) {
                                return;
                            }
                            newUserIDs.push(stakeholder.id);
                        }
                        );
                        if (!newUserIDs.length) {
                            return;
                        }
                        conversation.subscribers = conversation.subscribers.concat(newUserIDs);
                    }
                    );
                }
                conversation.searchText = getConversationSearchText(conversation);
                conversation.newComment = "";
                conversation.isCommentInputVisible = false;
                conversation.notifyOthers = "";
                conversation.showNotifyOthers = false;
                conversation.isNotifySettingsVisible = false;
                if (conversation.isUnread) {
                    $scope.markRead(conversation);
                }
            }
            );
        };
        $scope.showCommentInput = function (conversation) {
            for (var s = 0 ; s < $scope.activity.screens.length ; s++) {
                for (var c = 0 ; c < $scope.activity.screens[s].conversations.length ; c++) {
                    $scope.activity.screens[s].conversations[c].isCommentInputVisible = false;
                }
            }
            _.setProperty($scope.projectMembers, "isNotify", false);
            _.setProperty($scope.projectStakeholders, "isNotify", false);
            var selectedMembers = _.withPropertyRange($scope.projectMembers, "id", conversation.subscribers);
            var selectedStakeholders = _.withPropertyRange($scope.projectStakeholders, "id", conversation.subscribers);
            _.setProperty(selectedMembers, "isNotify", true);
            _.setProperty(selectedStakeholders, "isNotify", true);
            conversation.isCommentInputVisible = true;
        };
        $scope.showDeleteConfirmation = function (comment, conversation, isFirstComment) {
            if (isFirstComment) {
                conversation.isDeleting = true;
            } else {
                comment.isDeleting = true;
            }
        };
        $scope.stopEditingComments = function (conversation) {
            _.each(conversation.comments, function (comment) {
                $scope.cancelEditingComment(comment);
            });
        };
        $scope.showAllComments = function (conversation) {
            _.setProperty(conversation.comments, "isShown", true);
            conversation.hiddenCommentCount = 0;
        };
        var renderContext = requestContext.getRenderContext("standard.project.detail.comments", ["projectID", "readFilter", "statusFilter", "typeFilter"]);
        $scope.projectID = requestContext.getParamAsInt("projectID");
        $scope.isLoading = false;
        $scope.activity = [];
        $scope.project = null;
        $scope.projectMembers = [];
        $scope.projectStakeholders = [];
        $scope.commentCount = 0;
        $scope.user = sessionService.user;
        $scope.userID = sessionService.user.id;
        $scope.notifySettings = {
            isTeamChecked: false,
            isStakeholdersChecked: false
        };
        $scope.readFilterOptions = [
        {
            label: "All Comments",
            value: "all"
        },
        {
            label: "Unread",
            value: "unread"
        }
        ];
        $scope.statusFilterOptions = [
        {
            label: "Any Status",
            value: "all"
        },
        {
            label: "Open",
            value: "open"
        },
        {
            label: "Completed",
            value: "completed"
        }
        ];
        $scope.typeFilterOptions = [
        {
            label: "All Types",
            value: "all"
        },
        {
            label: "Comments",
            value: "comments"
        },
        {
            label: "Dev Notes",
            value: "dev-notes"
        }
        ];
        $scope.filters = {
            read: getBestReadFilterOption(),
            status: getBestStatusFilterOption(),
            type: getBestTypeFilterOption(),
            search: getBestSearchFilter()
        };
        $scope.loadFiltersFromUser = true;
        $scope.filtersChangedByUser = false;
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("projectStakeholderRemoved.projectComments");
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            var previousReadFilter = $scope.filters.read;
            var previousStatusFilter = $scope.filters.status;
            var previousTypeFilter = $scope.filters.type;
            var previousSearchFilter = $scope.filters.search;
            $scope.projectID = requestContext.getParamAsInt("projectID");
            $scope.filters = {
                read: getBestReadFilterOption(),
                status: getBestStatusFilterOption(),
                type: getBestTypeFilterOption(),
                search: getBestSearchFilter()
            };
            if (requestContext.hasParamChanged("projectID")) {
                $scope.notifySettings.isTeamChecked = false;
                $scope.notifySettings.isStakeholdersChecked = false;
                loadRemoteData();
            } else if ($scope.filters.status !== previousStatusFilter) {
                loadRemoteData();
            } else if (
            !$scope.isLoading
            &&
            (
            ($scope.filters.read !== previousReadFilter) ||
            ($scope.filters.type !== previousTypeFilter) ||
            ($scope.filters.search !== previousSearchFilter)
            )
            ) {
                applyLocalFilters();
            }
        }
        );
        $scope.$watch("notifySettings.isTeamChecked", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                _.setProperty($scope.projectMembers, "isNotify", !!newValue);
            }
        });
        $scope.$watch("notifySettings.isStakeholdersChecked", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                _.setProperty($scope.projectStakeholders, "isNotify", !!newValue);
            }
        });
        $scope.$watch(
        "filters.search",
        function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if (newValue && (newValue.indexOf(oldValue) === 0)) {
                applyLocalFiltersWithSearchOptimization();
            } else {
                applyLocalFilters();
            }
            applyFiltersToUrl();
        }
        );
        $scope.$watch(
        "filters",
        function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if ($scope.filtersChangedByUser) {
                updateUserCommentFilters(newValue);
                $scope.filtersChangedByUser = false;
            }
        }
        );
        modelEvents.on("projectStakeholderRemoved.projectComments", handleProjectStakeholderRemoved);
        $scope.setWindowTitle("Project Comments");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! project-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.ProjectController", Controller);
    /** @ngInject */
    function Controller($scope, $window, $timeout, requestContext, $location, Deferred, projectService, projectDetailPartial, sessionService, modelEvents, moment, Debouncer, dateHelper, userService, _) {
        function applyRemoteData(project, projectStats, teamMembers, projectOwnerSubscription) {
            $scope.project = project;
            $scope.projectStats = projectStats;
            $scope.canArchiveScreens = projectOwnerSubscription.canArchiveScreens;
            $scope.isOwnedByUser = ($scope.project.userID === sessionService.user.id);
            $scope.canArchiveProject = ($scope.isOwnedByUser && sessionService.subscription.canArchiveProjects);
            $scope.isOverQuota = project.isOverQuota;
            $scope.isInGracePeriod = project.isInGracePeriod;
            if (project.isInGracePeriod) {
                var gracePeriodEndsAt = moment(projectOwnerSubscription.projectGracePeriodEndsAt);
                var daysRemaining = gracePeriodEndsAt.diff(moment(), "days");
                var hasScreens = projectStats.screenCount > 0;
                $scope.gracePeriodDisplay.isShownInitially = hasScreens && daysRemaining <= 5;
                $scope.gracePeriodDisplay.daysRemaining = daysRemaining;
            } else {
                $scope.gracePeriodDisplay.isShownInitially = false;
                $scope.gracePeriodDisplay.daysRemaining = 0;
            }
            $scope.ownersSubscription = projectOwnerSubscription;
            $scope.teamMembers = augmentTeamMembers(teamMembers, project.userID);
            $scope.projectOwner = _.findWithProperty($scope.teamMembers, "id", project.userID);
            updateExpirationStatus(projectOwnerSubscription.expiresAt);
            $scope.isMobile = project.isMobile;
            $scope.mobileDeviceID = project.mobileDeviceID;
            $scope.showCollabTooltip = moment().diff(project.createdAt, "days") <= 5;
            $scope.updateProjectLastAccessed($scope.project.id);
        }
        function augmentTeamMembers(teamMembers, ownerUserID) {
            for (var i = 0, length = teamMembers.length ; i < length ; i++) {
                var teamMember = teamMembers[i];
                teamMember.isProjectOwner = (teamMember.id === ownerUserID);
                teamMember.firstName = teamMember.name.split(/\s/)[0];
                teamMember.tooltip = teamMember.name;
                teamMember.initials = userService.getInitials(teamMember.name);
                teamMember.hasSystemAvatar = userService.isSystemAvatar(teamMember.avatarID);
                if (teamMember.isProjectOwner) {
                    teamMember.tooltip += " ( Owner )";
                }
                teamMember.onlineStatus = userService.getOnlineStatus(teamMember.lastRequestAt);
            }
            sortTeamMembers(teamMembers, ownerUserID);
            return (teamMembers);
        }
        function loadRemoteData() {
            var projectID = requestContext.getParamAsInt("projectID");
            if (
            $scope.project &&
            ($scope.project.id === projectID) &&
            !loadRemoteDataDebouncer.canProceed()
            ) {
                return;
            }
            $scope.isLoading = true;
            Deferred.handlePromise(
            projectDetailPartial.get(projectID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.project,
                response.projectStats,
                response.teamMembers,
                response.projectOwnerSubscription
                );
                $timeout(function () {
                    $scope.openNewProjectModalForSyncUsers(response.project);
                });
                startTimerToRefreshRemoteData();
            },
            function () {
                $scope.openModalWindow("error", "Sorry, you aren't a collaborator on the project you tried to access. Please inform the project owner.");
                $location.path("/");
                stopTimerToRefreshRemoteData();
            }
            );
        }
        function sortTeamMembers(teamMembers, ownerUserID) {
            teamMembers.sort(
            function (a, b) {
                if (a.id === ownerUserID) {
                    return (-1);
                } else if (b.id === ownerUserID) {
                    return (1);
                }
                return (a.lastRequestAt < b.lastRequestAt ? 1 : -1);
            }
            );
            return (teamMembers);
        }
        function startTimerToRefreshRemoteData() {
            stopTimerToRefreshRemoteData();
            remoteDataTimer = $window.setInterval(loadRemoteData, (120 * 1000));
        }
        function stopTimerToRefreshRemoteData() {
            $window.clearInterval(remoteDataTimer);
        }
        function updateExpirationStatus(expiresAt) {
            $scope.expirationStatus.expiresAt = null;
            $scope.expirationStatus.isExpiring = false;
            $scope.expirationStatus.isExpiringSoon = false;
            $scope.expirationStatus.timeLeftInDays = 0;
            if (expiresAt && (parseInt(expiresAt) > 0)) {
                $scope.expirationStatus.expiresAt = new Date(expiresAt);
                $scope.expirationStatus.isExpiring = true;
                var now = new Date();
                var cutOffForDisplay = dateHelper.addDays(expiresAt, -5);
                if (now >= cutOffForDisplay) {
                    $scope.expirationStatus.isExpiringSoon = true;
                    $scope.expirationStatus.timeLeftInDays = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000));
                }
            }
        }
        function hideGracePeriodWarning() {
            $scope.gracePeriodDisplay.fadeOut = true;
        }
        $scope.closeCollabTooltip = function () {
            $scope.showCollabTooltip = false;
        }
        $scope.openNewProjectModalForSyncUsers = function (project) {
            if (!newProjectSyncModalIsOpen && project.isMobile === "") {
                newProjectSyncModalIsOpen = true;
                $scope.openModalWindow("changeProjectType", $scope.project);
            }
        }
        $scope.openChangeProjectTypeModal = function () {
            $scope.openModalWindow("changeProjectType", $scope.project);
        }
        $scope.addTeamMembers = function () {
            $scope.openModalWindow("projectMembers", $scope.project.id);
        };
        $scope.archiveProject = function () {
            if ($scope.canArchiveProject) {
                $scope.openModalWindow("archiveProject", $scope.project.id);
            } else { // can't archive, present a modal with a message
                $scope.openModalWindow("error", "Oops - Archive Projects is not available to Free or Starter members.");
            }
        };
        $scope.openChangePlanModal = function (showAllPlans) {
            if (showAllPlans == "undefined") {
                showAllPlans = false;
            }
            $scope.openModalWindow("changePlan", { showAllPlans: showAllPlans });
        }
        $scope.openNewProjectModal = function () {
            $scope.openModalWindow("newProject");
        };
        $scope.deleteProject = function () {
            $scope.openModalWindow("deleteProject", $scope.project.id);
        };
        $scope.duplicateProject = function () {
            $scope.openModalWindow("duplicateProject", $scope.project.id);
        };
        $scope.exportPDF = function () {
            if ($scope.getOwnersSubscription().canExportPDF) {
                $scope.openModalWindow("exportPDF", $scope.project.id);
            }
            else {
                $scope.openModalWindow("exportPDF_Upgrade", $scope.project.id);
            }
        };
        $scope.getOwnersSubscription = function () {
            return $scope.ownersSubscription;
        };
        $scope.openShareModal = function () {
            if ($scope.project.isOverQuota) {
                if ($scope.isOwnedByUser) {
                    return (
                    $scope.openModalWindow("changePlan")
                    );
                } else {
                    return (
                    $scope.openModalWindow("error", "Unfortunately, this project is over the owner's project quota.")
                    );
                }
            } else if (!$scope.projectStats.screenCount) {
                return (
                $scope.openModalWindow("error", "You can't share this project until at least one screen has been uploaded.")
                );
            }
            $scope.openModalWindow("share", $scope.project.id);
        };
        $scope.openConsole = function (projectId, screenItemId, mode) {
            if ($scope.project.isOverQuota) {
                if ($scope.isOwnedByUser) {
                    $scope.openModalWindow("changePlan");
                } else {
                    $scope.openModalWindow("error", "Unfortunately, this project is over the owner's project quota.");
                }
            } else {
                $location.path("/console/" + projectId + "/" + screenItemId + "/" + mode);
            }
        };
        $scope.saveProjectOffline = function () {
            $scope.openModalWindow("saveProjectOffline");
        };
        $scope.transferProject = function () {
            $scope.openModalWindow("transferProject", $scope.project.id);
        };
        $scope.viewProject = function ($event) {
            if ($scope.project.isOverQuota) {
                $event.preventDefault();
                if ($scope.isOwnedByUser) {
                    $scope.openModalWindow("changePlan");
                } else {
                    $scope.openModalWindow("error", "Unfortunately, this project is over the owner's project quota.");
                }
            } else if (!$scope.projectStats.screenCount) {
                $event.preventDefault();
                $scope.openModalWindow("error", "You can't view this project until at least one screen has been uploaded.")
            }
        };
        $scope.getCurrentProject = function () {
            return $scope.project;
        }
        $scope.shouldShowGracePeriodWarning = function () {
            if (!$scope.isInGracePeriod) {
                return false;
            }
            if ($scope.gracePeriodDisplay.isShownInitially) {
                return true;
            } else if ($scope.gracePeriodDisplay.daysRemaining <= 5) {
                return true;
            } else {
                return $scope.gracePeriodDisplay.daysRemaining == DAYS_IN_GRACE_PERIOD && $scope.gracePeriodDisplay.firstScreenUploaded;
            }
        }
        $scope.shouldFadeGracePeriodWarning = function () {
            return $scope.gracePeriodDisplay.fadeOut && $scope.gracePeriodDisplay.daysRemaining == DAYS_IN_GRACE_PERIOD;
        }
        var DAYS_IN_GRACE_PERIOD = 30;
        var renderContext = requestContext.getRenderContext("standard.project.detail", "projectID");
        var remoteDataTimer = null;
        $scope.isLoading = false;
        $scope.project = null;
        $scope.projectStats = null;
        $scope.isOwnedByUser = false;
        $scope.teamMembers = [];
        $scope.canArchiveProject = false;
        $scope.canArchiveScreens = false;
        $scope.isInGracePeriod = false;
        $scope.gracePeriodDisplay = {
            daysRemaining: null,
            isShownInitially: false,
            screenCount: 0,
            firstScreenUploaded: false
        };
        $scope.isOverQuota = false;
        $scope.expirationStatus = {
            expiresAt: null,
            isExpiring: false,
            isExpiringSoon: false,
            timeLeftInDays: 0
        };
        $scope.showCollabTooltip = false;
        $scope.subview = (renderContext.getNextSection() || "screens");
        var loadRemoteDataDebouncer = new Debouncer(Debouncer.THREE_SECONDS);
        var newProjectSyncModalIsOpen = false;
        $scope.$on(
        "$destroy",
        function () {
            stopTimerToRefreshRemoteData();
            modelEvents.off("projectDeleted.projectDetail");
            modelEvents.off("projectUpdated.projectDetail");
            modelEvents.off("projectUserAdded.projectDetail");
            modelEvents.off("projectUsersAdded.projectDetail");
            modelEvents.off("projectUserRemoved.projectDetail");
            modelEvents.off("projectUsersRemoved.projectDetail");
            modelEvents.off("screenUploaded.projectDetail");
            modelEvents.off("subscriptionChanged.projectDetail");
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeLocal()) {
                $scope.clearSecondaryBodyClass();
            }
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            $scope.subview = (renderContext.getNextSection() || "screens");
            if (requestContext.hasParamChanged("projectID")) {
                loadRemoteData();
            }
        }
        );
        $scope.$watch(
        "projectStats.screenCount",
        function (newValue, oldValue) {
            if (oldValue == 0 && newValue == 1) {
                $scope.gracePeriodDisplay.firstScreenUploaded = true;
                $timeout(hideGracePeriodWarning, 10 * 1000);
            }
        }
        );
        modelEvents.on(
        "projectDeleted.projectDetail",
        function (event, projectID) {
            if (projectID !== $scope.project.id) {
                return;
            }
            $location.path("/");
        }
        );
        modelEvents.on(
        "projectUpdated.projectDetail",
        function (event, project) {
            if (project.id !== $scope.project.id) {
                return;
            }
            if (project.isArchived) {
                return ($location.path("/"));
            }
            if (project.userID !== $scope.project.userID) {
                return (loadRemoteData());
            }
            $scope.project.name = project.name;
            $scope.project.isMobile = project.isMobile;
            $scope.project.mobileDeviceID = project.mobileDeviceID;
        }
        );
        modelEvents.on(
        [
        "projectUserAdded.projectDetail",
        "projectUsersAdded.projectDetail"
        ],
        function (event, projectID, userIDs) {
            if (projectID === $scope.project.id) {
                loadRemoteData();
            }
        }
        );
        modelEvents.on(
        [
        "projectUserRemoved.projectDetail",
        "projectUsersRemoved.projectDetail"
        ],
        function (event, projectID, userIDs) {
            if (projectID === $scope.project.id) {
                if (!ng.isArray(userIDs)) {
                    userIDs = [userIDs];
                }
                $scope.teamMembers = _.withoutPropertyRange($scope.teamMembers, "id", userIDs);
            }
        }
        );
        modelEvents.on(
        "screenUploaded.projectDetail",
        function (event, screen) {
            if (screen.projectID !== $scope.project.id) {
                return;
            }
            $scope.projectStats.screenCount++;
        }
        );
        modelEvents.on(
        "subscriptionChanged.projectDetail",
        function (event, newPlan) {
            loadRemoteData();
        }
        );
        $scope.setWindowTitle("Loading Project");
        $scope.setSecondaryBodyClass("page_project");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! screen-object-controller.js */
;
;
(function (ng, app) {
    "use strict";
    /*
    With the introduction of dividers, this controller servers multiple
    purposes depending on what type of object it's controlling.  The 
    displayObjects array contains screens, dividers, and divider_placeholders.
    This controller is used for all types.
    */
    app.controller("project.ScreenObjectController", Controller);
    /** @ngInject */
    function Controller($scope, _) {
        $scope.startEditingScreenDividerLabel = function () {
            $scope.isEditingDividerLabel = true;
        }
        $scope.finishEditingScreenDividerLabel = function () {
            $scope.isEditingDividerLabel = false;
        }
        $scope.hideArchiveConfirmation = function () {
            $scope.isShowingArchiveConfirmation = false;
        };
        $scope.hideDeleteConfirmation = function () {
            $scope.isShowingDeleteConfirmation = false;
        };
        $scope.showArchiveConfirmation = function () {
            $scope.isShowingArchiveConfirmation = true;
        };
        $scope.showDeleteConfirmation = function () {
            $scope.isShowingDeleteConfirmation = true;
        };
        $scope.isEditingDividerLabel = false;
        $scope.isShowingDeleteConfirmation = false;
        $scope.isShowingArchiveConfirmation = false;
        if ($scope.object && $scope.object.dividerID && isNaN($scope.object.dividerID)) {
            $scope.startEditingScreenDividerLabel();
        }
    }
})(angular, InVision);
;
;
/*! screens-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.filter('customScreensFilter', function () {
        return function (objects, searchValue) {
            if (searchValue == "") {
                return objects;
            }
            objects = _.filter(objects, function (object) {
                if (object != undefined && object.type != undefined) {
                    return true;
                } else {
                    return false;
                }
            });
            var results = [];
            angular.forEach(objects, function (object) {
                if (object.type != undefined && (object.type == "divider" ||
                (object.type == "screenObj" && object.name.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1))
                ) {
                    results.push(object);
                }
            });
            return results;
        };
    });
    app.controller("project.ScreensController", Controller);
    /** @ngInject */
    function Controller($scope, $location, $timeout, requestContext, Deferred, screenService, screenDividerService, projectScreensPartial, modelEvents, hashKeyCopier, _) {
        function addUploadedScreen(screen) {
            var existingScreen = _.findWithProperty($scope.screens, "id", screen.id);
            screen = augmentScreen(screen);
            if (existingScreen) {
                delete (screen.isSelectedForBulkAction);
                delete (screen.conversationCount);
                delete (screen.unreadConversationCount);
                _.extendExistingProperties(existingScreen, screen);
            } else {
                $scope.screens.push(screen);
            }
            applyScreens();
            $scope.mergeScreensAndDividers();
            $scope.removeDividerPlaceholders();
            $scope.insertDividerPlaceholders();
        }
        function applyRemoteData(screens, dividers, hotspots) {
            $scope.selectedScreenCount = 0;
            $scope.screens = augmentScreens(hashKeyCopier.copyHashKeys($scope.screens, screens));
            $.each($scope.screens, function (index, screen) {
                $scope.screens[index].hotspotCount = _.withProperty(hotspots, "screenID", screen.id).length;
            });
            applyScreens();
            $scope.dividers = hashKeyCopier.copyHashKeys($scope.dividers, dividers);
            $scope.mergeScreensAndDividers();
            $scope.insertDividerPlaceholders();
        }
        function applyScreens() {
            $scope.activeScreens = getActiveScreens();
            $scope.archivedScreens = getArchivedScreens();
            $scope.processingScreens = getProcessingScreens();
            $scope.activeScreens = sortActiveScreens($scope.activeScreens);
            $scope.archivedScreens = sortArchivedScreens($scope.archivedScreens);
            if (!$scope.activeScreens.length) {
                $scope.isShowingUploader = true;
            }
            $scope.updateSelectedScreenCount();
            if (
            ($scope.subview === "archive") &&
            !$scope.archivedScreens.length
            ) {
                $location.path("/projects/" + $scope.projectID + "/screens");
            }
        }
        function augmentScreen(screen) {
            if (!screen.hasOwnProperty("isSelectedForBulkAction")) {
                screen.isSelectedForBulkAction = false;
            }
            if (!screen.hasOwnProperty("conversationCount")) {
                screen.conversationCount = 0;
                screen.unreadConversationCount = 0;
            }
            screen.workflowStatus = "In Progress";
            screen.isCompleted = false;
            screen.isApproved = false;
            if (screen.workflowStatusID === screenService.workflowStatus.COMPLETE) {
                screen.workflowStatus = "Needs Review";
                screen.isCompleted = true;
                screen.isApproved = false;
            } else if (screen.workflowStatusID === screenService.workflowStatus.COMPLETE_AND_APPROVED) {
                screen.workflowStatus = "Approved";
                screen.isCompleted = false;
                screen.isApproved = true;
            }
            return (screen);
        }
        function augmentScreens(screens) {
            _.each(screens, augmentScreen);
            return (screens);
        }
        function checkProcessingScreens() {
            $scope.isCheckProcessingScreens = true;
            var screenIDsToCheck = _.difference(
            _.pluck($scope.processingScreens, "id"),
            $scope.checkingProcessingScreenIDs
            );
            for (var i = 0; i < screenIDsToCheck.length; i++) {
                $scope.checkingProcessingScreenIDs.push(screenIDsToCheck[i]);
                Deferred.handlePromise(
                screenService.getByID(screenIDsToCheck[i]),
                function (screen) {
                    if (screen.isProcessed == true) {
                        updateScreenInCollection(screen);
                        applyScreens();
                    }
                    $scope.checkingProcessingScreenIDs = _.without(
                    $scope.checkingProcessingScreenIDs,
                    screen.id
                    );
                },
                function (response) {
                    $scope.openModalWindow("error", "For some reason, we can't check your screen status. Try refreshing your browser.");
                    $scope.checkingProcessingScreenIDs = _.without(
                    $scope.checkingProcessingScreenIDs,
                    screen.id
                    );
                }
                );
            }
            if ($scope.processingScreens.length > 0) {
                thumbnailTimer = $timeout(checkProcessingScreens, 2000);
            } else {
                $scope.isCheckProcessingScreens = false;
                $scope.checkingProcessingScreenIDs = [];
            }
        }
        function getActiveScreens() {
            return _.withoutProperty($scope.screens, "isArchived", true);
        }
        function getArchivedScreens() {
            return _.withProperty($scope.screens, "isArchived", true);
        }
        function getProcessingScreens() {
            return _.withoutProperty($scope.screens, "isProcessed", true);
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            $scope.state = $scope.states.READY;
            $scope.isCheckProcessingScreens = false;
            $scope.checkingProcessingScreenIDs = [];
            Deferred.handlePromise(
            projectScreensPartial.get(requestContext.getParamAsInt("projectID")),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.screens, response.dividers, response.hotspots);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason we couldn't load your screens. Try refreshing your browser.");
            }
            );
        }
        function sortActiveScreens(screens) {
            return _.sortOnProperty(screens, "sort");
        }
        function sortArchivedScreens(screens) {
            return (
            _.sortOnProperty(screens, "updatedAt", "desc")
            );
        }
        function resetSelectedScreens() {
            $scope.selectedScreenCount = 0;
            _.setProperty($scope.screens, "isSelectedForBulkAction", false);
        }
        function updateScreenInCollection(screen) {
            var matchingScreen = _.findWithProperty($scope.screens, "id", screen.id);
            if (matchingScreen) {
                _.extendExistingProperties(matchingScreen, screen);
            }
        }
        $scope.mergeScreensAndDividers = function () {
            var displayObjectsTemp = [];
            for (var s = 0; s < $scope.activeScreens.length; s++) {
                var dividers = _.filter($scope.dividers, function (divider) {
                    return divider.position == s;
                });
                if (dividers.length) {
                    for (var d = 0; d < dividers.length; d++) {
                        displayObjectsTemp.push(dividers[d]);
                    }
                }
                if (s == 0 && $scope.isMobile && $scope.mobileDeviceID && !$scope.isShowingSmallScreenSize) {
                    var thisDeviceData = _.withProperty(mobileDeviceData, "mobileDeviceID", $scope.mobileDeviceID)[0];
                    thisDeviceData.appIconScreen = _.withProperty($scope.screens, "clientFilename", "apple-touch-icon.png")[0];
                    thisDeviceData.loadingScreen = _.withProperty($scope.screens, "clientFilename", "apple-touch-startup-image.png")[0];
                    displayObjectsTemp.push(thisDeviceData);
                }
                var screenObj = $scope.activeScreens[s];
                screenObj.type = "screenObj";
                displayObjectsTemp.push(screenObj);
            }
            var dividers = _.filter($scope.dividers, function (divider) {
                return divider.position >= $scope.activeScreens.length;
            });
            if (dividers) {
                for (var d = 0; d < dividers.length; d++) {
                    displayObjectsTemp.push(dividers[d]);
                }
            }
            $scope.displayObjects = hashKeyCopier.copyHashKeys($scope.displayObjects, displayObjectsTemp);
        }
        $scope.insertDividerPlaceholders = function () {
            var displayObjectsTemp = [];
            var placementCount = 0;
            var dividerCount = 0;
            var screenCount = 0;
            for (var d = 0; d < $scope.displayObjects.length; d++) {
                var isDivider = $scope.displayObjects[d].type === "divider" ? true : false;
                if (placementCount % 4 == 0 && !isDivider) {
                    if (!prevObjWasDivider) {
                        var displayObjectsPosition = displayObjectsTemp.length;
                        displayObjectsTemp.push({
                            type: "divider_placeholder",
                            label: "Click here to add a section.",
                            position: screenCount,
                            screenPosition: screenCount,
                            displayObjectsPosition: displayObjectsPosition
                        });
                    }
                }
                if (isDivider) {
                    placementCount = 0;
                    var prevObjWasDivider = true;
                } else {
                    placementCount++;
                    var prevObjWasDivider = false;
                }
                displayObjectsTemp.push($scope.displayObjects[d]);
                if ($scope.displayObjects[d].type == "screenObj") {
                    screenCount++;
                }
            }
            if ($scope.activeScreens.length && _.last(displayObjectsTemp).type != "divider") {
                displayObjectsTemp.push({
                    type: "divider_placeholder",
                    label: "Click here to add a section.",
                    position: screenCount,
                    displayObjectsPosition: displayObjectsTemp.length
                });
            }
            $scope.displayObjects = hashKeyCopier.copyHashKeys($scope.displayOjects, displayObjectsTemp);
        }
        $scope.removeDividerPlaceholders = function () {
            $scope.displayObjects = _.withoutProperty($scope.displayObjects, "type", "divider_placeholder");
        }
        $scope.adjustDividerPositionsForAddOrRemove = function (screen, isAdd) {
            if (isAdd) { // is adding a screen
                var posAdjust = 1;
            } else { // is removing a screen
                var posAdjust = -1;
            }
            for (var a = 0; a < $scope.activeScreens.length; a++) {
                if (screen.id == $scope.activeScreens[a].id) {
                    var screenPosition = a + 1; //We want 1 based positioning for screens, not 0
                    break;
                }
            }
            for (var d = 0; d < $scope.dividers.length; d++) {
                if ($scope.dividers[d].position >= screenPosition) {
                    $scope.dividers[d].position = $scope.dividers[d].position + posAdjust;
                }
            }
        }
        $scope.updateDividerPositions = function () {
            var dividersTemp = [];
            var screenPosition = 0;
            for (var p = 0; p < $scope.displayObjects.length; p++) {
                var objType = $scope.displayObjects[p].type;
                if (objType == "screenObj") {
                    screenPosition++;
                }
                if (objType == "divider") {
                    dividersTemp.push({
                        dividerID: $scope.displayObjects[p].dividerID,
                        type: $scope.displayObjects[p].type,
                        label: $scope.displayObjects[p].label,
                        position: screenPosition
                    });
                }
            }
            $scope.dividers = hashKeyCopier.copyHashKeys($scope.dividers, dividersTemp);
        }
        $scope.persistDividerPositions = function () {
            screenDividerService.updateScreenDividerPositions($scope.projectID, $scope.dividers);
        }
        $scope.archiveScreen = function (screen) {
            Deferred.handlePromise(
            screenService.archiveScreen(screen.id),
            function (archivedScreen) {
                updateScreenInCollection(archivedScreen);
            },
            function (response) {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't archive that screen.");
            }
            );
            $scope.adjustDividerPositionsForAddOrRemove(screen, false);
            screen.isArchived = true;
            screen.isSelectedForBulkAction = false;
            screen.unreadConversationCount = 0;
            applyScreens();
            $scope.mergeScreensAndDividers();
            $scope.persistDividerPositions();
            $scope.removeDividerPlaceholders();
            $scope.insertDividerPlaceholders();
        };
        $scope.archiveSelectedScreens = function () {
            var selectedScreens = _.withProperty($scope.screens, "isSelectedForBulkAction", true);
            var screenIDs = _.pluck(selectedScreens, "id");
            Deferred.handlePromise(
            screenService.archiveScreens(screenIDs.join(",")),
            function (archivedScreens) {
                _.each(archivedScreens, updateScreenInCollection);
            },
            function (response) {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't archive the selected screen(s).");
            }
            );
            _.setProperty(selectedScreens, "isArchived", true);
            _.setProperty(selectedScreens, "isSelectedForBulkAction", false);
            _.setProperty(selectedScreens, "unreadConversationCount", 0);
            $scope.displayObjects = _.difference($scope.displayObjects, selectedScreens);
            applyScreens();
            $scope.updateDividerPositions();
            $scope.mergeScreensAndDividers();
            $scope.persistDividerPositions();
            $scope.removeDividerPlaceholders();
            $scope.insertDividerPlaceholders();
        };
        $scope.deleteScreen = function (screen) {
            Deferred.handlePromise(
            screenService.deleteScreen(screen.id),
            function () {
                $scope.$emit("screens:deleted", screen);
            },
            function () {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't delete that screen.");
            }
            );
            $scope.adjustDividerPositionsForAddOrRemove(screen, false);
            $scope.screens = _.withoutProperty($scope.screens, "id", screen.id);
            applyScreens();
            $scope.mergeScreensAndDividers();
            $scope.persistDividerPositions();
            $scope.insertDividerPlaceholders();
        };
        $scope.deleteSelectedScreens = function () {
            var selectedScreens = _.filterWithProperty($scope.screens, "isSelectedForBulkAction", true);
            var screenIDs = _.pluck(selectedScreens, "id");
            Deferred.handlePromise(
            screenService.deleteScreens(screenIDs.join(",")),
            function (response) {
            },
            function (response) {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't delete the selected screen(s).");
            }
            );
            $scope.screens = _.difference($scope.screens, selectedScreens);
            $scope.displayObjects = _.difference($scope.displayObjects, selectedScreens);
            applyScreens();
            $scope.updateDividerPositions();
            $scope.mergeScreensAndDividers();
            $scope.persistDividerPositions();
            $scope.insertDividerPlaceholders();
        };
        $scope.duplicateScreen = function (screen) {
            Deferred.handlePromise(
            screenService.duplicateScreen(screen.id),
            function (duplicateScreen) {
                duplicateScreen.hotspotCount = screen.hotspotCount;
                var index = $scope.screens.indexOf(screen);
                $scope.adjustDividerPositionsForAddOrRemove(screen, true);
                $scope.screens.splice(index + 1, 0, duplicateScreen);
                applyScreens();
                $scope.mergeScreensAndDividers();
                $scope.persistDividerPositions();
                $scope.removeDividerPlaceholders();
                $scope.insertDividerPlaceholders();
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't duplicate that screen.");
            }
            );
        };
        $scope.openHighFidelityModal = function () {
            $scope.openModalWindow("highFidelityPrototypes");
        };
        $scope.openMobileModal = function () {
            $scope.openModalWindow("mobileDemos");
        };
        $scope.openWireframesModal = function () {
            $scope.openModalWindow("clickableWireframes");
        };
        $scope.shareScreen = function (screen) {
            $scope.openModalWindow("share", $scope.projectID, screen.id);
        };
        $scope.showScreenSize = function (size) {
            $scope.screenSize = size;
            if (size === "regular") {
                $scope.isShowingRegularScreenSize = true;
                $scope.isShowingSmallScreenSize = false;
            } else {
                $scope.isShowingRegularScreenSize = false;
                $scope.isShowingSmallScreenSize = true;
            }
            resetSelectedScreens();
            $scope.mergeScreensAndDividers();
            $scope.insertDividerPlaceholders();
        };
        $scope.toggleUploader = function () {
            $scope.isShowingUploader = !$scope.isShowingUploader;
        };
        $scope.unarchiveScreen = function (screen) {
            Deferred.handlePromise(
            screenService.activateScreen(screen.id),
            function (activatedScreen) {
                updateScreenInCollection(activatedScreen);
            },
            function () {
                loadRemoteData();
                $scope.openModalWindow("error", "For some reason, we couldn't activate that screen.");
            }
            );
            $scope.createUncategorizedDividerIfNeeded();
            screen.isArchived = false;
            screen.sort = LAST_SORT_VALUE;
            screen.isSelectedForBulkAction = false;
            applyScreens();
            $scope.mergeScreensAndDividers();
            $scope.removeDividerPlaceholders();
            $scope.insertDividerPlaceholders();
        };
        $scope.updateSelectedScreenCount = function () {
            $scope.selectedScreenCount = _.countWithProperty($scope.screens, "isSelectedForBulkAction", true);
        };
        $scope.createUncategorizedDividerIfNeeded = function () {
            var lastDividerPosition = _.max($scope.dividers, "position").position;
            var dividersAtLastPosition = _.withProperty($scope.dividers, "position", lastDividerPosition);
            var lastDivider = _.last(dividersAtLastPosition);
            if (lastDivider && lastDivider.label && lastDivider.label != "Uncategorized") {
                var newDivider = {
                    dividerID: 0,
                    type: "divider",
                    label: "Uncategorized",
                    position: screenPosition
                }
                var screenPosition = $scope.activeScreens.length;
                var displayObjectsPosition = $scope.displayObjects.length; // this is where it will be placed.
                screenDividerService.createScreenDivider($scope.projectID, "Uncategorized", screenPosition, displayObjectsPosition);
            }
        }
        var renderContext = requestContext.getRenderContext("standard.project.detail.screens", "projectID");
        var LAST_SORT_VALUE = 999999;
        var thumbnailTimer = null;
        var mobileDeviceData = [
        {
            mobileDeviceID: 1,
            className: "iphone-portrait",
            iconResolution: "114 x 114",
            loadScreenResolution: "640 x 1096",
            type: "mobileUploadTile"
        },
        {
            mobileDeviceID: 2,
            className: "iphone-landscape",
            iconResolution: "114 x 114",
            loadScreenResolution: "1096 x 640",
            type: "mobileUploadTile"
        },
        {
            mobileDeviceID: 3,
            className: "ipad-portrait",
            iconResolution: "144 x 144",
            loadScreenResolution: "1536 x 2008",
            type: "mobileUploadTile"
        },
        {
            mobileDeviceID: 4,
            className: "ipad-landscape",
            iconResolution: "144 x 144",
            loadScreenResolution: "2008 x 1536",
            type: "mobileUploadTile"
        }
        ];
        $scope.states = {
            READY: "READY",
            SORTING: "SORTING"
        };
        $scope.state = $scope.states.READY;
        $scope.projectID = requestContext.getParamAsInt("projectID");
        $scope.isLoading = true;
        $scope.isCheckProcessingScreens = false;
        $scope.checkingProcessingScreenIDs = [];
        $scope.screens = [];
        $scope.activeScreens = [];
        $scope.archivedScreens = [];
        $scope.processingScreens = [];
        $scope.screenSize = "regular";
        $scope.isShowingRegularScreenSize = true;
        $scope.isShowingSmallScreenSize = false;
        $scope.isShowingUploader = false;
        $scope.filters = {};
        $scope.filters.screensFilter = "";
        $scope.moveTooltipLabel = "Move";
        $scope.selectedScreenCount = 0;
        $scope.subview = (renderContext.getNextSection() || "list");
        $scope.dividers = [];
        $scope.displayObjects = [];
        $scope.mobileUploadingIndicators = {};
        $scope.mobileUploadingIndicators.isUploadingIcon = false;
        $scope.mobileUploadingIndicators.isUploadingLoadingScreen = false;
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("screenDeleted.projectScreens");
            modelEvents.off("screenUploaded.projectScreens");
            modelEvents.off("subscriptionChanged.projectScreens");
            modelEvents.off("projectUpdated.projectScreens");
            modelEvents.off("dividerCreated.projectScreens");
            modelEvents.off("dividerDeleted.projectScreens");
            modelEvents.off("screenDividerUpdated.projectScreens");
            modelEvents.off("dividerPositionsUpdated.projectScreens");
            modelEvents.off("dividerUpdated.projectScreens");
            modelEvents.off("screenSortUpdated.projectScreens");
            modelEvents.off("screenUploadStart.projectScreens");
            $timeout.cancel(thumbnailTimer);
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (
            !renderContext.isChangeRelevant() &&
            (requestContext.getAction() !== "standard.project.detail")
            ) {
                return;
            }
            $scope.projectID = requestContext.getParamAsInt("projectID");
            $scope.subview = (renderContext.getNextSection() || "list");
            $scope.isShowingUploader = false;
            if (
            ($scope.subview === "list") &&
            !$scope.activeScreens.length
            ) {
                $scope.isShowingUploader = true;
            }
            resetSelectedScreens();
            if (requestContext.hasParamChanged("projectID")) {
                loadRemoteData();
            }
        }
        );
        $scope.$on(
        "projectScreens:dragEnter",
        function () {
            if ($scope.state !== $scope.states.READY) {
                return;
            }
            $scope.isShowingUploader = true;
        }
        );
        $scope.$on(
        "activeScreens:sortStart",
        function () {
            $scope.state = $scope.states.SORTING;
            var screens = _.withProperty($scope.displayObjects, "type", "screenObj");
            var screenIDs = _.pluck(screens, "id");
        }
        );
        $scope.$on(
        "activeScreens:sortStop",
        function () {
            if ($scope.state !== $scope.states.SORTING) {
                return;
            }
            $scope.state = $scope.states.READY;
        }
        );
        $scope.$on(
        "activeScreens:sortUpdate",
        function () {
            var screens = _.withProperty($scope.displayObjects, "type", "screenObj");
            var screenIDs = _.pluck(screens, "id");
            screenService.updateSort($scope.projectID, screenIDs);
            for (var position = 0; position < screenIDs.length; position++) {
                for (var s = 0; s < $scope.screens.length; s++) {
                    if ($scope.screens[s].id == screenIDs[position]) {
                        $scope.screens[s].sort = position;
                    }
                }
            }
            applyScreens();
            $scope.removeDividerPlaceholders();
            $scope.insertDividerPlaceholders();
            $scope.updateDividerPositions();
            $scope.persistDividerPositions();
        }
        );
        $scope.$watch(
        "processingScreens",
        function (newValue) {
            if (!$scope.isCheckProcessingScreens && newValue.length > 0) {
                checkProcessingScreens();
            }
        }
        );
        $scope.$watch(
        "filters.screensFilter",
        function (newVal) {
            if (newVal == "") {
                $scope.moveTooltipLabel = "Move";
            } else {
                $scope.moveTooltipLabel = "Cannot sort while Searching.  Clear the search box first.";
            }
        });
        modelEvents.on(
        "screenDeleted.projectScreens",
        function (event, screenID) {
            if (_.findWithProperty($scope.screens, "id", screenID)) {
                $scope.screens = _.withoutProperty($scope.screens, "id", screenID);
                applyScreens();
                $scope.mergeScreensAndDividers();
                $scope.updateDividerPositions();
                $scope.insertDividerPlaceholders();
            }
        }
        );
        modelEvents.on(
        "screenUploaded.projectScreens",
        function (event, screen) {
            if (screen.projectID !== $scope.projectID) {
                return;
            }
            addUploadedScreen(screen);
        }
        );
        modelEvents.on(
        "screenSortUpdated.projectScreens",
        function (event, projectID, screensSorted) {
            if (projectID != $scope.projectID) {
                return;
            }
            var screens = _.withProperty($scope.displayObjects, "type", "screenObj");
            var localSort = _.pluck(screens, "id");
            _.sortOnProperty(screensSorted, "sort");
            var responseSort = _.pluck(_.withoutProperty(screensSorted, "isArchived", true), "id");
            var isAlreadyUpdated = _.isEqual(localSort, responseSort);
            if (!isAlreadyUpdated) {
                $scope.screens = hashKeyCopier.copyHashKeys($scope.screens, screensSorted);
                applyScreens();
                $scope.mergeScreensAndDividers();
                $scope.insertDividerPlaceholders();
            }
        }
        );
        modelEvents.on(
        "subscriptionChanged.projectScreens",
        function (event, newPlan) {
            loadRemoteData();
        }
        );
        modelEvents.on(
        "projectUpdated.projectScreens",
        function (event, project) {
            if (project.id !== $scope.project.id) {
                return;
            }
            if (project.userID !== $scope.project.userID) {
                return (loadRemoteData());
            }
            if ($scope.isMobile != project.isMobile || $scope.mobileDeviceID != project.mobileDeviceID) {
                $scope.isMobile = project.isMobile;
                $scope.mobileDeviceID = project.mobileDeviceID;
                $scope.mergeScreensAndDividers();
                $scope.insertDividerPlaceholders();
                return;
            }
        }
        );
        modelEvents.on(
        "screenUploadStart.projectScreens",
        function (event) {
            $scope.createUncategorizedDividerIfNeeded();
        });
        modelEvents.on(
        "dividerCreated.projectScreens",
        function (event, response) {
            var divider = _.withProperty($scope.dividers, "dividerID", response.dividerID);
            if (divider && divider.length) { // the divider was already set up properly.  No need to continue.
                return;
            }
            var tempDividerExists = false;
            for (var d = 0; d < $scope.dividers.length; d++) {
                if ($scope.dividers[d].dividerID == 0 || $scope.dividers[d].dividerID == "new") {
                    tempDividerExists = true;
                }
            }
            if (!tempDividerExists) {  // This event got triggered from the pusher app. So, lets see if we have a temporary divider or not.
                if (!_.findWithProperty($scope.dividers, "dividerID", response.dividerID)) {
                    $scope.dividers.push({
                        dividerID: response.dividerID,
                        type: response.type,
                        label: response.label,
                        position: response.position
                    });
                    $scope.mergeScreensAndDividers();
                    $scope.insertDividerPlaceholders();
                }
            } else {
                for (var d = 0; d < $scope.dividers.length; d++) {
                    if ($scope.dividers[d].dividerID == 0 || $scope.dividers[d].dividerID == "new") {
                        $scope.dividers[d].dividerID = response.dividerID;
                        $scope.dividers[d].label = response.label;
                        $scope.dividers[d].position = response.position;
                        break;
                    }
                }
                for (var d = 0; d < $scope.displayObjects.length; d++) {
                    if ($scope.displayObjects[d].dividerID == 0 || $scope.displayObjects[d].dividerID == "new") {
                        $scope.displayObjects[d].dividerID = response.dividerID;
                        $scope.displayObjects[d].label = response.label;
                        $scope.displayObjects[d].position = response.position;
                        break;
                    }
                }
                $scope.updateDividerPositions();
            }
        }
        );
        modelEvents.on(
        "dividerDeleted.projectScreens",
        function (event, dividerID) {
            if (_.findWithProperty($scope.dividers, "dividerID", dividerID)) {
                $scope.dividers = _.withoutProperty($scope.dividers, "dividerID", dividerID);
                applyScreens();
                $scope.mergeScreensAndDividers();
                $scope.insertDividerPlaceholders();
            }
        }
        );
        modelEvents.on(
        "dividerUpdated.projectScreens",
        function (event, response) {
            for (var d = 0; d < $scope.dividers.length; d++) {
                if ($scope.dividers[d].dividerID == response.dividerID) {
                    $scope.dividers[d].label = response.label;
                    break;
                }
            }
            for (var d = 0; d < $scope.displayObjects.length; d++) {
                if ($scope.displayObjects[d].dividerID == response.dividerID) {
                    $scope.displayObjects[d].label = response.label;
                    break;
                }
            }
        }
        );
        modelEvents.on(
        "dividerPositionsUpdated.projectScreens",
        function (event, dividers, screens) {
            var isPositionChanged = false;
            for (var sd = 0; sd < $scope.dividers.length; sd++) {
                for (var d = 0; d < dividers.length; d++) {
                    if ($scope.dividers[sd].dividerID == dividers[d].dividerID &&
                    $scope.dividers[sd].position != dividers[d].position
                    ) {
                        isPositionChanged = true;
                        break;
                    }
                }
            }
            if (isPositionChanged) {
                $scope.dividers = hashKeyCopier.copyHashKeys($scope.dividers, dividers);
                $scope.screens = hashKeyCopier.copyHashKeys($scope.screens, screens);
                applyScreens();
                $scope.mergeScreensAndDividers();
                $scope.insertDividerPlaceholders();
            }
        }
        );
        $scope.setWindowTitle("Project Screens");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! overview-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("project.overview.OverviewController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, $location, Deferred, modelEvents, dateHelper, moment, _, projectOverviewService, projectService, userService) {
        function applyRemoteData(activity, stats, views, viewsGrouped) {
            $scope.stats.projectViews = stats.totalViews;
            $scope.stats.numberOfPeople = stats.totalViewers;
            $scope.stats.commentCount = stats.totalComments;
            _.defaults($scope.stats, getDefaultStats());
            $scope.projectViewStats = viewsGrouped;
            viewStore = augmentViews(views);
            $scope.projectViews = getViewsForPagination(viewStore);
            $scope.pagination.totalResults = viewStore.length;
            applyRemoteActivityData(activity);
        }
        function applyRemoteActivityData(activity) {
            if (activity.alreadyAddedToActivityPeriods) {
                return;
            }
            activity.alreadyAddedToActivityPeriods = true;
            $scope.activityStream = $scope.activityStream.concat(augmentActivity(activity));
            $scope.noActivity = ($scope.activityStream.length == 0);
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            projectService.getByID($scope.projectID),
            function (projectData) {
                var duration = 7;
                var offset = Math.max(
                moment().utc().subtract("days", duration).valueOf(),
                projectData.createdAt
                );
                lastUsedOffset = offset;
                $scope.minimumOffset = Math.max(
                projectData.createdAt,
                moment("2013-01-24").utc().valueOf()
                );
                Deferred.handlePromise(
                projectOverviewService.getActivityAndStats($scope.projectID, offset, duration),
                function (data) {
                    if (data.activity.length > 0) {
                        $scope.isLoading = false;
                    } else {
                        $scope.loadMoreActivity();
                    }
                    applyRemoteData(data.activity, data.stats, data.views, data.viewsGrouped);
                }
                )
            }
            );
        }
        function augmentActivity(activity) {
            var activityGrouped = groupActivityByTypeAndTime(activity);
            activityGrouped = groupActivityByDay(activityGrouped);
            return activityGrouped;
        }
        function augmentViews(views) {
            var tempViews = [];
            _.forEach(views, function (view) {
                var duration = moment.duration(view.timeSpentInSeconds, "seconds");
                tempViews.push({
                    avatarID: view.avatarID,
                    userID: view.userID,
                    userName: view.name.replace(/Anonymous User/, "Anonymous"),
                    userInitials: userService.getInitials(view.name),
                    userHasSystemAvatar: userService.isSystemAvatar(view.avatarID),
                    onlineStatus: userService.getOnlineStatus(view.lastRequestAt),
                    isAnonymous: view.isAnonymous,
                    relationship: view.relationship,
                    location: view.viewer_location,
                    startedAtDate: dateHelper.formatRecentDate(view.startedAt, "mmm d"),
                    startedAtTime: moment(view.startedAt).format("h:mma"),
                    durationInHours: duration.hours(),
                    durationInMins: duration.minutes(),
                    durationInSecs: duration.seconds(),
                    showSecs: duration.hours() == 0 && duration.seconds() > 0,
                    screens: view.screenCount,
                    comments: view.commentCount
                });
            });
            return tempViews;
        }
        function getViewsForPagination(views) {
            var pagination = $scope.pagination;
            var startIndex = 0;
            var endIndex = 0;
            endIndex = pagination.resultsPerPage;
            $scope.pagination.hasMorePages = (endIndex < views.length);
            return views.slice(startIndex, endIndex);
        }
        function getLastKnownOffset() {
            return lastUsedOffset;
        }
        function formatAverageTimeViewed(timeInSeconds) {
            var timeInSeconds = timeInSeconds ? timeInSeconds : 0;
            var friendlyDuration = "";
            var duration = moment.duration(timeInSeconds, "seconds");
            var hoursStr = duration.hours() == 0 ? "" : duration.hours().toString();
            var minutesStr = duration.minutes() == 0 ? ":" : duration.minutes().toString();
            if (duration.seconds() < 10) {
                var secondsStr = duration.seconds() == 0 ? ":00" : (":0" + duration.seconds().toString());
            } else {
                var secondsStr = ":" + duration.seconds().toString();
            }
            friendlyDuration = hoursStr + minutesStr + secondsStr;
            friendlyDuration = friendlyDuration.replace(/:{2,3}/, ':');
            return (friendlyDuration);
        }
        function getDefaultStats() {
            return ({
                projectViews: 0,
                numberOfPeople: 0,
                commentCount: 0
            });
        }
        function groupActivityByTypeAndTime(activity) {
            var secondsToGroupBy = 60 * 30;
            var groupedByTime = _.groupBy(activity, function (activityItem) {
                var groupByTimeframeInSeconds = secondsToGroupBy;
                var timeRounded = null;
                var nearestTime = 0;
                nearestTime = Math.round(moment(activityItem.actionOccuredAt).unix() / secondsToGroupBy) * secondsToGroupBy;
                timeRounded = moment.unix(nearestTime);
                return timeRounded.unix() + "_" + activityItem.action;
            });
            groupedByTime = _.map(groupedByTime, function (activityGrouping, label) {
                var tmpItem = {};
                var actionType = label.split("_")[1];
                var occuredAt = moment(_.first(activityGrouping).actionOccuredAt);
                tmpItem.occuredAt = occuredAt.valueOf();
                tmpItem.occuredAtFormatted = occuredAt.format("hh:mm a");
                tmpItem.type = actionType;
                tmpItem.activity = activityGrouping;
                tmpItem.users = _.map(activityGrouping, function (activityGrouping) {
                    return {
                        userID: activityGrouping.userID,
                        name: activityGrouping.userName,
                        shortName: userService.getShortName(activityGrouping.userName),
                        avatarID: activityGrouping.avatarID,
                        hasSystemAvatar: userService.isSystemAvatar(activityGrouping.avatarID),
                        isAnonymous: activityGrouping.isAnonymous,
                        onlineStatus: userService.getOnlineStatus(activityGrouping.lastRequestAt),
                        initials: userService.getInitials(activityGrouping.userName),
                        relationship: activityGrouping.relationship
                    }
                });
                tmpItem.users = _.uniq(tmpItem.users, function (user) { return user.userID; });
                if (tmpItem.users.length == 1) {
                    tmpItem.userNameOrCount = _.first(tmpItem.users).name;
                } else {
                    tmpItem.userNameOrCount = tmpItem.users.length + ' people';
                }
                tmpItem.screens = _.map(activityGrouping, function (activityGrouping, key, allActivity) {
                    var tmpScreen = {
                        id: activityGrouping.screenID,
                        name: activityGrouping.screenName,
                        imageVersion: activityGrouping.imageVersion,
                        consoleUrl: activityGrouping.screenID,
                        commentCount: _.countWithProperty(
                        _.filterWithProperty(allActivity, "action", "commentCreated"),
                        "screenID",
                        activityGrouping.screenID
                        )
                    };
                    if (tmpScreen.commentCount > 0) {
                        tmpScreen.consoleUrl += "/comments";
                    } else {
                        tmpScreen.consoleUrl += "/preview";
                    }
                    return tmpScreen;
                });
                tmpItem.screens = _.uniq(tmpItem.screens, function (screen) { return screen.id; });
                return tmpItem;
            });
            return groupedByTime;
        }
        function groupActivityByDay(groupedByTime) {
            var groupedByDayAndTime = _.groupBy(groupedByTime, function (activityGrouping) {
                var momentObj = moment(activityGrouping.occuredAt);
                return momentObj.startOf("day").unix();
            });
            groupedByDayAndTime = _.sortOnProperty(
            _.map(groupedByDayAndTime, function (item, label) {
                var tmpItem = {};
                var dayOf = moment.unix(parseInt(label));
                tmpItem.dayOf = dayOf.unix();
                tmpItem.activities = item;
                if (dateHelper.isToday(dayOf.toDate())) {
                    tmpItem.dayOfFormatted = "Today";
                } else if (dateHelper.isYesterday(dayOf.toDate())) {
                    tmpItem.dayOfFormatted = "Yesterday";
                } else {
                    tmpItem.dayOfFormatted = dayOf.format("MMM D");
                }
                return tmpItem
            }),
            "dayOf",
            "desc"
            );
            return groupedByDayAndTime;
        }
        $scope.loadMoreActivity = function () {
            $scope.isLoadingPastActivity = true;
            var duration = 7;
            var lastKnownOffset = getLastKnownOffset();
            var pastOffset = dateHelper.addDays(lastKnownOffset, -1 * duration).getTime();
            if (!$scope.hasMoreActivityToLoad || pastOffset < $scope.minimumOffset) {
                $scope.hasMoreActivityToLoad = false;
                $scope.isLoadingPastActivity = false;
                $scope.isLoading = false;
                return;
            }
            if (dateHelper.addDays($scope.minimumOffset, duration).getTime() >= pastOffset) {
                pastOffset = $scope.minimumOffset;
                $scope.hasMoreActivityToLoad = false;
            }
            lastUsedOffset = pastOffset;
            Deferred.handlePromise(
            projectOverviewService.getActivity($scope.projectID, pastOffset, duration),
            function (response) {
                var hasReturnedNoActivity = (response.activity.length == 0);
                if (hasReturnedNoActivity) {
                    $scope.loadMoreActivity();
                } else {
                    $scope.isLoadingPastActivity = false;
                    $scope.isLoading = false;
                }
                applyRemoteActivityData(response.activity);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load the past activity. Try refreshing your browser.");
            }
            );
        };
        $scope.showMoreViewers = function () {
            $scope.pagination.resultsPerPage += 10;
            $scope.projectViews = getViewsForPagination(viewStore);
        };
        $scope.openShareModal = function (projectID) {
            $scope.openModalWindow("share", projectID);
        };
        $scope.viewUser = function (user, project) {
            if (user.relationship === "teamMember") {
                $location.path("/team/" + user.userID + "/activity");
            } else if (user.relationship === "affiliate") {
                $scope.openModalWindow("affiliateActivity", user.userID, project.id);
            } else {
            }
        };
        var renderContext = requestContext.getRenderContext("standard.project.detail.stats", "projectID");
        var viewStore = [];
        var lastUsedOffset = 0;
        $scope.projectID = requestContext.getParamAsInt("projectID");
        $scope.isLoading = false;
        $scope.stats = {
            projectViews: 0,
            numberOfPeople: 0,
            commentCount: 0
        };
        $scope.pagination = {
            resultsPerPage: 10,
            hasMorePages: false,
            totalResults: 0
        }
        $scope.projectViews = [];
        $scope.projectViewStats = [];
        $scope.timespans = [];
        $scope.activityStream = [];
        $scope.noActivity = true;
        $scope.isLoadingPastActivity = false;
        $scope.hasMoreActivityToLoad = true;
        $scope.minimumOffset = 0;
        $scope.$on(
        "$destroy",
        function () {
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            $scope.projectID = requestContext.getParamAsInt("projectID");
            if (requestContext.hasParamChanged("projectID")) {
                $scope.stats = {
                    projectViews: 0,
                    numberOfPeople: 0,
                    commentCount: 0
                };
                $scope.pagination = {
                    resultsPerPage: 10,
                    hasMorePages: false,
                    totalResults: 0
                }
                loadRemoteData();
            }
        }
        );
        $scope.setWindowTitle("Project Stats");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! projects-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("projects.ProjectsController", Controller);
    /** @ngInject */
    function Controller($scope, Deferred, projectService, projectsProjectsPartial, sessionService, modelEvents, dateHelper, hashKeyCopier, _, $location, $route, $routeParams) {
        function applyIsNewToProjects() {
            var cutOff = dateHelper.addDays(dateHelper.today(), -3).getTime();
            for (var i = 0, length = $scope.projects.length ; i < length ; i++) {
                $scope.projects[i].isNew = ($scope.projects[i].startedAt >= cutOff);
            }
        }
        function applyRemoteData(projects, subscription) {
            $scope.projects = hashKeyCopier.copyHashKeys($scope.projects, projects);
            applyIsNewToProjects();
            sortProjects();
            updateProjectBreakdowns();
            $scope.subscription = subscription;
            if ($route.current.action === "standard.projects.activate") {
                var archivedProject = getProject(parseInt($routeParams.id));
                if (archivedProject) {
                    $location.path("/projects");
                    $scope.activateProject(archivedProject);
                }
            }
        }
        function getProject(id) {
            return (
            _.findWithProperty($scope.projects, "id", id)
            );
        }
        function getActiveProjects() {
            return (
            _.withProperty($scope.projects, "isArchived", false)
            );
        }
        function getArchivedProjects() {
            return (
            _.withProperty($scope.projects, "isArchived", true)
            );
        }
        function getFavoriteProjects() {
            return (
            _.withProperty(getActiveProjects(), "isFavorite", true)
            );
        }
        function getProjectsOwnedByMe() {
            return (
            _.withProperty(getActiveProjects(), "userID", sessionService.user.id)
            );
        }
        function getProjectsOwnedByOthers() {
            return (
            _.withoutProperty(getActiveProjects(), "userID", sessionService.user.id)
            );
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            projectsProjectsPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.projects, response.subscription);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your projects. Try refreshing your browser.");
            }
            );
        }
        function sortProjects() {
            $scope.projects.sort(
            function (a, b) {
                return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            }
            );
        }
        function updateProjectBreakdowns() {
            $scope.favoriteProjects = getFavoriteProjects();
            $scope.projectsOwnedByMe = getProjectsOwnedByMe();
            $scope.projectsOwnedByOthers = getProjectsOwnedByOthers();
            $scope.archivedProjects = getArchivedProjects();
        }
        $scope.activateProject = function (project) {
            if ($scope.subscription.canArchiveProjects) {
                $scope.openModalWindow("activateProject", project.id, project.name);
            } else {
                $scope.openModalWindow("changePlan");
            }
        };
        $scope.openNewProjectModal = function () {
            $scope.openModalWindow("newProject");
        };
        $scope.openShareModal = function (project) {
            $scope.openModalWindow("share", project.id);
        };
        $scope.toggleArchivedProjects = function () {
            $scope.isShowingArchivedProjects = !$scope.isShowingArchivedProjects;
        };
        $scope.toggleFavoriteStatus = function (project) {
            project.isFavorite = !project.isFavorite;
            projectService.setFavoriteStatus(project.id, project.isFavorite);
            updateProjectBreakdowns();
        };
        $scope.deleteProject = function (project) {
            $scope.openModalWindow("deleteProject", project.id);
        };
        $scope.duplicateProject = function (project) {
            $scope.openModalWindow("duplicateProject", project.id);
        };
        $scope.isLoading = false;
        $scope.projects = [];
        $scope.favoriteProjects = [];
        $scope.projectsOwnedByMe = [];
        $scope.projectsOwnedByOthers = [];
        $scope.archivedProjects = [];
        $scope.projectsFilter = "";
        $scope.isShowingArchivedProjects = false;
        $scope.subscription = null;
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("projectCreated.projects");
            modelEvents.off("projectDeleted.projects");
            modelEvents.off("projectUpdated.projects");
            modelEvents.off("projectUserAdded.projects");
            modelEvents.off("subscriptionChanged.projects");
        }
        );
        modelEvents.on(
        "projectCreated.projects",
        function () {
            loadRemoteData();
        }
        );
        modelEvents.on(
        "projectDeleted.projects",
        function (event, projectID) {
            var projects = _.withoutProperty($scope.projects, "id", projectID);
            applyRemoteData(projects);
        }
        );
        modelEvents.on(
        "projectUpdated.projects",
        function (event, project) {
            var cachedProject = _.extendExistingProperties(
            _.findWithProperty($scope.projects, "id", project.id),
            project
            );
            if (cachedProject) {
                applyRemoteData($scope.projects);
            }
        }
        );
        modelEvents.on(
        "projectUserAdded.projects",
        function (event, projectID, userID) {
            if (userID === sessionService.user.id) {
                loadRemoteData();
            }
        }
        );
        modelEvents.on(
        "subscriptionChanged.projects",
        function (event, subscription) {
            $scope.subscription = subscription;
        }
        );
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! design-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("quotes.DesignController", Controller);
    /** @ngInject */
    function Controller($scope, designQuoteService, _) {
        $scope.designQuote = designQuoteService.getRandomQuote();
    }
})(angular, InVision);
;
;
/*! account-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.AccountController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, billingService, subscriptionService, validationService, sessionService, modelEvents, _) {
        function loadRemoteData() {
            $scope.isLoadingInvoices = true;
            $scope.isLoadingPlan = true;
            $scope.isLoadingPaymentInfo = true;
            Deferred.handleAllPromises(
            [
            billingService.getCountries(),
            billingService.getPaymentInfo()
            ],
            function (countries, paymentInfo) {
                $scope.countries = countries;
                $scope.isLoadingPaymentInfo = false;
                $scope.cardInfoName = paymentInfo.name;
                $scope.cardInfoLastFour = paymentInfo.lastFourDigits;
                $scope.company = paymentInfo.company;
                $scope.billingAddress1 = paymentInfo.street1;
                $scope.billingAddress2 = paymentInfo.street2;
                $scope.billingCity = paymentInfo.city;
                $scope.billingState = paymentInfo.state;
                $scope.billingZip = paymentInfo.zipcode;
                $scope.billingCountry = _.where($scope.countries, { two_letter_code: paymentInfo.country })[0];
                if (paymentInfo.name === undefined) {
                    $scope.billingFirstName = sessionService.user.name.split(/\s/).slice(0, 1).toString();
                    $scope.billingLastName = sessionService.user.name.split(/\s/).slice(-1).toString();
                } else {
                    $scope.billingFirstName = paymentInfo.name.split(/\s/).slice(0, 1).toString();
                    $scope.billingLastName = paymentInfo.name.split(/\s/).slice(-1).toString();
                }
                if (paymentInfo.city === undefined
                && paymentInfo.state === undefined
                && paymentInfo.country === undefined) {
                    $scope.billingCity = sessionService.user.city;
                    $scope.billingState = sessionService.user.state;
                    $scope.billingCountry = _.where($scope.countries, { "name": sessionService.user.country })[0];
                }
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your billing information. Try refreshing your browser.");
            }
            );
            Deferred.handlePromise(
            subscriptionService.getCurrentPlan(),
            function (currentPlan) {
                $scope.isLoadingPlan = false;
                $scope.currentPlan = currentPlan;
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load the current subscription. Try refreshing your browser.");
            }
            );
            loadInvoices();
        }
        function loadInvoices() {
            Deferred.handlePromise(
            billingService.getInvoices(),
            function (invoices) {
                $scope.isLoadingInvoices = false;
                $scope.billingHistory = invoices;
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your billing history. Try refreshing your browser.");
            }
            );
        }
        $scope.openChangePlanModal = function (showAllPlans, canSeeDowngrades) {
            if (!$scope.isEnterpriseUser) {
                if (canSeeDowngrades) {
                    $scope.openModalWindow("downgradePlan", {
                        showAllPlans: true,
                        canShowDowngrades: canSeeDowngrades
                    });
                } else {
                    $scope.openModalWindow("changePlan", {
                        showAllPlans: showAllPlans,
                        canShowDowngrades: canSeeDowngrades
                    });
                }
            } else {
                $scope.openModalWindow("changePlanEnterprise");
            }
        };
        $scope.hideCreditCardForm = function () {
            $scope.isShowingCreditCardForm = false;
        };
        $scope.showCreditCardForm = function () {
            $scope.isShowingCreditCardForm = true;
        };
        $scope.showAllInvoices = function () {
            $scope.allInvoicesShown = true;
        };
        $scope.hideSomeInvoices = function () {
            $scope.allInvoicesShown = false;
        };
        $scope.saveCreditCardForm = function () {
            if (!$scope.isShowingCreditCardForm) {
                return;
            }
            $scope.$broadcast("autofillCheck.update");
            $scope.hasCardChanged = (
            $scope.billingInformation.creditCardDigits.$dirty ||
            $scope.billingInformation.creditCardExpirationMonth.$dirty ||
            $scope.billingInformation.creditCardExpirationYear.$dirty ||
            $scope.billingInformation.creditCardCSV.$dirty
            );
            $scope.creditCardDigits = $scope.creditCardDigits.replace(/[^0-9]/gi, '');
            var isAMEX = $scope.creditCardDigits.match(/^3[47][0-9]{13}$/);
            var billingCountry = (!_.isUndefined($scope.billingCountry)) ? $scope.billingCountry.two_letter_code : "";
            $scope.creditCardErrorMessage = null;
            $scope.successMessage = null;
            if ($scope.hasCardChanged) {
                if (isAMEX && $scope.creditCardCSV.length !== 4) {
                    $scope.creditCardErrorMessage = "The CVV must be 4 digits for American Express cards.";
                    return;
                } else if ((!isAMEX) && $scope.creditCardCSV.length !== 3) {
                    $scope.creditCardErrorMessage = "The CVV must be 3 digits for your card.";
                    return;
                }
            }
            Deferred.handlePromise(
            billingService.changeCreditCard(
            $scope.hasCardChanged,
            true,
            $scope.billingFirstName,
            $scope.billingLastName,
            $scope.creditCardDigits,
            $scope.creditCardExpirationMonth,
            $scope.creditCardExpirationYear,
            $scope.creditCardCSV,
            $scope.company,
            $scope.billingAddress1,
            $scope.billingAddress2,
            $scope.billingCity,
            $scope.billingState,
            $scope.billingZip,
            billingCountry),
            function (paymentInfo) {
                $scope.successMessage = "Your card has been saved";
                $scope.creditCardDigits = '';
                $scope.creditCardCSV = '';
                $scope.creditCardExpirationMonth = '';
                $scope.creditCardExpirationYear = '';
                $scope.hasCardChanged = false;
                $scope.hideCreditCardForm();
                $scope.successMessage = "Awesome! Now you're rocking!";
                $scope.errorMessage = null;
                $scope.creditCardErrorMessage = null;
                modelEvents.trigger("billingInfo:updated", paymentInfo);
            },
            function (response) {
                $scope.creditCardErrorMessage = response.message;
                $scope.successMessage = null;
                modelEvents.trigger("billingInfo:error", response);
            }
            );
        };
        var renderContext = requestContext.getRenderContext("standard.team.detail.account", "userID");
        $scope.countries = null;
        $scope.userID = requestContext.getParamAsInt("userID");
        $scope.isLoadingPlan = false;
        $scope.isLoadingInvoices = false;
        $scope.successMessage = null;
        $scope.currentPlan = false;
        $scope.isShowingCreditCardForm = false;
        $scope.billingFirstName = "";
        $scope.billingLastName = "";
        $scope.creditCardDigits = "";
        $scope.creditCardExpirationMonth = "";
        $scope.creditCardExpirationYear = "";
        $scope.creditCardCSV = "";
        $scope.company = "";
        $scope.billingAddress1 = "";
        $scope.billingAddress2 = "";
        $scope.billingCity = "";
        $scope.billingState = "";
        $scope.billingZip = "";
        $scope.billingCountry = "";
        $scope.hasCardChanged = false;
        $scope.cardInfoName = "A Designer";
        $scope.cardInfoLastFour = "**** **** **** 9999";
        $scope.billingHistory = null;
        $scope.errorMessage = null;
        $scope.creditCardErrorMessage = null;
        $scope.allInvoicesShown = false;
        modelEvents.on(
        "subscriptionChanged.account",
        function (event, newPlan) {
            $scope.currentPlan = newPlan;
            loadInvoices();
        }
        );
        modelEvents.on(
        "billingInfo:updated",
        function (event, billingInfo) {
            $scope.cardInfoLastFour = billingInfo.lastFourDigits;
            $scope.cardInfoName = billingInfo.firstName + ' ' + billingInfo.lastName;
            $scope.creditCardDigits = "";
            $scope.creditCardCSV = "";
        }
        );
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("billingInfo:updated");
            modelEvents.off("subscriptionChanged.account");
        }
        );
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! activity-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.ActivityController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, projectService, teamActivityPartial, dateHelper, userService, _) {
        function addActivityToActivityPeriods(activity) {
            for (var i = 0 ; i < $scope.activityPeriods.length ; i++) {
                var existingActivity = $scope.activityPeriods[i];
                if (existingActivity.offset === activity.offset) {
                    _.extendExistingProperties(existingActivity, activity);
                    return (activity);
                }
            }
            $scope.activityPeriods.push(activity);
            return (activity);
        }
        function applyDateLabels(activity) {
            var d = dateHelper.removeTime(activity.offset);
            if (activity.durationInDays === 1) {
                if (dateHelper.isToday(d)) {
                    activity.primaryDateLabel = "Today";
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                } else if (dateHelper.isYesterday(d)) {
                    activity.primaryDateLabel = "Yesterday";
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                } else {
                    activity.primaryDateLabel = dateHelper.formatDate(d, "ddd");
                    activity.secondaryDateLabel = dateHelper.formatDate(d, "mmmm d");
                }
            } else {
                activity.primaryDateLabel = ("Week Of " + dateHelper.formatDate(d, "mmmm d"));
                activity.secondaryDateLabel = null;
            }
            return (activity);
        }
        function applyProjectEventCount(activity) {
            for (var i = 0, length = activity.projects.length ; i < length ; i++) {
                var project = activity.projects[i];
                project.eventCount = (project.comments.count + project.screensAdded.length + project.screensUpdated.length);
            }
            return (activity);
        }
        function applyRemoteData(activity) {
            if (activity.alreadyAddedToActivityPeriods) {
                return;
            }
            activity.alreadyAddedToActivityPeriods = true;
            activity = augmentActivity(activity);
            addActivityToActivityPeriods(activity);
            updateHasMoreActivityToLoad();
        }
        function augmentActivity(activity) {
            activity = applyDateLabels(activity);
            activity = applyProjectEventCount(activity);
            sortActivityProjects(activity.projects);
            augmentProjects(activity.projects);
            return (activity);
        }
        function augmentComments(comments) {
            for (var s = 0, sLength = comments.screens.length ; s < sLength ; s++) {
                var screen = comments.screens[s];
                for (var u = 0, uLength = screen.users.length ; u < uLength ; u++) {
                    var user = screen.users[u];
                    user.shortName = userService.getShortName(user.name);
                    user.initials = userService.getInitials(user.name);
                    user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
                }
            }
            return (comments);
        }
        function augmentProject(project) {
            augmentComments(project.comments);
            augmentScreens(project.screensAdded);
            augmentScreens(project.screensUpdated);
            return (project);
        }
        function augmentProjects(projects) {
            for (var i = 0, length = projects.length ; i < length ; i++) {
                augmentProject(projects[i]);
            }
            return (projects);
        }
        function augmentScreens(screens) {
            for (var i = 0, length = screens.length ; i < length ; i++) {
                var screen = screens[i];
                screen.shortUserName = userService.getShortName(screen.userName);
            }
            return (screens);
        }
        function getLastKnownOffset() {
            return (
            _.last($scope.activityPeriods).offset
            );
        }
        function getOffsetsForCurrentWeek() {
            var offsets = [];
            var currentDay = dateHelper.today();
            if (currentDay.getDay() === 0) {
                offsets.push(currentDay.getTime());
                currentDay = dateHelper.addDays(currentDay, -1);
            }
            for (var i = currentDay.getDay() ; i >= 1 ; i--) {
                offsets.push(currentDay.getTime());
                currentDay = dateHelper.addDays(currentDay, -1);
            }
            return (offsets);
        }
        function loadActivityStream() {
            $scope.isLoadingActivity = true;
            var offsets = getOffsetsForCurrentWeek();
            var promises = [];
            for (var i = 0 ; i < offsets.length ; i++) {
                promises.push(
                teamActivityPartial.get($scope.userID, offsets[i], 1)
                );
            }
            Deferred.handleAllPromises(
            promises,
            function (promise1, promise2, promiseN) {
                $scope.isLoadingActivity = false;
                var projectCount = 0;
                for (var i = 0 ; i < arguments.length ; i++) {
                    applyRemoteData(arguments[i].activity);
                    projectCount += arguments[i].activity.projects.length;
                }
                if (!projectCount) {
                    $scope.loadMoreActivity();
                }
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load this team member's activity stream. Try refreshing your browser.");
            }
            );
        }
        function sortActivityProjects(projects) {
            projects.sort(
            function (a, b) {
                return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            }
            );
            return (projects);
        }
        function updateHasMoreActivityToLoad() {
            var activity = _.last($scope.activityPeriods);
            $scope.hasMoreActivityToLoad = (activity.offset > activity.minimumOffset);
        }
        $scope.loadMoreActivity = function () {
            $scope.isLoadingPastActivity = true;
            var lastKnownOffset = getLastKnownOffset();
            var pastOffset = dateHelper.addDays(lastKnownOffset, -7).getTime();
            Deferred.handlePromise(
            teamActivityPartial.get($scope.userID, pastOffset, 7),
            function (response) {
                $scope.isLoadingPastActivity = false;
                applyRemoteData(response.activity);
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load this team member's past activity. Try refreshing your browser.");
            }
            );
        };
        $scope.toggleProject = function (project) {
            project.isMinimizedInTimeline = !project.isMinimizedInTimeline;
            Deferred.handlePromise(
            projectService.setIsMinimizedInTimeline(project.id, project.isMinimizedInTimeline),
            function () {
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't save your activity stream setting. Try refreshing your browser.");
            }
            );
        };
        var renderContext = requestContext.getRenderContext("standard.team.detail.activity", "userID");
        $scope.userID = requestContext.getParamAsInt("userID");
        $scope.isLoadingActivity = false;
        $scope.isLoadingPastActivity = false;
        $scope.activityPeriods = [];
        $scope.hasMoreActivityToLoad = false;
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            if (requestContext.hasParamChanged("userID")) {
                $scope.userID = requestContext.getParamAsInt("userID");
                $scope.activityPeriods = [];
                loadActivityStream();
            }
        }
        );
        loadActivityStream();
    }
})(angular, InVision);
;
;
/*! detail-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.DetailController", Controller);
    /** @ngInject */
    function Controller($scope, $location, requestContext, Deferred, teamService, projectService, sessionService, teamDetailPartial, modelEvents, dateHelper, validationService, userService, _) {
        function applyRemoteData(teamMember, projects) {
            $scope.teamMember = teamMember;
            $scope.teamMember.initials = userService.getInitials(teamMember.name);
            $scope.teamMember.hasSystemAvatar = userService.isSystemAvatar(teamMember.avatarID);
            $scope.teamMember.onlineStatus = userService.getOnlineStatus(teamMember.lastRequestAt);
            $scope.setWindowTitle(teamMember.name);
            teamMember.lastActiveAtLabel = getLastActiveLabel(teamMember.lastRequestAt);
            $scope.projects = sortProjects(projects);
            if (sessionService.user.id === $scope.teamMember.id) {
                $scope.projectsOwnedByMe = getProjectsOwnedByMe(projects);
                $scope.projectsOwnedByOthers = getProjectsOwnedByOthers(projects);
                $scope.projectsOwnedByTeamMember = [];
            } else {
                $scope.projectsOwnedByMe = getProjectsOwnedByMe(projects);
                $scope.projectsOwnedByTeamMember = getProjectsOwnedByTeamMember(projects);
                $scope.projectsOwnedByOthers = getProjectsOwnedByOthers(projects);
            }
        }
        function getLastActiveLabel(offset) {
            return (
            dateHelper.formatRecentDate(offset, "mmm d") +
            " at " +
            dateHelper.formatTime(offset, "h:mm tt")
            );
        }
        function getProjectsOwnedByMe(projects) {
            return (
            _.withProperty(projects, "userID", sessionService.user.id)
            );
        }
        function getProjectsOwnedByOthers(projects) {
            projects = _.withoutProperty(projects, "userID", sessionService.user.id);
            if (sessionService.user.id !== $scope.teamMember.id) {
                projects = _.withoutProperty(projects, "userID", $scope.teamMember.id);
            }
            return (projects);
        }
        function getProjectsOwnedByTeamMember(projects) {
            return (
            _.withProperty(projects, "userID", $scope.teamMember.id)
            );
        }
        function loadRemoteData() {
            var userID = requestContext.getParamAsInt("userID");
            var maxProjectCount = sessionService.subscription.maxProjectCount;
            var currentUserID = sessionService.user.id;
            if (maxProjectCount >= 5 || currentUserID === userID) {
                $scope.canViewActivity = true;
            }
            else {
                $scope.canViewActivity = false;
            }
            $scope.isLoading = true;
            Deferred.handlePromise(
            teamDetailPartial.get(userID),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.teamMember,
                response.projects
                );
            },
            function () {
                $location.path("/team");
            }
            );
        }
        function sortProjects(projects) {
            return (
            _.sortOnProperty(projects, "name")
            );
        }
        $scope.inviteToProject = function (project) {
            var projectID = project.id;
            var userID = $scope.teamMember.id;
            project.includesTeamMember = true;
            Deferred.handlePromise(
            projectService.addUserToProject(projectID, userID),
            null,
            function (response) {
                project.includesTeamMember = false;
                if (validationService.isOverQuota(response)) {
                    $scope.openModalWindow("error", "The collaborator limit is maxed out. The owner of this project must upgrade their account.");
                } else {
                    $scope.openModalWindow("error", "For some reason we couldn't add this team member to that project.");
                }
            }
            );
        };
        $scope.openShareModal = function (project) {
            $scope.openModalWindow("share", project.id);
        };
        $scope.removeFromProject = function (project) {
            var projectID = project.id;
            var userID = $scope.teamMember.id;
            Deferred.handlePromise(
            projectService.removeUserFromProject(projectID, userID),
            function (response) {
                project.includesTeamMember = false;
            },
            function () {
                $scope.openModalWindow("error", "For some reason we couldn't remove this team member from that project. Perhaps they own the project?");
            }
            );
        };
        $scope.removeSelfFromProject = function (project) {
            var projectID = project.id;
            var userID = sessionService.user.id;
            Deferred.handlePromise(
            projectService.removeUserFromProject(projectID, userID),
            function (response) {
                $scope.projects = _.withoutProperty($scope.projects, "id", projectID);
                $scope.projectsOwnedByTeamMember = getProjectsOwnedByTeamMember($scope.projects);
                $scope.projectsOwnedByOthers = getProjectsOwnedByOthers($scope.projects);
            },
            function (response) {
                $scope.openModalWindow("error", response.message);
            }
            );
        };
        $scope.toggleFavoriteStatus = function (project) {
            project.isFavorite = !project.isFavorite;
            projectService.setFavoriteStatus(project.id, project.isFavorite);
        };
        $scope.updateAdminStatus = function () {
            var userID = $scope.teamMember.id;
            var canCreateProjectsForLead = $scope.teamMember.canCreateProjectsForLead;
            Deferred.handlePromise(
            teamService.setAdminStatus(userID, canCreateProjectsForLead),
            null,
            function (resposne) {
                $scope.openModalWindow("error", "For some reason we couldn't update the admin permissions.");
            }
            );
        };
        var renderContext = requestContext.getRenderContext("standard.team.detail", "userID");
        $scope.canViewActivity = true;
        $scope.isLoading = false;
        $scope.teamMember = null;
        $scope.teamLeadName = sessionService.user.name;
        $scope.projects = [];
        $scope.projectsOwnedByMe = [];
        $scope.projectsOwnedByTeamMember = [];
        $scope.projectsOwnedByOthers = [];
        $scope.subview = renderContext.getNextSection();
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("accountUpdated.teamDetail");
            modelEvents.off("projectUserAdded.teamDetail");
        }
        );
        $scope.$on(
        "requestContextChanged",
        function () {
            if (!renderContext.isChangeRelevant()) {
                return;
            }
            if (requestContext.hasParamChanged("userID")) {
                loadRemoteData();
            }
            $scope.subview = renderContext.getNextSection();
        }
        );
        modelEvents.on(
        "accountUpdated.teamDetail",
        function (event, account) {
            if (
            $scope.isLoading ||
            ($scope.teamMember.id !== account.id)
            ) {
                return;
            }
            $scope.teamMember.name = account.name;
            $scope.teamMember.email = account.email;
            $scope.teamMember.avatarID = account.avatarID;
            $scope.teamMember.initials = userService.getInitials(account.name);
            $scope.teamMember.hasSystemAvatar = userService.isSystemAvatar(account.avatarID);
            $scope.teamMember.onlineStatus = userService.getOnlineStatus(teamMember.lastRequestAt);
        }
        );
        modelEvents.on(
        "projectUserAdded.teamDetail",
        function (event, projectID, userID) {
            if (userID === requestContext.getParamAsInt("userID")) {
                var existingProject = _.findWithProperty($scope.projects, "id", projectID);
                if (existingProject) {
                    existingProject.includesTeamMember = true;
                } else {
                    loadRemoteData();
                }
            }
        }
        );
        modelEvents.on(
        "subscriptionChanged",
        function (event, newPlan) {
            var currentUserID = sessionService.user.id;
            var teamMemberID = requestContext.getParamAsInt("userID");
            if (newPlan.maxProjectCount >= 5 || currentUserID === teamMemberID) {
                $scope.canViewActivity = true;
            }
            else {
                $scope.canViewActivity = false;
            }
        }
        );
        $scope.setWindowTitle("Loading team member profile...");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! list-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.ListController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, teamService, teamInvitationService, teamListPartial, modelEvents, hashKeyCopier, userService, _) {
        function applyRemoteData(teamMembers, invitations) {
            $scope.teamMembers = hashKeyCopier.copyHashKeys($scope.teamMembers, augmentTeamMembers(teamMembers));
            $scope.invitations = hashKeyCopier.copyHashKeys($scope.invitations, augmentInvitations(invitations));
            $scope.teamLead = getTeamLead($scope.teamMembers);
            $scope.activeTeamMembers = sortTeamMembers(getActiveTeamMembers($scope.teamMembers));
            $scope.inactiveTeamMembers = sortTeamMembers(getInactiveTeamMembers($scope.teamMembers));
            $scope.invitations = sortInvitations($scope.invitations);
        }
        function augmentInvitation(invitation) {
            invitation.memberInitials = userService.getInitials(invitation.memberEmail);
            invitation.memberHasSystemAvatar = userService.isSystemAvatar(invitation.avatarID);
            return (invitation);
        }
        function augmentInvitations(invitations) {
            _.each(invitations, augmentInvitation);
            return (invitations);
        }
        function augmentTeamMember(teamMember) {
            teamMember.initials = userService.getInitials(teamMember.name);
            teamMember.hasSystemAvatar = userService.isSystemAvatar(teamMember.avatarID);
            teamMember.onlineStatus = userService.getOnlineStatus(teamMember.lastRequestAt);
            return (teamMember);
        }
        function augmentTeamMembers(teamMembers) {
            _.each(teamMembers, augmentTeamMember);
            return (teamMembers);
        }
        function getActiveTeamMembers(teamMembers) {
            var activeTeamMembers = _.filter(
            teamMembers,
            function (teamMember) {
                return (!teamMember.isTeamLead && !!teamMember.projectCount);
            }
            );
            return (activeTeamMembers);
        }
        function getInactiveTeamMembers(teamMembers) {
            var inactiveTeamMembers = _.filter(
            teamMembers,
            function (teamMember) {
                return (!teamMember.isTeamLead && !teamMember.projectCount);
            }
            );
            return (inactiveTeamMembers);
        }
        function getTeamLead(teamMembers) {
            return (
            _.findWithProperty(teamMembers, "isTeamLead", true)
            );
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            teamListPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.teamMembers,
                response.invitations
                );
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't load your team. Try refreshing your browser.");
            }
            );
        }
        function sortInvitations(invitations) {
            return (
            _.sortOnProperty(invitations, "memberEmail")
            );
        }
        function sortTeamMembers(teamMembers) {
            teamMembers.sort(
            function (a, b) {
                if (a.onlineStatus !== b.onlineStatus) {
                    if (a.onlineStatus === "Online") {
                        return (-1);
                    } else if (
                    (a.onlineStatus === "Away") &&
                    (b.onlineStatus === "Offline")
                    ) {
                        return (-1);
                    } else {
                        return (1);
                    }
                }
                if (a.projectCount !== b.projectCount) {
                    return (a.projectCount > b.projectCount ? -1 : 1);
                }
                return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            }
            );
            return (teamMembers);
        }
        $scope.cancelInvitation = function (invitation) {
            $scope.invitations = _.withoutProperty($scope.invitations, "id", invitation.id);
            Deferred.handlePromise(
            teamInvitationService.cancel(invitation.id),
            null,
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't cancel that invitation.");
            }
            );
        };
        $scope.openNewTeamMemberModal = function () {
            if ($scope.teamFilter && $scope.teamFilter.search(/^[^@\s]+(@|$)/i) >= 0) {
                $scope.openModalWindow("newTeamMember", $scope.teamFilter.toLowerCase());
            } else {
                $scope.openModalWindow("newTeamMember");
            }
        };
        $scope.removeTeamMember = function (teamMember) {
            $scope.inactiveTeamMembers = _.withoutProperty($scope.inactiveTeamMembers, "id", teamMember.id);
            Deferred.handlePromise(
            teamService.remove(teamMember.id),
            null,
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't remove " + teamMember.name + " from your team.");
            }
            );
        };
        $scope.resendInvitation = function (invitation) {
            Deferred.handlePromise(
            teamInvitationService.resend(invitation.id),
            function () {
                $scope.openModalWindow("alert", "Your invitation has been resent.");
            },
            function () {
                $scope.openModalWindow("error", "For some reason, we couldn't cancel that invitation.");
            }
            );
        };
        $scope.openTeamSetupVideo = function () {
            $scope.openModalWindow("video", "66614411");
        };
        var renderContext = requestContext.getRenderContext("standard.team.list");
        $scope.isLoading = false;
        $scope.teamMembers = [];
        $scope.teamLead = [];
        $scope.activeTeamMembers = [];
        $scope.inactiveTeamMembers = [];
        $scope.invitations = [];
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("teamInvitationCreated.teamList");
            modelEvents.off("teamMemberCreated.teamList");
            modelEvents.off("teamMemberUpdated.teamList");
        }
        );
        modelEvents.on(
        [
        "teamInvitationCreated.teamList",
        "teamMemberCreated.teamList",
        "teamMemberUpdated.teamList"
        ],
        function (event, invitation) {
            loadRemoteData();
        }
        );
        $scope.setWindowTitle("My Team");
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! notifications-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.NotificationsController", Controller);
    /** @ngInject */
    function Controller($scope, moment, requestContext, Deferred, notificationsService, teamNotificationsPartial, sessionService, dateHelper, _, $timeout) {
        function applyRemoteData(settings, projects) {
            $scope.settings = settings;
            $scope.projects = projects;
            _.sortOnProperty($scope.projects, "name");
            if ($scope.settings.digestEmails.wantsDigestAtFrequencyInHours === 24 &&
            _.isNumber($scope.settings.digestEmails.sendNextDigestAt) &&
            moment($scope.settings.digestEmails.sendNextDigestAt).isValid()
            ) {
                $scope.settings.digestEmails.sendNextDigestAt = moment($scope.settings.digestEmails.sendNextDigestAt).valueOf();
                $scope.changeDigestSendTime({
                    dateTime: $scope.settings.digestEmails.sendNextDigestAt,
                    label: moment($scope.settings.digestEmails.sendNextDigestAt).format("h:mma")
                });
                $scope.hasDigestTimeChanged = false;
            } else {
                setDigestSendAtTimeToDefault();
                $scope.hasDigestTimeChanged = true;
            }
            $scope.settings.digestEmails.enable = ($scope.settings.digestEmails.wantsDigestAtFrequencyInHours > 0);
            augmentProjects();
        }
        function augmentProjects() {
            var settings = $scope.settings;
            var projects = $scope.projects;
            for (var i = 0 ; i < projects.length ; i++) {
                for (var j = 0 ; j < settings.projectNotifications.length ; j++) {
                    if (projects[i].id === settings.projectNotifications[j].id) {
                        projects[i].notificationSettings = settings.projectNotifications[j];
                        break;
                    }
                }
            }
            var firstProjectWithOutRealTimeNotification = _.find(projects, function (project) {
                return !project.notificationSettings.wantsRealtimeCommentEmails;
            });
            $scope.form.toggleAllRealtimeNotifications = _.isUndefined(firstProjectWithOutRealTimeNotification);
            $scope.projectsOwnedByMe = getProjectsOwnedByMe();
            $scope.projectsOwnedByOthers = getProjectsOwnedByOthers();
        }
        function getProjectsOwnedByMe() {
            return (
            _.withProperty($scope.projects, "userID", $scope.userID)
            );
        }
        function getProjectsOwnedByOthers() {
            return (
            _.withoutProperty($scope.projects, "userID", $scope.userID)
            );
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            teamNotificationsPartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(
                response.notificationSettings,
                response.projects
                );
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your notification settings. Try refreshing your browser.");
            }
            );
        }
        function setDigestSendAtTimeToDefault() {
            var defaultOpt = _.filterWithProperty($scope.digestSendTimeOptions, "label", "8:00pm");
            $scope.changeDigestSendTime(defaultOpt[0]);
        }
        function setupDigestSendTimes() {
            var startTime = moment().startOf("day");
            var endTime = moment(startTime).add("d", 1);
            var timeOptionArray = [];
            for (var timeIdx = startTime; timeIdx.isBefore(endTime) ; timeIdx.add("m", 30)) {
                timeOptionArray.push({
                    dateTime: timeIdx.clone().utc().valueOf(),
                    label: timeIdx.format("h:mma")
                });
            }
            $scope.digestSendTimeOptions = timeOptionArray;
        }
        function turnOffAllRealtimeNotifications() {
            _.forEach($scope.projectsOwnedByMe, function (project) {
                project.notificationSettings.wantsRealtimeCommentEmails = false;
            });
            _.forEach($scope.projectsOwnedByOthers, function (project) {
                project.notificationSettings.wantsRealtimeCommentEmails = false;
            });
        }
        function turnOnAllRealtimeNotifications() {
            _.forEach($scope.projectsOwnedByMe, function (project) {
                project.notificationSettings.wantsRealtimeCommentEmails = true;
            });
            _.forEach($scope.projectsOwnedByOthers, function (project) {
                project.notificationSettings.wantsRealtimeCommentEmails = true;
            });
        }
        $scope.changeDigestSendTime = function (option) {
            var dateTime = option.dateTime;
            $scope.hasDigestTimeChanged = true;
            $scope.digestSendTime = option.label;
            if (moment(dateTime).isBefore(moment())) {
                dateTime = moment(dateTime).add("d", 1).valueOf();
            }
            $scope.sendDigestAtSavedSuccessfully = false;
            $scope.settings.digestEmails.sendNextDigestAt = dateTime;
        };
        $scope.saveDigestSentAtTime = function () {
            var wantsDigestAtFrequencyInHours = $scope.settings.digestEmails.wantsDigestAtFrequencyInHours;
            var nextDigestAt = $scope.settings.digestEmails.sendNextDigestAt;
            if (wantsDigestAtFrequencyInHours < 24) {
                nextDigestAt = moment().utc().add("h", wantsDigestAtFrequencyInHours).valueOf();
            }
            Deferred.handlePromise(
            notificationsService.updateSendDigestAt(
            wantsDigestAtFrequencyInHours,
            nextDigestAt
            ),
            function (response) {
                $scope.sendDigestAtSavedSuccessfully = true;
            },
            function (response) {
                $scope.errorMessage = "There was a problem saving your settings.";
                $scope.successMessage = null;
                $scope.sendDigestAtSavedSuccessfully = false;
            }
            );
        };
        $scope.saveSettings = function () {
            Deferred.handlePromise(
            notificationsService.updateSettings($scope.settings),
            function (response) {
                $scope.errorMessage = null;
                $scope.successMessage = "Your notification settings have been saved.";
            },
            function (response) {
                $scope.errorMessage = "There was a problem saving your settings.";
                $scope.successMessage = null;
            }
            );
        };
        $scope.showSubview = function (section) {
            $scope.subview = section;
        };
        var renderContext = requestContext.getRenderContext("standard.team.detail.notifications");
        $scope.userID = sessionService.user.id;
        $scope.isLoading = false;
        $scope.settings = null;
        $scope.projects = [];
        $scope.projectsOwnedByMe = [];
        $scope.projectsOwnedByOthers = [];
        $scope.digestSendTime = "";
        $scope.digestSendTimeOptions = [];
        $scope.hasDigestTimeChanged = false;
        $scope.subview = "email";
        $scope.errorMessage = null;
        $scope.successMessage = null;
        $scope.sendDigestAtSavedSuccessfully = false;
        $scope.form = {
            toggleAllRealtimeNotifications: false
        };
        $scope.$watch("settings.digestEmails.wantsDigestAtFrequencyInHours", function (newValue, oldValue) {
            if (oldValue !== newValue) {
                $scope.hasDigestTimeChanged = true;
                $scope.sendDigestAtSavedSuccessfully = false;
            }
        });
        $scope.$watch("form.toggleAllRealtimeNotifications", function (newValue, oldValue) {
            if (oldValue === newValue) {
                return;
            }
            if (newValue === true) {
                turnOnAllRealtimeNotifications();
            } else if (newValue === false) {
                turnOffAllRealtimeNotifications();
            }
        });
        loadRemoteData();
        setupDigestSendTimes();
    }
})(angular, InVision);
;
;
/*! profile-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.ProfileController", Controller);
    /** @ngInject */
    function Controller($scope, requestContext, Deferred, accountService, validationService, sessionService, teamProfilePartial, modelEvents, userService, _) {
        function applyRemoteData(account) {
            $scope.account = account;
            $scope.account.initials = userService.getInitials(account.name);
            $scope.account.hasSystemAvatar = userService.isSystemAvatar(account.avatarID);
        }
        function loadRemoteData() {
            $scope.isLoading = true;
            Deferred.handlePromise(
            teamProfilePartial.get(),
            function (response) {
                $scope.isLoading = false;
                applyRemoteData(response.account);
            },
            function (response) {
                $scope.openModalWindow("error", "For some reason, we couldn't load your profile. Try refreshing your browser.");
            }
            );
        }
        $scope.showCompanyForm = function () {
            $scope.isShowingCompanyForm = true;
            $scope.originalCompanyValue = $scope.account.company;
        };
        $scope.cancelCompanyForm = function () {
            $scope.isShowingCompanyForm = false;
            $scope.account.company = $scope.originalCompanyValue;
        };
        $scope.showConvertToCompanyTour = function () {
            $scope.openModalWindow("convertToCompanyTour");
        };
        $scope.convertToPersonalAccount = function () {
            $scope.account.isCompany = false;
            $scope.saveCompany(false);
        };
        $scope.saveCompany = function (isCompanyOverride) {
            $scope.account.isCompany = !_.isUndefined(isCompanyOverride) ? isCompanyOverride : true;
            var account = $scope.account;
            if (account.isCompany && account.company.length === 0) {
                $scope.companyErrorMessage = "Please enter a company name.";
                return;
            }
            var promise = accountService.updateCompany({
                company: account.company,
                isCompany: account.isCompany
            });
            Deferred.handlePromise(
            promise,
            function (account) {
                $scope.account = account;
                $scope.isShowingCompanyForm = false;
                $scope.companyErrorMessage = null;
            },
            function (response) {
                $scope.errorMessage = response.message;
            }
            );
        };
        $scope.hidePasswordForm = function () {
            $scope.passwordErrorMessage = null;
            $scope.password.newPassword = "";
            $scope.password.confirmationPassword = "";
            $scope.isShowingPasswordForm = false;
        };
        $scope.importGravatarAvatar = function () {
            $scope.openModalWindow("gravatarAvatar");
        };
        $scope.importTwitterAvatar = function () {
            $scope.openModalWindow("twitterAvatar");
        };
        $scope.savePassword = function () {
            if (
            ($scope.password.newPassword.length < 3) ||
            ($scope.password.newPassword.length > 60)
            ) {
                $scope.passwordErrorMessage = "Your password must be between 3 and 60 characters.";
                return;
            }
            if ($scope.password.newPassword !== $scope.password.confirmationPassword) {
                $scope.passwordErrorMessage = "Your new password does not match your confirmation password.";
                return;
            }
            Deferred.handlePromise(
            accountService.changePassword($scope.password.newPassword, $scope.password.confirmationPassword),
            function (account) {
                $scope.hidePasswordForm();
            },
            function (response) {
                $scope.passwordErrorMessage = response.message;
            }
            );
        };
        $scope.saveProfile = function () {
            $scope.successMessage = null;
            var account = $scope.account;
            if (!account.name.length) {
                $scope.errorMessage = "Please enter your name.";
                return;
            }
            if (! /[^@]+@[^.]+\..+/.test(account.email)) {
                $scope.errorMessage = "Please enter a valid email address.";
                return;
            }
            var promise = accountService.updateProfile({
                name: account.name,
                email: account.email,
                city: account.city,
                state: account.state,
                country: account.country
            });
            Deferred.handlePromise(
            promise,
            function (account) {
                if (!$scope.isShowingCompanyForm) {
                    $scope.account = account;
                } else {
                    var prevCompany = $scope.account.company;
                    var prevIsCompany = $scope.account.isCompany;
                    $scope.account = account;
                    $scope.account.company = prevCompany;
                    $scope.account.isCompany = prevIsCompany;
                }
                $scope.account.initials = userService.getInitials(account.name);
                $scope.account.hasSystemAvatar = userService.isSystemAvatar(account.avatarID);
                $scope.successMessage = "Your profile has been updated.";
                $scope.errorMessage = null;
            },
            function (response) {
                if (validationService.isAlreadyExists(response)) {
                    $scope.errorMessage = "That email address is not currently available for use.";
                    return;
                }
                $scope.errorMessage = response.message;
            }
            );
        };
        $scope.showPasswordForm = function () {
            $scope.isShowingPasswordForm = true;
        };
        var renderContext = requestContext.getRenderContext("standard.team.detail.profile", "userID");
        $scope.userID = requestContext.getParamAsInt("userID");
        $scope.isLoading = false;
        $scope.account = null;
        $scope.password = {
            newPassword: "",
            confirmationPassword: ""
        };
        $scope.successMessage = null;
        $scope.errorMessage = null;
        $scope.passwordErrorMessage = null;
        $scope.companyErrorMessage = null;
        $scope.isShowingPasswordForm = false;
        $scope.isShowingCompanyForm = false;
        $scope.originalCompanyValue = null;
        $scope.$on(
        "$destroy",
        function () {
            modelEvents.off("accountUpdated.teamProfile");
        }
        );
        $scope.$on(
        "profileAvatarUploader:uploaded",
        function (event, account) {
            $scope.account.avatarID = account.avatarID;
            $scope.errorMessage = null;
        }
        );
        $scope.$on(
        "profileAvatarUploader:error",
        function (event, response) {
            $scope.errorMessage = "There was a problem uploading your avatar!";
        }
        );
        modelEvents.on(
        "accountUpdated.teamProfile",
        function (event, account) {
            $scope.account.avatarID = account.avatarID;
            sessionService.update();
        }
        );
        loadRemoteData();
    }
})(angular, InVision);
;
;
/*! team-controller.js */
;
;
(function (ng, app) {
    "use strict";
    app.controller("team.TeamController", Controller);
    /** @ngInject */
    function Controller(BaseController, $scope, $location, requestContext) {
        BaseController.call(this, $scope);
        this.requestContext = requestContext;
        this.renderContext = this.requestContext.getRenderContext("standard.team");
        this.scope.subview = this.renderContext.getNextSection();
        if ($location.search().hasOwnProperty("showAcceptConfirmation")) {
            $scope.openModalWindow("teamInviteJoinedConfirmation", $location.search());
        }
    }
    Controller.prototype = {
        handleRequestContextChanged: function (requestContext) {
            if (!this.renderContext.isChangeRelevant()) {
                return;
            }
            this.scope.subview = this.renderContext.getNextSection();
        }
    };
})(angular, InVision);
;
;
/*! active-screens.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invActiveScreens", Directive);
    /** @ngInject */
    function Directive($filter) {
        var linkFunction = function ($scope, element, attributes) {
            var handleSortStart = function (event, ui) {
                startIndex = ui.item.index();
                $scope.$apply(
                function () {
                    $scope.$emit("activeScreens:sortStart");
                }
                );
            };
            var handleSortStop = function (event, ui) {
                $scope.$apply(
                function () {
                    $scope.$emit("activeScreens:sortStop");
                }
                );
            };
            var handleSortUpdate = function (event, ui) {
                var endIndex = ui.item.index();
                var filter = $scope.filters.screensFilter;
                var allScreens = $scope.displayObjects;
                var filteredScreens = $filter("filter")(allScreens, { "name": filter });
                if (endIndex === 0) {
                    insertBefore(
                    allScreens,
                    filteredScreens[startIndex],
                    filteredScreens[endIndex]
                    );
                } else if (endIndex > startIndex) {
                    insertAfter(
                    allScreens,
                    filteredScreens[startIndex],
                    filteredScreens[endIndex]
                    );
                } else {
                    insertAfter(
                    allScreens,
                    filteredScreens[startIndex],
                    filteredScreens[endIndex - 1]
                    );
                }
                $scope.$apply(
                function () {
                    $scope.$emit("activeScreens:sortUpdate");
                }
                );
            };
            var insertAfter = function (collection, movedItem, prevItem) {
                collection.splice(
                locateItem(collection, movedItem),
                1
                );
                collection.splice(
                (locateItem(collection, prevItem) + 1),
                0,
                movedItem
                );
            };
            var insertBefore = function (collection, movedItem, nextItem) {
                collection.splice(
                locateItem(collection, movedItem),
                1
                );
                collection.splice(
                locateItem(collection, nextItem),
                0,
                movedItem
                );
            };
            var locateItem = function (collection, item) {
                for (var i = 0, length = collection.length ; i < length ; i++) {
                    if (collection[i] === item) {
                        return (i);
                    }
                }
                return (-1);
            };
            $scope.$watch("filters.screensFilter", function (newVal) {
                if (newVal == "") {
                    $(element).sortable("option", "disabled", false);
                } else {
                    $(element).sortable("option", "disabled", true);
                }
            });
            var startIndex = null;
            var endIndex = null;
            $(element).sortable({
                cancel: ".divider",
                cursor: "move",
                items: ".screenObj, .divider",
                placeholder: "sortablePlaceholder",
                revert: 300, // animate the snap into position
                start: handleSortStart,
                stop: handleSortStop,
                tolerance: "pointer",
                update: handleSortUpdate
            });
            $scope.$on("screenRenameFocus", function () {
                $(element).sortable("option", "disabled", true);
            });
            $scope.$on("screenRenameBlur", function () {
                $(element).sortable("option", "disabled", false);
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).sortable("destroy");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! activity-stream-screen-list.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invActivityStreamScreenList", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            function configureShowMore() {
                dom.screens = dom.target.children("div.screen");
                dom.overflowScreens = dom.screens.filter(":gt( 3 )");
                dom.target.css("height", "auto");
                dom.showMore.hide();
                if (dom.overflowScreens.length) {
                    var rowCount = Math.ceil(dom.screens.length / 4);
                    fullHeight = (shortHeight * rowCount);
                    dom.target.css("height", shortHeight + "px");
                    dom.showMore
                    .removeClass("more")
                    .show()
                    ;
                }
            }
            function handleShowMoreClick(event) {
                if (dom.target.is(":animated")) {
                    return;
                }
                if (dom.showMore.is(".more")) {
                    dom.showMore.removeClass("more");
                    dom.overflowScreens.fadeOut("slow");
                    dom.target.animate(
                    {
                        height: (shortHeight + "px")
                    },
                    "slow"
                    );
                } else {
                    dom.showMore.addClass("more");
                    dom.overflowScreens.show();
                    dom.target.animate(
                    {
                        height: (fullHeight + "px")
                    },
                    "slow"
                    );
                }
            }
            var target = $(element);
            var dom = {
                target: target,
                showMore: target.children("div.showMore"),
                screens: null,
                overflowScreens: null
            };
            var shortHeight = 166;
            var fullHeight = shortHeight;
            target.on(
            "click.invActivityStreamScreenList",
            "div.showMore",
            handleShowMoreClick
            );
            $scope.$watch(
            attributes.invActivityStreamScreenList,
            function (screenCount, oldScreenCount) {
                configureShowMore();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("click.invActivityStreamScreenList");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! asset-share.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAssetShare", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            function handleInit() {
                var clipboard = dom.copyButton.zclip({
                    path: '/assets/zeroclipboard/ZeroClipboard10.swf',
                    copy: dom.shortCode.val(),
                    afterCopy: function () {
                        dom.copied.show().fadeIn('slow').delay(1000).fadeOut('slow');
                        /*
                        setTimeout(function(){
                        $scope.hideShareOverlay();
                        $scope.$apply();
                        }, 1000);
                        */
                    }
                });
                isInitialized = true;
            }
            var dom = {};
            dom.target = $(element);
            dom.shortCode = dom.target.find("input.shareLink.zeroClipboardText");
            dom.copyButton = dom.target.find("a.zeroClipboardButton");
            dom.copied = dom.target.find("div.copied_successful");
            var isInitialized = false;
            $scope.$watch(
            "isShowingShareOverlay",
            function (isShowing) {
                if (isShowing && isInitialized == false) {
                    $timeout(handleInit, 500);
                }
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! asset-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAssetUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents) {
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearStallTimer = function () {
                clearTimeout(stallTimer);
            };
            var clearUploader = function () {
                clearStallTimer();
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                    if (uploadQueue[i].id == id) {
                        uploadQueue.splice(i, 1);
                        return;
                    }
                }
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handleDragEnter = function (event) {
                event.stopPropagation();
                if (dom.dropzone.is(".hotDropzone")) {
                    return;
                }
                dom.dropzone.addClass("hotDropzone");
                $document.on("dragenter.invAssetUploader", handleDragEnterOnDocument);
            };
            var handleDragEnterOnDocument = function (event) {
                dom.dropzone.removeClass("hotDropzone");
                $document.off("dragenter.invAssetUploader");
            };
            var handleMouseEnter = function (event) {
                dom.dropzone.addClass("hotDropzone");
            };
            var handleMouseLeave = function (event) {
                dom.dropzone.removeClass("hotDropzone");
            };
            var handlePluploadError = function (uploader, error) {
                if (error.status == 413 || error.status == 500) {
                    $scope.openModalWindow("error", "The file you are uploading exceeds the maximum file size limit.");
                    clearUploader();
                }
                else if (error.status == 422) {
                    $scope.openModalWindow("error", "You have exceeded the allowed storage space for your account.  You can no longer upload additional assets.");
                    clearUploader();
                } else {
                    $scope.openModalWindow("error", "An error occured during your upload.  Please try again later.");
                    clearUploader();
                }
                $scope.$apply();
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                files.sort(
                function (a, b) {
                    var aName = a.name.toLowerCase();
                    var bName = b.name.toLowerCase();
                    return (aName < bName ? -1 : 1);
                }
                );
                for (var i = 0 ; i < files.length ; i++) {
                    addFileToQueue(
                    files[i].id,
                    files[i].name,
                    files[i].size
                    );
                }
                uploader.settings.multipart_params.numOfFiles = files.length;
                $scope.$emit("assetUploadStart");
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                uploader.removeFile(file);
                removeFileFromQueue(file.id);
                resetStallTimer();
                $scope.$apply(
                function () {
                    var asset = ng.fromJson(response.response);
                    modelEvents.trigger("assetUploaded", asset);
                    $scope.$emit("assetUploader:uploaded", asset);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
                if (isHtml5Runtime) {
                    allowableStallDuration = (5 * 1000);
                    dom.dropzone.on("mouseenter", handleMouseEnter);
                    dom.dropzone.on("mouseleave", handleMouseLeave);
                    dom.dropzone.on("dragenter", handleDragEnter);
                    dom.dropzone
                    .removeClass("flashDropzone")
                    .addClass("html5Dropzone")
                    ;
                } else {
                    dom.target.find("div.plupload.flash").on("mouseenter", handleMouseEnter);
                    dom.target.find("div.plupload.flash").on("mouseleave", handleMouseLeave);
                    dom.dropzone
                    .removeClass("html5Dropzone")
                    .addClass("flashDropzone")
                }
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        uploader.start();
                        startStallTimer();
                    }
                    );
                }
            };
            var handlePluploadUploadComplete = function (uploader, files) {
                clearStallTimer();
                $scope.$emit("assetUploadStop");
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    setFileProgress(
                    file.id,
                    file.uploaded,
                    file.percent
                    );
                    resetStallTimer();
                }
                );
            };
            var handleWindowScroll = function (event) {
                var uploaderOffset = dom.target.offset();
                var uploaderTop = uploaderOffset.top;
                var isAboveFold = (uploaderTop < dom.window.scrollTop());
                if (isAboveFold && !dom.target.is(".fixed")) {
                    $scope.isFixedDropzone = true;
                } else if (!isAboveFold && dom.target.is(".fixed")) {
                    $scope.isFixedDropzone = false;
                }
                $timeout(
                function () {
                    $scope.$apply();
                    setTimeout(refreshUploader); // Allow pause for DOM to update before shim is refreshed.
                }
                );
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(gif|jpe?g|png)$/i;
                return (
                pattern.test(name)
                );
            };
            var nudgeUploader = function () {
                return;
                uploader.stop();
                if (uploader.files.length) {
                    uploader.start();
                    startStallTimer();
                }
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var resetStallTimer = function () {
                clearTimeout(stallTimer);
                startStallTimer();
            };
            var setFileProgress = function (id, loaded, percent) {
                var queueItem = getQueueItemByID(id);
                queueItem.percentage = percent;
                if (queueItem.state === $scope.fileStates.PENDING) {
                    queueItem.state = $scope.fileStates.UPLOADING;
                }
            };
            var startStallTimer = function () {
                stallTimer = setTimeout(nudgeUploader, allowableStallDuration);
            };
            var dom = {};
            dom.target = element;
            dom.dropzone = dom.target.find("div.dropzone");
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            dom.window = $(window);
            var uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                url: "/api/assets",
                multipart_params: {
                    "projectID": $scope.projectID
                },
                drop_element: "assetUploaderDropzone",
                browse_button: "assetUploaderDropzone",
                container: "assetUploaderContainerBuffer",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            var stallTimer = null;
            var allowableStallDuration = (30 * 1000);
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadUploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOADING: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.isFixedDropzone = false;
            $scope.$watch(
            "!! assets.length",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $timeout(refreshUploader);
            }
            );
            $scope.$watch(
            "projectID",
            function (newValue) {
                uploader.settings.multipart_params.projectID = newValue;
            }
            );
            $scope.$watch(
            "isShowingUploader",
            function (newValue, oldValue) {
                if (newValue === true) {
                    if (!$scope.assets.length) {
                        dom.target.show();
                    } else {
                        var minHeight = dom.target.css("minHeight");
                        dom.target
                        .stop(true, true)
                        .css("minHeight", 0)
                        .slideDown("fast",
                        function () {
                            $(this).css("minHeight", minHeight);
                            refreshUploader();
                        }
                        )
                        ;
                    }
                    dom.window.on(
                    "error.assetUploader",
                    function (event) {
                        if (isFlashRuntime) {
                            return (false);
                        }
                    }
                    );
                    dom.window.on("scroll.assetUploader", handleWindowScroll);
                    handleWindowScroll();
                } else if (newValue === false) {
                    $scope.isFixedDropzone = false;
                    var minHeight = dom.target.css("minHeight");
                    dom.target
                    .stop(true, true)
                    .css("minHeight", 0)
                    .slideUp("fast",
                    function () {
                        $(this).css("minHeight", minHeight);
                    }
                    )
                    ;
                    clearUploader();
                    dom.window.off("error.assetUploader");
                    dom.window.off("scroll.assetUploader");
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                dom.window.off("error.assetUploader");
                dom.window.off("scroll.assetUploader");
                dom.target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: true,
            scope: true,
            templateUrl: "/assets/apps/d/views/directives/asset-uploader.htm"
        });
    }
})(angular, InVision);
;
;
/*! assets.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAssets", Directive);
    /** @ngInject */
    function Directive($filter) {
        var linkFunction = function ($scope, element, attributes) {
            var handleSortStart = function (event, ui) {
                startIndex = ui.item.index();
                $scope.$apply(
                function () {
                    $scope.$emit("assets:sortStart");
                }
                );
            };
            var handleSortStop = function (event, ui) {
                $scope.$apply(
                function () {
                    $scope.$emit("assets:sortStop");
                }
                );
            };
            var handleSortUpdate = function (event, ui) {
                var endIndex = ui.item.index();
                var filter = $scope.assetFilter;
                var allAssets = $scope.assets;
                var filteredAssets = $filter("filter")(allAssets, { "clientFilename": filter });
                if (endIndex === 0) {
                    insertBefore(
                    allAssets,
                    filteredAssets[startIndex],
                    filteredAssets[endIndex]
                    );
                } else if (endIndex > startIndex) {
                    insertAfter(
                    allAssets,
                    filteredAssets[startIndex],
                    filteredAssets[endIndex]
                    );
                } else {
                    insertAfter(
                    allAssets,
                    filteredAssets[startIndex],
                    filteredAssets[endIndex - 1]
                    );
                }
                $scope.$apply(
                function () {
                    $scope.$emit("assets:sortUpdate");
                }
                );
            };
            var insertAfter = function (collection, movedItem, prevItem) {
                collection.splice(
                locateItem(collection, movedItem),
                1
                );
                collection.splice(
                (locateItem(collection, prevItem) + 1),
                0,
                movedItem
                );
            };
            var insertBefore = function (collection, movedItem, nextItem) {
                collection.splice(
                locateItem(collection, movedItem),
                1
                );
                collection.splice(
                locateItem(collection, nextItem),
                0,
                movedItem
                );
            };
            var locateItem = function (collection, item) {
                for (var i = 0, length = collection.length ; i < length ; i++) {
                    if (collection[i] === item) {
                        return (i);
                    }
                }
                return (-1);
            };
            $scope.setAssetsSortableDisabled = function (value) {
                $(element).sortable("option", "disabled", value);
            }
            var startIndex = null;
            var endIndex = null;
            $(element).sortable({
                cursor: "move",
                handle: ".asset, .confirmation, .over-quota",
                placeholder: "sortablePlaceholder",
                start: handleSortStart,
                stop: handleSortStop,
                tolerance: "pointer",
                update: handleSortUpdate
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).sortable("destroy");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! autocomplete.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAutocomplete", Directive);
    /** @ngInject */
    function Directive($filter) {
        var linkFunction = function ($scope, element, attributes) {
            var getOptions = function () {
                var source = $scope[attributes.invAutocomplete];
                return angular.extend(
                DEFAULT_OPTIONS,
                { source: source }
                );
            };
            var initAutocompleteWidget = function () {
                var opts = getOptions();
                element.typeahead(opts);
                /* from jqui example
                if (opts._renderItem) {
                element.data("autocomplete")._renderItem = opts._renderItem;
                }
                */
            };
            var DEFAULT_OPTIONS = {};
            $scope.$watch(getOptions, initAutocompleteWidget, true);
            $scope.$on(
            "$destroy",
            function () {
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! autofill-check.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAutofillCheck", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            $scope.$on("autofillCheck.update", function () {
                $scope[attributes.ngModel] = element.val();
            });
        };
        return ({
            link: linkFunction,
            restrict: "A",
            require: "?ngModel",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! autofocus.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAutofocus", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            function focus() {
                setTimeout(
                function () {
                    element[0].focus();
                    if (attributes.invAutofocus === "select") {
                        element[0].select();
                    }
                }
                );
            }
            var modal = element.closest("div[ inv-modal ]");
            if (
            (modal.length === 1) &&
            (modal.is(".fade") && !modal.is(".in"))
            ) {
                modal.on(
                "shown.invAutofocus",
                function () {
                    focus();
                }
                );
            } else if (element.is(":visible")) {
                focus();
            }
            $scope.$watch(
            function () {
                return (
                element.is(":visible")
                );
            },
            function (newValue, oldValue) {
                if (
                (newValue === true) &&
                (newValue !== oldValue)
                ) {
                    focus();
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                modal.off("shown.invAutofocus");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! autosize.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invAutosize", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            function getInitialDelta() {
                var content = element.val();
                element.val("");
                var height = element.height();
                var scrollHeight = element[0].scrollHeight;
                var delta = Math.max(0, (scrollHeight - height));
                element.val(content);
                return (delta);
            }
            function resize() {
                var height = element.height();
                var scrollHeight = element[0].scrollHeight;
                var scrollableHeight = (scrollHeight - height - initialDelta);
                if (scrollableHeight <= 0) {
                    return;
                }
                var newHeight = (scrollHeight + 50);
                element.height(newHeight);
                $scope.$emit("autosizeResized", element, newHeight, height);
            }
            element.addClass("autosize");
            var initialDelta = getInitialDelta();
            element.on(
            "keypress.invAutosize",
            function (event) {
                resize();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                element.off("keypress.invAutosize");
            }
            );
        };
        return ({
            link: linkFunction,
            priority: 2,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! build-hotspot.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invBuildHotspot", Directive);
    /** @ngInject */
    function Directive($, _, $location, $window, templateService, Deferred, $timeout, $anchorScroll, hotspotService) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                function drawStart(event) {
                    closeOtherHotspotForms();
                    $scope.hotspot.x = $scope.mouseX;
                    $scope.hotspot.y = $scope.mouseY;
                    $scope.hotspot.width = 0;
                    $scope.hotspot.height = 0;
                    overlay.css({
                        top: $scope.hotspot.y + "px",
                        left: $scope.hotspot.x + "px",
                        width: $scope.hotspot.width + "px",
                        height: $scope.hotspot.height + "px"
                    });
                }
                function draw(event) {
                    var top = $scope.hotspot.y;
                    var left = $scope.hotspot.x;
                    if ($scope.mouseX < left) {
                        overlay.css({
                            left: $scope.mouseX + "px",
                            width: Math.abs(left - $scope.mouseX) + "px"
                        });
                    }
                    if ($scope.mouseX > left) {
                        overlay.css({
                            left: left + "px",
                            width: Math.abs(left - $scope.mouseX) + "px"
                        });
                    }
                    if ($scope.mouseY < top) {
                        overlay.css({
                            top: $scope.mouseY + "px",
                            height: Math.abs(top - $scope.mouseY) + "px"
                        });
                    }
                    if ($scope.mouseY > top) {
                        overlay.css({
                            top: top + "px",
                            height: Math.abs(top - $scope.mouseY) + "px"
                        });
                    }
                }
                function drawStop(event) {
                    var width = overlay.width();
                    var height = overlay.height();
                    if (width >= 10 && height >= 10) {
                        saveHotspotPosition();
                        showHotspotForm();
                    }
                    else {
                        $scope.deleteHotspot($scope.hotspot);
                    }
                    image
                    .off("hotspot:draw:start")
                    .off("hotspot:draw")
                    .off("hotspot:draw:stop");
                }
                function resizeStart(event, ui) {
                    closeOtherHotspotForms();
                    hideHotspotForm();
                }
                function resize(event, ui) {
                    if ($scope.mouseX < ui.position.left) {
                        overlay.css({
                            left: $scope.mouseX + "px",
                            width: Math.abs(ui.originalPosition.left - $scope.mouseX) + "px"
                        });
                    }
                    if ($scope.mouseY < ui.position.top) {
                        overlay.css({
                            top: $scope.mouseY + "px",
                            height: Math.abs(ui.originalPosition.top - $scope.mouseY) + "px"
                        });
                    }
                }
                function resizeStop(event, ui) {
                    saveHotspotPosition();
                    if (!$scope.hotspot.isSaved) {
                        showHotspotForm();
                    }
                    else {
                        $scope.saveHotspot($scope.hotspot, $scope.screen);
                    }
                }
                function dragStart(event, ui) {
                    closeOtherHotspotForms();
                }
                function drag(event, ui) {
                    var width = overlay.width();
                    var height = overlay.height();
                    moveHotspotForm(
                    ui.position.left,
                    ui.position.top,
                    width,
                    height
                    );
                }
                function dragStop(event, ui) {
                    saveHotspotPosition();
                    if (!$scope.hotspot.isSaved) {
                        showHotspotForm();
                    }
                    else {
                        $scope.saveHotspot($scope.hotspot, $scope.screen);
                    }
                }
                function toggleHotspotForm() {
                    if ($scope.hotspot.isHotspotFormVisible) {
                        hideHotspotForm();
                    }
                    else {
                        showHotspotForm();
                    }
                }
                function showHotspotForm() {
                    closeOtherHotspotForms();
                    var width = overlay.width();
                    var height = overlay.height();
                    moveHotspotForm(
                    $scope.hotspot.x * $scope.screen.displayScale,
                    $scope.hotspot.y * $scope.screen.displayScale,
                    width,
                    height
                    );
                    $scope.hotspot.isHotspotFormVisible = true;
                }
                function hideHotspotForm() {
                    $scope.hotspot.isHotspotFormVisible = false;
                }
                function getFirstAppliedTemplate() {
                    return _.find($scope.templates,
                    function (template) {
                        return $scope.isTemplateActiveForScreen(template.id, $scope.screenID);
                    }
                    );
                }
                function saveHotspotPosition() {
                    $scope.hotspot.x = parseInt(overlay.css("left"), 10) / $scope.screen.displayScale;
                    $scope.hotspot.y = parseInt(overlay.css("top"), 10) / $scope.screen.displayScale;
                    $scope.hotspot.width = overlay.width() / $scope.screen.displayScale;
                    $scope.hotspot.height = overlay.height() / $scope.screen.displayScale;
                }
                function moveHotspotForm(x, y, width, height) {
                    var leftPadding = 30;
                    var hotspotTop = y;
                    var hotspotLeft = x;
                    var hotspotWidth = width;
                    var hotspotHeight = height;
                    var imageRight = image.width();
                    var imageOffsetLeft = image.offset().left;
                    var formWidth = 352;
                    var maxRight = $($window).width();
                    if (imageRight > maxRight) {
                        maxRight = imageRight;
                    }
                    var newFormTop = hotspotTop + Math.round(hotspotHeight / 2) - 25;
                    var newFormLeft = hotspotLeft + hotspotWidth + leftPadding;
                    if (newFormLeft + formWidth + imageOffsetLeft >= maxRight) {
                        newFormLeft = hotspotLeft - formWidth - leftPadding;
                        if (newFormLeft + imageOffsetLeft > 5) {
                            $scope.hotspotFormClass = "right";
                        }
                        else {
                            newFormLeft = maxRight - formWidth - imageOffsetLeft - 5;
                            $scope.hotspotFormClass = "left";
                        }
                    }
                    else {
                        $scope.hotspotFormClass = "left";
                    }
                    formContainer.css({
                        "top": newFormTop + "px",
                        "left": newFormLeft + "px"
                    });
                }
                function closeOtherHotspotForms() {
                    _.each($scope.hotspots, function (hotspot) {
                        if ($scope.hotspot !== hotspot) {
                            hotspot.isHotspotFormVisible = false;
                        }
                    });
                }
                function getSelectedTargetOption() {
                    if (
                    ($scope.hotspot.targetTypeID === hotspotService.targetTypes.screen) &&
                    $scope.hotspot.targetScreenID
                    ) {
                        var screenOptions = _.withProperty($scope.targetOptions, "targetTypeID", hotspotService.targetTypes.screen);
                        return (
                        _.findWithProperty(screenOptions, "targetScreenID", $scope.hotspot.targetScreenID)
                        );
                    } else if (
                    $scope.hotspot.targetTypeID &&
                    ($scope.hotspot.targetTypeID !== hotspotService.targetTypes.screen)
                    ) {
                        return (
                        _.findWithProperty($scope.targetOptions, "targetTypeID", $scope.hotspot.targetTypeID)
                        );
                    }
                    return ($scope.targetOptions[0]);
                }
                function getTargetOptions() {
                    var options = [
                    {
                        targetTypeID: 0,
                        targetScreenID: 0,
                        defaultMetaData: {},
                        label: "<b>-----------------------------------------------</b>"
                    },
                    {
                        targetTypeID: 6,
                        targetScreenID: $scope.screenID,
                        defaultMetaData: {
                            scrollOffset: $scope.screenAnchorPosition,
                            isSmoothScroll: false
                        },
                        label: "Another point on this screen"
                    },
                    {
                        targetTypeID: 2,
                        targetScreenID: 0,
                        defaultMetaData: {},
                        label: "Last Screen Visited"
                    },
                    {
                        targetTypeID: 3,
                        targetScreenID: 0,
                        defaultMetaData: {},
                        label: "Previous Screen in Series"
                    },
                    {
                        targetTypeID: 4,
                        targetScreenID: 0,
                        defaultMetaData: {},
                        label: "Next Screen in Series"
                    },
                    {
                        targetTypeID: 5,
                        targetScreenID: 0,
                        defaultMetaData: {
                            url: "http://",
                            isOpenInNewWindow: true
                        },
                        label: "External URL"
                    },
                    {
                        targetTypeID: 0,
                        targetScreenID: 0,
                        defaultMetaData: {},
                        label: "<b>-----------------------------------------------</b>"
                    }
                    ];
                    for (var i = 0 ; i < $scope.displayObjects.length ; i++) {
                        var displayObject = $scope.displayObjects[i];
                        if (displayObject.type == "screenObj") {
                            options.push({
                                targetTypeID: 1,
                                targetScreenID: displayObject.id,
                                label: $scope.getOptionLabel(displayObject)
                            });
                        } else if (displayObject.type == "divider") {
                            options.push({
                                targetTypeID: 1,
                                targetScreenID: 0,
                                label: $scope.getDividerLabel(displayObject.label)
                            });
                        }
                    }
                    options.push({
                        targetTypeID: 1,
                        targetScreenID: screen.id,
                        label: $scope.getOptionLabel(screen)
                    });
                    return (options);
                }
                function sortScreens(screens) {
                    screens.sort(
                    function (a, b) {
                        var nameA = a.name.toLowerCase();
                        var nameB = b.name.toLowerCase();
                        return (nameA < nameB ? -1 : 1);
                    }
                    );
                    return (screens);
                }
                $scope.browseScreens = function () {
                    $scope.showScreenMenu(true, $scope.hotspot.id);
                };
                $scope.getOptionLabel = function (screen) {
                    if (screen.id == $scope.screenID) {
                        return screen.name + " (this screen)";
                    }
                    else {
                        return screen.name;
                    }
                };
                $scope.getDividerLabel = function (dividerLabel) {
                    var numOfCharsTotal = 50;
                    if (dividerLabel.length >= 50) {
                        return dividerLabel;
                    }
                    var numOfDashesOnEachSide = numOfCharsTotal / 2 - dividerLabel.length;
                    var newLabel = "<b>";
                    for (var d = 0; d < numOfDashesOnEachSide; d++) {
                        newLabel += "-";
                    }
                    newLabel += " " + dividerLabel + " ";
                    for (var d = 0; d < numOfDashesOnEachSide; d++) {
                        newLabel += "-";
                    }
                    newLabel += "</b>"
                    return newLabel;
                }
                $scope.onHotspotClick = function (event) {
                    if (isClick) {
                        if (event.shiftKey) {
                            if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.lastScreenVisited) {
                                $scope.navigateToPreviousScreen("build");
                            } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.previousScreenInSort) {
                                $scope.navigateToPreviousScreenInSort();
                            } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.nextScreenInSort) {
                                $scope.navigateToNextScreenInSort();
                            } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.externalUrl) {
                                $scope.navigateToExternalUrl($scope.hotspot.metaData.url, $scope.hotspot.metaData.isOpenInNewWindow);
                            } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.positionOnScreen) {
                                if ($scope.hotspot.metaData.isSmoothScroll) {
                                    var animateTime = 500;
                                } else {
                                    var animateTime = 0;
                                }
                                $("body, html").animate(
                                { scrollTop: $scope.hotspot.metaData.scrollOffset },
                                animateTime
                                );
                            } else {
                                $scope.navigateToScreen($scope.hotspot.targetScreenID, "build");
                            }
                            if (!$scope.hotspot.isScrollTo) {
                                $anchorScroll();
                            }
                        } else {
                            toggleHotspotForm();
                        }
                    }
                    else {
                        isClick = true;
                    }
                };
                $scope.onSaveClick = function (event) {
                    $scope.errorMessage = null;
                    if (!$scope.hotspot.targetTypeID) {
                        $scope.errorMessage = "Please select a Link target.";
                        return;
                    }
                    if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.externalUrl) {
                        if (
                        !$scope.hotspot.metaData.url ||
                        !(/^https?:\/\/.+/i).test($scope.hotspot.metaData.url)
                        ) {
                            $scope.errorMessage = "Please enter a valid URL.";
                            return;
                        }
                    } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.positionOnScreen) {
                        if ($scope.hotspot.metaData.scrollOffset == 0) {
                            $scope.errorMessage = "Please set an Anchor position";
                            return;
                        }
                        $scope.hotspot.isScrollTo = true;
                    } else if ($scope.hotspot.targetTypeID === hotspotService.targetTypes.screen) {
                        if (!$scope.hotspot.targetScreenID) {
                            $scope.errorMessage = "Please select a target screen.";
                            return;
                        }
                    }
                    formWasClosedByExplicitAction = true;
                    hideHotspotForm();
                    if ($scope.hotspot.templateID !== hotspotBackup.templateID) {
                        if ($scope.hotspot.templateID) {
                            $scope.addTemplateToScreen($scope.hotspot.templateID, $scope.screenID, false);
                        }
                    }
                    $scope.setScreenAnchorPosition(0);
                    hotspotBackup = ng.copy($scope.hotspot);
                    var promise = $scope.saveHotspot($scope.hotspot, $scope.screen);
                    promise.then(
                    function () {
                        $scope.hotspot.isSaved = true;
                    }
                    );
                    return (promise);
                };
                $scope.onCancelClick = function (event) {
                    formWasClosedByExplicitAction = true;
                    hideHotspotForm();
                    $scope.errorMessage = null;
                    $scope.hotspot.eventTypeID = hotspotBackup.eventTypeID;
                    $scope.hotspot.targetTypeID = hotspotBackup.targetTypeID;
                    $scope.hotspot.transitionTypeID = hotspotBackup.transitionTypeID;
                    $scope.hotspot.targetScreenID = hotspotBackup.targetScreenID;
                    $scope.hotspot.metaData = hotspotBackup.metaData;
                    $scope.hotspot.templateID = hotspotBackup.templateID;
                    $scope.hotspot.isScrollTo = hotspotBackup.isScrollTo;
                    $scope.hotspot.includeHotspotInTemplate = hotspotBackup.includeHotspotInTemplate;
                    $scope.hotspot.isBottomAligned = hotspotBackup.isBottomAligned;
                    if (!$scope.hotspot.isSaved) {
                        $scope.hotspot.isHotspotVisible = false;
                        $scope.deleteHotspot($scope.hotspot);
                    }
                    $scope.setScreenAnchorPosition(0);
                };
                $scope.onDeleteClick = function (event) {
                    formWasClosedByExplicitAction = true;
                    hideHotspotForm();
                    $scope.deleteHotspot($scope.hotspot);
                    $scope.hotspot.isHotspotVisible = false;
                };
                $scope.onEscapePress = function () {
                    $scope.onCancelClick();
                };
                $scope.showNewTemplateForm = function () {
                    $scope.newTemplate = {
                        projectID: $scope.projectID,
                        name: ""
                    };
                    $scope.isNewTemplateFormVisible = true;
                };
                $scope.createTemplate = function () {
                    if (!$scope.newTemplate.name) {
                        return;
                    }
                    var template = ng.copy($scope.newTemplate);
                    $scope.saveTemplate(template, function () {
                        $scope.templates.push(template);
                        $scope.addTemplateToScreen(template.id, $scope.screenID, false);
                        $scope.isNewTemplateFormVisible = false;
                        $scope.hotspot.templateID = template.id;
                    });
                };
                $scope.$on(
                "hotspot.browse.screen.selected",
                function (event, screenID, hotspotID) {
                    if (
                    $scope.hotspot.isHotspotFormVisible &&
                    ($scope.hotspot.id === hotspotID)
                    ) {
                        $scope.hotspot.targetTypeID = hotspotService.targetTypes.screen;
                        $scope.hotspot.targetScreenID = screenID;
                        $scope.form.selectedTargetOption = getSelectedTargetOption();
                    }
                });
                $scope.$watch(
                "hotspot.screenID",
                function (newValue, oldValue) {
                    if (newValue) {
                        $scope.hotspot.templateID = 0;
                    }
                });
                $scope.$watch(
                "screenAnchorPosition",
                function (newValue, oldValue) {
                    if (!$scope.hotspot.isHotspotFormVisible) {
                        return;
                    }
                    if ($scope.hotspotIDForScreenAnchorSetter == $scope.hotspot.id) {
                        $scope.hotspot.metaData.scrollOffset = $scope.screenAnchorPosition;
                    }
                }
                );
                $scope.$watch("hotspot.includeHotspotInTemplate", function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        $scope.hotspot.templateID = 0;
                    }
                    else if (newValue) {
                        if (_.isUndefined($scope.hotspot.templateID) || $scope.hotspot.templateID === 0) {
                            var firstAppliedTemplate = getFirstAppliedTemplate();
                            if (!_.isUndefined(firstAppliedTemplate)) {
                                $scope.hotspot.templateID = firstAppliedTemplate.id;
                                $scope.hotspot.screenID = 0;
                            }
                        }
                    }
                });
                $scope.$watch("hotspot.templateID", function (newValue, oldValue) {
                    if (newValue && !oldValue) {
                        $scope.hotspot.screenID = 0;
                    }
                    else if (!newValue) {
                        $scope.hotspot.screenID = $scope.screenID;
                    }
                });
                $scope.$watch("hotspot.isHotspotFormVisible", function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    if (newValue) {
                        $scope.form.selectedTargetOption = getSelectedTargetOption();
                        formWasClosedByExplicitAction = false;
                    } else if (!isMoving && !isResizing && !formWasClosedByExplicitAction) {
                        var promise = $scope.onSaveClick();
                        if ($scope.errorMessage) {
                            $scope.onCancelClick();
                        } else if (promise) {
                            promise.then(
                            null,
                            function () {
                                $scope.onCancelClick();
                            }
                            );
                        }
                    }
                });
                $scope.$watch(
                "screens.length",
                function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.targetOptions = getTargetOptions();
                    $scope.form.selectedTargetOption = getSelectedTargetOption();
                }
                );
                $scope.$watch(
                "form.selectedTargetOption",
                function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    if ($scope.hotspot.targetTypeID !== newValue.targetTypeID) {
                        $scope.hotspot.metaData = ng.copy(newValue.defaultMetaData);
                    }
                    $scope.hotspot.targetTypeID = newValue.targetTypeID;
                    $scope.hotspot.targetScreenID = newValue.targetScreenID;
                }
                );
                var image = element.parents(".screen").find(".screenImage");
                var overlay = element.find(".hotspotOverlay");
                var formContainer = element.find(".hotspotSetupContainer");
                var form = element.find(".hotspotSetup");
                var isClick = true;
                var isMoving = false;
                var isResizing = false;
                var hotspotBackup;
                var formWasClosedByExplicitAction = false;
                $scope.hotspotFormClass = "topLeft";
                $scope.hotspot.includeHotspotInTemplate = false;
                $scope.hotspot.isSaved = false;
                $scope.hotspot.isHotspotFormVisible = false;
                $scope.hotspot.isHotspotVisible = true;
                if ($scope.hotspot.id) {
                    $scope.hotspot.isSaved = true;
                }
                $scope.hotspot.includeHotspotInTemplate = !!$scope.hotspot.templateID;
                $scope.targetOptions = getTargetOptions();
                $scope.form = {
                    selectedTargetOption: getSelectedTargetOption()
                };
                $scope.errorMessage = null;
                element.on(
                "mouseup",
                "div.hotspotSetupContainer",
                function (event) {
                    event.stopPropagation();
                }
                );
                if (!$scope.hotspot.eventTypeID) {
                    $scope.hotspot.eventTypeID = 1;
                }
                if (!$scope.hotspot.transitionTypeID) {
                    $scope.hotspot.transitionTypeID = 1;
                }
                hotspotBackup = ng.copy($scope.hotspot);
                overlay.css({
                    top: $scope.hotspot.y + "px",
                    left: $scope.hotspot.x + "px",
                    width: $scope.hotspot.width + "px",
                    height: $scope.hotspot.height + "px"
                });
                overlay.resizable({
                    handles: "se",
                    minWidth: 0,
                    midHeight: 0,
                    start: function (event, ui) {
                        $scope.$apply(function () {
                            isResizing = true;
                            resizeStart(event, ui);
                        });
                    },
                    resize: function (event, ui) {
                        isClick = false;
                        resize(event, ui);
                    },
                    stop: function (event, ui) {
                        $scope.$apply(function () {
                            isResizing = false;
                            resizeStop(event, ui);
                        });
                    }
                }).draggable({
                    start: function (event, ui) {
                        $scope.$apply(function () {
                            isMoving = true;
                            dragStart(event, ui);
                        });
                    },
                    drag: function (event, ui) {
                        isClick = false;
                        drag(event, ui);
                    },
                    stop: function (event, ui) {
                        $scope.$apply(function () {
                            isMoving = false;
                            dragStop(event, ui);
                        });
                    }
                });
                if (!$scope.hotspot.isSaved) {
                    image
                    .on("hotspot:draw:start", function (event) {
                        $scope.$apply(function () {
                            isClick = false;
                            drawStart(event);
                        });
                    })
                    .on("hotspot:draw", function (event) {
                        draw(event);
                    })
                    .on("hotspot:draw:stop", function (event) {
                        $scope.$apply(function () {
                            drawStop(event);
                        });
                    });
                }
            }
        };
    }
})(angular, InVision);
;
;
/*! build-screen.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invBuildScreen", Directive);
    /** @ngInject */
    function Directive($, _, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var image = element.find(".screenImage");
                var tooltip = element.find(".tooltip");
                var timeoutPromise;
                $scope.mouseX = 0;
                $scope.mouseY = 0;
                $scope.showTooltip = false;
                function getMouseY(event) {
                    var mouseCurrentY = event.pageY;
                    var imageY = image.offset().top;
                    return mouseCurrentY - imageY;
                }
                function getMouseX(event) {
                    var mouseCurrentX = event.pageX;
                    var imageX = image.offset().left;
                    return mouseCurrentX - imageX;
                }
                $scope.onMousedown = function (event) {
                    if ($(event.target).is(image)) {
                        $('.dropdown.open .dropdown-toggle').dropdown('toggle');
                        $scope.hotspots.push({
                            id: 0,
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                            screenID: $scope.screenID,
                            targetTypeID: 0,	// Let this be explicitly chosen by the user.
                            targetScreenID: 0,
                            isScrollTo: false,
                            isBottomAligned: false,
                            isHotspotFormVisible: false,
                            isHotspotVisible: false,
                            metaData: {}
                        });
                        $timeout(function () {
                            image.trigger("hotspot:draw:start");
                        });
                        event.preventDefault();
                        return false;
                    }
                };
                $scope.onMouseleave = function (event) {
                    $scope.showTooltip = false;
                };
                $scope.onMousemove = function (event) {
                    $timeout(function () {
                        image.trigger("hotspot:draw");
                    });
                    if ($(event.target).is(".hotspotOverlay")) {
                        $scope.showTooltip = true;
                    }
                    else {
                        $scope.showTooltip = false;
                    }
                    $scope.mouseX = getMouseX(event);
                    $scope.mouseY = getMouseY(event);
                };
                $scope.onMouseup = function (event) {
                    $timeout(function () {
                        image.trigger("hotspot:draw:stop");
                    });
                };
                $scope.getTooltipPosition = function () {
                    return {
                        "top": $scope.mouseY + 20 + "px",
                        "left": $scope.mouseX - 10 + "px"
                    };
                };
                $scope.$watch("showTooltip", function (newValue, oldValue) {
                    if (newValue && !oldValue) {
                        $timeout.cancel(timeoutPromise);
                        timeoutPromise = $timeout(function () {
                            tooltip.fadeIn("fast");
                        }, 100);
                    }
                    else {
                        $timeout.cancel(timeoutPromise);
                        timeoutPromise = $timeout(function () {
                            tooltip.fadeOut("fast");
                        }, 100);
                    }
                });
            }
        };
    }
})(angular, InVision);
;
;
/*! can-use-fullescreen-api.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invCanUseFullscreenApi", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            function init() {
                var targetEl = dom.target.get(0);
                $scope.canUseFullScreenApi = (targetEl.requestFullScreen || targetEl.webkitRequestFullScreen || targetEl.mozRequestFullScreen) !== undefined;
            }
            var dom = {};
            dom.target = $(element);
            var isInitialized = false;
            init();
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! capture-submit.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invCaptureSubmit", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var isEnterKeyEvent = function (event) {
                return (event.which === 13);
            };
            var target = $(element);
            var submitExpression = attributes.invCaptureSubmit;
            target.on(
            "keypress.invCaptureSubmit",
            function (event) {
                if (isEnterKeyEvent(event)) {
                    event.preventDefault();
                    $scope.$apply(submitExpression);
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("keypress.invCaptureSubmit");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! comment-screen.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invCommentScreen", Directive);
    /** @ngInject */
    function Directive($, _, $timeout, $location) {
        return {
            restrict: "A",
            link: function ($scope, element, attrs) {
                function getMouseY(event) {
                    var mouseCurrentY = event.pageY;
                    var imageY = image.offset().top;
                    return mouseCurrentY - imageY;
                }
                function getMouseX(event) {
                    var mouseCurrentX = event.pageX;
                    var imageX = image.offset().left;
                    return mouseCurrentX - imageX;
                }
                var image = element.find(".screenImage");
                image.on(
                "mousedown.invCommentScreen",
                function (event) {
                    if (image.is(event.target) && $scope.isConversationActive() && !$scope.areConversationsDirty()) {
                        $scope.closeAllConversationPanels();
                        $scope.$apply();
                    }
                }
                );
                image.on(
                "mouseup.invCommentScreen",
                function (event) {
                    if (!image.is(event.target) || $scope.isConversationActive()) {
                        return;
                    }
                    $location.path("/console/" + $scope.projectID + "/" + $scope.screenID + "/comments");
                    var x = getMouseX(event) / $scope.screen.displayScale;
                    var y = getMouseY(event) / $scope.screen.displayScale;
                    var isForDevelopment = ($scope.filters.type.value === "dev-notes");
                    $scope.startNewConversation((x - (23 / $scope.screen.displayScale)), (y - (23 / $scope.screen.displayScale)), isForDevelopment);
                    $scope.$apply();
                }
                );
                $scope.$on(
                "$destroy",
                function () {
                    image.off("mousedown.invCommentScreen");
                    image.off("mouseup.invCommentScreen");
                }
                );
            }
        };
    }
})(angular, InVision);
;
;
/*! confirm-popover.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConfirmPopover", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var handleCancelClick = function (event) {
                event.preventDefault();
                target.popover("destroy");
                doc.off("mousedown.invConfirmPopover");
                doc.off("click.invConfirmPopover");
            };
            var handleConfirmClick = function (event) {
                event.preventDefault();
                target.popover("destroy");
                doc.off("mousedown.invConfirmPopover");
                doc.off("click.invConfirmPopover");
                $scope.$apply(confirmExpression);
            };
            var handleDocumentMousedown = function (event) {
                if ($(event.target).closest("div.popover").length) {
                    return;
                }
                target.popover("destroy");
                doc.off("mousedown.invConfirmPopover");
                doc.off("click.invConfirmPopover");
            };
            var doc = $(document);
            var target = $(element);
            var confirmExpression = attributes.onConfirm;
            target.on(
            "click.invConfirmPopover",
            function (event) {
                event.preventDefault();
                target.popover({
                    html: true,
                    placement: "top",
                    trigger: "manual",
                    title: function () {
                        return (attributes.invConfirmPopover);
                    },
                    content: "<a href='#' class='btn btn-primary btn-small invConfirmPopoverConfirm'>&nbsp;Yes&nbsp;</a> &nbsp; <a href='#' class='btn btn-small invConfirmPopoverCancel'>&nbsp;No&nbsp;</a> "
                });
                target.tooltip("hide");
                target.popover("show");
                doc.on("mousedown.invConfirmPopover", handleDocumentMousedown);
                doc.on("click.invConfirmPopover", "a.invConfirmPopoverConfirm", handleConfirmClick);
                doc.on("click.invConfirmPopover", "a.invConfirmPopoverCancel", handleCancelClick);
                return (false);
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("click.invConfirmPopover");
                target.popover("destroy");
                doc.off("mousedown.invConfirmPopover");
                doc.off("click.invConfirmPopover");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! console-build-footer-slider.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive(
    "invConsoleBuildFooterSlider",
    function ($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            if (parseInt($scope.screen.fixedFooterHeight)) {
                $scope.fixedFooterHeight = parseInt($scope.screen.fixedFooterHeight);
            } else {
                $scope.fixedFooterHeight = 0;
            }
            var maxValue = $scope.project.mobileTemplate.viewportHeight * 0.45;
            $(element).parent().css({ height: maxValue + "px" });
            $(element).css({ height: maxValue + "px" });
            $timeout(function () {
                $(element).addClass("noUiSlider");
                $(element).noUiSlider({
                    range: [0, maxValue]
                , start: maxValue - ($scope.fixedFooterHeight * $scope.screen.displayScale)
                , handles: 1
                , orientation: "vertical"
                , step: 1
                , slide: function () {
                    $scope.screen.fixedFooterHeight = parseInt((maxValue - $(this).val()) / $scope.screen.displayScale);
                    $scope.$apply();
                }
                });
            });
            $(element).on("mousedown.consoleFooterSlider", function () {
                $scope.setIsEditingFixedFooterHeight(true);
                $(document).on("mouseup.consoleFooterSlider", function () {
                    $scope.saveFixedFooterHeight($scope.screen);
                    $scope.setIsEditingFixedFooterHeight(false);
                });
            });
            $scope.$watch(
            "screen.fixedFooterHeight",
            function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $(element).val(maxValue - (newValue * $scope.screen.displayScale));
                }
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).remove();
                $(document).off("mouseup.consoleFooterSlider");
            }
            );
        }
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
    );
})(angular, InVision);
;
;
/*! console-build-header-slider.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive(
    "invConsoleBuildHeaderSlider",
    function ($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            if (parseInt($scope.screen.fixedHeaderHeight)) {
                $scope.fixedHeaderHeight = parseInt($scope.screen.fixedHeaderHeight);
            } else {
                $scope.fixedHeaderHeight = 0;
            }
            var maxValue = $scope.project.mobileTemplate.viewportHeight * 0.45;
            $(element).parent().css({ height: maxValue + "px" });
            $(element).css({ height: maxValue + "px" });
            $timeout(function () {
                $(element).addClass("noUiSlider");
                $(element).noUiSlider({
                    range: [0, maxValue]
                , start: ($scope.fixedHeaderHeight * $scope.screen.displayScale)
                , handles: 1
                , orientation: "vertical"
                , slide: function () {
                    $scope.screen.fixedHeaderHeight = parseInt($(this).val() / $scope.screen.displayScale);
                    $scope.$apply();
                }
                });
            });
            $(element).on("mousedown.consoleHeaderSlider", function () {
                $scope.setIsEditingFixedHeaderHeight(true);
                $(document).on("mouseup.consoleHeaderSlider", function () {
                    $scope.saveFixedHeaderHeight($scope.screen);
                    $scope.setIsEditingFixedHeaderHeight(false);
                });
            });
            $scope.$watch(
            "screen.fixedHeaderHeight",
            function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $(element).val(newValue * $scope.screen.displayScale);
                }
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).remove();
                $(document).off("mouseup.consoleHeaderSlider");
            }
            );
        }
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
    );
})(angular, InVision);
;
;
/*! console-catchup-toolbar-helper.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleCatchupToolbarHelper", Directive);
    /** @ngInject */
    function Directive($window, $timeout) {
        var linkFunction = function ($scope, element, attributes) {
            function updateMarkerCapacity() {
                var markerWidth = 35;
                var calloutWidth = 150;
                var hiddenCalloutWidth = 65;
                var filterWidth = 400;
                var windowWidth = win.width();
                var wiggleRoom = 100;
                var minMarkerCount = 10;
                var availableWidth = (windowWidth - calloutWidth - hiddenCalloutWidth - filterWidth - wiggleRoom);
                var markerCapacity = Math.floor(availableWidth / markerWidth);
                $scope.updateUnreadConversationCapacity(
                Math.max(markerCapacity, minMarkerCount)
                );
            }
            var win = $($window).on(
            "resize.invConsoleCatchupToolbarHelper",
            function (event) {
                $scope.$apply(
                function () {
                    updateMarkerCapacity();
                }
                );
            }
            );
            element.on(
            "click.invConsoleCatchupToolbarHelper",
            "a.marker",
            function (event) {
                if ($scope.areConversationsDirty()) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert("Oops, you haven't saved your comment!");
                }
            }
            );
            $timeout(updateMarkerCapacity);
            $scope.$on(
            "$destroy",
            function () {
                win.off("resize.invConsoleCatchupToolbarHelper");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! console-config-menu.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleConfigMenu", Directive);
    /** @ngInject */
    function Directive($, $window, modelEvents) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                element.find(".btn").click(function () {
                    if ($(this).parent().is('.save')) {
                        return;
                    }
                    var group = $(this).closest(".btn-group");
                    $(group).find(".btn").removeClass("enable");
                    $(this).addClass("enable");
                });
                element.find(".swatches > div").each(function () {
                    var color = $(this).html();
                    $(this).css("background-color", color);
                });
                element.find(".swatches > div").click(function () {
                    element.find("#background-color").trigger("change");
                });
                element.find("#background-color").change(function () {
                    var newBackgroundColorDefault = $scope.config.backgroundColor;
                    var newBackgroundColor = "";
                    newBackgroundColor = $(this).val().replace(/[^a-z0-9]/gi, "").substr(0, 6);
                    if (newBackgroundColor.length == 3) {
                        var userGaveUsThisColor = newBackgroundColor;
                        newBackgroundColor = userGaveUsThisColor[0] + userGaveUsThisColor[0];
                        newBackgroundColor += userGaveUsThisColor[1] + userGaveUsThisColor[1];
                        newBackgroundColor += userGaveUsThisColor[2] + userGaveUsThisColor[2];
                    } else if (newBackgroundColor.length < 6) {
                        newBackgroundColor = $scope.config.backgroundColor;
                    }
                    $(this).val(newBackgroundColor);
                    $scope.config.backgroundColor = newBackgroundColor;
                });
                $scope.$on(
                "projectBackgroundUploader:uploaded",
                function (event, background) {
                    var existingIndex = null;
                    _.forEach($scope.backgroundImages,
                    function (value, index) {
                        if (value.id == background.id) {
                            existingIndex = index;
                            return false;
                        }
                    }
                    );
                    if (_.isNull(existingIndex)) {
                        $scope.backgroundImages.push(background);
                    } else {
                        $scope.backgroundImages[existingIndex] = background;
                    }
                    $scope.config.backgroundImage = background;
                    modelEvents.trigger("screenConfig:changed", $scope.config);
                }
                );
            }
        };
    }
})(angular, InVision);
;
;
/*! console-key-bindings.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleKeyBindings", Directive);
    /** @ngInject */
    function Directive($window, $, _, $location) {
        var linkFunction = function ($scope, element, attributes) {
            $($window).on("keydown", function (event) {
                var key = event.which;
                var target = event.target;
                var keyActionMapping = {
                    37: {
                        "description": "left-arrow",
                        "type": "screen-change",
                        "action": "previous"
                    },
                    39: {
                        "description": "right-arrow",
                        "type": "screen-change",
                        "action": "next"
                    },
                    38: {
                        "description": "up-arrow",
                        "type": "version-change",
                        "action": "previous"
                    },
                    40: {
                        "description": "down-arrow",
                        "type": "version-change",
                        "action": "next"
                    },
                    66: {
                        "description": "B",
                        "type": "mode-change",
                        "action": "build"
                    },
                    80: {
                        "description": "P",
                        "type": "mode-change",
                        "action": "preview"
                    },
                    67: {
                        "description": "C",
                        "type": "mode-change",
                        "action": "comments"
                    },
                    72: {
                        "description": "H",
                        "type": "mode-change",
                        "action": "history"
                    },
                    27: {
                        "description": "close-mode",
                        "type": "close",
                        "action": "preview"
                    }
                };
                if (event.metaKey) {
                    return;
                }
                if (!keyActionMapping[key]) {
                    return;
                }
                if (
                (keyActionMapping[key].action === "comments") &&
                (keyActionMapping[key].action === $scope.subview) &&
                $("div.comment-thread:visible").length
                ) {
                    return;
                }
                $scope.$apply(function () {
                    if (!(($(target).is(":input") || $(target).is("div.type_tool") || $scope.isShowingSketchBuilder || $scope.isShowingSketchViewer) && $(target).is(":visible"))) {
                        if (!_.isUndefined(keyActionMapping[key])) {
                            if (keyActionMapping[key].type == "mode-change") {
                                if (keyActionMapping[key].action !== $scope.subview) {
                                    $scope.navigateToScreen($scope.screenID, keyActionMapping[key].action);
                                }
                                else {
                                    $scope.navigateToScreen($scope.screenID, "preview");
                                }
                            }
                            else if (keyActionMapping[key].type == "screen-change") {
                                if (keyActionMapping[key].action === "previous") {
                                    $scope.navigateToPreviousScreenInSort();
                                } else {
                                    $scope.navigateToNextScreenInSort();
                                }
                            }
                            else if (keyActionMapping[key].type === "version-change" && $scope.subview === "history") {
                                if (keyActionMapping[key].action === "previous") {
                                    $scope.previousVersion();
                                } else {
                                    $scope.nextVersion();
                                }
                            }
                            else if (keyActionMapping[key].type === "close") {
                                if ($scope.subview === "comments") {
                                    if ($scope.commentID) {
                                        $scope.navigateToScreen($scope.screenID, "comments");
                                    }
                                    else {
                                        $scope.navigateToScreen($scope.screenID, "preview");
                                    }
                                }
                                else if ($scope.subview === "build") {
                                    var hasOpenHotspots = _.findWithProperty($scope.hotspots, "isHotspotFormVisible", true);
                                    if (hasOpenHotspots) {
                                        element.find("div.hotspotSetup:visible").scope().onEscapePress();
                                    } else {
                                        $scope.navigateToScreen($scope.screenID, "preview");
                                    }
                                }
                                else if ($scope.subview === "history") {
                                    $scope.closeExpandedView();
                                }
                            }
                            event.preventDefault();
                            return false;
                        }
                    }
                });
            });
            $scope.$on(
            "$destroy",
            function () {
                $($window).off("keydown");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! console-loader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleLoader", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            var spinner;
            $timeout(function () {
                var opts = {
                    lines: 11, // The number of lines to draw
                    length: 21, // The length of each line
                    width: 13, // The line thickness
                    radius: 28, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 1.3, // Rounds per second
                    trail: 65, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };
                spinner = new Spinner(opts).spin(element[0]);
            });
            $scope.$watch("isLoading", function (newVal, oldVal) {
                if (newVal == oldVal) {
                    if (newVal == false && oldVal == false) {
                        element.stop(true).fadeOut(300);
                    }
                    return;
                }
                if (newVal == true) {
                    element.stop(true).fadeIn(300);
                } else {
                    element.stop(true).fadeOut(300);
                }
            });
            $scope.$on(
            "$destroy",
            function () {
                spinner.stop();
            }
            );
        }
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! console-replace-screen-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleReplaceScreenUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents) {
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearUploader = function () {
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                $scope.$apply(function () {
                    for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                        if (uploadQueue[i].id == id) {
                            uploadQueue.splice(i, 1);
                            return;
                        }
                    }
                });
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handleMouseOut = function (event) {
                if (isMouseEventRelevant(event, dom.dropzone)) {
                    dom.dropzone.removeClass("hotDropzone");
                }
            };
            var handleMouseOver = function (event) {
                if (isMouseEventRelevant(event, dom.dropzone)) {
                    dom.dropzone.addClass("hotDropzone");
                }
            };
            var handlePluploadComplete = function (uploader, files) {
                $scope.$apply(function () {
                    $scope.isShowingUploader = false;
                });
            };
            var handlePluploadError = function (uploader, error) {
                if (error.status == 422) {
                    var parentScreens = $scope.$parent.screens;
                    var currentScreenId = $scope.screenID;
                    var matchingScreens = _.rejectWithProperty(
                    _.findWithProperty(parentScreens, "clientFilename", error.file.name),
                    "id", currentScreenId
                    );
                    if (matchingScreens.length > 0) {
                        $scope.$parent.openModalWindow("error", "There is another screen with that same name in this project.");
                    } else {
                        $scope.$parent.openModalWindow("error", "There was an error uploading your file.");
                    }
                }
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                for (var i = (files.length - 1) ; i >= 0 ; i--) {
                    if (!isValidFilename(files[i].name)) {
                        files.splice(i, 1);
                    }
                }
                $scope.$apply(function () {
                    for (var i = 0 ; i < files.length ; i++) {
                        addFileToQueue(
                        files[i].id,
                        files[i].name,
                        files[i].size
                        );
                    }
                });
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                $scope.$apply(function () {
                    uploader.removeFile(file);
                    removeFileFromQueue(file.id);
                    var screen = ng.fromJson(response.response);
                    modelEvents.trigger("screenUploaded", screen);
                });
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
                if (isHtml5Runtime) {
                    dom.dropzone.on("mouseover dragenter", handleMouseOver);
                    dom.dropzone.on("mouseout dragleave", handleMouseOut);
                    dom.dropzone
                    .removeClass("flashDropzone")
                    .addClass("html5Dropzone")
                    ;
                } else {
                    dom.target.find("div.plupload.flash").on("mouseover", handleMouseOver);
                    dom.target.find("div.plupload.flash").on("mouseout", handleMouseOut);
                    dom.dropzone
                    .removeClass("html5Dropzone")
                    .addClass("flashDropzone")
                }
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(function () {
                        uploader.start();
                    });
                }
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    setFileProgress(
                    file.id,
                    file.uploaded,
                    file.percent
                    );
                }
                );
            };
            var isMouseEventRelevant = function (event, element) {
                var relatedTarget = event.relatedTarget;
                var target = element;
                if (!relatedTarget) {
                    return (true);
                }
                if (target.is(relatedTarget)) {
                    return (false);
                }
                if (!$.contains(target[0], relatedTarget)) {
                    return (true);
                }
                return (false);
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(bmp|gif|jpe?g|pict|png|tiff|pdf)$/i;
                return (
                pattern.test(name)
                );
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var setFileProgress = function (id, loaded, percent) {
                var queueItem = getQueueItemByID(id);
                queueItem.percentage = percent;
                if (queueItem.state === $scope.fileStates.PENDING) {
                    queueItem.state = $scope.fileStates.UPLOADING;
                }
            };
            var dom = {};
            dom.target = element;
            dom.dropzone = dom.target.find("div.dropzone");
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            var uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                url: "/api/screens",
                multipart_params: {
                    "projectID": $scope.projectID,
                    "screenID": $scope.screenID
                },
                drop_element: "consoleDropzone",
                browse_button: "consoleDropzone",
                container: "consoleDragDropArea",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,pict,png,tiff,pdf"
                }
                ]
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOAIND: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.isShowingUploader = false;
            $scope.$watch(
            "screenID",
            function (newValue) {
                uploader.settings.multipart_params.projectID = $scope.projectID;
                uploader.settings.multipart_params.screenID = $scope.screenID;
            }
            );
            $scope.$watch(
            "isShowingUploader",
            function (newValue, oldValue) {
                $scope.$parent.isScreenReplaceUploaderActive = newValue;
                if (newValue === true) {
                    dom.target
                    .stop(true, true)
                    .fadeIn("fast", refreshUploader);
                    $(window).on(
                    "error.projectUploader",
                    function (event) {
                        if (isFlashRuntime) {
                            return (false);
                        }
                    }
                    );
                } else if (newValue === false) {
                    dom.target
                    .stop(true, true)
                    .fadeOut("fast");
                    clearUploader();
                    $(window).off("error.projectUploader");
                }
            }
            );
            $scope.$on(
            "toggleScreenReplaceUploader",
            function ($event, config) {
                if (!_.isUndefined(config)) {
                    $scope.isShowingUploader = config.showUploader;
                } else {
                    $scope.isShowingUploader = !$scope.isShowingUploader;
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                $(window).off("error.projectUploader");
                dom.target.remove();
            }
            );
            $($window).on("dragenter", function (event) {
                $scope.$apply(function () {
                    if (!$scope.$parent.isScreenMenuActive) {
                        $scope.isShowingUploader = true;
                    }
                });
            });
        };
        return ({
            replace: true,
            templateUrl: "/assets/apps/d/views/directives/console-replace-screen-uploader.htm",
            scope: {
                projectID: "=projectId",
                screenID: "=screenId"
            },
            link: linkFunction
        });
    }
})(angular, InVision);
;
;
/*! console-screen-anchor-setter.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleScreenAnchorSetter", Directive);
    /** @ngInject */
    function Directive($, $window, modelEvents) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            templateUrl: "/assets/apps/d/views/directives/console-screen-anchor-setter.htm",
            link: function ($scope, element, attrs) {
                var overlay = $(element).find(".modalOverlay");
                var anchorSetterModal = $(element).find("#anchorSetterModal");
                var marginTop = 0;
                var marginLeft = 0;
                var cursorAnchor = $(element).find("#cursorAnchor");
                var anchorDottedLine = $(element).find("#anchorDottedLine");
                var anchorCurrentPosition = 0;
                var resizeModal = function () {
                    overlay.css("height", $(window).height());
                    overlay.css("width", $(window).width());
                    var screenImage = $(element).find("img");
                    var screenHeight = $scope.screen.height;
                    var screenWidth = $scope.screen.width;
                    var modalMaxHeight = $(window).height() * .75;
                    var modalMaxWidth = $(window).width() * .85;
                    if (screenHeight < modalMaxHeight) {
                        modalMaxHeight = screenHeight;
                    }
                    if (screenWidth < modalMaxWidth) {
                        modalMaxWidth = screenWidth;
                    }
                    anchorSetterModal.css("height", modalMaxHeight + "px");
                    anchorSetterModal.css("width", modalMaxWidth + "px");
                    marginTop = ($(window).height() - modalMaxHeight) / 2;
                    marginLeft = ($(window).width() - modalMaxWidth) / 2;
                    anchorSetterModal.css("margin-top", marginTop);
                    anchorSetterModal.css("margin-left", marginLeft);
                }
                var positionAnchor = function (e) {
                    var anchorIconSize = 40;
                    var windowScrollOffsetY = $(window).scrollTop();
                    var modalScrollOffsetY = anchorSetterModal.scrollTop();
                    var offsetY = e.pageY * 1 - marginTop + modalScrollOffsetY - windowScrollOffsetY;
                    var offsetX = e.pageX * 1 - (anchorIconSize / 2) - marginLeft;
                    cursorAnchor.css({
                        top: offsetY - (anchorIconSize / 2) + "px",
                        left: offsetX + "px"
                    });
                    anchorDottedLine.css({
                        top: offsetY + "px"
                    });
                    anchorCurrentPosition = offsetY;
                }
                resizeModal();
                $(window).on("resize.anchorSetterModal", resizeModal);
                anchorSetterModal.on("mousemove", function (e) {
                    positionAnchor(e)
                });
                $scope.finalizeAnchorPosition = function () {
                    $scope.setScreenAnchorPosition(parseInt(anchorCurrentPosition));
                    $scope.closeScreenAnchorSetter();
                }
                $scope.$on("$destroy", function () {
                    $(window).off("resize.anchorSetterModal");
                    anchorSetterModal.off("mousemove");
                });
            }
        };
    }
})(angular, InVision);
;
;
/*! console-screen-menu.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleScreenMenu", Directive);
    /** @ngInject */
    function Directive($, $window, $timeout, modelEvents) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var SCROLL_BAR_HEIGHT_ADJUST = 160;
                var SCROLL_BAR_HEIGHT_ADJUST_UPLOADER = SCROLL_BAR_HEIGHT_ADJUST + 190;
                var TEMPLATE_MENU_OFFSET = 50;
                var THUMBNAIL_HEIGHT = 284;
                var screensContainer = element.find(".screens-container");
                var projectScreens = element.find(".project-screens");
                var uploader = screensContainer.find("#projectUploader");
                var padding = SCROLL_BAR_HEIGHT_ADJUST;
                var height = screensContainer.height() - padding;
                var screenResizeTimer = null;
                var tabContent = element.find(".tab-content");
                $scope.searchCriteria = "";
                $scope.predicate = "sort";
                $scope.reverse = false;
                function addScrollbarElements() {
                    projectScreens
                    .wrapInner("<div class='overview'>")
                    .wrapInner("<div class='viewport'>")
                    .prepend("<div unselectable='on' class='scrollbar unselectable'><div class='track'><div class='thumb'><div class='end'></div></div></div></div>");
                }
                function adjustContentHeight(dropdown) {
                    $timeout(function () {
                        var dropdownMenu = dropdown.find(".dropdown-menu");
                        var isDropdownOpen = dropdown.hasClass("open");
                        var isDropdownVisible = dropdownMenu.is(":visible");
                        if (isDropdownOpen && isDropdownVisible) {
                            var dropdownMenuHeight = dropdownMenu.height();
                            var lastScreenBottom = element.find(".screen-item").last().position().top + THUMBNAIL_HEIGHT;
                            var currentScreenBottom = dropdown.parents(".screen-item").position().top + THUMBNAIL_HEIGHT;
                            var templateMenuBottom = currentScreenBottom + dropdownMenuHeight - TEMPLATE_MENU_OFFSET;
                            if (templateMenuBottom > lastScreenBottom) {
                                tabContent.height(templateMenuBottom);
                            }
                        }
                        projectScreens.tinyscrollbar_update("relative");
                    }, 50);
                }
                function addScrollbars() {
                    var scrollHeight = height - 19;
                    if (scrollHeight > 0) {
                        projectScreens.tinyscrollbar({ size: scrollHeight });
                    }
                }
                function resizeViewport() {
                    height = screensContainer.height() - padding;
                    if (height > 0) {
                        projectScreens.find(".viewport").height(height);
                        addScrollbars();
                    }
                }
                function scrollToScreen(screenID, mode) {
                    var TOP_PADDING = 10;
                    var SCREEN_HEIGHT = THUMBNAIL_HEIGHT;
                    if (mode === "list") {
                        SCREEN_HEIGHT = 82;
                    }
                    var overview = element.find(".overview");
                    var viewport = element.find(".viewport");
                    var currentScreen = element.find('#screen' + screenID);
                    var viewportHeight = viewport.height();
                    var viewportOffset = viewport.offset().top;
                    var screenOffset = currentScreen.offset().top;
                    var scrollDistance = screenOffset - viewportOffset - viewportHeight + SCREEN_HEIGHT;
                    if (scrollDistance < 0) {
                        projectScreens.tinyscrollbar_update(0);
                    }
                    else {
                        projectScreens.tinyscrollbar_update(scrollDistance);
                    }
                }
                function toggleTemplateMode() {
                    if ($scope.templateMode) {
                        $scope.deactivateTemplateMode();
                    }
                    else {
                        $scope.activateThumbnailView();
                        $scope.activateTemplateMode();
                    }
                }
                $scope.$watch("isScreenMenuUploaderVisible", function (newValue, oldValue) {
                    if (newValue) {
                        padding = SCROLL_BAR_HEIGHT_ADJUST_UPLOADER;
                    } else {
                        padding = SCROLL_BAR_HEIGHT_ADJUST;
                    }
                    resizeViewport();
                });
                $scope.$watch("screenMenuView", function (newValue, oldValue) {
                    $timeout(function () {
                        resizeViewport();
                        if (newValue !== oldValue) {
                            scrollToScreen($scope.screenID, newValue);
                        }
                    }, 10);
                });
                $scope.$watch("searchCriteria", resizeViewport);
                $scope.$watch("isScreenMenuActive", function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        $scope.deactivateTemplateMode();
                    }
                    if (newValue) {
                        screenResizeTimer = $timeout(function () {
                            resizeViewport();
                        }, 1);
                    }
                });
                $scope.$watch("isListViewActive", function (newValue, oldValue) {
                    if (newValue) {
                        $scope.deactivateTemplateMode();
                    }
                });
                modelEvents.on("screenUploaded", resizeViewport);
                $(window).resize(resizeViewport);
                $scope.$on(
                "$destroy",
                function () {
                    $timeout.cancel(screenResizeTimer);
                    modelEvents.off("screenUploaded");
                    $(window).unbind("resize", resizeViewport);
                }
                );
                element.on("dragenter", function (event) {
                    $scope.$apply(function () {
                        $scope.activateScreenMenuUploader();
                    });
                });
                element.on("click", ".dropdown a", function (event) {
                    var dropdown = $(this).parents(".dropdown");
                    adjustContentHeight(dropdown);
                });
                element.on("mouseenter", ".screen-item", function (event) {
                    var dropdown = $(this).find(".dropdown");
                    adjustContentHeight(dropdown);
                });
                element.on("mouseleave", ".screen-item", function (event) {
                    var dropdown = $(this).find(".dropdown");
                    adjustContentHeight(dropdown);
                });
                addScrollbarElements();
                $scope.toggleTemplateMode = toggleTemplateMode;
                $timeout(function () {
                    scrollToScreen($scope.screenID, "thumbnail");
                }, 100);
            }
        };
    }
})(angular, InVision);
;
;
/*! console-sketch-builder.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleSketchBuilder", Directive);
    /** @ngInject */
    function Directive($, $window, modelEvents) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            templateUrl: "/assets/apps/d/views/directives/console-sketch-builder.htm",
            link: function ($scope, element, attrs) {
                var sketchBuilder_window = $(element).find("#builderWindow");
                var sketch_tool = $(element).find('.sketch_tool');
                var sketchImageWrapper = $(element).find('.sketchImage_wrapper');
                var sketch_image = $(element).find('.sketch_image');
                var top_bar = $(element).find('#sketchToolbar');
                var sketch_toolbar = $(element).find('.tools');
                var init_sketch = function () {
                    sketch_image.on('dragstart', function (event) {
                        event.preventDefault();
                    });
                    sketch_tool.on('click', function (e) {
                        e.preventDefault();
                        sketch_tool.removeClass('active')
                        .filter($(this)).addClass('active');
                    });
                    sketchImageWrapper.onselectstart = function () { return false; }
                    var UndoManager = function () {
                        "use strict";
                        var commandStack = [],
                        index = -1,
                        undoManagerContext = false,
                        callback;
                        function execute(command) {
                            if (!command) {
                                return;
                            }
                            undoManagerContext = true;
                            command.f.apply(command.o, command.p);
                            undoManagerContext = false;
                        }
                        function createCommand(undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg) {
                            return {
                                undo: {
                                    o: undoObj,
                                    f: undoFunc,
                                    p: undoParamsList,
                                    m: undoMsg
                                },
                                redo: {
                                    o: redoObj,
                                    f: redoFunc,
                                    p: redoParamsList,
                                    m: redoMsg
                                }
                            };
                        }
                        return {
                            /*
                            Registers an undo and redo command. Both commands are passed as parameters and turned into command objects.
                            param undoObj: caller of the undo function
                            param undoFunc: function to be called at myUndoManager.undo
                            param undoParamsList: (array) parameter list
                            param undoMsg: message to be used
                            */
                            register: function (undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg) {
                                if (undoManagerContext) {
                                    return;
                                }
                                commandStack.splice(index + 1, commandStack.length - index);
                                commandStack.push(createCommand(undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg));
                                index = commandStack.length - 1;
                                if (callback) {
                                    callback();
                                }
                            },
                            /*
                            Pass a function to be called on undo and redo actions.
                            */
                            setCallback: function (callbackFunc) {
                                callback = callbackFunc;
                            },
                            undo: function () {
                                var command = commandStack[index];
                                if (!command) {
                                    return;
                                }
                                execute(command.undo);
                                index -= 1;
                                if (callback) {
                                    callback();
                                }
                            },
                            redo: function () {
                                var command = commandStack[index + 1];
                                if (!command) {
                                    return;
                                }
                                execute(command.redo);
                                index += 1;
                                if (callback) {
                                    callback();
                                }
                            },
                            /*
                            Clears the memory, losing all stored states.
                            */
                            clear: function () {
                                var prev_size = commandStack.length;
                                commandStack = [];
                                index = -1;
                                if (callback && (prev_size > 0)) {
                                    callback();
                                }
                            },
                            hasUndo: function () {
                                return index !== -1;
                            },
                            hasRedo: function () {
                                return index < (commandStack.length - 1);
                            }
                        };
                    };
                    (function () {
                        'use strict';
                        var sketchIMG_width = sketch_image.width(),
                        sketchIMG_height = sketch_image.height();
                        window.div_paper = sketchImageWrapper;
                        window.paper = new Raphael(div_paper[0], 0, 0);
                        window.stack = {};
                        window.glow_stack = {};
                        window.undo_manager = new UndoManager();
                        paper.setSize(sketchIMG_width, sketchIMG_height);
                        /*
                        div_paper.css({
                        width: sketchIMG_width
                        });
                        */
                        $(element).find("a#undo")
                        .on('click', function (e) {
                            e.preventDefault();
                            if (undo_manager.hasUndo()) undo_manager.undo();
                        });
                        $(element).find("a#redo")
                        .on('click', function (e) {
                            e.preventDefault();
                            if (undo_manager.hasRedo()) undo_manager.redo();
                        });
                        undo_manager.setUndoKeydown = function () {
                            $(document).off('keydown')
                            .on('keydown', function (e) {
                                if (e.keyCode == 8 || e.keyCode == 46) {
                                    e.preventDefault();
                                    if (undo_manager.hasUndo()) undo_manager.undo();
                                }
                            });
                        }
                        undo_manager.setCallback(function () {
                            if (undo_manager.hasUndo()) {
                                $(element).find("a#undo")
                                .removeClass('inactive');
                            } else $(element).find("a#undo")
                            .addClass('inactive');
                            if (undo_manager.hasRedo()) {
                                $(element).find("a#redo")
                                .removeClass('inactive');
                            } else $(element).find("a#redo")
                            .addClass('inactive');
                        });
                        var Sketch = function (o) {
                            if (typeof (o) != 'undefined') $.extend(true, this, o);
                            var $this = this;
                            this.startX = 0;
                            this.startY = 0;
                            this.offset = this.findPos(div_paper);
                            $(window)
                            .resize(function () {
                                $this.offset = $this.findPos(div_paper);
                            });
                            this.el = $(element).find('.sketch_tool');
                        }
                        Sketch.prototype.findPos = function (obj) {
                            obj = obj[0];
                            var curleft = 0,
                            curtop = 0
                            if (obj.offsetParent) {
                                do {
                                    curleft += obj.offsetLeft;
                                    curtop += obj.offsetTop;
                                } while (obj = obj.offsetParent);
                                return [curleft, curtop];
                            } else {
                                return false;
                            }
                        }
                        Sketch.prototype.normalizeContent = function (html, invert) {
                            if (!invert) {
                                html = html.replace(/<div>/gi, '\r\n');
                                html = html.replace(/<\/div>/gi, '');
                                html = html.replace(/(<br\s*\/?>)/gi, "\r\n");
                            } else {
                                html = html.replace(/\r\n/gi, "<br>");
                            }
                            return html;
                        }
                        Sketch.prototype.getCoords = function (event) {
                            event = event || window.event;
                            return {
                                x: event.clientX - $(sketch_image).css("left").replace("px", "") + $(sketchImageWrapper).scrollLeft(),
                                y: event.clientY + $(sketchImageWrapper).scrollTop()
                            };
                        }
                        Sketch.prototype.add_glow = function (el) {
                            /*
                            glow_stack[el.id] = el.glow({
                            color: "#000",
                            width: 2,
                            opacity: 0.3,
                            fill: true,
                            offsety: 2
                            });
                            */
                        }
                        var SketchRectangular = function () {
                            this.figure = null;
                            return new Sketch(this);
                        }
                        SketchRectangular.prototype.redraw = function (event) {
                            var mousePos = rectangular.getCoords(event);
                            var currentX = mousePos.x - rectangular.offset[0];
                            var currentY = mousePos.y - rectangular.offset[1];
                            var width = currentX - rectangular.startX;
                            var height = currentY - rectangular.startY;
                            if (width < 0) {
                                rectangular.figure.attr({
                                    'x': currentX,
                                    'width': width * -1
                                });
                            } else {
                                rectangular.figure.attr({
                                    'x': rectangular.startX,
                                    'width': width
                                });
                            }
                            if (height < 0) {
                                rectangular.figure.attr({
                                    'y': currentY,
                                    'height': height * -1
                                });
                            } else {
                                rectangular.figure.attr({
                                    'y': rectangular.startY,
                                    'height': height
                                });
                            }
                            rectangular.figure.attr({
                                'fill': '#fff',
                                'fill-opacity': 0
                            });
                        }
                        SketchRectangular.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.square')
                            .on('click', function () {
                                div_paper.off();
                                deselectHandObject();
                                undo_manager.setUndoKeydown();
                                hand.wrapper.css({
                                    "cursor": "url('/assets/apps/d/img/cursor-square.png') 23 23,crosshair"
                                });
                                div_paper.on({
                                    mousedown: function (event) {
                                        event.preventDefault();
                                        var mouseCoords = that.getCoords(event);
                                        that.startX = mouseCoords.x - that.offset[0];
                                        that.startY = mouseCoords.y - that.offset[1];
                                        that.figure = paper.rect(that.startX, that.startY, 0, 0, 10)
                                        .attr({
                                            'stroke': '#f74272',
                                            'stroke-width': 4
                                        });
                                        div_paper.on('mousemove', that.redraw);
                                    },
                                    mouseup: function () {
                                        if (that.figure.attr("width") == 0) {
                                            that.figure.remove();
                                            return;
                                        }
                                        if (that.figure) {
                                            that.figure.toFront();
                                            stack[that.figure.id] = that.figure;
                                            undo_manager.register(
                                            that.figure, that.figure.hide, [], 'Hide Rect',
                                            that.figure, that.figure.show, [], 'Show Rect');
                                        }
                                        div_paper.off('mousemove');
                                    }
                                });
                            });
                        }
                        var SketchCircle = function () {
                            this.figure = null;
                            return new Sketch(this);
                        }
                        SketchCircle.prototype.redraw = function (event) {
                            var mousePos = circle.getCoords(event);
                            var currentX = mousePos.x - circle.offset[0];
                            var currentY = mousePos.y - circle.offset[1];
                            var width = currentX - circle.startX;
                            var height = currentY - circle.startY;
                            var size = width > height ? width : height;
                            var size = size / 2;
                            hand.wrapper.css({
                                "cursor": "url('/assets/apps/d/img/cursor-circle.png') 23 23,crosshair"
                            });
                            if (size < 0) {
                                circle.figure.attr({
                                    'cx': circle.startX + size,
                                    'rx': size * -1
                                });
                            } else {
                                circle.figure.attr({
                                    'cx': circle.startX + size,
                                    'rx': size
                                });
                            }
                            if (size < 0) {
                                circle.figure.attr({
                                    'cy': circle.startY + size,
                                    'ry': size * -1
                                });
                            } else {
                                circle.figure.attr({
                                    'cy': circle.startY + size,
                                    'ry': size
                                });
                            }
                        }
                        SketchCircle.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.circle')
                            .on('click', function () {
                                div_paper.off();
                                deselectHandObject();
                                undo_manager.setUndoKeydown();
                                hand.wrapper.css({
                                    "cursor": "url('/assets/apps/d/img/cursor-circle.png') 23 23,crosshair"
                                });
                                div_paper.on({
                                    mousedown: function (event) {
                                        event.preventDefault();
                                        var mouseCoords = that.getCoords(event);
                                        that.startX = mouseCoords.x - that.offset[0];
                                        that.startY = mouseCoords.y - that.offset[1];
                                        that.figure = paper.ellipse(that.startX, that.startY, 0, 0)
                                        .attr({
                                            'fill': '#fff',
                                            'fill-opacity': 0,
                                            'stroke': '#f74272',
                                            'stroke-width': 4
                                        });
                                        div_paper.on('mousemove', that.redraw);
                                    },
                                    mouseup: function () {
                                        if (that.figure.attr("rx") == 0) {
                                            that.figure.remove();
                                            return;
                                        }
                                        if (that.figure) {
                                            stack[that.figure.id] = that.figure;
                                            undo_manager.register(
                                            that.figure, that.figure.hide, [], 'Hide Cirle',
                                            that.figure, that.figure.show, [], 'Show Cirle');
                                            that.figure.toFront();
                                        }
                                        div_paper.off('mousemove');
                                    }
                                });
                            });
                        }
                        var SketchLine = function () {
                            this.figure = null;
                            return new Sketch(this);
                        }
                        SketchLine.prototype.redraw = function (event) {
                            var mousePos = line.getCoords(event);
                            var currentX = mousePos.x - line.offset[0];
                            var currentY = mousePos.y - line.offset[1];
                            line.figure.attr("path", "M" + line.startX + " " + line.startY + "L" + (currentX > 0 ? currentX : 0) + " " + (currentY > 0 ? currentY : 0));
                        }
                        SketchLine.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.line')
                            .on('click', function () {
                                div_paper.off();
                                deselectHandObject();
                                undo_manager.setUndoKeydown();
                                hand.wrapper.css({
                                    "cursor": "url('/assets/apps/d/img/cursor-line.png') 23 23,crosshair"
                                });
                                div_paper.on({
                                    mousedown: function (event) {
                                        event.preventDefault();
                                        var mouseCoords = that.getCoords(event);
                                        that.startX = mouseCoords.x - that.offset[0];
                                        that.startY = mouseCoords.y - that.offset[1];
                                        that.figure = paper.path(["M", that.startX, that.startY, "L"])
                                        .attr({
                                            'stroke': '#f74272',
                                            'stroke-width': 4
                                        });
                                        div_paper.on('mousemove', that.redraw);
                                    },
                                    mouseup: function () {
                                        if (that.figure.getTotalLength() == 0) {
                                            that.figure.remove();
                                            return;
                                        }
                                        if (that.figure) {
                                            stack[that.figure.id] = that.figure;
                                            undo_manager.register(
                                            that.figure, that.figure.hide, [], 'Hide Line',
                                            that.figure, that.figure.show, [], 'Show Line');
                                            that.figure.toFront();
                                        }
                                        div_paper.off('mousemove');
                                    }
                                });
                            });
                        }
                        var SketchArrow = function () {
                            this.figure = null;
                            this.has_arrow = false;
                            return new Sketch(this);
                        }
                        SketchArrow.prototype.redraw = function (event) {
                            var mousePos = arrow.getCoords(event);
                            var currentX = mousePos.x - arrow.offset[0];
                            var currentY = mousePos.y - arrow.offset[1];
                            arrow.figure.attr("path", "M" + arrow.startX + " " + arrow.startY + "L" + (currentX > 0 ? currentX : 0) + " " + (currentY > 0 ? currentY : 0));
                            if (arrow.figure.getTotalLength() > 10 && !arrow.has_arrow) {
                                arrow.figure.attr({
                                    "arrow-end": "classic-wide-long",
                                    "stroke-width": 4,
                                    'stroke': '#f74272'
                                });
                                arrow.has_arrow = true;
                            }
                        }
                        SketchArrow.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.arrow')
                            .on('click', function () {
                                div_paper.off();
                                deselectHandObject();
                                undo_manager.setUndoKeydown();
                                hand.wrapper.css({
                                    "cursor": "crosshair"
                                });
                                div_paper.on({
                                    mousedown: function (event) {
                                        event.preventDefault();
                                        that.has_arrow = false;
                                        var mouseCoords = that.getCoords(event);
                                        that.startX = mouseCoords.x - that.offset[0];
                                        that.startY = mouseCoords.y - that.offset[1];
                                        that.figure = paper.path(["M", that.startX, that.startY, "L"]);
                                        div_paper.on('mousemove', that.redraw);
                                    },
                                    mouseup: function () {
                                        if (that.figure.getTotalLength() === 0) {
                                            that.figure.remove();
                                            return;
                                        }
                                        stack[that.figure.id] = that.figure;
                                        if (that.figure) {
                                            that.figure.toFront();
                                            that.figure.add_glow = true;
                                            that.figure.hide_arrow = arrow.hide_arrow;
                                            that.figure.show_arrow = arrow.show_arrow;
                                            that.figure.move_arrow = arrow.move_arrow;
                                            that.add_glow(that.figure);
                                            undo_manager.register(
                                            that.figure, that.figure.hide_arrow, [], 'Hide Arrow',
                                            that.figure, that.figure.show_arrow, [], 'Show Arrow');
                                        }
                                        div_paper.off('mousemove');
                                    }
                                });
                            });
                        }
                        SketchArrow.prototype.hide_arrow = function () {
                            var glows = glow_stack[this.id];
                            if (typeof (glows) != 'undefined' && glows.length > 0) glows.hide();
                            this.hide();
                        }
                        SketchArrow.prototype.show_arrow = function () {
                            var glows = glow_stack[this.id];
                            if (typeof (glows) != 'undefined' && glows.length > 0) glows.show();
                            this.show();
                        }
                        SketchArrow.prototype.move_arrow = function (position) {
                            var glows = glow_stack[this.id];
                            if (typeof (glows) != 'undefined' && glows.length > 0) glows.remove();
                            this.transform(position);
                            arrow.add_glow(this);
                        }
                        var SketchText = function () {
                            this.figure = null;
                            this.toggle = false;
                            this.editing = false;
                            this.wrapper = $('.sketchImage_wrapper');
                            return new Sketch(this);
                        }
                        SketchText.prototype.write = function (text, startX, startY, height) {
                            window.text.figure = paper.text(startX, startY + height, text)
                            .attr({
                                'font-family': 'Arial',
                                'font-size': '18px',
                                'font-weight': '400',
                                'fill': '#f74272',
                                "text-anchor": "start",
                                "margin-top": "10px"
                            });
                            undo_manager.register(
                            window.text.figure, window.text.figure.hide, [], 'Hide Text',
                            window.text.figure, window.text.figure.show, [], 'Show Text');
                        }
                        SketchText.prototype.alignTop = function (t) {
                            var b = t.getBBox();
                            var h = Math.abs(b.y2) - Math.abs(b.y) + 1;
                            t.attr({
                                'y': b.y + h
                            });
                        }
                        SketchText.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.text')
                            .on('click', function () {
                                div_paper.off();
                                that.wrapper.off();
                                deselectHandObject();
                                $(document).off('keydown');
                                hand.wrapper.css({
                                    "cursor": "text"
                                });
                                that.wrapper.on('click', function (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if (that.editing) return;
                                    if (that.toggle) {
                                        that.toggle = false;
                                        return;
                                    } else that.toggle = true;
                                    var mouseCoords = that.getCoords(event);
                                    var startX = mouseCoords.x - that.offset[0] - 2;
                                    var startY = mouseCoords.y - that.offset[1] - 12;
                                    $('<div contenteditable="true" class="type_tool"></div>')
                                    .appendTo($(this))
                                    .css({
                                        top: startY,
                                        left: startX
                                    })
                                    .focus()
                                    .on('blur', function (e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        var $this = $(this),
                                        text = that.normalizeContent($this.html(), false);
                                        if (!text.trim()) {
                                            $this.remove();
                                            return;
                                        }
                                        that.write(text, startX, startY, 9);
                                        stack[that.figure.id] = that.figure;
                                        $this.remove();
                                        that.figure.click(function () {
                                            if (hand.move_tool) return;
                                            that.editing = true;
                                            var el = this;
                                            var html = that.normalizeContent(this.attr('text'), true);
                                            var obj = this.getBBox();
                                            var x = obj.x;
                                            var y = obj.y;
                                            this.hide();
                                            $('<div contenteditable="true" class="type_tool">' + html + '</div>')
                                            .appendTo(that.wrapper)
                                            .css({
                                                top: y,
                                                left: x
                                            })
                                            .focus()
                                            .on('blur', function (e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                var $this = $(this),
                                                text = $this.html();
                                                that.editing = false;
                                                that.toggle = true;
                                                if (!text.trim()) {
                                                    text = html;
                                                }
                                                undo_manager.register(
                                                el, el.attr, ['text', el.attr('text')], 'Undo Text',
                                                el, el.attr, ['text', text], 'Redo Text');
                                                el.attr('text', that.normalizeContent(text, false));
                                                el.show();
                                                $this.remove();
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        var SketchHand = function () {
                            this.figure = null;
                            this.selected = false;
                            this.set = paper.set();
                            this.wrapper = sketchImageWrapper;
                            return new Sketch(this);
                        }
                        SketchHand.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.move')
                            .on({
                                click: function () {
                                    that.move_tool = true;
                                    that.wrapper.off();
                                    deselectHandObject();
                                    $(document).off('keydown')
                                    .on('keydown', that.deleteKey);
                                    hand.wrapper.css({
                                        "cursor": "default"
                                    });
                                    $(element).off('keydown');
                                    $(element).find("a#delete").off();
                                    that.set = paper.set();
                                    for (var k in stack) {
                                        that.set.push(stack[k]);
                                    }
                                    that.set.drag(that.move, that.start, that.up);
                                    that.set.hover(that.hoverIn, that.hoverOut);
                                    that.set.click(that.clickIn);
                                    that.wrapper.on('click', that.clickOut);
                                    $("a#delete")
                                    .on('click', that.deleteKey);
                                }
                            });
                            this.el.on({
                                click: function () {
                                    if (!$(this).hasClass('move')) {
                                        that.move_tool = false;
                                        that.set.undrag();
                                        that.set.unhover(that.hoverIn, that.hoverOut);
                                    }
                                }
                            });
                        }
                        SketchHand.prototype.clickIn = function () {
                            deselectHandObject();
                            this.dx = this.attr("dx");
                            this.dy = this.attr("dy");
                            hand.selected = this;
                            $(element).find("a#delete")
                            .removeClass('inactive');
                            this.attr({
                                'stroke': '#00aeef'
                            });
                        }
                        SketchHand.prototype.deleteKey = function (e) {
                            if (e.keyCode == 8 || e.keyCode == 46 || e.type == "click") {
                                e.preventDefault();
                                undo_manager.register(
                                hand.selected, (hand.selected.show_arrow) ? hand.selected.show_arrow : hand.selected.show, [], 'Show Object',
                                hand.selected, (hand.selected.hide_arrow) ? hand.selected.hide_arrow : hand.selected.hide, [], 'Hide Object');
                                if (hand.selected.hide_arrow) hand.selected.hide_arrow();
                                else hand.selected.hide();
                                $(element).find("a#delete").addClass('inactive');
                            }
                        }
                        SketchHand.prototype.clickOut = function (e) {
                            if (e.target.nodeName === 'svg' && hand.selected) {
                                if (hand.selected.node.nodeName === "text") {
                                    hand.selected.attr({
                                        'fill': '#f74272',
                                        'fill-opacity': 1,
                                        'stroke': 'none'
                                    });
                                } else {
                                    hand.selected.attr({
                                        'fill': '#fff',
                                        'fill-opacity': 0,
                                        'stroke': '#f74272'
                                    });
                                }
                                $(element).find("a#delete")
                                .addClass('inactive');
                            } else if (e.target.nodeName === "tspan") {
                                hand.selected.attr({
                                    'fill': '#00aeef',
                                    'fill-opacity': 1,
                                    'stroke': '#00aeef'
                                });
                            }
                        }
                        SketchHand.prototype.start = function () {
                            deselectHandObject();
                            this.attr({
                                'stroke': '#00aeef'
                            })
                            this.dx = this.attr("dx");
                            this.dy = this.attr("dy");
                            this.previous_pos = this.transform()
                            .toString();
                            hand.wrapper.css({
                                "cursor": "move"
                            });
                            this.unhover(hand.hoverIn, hand.hoverOut);
                            var glows = glow_stack[this.id];
                            if (typeof (glows) != 'undefined' && glows.length > 0) glows.remove();
                        }
                        SketchHand.prototype.move = function (dx, dy) {
                            this.translate(dx - this.dx, dy - this.dy);
                            this.dx = dx;
                            this.dy = dy;
                        }
                        SketchHand.prototype.up = function () {
                            this.attr({
                                'fill': '#f74272',
                                'fill-opacity': 0,
                                'stroke': '#f74272'
                            });
                            hand.wrapper.css({
                                "cursor": "default"
                            });
                            this.hover(hand.hoverIn, hand.hoverOut);
                            if (this.add_glow) hand.add_glow(this);
                            if (this.previous_pos !== this.transform()
                            .toString()) undo_manager.register(
                            this, (this.move_arrow) ? this.move_arrow : this.transform, [this.previous_pos], 'Previous Position',
                            this, (this.move_arrow) ? this.move_arrow : this.transform, [this.transform()
                            .toString()], 'Current Position');
                        }
                        SketchHand.prototype.hoverIn = function () {
                            hand.wrapper.css({
                                cursor: 'move'
                            });
                        };
                        SketchHand.prototype.hoverOut = function () {
                            hand.wrapper.css({
                                cursor: "default"
                            });
                        }
                        var SketchPencil = function () {
                            this.figure = null;
                            this.wrapper = sketchImageWrapper;
                            this.pathString = null;
                            this.startX = 0;
                            this.startY = 0;
                            return new Sketch(this);
                        }
                        SketchPencil.prototype.redraw = function (event) {
                            var mousePos = pencil.getCoords(event);
                            var currentX = mousePos.x - pencil.offset[0];
                            var currentY = mousePos.y - pencil.offset[1];
                            pencil.pathString += 'l' + (currentX - pencil.startX) + ' ' + (currentY - pencil.startY);
                            pencil.figure.attr('path', pencil.pathString);
                            pencil.startX = currentX;
                            pencil.startY = currentY;
                        }
                        SketchPencil.prototype.draw = function () {
                            var that = this;
                            this.el.filter('.pencil')
                            .on('click', function () {
                                that.set = paper.set();
                                div_paper.off();
                                that.wrapper.off();
                                deselectHandObject();
                                undo_manager.setUndoKeydown();
                                hand.wrapper.css({
                                    "cursor": "url('/assets/apps/d/img/cursor-pen.png') 23 23,crosshair"
                                });
                                that.wrapper.on('mousedown', function (event) {
                                    event.preventDefault();
                                    var mouseCoords = that.getCoords(event);
                                    that.startX = mouseCoords.x - that.offset[0];
                                    that.startY = mouseCoords.y - that.offset[1];
                                    that.pathString = 'M' + that.startX + ' ' + that.startY + 'l0 0';
                                    that.figure = paper.path(that.pathString);
                                    stack[that.figure.id] = that.figure;
                                    that.figure.attr({
                                        'stroke': '#f74272',
                                        'stroke-linecap': 'round',
                                        'stroke-linejoin': 'round',
                                        'stroke-width': 4
                                    });
                                    that.wrapper.on('mousemove', that.redraw);
                                });
                                that.wrapper.on('mouseup', function () {
                                    if (that.figure) {
                                        that.figure.toFront();
                                        undo_manager.register(
                                        that.figure, that.figure.hide, [], 'Hide Pencil',
                                        that.figure, that.figure.show, [], 'Show Pencil');
                                    }
                                    div_paper.off('mousemove');
                                });
                            });
                        }
                        window.rectangular = new SketchRectangular();
                        rectangular.draw();
                        window.circle = new SketchCircle();
                        circle.draw();
                        window.line = new SketchLine();
                        line.draw();
                        window.arrow = new SketchArrow();
                        arrow.draw();
                        window.text = new SketchText();
                        text.draw();
                        window.hand = new SketchHand();
                        hand.draw();
                        window.pencil = new SketchPencil();
                        pencil.draw();
                    })();
                    $(element).find("#pencil").click();
                    sizeSketchBuilder();
                } // end init_sketch()
                var deselectHandObject = function () {
                    if (hand && hand.selected) {
                        if (hand.selected.node.nodeName === "text") {
                            hand.selected.attr({
                                'fill': '#f74272',
                                'fill-opacity': 1,
                                'stroke': 'none'
                            });
                        } else {
                            hand.selected.attr({
                                'stroke': '#f74272',
                                'fill': '#f74272'
                            });
                        }
                    }
                }
                var sizeSketchBuilder = function () {
                    var width = sketch_image.width();
                    if (width < 400) {
                        $(sketch_image).css({ left: (400 - width) / 2 })
                        width = 400;
                    }
                    if (width > $(window).width()) {
                        width = $(window).width() - 40;
                    }
                    var height = $(window).height() - 200;
                    $(sketchBuilder_window).css("width", width + 28)
                    .css("height", height)
                    .css("top", 75);
                    $(sketchImageWrapper).css("width", width);
                    $(sketchImageWrapper).css("height", height - 76);
                }
                $scope.saveSketch = function () {
                    deselectHandObject();
                    var svg_string = window.paper.toSVG();
                    var $svg = $.parseXML(svg_string);
                    var numOfSketchElements = $($svg).find("svg").children().size();
                    if (numOfSketchElements == 0) {
                        $scope.openModalWindow("error", "Your sketch is empty.  There's nothing to save.");
                        return;
                    }
                    var sketch = {
                        tempID: $scope.tempSketches.length + 1,
                        screenID: $scope.screenID,
                        svg: svg_string
                    }
                    $scope.tempSketches.push(sketch);
                    $scope.hideSketchBuilder();
                }
                setTimeout(init_sketch, 220);
                $(sketch_image).on("load", sizeSketchBuilder);
                $(window).on("resize.sketchBuilderModal", sizeSketchBuilder);
                $scope.$on("$destroy", function () {
                    $(window).off("resize.sketchBuilderModal");
                    $(document).off('keydown');
                });
            }
        };
    }
})(angular, InVision);
;
;
/*! console-sketch-viewer.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleSketchViewer", Directive);
    /** @ngInject */
    function Directive($, $window, modelEvents) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            templateUrl: "/assets/apps/d/views/directives/console-sketch-viewer.htm",
            link: function ($scope, element, attrs) {
                var resizeSketchViewer = function () {
                    var overlay = $(element).find('.modalOverlay');
                    overlay.css("height", $(window).height());
                    overlay.css("width", $(window).width());
                    var sketchViewerWindow = $(element).find(".sketchViewer");
                    var sketchImageContainer = $(sketchViewerWindow).find(".imageContainer");
                    var sketchImage = $(sketchImageContainer).find("img");
                    var tempSketchOverlay = $(sketchViewerWindow).find(".tempSketchOverlay");
                    var tempSketchSVG = $(tempSketchOverlay).find("svg");
                    var sketchHeight = $scope.screen.height;
                    var sketchWidth = $scope.screen.width;
                    var viewerMaxHeight = $(window).height() * .75;
                    var viewerMaxWidth = $(window).width() * .85;
                    if (sketchHeight < viewerMaxHeight) {
                        viewerMaxHeight = sketchHeight;
                    }
                    if (sketchWidth < viewerMaxWidth) {
                        viewerMaxWidth = sketchWidth;
                    } else {
                        sketchImage.css("width", viewerMaxWidth + "px");
                    }
                    sketchViewerWindow.css("height", viewerMaxHeight + "px");
                    sketchViewerWindow.css("width", viewerMaxWidth);
                    var marginTop = ($(window).height() - viewerMaxHeight) / 2;
                    var marginLeft = ($(window).width() - viewerMaxWidth) / 2;
                    sketchViewerWindow.css("margin-top", marginTop);
                    sketchViewerWindow.css("margin-left", marginLeft);
                }
                resizeSketchViewer();
                $(window).on("resize.sketchViewerModal", resizeSketchViewer);
                $scope.$on("$destroy", function () {
                    $(window).off("resize.sketchViewerModal");
                });
            }
        };
    }
})(angular, InVision);
;
;
/*! console-template-bar.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConsoleTemplateBar", Directive);
    /** @ngInject */
    function Directive($, _, $timeout, templateService, Deferred) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                $scope.addNewTemplate = function () {
                    $scope.stopEditingAllTemplateNames();
                    $scope.templates.push({
                        isEditing: true,
                        name: "",
                        id: 0,
                        projectID: $scope.projectID,
                        screens: []
                    });
                    $scope.$broadcast("templateAdded");
                };
                $scope.stopEditingAllTemplateNames = function () {
                    _.each($scope.templates, function (template) {
                        if (template.originalName) {
                            template.name = template.originalName;
                            template.isEditing = false;
                        }
                    });
                };
                $scope.editTemplateName = function (template) {
                    $scope.stopEditingAllTemplateNames();
                    template.originalName = template.name;
                    template.isEditing = true;
                };
                $scope.save = function (template) {
                    if (!template.name) {
                        return;
                    }
                    var isNewTemplate = !template.id;
                    template.isEditing = false;
                    template.originalName = template.name;
                    $scope.saveTemplate(template, function () {
                        if (isNewTemplate) {
                            $scope.addTemplateToScreen(template.id, $scope.screenID, false);
                        }
                    });
                };
            }
        };
    }
})(angular, InVision);
;
;
/*! conversation-marker.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invConversationMarker", Directive);
    /** @ngInject */
    function Directive($, _, $location, $window, $timeout, Deferred, conversationService, sessionService, modelEvents, projectService, userService) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                $scope.cancelEditingComment = function (comment) {
                    comment.isEditing = false;
                    if (comment.originalComment) {
                        comment.comment = comment.originalComment;
                    }
                };
                $scope.closeConversationPanel = function () {
                    $scope.newComment = "";
                    $scope.notifyOthers = "";
                    $scope.isCommentInputVisible = false;
                    $scope.isNotifySettingsVisible = false;
                    $scope.clearCommentSketches();
                    $scope.closeAllConversationPanels();
                    $location.path('/console/' + $scope.projectID + "/" + $scope.screenID + "/comments");
                };
                $scope.deleteComment = function (comment) {
                    conversationService.deleteComment(comment);
                    $scope.marker.comments = _.rejectWithProperty($scope.marker.comments, "id", comment.id);
                };
                $scope.deleteSketch = function (sketchID) {
                    conversationService.deleteSketch(sketchID);
                    for (var c = 0; c < $scope.marker.comments.length; c++) {
                        $scope.marker.comments[c].sketches = _.rejectWithProperty($scope.marker.comments[c].sketches, "id", sketchID);
                    }
                };
                $scope.editComment = function (comment, event) {
                    $scope.stopEditingComments();
                    comment.isEditing = true;
                    comment.originalComment = comment.comment;
                };
                $scope.getNotifyCount = function () {
                    var count = 0;
                    _.each($scope.projectMembers, function (user) {
                        if (user.isNotify) {
                            count++;
                        }
                    });
                    if (!$scope.marker.isForDevelopment && !$scope.marker.isPrivate) {
                        _.each($scope.projectStakeholders, function (user) {
                            if (user.isNotify) {
                                count++;
                            }
                        });
                    }
                    if ($scope.notifyOthers) {
                        var others = $scope.notifyOthers.split(",");
                        count += others.length;
                    }
                    return count;
                };
                $scope.getMarkerClass = function () {
                    if ($scope.marker.isForDevelopment) {
                        if (!$scope.marker.isComplete) {
                            return "development";
                        }
                        else {
                            return "complete development";
                        }
                    }
                    else if ($scope.marker.isComplete) {
                        return "complete";
                    }
                    else {
                        return "conversation";
                    }
                };
                $scope.hideDeleteConfirmation = function (comment) {
                    (comment || $scope).isDeleting = false;
                };
                $scope.isStakeholdersShowing = function () {
                    var isStakeholdersListEmpty = !$scope.projectStakeholders.length;
                    if ($scope.marker.isPrivate ||
                    $scope.marker.isForDevelopment ||
                    isStakeholdersListEmpty) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                $scope.onMarkerClick = function () {
                    if (hasDragged) {
                        hasDragged = false;
                        if ($scope.marker.isSaved === false) {
                            $scope.marker.isConversationPanelVisible = true;
                        }
                    } else if ($scope.areConversationsDirty()) {
                        alert("Oops, you haven't saved your comment!");
                    } else if ($scope.marker.isConversationPanelVisible) {
                        $scope.closeConversationPanel();
                    } else {
                        $scope.clearCommentSketches();
                        $location.path("/console/" + $scope.projectID + "/" + $scope.screenID + "/comments/" + $scope.marker.id);
                    }
                };
                $scope.saveComment = function (comment) {
                    if (!comment.comment && !$scope.tempSketches.length) {
                        return;
                    }
                    if (submissionInProgress) {
                        return;
                    }
                    submissionInProgress = true;
                    var isNewConversation = !$scope.marker.isSaved;
                    comment.isEditing = false;
                    comment.originalComment = comment.comment;
                    comment.html = conversationService.getHtmlForComment(comment.comment);
                    if ($scope.marker.isSaved) {
                        save($scope.marker.id);
                    } else {
                        $scope.saveConversation($scope.marker, save);
                    }
                    function save(conversationID) {
                        $scope.closeAllConversationPanels();
                        $location.path('/console/' + $scope.projectID + "/" + $scope.screenID + "/comments");
                        if (comment.id) {
                            var notify = {
                                members: [],
                                stakeholders: [],
                                others: [],
                                unsubscribe: []
                            };
                        } else {
                            var memberIDs = _.filterWithProperty($scope.projectMembers, "isNotify", true);
                            var stakeholderIDs = _.filterWithProperty($scope.projectStakeholders, "isNotify", true);
                            var notify = {
                                members: _.pluck(memberIDs, "id"),
                                stakeholders: _.pluck(stakeholderIDs, "id"),
                                others: [],
                                unsubscribe: []
                            };
                            var membersToUnsubscribe = _.filterWithProperty($scope.projectMembers, "isNotify", false);
                            var stakeholdersToUnsubscribe = _.filterWithProperty($scope.projectStakeholders, "isNotify", false);
                            notify.unsubscribe = _.pluck(membersToUnsubscribe, "id");
                            notify.unsubscribe = notify.unsubscribe.concat(_.pluck(stakeholdersToUnsubscribe, "id"));
                            if ($scope.notifyOthers) {
                                notify.others = $scope.notifyOthers.split(",");
                            }
                            if (isNewConversation) {
                                $scope.setDefaultUserIDs(
                                notify.members.concat(notify.stakeholders)
                                );
                            }
                        }
                        comment.notify = notify;
                        comment.conversationID = conversationID;
                        Deferred.handlePromise(
                        conversationService.saveComment(comment),
                        function (savedComment) {
                            submissionInProgress = false;
                            if (!comment.id) {
                                $scope.marker.comments.push(savedComment);
                                savedComment.userInitials = userService.getInitials(savedComment.userName);
                                savedComment.userHasSystemAvatar = userService.isSystemAvatar(savedComment.avatarID);
                                savedComment.html = conversationService.getHtmlForComment(savedComment.comment);
                                modelEvents.trigger("console:comment:saved",
                                { "comment": savedComment, "screenID": $scope.screenID }
                                );
                            }
                            $scope.marker.subscribers = notify.members.concat(notify.stakeholders);
                            if (notify.others.length) {
                                var promise = $scope.loadStakeholders();
                                promise.then(
                                function (stakeholders) {
                                    var newUserIDs = [];
                                    _.each(
                                    stakeholders,
                                    function (stakeholder) {
                                        if (
                                        _.contains($scope.marker.subscribers, stakeholder.id) ||
                                        _.contains(notify.unsubscribe, stakeholder.id)
                                        ) {
                                            return;
                                        }
                                        newUserIDs.push(stakeholder.id);
                                    }
                                    );
                                    if (!newUserIDs.length) {
                                        return;
                                    }
                                    $scope.marker.subscribers = $scope.marker.subscribers.concat(newUserIDs);
                                    if (isNewConversation) {
                                        $scope.setDefaultUserIDs(
                                        notify.members.concat(notify.stakeholders).concat(newUserIDs)
                                        );
                                    }
                                }
                                );
                            }
                            $scope.newComment = "";
                            $scope.clearCommentSketches();
                            $scope.isCommentInputVisible = false;
                            $scope.notifyOthers = "";
                        },
                        function () {
                            submissionInProgress = false;
                        }
                        );
                    }
                };
                $scope.setTypeAsComment = function () {
                    $scope.marker.isForDevelopment = false;
                };
                $scope.setTypeAsDevNote = function () {
                    $scope.marker.isForDevelopment = true;
                    _.setProperty($scope.projectStakeholders, "isNotify", false);
                    $scope.notifyOthers = "";
                };
                $scope.showCommentInput = function () {
                    $scope.isCommentInputVisible = true;
                    $timeout(function () {
                        element.find("textarea").focus();
                    });
                };
                $scope.stopEditingComments = function () {
                    _.each($scope.marker.comments, function (comment) {
                        $scope.cancelEditingComment(comment);
                    });
                };
                $scope.toggleIsPrivate = function () {
                    if ($scope.marker.isPrivate) {
                        $scope.marker.isPrivate = false;
                    }
                    else {
                        $scope.marker.isPrivate = true;
                        _.setProperty($scope.projectStakeholders, "isNotify", false);
                        $scope.notifyOthers = "";
                    }
                };
                $scope.scrollToMarker = function () {
                    if (!isScrolledIntoView(element.find(".marker"))
                    || !isScrolledIntoView(element.find(".comment-thread"))) {
                        $('html,body').stop().animate(
                        {
                            scrollTop: $scope.marker.y - 100,
                            scrollLeft: $scope.marker.x - 100
                        },
                        500
                        );
                    }
                };
                $scope.showDeleteConfirmation = function (comment, isFirstComment) {
                    if (isFirstComment) {
                        $scope.isDeleting = true;
                    } else {
                        comment.isDeleting = true;
                    }
                };
                $scope.removeStakeholder = function (stakeholder) {
                    $('html,body').stop().animate(
                    {
                        scrollTop: ($scope.marker.y / $scope.screen.displayScale) - 100,
                        scrollLeft: ($scope.marker.x / $scope.screen.displayScale) - 100
                    },
                    500
                    );
                    projectService.removeStakeholderFromProject($scope.projectID, stakeholder.id);
                };
                function moveConversationPanelPosition(x, y) {
                    var leftPadding = 15;
                    var markerTop = y;
                    var markerLeft = x;
                    var markerWidth = 49;
                    var markerHeight = 49;
                    var imageWidth = image.width();
                    var imageOffsetLeft = image.offset().left;
                    var formWidth = element.find(".comment-thread").width();
                    var maxRight = Math.max(imageWidth, $($window).width());
                    var newFormTop = (markerTop * $scope.screen.displayScale) + Math.round(markerHeight / 2) - 25;
                    var newFormLeft = (markerLeft * $scope.screen.displayScale) + markerWidth + leftPadding;
                    if (newFormLeft + formWidth + imageOffsetLeft >= maxRight) {
                        $scope.conversationPanelClass = "right";
                    }
                    else {
                        $scope.conversationPanelClass = "left";
                    }
                    formContainer.css({
                        "top": newFormTop + "px",
                        "left": newFormLeft + "px"
                    });
                }
                function isScrolledIntoView(elem) {
                    var docView = {
                        "top": $($window).scrollTop(),
                        "bottom": $($window).scrollTop() + $($window).height() - 60,
                        "left": $($window).scrollLeft(),
                        "right": $($window).scrollLeft() + $($window).width()
                    };
                    var item = {
                        "top": $(elem).offset().top,
                        "bottom": $(elem).offset().top + $(elem).height(),
                        "left": $(elem).offset().left,
                        "right": $(elem).offset().left + $(elem).width()
                    };
                    return (
                    (item.bottom >= docView.top) &&
                    (item.top <= docView.bottom) &&
                    (item.bottom <= docView.bottom) &&
                    (item.top >= docView.top) &&
                    (item.left >= docView.left) &&
                    (item.right <= docView.right)
                    );
                }
                function dragStart(event, ui) {
                }
                function drag(event, ui) {
                    var x = ui.position.left;
                    var y = ui.position.top;
                    moveConversationPanelPosition(x, y);
                    hasDragged = true;
                }
                function dragStop(event, ui) {
                    var x = ui.position.left / $scope.screen.displayScale;
                    var y = ui.position.top / $scope.screen.displayScale;
                    $scope.marker.x = x;
                    $scope.marker.y = y;
                    if ($scope.marker.isSaved) {
                        $scope.saveConversation($scope.marker);
                    }
                }
                function updateConversation(conversationID) {
                    Deferred.handlePromise(
                    conversationService.getConversation(conversationID),
                    function (updatedConversation) {
                        _.each(updatedConversation.comments, function (comment) {
                            comment.html = conversationService.getHtmlForComment(comment.comment);
                        });
                        _.assign($scope.marker, updatedConversation);
                        moveConversationPanelPosition($scope.marker.x, $scope.marker.y);
                        if ($scope.isCommentInputVisible) {
                            $timeout(function () {
                                formContainer.find(".post-new-comment textarea").focus();
                            });
                        }
                    },
                    function () { }
                    );
                }
                function addComment(commentID) {
                    var commentExists = _.findWithProperty($scope.marker.comments, "id", commentID);
                    if (!commentExists) {
                        Deferred.handlePromise(
                        conversationService.getComment(commentID),
                        function (comment) {
                            comment.html = conversationService.getHtmlForComment(comment.comment);
                            $scope.marker.comments.push(comment);
                            if (comment.isUnread) {
                                $scope.marker.isUnread = true;
                                $scope.$emit("conversationsChanged");
                            }
                        },
                        function () { }
                        );
                    }
                }
                function updateComment(commentID) {
                    var comment = _.findWithProperty($scope.marker.comments, "id", commentID);
                    if (comment) {
                        Deferred.handlePromise(
                        conversationService.getComment(commentID),
                        function (updatedComment) {
                            if (comment.comment !== updatedComment.comment) {
                                _.assign(comment, updatedComment);
                                comment.originalComment = updatedComment.originalComment;
                            }
                        },
                        function () { }
                        );
                    }
                }
                function deleteComment(commentID) {
                    $scope.marker.comments = _.rejectWithProperty($scope.marker.comments, "id", commentID);
                }
                function handleCommentAdded(event, commentID, conversationID) {
                    if (conversationID === $scope.marker.id) {
                        addComment(commentID);
                    }
                }
                function handleCommentUpdated(event, commentID, conversationID) {
                    if (conversationID === $scope.marker.id) {
                        updateComment(commentID);
                    }
                }
                function handleCommentDeleted(event, commentID, conversationID) {
                    if (conversationID === $scope.marker.id) {
                        deleteComment(commentID);
                    }
                }
                function handleConversationUpdated(event, conversationID) {
                    if (conversationID === $scope.marker.id) {
                        updateConversation(conversationID);
                    }
                }
                function handleProjectStakeholderRemoved(event, projectID, userID) {
                    $scope.projectStakeholders = _.rejectWithProperty($scope.projectStakeholders, "id", userID);
                }
                function watchForDirtyComment() {
                    var unwatchNewComment = $scope.$watch(
                    "newComment",
                    function (newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        $scope.setConversationsAsDirty();
                        unwatchNewComment();
                    }
                    );
                }
                var screenContainer = element.parents(".screen");
                var image = element.parents(".screen").find(".screenImage");
                var formContainer = element.find(".comment-thread-container");
                var hasDragged = false;
                var submissionInProgress = false;
                $scope.isDeleting = false;
                $scope.marker.isMarkerVisible = true;
                $scope.marker.isSaved = !!$scope.marker.id;
                $scope.marker.isConversationPanelVisible = $scope.marker.isConversationPanelVisible || false;
                $scope.newComment = "";
                $scope.notifyOthers = "";
                $scope.isCommentInputVisible = false;
                $scope.isNotifySettingsVisible = false;
                $scope.conversationPanelClass = "left";
                $scope.isTeamChecked = false;
                $scope.isStakeholdersChecked = false;
                $scope.showNotifyOthers = false;
                $scope.$watch("isTeamChecked", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        _.setProperty($scope.projectMembers, "isNotify", !!newValue);
                    }
                });
                $scope.$watch("isStakeholdersChecked", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        _.setProperty($scope.projectStakeholders, "isNotify", !!newValue);
                    }
                });
                $scope.$watch(
                "marker.isComplete",
                function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    if (!$scope.marker.isSaved) {
                        return;
                    }
                    $scope.saveConversation($scope.marker);
                    if ($scope.areConversationsDirty()) {
                        return;
                    }
                    if (newValue) {
                        $timeout(
                        function () {
                            $scope.closeConversationPanel();
                        },
                        250
                        );
                    }
                }
                );
                $scope.$watch("marker.isForDevelopment", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.marker.isSaved) {
                            $scope.saveConversation($scope.marker);
                        }
                    }
                });
                $scope.$watch("marker.isPrivate", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.marker.isSaved) {
                            $scope.saveConversation($scope.marker);
                        }
                    }
                });
                $scope.$watch("marker.isConversationPanelVisible", function (newValue, oldValue) {
                    moveConversationPanelPosition($scope.marker.x, $scope.marker.y);
                    if (newValue) {
                        $scope.isNotifySettingsVisible = !$scope.marker.isSaved;
                        if ($scope.marker.isSaved) {
                            var subscribers = $scope.marker.subscribers;
                        } else {
                            var subscribers = $scope.getDefaultUserIDs();
                        }
                        _.setProperty($scope.projectMembers, "isNotify", false);
                        _.setProperty($scope.projectStakeholders, "isNotify", false);
                        var selectedMembers = _.withPropertyRange($scope.projectMembers, "id", subscribers);
                        var selectedAffiliates = _.withPropertyRange($scope.projectStakeholders, "id", subscribers);
                        _.setProperty(selectedMembers, "isNotify", true);
                        _.setProperty(selectedAffiliates, "isNotify", true);
                        watchForDirtyComment();
                    }
                    if (newValue !== oldValue) {
                        if ($scope.marker.isSaved && newValue == false) {
                            $scope.markCommentsAsRead($scope.marker);
                            $scope.stopEditingComments();
                            $scope.newComment = "";
                            $scope.notifyOthers = "";
                            $scope.marker.isConversationPanelVisible = false;
                            $scope.isCommentInputVisible = false;
                            $scope.isNotifySettingsVisible = false;
                            $scope.showNotifyOthers = false;
                        }
                    }
                    if (!$scope.marker.isSaved && newValue == true) {
                        $scope.showCommentInput();
                    }
                    if (newValue) {
                        $scope.scrollToMarker();
                    }
                });
                $scope.$on("$destroy", function () {
                    modelEvents.off("commentAdded", handleCommentAdded);
                    modelEvents.off("commentUpdated", handleCommentUpdated);
                    modelEvents.off("commentDeleted", handleCommentDeleted);
                    modelEvents.off("conversationUpdated", handleConversationUpdated);
                    modelEvents.off("projectStakeholderRemoved", handleProjectStakeholderRemoved);
                });
                $scope.$on(
                "autosizeResized",
                function (event, textarea, newHeight, oldHeight) {
                    if (textarea.attr("name") !== "post-comment") {
                        return;
                    }
                    var TOP_TOOLBAR_HEIGHT = 47;
                    var BOTTOM_TOOLBAR_HEIGHT = 60;
                    var win = $($window);
                    var windowHeight = win.height();
                    var windowScrollTop = win.scrollTop();
                    var viewportTop = (windowScrollTop + TOP_TOOLBAR_HEIGHT);
                    var viewportBottom = (windowScrollTop + windowHeight - BOTTOM_TOOLBAR_HEIGHT);
                    var form = element.find(".comment-thread");
                    var formHeight = (form.height() - textarea.height() + newHeight);
                    var formTop = form.offset().top;
                    var formBottom = (formTop + formHeight);
                    var hiddenFormHeight = (formBottom - viewportBottom);
                    if (hiddenFormHeight <= 0) {
                        return;
                    }
                    var textareaScollTop = (textarea.offset().top - 5);
                    var targetViewportTop = (viewportTop + hiddenFormHeight);
                    if (targetViewportTop > textareaScollTop) {
                        return;
                    }
                    $("html, body").stop().animate(
                    {
                        scrollTop: (windowScrollTop + hiddenFormHeight)
                    },
                    "fast"
                    );
                }
                );
                modelEvents.on("commentAdded", handleCommentAdded);
                modelEvents.on("commentUpdated", handleCommentUpdated);
                modelEvents.on("commentDeleted", handleCommentDeleted);
                modelEvents.on("conversationUpdated", handleConversationUpdated);
                modelEvents.on("projectStakeholderRemoved", handleProjectStakeholderRemoved);
                element.find(".marker").draggable({
                    start: function (event, ui) {
                        $scope.$apply(function () {
                            dragStart(event, ui);
                        });
                    },
                    drag: function (event, ui) {
                        $scope.$apply(function () {
                            drag(event, ui);
                        });
                    },
                    stop: function (event, ui) {
                        $scope.$apply(function () {
                            dragStop(event, ui);
                        });
                    }
                });
            }
        };
    }
})(angular, InVision);
;
;
/*! enter.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invEnter", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var expression = attributes.invEnter;
            element.on(
            "keypress.invEnter",
            function (event) {
                if (event.which === 13) {
                    $scope.$apply(expression);
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                element.off("keypress.invEnter");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! fade-show.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invFadeShow", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var duration = (attributes.fadeduration || "fast");
            var expression = attributes.invFadeShow;
            var delayShow = (attributes.delayShow || 0);
            if (!$scope.$eval(expression)) {
                element.css("display", "none");
            }
            $scope.$watch(
            expression,
            function (newValue, oldValue) {
                var isVisible = element.is(":visible");
                var isHidden = !isVisible;
                var shouldShow = newValue;
                var shouldHide = !shouldShow;
                if (shouldShow && isHidden) {
                    element
                    .stop(true, true)
                    .delay(delayShow)
                    .fadeIn(duration)
                    ;
                } else if (shouldHide && isVisible) {
                    element
                    .stop(true)
                    .fadeOut(duration)
                    ;
                } else if (shouldHide) {
                    element.stop(true);
                }
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! google-map-loader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invGoogleMapLoader", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            function init() {
                google.load(
                "maps",
                "3",
                {
                    other_params: 'sensor=false',
                    callback: function () {
                        $.getScript(infoBoxURL)
                        .done(function () {
                            $scope.$broadcast("googleMapsLoaded");
                        })
                        .fail(function () {
                            $scope.openModalWindow("error", "For some reason, we couldn't load your team's map. Try refreshing your browser.");
                        });
                    }
                }
                );
            }
            var googleMapsApiURL = "https://maps.googleapis.com/maps/api/js?sensor=false&.js";
            var infoBoxURL = "/assets/google-maps-utility/infobox.js";
            var dom = {};
            dom.target = $(element);
            dom.head = $("head");
            var isInitialized = false;
            init();
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! http-activity.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("inHttpActivity", Directive);
    /** @ngInject */
    function Directive($timeout, httpActivityService) {
        var linkFunction = function ($scope, element, attributes) {
            var delay = 250;
            var timer = null;
            var prepareToShowIndicator = function () {
                timer = $timeout(showIndicator, delay, false);
            };
            var showIndicator = function () {
                element.stop(true, true).show();
            };
            var hideIndicator = function () {
                $timeout.cancel(timer);
                element.fadeOut("fast");
            };
            $scope.$watch(
            function () {
                return (httpActivityService.isActiveWithPost());
            },
            function (isActive) {
                if (isActive) {
                    prepareToShowIndicator();
                } else {
                    hideIndicator();
                }
            }
            );
        };
        return (linkFunction);
    }
})(angular, InVision);
;
;
/*! image-load-event.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invImageLoadEvent", Directive);
    /** @ngInject */
    function Directive() {
        function link($scope, element, attributes) {
            var eventType = (attributes.invImageLoadEvent || "imageLoaded");
            var timerID = null;
            element.on(
            "load.invImageLoadEvent",
            function (event) {
                $scope.$apply(
                function () {
                    clearInterval(timerID);
                    $scope.$emit(eventType, element);
                }
                );
            }
            );
            attributes.$observe(
            "ngSrc",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                clearInterval(timerID);
                timerID = setInterval(
                function () {
                    $scope.$apply(
                    function () {
                        $scope.$emit(eventType, element);
                    }
                    );
                },
                50
                );
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearInterval(timerID);
                element.off("load.invImageLoadEvent");
            }
            );
        }
        return ({
            link: link,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! infinite-scroll.js */
;
;
(function (ng, app) {
    "use strict";
    /** @ngInject */
    app.directive(
    "invInfiniteScroll",
    function ($timeout) {
        /** @ngInject */
        var linkFunction = function ($scope, element, attributes) {
            function inspectContent() {
                var viewportTop = win.scrollTop();
                var viewportBottom = (viewportTop + win.height());
                var bottomOfElement = (elementTop + element.height() - scrollOffsetBuffer);
                var bottomIsExposed = (bottomOfElement <= viewportBottom);
                if (bottomIsExposed) {
                    $scope.$eval(loadContentExpression);
                }
                return (bottomIsExposed);
            }
            var doc = $(document);
            var win = $(window);
            var loadContentExpression = attributes.invInfiniteScroll;
            var elementTop = element.offset().top;
            var scrollOffsetBuffer = (attributes.infiniteScrollOffsetBuffer || 200);
            win.on(
            "scroll.invInfiniteScroll",
            function (event) {
                if (inspectContent()) {
                    $scope.$apply();
                }
            }
            );
            win.on(
            "resize.invInfiniteScroll",
            function (event) {
                if (inspectContent()) {
                    $scope.$apply();
                }
            }
            );
            $timeout(inspectContent);
            $scope.$on(
            "$destroy",
            function () {
                win.off("resize.invInfiniteScroll");
                win.off("scroll.invInfiniteScroll");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
    );
})(angular, InVision);
;
;
/*! lazy-src.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invLazySrc", Directive);
    /** @ngInject */
    function Directive() {
        var pendingTimer = null;
        var pending = [];
        function dequeueHandler() {
            for (var i = 0, length = pending.length ; i < length ; i++) {
                pending[i]();
            }
            pendingTimer = null;
            pending = [];
        }
        function queueHandler(handler) {
            pending.push(handler);
            if (!pendingTimer) {
                pendingTimer = setTimeout(dequeueHandler, 100);
            }
        }
        function isElementVisible(element) {
            if (!element.is(":visible")) {
                return (false);
            }
            var bottomOfScreen = (win.height() + win.scrollTop());
            return (element.offset().top < bottomOfScreen);
        }
        var win = $(window);
        var doc = $(document);
        var link = function ($scope, element, attributes) {
            function examineImage() {
                if (isElementVisible(element)) {
                    showImage();
                    stopMonitoring();
                }
            }
            function handleWatchCallback(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                examineImage();
            }
            function setupMonitoring() {
                if (isElementVisible(element)) {
                    return (showImage());
                }
                startMonitoring();
            }
            function showImage() {
                element.prop("src", src);
                isVisible = true;
            }
            function startMonitoring() {
                isMonitoring = true;
                win.on("resize", examineImage);
                win.on("scroll", examineImage);
                watchDocumentHeight();
                watchLazyExpression();
            }
            function stopMonitoring() {
                isMonitoring = false;
                win.off("resize", examineImage);
                win.off("scroll", examineImage);
                unbindLazyWatch();
                unbindDocumentWatch();
            }
            function watchDocumentHeight() {
                unbindDocumentWatch = $scope.$watch(
                function () {
                    return (doc.height())
                },
                handleWatchCallback
                );
            }
            function watchLazyExpression() {
                if (!attributes.lazyWatch) {
                    return;
                }
                unbindLazyWatch = $scope.$watch(attributes.lazyWatch, handleWatchCallback);
            }
            var src = null;
            var isMonitoring = false;
            var isVisible = false;
            var unbindLazyWatch = ng.noop;
            var unbindDocumentWatch = ng.noop;
            attributes.$observe(
            "invLazySrc",
            function (interpolatedSource) {
                src = interpolatedSource;
                if (isVisible) {
                    return (showImage());
                }
                if (isMonitoring) {
                    return;
                }
                queueHandler(setupMonitoring);
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                win.off("resize", examineImage);
                win.off("scroll", examineImage);
            }
            );
        };
        return ({
            link: link,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! line-chart.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invLineChart", Directive);
    /** @ngInject */
    function Directive($, moment, _) {
        function createPrettyAxis(minimumValue, maxiumumValue) {
            var ticksArray = [0, 1, 2];
            if (maxiumumValue === 0 || maxiumumValue === 1) {
                ticksArray = [0, 1, 2];
            }
            if (maxiumumValue > 1 && maxiumumValue < 4) {
                ticksArray = [0, 2, 4];
            }
            if (maxiumumValue >= 4 && maxiumumValue < 6) {
                ticksArray = [0, 2, 4, 6];
            }
            if (maxiumumValue >= 6 && maxiumumValue < 8) {
                ticksArray = [0, 4, 8];
            }
            if (maxiumumValue >= 8 && maxiumumValue < 10) {
                ticksArray = [0, 5, 10];
            }
            if (maxiumumValue >= 10 && maxiumumValue < 20) {
                ticksArray = [0, 10, 20];
            }
            if (maxiumumValue >= 20 && maxiumumValue < 30) {
                ticksArray = [0, 10, 20, 30];
            }
            if (maxiumumValue >= 30 && maxiumumValue < 40) {
                ticksArray = [0, 20, 40];
            }
            if (maxiumumValue >= 40 && maxiumumValue < 60) {
                ticksArray = [0, 20, 40, 60];
            }
            if (maxiumumValue >= 60 && maxiumumValue < 80) {
                ticksArray = [0, 40, 80];
            }
            if (maxiumumValue >= 80 && maxiumumValue < 90) {
                ticksArray = [0, 30, 60, 90];
            }
            if (maxiumumValue >= 90 && maxiumumValue < 120) {
                ticksArray = [0, 40, 80, 120];
            }
            if (maxiumumValue >= 120 && maxiumumValue < 150) {
                ticksArray = [0, 50, 100, 150];
            }
            if (maxiumumValue >= 150 && maxiumumValue < 200) {
                ticksArray = [0, 100, 200];
            }
            if (maxiumumValue >= 200 && maxiumumValue < 300) {
                ticksArray = [0, 100, 200, 300];
            }
            if (maxiumumValue >= 300 && maxiumumValue < 400) {
                ticksArray = [0, 200, 400];
            }
            if (maxiumumValue >= 400 && maxiumumValue < 600) {
                ticksArray = [0, 300, 600];
            }
            if (maxiumumValue >= 600 && maxiumumValue < 1000) {
                ticksArray = [0, 500, 1000];
            }
            if (maxiumumValue >= 1000 && maxiumumValue < 1600) {
                ticksArray = [0, 800, 1600];
            }
            if (maxiumumValue >= 1600 && maxiumumValue < 2000) {
                ticksArray = [0, 1000, 2000];
            }
            if (maxiumumValue >= 2000 && maxiumumValue < 3000) {
                ticksArray = [0, 1000, 2000, 3000];
            }
            if (maxiumumValue >= 3000 && maxiumumValue < 5000) {
                ticksArray = [0, 2500, 5000];
            }
            if (maxiumumValue >= 5000 && maxiumumValue < 8000) {
                ticksArray = [0, 4000, 8000];
            }
            if (maxiumumValue >= 8000 && maxiumumValue < 12000) {
                ticksArray = [0, 4000, 8000, 12000];
            }
            return ticksArray;
        }
        /** @ngInject */
        var linkFunction = function ($scope, element, attributes) {
            /*
            [
            [
            [ new Date(), value ],
            [ new Date(), value2 ]
            ]
            ]
            */
            var data = $scope[attributes.ngModel];
            $scope.$watch(attributes.ngModel, function (newData, oldData) {
                drawGraph(element, newData);
            });
        };
        function formatTimeByDayOfWeek(val, axis) {
            var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            return days[moment().utc(val).day()];
        }
        function drawGraph(element, data) {
            var viewData = _.pluck(data, "views");
            var minValue = _.min(viewData);
            var maxValue = _.max(viewData);
            var transformedData = _.map(data, function (datum) {
                return [
                moment.utc(datum.startedAt),
                datum.views
                ];
            });
            if (viewData.length == 1) {
                options.xaxis.tickSize = null;
                options.xaxis.minTickSize = null;
                options.xaxis.timeformat = "%b %d";
                options.tooltipOpts.content = "%y.0 views on %x";
                options.xaxis.tickFormatter = formatTimeByDayOfWeek;
            }
            if (viewData.length >= 2) {
                options.xaxis.tickSize = [1, "day"];
                options.xaxis.minTickSize = [1, "day"];
                options.xaxis.timeformat = "%d %b";
                options.tooltipOpts.content = "%y.0 views on %x";
                options.xaxis.tickFormatter = formatTimeByDayOfWeek;
            }
            if (viewData.length > 7 && viewData.length <= 60) {
                options.xaxis.minTickSize = [7, "day"];
                options.xaxis.tickSize = [7, "day"];
                options.xaxis.timeformat = "%b %d";
                options.tooltipOpts.content = "%y.0 views during the week of %x";
                options.xaxis.tickFormatter = null;
                var groupedByWeek = _.groupBy(transformedData, function (datum) {
                    var momentObj = datum[0];
                    return momentObj.startOf("week");
                });
                var mappedData = _.map(groupedByWeek, function (weekData, startOfWeek) {
                    return [
                    moment(startOfWeek),
                    _.reduce(weekData, function (sum, data, key) {
                        return sum + data[1];
                    }, 0)
                    ];
                });
                transformedData = mappedData;
                maxValue = _.max(transformedData, function (datum) { return datum[1]; })[1];
            }
            if (viewData.length > 60) {
                options.xaxis.minTickSize = [1, "month"];
                options.xaxis.tickSize = [1, "month"];
                options.xaxis.timeformat = "%b '%y";
                options.tooltipOpts.content = "%y.0 views during %x";
                options.xaxis.tickFormatter = null;
                var groupedByMonth = _.groupBy(transformedData, function (datum) {
                    var momentObj = datum[0];
                    return momentObj.startOf("month");
                });
                var mappedData = _.map(groupedByMonth, function (monthData, startOfMonth) {
                    return [
                    moment(startOfMonth),
                    _.reduce(monthData, function (sum, data, key) {
                        return sum + data[1];
                    }, 0)
                    ];
                });
                transformedData = mappedData;
                maxValue = _.max(transformedData, function (datum) { return datum[1]; })[1];
            }
            options.yaxis.ticks = createPrettyAxis(minValue, maxValue);
            var augmentedData = [transformedData];
            $.plot(element, augmentedData, options);
            element.show();
        }
        var options = {
            grid: {
                borderWidth: 0,
                borderColor: "#ccc",
                margin: 0,
                labelMargin: 20,
                hoverable: true
            },
            xaxis: {
                tickLength: 0,
                color: '#999999',
                mode: "time",
                timeformat: "%b %d"
            },
            yaxis: {
                color: '#999999',
                min: 0,
                ticks: createPrettyAxis(0, 10),
                tickFormatter: function (val, axis) {
                    if (val === 0) {
                        return "";
                    } else {
                        return val.toFixed(axis.tickDecimals);
                    }
                }
            },
            series: {
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 3
                },
                points: {
                    show: true,
                    radius: 5,
                    lineWidth: 0,
                    fill: true,
                    fillColor: "#58A2EC"
                }
            },
            colors: ["#BEDCF6"],
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%y.0 views on %x",
                defaultTheme: true,
                shifts: {
                    x: 0,
                    y: -50
                }
            }
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! map-info-box.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invMapInfoBox", Directive);
    /** @ngInject */
    function Directive($parse, $compile) {
        var infoWindowEvents = 'closeclick content_change domready ' +
        'position_changed zindex_changed';
        var options = {};
        function bindMapEvents(scope, eventsStr, googleObject, element) {
            angular.forEach(
            eventsStr.split(' '),
            function (eventName) {
                var $event = { type: 'map-' + eventName };
                google.maps.event.addListener(
                googleObject,
                eventName,
                function (evt) {
                    element.trigger(angular.extend({}, $event, evt));
                    if (!scope.$$phase) scope.$apply();
                }
                );
            }
            );
        }
        var linkFunction = function (scope, elm, attrs) {
            var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
            opts.content = elm[0];
            var model = $parse(attrs.invMapInfoBox);
            var infoWindow = model(scope);
            if (!infoWindow) {
                infoWindow = new InfoBox(opts);
                model.assign(scope, infoWindow);
            }
            bindMapEvents(scope, infoWindowEvents, infoWindow, elm);
            /* The info window's contents dont' need to be on the dom anymore,
            google maps has them stored.  So we just replace the infowindow element
            with an empty div. (we don't just straight remove it from the dom because
            straight removing things from the dom can mess up angular) */
            elm.replaceWith('<div></div>');
            var _open = infoWindow.open;
            infoWindow.open = function open(a1, a2, a3, a4, a5, a6) {
                $compile(elm.contents())(scope);
                _open.call(infoWindow, a1, a2, a3, a4, a5, a6);
            };
        }
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! mobile-skin.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invMobileSkin", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            var positionSkin = function () {
                var winHeight = $(window).height();
                var bottomBarHeight = 52;
                var winWidth = $(window).height();
                var skinHeight = $(element).height();
                var shadowHeight = 25;  // This is the height of the shaddow at the bottom of the skin
                if ((skinHeight - shadowHeight + 25) >= (winHeight - bottomBarHeight)) {
                    var topMargin = "25px";
                    var bottomMargin = "0px";
                } else {
                    var topMargin = (winHeight - bottomBarHeight - skinHeight + shadowHeight) / 2;
                    var bottomMargin = winHeight - topMargin - skinHeight - shadowHeight;
                    bottomMargin = bottomMargin > 0 ? bottomMargin : 0;
                }
                $(element).css({
                    "margin-top": topMargin,
                    "margin-bottom": bottomMargin
                });
            }
            $timeout(function () {
                positionSkin();
            });
            $(window).on("resize.mobileSkin", positionSkin);
            $scope.$on(
            "$destroy",
            function () {
                $(window).off("resize.mobileSkin");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! mobile-skins-viewport.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invMobileSkinsViewport", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            $timeout(function () {
                if (applyScroll()) {
                    $(element).niceScroll({
                        cursordragontouch: true,
                        bouncescroll: true,
                        mousescrollstep: 20,
                        touchbehavior: true,
                        horizrailenabled: false,
                        enablekeyboard: false,
                        railpadding: {
                            top: ($scope.screen.fixedHeaderHeight * $scope.screen.displayScale) + 3,
                            right: 2,
                            left: 0,
                            bottom: ($scope.screen.fixedFooterHeight * $scope.screen.displayScale) + 3
                        }
                    });
                }
            });
            $scope.$parent.getMobileViewportScrollPosition = function () {
                return $(element).scrollTop();
            }
            $scope.$parent.scrollMobileViewport = function (scrollPosition, animateTime) {
                $(element).animate(
                { scrollTop: scrollPosition },
                animateTime
                );
            }
            var applyScroll = function () {
                var renderedScreenHeight = $scope.screen.height * $scope.screen.displayScale;
                var viewportHeight = element.height();
                var sizeDifference = Math.abs(viewportHeight - renderedScreenHeight);
                var threshold = 3;
                if (sizeDifference > threshold) {
                    return true; // apply the scrollbars
                } else {
                    return false // do not apply the scrollbars
                }
            };
            $scope.$on(
            "$destroy",
            function () {
                if (applyScroll()) {
                    $(element).getNiceScroll().remove();
                }
            }
            );
            $scope.$watch(
            "screen",
            function (newValue, oldValue) {
                $timeout(function () {
                    if (newValue != oldValue) {
                        $(element).getNiceScroll().remove();
                        if (applyScroll()) {
                            $(element).niceScroll({
                                cursordragontouch: true,
                                bouncescroll: true,
                                mousescrollstep: 20,
                                touchbehavior: true,
                                horizrailenabled: false,
                                enablekeyboard: false,
                                railpadding: {
                                    top: ($scope.screen.fixedHeaderHeight * $scope.screen.displayScale) + 3,
                                    right: 0,
                                    left: 0,
                                    bottom: ($scope.screen.fixedFooterHeight * $scope.screen.displayScale) + 3
                                }
                            });
                        }
                    }
                });
            });
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! mobile-transition-layer.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive(
    "invMobileTransitionLayer",
    function ($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            var transitionLayerInner = element.find(".transitionLayerInner");
            var currentScreenImage = transitionLayerInner.find(".currentScreen");
            var targetScreenImage = transitionLayerInner.find(".targetScreen");
            var currentScrollPostition = $scope.getMobileViewportScrollPosition();
            var animationTime = 600;
            switch ($scope.transitionData.transitionTypeID) {
                case 2:
                    pushRight();
                    animationTime = 400; //+100 ms from actual animation time
                    break;
                case 3:
                    pushLeft();
                    animationTime = 400; //+100 ms from actual animation time
                    break;
                case 4:
                    slideUp();
                    animationTime = 400; //+100 ms from actual animation time
                    break;
                case 5:
                    slideDown();
                    animationTime = 400; //+100 ms from actual animation time
                    break;
                case 6:
                    flipRight();
                    break;
                case 7:
                    flipLeft();
                    break;
                case 8:
                    dissolve();
                    break;
            }
            function pushRight() {
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.show().addClass("front slide out reverse");
                targetScreenImage.show().addClass("back slide in reverse");
            }
            function pushLeft() {
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.show().addClass("front slide out");
                targetScreenImage.show().addClass("back slide in");
            }
            function slideUp() {
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.addClass("back");
                currentScreenImage.show();
                targetScreenImage.addClass("front")
                targetScreenImage.show();
                targetScreenImage.addClass("slideup in");
            }
            function slideDown() {
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                targetScreenImage.addClass("back")
                targetScreenImage.show();
                currentScreenImage.addClass("front");
                currentScreenImage.show();
                currentScreenImage.addClass("slideup out reverse");
            }
            function flipRight() {
                transitionLayerInner.addClass("viewport-flip");
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.show().addClass("flip out");
                setTimeout(function () {
                    targetScreenImage.show().addClass("flip in");
                }, 200);
            }
            function flipLeft() {
                transitionLayerInner.addClass("viewport-flip");
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.show().addClass("flip out reverse");
                setTimeout(function () {
                    targetScreenImage.show().addClass("flip in reverse");
                }, 200);
            }
            function dissolve() {
                currentScreenImage.css({ top: (currentScrollPostition * -1) + "px" });
                currentScreenImage.addClass("front");
                currentScreenImage.show();
                currentScreenImage.fadeOut(600);
            }
            $timeout(function () {
                $scope.setIsTransitioning(false);
                currentScreenImage.css({ top: 0, display: "none" });
                currentScreenImage.removeClass("back front in out reverse slide flip slipedown slideup");
                currentScreenImage.hide();
                targetScreenImage.css({ top: 0, display: "none" });
                targetScreenImage.removeClass("back front in out reverse slide flip slidedown slideup");
                targetScreenImage.hide();
                transitionLayerInner.removeClass("viewport-flip");
            }, animationTime);
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
    );
})(angular, InVision);
;
;
/*! modal.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invModal", Directive);
    /** @ngInject */
    function Directive($timeout, $window, modalWindowRequest) {
        var linkFunction = function ($scope, element, attributes) {
            $scope.closeModalWindow = function (suppressFade) {
                isClosedByPlugin = false;
                if (suppressFade === true) {
                    element
                    .add("div.modal-backdrop")
                    .removeClass("fade")
                    ;
                }
                element.modal("hide");
            };
            element
            .addClass("modal")
            .attr("tabindex", -1)
            ;
            var modalType = (attributes.invModalType || "top");
            if (modalWindowRequest.isSuppressFade() && element.is(".fade")) {
                element.removeClass("fade");
                element.on(
                "shown.invModal",
                function (event) {
                    element
                    .add("div.modal-backdrop")
                    .addClass("fade")
                    ;
                }
                );
            }
            var isClosedByPlugin = true;
            element.on(
            "hidden.invModal",
            function (event) {
                $scope.$emit("modalWindowHidden");
                $timeout(ng.noop);
            }
            );
            element.on(
            "shown.invModal",
            function () {
                if (modalType !== "top") {
                    return;
                }
                element
                .addClass("pre-modal-scrollable")
                .width()
                ;
                var absoluteTop = Math.max(
                element.offset().top,
                (100 + $($window).scrollTop())
                );
                element
                .addClass("modal-scrollable")
                .css("top", (absoluteTop + "px"))
                .width()
                ;
                element.removeClass("pre-modal-scrollable");
                $scope.$emit("modalWindowShown");
            }
            );
            element.on(
            "hide.invModal",
            function () {
                if (modalType !== "top") {
                    return;
                }
                element.css("top", "");
            }
            );
            if (!modalWindowRequest.isSuppressClose()) { //default
                element.modal(); // set up a plain modal
            } else { //don't let the user close the modal by clicking outside the modal or hitting escape.
                element.modal({
                    keyboard: false,
                    backdrop: "static"
                });
            }
            $scope.$on(
            "closeModalWindowWithoutFade",
            function (event) {
                $scope.closeModalWindow(true);
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                element.off("hide.invModal");
                element.off("hidden.invModal");
                element.off("shown.invModal");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! new-share-form.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invNewShareForm", Directive);
    /** @ngInject */
    function Directive($timeout, ZeroClipboard) {
        var linkFunction = function ($scope, element, attributes) {
            function handleCopySuccess() {
                $scope.form.isShareGenerated = true;
                $scope.showSuccessMessage = true;
                $scope.$apply();
                if (dom.copied.is(".highlight")) {
                    dom.copied.removeClass("highlight highlight-out");
                    clearTimeout(handleCopySuccess.timer1);
                    clearTimeout(handleCopySuccess.timer2);
                }
                dom.copied.addClass("highlight");
                handleCopySuccess.timer1 = setTimeout(
                function () {
                    dom.copied.addClass("highlight-out");
                },
                (1 * 1000)
                );
                handleCopySuccess.timer2 = setTimeout(
                function () {
                    dom.copied.removeClass("highlight highlight-out");
                },
                (2.5 * 1000)
                );
            }
            function handleEmailAddressesKeyPress(event) {
                if (!isEnterKeyEvent(event)) {
                    return;
                }
                $scope.$apply(
                function () {
                    $scope.sendEmail();
                }
                );
            }
            function handleKeyChange() {
                dom.shortCode[0].select();
                clipboard.setText(dom.shortCode.val());
            }
            function handleInit() {
                clipboard.glue(dom.copyButton[0], dom.copyButtonContainer[0]);
                dom.phoneNumber.on("keypress.invNewShareForm", handlePhoneNumberKeyPress);
                dom.emailAddresses.on("keypress.invNewShareForm", handleEmailAddressesKeyPress);
            }
            function handlePhoneNumberKeyPress(event) {
                if (!isEnterKeyEvent(event)) {
                    return;
                }
                $scope.$apply(
                function () {
                    $scope.sendSMS();
                }
                );
            }
            function handleShareMethodViewChange() {
                switch ($scope.shareMethodView) {
                    case "clipboard":
                        dom.shortCode[0].select();
                        clipboard.setText(dom.shortCode.val());
                        break;
                    case "sms":
                        dom.phoneNumber[0].focus();
                        break;
                    case "email":
                        dom.emailAddresses[0].focus();
                        break;
                }
            }
            function isEnterKeyEvent(event) {
                return (event.which === 13);
            }
            var dom = {};
            dom.target = $(element);
            dom.shortCode = dom.target.find("input.zeroClipboardText");
            dom.copyButtonContainer = dom.target.find("div.zeroClipboardContainer");
            dom.copyButton = dom.copyButtonContainer.find("a.zeroClipboardButton");
            dom.copied = dom.target.find("div.copied_successful span");
            dom.phoneNumber = dom.target.find("#phonenumber");
            dom.emailAddresses = dom.target.find("#emailaddress");
            var clipboard = new ZeroClipboard.Client();
            clipboard.setHandCursor(true);
            clipboard.addEventListener("onComplete", handleCopySuccess);
            $scope.$watch(
            "isLoading",
            function (isLoading) {
                if (!isLoading) {
                    $timeout(handleInit, 500);
                }
            }
            );
            $scope.$watch(
            "form.key",
            function (newKey) {
                if ($scope.isLoading || ($scope.shareMethodView !== "clipboard")) {
                    return;
                }
                $timeout(handleKeyChange);
            }
            );
            $scope.$watch(
            "shareMethodView",
            function (newValue) {
                if ($scope.isLoading) {
                    return;
                }
                $timeout(handleShareMethodViewChange);
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clipboard.destroy();
                dom.phoneNumber.off("keypress.invNewShareForm");
                dom.emailAddresses.off("keypress.invNewShareForm");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! nicescroll.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invNicescroll", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            $timeout(function () {
                target.niceScroll({
                    cursorwidth: 8
                });
            }, 500);
            var target = $(element);
            $scope.$watch(
            function () {
                return (target.height());
            },
            function (newValue) {
                target.getNiceScroll().onResize();
            }
            );
            $scope.$on(
            "modalWindowShown",
            function () {
                target.getNiceScroll().onResize();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.getNiceScroll().remove();
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! prevent-submit.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invPreventSubmit", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var isEnterKeyEvent = function (event) {
                return (event.which === 13);
            };
            var target = $(element);
            target.on(
            "keypress.invPreventSubmit",
            function (event) {
                if (isEnterKeyEvent(event)) {
                    event.preventDefault();
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("keypress.invPreventSubmit");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! preview-screen.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invPreviewScreen", Directive);
    /** @ngInject */
    function Directive($, _, $window, $timeout, $anchorScroll) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                $scope.$parent.maintainScrollPositionOnNextScreenLoad = function () {
                    isMaintainScrollPosition = true;
                };
                $scope.$parent.openScreenAsOverlay = function (screen) {
                    $scope.$parent.overlayImage = "/screens/" + screen.id + "/" + screen.imageVersion;
                };
                $scope.$parent.setIsHotspotNavigation = function (value) {
                    isHotspotNavigation = value;
                };
                $scope.hasOverlay = function () {
                    return $scope.$parent.overlayImage.length > 0 ? true : false;
                }
                function onMousedown(event) {
                    event.preventDefault();
                    if (!$(event.target).hasClass('hotspotOverlay')) {
                        flashHotspots();
                    }
                    return false;
                }
                function onKeydown(event) {
                    if (event.shiftKey || event.ctrlKey) {
                        element.find(".hotspotOverlay").addClass("show");
                    }
                }
                function onKeyup(event) {
                    element.find(".hotspotOverlay").removeClass("show");
                }
                function flashHotspots() {
                    var hotspots = element.closest("#project-console").find(".hotspotOverlay");
                    hotspots.stop(true).fadeTo(300, 1).delay(300).fadeTo(300, 0);
                }
                function scrollScreenToAlignment(screenID) {
                    var screen = _.findWithProperty($scope.screens, "id", screenID);
                    var screenAlignment = screen.alignment;
                    var screenWidth = screen.width;
                    var screenHeight = screen.height;
                    var windowHeight = jqWindow.height();
                    var windowWidth = jqWindow.width();
                    if (
                    (screenWidth <= windowWidth) &&
                    (screenHeight <= windowHeight)
                    ) {
                        return;
                    }
                    if (isMaintainScrollPosition) {
                        var targetScrollLeft = window.scrollLeft();
                    } else if (screen.alignment === "left") {
                        var targetScrollLeft = 0;
                    } else if (screen.alignment === "right") {
                        var targetScrollLeft = (screenWidth - windowWidth);
                    } else {
                        var targetScrollLeft = ((screenWidth - windowWidth) / 2);
                    }
                    jqWindow.scrollLeft(targetScrollLeft);
                    $timeout(
                    function () {
                        jqWindow.scrollLeft(targetScrollLeft);
                        if (jqWindow.scrollLeft() != targetScrollLeft) {
                            $timeout(function () { jqWindow.scrollLeft(targetScrollLeft); }, 100);
                        }
                    },
                    50
                    );
                }
                var image = element.find(".screenImage");
                $scope.showTooltip = false;
                var isHotspotNavigation = false;
                var isMaintainScrollPosition = false;
                var isOverlay = false;
                var jqWindow = $(window);
                $scope.$watch(
                "screenID",
                function (newValue, oldValue) {
                    if (!isHotspotNavigation) {
                        scrollScreenToAlignment(newValue);
                    } else if (!isMaintainScrollPosition) {
                        $anchorScroll();
                        if ($scope.$parent.project.isMobile) {
                            $scope.scrollMobileViewport(0, 0);
                        }
                    }
                    isHotspotNavigation = false;
                    isMaintainScrollPosition = false;
                    isOverlay = false;
                }
                );
                $($window).on("keydown", onKeydown);
                $($window).on("keyup", onKeyup);
                $scope.onMousedown = onMousedown;
                $scope.$parent.overlayImage = "";
            }
        };
    }
})(angular, InVision);
;
;
/*! profile-avatar-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProfileAvatarUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents) {
        var linkFunction = function ($scope, element, attributes) {
            var handlePluploadError = function (uploader, error) {
                $scope.$apply(
                function () {
                    uploader.splice();
                    $scope.isUploading = false;
                    $scope.$emit("profileAvatarUploader:error", error);
                }
                );
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                if (isUploading()) {
                    files.splice(0, files.length);
                    return;
                }
                files.splice(1, files.length);
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                $scope.$apply(
                function () {
                    $scope.isUploading = false;
                    uploader.removeFile(file);
                    var account = ng.fromJson(response.response);
                    $scope.$emit("profileAvatarUploader:uploaded", account);
                    modelEvents.trigger("accountUpdated", account);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        $scope.isUploading = true;
                        $scope.percentage = 0;
                        uploader.start();
                    }
                    );
                }
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    $scope.progress = file.percent;
                }
                );
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            $scope.isUploading = false;
            $scope.percentage = 0;
            var target = $(element);
            var uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                url: "/api/account/upload-avatar",
                browse_button: "profileAvatarUploaderButton",
                container: "profileAvatarUploaderContainer",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,pict,png,tiff"
                }
                ]
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.init();
            $(window).on(
            "error.profileAvatarUploader",
            function (event) {
                if (isFlashRuntime) {
                    return (false);
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                uploader.destroy();
                $(window).off("error.profileAvatarUploader");
                target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: true,
            scope: true,
            templateUrl: "/assets/apps/d/views/directives/profile-avatar-uploader.htm"
        });
    }
})(angular, InVision);
;
;
/*! project-assets.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectAssets", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var announceDragEnter = function () {
                $scope.$apply(
                function () {
                    $scope.$emit("projectAssets:dragEnter");
                }
                );
            };
            var target = $(document);
            target.on(
            "dragstart.projectAssets",
            function (event) {
                return (false);
            }
            );
            target.on(
            "dragenter.projectAssets",
            function (event) {
                announceDragEnter();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("dragstart.projectAssets");
                target.off("dragenter.projectAssets");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! project-background-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectBackgroundUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents) {
        var linkFunction = function ($scope, element, attributes) {
            var handlePluploadError = function (uploader, error) {
                $scope.$apply(
                function () {
                    uploader.splice();
                    $scope.isUploading = false;
                    $scope.$emit("projectBackgroundUploader:error", error);
                }
                );
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                if (isUploading()) {
                    files.splice(0, files.length);
                    return;
                }
                files.splice(1, files.length);
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                $scope.$apply(
                function () {
                    $scope.isUploading = false;
                    uploader.removeFile(file);
                    var background = ng.fromJson(response.response);
                    $scope.$emit("projectBackgroundUploader:uploaded", background);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        $scope.isUploading = true;
                        $scope.percentage = 0;
                        uploader.start();
                    }
                    );
                }
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    $scope.progress = file.percent;
                }
                );
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            $scope.isUploading = false;
            $scope.percentage = 0;
            var target = $(element);
            var uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                url: "/api/backgrounds/",
                multipart_params: {
                    "projectID": $scope.projectID
                },
                browse_button: "projectBackgroundUploaderButton",
                container: "projectBackgroundUploaderContainer",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                multi_selection: false,
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,png"
                }
                ]
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.init();
            $(window).on(
            "error.projectBackgroundUploader",
            function (event) {
                if (isFlashRuntime) {
                    return (false);
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                uploader.destroy();
                $(window).off("error.projectBackgroundUploader");
                target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: true,
            scope: true,
            templateUrl: "/assets/apps/d/views/directives/project-background-uploader.htm"
        });
    }
})(angular, InVision);
;
;
/*! project-comments-conversation.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectCommentsConversation", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            function getTargetIsComplete() {
                var currentFilter = $scope.filters.status.value;
                if (currentFilter === "all") {
                    return (null);
                }
                return (currentFilter === "completed");
            }
            function getTargetIsUnread() {
                var currentFilter = $scope.filters.read.value;
                if (currentFilter === "all") {
                    return (null);
                }
                return (currentFilter === "unread");
            }
            function handleIsCompleteTransitionCleanup() {
                $scope.$apply(
                function () {
                    $scope.removeConversation($scope.screen, $scope.conversation);
                }
                );
            }
            function handleIsUnreadTransitionCleanup() {
                $scope.$apply(
                function () {
                    $scope.hideConversation($scope.screen, $scope.conversation);
                }
                );
            }
            var targetIsComplete = getTargetIsComplete();
            var targetIsUnread = getTargetIsUnread();
            var isCompleteTimer = null;
            $scope.$watch(
            "conversation.isComplete",
            function (isComplete, oldValue) {
                if (isCompleteTimer) {
                    clearTimeout(isCompleteTimer);
                    isCompleteTimer = null;
                    return;
                }
                if (targetIsComplete === null) {
                    return;
                }
                if (isComplete === oldValue) {
                    return;
                }
                if (isComplete !== targetIsComplete) {
                    isCompleteTimer = setTimeout(
                    function () {
                        isCompleteTimer = null;
                        element.fadeOut(500, handleIsCompleteTransitionCleanup);
                    },
                    250
                    );
                } else {
                    element.stop().css("opacity", "");
                }
            }
            );
            $scope.$watch(
            "conversation.isUnread",
            function (isUnread, oldValue) {
                if (targetIsUnread === null) {
                    return;
                }
                if (isUnread === oldValue) {
                    return;
                }
                if (isUnread !== targetIsUnread) {
                    element.fadeOut(500, handleIsUnreadTransitionCleanup);
                }
            }
            );
            $scope.$watch(
            "filters.read",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                targetIsUnread = getTargetIsUnread();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearTimeout(isCompleteTimer);
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! project-mobile-icon-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectIconUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents, Deferred, projectService) {
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearUploader = function () {
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                    if (uploadQueue[i].id == id) {
                        uploadQueue.splice(i, 1);
                        return;
                    }
                }
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handlePluploadError = function (uploader, error) {
                $timeout(
                function () {
                    var file = error.file;
                    uploader.removeFile(file);
                    removeFileFromQueue(file.id);
                    if (error.code === plupload.FILE_SIZE_ERROR) {
                        $scope.openModalWindow(
                        "error",
                        ("The file, \"" + file.name + ",\" is too large. Are you sure that it's not a mislabeled PSD file?")
                        );
                    } else {
                        $scope.openModalWindow(
                        "error",
                        ("We could not process the image, \"" + file.name + "\". This often happens when people accidentally give a PSD or HTML file a \".jpg\" file extension.")
                        );
                    }
                }
                );
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                for (var i = (files.length - 1) ; i >= 0 ; i--) {
                    if (!isValidFilename(files[i].name)) {
                        $scope.openModalWindow(
                        "error",
                        ("Icon images must be formatted as a PNG.")
                        );
                        $scope.$apply(); // shows the modal right away
                        files.splice(i, 1);
                    }
                }
                files.sort(
                function (a, b) {
                    var aName = a.name.toLowerCase();
                    var bName = b.name.toLowerCase();
                    return (aName < bName ? -1 : 1);
                }
                );
                for (var i = 0 ; i < files.length ; i++) {
                    addFileToQueue(
                    files[i].id,
                    files[i].name,
                    files[i].size
                    );
                }
                $scope.$emit("screenUploadStart");
                modelEvents.trigger("screenUploadStart");
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                uploader.removeFile(file);
                removeFileFromQueue(file.id);
                $scope.$apply(
                function () {
                    var screen = ng.fromJson(response.response);
                    modelEvents.trigger("screenUploaded", screen);
                    $scope.setShowSampleScreens(false);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        uploader.start();
                        $scope.mobileUploadingIndicators.isUploadingIcon = true;
                    }
                    );
                }
            };
            var handlePluploadUploadComplete = function (uploader, files) {
                $scope.$emit("screenUploadStop");
                $scope.mobileUploadingIndicators.isUploadingIcon = false;
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    setFileProgress(
                    file.id,
                    file.uploaded,
                    file.percent
                    );
                }
                );
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(png)$/i;
                return (
                pattern.test(name)
                );
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                if (!listItem.length) {
                    return (deleteFileFromQueue(id));
                }
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var setFileProgress = function (id, loaded, percent) {
            };
            var dom = {};
            dom.target = element;
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            dom.window = $(window);
            var uploader = new plupload.Uploader({
                runtimes: "html5, flash",
                url: "/api/screens",
                multipart_params: {
                    "projectID": $scope.projectID,
                    "isAppIcon": true
                },
                browse_button: "appIconUpload",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,png"
                }
                ],
                max_file_size: "10mb"
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadUploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOADING: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.$watch(
            "projectID",
            function (newValue) {
                uploader.settings.multipart_params.projectID = newValue;
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                dom.window.off("error.projectIconUploader");
                dom.target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: false,
            scope: true
        });
    }
})(angular, InVision);
;
;
/*! project-mobile-loading-screen-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectLoadingScreenUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents, Deferred, projectService) {
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearUploader = function () {
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                    if (uploadQueue[i].id == id) {
                        uploadQueue.splice(i, 1);
                        return;
                    }
                }
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handlePluploadError = function (uploader, error) {
                $timeout(
                function () {
                    var file = error.file;
                    uploader.removeFile(file);
                    removeFileFromQueue(file.id);
                    if (error.code === plupload.FILE_SIZE_ERROR) {
                        $scope.openModalWindow(
                        "error",
                        ("The file, \"" + file.name + ",\" is too large. Are you sure that it's not a mislabeled PSD file?")
                        );
                    } else {
                        $scope.openModalWindow(
                        "error",
                        ("We could not process the image, \"" + file.name + "\". This often happens when people accidentally give a PSD or HTML file a \".jpg\" file extension.")
                        );
                    }
                }
                );
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                for (var i = (files.length - 1) ; i >= 0 ; i--) {
                    if (!isValidFilename(files[i].name)) {
                        $scope.openModalWindow(
                        "error",
                        ("Loading Screen images must be formatted as a PNG.")
                        );
                        $scope.$apply(); // shows the modal right away
                        files.splice(i, 1);
                    }
                }
                files.sort(
                function (a, b) {
                    var aName = a.name.toLowerCase();
                    var bName = b.name.toLowerCase();
                    return (aName < bName ? -1 : 1);
                }
                );
                for (var i = 0 ; i < files.length ; i++) {
                    addFileToQueue(
                    files[i].id,
                    files[i].name,
                    files[i].size
                    );
                }
                $scope.$emit("screenUploadStart");
                modelEvents.trigger("screenUploadStart");
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                uploader.removeFile(file);
                removeFileFromQueue(file.id);
                $scope.$apply(
                function () {
                    var screen = ng.fromJson(response.response);
                    modelEvents.trigger("screenUploaded", screen);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        uploader.start();
                        $scope.mobileUploadingIndicators.isUploadingLoadingScreen = true;
                    }
                    );
                }
            };
            var handlePluploadUploadComplete = function (uploader, files) {
                $scope.$emit("screenUploadStop");
                $scope.mobileUploadingIndicators.isUploadingLoadingScreen = false;
            };
            var handlePluploadUploadProgress = function (uploader, file) {
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(png)$/i;
                return (
                pattern.test(name)
                );
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                if (!listItem.length) {
                    return (deleteFileFromQueue(id));
                }
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var dom = {};
            dom.target = element;
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            dom.window = $(window);
            var uploader = new plupload.Uploader({
                runtimes: "html5, flash",
                url: "/api/screens",
                multipart_params: {
                    "projectID": $scope.projectID,
                    "isLoadingScreen": true
                },
                browse_button: "loadingScreenUpload",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,png"
                }
                ],
                max_file_size: "10mb"
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadUploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOADING: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.$watch(
            "projectID",
            function (newValue) {
                uploader.settings.multipart_params.projectID = newValue;
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                dom.window.off("error.projectIconUploader");
                dom.target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: false,
            scope: true
        });
    }
})(angular, InVision);
;
;
/*! project-screen-divider-placeholder.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectScreenDividerPlaceholder", Directive);
    /** @ngInject */
    function Directive($filter, screenDividerService) {
        var linkFunction = function ($scope, element, attributes) {
            element.click(function () {
                var thisScreenPosition = $scope.object.position;
                var thisDisplayObjectsPosition = $scope.object.displayObjectsPosition;
                var newLabel = "New Section";
                screenDividerService.createScreenDivider($scope.projectID, newLabel, thisScreenPosition, thisDisplayObjectsPosition);
                $scope.displayObjects[thisDisplayObjectsPosition] = {
                    dividerID: "new",
                    type: "divider",
                    label: newLabel,
                    position: thisScreenPosition
                };
                $scope.dividers.push({
                    dividerID: 0,
                    type: "divider",
                    label: newLabel,
                    position: thisScreenPosition
                });
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! project-screen-divider.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectScreenDivider", Directive);
    /** @ngInject */
    function Directive($filter, screenDividerService) {
        var linkFunction = function ($scope, element, attributes) {
            var isSetup = false;
            var input = {};
            var label = {};
            var originalValue = null;
            var request = null;
            $scope.$watch("isEditingDividerLabel", function (newVal, oldVal) {
                if (!isSetup) {
                    input = element.find(".dividerLabelInput");
                    label = element.find(".divider_label");
                    setupEditLabel(input);
                }
                input.focus();
                input.select();
            });
            $scope.deleteDivider = function (dividerID) {
                screenDividerService.deleteScreenDivider($scope.projectID, dividerID);
            }
            function setupEditLabel(input) {
                originalValue = input.val();
                input.on("blur.invUpdateScreenDivider", handleBlur);
                input.on("keypress.invUpdateScreenDivider", handleKeyPress);
                input.on("keyup.invUpdateScreenDivider", handleKeyUp);
                $scope.$on(
                "$destroy",
                function () {
                    input.off("blur.invUpdateScreenDivider");
                    input.off("keypress.invUpdateScreenDivider");
                    input.off("keyup.invUpdateScreenDivider");
                    input.popover("destroy");
                    isSetup = false;
                }
                );
                isSetup = true;
            }
            var getErrorMessage = function (response) {
                if (validationService.isInvalidField(response)) {
                    return ("Your divider label contians invalid characters. Try removing some punctuation.");
                }
                return (response.message);
            };
            var handleBlur = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                submitForm();
                hideInput();
            };
            var handleKeyPress = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var theChar = String.fromCharCode(event.which);
            };
            var handleKeyUp = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var enterKey = 13;
                var escapeKey = 27;
                if (event.which === enterKey) {
                    submitForm();
                } else if (event.which === escapeKey) {
                    resetValue(originalValue);
                    hideInput();
                }
            };
            var hideInput = function () {
                $scope.finishEditingScreenDividerLabel();
                input.popover("destroy");
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            var resetValue = function (originalValue) {
                input.val(originalValue);
                label.html(originalValue);
                hideInput();
            }
            var submitForm = function () {
                var newValue = input.val();
                if (
                !newValue ||
                (newValue === originalValue)
                ) {
                    hideInput();
                    return;
                }
                input.popover("destroy");
                var dividerID = $scope.object.dividerID;
                $scope.object.label = newValue;
                request = screenDividerService.updateScreenDivider($scope.projectID, dividerID, newValue);
                request.then(
                function (divider) {
                    request = null;
                    label.html(newValue);
                    hideInput();
                },
                function (response) {
                    request = null;
                    input
                    .popover({
                        content: getErrorMessage(response),
                        placement: "top",
                        title: "Oops: Something Went Wrong",
                        trigger: "manual"
                    })
                    .popover("show");
                    ;
                    input.focus();
                    input.select();
                }
                );
            };
        }
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! project-screen.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectScreen", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            element.on(
            "mouseleave.invProjectScreen",
            function () {
                $scope.hideArchiveConfirmation();
                $scope.hideDeleteConfirmation();
                element.find("li.dropdown")
                .removeClass("open")
                ;
                $scope.$apply();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                element.off("mouseleave.invProjectScreen");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! project-screens.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectScreens", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var announceDragEnter = function () {
                $scope.$apply(
                function () {
                    $scope.$emit("projectScreens:dragEnter");
                }
                );
            };
            var target = $(document);
            target.on(
            "dragstart.projectScreens",
            function (event) {
                return (false);
            }
            );
            target.on(
            "dragenter.projectScreens",
            function (event) {
                announceDragEnter();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("dragstart.projectScreens");
                target.off("dragenter.projectScreens");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! project-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invProjectUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents, Deferred, projectService) {
        var maxInBytes = 10485760;
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearUploader = function () {
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                    if (uploadQueue[i].id == id) {
                        uploadQueue.splice(i, 1);
                        return;
                    }
                }
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handleDragEnter = function (event) {
                event.stopPropagation();
                if (dom.dropzone.is(".hotDropzone")) {
                    return;
                }
                dom.dropzone.addClass("hotDropzone");
                $document.on("dragenter.invProjectUploader", handleDragEnterOnDocument);
            };
            var handleDragEnterOnDocument = function (event) {
                dom.dropzone.removeClass("hotDropzone");
                $document.off("dragenter.invProjectUploader");
            };
            var handleMouseEnter = function (event) {
                dom.dropzone.addClass("hotDropzone");
            };
            var handleMouseLeave = function (event) {
                dom.dropzone.removeClass("hotDropzone");
            };
            var handlePluploadError = function (uploader, error) {
                $timeout(
                function () {
                    var file = error.file;
                    uploader.removeFile(file);
                    removeFileFromQueue(file.id);
                    if (error.code === plupload.FILE_SIZE_ERROR) {
                        $scope.openModalWindow(
                        "error",
                        ("The file, \"" + file.name + ",\" is too large. Are you sure that it's not a mislabeled PSD file?")
                        );
                    } else {
                        $scope.openModalWindow(
                        "error",
                        ("We could not process the image, \"" + file.name + "\". This often happens when people accidentally give a PSD or HTML file a \".jpg\" file extension.")
                        );
                    }
                }
                );
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                var fileExcludedBasedOnName = null;
                for (var i = (files.length - 1) ; i >= 0 ; i--) {
                    if (!isValidFilename(files[i].name)) {
                        fileExcludedBasedOnName = files[i].name;
                        files.splice(i, 1);
                    } else if (files[i].size > maxInBytes && !isPDF(files[i].name)) { // limit the max file size, unless it's a PDF
                        $scope.openModalWindow(
                        "error",
                        ("The file, \"" + files[i].name + ",\" is too large. Are you sure that it's not a mislabeled PSD file?")
                        );
                        files.splice(i, 1);
                    }
                }
                if (fileExcludedBasedOnName) {
                    $scope.openModalWindow("error", "The file, \"" + fileExcludedBasedOnName + ",\" was skipped since it doesn't appear to be an image file.");
                }
                files = _.sortOnPropertyUsingNaturalOrder(files, "name");
                for (var i = 0 ; i < files.length ; i++) {
                    addFileToQueue(
                    files[i].id,
                    files[i].name,
                    files[i].size
                    );
                }
                if (files.length) {
                    $scope.$emit("screenUploadStart");
                    modelEvents.trigger("screenUploadStart");
                }
                $scope.$apply();
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                uploader.removeFile(file);
                removeFileFromQueue(file.id);
                $scope.$apply(
                function () {
                    var screen = ng.fromJson(response.response);
                    modelEvents.trigger("screenUploaded", screen);
                    $scope.setShowSampleScreens(false);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
                if (isHtml5Runtime) {
                    dom.dropzone.on("mouseenter", handleMouseEnter);
                    dom.dropzone.on("mouseleave", handleMouseLeave);
                    dom.dropzone.on("dragenter", handleDragEnter);
                    dom.dropzone
                    .removeClass("flashDropzone")
                    .addClass("html5Dropzone")
                    ;
                } else {
                    $scope.setShowSampleScreens(false);
                    dom.target.find("div.plupload.flash").on("mouseenter", handleMouseEnter);
                    dom.target.find("div.plupload.flash").on("mouseleave", handleMouseLeave);
                    dom.dropzone
                    .removeClass("html5Dropzone")
                    .addClass("flashDropzone")
                }
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        uploader.start();
                    }
                    );
                }
            };
            var handlePluploadUploadComplete = function (uploader, files) {
                $scope.$emit("screenUploadStop");
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    setFileProgress(
                    file.id,
                    file.uploaded,
                    file.percent
                    );
                }
                );
            };
            var handleWindowScroll = function (event) {
                var uploaderOffset = dom.target.offset();
                var uploaderTop = uploaderOffset.top;
                var isAboveFold = (uploaderTop < dom.window.scrollTop());
                if (!$scope.activeScreens.length) {
                    $scope.isFixedDropzone = false;
                } else if (isAboveFold && !dom.target.is(".fixed")) {
                    $scope.isFixedDropzone = true;
                } else if (!isAboveFold && dom.target.is(".fixed")) {
                    $scope.isFixedDropzone = false;
                }
                $timeout(
                function () {
                    $scope.$apply();
                    setTimeout(refreshUploader); // Allow pause for DOM to update before shim is refreshed.
                }
                );
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isPDF = function (name) {
                var pattern = /\.(pdf)$/i;
                return (
                pattern.test(name)
                );
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(gif|jpe?g|png|pdf)$/i;
                return (
                pattern.test(name)
                );
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                if (!listItem.length) {
                    return (deleteFileFromQueue(id));
                }
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var setFileProgress = function (id, loaded, percent) {
                var queueItem = getQueueItemByID(id);
                queueItem.percentage = percent;
                if (queueItem.state === $scope.fileStates.PENDING) {
                    queueItem.state = $scope.fileStates.UPLOADING;
                }
            };
            var onSampleScreenDrop = function () {
                $scope.$emit("screenUploadStart");
                $scope.setShowSampleScreens(false);
                $scope.uploadQueue.push({
                    id: 'sample1',
                    name: "Sample 1",
                    size: 10000,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
                $scope.uploadQueue.push({
                    id: 'sample2',
                    name: "Sample 2",
                    size: 10000,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
                $scope.$apply();
                $timeout(function () {
                    setFileProgress("sample1", false, 35);
                    setFileProgress("sample2", false, 35);
                    $timeout(function () {
                        setFileProgress("sample1", false, 80);
                        setFileProgress("sample2", false, 80);
                        Deferred.handlePromise(
                        projectService.addSampleScreensToProject($scope.projectID),
                        function () {
                            $scope.$emit("screenUploadStop");
                        }
                        );
                        $timeout(function () {
                            setFileProgress("sample1", false, 100);
                            setFileProgress("sample2", false, 100);
                            removeFileFromQueue("sample1");
                            removeFileFromQueue("sample2");
                        }, 250);
                    }, 250);
                }, 400);
            };
            var dom = {};
            dom.target = element;
            dom.dropzone = dom.target.find("div.dropzone");
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            dom.macAppAdvert = dom.target.find(".mac-app-cta");
            dom.html5Instructions = dom.target.find(".html5Instructions");
            dom.window = $(window);
            $('.html5Instructions').droppable({
                accept: ".sampleScreens",
                drop: onSampleScreenDrop
            });
            var uploader = new plupload.Uploader({
                runtimes: "html5, flash",
                url: "/api/screens",
                multipart_params: {
                    "projectID": $scope.projectID
                },
                drop_element: "projectUploaderDropzone",
                browse_button: "projectUploaderDropzone",
                container: "projectUploaderContainerBuffer",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,png,pdf"
                }
                ]
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadUploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOAIND: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.isFixedDropzone = false;
            $scope.openMacAppAdvertModal = function ($event) {
                $event.stopPropagation();
                $scope.$parent.openModalWindow("macAppAdvert");
            };
            $scope.hideMacAppAdvert = function () {
                $scope.$parent.hideMacAppAdvert();
            };
            $scope.$watch(
            "!! activeScreens.length",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $timeout(refreshUploader);
            }
            );
            $scope.$watch(
            "projectID",
            function (newValue) {
                uploader.settings.multipart_params.projectID = newValue;
            }
            );
            $scope.$watch(
            "isShowingUploader",
            function (newValue, oldValue) {
                if (newValue === true) {
                    if (!$scope.activeScreens.length) {
                        dom.target.show();
                    } else {
                        var minHeight = dom.target.css("minHeight");
                        dom.target
                        .stop(true, true)
                        .css("minHeight", 0)
                        .slideDown("fast",
                        function () {
                            $(this).css("minHeight", minHeight);
                            refreshUploader();
                        }
                        )
                        ;
                    }
                    dom.window.on(
                    "error.projectUploader",
                    function (event) {
                        if (isFlashRuntime) {
                            return (false);
                        }
                    }
                    );
                    dom.window.on("scroll.projectUploader", handleWindowScroll);
                    handleWindowScroll();
                } else if (newValue === false) {
                    $scope.isFixedDropzone = false;
                    var minHeight = dom.target.css("minHeight");
                    dom.target
                    .stop(true, true)
                    .css("minHeight", 0)
                    .slideUp("fast",
                    function () {
                        $(this).css("minHeight", minHeight);
                    }
                    )
                    ;
                    clearUploader();
                    dom.window.off("error.projectUploader");
                    dom.window.off("scroll.projectUploader");
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                dom.window.off("error.projectUploader");
                dom.window.off("scroll.projectUploader");
                dom.target.remove();
            }
            );
        };
        return ({
            link: linkFunction,
            replace: true,
            scope: true,
            templateUrl: "/assets/apps/d/views/directives/project-uploader.htm"
        });
    }
})(angular, InVision);
;
;
/*! pulse-activity-dialog.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invPulseActivityDialog", Directive);
    /** @ngInject */
    function Directive($document) {
        var linkFunction = function ($scope, element, attributes) {
            var target = $(element);
            var fullWidth = 727;
            var fullHeight = 546;
            target.animate(
            {
                width: fullWidth,
                height: fullHeight
            },
            500
            );
            $document.on(
            "mousedown.invPulseActivityDialog",
            function (event) {
                if ($.contains(target[0], event.target)) {
                    return;
                } else if (
                $(event.target).closest("div.modal-backdrop").length ||
                $(event.target).closest("div.modal").length
                ) {
                    return;
                }
                $scope.$apply(
                function () {
                    $scope.hideSubview();
                }
                );
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                $document.off("mousedown.invPulseActivityDialog");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! realtime.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invRealtime", Directive);
    /** @ngInject */
    function Directive($window, config, Pusher, modelEvents, _) {
        var linkFunction = function ($scope, element, attributes) {
            function buildModelEventTriggerArguments(event, eventType, propertyNames) {
                var triggerArguments = _.map(
                propertyNames,
                function (propertyName) {
                    return (event.data[propertyName]);
                }
                );
                triggerArguments.unshift(eventType);
                return (triggerArguments);
            }
            function mapPushEvent(channel, eventType, property1, property2, propertyN) {
                var propertyNames = _.toArray(arguments);
                var channel = propertyNames.shift();
                var eventType = propertyNames.shift();
                channel.bind(
                eventType,
                function (event) {
                    var triggerArguments = buildModelEventTriggerArguments(event, eventType, propertyNames);
                    $scope.$apply(
                    function () {
                        modelEvents.trigger.apply(modelEvents, triggerArguments);
                    }
                    );
                }
                );
            }
            $window.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR = true;
            Pusher.channel_auth_endpoint = "/api/pusher/authenticate";
            var pusher = new Pusher(config.pusher.appKey);
            var userChannel = pusher.subscribe("private-user-" + config.userID);
            mapPushEvent(userChannel, "projectCreated", "project");
            mapPushEvent(userChannel, "projectUpdated", "project");
            mapPushEvent(userChannel, "projectUserAdded", "projectID", "userID");
            mapPushEvent(userChannel, "projectUserRemoved", "projectID", "userID");
            mapPushEvent(userChannel, "screenDeleted", "screenID");
            mapPushEvent(userChannel, "screenUploaded", "screen");
            mapPushEvent(userChannel, "screenSortUpdated", "projectID", "screens");
            mapPushEvent(userChannel, "dividerDeleted", "dividerID");
            mapPushEvent(userChannel, "dividerCreated", "divider");
            mapPushEvent(userChannel, "dividerUpdated", "divider");
            mapPushEvent(userChannel, "dividerPositionsUpdated", "dividers", "screens");
            mapPushEvent(userChannel, "teamMemberCreated", "teamMember");
            mapPushEvent(userChannel, "teamMemberUpdated", "teamMember");
            mapPushEvent(userChannel, "commentAdded", "commentID", "conversationID");
            mapPushEvent(userChannel, "commentUpdated", "commentID", "conversationID");
            mapPushEvent(userChannel, "commentDeleted", "commentID", "conversationID");
            mapPushEvent(userChannel, "conversationAdded", "conversationID", "screenID");
            mapPushEvent(userChannel, "conversationUpdated", "conversationID");
            mapPushEvent(userChannel, "conversationDeleted", "conversationID");
            var globalChannel = pusher.subscribe("all-users");
            mapPushEvent(globalChannel, "newFeatureAnnounced", "utcArray");
            $scope.$on(
            "$destroy",
            function () {
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! rename-project.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invRenameProject", Directive);
    /** @ngInject */
    function Directive(projectService, validationService) {
        var linkFunction = function ($scope, element, attributes) {
            var getErrorMessage = function (response) {
                if (validationService.isAlreadyExists(response)) {
                    return ("A project with that name already exists. Project names must be unique.");
                }
                if (validationService.isInvalidField(response)) {
                    return ("Your project name contians invalid characters. Try removing some punctuation.");
                }
                return (response.message);
            };
            var handleBlur = function (event) {
                submitForm();
            };
            var handleClick = function (event) {
                showInput();
            };
            var handleKeyPress = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var theChar = String.fromCharCode(event.which);
                if (!isValidCharacter(theChar)) {
                    event.preventDefault();
                }
            };
            var handleKeyUp = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var enterKey = 13;
                var escapeKey = 27;
                if (event.which === enterKey) {
                    submitForm();
                } else if (event.which === escapeKey) {
                    hideInput();
                }
            };
            var hideInput = function () {
                input.popover("destroy");
                input.off("blur.invRenameProject");
                input.off("keypress.invRenameProject");
                input.off("keyup.invRenameProject");
                title.show();
                input.hide();
            };
            var isValidCharacter = function (charToTest) {
                var invalidCharacters = new RegExp("[/\\\\:*?\"<>|]", "i");
                return (invalidCharacters.test(charToTest) === false);
            };
            var showInput = function () {
                input.val($scope.project.name);
                originalValue = input.val();
                title.hide();
                input.on("blur.invRenameProject", handleBlur);
                input.on("keypress.invRenameProject", handleKeyPress);
                input.on("keyup.invRenameProject", handleKeyUp);
                input.show();
                input[0].focus();
                input[0].select();
            };
            var submitForm = function () {
                var newValue = input.val();
                if (newValue === originalValue) {
                    return (hideInput());
                }
                input.popover("destroy");
                request = projectService.renameProject($scope.project.id, newValue);
                request.then(
                function (project) {
                    request = null;
                    hideInput();
                },
                function (response) {
                    request = null;
                    input
                    .popover({
                        content: getErrorMessage(response),
                        placement: "top",
                        title: "Oops: Something Went Wrong",
                        trigger: "manual"
                    })
                    .popover("show");
                    ;
                    input[0].focus();
                    input[0].select();
                }
                );
            };
            var target = $(element);
            var title = target.find("h1");
            var input = $("<input type='text' />")
            .appendTo(target)
            .hide()
            ;
            var originalValue = null;
            var request = null;
            title.on("click.invRenameProject", handleClick);
            $scope.$on(
            "$destroy",
            function () {
                title.off("click.invRenameProject");
                input.off("blur.invRenameProject");
                input.off("keypress.invRenameProject");
                input.off("keyup.invRenameProject");
                input.popover("destroy");
            }
            );
        };
        return ({
            link: linkFunction
        });
    }
})(angular, InVision);
;
;
/*! rename-screen.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invRenameScreen", Directive);
    /** @ngInject */
    function Directive(screenService, validationService) {
        var linkFunction = function ($scope, element, attributes) {
            var getErrorMessage = function (response) {
                if (validationService.isInvalidField(response)) {
                    return ("Your screen name contains invalid characters. Try removing some punctuation.");
                }
                return (response.message);
            };
            var handleBlur = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                submitForm();
            };
            var handleClick = function (event) {
                showInput();
            };
            var handleKeyPress = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var theChar = String.fromCharCode(event.which);
            };
            var handleKeyUp = function (event) {
                if (request) {
                    return (event.preventDefault());
                }
                var enterKey = 13;
                var escapeKey = 27;
                if (event.which === enterKey) {
                    submitForm();
                } else if (event.which === escapeKey) {
                    hideInput();
                }
            };
            var hideInput = function () {
                screenInfo.removeClass("editing");
                input.popover("destroy");
                input.off("blur.invRenameScreen");
                input.off("keypress.invRenameScreen");
                input.off("keyup.invRenameScreen");
                $scope.$emit("screenRenameBlur");
            };
            var showInput = function () {
                input.val($scope.object.name);
                originalValue = input.val();
                screenInfo.addClass("editing");
                input.on("blur.invRenameScreen", handleBlur);
                input.on("keypress.invRenameScreen", handleKeyPress);
                input.on("keyup.invRenameScreen", handleKeyUp);
                input[0].focus();
                input[0].select();
                $scope.$emit("screenRenameFocus");
            };
            var submitForm = function () {
                var newValue = input.val();
                if (
                !newValue ||
                (newValue === originalValue)
                ) {
                    return (hideInput());
                }
                input.popover("destroy");
                request = screenService.renameScreen($scope.object.id, newValue);
                request.then(
                function (screen) {
                    $scope.object.name = newValue;
                    request = null;
                    hideInput();
                },
                function (response) {
                    request = null;
                    input
                    .popover({
                        content: getErrorMessage(response),
                        placement: "top",
                        title: "Oops: Something Went Wrong",
                        trigger: "manual"
                    })
                    .popover("show");
                    ;
                    input[0].focus();
                    input[0].select();
                }
                );
            };
            var target = $(element);
            var screenInfo = target.parents(".screen_info");
            var name = target.find("span.name");
            var input = $("<input type='text' />")
            .addClass("name_new")
            .appendTo(target)
            ;
            var originalValue = null;
            var request = null;
            name.on("click.invRenameScreen", handleClick);
            $scope.$on(
            "$destroy",
            function () {
                name.off("click.invRenameScreen");
                input.off("blur.invRenameScreen");
                input.off("keypress.invRenameScreen");
                input.off("keyup.invRenameScreen");
                input.popover("destroy");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! rotate-slide.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invRotateSlide", Directive);
    /** @ngInject */
    function Directive($timeout, _) {
        var linkFunction = function ($scope, element, attributes) {
            $scope.goToAndPauseRotation = function (index) {
                $scope.currentIndex = index;
                $timeout.cancel(timer);
                timer = $timeout(rotate, timeout * 2);
            };
            function rotate() {
                $scope.currentIndex = ($scope.currentIndex % maxRotations) + 1
                $timeout.cancel(timer);
                timer = $timeout(rotate, timeout);
            };
            var timer = null;
            var timeout = attributes.invRotateSpeed ? (attributes.invRotateSpeed * 1000) : (4 * 1000);
            var currentIndex = ($scope.$parent[attributes.invRotateStartingAt] || 0);
            var target = $(element);
            var items = target.children('.item');
            var maxRotations = items.length;
            $scope.currentIndex = currentIndex;
            rotate();
            $scope.$on(
            "$destroy",
            function () {
                $timeout.cancel(timer);
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: "=attr"
        });
    }
})(angular, InVision);
;
;
/*! rotate.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invRotate", Directive);
    /** @ngInject */
    function Directive($timeout, _) {
        var linkFunction = function ($scope, element, attributes) {
            $scope.currentIndex = 0;
            var timer = null;
            var timeout = attributes.invRotateSpeed ? (attributes.invRotateSpeed * 1000) : (4 * 1000);
            var target = $(element);
            var avatars = target.children(':first');
            var quotes = target.children(':last');
            $scope.goToAndPauseRotation = function (index) {
                $scope.currentIndex = index;
                $timeout.cancel(timer);
                timer = $timeout(rotateQuote, timeout * 2);
            };
            var maxRotations = avatars.children().length;
            var rotateQuote = function () {
                $scope.currentIndex = ($scope.currentIndex % maxRotations) + 1
                $timeout.cancel(timer);
                timer = $timeout(rotateQuote, timeout);
            };
            rotateQuote();
            $scope.$on(
            "$destroy",
            function () {
                $timeout.cancel(timer);
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: "=attr"
        });
    }
})(angular, InVision);
;
;
/*! sample-screens-faux-upload.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invSampleScreensFauxUpload", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            var dom = {};
            dom.target = element;
            $(dom.target).on("dragstart", function (event) {
                event.stopPropagation();
            });
            $(dom.target).draggable({
                revert: 'invalid',
                containment: "#projectUploaderDropzone"
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).draggable("destroy");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! screen-menu-uploader.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invScreenMenuUploader", Directive);
    /** @ngInject */
    function Directive(_, $window, $document, $timeout, modelEvents) {
        var linkFunction = function ($scope, element, attributes) {
            var addFileToQueue = function (id, name, size) {
                uploadQueue.push({
                    id: id,
                    name: name,
                    size: size,
                    percentage: 0,
                    state: $scope.fileStates.PENDING
                });
            };
            var clearStallTimer = function () {
                clearTimeout(stallTimer);
            };
            var clearUploader = function () {
                clearStallTimer();
                uploader.stop();
                uploader.splice(0, uploader.files.length);
                uploadQueue.splice(0, uploadQueue.length);
            };
            var deleteFileFromQueue = function (id) {
                for (var i = 0, length = uploadQueue.length ; i < length ; i++) {
                    if (uploadQueue[i].id == id) {
                        uploadQueue.splice(i, 1);
                        return;
                    }
                }
            };
            var getQueueItemByID = function (id) {
                return (
                _.findWithProperty(uploadQueue, "id", id)
                );
            };
            var handleMouseOut = function (event) {
                if (isMouseEventRelevant(event, dom.dropzone)) {
                    dom.dropzone.removeClass("hotDropzone");
                }
            };
            var handleMouseOver = function (event) {
                if (isMouseEventRelevant(event, dom.dropzone)) {
                    dom.dropzone.addClass("hotDropzone");
                }
            };
            var handlePluploadError = function (uploader, error) {
            };
            var handlePluploadFilesAdded = function (uploader, files) {
                var fileExcludedBasedOnName = null;
                for (var i = (files.length - 1) ; i >= 0 ; i--) {
                    if (!isValidFilename(files[i].name)) {
                        fileExcludedBasedOnName = files[i].name;
                        files.splice(i, 1);
                    }
                }
                if (fileExcludedBasedOnName) {
                    $scope.openModalWindow("error", "The file, \"" + fileExcludedBasedOnName + ",\" was skipped since it doesn't appear to be an image file.");
                }
                files = _.sortOnPropertyUsingNaturalOrder(files, "name");
                for (var i = 0 ; i < files.length ; i++) {
                    addFileToQueue(
                    files[i].id,
                    files[i].name,
                    files[i].size
                    );
                }
                if (files.length) {
                    $scope.$emit("screenUploadStart");
                }
                $scope.$apply();
            };
            var handlePluploadFileUploaded = function (uploader, file, response) {
                uploader.removeFile(file);
                removeFileFromQueue(file.id);
                resetStallTimer();
                $scope.$apply(
                function () {
                    var screen = ng.fromJson(response.response);
                    modelEvents.trigger("screenUploaded", screen);
                }
                );
            };
            var handlePluploadInit = function (uploader, params) {
                isHtml5Runtime = (uploader.runtime === "html5");
                isFlashRuntime = (uploader.runtime === "flash");
                if (isHtml5Runtime) {
                    allowableStallDuration = (5 * 1000);
                    dom.dropzone.on("mouseover dragenter", handleMouseOver);
                    dom.dropzone.on("mouseout dragleave", handleMouseOut);
                    dom.dropzone
                    .removeClass("flashDropzone")
                    .addClass("html5Dropzone")
                    ;
                } else {
                    dom.target.find("div.plupload.flash").on("mouseover", handleMouseOver);
                    dom.target.find("div.plupload.flash").on("mouseout", handleMouseOut);
                    dom.dropzone
                    .removeClass("html5Dropzone")
                    .addClass("flashDropzone")
                }
            };
            var handlePluploadQueueChanged = function (uploader) {
                if (uploader.files.length && isNotUploading()) {
                    $scope.$apply(
                    function () {
                        uploader.start();
                        startStallTimer();
                    }
                    );
                }
            };
            var handlePluploadUploadComplete = function (uploader, files) {
                clearStallTimer();
                $scope.$emit("screenUploadStop");
            };
            var handlePluploadUploadProgress = function (uploader, file) {
                $scope.$apply(
                function () {
                    setFileProgress(
                    file.id,
                    file.uploaded,
                    file.percent
                    );
                    resetStallTimer();
                }
                );
            };
            var isMouseEventRelevant = function (event, element) {
                var relatedTarget = event.relatedTarget;
                var target = $(element);
                if (!relatedTarget) {
                    return (true);
                }
                if (target.is(relatedTarget)) {
                    return (false);
                }
                if (!$.contains(target[0], relatedTarget)) {
                    return (true);
                }
                return (false);
            };
            var isNotUploading = function () {
                return (uploader.state === plupload.STOPPED);
            };
            var isUploading = function () {
                return (uploader.state === plupload.STARTED);
            };
            var isValidFilename = function (name) {
                var pattern = /\.(gif|jpe?g|png|pdf)$/i;
                return (
                pattern.test(name)
                );
            };
            var nudgeUploader = function () {
                return;
                uploader.stop();
                if (uploader.files.length) {
                    uploader.start();
                    startStallTimer();
                }
            };
            var refreshUploader = function () {
                uploader.refresh();
            };
            var removeFileFromQueue = function (id) {
                var queueItem = getQueueItemByID(id);
                queueItem.state = $scope.fileStates.COMPLETED;
                var listItem = dom.files.children("li[ data-id = '" + id + "' ]");
                listItem.fadeOut(
                "slow",
                function () {
                    listItem.remove();
                    deleteFileFromQueue(id);
                    $scope.$apply();
                }
                );
            };
            var resetStallTimer = function () {
                clearTimeout(stallTimer);
                startStallTimer();
            };
            var setFileProgress = function (id, loaded, percent) {
                var queueItem = getQueueItemByID(id);
                queueItem.percentage = percent;
                if (queueItem.state === $scope.fileStates.PENDING) {
                    queueItem.state = $scope.fileStates.UPLOADING;
                }
            };
            var startStallTimer = function () {
                stallTimer = setTimeout(nudgeUploader, allowableStallDuration);
            };
            var dom = {};
            dom.target = element;
            dom.dropzone = dom.target.find("div.dropzone");
            dom.queue = dom.target.find("div.queue");
            dom.files = dom.queue.find("ol.files");
            var uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                url: "/api/screens",
                multipart_params: {
                    "projectID": $scope.projectID
                },
                drop_element: "projectUploaderDropzone",
                browse_button: "projectUploaderDropzone",
                container: "projectUploader",
                flash_swf_url: "/assets/plupload/js/plupload.flash.swf",
                urlstream_upload: true,
                filters: [
                {
                    title: "Image files",
                    extensions: "gif,jpg,jpeg,png,pdf"
                }
                ]
            });
            var isHtml5Runtime = false;
            var isFlashRuntime = false;
            var stallTimer = null;
            var allowableStallDuration = (30 * 1000);
            uploader.bind("Init", handlePluploadInit);
            uploader.bind("Error", handlePluploadError);
            uploader.bind("FilesAdded", handlePluploadFilesAdded);
            uploader.bind("QueueChanged", handlePluploadQueueChanged);
            uploader.bind("UploadProgress", handlePluploadUploadProgress);
            uploader.bind("FileUploaded", handlePluploadFileUploaded);
            uploader.bind("UploadComplete", handlePluploadUploadComplete);
            uploader.init();
            var uploadQueue = $scope.uploadQueue = [];
            $scope.fileStates = {
                PENDING: "PENDING",
                UPLOAIND: "UPLOADING",
                COMPLETED: "COMPLETED"
            };
            $scope.$watch(
            "screens.length",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $timeout(refreshUploader);
            }
            );
            $scope.$watch(
            "isScreenMenuUploaderVisible",
            function (newValue, oldValue) {
                if (newValue === true) {
                    if (!$scope.screens.length) {
                        dom.target.show();
                    } else {
                        dom.target
                        .stop(true, true)
                        .slideDown("fast", refreshUploader)
                        ;
                    }
                    $(window).on(
                    "error.projectUploader",
                    function (event) {
                        if (isFlashRuntime) {
                            return (false);
                        }
                    }
                    );
                } else if (newValue === false) {
                    dom.target
                    .stop(true, true)
                    .slideUp("fast")
                    ;
                    clearUploader();
                    $(window).off("error.projectUploader");
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clearUploader();
                uploader.destroy();
                $(window).off("error.projectUploader");
                dom.target.remove();
            }
            );
        };
        return ({
            replace: true,
            templateUrl: "/assets/apps/d/views/directives/screen-menu-uploader.htm",
            link: linkFunction
        });
    }
})(angular, InVision);
;
;
/*! screen-version-fade-transition.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invScreenVersionFadeTransition", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            function hackForFastSwitching(newImageUrl) {
                dom.target.find("img[src!='" + newImageUrl + "']").remove();
                setImageNoFade(newImageUrl);
            }
            function handleImageSwap(oldImageUrl, newImageUrl) {
                isSwapping = true;
                dom.img.removeAttr("ng-src");
                dom.incomingImg = dom.img.clone(true);
                dom.incomingImg.attr('src', newImageUrl);
                scaleImage();
                dom.img.css({
                    "position": "absolute",
                    "left": dom.img.position().left,
                    "top": dom.img.position().top,
                    "zIndex": 9
                });
                scaleIncomingImage();
                dom.incomingImg.css({
                    "opacity": 0,
                    "zIndex": 10,
                    "position": "relative"
                });
                dom.img.stop();
                dom.incomingImg.stop();
                if (!_.isNull(fadeOutTimer)) {
                    $timeout.cancel(fadeOutTimer);
                    return;
                }
                dom.img.animate(
                { "opacity": "0" },
                {
                    duration: IMAGE_FADE_OUT_DURATION,
                    queue: false,
                    complete: function () {
                        fadeOutTimer = $timeout(
                        function () {
                            dom.img.remove();
                            dom.img = dom.incomingImg;
                            dom.img.removeAttr("style");
                            scaleImage();
                            dom.incomingImg = null;
                            fadeOutTimer = null;
                            isSwapping = false;
                        }, 100
                        );
                    }
                }
                );
                dom.incomingImg.appendTo(dom.target);
                dom.incomingImg.animate(
                { "opacity": 1 },
                {
                    duration: (IMAGE_FADE_OUT_DURATION / 2),
                    queue: false,
                    complete: function () {
                    }
                }
                );
            }
            function setImageNoFade(imageUrl) {
                dom.img.attr('src', imageUrl);
                scaleImage();
            }
            function scaleImage() {
                var imageWidth = dom.img[0].naturalWidth;
                var imageHeight = dom.img[0].naturalHeight;
                if (!isNaN(imageWidth) && !isNaN(parseInt($scope.project.mobileTemplate.viewportWidth))) {
                    var displayScale = (parseInt($scope.project.mobileTemplate.viewportWidth) / imageWidth);
                    var scaledWidth = displayScale * imageWidth;
                    var scaledHeight = displayScale * imageHeight;
                    dom.img.css({
                        height: scaledHeight + "px",
                        width: scaledWidth + "px"
                    });
                }
            }
            function scaleIncomingImage() {
                var imageWidth = dom.incomingImg[0].naturalWidth;
                var imageHeight = dom.incomingImg[0].naturalHeight;
                if (!isNaN(imageWidth) && !isNaN(parseInt($scope.project.mobileTemplate.viewportWidth))) {
                    var displayScale = (parseInt($scope.project.mobileTemplate.viewportWidth) / imageWidth);
                    var scaledWidth = displayScale * imageWidth;
                    var scaledHeight = displayScale * imageHeight;
                    dom.incomingImg.css({
                        height: scaledHeight + "px",
                        width: scaledWidth + "px"
                    });
                }
            }
            function setVersionChangeTimer() {
                versionChangeTimer = $timeout(
                function () {
                    var hasImageLoaded = (dom.incomingImg ? dom.incomingImg[0].complete : dom.img[0].complete);
                    if (!hasImageLoaded) {
                        $scope.setIsImageLoading(true);
                    }
                },
                IMAGE_FADE_OUT_DURATION
                );
            }
            var IMAGE_FADE_OUT_DURATION = 300;
            var dom = {};
            var fadeOutTimer = null;
            var isSwapping = false;
            var swapWithFade = true;
            var versionChangeTimer = null;
            dom.target = $(element);
            dom.img = dom.target.find("img.screenImage");
            dom.incomingImg = null;
            $scope.$watch(
            "isFullBrowser",
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                if (newValue) {
                    swapWithFade = false;
                } else {
                    swapWithFade = true;
                }
            }
            );
            $scope.$watch(
            "activeVersion.imageUrl",
            function (newValue, oldValue) {
                if (_.isNull(newValue) && _.isNull(oldValue)) {
                    return;
                }
                $timeout.cancel(versionChangeTimer);
                setVersionChangeTimer();
                if (!_.isNull(newValue) && _.isNull(oldValue)) {
                    setImageNoFade(newValue);
                    return;
                }
                if (newValue !== oldValue) {
                    if (dom.target.find('img.screenImage').length > 1) {
                        hackForFastSwitching(oldValue);
                    } else {
                        if (!swapWithFade) {
                            setImageNoFade(newValue);
                        } else {
                            handleImageSwap(oldValue, newValue);
                        }
                    }
                }
            }
            );
            $scope.$on("historyImageLoaded", function () {
                $timeout.cancel(versionChangeTimer);
            });
            $scope.$on(
            "$destroy",
            function () {
                $timeout.cancel(versionChangeTimer);
            }
            );
            setVersionChangeTimer();
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! screen-version-image-scaler.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invScreenVersionImageScaler", Directive);
    /** @ngInject */
    function Directive() {
        function link($scope, element, attributes) {
            element.on(
            "load.invHistoryImageLoadEvent",
            function (event) {
                scaleImage();
            }
            );
            function scaleImage() {
                var imageWidth = element[0].naturalWidth;
                var imageHeight = element[0].naturalHeight;
                if (!isNaN(imageWidth) && !isNaN(parseInt($scope.project.mobileTemplate.viewportWidth))) {
                    var displayScale = (parseInt($scope.project.mobileTemplate.viewportWidth) / imageWidth);
                    var scaledWidth = displayScale * imageWidth;
                    var scaledHeight = displayScale * imageHeight;
                    element.css({
                        height: scaledHeight + "px",
                        width: scaledWidth + "px"
                    });
                }
            }
            $scope.$watch(
            "activeVersion.imageUrl",
            function (oldImageUrl, newImageUrl) {
                if (oldImageUrl != newImageUrl) {
                    scaleImage();
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                element.off("load.invHistoryImageLoadEvent");
            }
            );
        }
        return ({
            link: link,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! screen-version-share-form.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invScreenVersionShareForm", Directive);
    /** @ngInject */
    function Directive($timeout, ZeroClipboard) {
        var linkFunction = function ($scope, element, attributes) {
            function handleCopySuccess() {
                $scope.showSuccessMessage = true;
                $scope.$apply();
                if (dom.copied.is(".highlight")) {
                    dom.copied.removeClass("highlight highlight-out");
                    clearTimeout(handleCopySuccess.timer1);
                    clearTimeout(handleCopySuccess.timer2);
                }
                dom.copied.addClass("highlight");
                handleCopySuccess.timer1 = setTimeout(
                function () {
                    dom.copied.addClass("highlight-out");
                },
                (1 * 1000)
                );
                handleCopySuccess.timer2 = setTimeout(
                function () {
                    dom.copied.removeClass("highlight highlight-out");
                },
                (2.5 * 1000)
                );
            }
            function handleKeyChange() {
                dom.shareLink[0].select();
                clipboard.setText(dom.shareLink.val());
            }
            function handleInit() {
                clipboard.glue(dom.copyButton[0], dom.copyButtonContainer[0]);
            }
            var dom = {};
            dom.target = $(element);
            dom.shareLink = dom.target.find("input.zeroClipboardText");
            dom.copyButtonContainer = dom.target.find("div.zeroClipboardContainer");
            dom.copyButton = dom.copyButtonContainer.find("a.zeroClipboardButton");
            dom.copied = dom.target.find("div.copied_successful span");
            var clipboard = new ZeroClipboard.Client();
            clipboard.setHandCursor(true);
            clipboard.addEventListener("onComplete", handleCopySuccess);
            $scope.$watch(
            "isShowingShareUI",
            function (isShowingShareUI) {
                if (isShowingShareUI) {
                    $timeout(handleInit, 500);
                }
            }
            );
            $scope.$watch(
            "shareLink",
            function (shareLink) {
                if ($scope.isLoading) {
                    return;
                }
                $timeout(handleKeyChange, ($scope.isShowingShareUI ? 500 : 0));
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                clipboard.destroy();
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! scroll-on-submit.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invScrollOnSubmit", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var scrollToTarget = function () {
                var targetOffset = target.offset();
                var offsetTop = Math.max(0, (targetOffset.top + scrollOffset));
                $(window).scrollTop(offsetTop);
            };
            var target = $(element);
            var scrollOffset = -25;
            if ("scrollOffset" in attributes) {
                scrollOffset = parseInt(attributes.scrollOffset);
            }
            target.on(
            "submit.invScrollOnSubmit",
            function (event) {
                scrollToTarget();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.off("submit.invScrollOnSubmit");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! select.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invSelect", Directive);
    /** @ngInject */
    function Directive($timeout) {
        var linkFunction = function ($scope, element, attributes) {
            $timeout(function () {
                $(element).addClass('selectPicker');
                $timeout(function () {
                    $(element).selectpicker();
                });
                $(element).parent().on("click", ".selectPicker", function () {
                    $scope.$apply(attributes.ngClick);
                });
            });
            $scope.$on(
            "$destroy",
            function () {
                $(element).remove();
            }
            );
        }
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! slice-helper.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive(
    "invSliceHelper",
    function ($document, $timeout, _) {
        var linkFunction = function ($scope, element, attributes, keyCombosController) {
            function flashHotspots() {
                var hotspots = element.closest("#project-console").find(".hotspotOverlay");
                hotspots.stop(true).fadeTo(300, 1).delay(300).fadeTo(300, 0);
            }
            element.on("mousedown.slice", function (event) {
                event.preventDefault();
                if (!$(event.target).hasClass('hotspotOverlay')) {
                    flashHotspots();
                }
                return false;
            });
            $scope.$on(
            "$destroy",
            function () {
                element.off("mousedown.slice");
            }
            );
        }
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
    );
})(angular, InVision);
;
;
/*! slide-show.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invSlideShow", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            var slideDuration = (attributes.slideDuration || "fast");
            if (!$scope.$eval(attributes.invSlideShow)) {
                element.css("display", "none");
            }
            $scope.$watch(
            attributes.invSlideShow,
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                if (newValue) {
                    element.stop(true, true).slideDown(slideDuration);
                } else {
                    element.stop(true, true).slideUp(slideDuration);
                }
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! template-dropdown-menu.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invTemplateDropdownMenu", Directive);
    /** @ngInject */
    function Directive(_, $window, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var window = $($window);
                var WINDOW_OFFSET = 190;
                var TEMPLATE_HEIGHT = 61;
                var isScrollbarAdded = false;
                function adjustHeight() {
                    element.css("height", getCalculatedHeight());
                }
                function adjustScrollbarHeight(isResize) {
                    var height = getCalculatedHeight();
                    var templatesHeight = getTotalTemplates() * TEMPLATE_HEIGHT;
                    var maxMenuSize = window.height() - WINDOW_OFFSET;
                    $timeout(function () {
                        element.find(".viewport").height("100%");
                        if (!height || templatesHeight < maxMenuSize) {
                            element.find(".overview").height("100%");
                            element.addClass("noscroll");
                        }
                        else {
                            element.removeClass("noscroll");
                            element.find(".overview").height(getTotalTemplates() * TEMPLATE_HEIGHT);
                            if (!isScrollbarAdded || isResize) {
                                scrollableList.tinyscrollbar({ size: height });
                                isScrollbarAdded = true;
                            }
                            else {
                                scrollableList.tinyscrollbar_update("relative");
                            }
                        }
                    }, 50);
                }
                function getCalculatedHeight() {
                    var height = window.height() - WINDOW_OFFSET;
                    var templateCount = getTotalTemplates();
                    var templateListSize = templateCount * TEMPLATE_HEIGHT;
                    if (templateListSize < height) {
                        return templateListSize;
                    }
                    else {
                        return height;
                    }
                }
                function getTotalTemplates() {
                    var templateCount = 0;
                    _.each($scope.templates, function (template) {
                        if (!template.isDeleted) {
                            templateCount++;
                        }
                    });
                    return templateCount;
                }
                function scrollToBottom() {
                    $timeout(function () {
                        element.scrollTop(9999999);
                    }, 20);
                }
                function addScrollbarElements() {
                    element
                    .wrapInner("<div class='overview'>")
                    .wrapInner("<div class='viewport'>")
                    .prepend("<div unselectable='on' class='scrollbar unselectable'><div class='track'><div class='thumb'><div class='end'></div></div></div></div>");
                }
                $scope.$on("templateDeleted", function (event) {
                    adjustHeight();
                    adjustScrollbarHeight();
                });
                $scope.$on("templateAdded", function (event) {
                    adjustHeight();
                    adjustScrollbarHeight();
                });
                $scope.$on("templateDuplicated", function (event) {
                    adjustHeight();
                    adjustScrollbarHeight();
                });
                var dropdownButton = element.parents(".dropdown").find(".dropdown-toggle");
                var scrollableList = element;
                var addNewTemplate = element.parent().find(".add-new-template");
                dropdownButton.on("click", function () {
                    adjustHeight();
                    adjustScrollbarHeight();
                });
                addNewTemplate.on("click", function (event) {
                    event.preventDefault();
                    return false;
                });
                addNewTemplate.find("a").on("click", scrollToBottom);
                window.resize(function () {
                    adjustHeight();
                    adjustScrollbarHeight(true);
                });
                $timeout(addScrollbarElements, 1, false);
                $timeout(adjustHeight);
            }
        };
    }
})(angular, InVision);
;
;
/*! tinyscrollbar.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invTinyscrollbar", Directive);
    /** @ngInject */
    function Directive($timeout, _) {
        var linkFunction = function ($scope, element, attributes) {
            var target = $(element);
            target
            .wrapInner("<div class='overview'>")
            .wrapInner("<div class='viewport'>")
            .prepend("<div unselectable='on' class='scrollbar unselectable'><div unselectable='on' class='track unselectable'><div unselectable='on' class='thumb unselectable'><div unselectable='on' class='end unselectable'></div></div></div></div>")
            .tinyscrollbar({
                axis: "y"
            });
            ;
            var viewport = target.children("div.viewport");
            var overview = viewport.children("div.overview");
            var scrollbar = target.children("div.scrollbar");
            scrollbar.on(
            "mousedown.invTinyscrollbar selectstart.invTinyscrollbar",
            function (event) {
                event.preventDefault();
            }
            );
            $scope.$watch(
            function () {
                return (overview.height());
            },
            function (newValue) {
                target.tinyscrollbar_update();
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                target.remove();
                scrollbar.off("mousedown.invTinyscrollbar");
                scrollbar.off("selectstart.invTinyscrollbar");
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! toggle.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invToggle", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes, modelController) {
            function applyModelValue(value) {
                if (value) {
                    element
                    .addClass("on")
                    .removeClass("off")
                    ;
                } else {
                    element
                    .addClass("off")
                    .removeClass("on")
                    ;
                }
            }
            function toggle() {
                var newValue = !modelController.$modelValue;
                applyModelValue(newValue);
                modelController.$setViewValue(newValue);
            }
            var thumb = element.find("a.toggle-thumb");
            thumb.on(
            "click.invToggle",
            function (event) {
                event.preventDefault();
                $scope.$apply(toggle);
            }
            );
            modelController.$render = function () {
                applyModelValue(modelController.$modelValue);
            };
            $scope.$on(
            "$destroy",
            function () {
                thumb.off("click.invToggle");
            }
            );
        };
        return ({
            link: linkFunction,
            replace: true,
            require: "^ngModel",
            restrict: "A",
            templateUrl: "/assets/apps/d/views/directives/toggle.htm"
        });
    }
})(angular, InVision);
;
;
/*! tooltip.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invTooltip", Directive);
    /** @ngInject */
    function Directive() {
        var linkFunction = function ($scope, element, attributes) {
            function tryToKillTooltip() {
                if (tooltipInstance) {
                    tooltipInstance.show = ng.noop;
                    if (tooltipInstance.$tip) {
                        tooltipInstance.$tip.remove();
                    }
                }
                target.tooltip("destroy");
            }
            var target = $(element);
            var tooltipInstance = null;
            var placement = (attributes.placement || "top");
            attributes.$observe(
            "tooltipDisabled",
            function (newValue) {
                newValue = (newValue || "false");
                var isEnabled = (newValue === "false");
                if (isEnabled) {
                    var tooltipOptions = {
                        placement: placement,
                        delay: 100,
                        title: function () {
                            return (attributes.invTooltip);
                        }
                    };
                    if (attributes.tooltipWidth === "content") {
                        tooltipOptions.template = "<div class=\"tooltip content-width\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>";
                    }
                    target.tooltip(tooltipOptions);
                    tooltipInstance = target.data("tooltip");
                } else {
                    tryToKillTooltip();
                }
            }
            );
            $scope.$on(
            "$destroy",
            function () {
                tryToKillTooltip();
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A"
        });
    }
})(angular, InVision);
;
;
/*! uniform.js */
;
;
(function (ng, app) {
    "use strict";
    app.directive("invUniform", Directive);
    /** @ngInject */
    function Directive() {
        var pendingTimer = null;
        var pending = [];
        function dequeueLink() {
            for (var i = 0, length = pending.length ; i < length ; i++) {
                pending[i]();
            }
            pendingTimer = null;
            pending = [];
        }
        function queueLink(linkHandler) {
            pending.push(linkHandler);
            if (!pendingTimer) {
                pendingTimer = setTimeout(dequeueLink, 50);
            }
        }
        var linkFunction = function ($scope, element, attributes) {
            queueLink(
            function () {
                $(element).uniform();
                $scope.$watch(
                attributes.ngModel,
                function (newValue, oldValue) {
                    $.uniform.update(element);
                }
                );
            }
            );
        };
        return ({
            link: linkFunction,
            restrict: "A",
            scope: false
        });
    }
})(angular, InVision);
;
;
/*! account-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("accountService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function changePassword(newPassword, confirmationPassword) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "changePassword",
                parameters: {
                    newPassword: newPassword,
                    confirmationPassword: confirmationPassword
                }
            });
            return (promise);
        }
        function importGravatarAvatar(email) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "importGravatarAvatar",
                parameters: {
                    email: email
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function importTwitterAvatar(username) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "importTwitterAvatar",
                parameters: {
                    username: username
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function markMacAppAdvertisementClosed() {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "markMacAppAdvertisementClosed",
                parameters: {
                    markMacAppAdvertisementClosed: true
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function markTeamSetupTipClosed(oneOrTwo) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "markTeamSetupTipClosed",
                parameters: {
                    markTeamSetupTipClosed: oneOrTwo
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function markAssetTourClosed() {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "markAssetTourClosed",
                parameters: {
                    markAssetTourClosed: true
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function sawConsoleIntroModal(hasSeenConsoleIntroModal) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sawConsoleIntroModal",
                parameters: {
                    hasSeenConsoleIntroModal: hasSeenConsoleIntroModal
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function sawDashbourdTour(hasSeenDashboardTour) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sawDashbourdTour",
                parameters: {
                    hasSeenDashboardTour: hasSeenDashboardTour
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function sendEnterpriseInfoRequest(leadType) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sendEnterpriseInfoRequest",
                parameters: {
                    leadType: leadType
                }
            });
            return (promise);
        }
        function sendEnterpriseChangePlan(plan) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sendEnterpriseChangePlan",
                parameters: {
                    planName: plan.name
                }
            });
            return (promise);
        }
        function submitSupportTicket(supportType, description, isPriority) {
            var isPriority = isPriority ? isPriority : false;
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "submitSupportTicket",
                parameters: {
                    supportType: supportType,
                    description: description,
                    isPriority: isPriority
                }
            });
            return (promise);
        }
        function updateCompany(options) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateCompany",
                parameters: options,
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function updateFeatureAnnouncementsLastViewedAt(dateTimeInMillisecs) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateFeatureAnnouncementsLastViewedAt",
                parameters: {
                    featureAnnouncementsLastViewedAt: dateTimeInMillisecs
                },
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        function updateProfile(options) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateProfile",
                parameters: options,
                successCallback: function (response) {
                    modelEvents.trigger("accountUpdated", response);
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/account/:command",
        {
            command: "@command"
        },
        {
            changePassword: {
                method: "POST",
                params: {
                    command: "change-password"
                }
            },
            importGravatarAvatar: {
                method: "POST",
                params: {
                    command: "import-gravatar-avatar"
                }
            },
            importTwitterAvatar: {
                method: "POST",
                params: {
                    command: "import-twitter-avatar"
                }
            },
            markMacAppAdvertisementClosed: {
                method: "POST",
                params: {
                    command: "mark-mac-app-advertisement-closed"
                }
            },
            markTeamSetupTipClosed: {
                method: "POST",
                params: {
                    command: "mark-team-setup-tip-closed"
                }
            },
            markAssetTourClosed: {
                method: "POST",
                params: {
                    command: "mark-asset-tour-closed"
                }
            },
            sawConsoleIntroModal: {
                method: "POST",
                params: {
                    command: "has-seen-console-intro"
                }
            },
            sawDashbourdTour: {
                method: "POST",
                params: {
                    command: "has-seen-dashboard-tour"
                }
            },
            sendEnterpriseInfoRequest: {
                method: "POST",
                params: {
                    command: "wants-enterprise-info"
                }
            },
            sendEnterpriseChangePlan: {
                method: "POST",
                params: {
                    command: "enterprise-change-plan"
                }
            },
            submitSupportTicket: {
                method: "POST",
                params: {
                    command: "submit-support-ticket"
                }
            },
            updateCompany: {
                method: "POST",
                params: {
                    command: "update-company"
                }
            },
            updateFeatureAnnouncementsLastViewedAt: {
                method: "POST",
                params: {
                    command: "update-feature-announcements-last-viewed"
                }
            },
            updateProfile: {
                method: "POST",
                params: {
                    command: "update-profile"
                }
            }
        }
        );
        return ({
            changePassword: changePassword,
            importGravatarAvatar: importGravatarAvatar,
            importTwitterAvatar: importTwitterAvatar,
            markAssetTourClosed: markAssetTourClosed,
            markMacAppAdvertisementClosed: markMacAppAdvertisementClosed,
            markTeamSetupTipClosed: markTeamSetupTipClosed,
            sawConsoleIntroModal: sawConsoleIntroModal,
            sawDashbourdTour: sawDashbourdTour,
            sendEnterpriseInfoRequest: sendEnterpriseInfoRequest,
            sendEnterpriseChangePlan: sendEnterpriseChangePlan,
            submitSupportTicket: submitSupportTicket,
            updateCompany: updateCompany,
            updateFeatureAnnouncementsLastViewedAt: updateFeatureAnnouncementsLastViewedAt,
            updateProfile: updateProfile
        });
    }
})(angular, InVision);
;
;
/*! asset-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("assetService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function deleteAsset(assetID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "deleteAsset",
                parameters: {
                    id: assetID
                },
                successCallback: function (response) {
                    modelEvents.trigger("assetDeleted", assetID);
                }
            });
            return (promise);
        }
        function updateSort(projectID, assetIDs) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateSort",
                parameters: {
                    projectID: projectID,
                    assetIDs: assetIDs.join(",")
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectAssetsSorted", projectID, assetIDs);
                }
            });
            return (promise);
        }
        function subscribeToAsset(assetID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "subscribeToAsset",
                parameters: {
                    assetID: assetID
                },
                successCallback: function (response) {
                    modelEvents.trigger("assetSubscribed", assetID);
                }
            });
            return (promise);
        }
        function unSubscribeToAsset(assetID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "unSubscribeToAsset",
                parameters: {
                    assetID: assetID
                },
                successCallback: function (response) {
                    modelEvents.trigger("assetUnSubscribed", assetID);
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/assets/:listCommand:id/:docCommand",
        {
            id: "@id",
            listCommand: "@listCommand",
            docCommand: "@docCommand"
        },
        {
            deleteAsset: {
                method: "DELETE"
            },
            updateSort: {
                method: "POST",
                isArray: true,
                params: {
                    listCommand: "update-sort"
                }
            },
            subscribeToAsset: {
                method: "POST",
                isArray: true,
                params: {
                    listCommand: "subscribe"
                }
            },
            unSubscribeToAsset: {
                method: "POST",
                isArray: true,
                params: {
                    listCommand: "unSubscribe"
                }
            }
        }
        );
        return ({
            deleteAsset: deleteAsset,
            updateSort: updateSort,
            subscribeToAsset: subscribeToAsset,
            unSubscribeToAsset: unSubscribeToAsset
        });
    }
})(angular, InVision);
;
;
/*! base-resource-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.value("BaseResourceService", BaseResourceService);
    /** @ngInject */
    function BaseResourceService($resource, Deferred) {
        assignPrototypeMethods(BaseResourceService, this);
        this.Resource = $resource;
        this.Deferred = Deferred;
        this.resource = null;
        return (this);
    }
    BaseResourceService.prototype = {
        applyCacheIfAvailable: function (deferred, resourceResponse, cachedResponse) {
            if (cachedResponse !== null) {
                deferred.resolve(
                this.applyCacheToResourceResponse(resourceResponse, cachedResponse)
                );
            }
        },
        applyCacheToResourceResponse: function (resourceResponse, cachedResponse) {
            if (ng.isArray(resourceResponse)) {
                resourceResponse.splice.apply(
                resourceResponse,
                [0, 0].concat(cachedResponse)
                );
            } else {
                ng.extend(resourceResponse, cachedResponse);
            }
            return (resourceResponse);
        },
        bindMethod: function (method) {
            if (ng.isString(method)) {
                method = this[method];
            }
            return (
            ng.bind(this, method)
            );
        },
        executeCacheableResourceRequest: function (options) {
            var name = options.name;
            var parameters = (options.parameters || {});
            var cachedResponse = (options.cachedResponse || null);
            var successCallback = (options.successCallback || ng.noop);
            var errorCallback = (options.errorCallback || ng.noop);
            var deferred = new this.Deferred();
            var resourceResponse = this.resource[name](
            parameters,
            this.bindMethod(
            function (response) {
                successCallback.call(this, response);
                deferred.resolve(response);
            }
            ),
            this.bindMethod(
            function (response) {
                errorCallback.call(this, response);
                deferred.reject(
                this.unwrapErrorMessage(response)
                );
            }
            )
            );
            this.applyCacheIfAvailable(deferred, resourceResponse, cachedResponse);
            return (deferred.promise);
        },
        interceptResourceMethods: function (methodMap) {
            var service = this;
            var resource = this.resource;
            ng.forEach(
            methodMap,
            function (serviceMethodName, resourceMethodName) {
                resource.prototype[resourceMethodName] = function () {
                    return (
                    service[serviceMethodName](this)
                    );
                };
            }
            );
        },
        rejectDeferredOnResourceError: function (deferred) {
            var errorHandler = this.bindMethod(
            function (response) {
                deferred.reject(
                this.unwrapErrorMessage(response)
                );
            }
            );
            return (errorHandler);
        },
        toArray: function (fakeArray) {
            return (
            Array.prototype.slice.call(fakeArray)
            );
        },
        unwrapErrorMessage: function (errorResponse) {
            try {
                var response = ng.fromJson(errorResponse.data);
                if (ng.isString(response)) {
                    response = {
                        message: response,
                        code: -1
                    };
                }
            } catch (error) {
                var response = {
                    message: errorResponse.data,
                    code: -1
                };
            }
            return (response);
        }
    };
    function assignPrototypeMethods(constructorMethod, context) {
        for (var methodName in constructorMethod.prototype) {
            if (
            constructorMethod.prototype.hasOwnProperty(methodName) &&
            !context[methodName]
            ) {
                context[methodName] = constructorMethod.prototype[methodName];
            }
        }
    }
})(angular, InVision);
;
;
/*! before-unload-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("beforeUnloadService", BeforeUnloadService);
    /** @ngInject */
    function BeforeUnloadService($window, _) {
        this.functionQueue = [];
        $window.onbeforeunload = ng.bind(this, this.run);
        return (this);
    }
    BeforeUnloadService.prototype = {
        run: function () {
            ng.forEach(this.functionQueue, function (bundle) {
                bundle.funcRef.apply(bundle.context, bundle.args);
            });
        },
        push: function (context, funcRef, args) {
            if (_.isUndefined(funcRef) || !_.isFunction(funcRef)) {
                funcRef = ng.noop;
            }
            this.functionQueue.push({
                context: context,
                funcRef: funcRef,
                args: args
            });
        }
    };
})(angular, InVision);
;
;
/*! billing-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("billingService", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, sessionService) {
        function getCountries() {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "getCountries",
                cachedResponse: cache.getResponse("countries"),
                successCallback: function (response) {
                    cache.setResponse("countries", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("countries");
                }
            });
            return (promise);
        }
        function getInvoices() {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "getInvoices",
                cachedResponse: cache.getResponse("invoices"),
                successCallback: function (response) {
                    cache.setResponse("invoices", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("invoices");
                }
            });
            return (promise);
        }
        function getPaymentInfo() {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "getPaymentInfo",
                cachedResponse: cache.getResponse("paymentInfo"),
                successCallback: function (response) {
                    cache.setResponse("paymentInfo", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("paymentInfo");
                }
            });
            return (promise);
        }
        function changeCreditCard(
        hasCardChanged,
        hasOtherBillingInfoChanged,
        billingFirstName,
        billingLastName,
        cardDigits,
        cardExpirationMonth,
        cardExpirationYear,
        cardCSV,
        company,
        billingAddress1,
        billingAddress2,
        billingCity,
        billingState,
        billingZip,
        billingCountry
        ) {
            var params = {
                billingFirstName: billingFirstName,
                billingLastName: billingLastName,
                company: company,
                billingAddress1: billingAddress1,
                billingAddress2: billingAddress2,
                billingCity: billingCity,
                billingState: billingState,
                billingZip: billingZip,
                billingCountry: billingCountry,
                shouldUpdateNonCardInfo: hasOtherBillingInfoChanged
            };
            if (hasCardChanged) {
                params.cardDigits = cardDigits;
                params.expirationMonth = cardExpirationMonth;
                params.expirationYear = cardExpirationYear;
                params.csv = cardCSV;
            }
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "changeCreditCard",
                successCallback: function (response) {
                    cache.setResponse("paymentInfo", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("paymentInfo");
                },
                parameters: params
            });
            return (promise);
        }
        var cache = new PartialCache("billingServiceCache");
        var resource = $resource(
        "/api/billing/:command",
        {
            command: "@command"
        },
        {
            getCountries: {
                method: "GET",
                isArray: true,
                params: {
                    command: "get-countries"
                }
            },
            getInvoices: {
                method: "GET",
                isArray: true,
                params: {
                    command: "get-invoices"
                }
            },
            getPaymentInfo: {
                method: "GET",
                isArray: false,
                params: {
                    command: "get-payment-info"
                }
            },
            changeCreditCard: {
                method: "POST",
                params: {
                    command: "change-credit-card"
                }
            }
        }
        );
        return ({
            getCountries: getCountries,
            getInvoices: getInvoices,
            getPaymentInfo: getPaymentInfo,
            changeCreditCard: changeCreditCard
        });
    }
})(angular, InVision);
;
;
/*! cache.js */
;
;
(function (ng, app) {
    "use strict";
    app.value("Cache", Cache);
    function Cache(uniqueIdentifier, initialCollection) {
        this.uniqueIdentifier = (uniqueIdentifier || "id");
        this.cache = (initialCollection || null);
        return (this);
    }
    Cache.prototype = {
        addItem: function (item) {
            if (this.cache === null) {
                return (
                this.replaceCache([ng.copy(item)])
                );
            }
            this.cache.push(
            ng.copy(item)
            );
        },
        addItems: function (items) {
            for (var i = 0 ; items.length ; i++) {
                this.addItem(items[i]);
            }
        },
        clearCache: function () {
            this.cache = [];
        },
        deleteItem: function (item) {
            var name = this.uniqueIdentifier;
            var value = item[this.uniqueIdentifier];
            return (
            this.deleteItemByProperty(name, value)
            );
        },
        deleteItemsByFilter: function (filter) {
            if (this.cache === null) {
                return;
            }
            for (var i = (this.cache.length - 1) ; i >= 0 ; i--) {
                if (filter(this.cache[i]) === true) {
                    this.cache.splice(i, 1);
                }
            }
        },
        deleteItemByFilter: function (filter) {
            if (this.cache === null) {
                return;
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (filter(this.cache[i]) === true) {
                    this.cache.splice(i, 1);
                    return;
                }
            }
        },
        deleteItemByProperty: function (name, value) {
            if (this.cache === null) {
                return;
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (this.cache[i][name] === value) {
                    this.cache.splice(i, 1);
                    return;
                }
            }
        },
        deleteItems: function (items) {
            if (this.cache === null) {
                return;
            }
            for (var i = 0 ; i < items.length ; i++) {
                this.deleteItem(items[i]);
            }
        },
        deleteItemsByProperty: function (name, value) {
            if (this.cache === null) {
                return;
            }
            for (var i = (this.cache.length - 1) ; i >= 0 ; i--) {
                if (this.cache[i][name] === value) {
                    this.cache.splice(i, 1);
                }
            }
        },
        deleteItemsByPropertyRange: function (name, valueRange) {
            if (this.cache === null) {
                return;
            }
            for (var i = 0 ; i < valueRange.length ; i++) {
                this.deleteItemsByProperty(name, valueRange[i]);
            }
        },
        getCache: function () {
            if (this.cache === null) {
                return (null);
            }
            return (
            ng.copy(this.cache)
            );
        },
        getItemByFilter: function (filter) {
            if (this.cache === null) {
                return (null);
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (filter(this.cache[i]) === true) {
                    return (
                    ng.copy(this.cache[i])
                    );
                }
            }
            return (null);
        },
        getItemByProperty: function (name, value) {
            if (this.cache === null) {
                return (null);
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (this.cache[i][name] === value) {
                    return (
                    ng.copy(this.cache[i])
                    );
                }
            }
            return (null);
        },
        getItemsByFilter: function (filter) {
            if (this.cache === null) {
                return (null);
            }
            var items = [];
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (filter(this.cache[i]) === true) {
                    items.push(
                    ng.copy(this.cache[i])
                    );
                }
            }
            if (items.length) {
                return (items);
            }
            return (null);
        },
        getItemsByProperty: function (name, value) {
            if (this.cache === null) {
                return (null);
            }
            var items = [];
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (this.cache[i][name] === value) {
                    items.push(
                    ng.copy(this.cache[i])
                    );
                }
            }
            if (items.length) {
                return (items);
            }
            return (null);
        },
        getItemsByPropertyRange: function (name, valueRange) {
            if (this.cache === null) {
                return (null);
            }
            var items = [];
            for (var i = 0 ; i < valueRange.length ; i++) {
                var matchingItems = this.getItemsByProperty(name, valueRange[i]);
                if (matchingItems) {
                    items = items.concat(matchingItems);
                }
            }
            if (items.length) {
                return (items);
            }
            return (null);
        },
        getItemsByRange: function (valueRange) {
            return (
            this.getItemsByPropertyRange(
            this.uniqueIdentifier,
            valueRange
            )
            );
        },
        hasItem: function (value) {
            if (this.getItemByProperty(this.uniqueIdentifier, value)) {
                return (true);
            }
            return (false);
        },
        processPromiseInCacheContext: function (promise, successCallback, errorCallback) {
            var _this = this;
            promise.then(
            function () {
                (successCallback || ng.noop).apply(_this, arguments);
            },
            function () {
                (errorCallback || ng.noop).apply(_this, arguments);
            }
            );
            return (promise);
        },
        replaceCache: function (collection) {
            this.cache = ng.copy(collection);
        },
        replaceItem: function (item) {
            this.replaceItemByProperty(
            this.uniqueIdentifier,
            item
            );
        },
        replaceItemByFilter: function (filter, item) {
            if (this.cache === null) {
                return (
                this.replaceCache([ng.copy(item)])
                );
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (filter(this.cache[i]) === true) {
                    this.cache[i] = ng.copy(item);
                    return;
                }
            }
            this.cache.push(ng.copy(item));
        },
        replaceItemByProperty: function (name, item) {
            if (this.cache === null) {
                return (
                this.replaceCache([ng.copy(item)])
                );
            }
            for (var i = 0 ; i < this.cache.length ; i++) {
                if (this.cache[i][name] === item[name]) {
                    this.cache[i] = ng.copy(item);
                    return;
                }
            }
            this.cache.push(ng.copy(item));
        },
        replaceItems: function (items) {
            this.replaceItemsByProperty(
            this.uniqueIdentifier,
            items
            );
        },
        replaceItemsByProperty: function (name, items) {
            for (var i = 0 ; i < items.length ; i++) {
                this.replaceItemByProperty(name, items[i]);
            }
        },
        resetItemsByFilter: function (filter, items) {
            this.deleteItemsByFilter(filter);
            this.replaceItems(items);
        },
        resetItemsByProperty: function (name, value, items) {
            this.deleteItemsByProperty(name, value);
            this.replaceItems(items);
        }
    };
})(angular, InVision);
;
;
/*! conversation-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("conversationService", ConversationService);
    /** @ngInject */
    function ConversationService(_, $resource, serviceHelper, modelEvents) {
        function getConversation(conversationID) {
            var promise = serviceHelper.executeRequest({
                resource: ConversationResource,
                name: "get",
                parameters: {
                    id: conversationID
                },
                successCallback: function (conversation) {
                }
            });
            return promise;
        }
        function getComment(commentID) {
            var promise = serviceHelper.executeRequest({
                resource: CommentResource,
                name: "get",
                parameters: {
                    id: commentID
                },
                successCallback: function (comment) {
                }
            });
            return promise;
        }
        function getByScreenID(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: ConversationResource,
                name: "query",
                parameters: {
                    screenID: screenID
                },
                successCallback: function (conversations) {
                }
            });
            return promise;
        }
        function getHtmlForComment(comment) {
            comment = comment.replace(
            /(<)|(>)|(&)|(")/g,
            function ($0, lt, gt, amp, quot) {
                if (lt) {
                    return ("&lt;");
                } else if (gt) {
                    return ("&gt;");
                } else if (amp) {
                    return ("&amp;");
                } else if (quot) {
                    return ("&quot;");
                }
            }
            );
            comment = replaceLinks(comment);
            comment = comment.replace(/(\r\n?|\n)/g, "<br />");
            return (comment);
        }
        function replaceLinks(comment) {
            comment = comment.replace(
            /((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»�??�??�??�??]))/gi,
            function ($0) {
                var hasProtocol = (/^\w+:\/\//i).test($0);
                var href = (hasProtocol ? $0 : ("http://" + $0));
                var text = $0;
                return (
                "<a href=\"" + href + "\" target=\"_blank\">" + text + "</a>"
                );
            }
            );
            return (comment);
        }
        function saveConversation(conversation) {
            var parameters = _.pick(conversation, "id", "screenID", "label", "x", "y", "isPrivate", "isForDevelopment", "isComplete");
            var promise = serviceHelper.executeRequest({
                resource: ConversationResource,
                name: "save",
                parameters: parameters,
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function markCommentsAsRead(commentIDs) {
            var promise = serviceHelper.executeRequest({
                resource: CommentResource,
                name: "markAsRead",
                parameters: {
                    commentIDs: commentIDs
                },
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function deleteConversation(conversation) {
            var parameters = _.pick(conversation, "id");
            var promise = serviceHelper.executeRequest({
                resource: ConversationResource,
                name: "delete",
                parameters: parameters,
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function saveComment(comment) {
            var parameters = _.pick(comment, "id", "conversationID", "comment", "notify", "sketches");
            var promise = serviceHelper.executeRequest({
                resource: CommentResource,
                name: "save",
                parameters: parameters,
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function deleteComment(comment) {
            var parameters = _.pick(comment, "id");
            var promise = serviceHelper.executeRequest({
                resource: CommentResource,
                name: "delete",
                parameters: parameters,
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function deleteSketch(sketchID) {
            var promise = serviceHelper.executeRequest({
                resource: sketchResource,
                name: "deleteSketch",
                parameters: { sketchID: sketchID },
                successCallback: function (response) {
                }
            });
            return promise;
        }
        var ConversationResource = $resource("/api/conversations/:id", {
            id: "@id"
        });
        var CommentResource = $resource(
        "/api/comments/:command:id",
        {
            id: "@id",
            command: "@command"
        },
        {
            markAsRead: {
                method: "POST",
                params: {
                    command: "mark-as-read"
                }
            }
        }
        );
        var sketchResource = $resource(
        "/api/comments/:command/:sketchID",
        {
            sketchID: "@sketchID",
            command: "deleteSketch"
        },
        {
            deleteSketch: {
                method: "DELETE",
                params: {
                    command: "deleteSketch"
                }
            }
        }
        );
        return {
            getByScreenID: getByScreenID,
            getConversation: getConversation,
            getComment: getComment,
            getHtmlForComment: getHtmlForComment,
            markCommentsAsRead: markCommentsAsRead,
            saveConversation: saveConversation,
            deleteConversation: deleteConversation,
            saveComment: saveComment,
            deleteComment: deleteComment,
            deleteSketch: deleteSketch
        };
    }
})(angular, InVision);
;
;
/*! dashboard-map-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("dashboardMapService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function getRecentEvents(leadUserID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getRecentEvents",
                parameters: {
                    leadUserID: leadUserID
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/partials/desktop/dashboard/stats/map/activity/:leadUserID",
        {
            leadUserID: "@leadUserID"
        },
        {
            getRecentEvents: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            getRecentEvents: getRecentEvents
        });
    }
})(angular, InVision);
;
;
/*! date-helper.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("dateHelper", Service);
    /** @ngInject */
    function Service() {
        this.dayAsStringMap = [
        {
            "long": "Sunday",
            "short": "Sun"
        },
        {
            "long": "Monday",
            "short": "Mon"
        },
        {
            "long": "Tuesday",
            "short": "Tue"
        },
        {
            "long": "Wednesday",
            "short": "Wed"
        },
        {
            "long": "Thursday",
            "short": "Thr"
        },
        {
            "long": "Friday",
            "short": "Fri"
        },
        {
            "long": "Saturday",
            "short": "Sat"
        }
        ];
        this.monthAsStringMap = [
        {
            "long": "January",
            "short": "Jan"
        },
        {
            "long": "February",
            "short": "Feb"
        },
        {
            "long": "March",
            "short": "Mar"
        },
        {
            "long": "April",
            "short": "Apr"
        },
        {
            "long": "May",
            "short": "May"
        },
        {
            "long": "June",
            "short": "Jun"
        },
        {
            "long": "July",
            "short": "Jul"
        },
        {
            "long": "August",
            "short": "Aug"
        },
        {
            "long": "September",
            "short": "Sep"
        },
        {
            "long": "October",
            "short": "Oct"
        },
        {
            "long": "November",
            "short": "Nov"
        },
        {
            "long": "December",
            "short": "Dec"
        }
        ];
        return (this);
    }
    Service.prototype = {
        addDays: function (datetime, dayCount) {
            var newDatetime = this.duplicate(datetime);
            newDatetime.setDate(newDatetime.getDate() + dayCount);
            return (newDatetime);
        },
        addLeadingZero: function (value) {
            if (value.toString().length === 1) {
                return ("0" + value);
            }
            return (value);
        },
        convertSecondsToMinutes: function (seconds, excludeZeroMinute) {
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = (seconds % 60);
            if (
            (excludeZeroMinute === true) &&
            (minutes === 0)
            ) {
                return (":" + this.addLeadingZero(remainingSeconds));
            } else {
                return (minutes + ":" + this.addLeadingZero(remainingSeconds));
            }
        },
        duplicate: function (datetime) {
            return (
            new Date(datetime)
            );
        },
        equals: function (date1, date2) {
            return (date1.getTime() === date2.getTime());
        },
        formatDate: function (datetime, dateMask) {
            var self = this;
            var date = this.removeTime(datetime);
            var result = dateMask.replace(
            /M+|m+|d+|yyyy|yy/g,
            function ($0) {
                return (
                self.getFormattedDatePart(date, $0)
                );
            }
            );
            return (result);
        },
        formatRecentDate: function (datetime, dateMask) {
            var date = this.removeTime(datetime);
            if (this.isToday(date)) {
                return ("Today");
            } else if (this.isYesterday(date)) {
                return ("Yesterday");
            } else {
                return (this.formatDate(datetime, dateMask));
            }
        },
        formatTime: function (datetime, timeMask) {
            var self = this;
            var date = this.duplicate(datetime);
            var result = timeMask.replace(
            /H+|h+|m+|t+|T+/g,
            function ($0) {
                return (
                self.getFormattedTimePart(date, $0)
                );
            }
            );
            return (result);
        },
        getDayOfWeekAsString: function (dayOfWeek, useShortVersion) {
            if (useShortVersion) {
                return (this.dayAsStringMap[dayOfWeek]["short"]);
            } else {
                return (this.dayAsStringMap[dayOfWeek]["long"]);
            }
        },
        getFormattedDatePart: function (datetime, pattern) {
            switch (pattern) {
                case "D":
                case "d":
                    return (datetime.getDate());
                    break;
                case "DD":
                case "dd":
                    return (this.addLeadingZero(datetime.getDate()));
                    break;
                case "DDD":
                    return (this.getDayOfWeekAsString(datetime.getDay()).toUpperCase());
                    break;
                case "ddd":
                    return (this.getDayOfWeekAsString(datetime.getDay()));
                    break;
                case "dddd":
                    return (this.getDayOfWeekAsString(datetime.getDay(), true));
                    break;
                case "M":
                case "m":
                    return (datetime.getMonth() + 1);
                    break;
                case "MM":
                case "mm":
                    return (this.addLeadingZero(datetime.getMonth() + 1));
                    break;
                case "MMM":
                case "mmm":
                    return (this.getMonthAsString(datetime.getMonth(), true));
                    break;
                case "MMMM":
                case "mmmm":
                    return (this.getMonthAsString(datetime.getMonth(), false));
                    break;
                case "YY":
                case "yy":
                    return (this.addLeadingZero(datetime.getFullYear() % 100));
                    break;
                case "YYYY":
                case "yyyy":
                    return (datetime.getFullYear());
                    break;
            }
            return (pattern);
        },
        getFormattedTimePart: function (datetime, pattern) {
            switch (pattern) {
                case "H":
                    return (datetime.getHours());
                    break;
                case "HH":
                    var value = datetime.getHours();
                    return (value < 10 ? "0" + value : value);
                    break;
                case "h":
                    var value = (datetime.getHours() % 12);
                    return (value === 0 ? 12 : value);
                    break;
                case "hh":
                    var value = (datetime.getHours() % 12);
                    value = (value === 0 ? 12 : value);
                    return (value < 10 ? "0" + value : value);
                    break;
                case "M":
                case "MM":
                case "m":
                case "mm":
                    var value = datetime.getMinutes();
                    return (value < 10 ? "0" + value : value);
                    break;
                case "T":
                    return (datetime.getHours() < 12 ? "A" : "P");
                    break;
                case "TT":
                    return (datetime.getHours() < 12 ? "AM" : "PM");
                    break;
                case "t":
                    return (datetime.getHours() < 12 ? "a" : "p");
                    break;
                case "tt":
                    return (datetime.getHours() < 12 ? "am" : "pm");
                    break;
            }
            return (pattern);
        },
        getMonthAsString: function (month, useShortVersion) {
            if (useShortVersion) {
                return (this.monthAsStringMap[month]["short"]);
            } else {
                return (this.monthAsStringMap[month]["long"]);
            }
        },
        isToday: function (datetime) {
            return (
            this.equals(datetime, this.today())
            );
        },
        isYesterday: function (datetime) {
            return (
            this.equals(datetime, this.yesterday())
            );
        },
        removeTime: function (datetime) {
            var newDatetime = this.duplicate(datetime);
            newDatetime.setHours(0);
            newDatetime.setMinutes(0);
            newDatetime.setSeconds(0);
            newDatetime.setMilliseconds(0);
            return (newDatetime);
        },
        today: function () {
            return (
            this.removeTime(new Date())
            );
        },
        yesterday: function () {
            return (
            this.addDays(this.today(), -1)
            );
        }
    };
})(angular, InVision);
;
;
/*! deferred.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("Deferred", Factory);
    /** @ngInject */
    function Factory($q, _) {
        function Deferred() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var core = {
                resolve: deferred.resolve,
                reject: deferred.reject,
                then: promise.then
            };
            var isResolved = false;
            var isRejected = false;
            var updateCallbacks = [];
            var mistakeCallbacks = [];
            deferred.resolve = function () {
                if (isResolved && !isRejected) {
                    for (var i = 0, length = updateCallbacks.length ; i < length ; i++) {
                        updateCallbacks[i].apply({}, arguments);
                    }
                } else {
                    isResolved = true;
                    core.resolve.apply(deferred, arguments)
                }
            };
            deferred.reject = function () {
                if (isResolved) {
                    for (var i = 0, length = mistakeCallbacks.length ; i < length ; i++) {
                        mistakeCallbacks[i].apply({}, arguments);
                    }
                } else {
                    isRejected = true;
                    core.reject.apply(deferred, arguments)
                }
            };
            promise.then = function () {
                var newPromise = core.then.apply(promise, arguments);
                newPromise.update = promise.update;
                newPromise.mistake = promise.mistake;
                return (newPromise);
            };
            promise.update = function (callback) {
                updateCallbacks.push(callback);
                return (promise);
            };
            promise.mistake = function (callback) {
                mistakeCallbacks.push(callback);
                return (promise);
            };
            return (deferred);
        }
        Deferred.handleAllPromises = function (promises, successCallback, errorCallback, runOnce) {
            var handleSuccess = function (index, response) {
                if (hasError) {
                    return;
                }
                results[index] = response;
                if (_.contains(results, null)) {
                    return;
                }
                successCallback.apply(null, results);
            };
            var handleError = function (index, response) {
                if (hasError) {
                    return;
                }
                hasError = true;
                errorCallback.call(null, response);
            };
            var results = [];
            for (var i = 0, length = promises.length ; i < length ; i++) {
                results.push(null);
            }
            var hasError = false;
            successCallback = (successCallback || ng.noop);
            errorCallback = (errorCallback || ng.noop);
            _.forEach(
            promises,
            function (promise, index) {
                Deferred.handlePromise(
                promise,
                function (response) {
                    handleSuccess(index, response);
                },
                function (response) {
                    handleError(index, response);
                },
                runOnce
                );
            }
            );
        };
        Deferred.handlePromise = function (promise, successCallback, errorCallback, runOnce) {
            var handleSuccess = function (response) {
                if (hasRun && runOnce) {
                    return;
                }
                hasRun = true;
                successCallback(response);
            };
            var hasRun = false;
            successCallback = (successCallback || ng.noop);
            errorCallback = (errorCallback || ng.noop);
            promise.then(handleSuccess, errorCallback);
            promise.update(handleSuccess);
            promise.mistake(errorCallback);
            return (promise);
        };
        return (Deferred);
    }
})(angular, InVision);
;
;
/*! design-quote-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("designQuoteService", DesignQuoteService);
    /** @ngInject */
    function DesignQuoteService(_) {
        function getRandomQuote() {
            var quoteCount = unusedQuotes.length;
            var index = _.random(0, (quoteCount - 1));
            var quote = unusedQuotes[index];
            unusedQuotes.splice(index, 1);
            if (!unusedQuotes.length) {
                unusedQuotes = [].concat(quotes);
            }
            return (quote);
        }
        var quotes = [
        {
            quote: "Everything is designed. Few things are designed well.",
            author: "Brian Reed"
        },
        {
            quote: "Good design is obvious. Great design is transparent.",
            author: "Joe Sparano"
        },
        {
            quote: "Design is where science and art break even.",
            author: "Robin Mathew"
        },
        {
            quote: "Good design goes to heaven; bad design goes everywhere.",
            author: "Mieke Gerritzen"
        },
        {
            quote: "Design should never say, 'Look at me.' It should always say, 'Look at this.'",
            author: "David Craib"
        },
        {
            quote: "The design process, at its best, integrates the aspirations of art, science, and culture.",
            author: "Jeff Smith"
        },
        {
            quote: "Content precedes design. Design in the absence of content is not design, it's decoration.",
            author: "Jeffrey Zeldman"
        },
        {
            quote: "Design is not the narrow application of formal skills, it is a way of thinking.",
            author: "Chris Pullman"
        },
        {
            quote: "Design creates culture. Culture shapes values. Values determine the future.",
            author: "Robert L. Peters"
        },
        {
            quote: "Computers are to design as microwaves are to cooking.",
            author: "Milton Glaser"
        },
        {
            quote: "Good design is all about making other designers feel like idiots because that idea wasn't theirs.",
            author: "Frank Chimero"
        },
        {
            quote: "Truly elegant design incorporates top-notch functionality into a simple, uncluttered form.",
            author: "David Lewis"
        },
        {
            quote: "The only important thing about design is how it relates to people.",
            author: "Victor Papanek"
        },
        {
            quote: "I never design a building before I've seen the site and met the people who will be using it.",
            author: "Frank Lloyd Wright"
        },
        {
            quote: "Creativity is allowing yourself to make mistakes. Design is knowing which ones to keep.",
            author: "Unknown"
        }
        ];
        var unusedQuotes = [].concat(quotes);
        return ({
            getRandomQuote: getRandomQuote
        });
    }
})(angular, InVision);
;
;
/*! error-log-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("errorLogService", ErrorLogService);
    /** @ngInject */
    function ErrorLogService($log, $window, stackTraceService) {
        var debounceLog = {};
        var debounceTimeout = (5 * 60 * 1000);
        function log(exception) {
            $log.error.apply($log, arguments);
            try {
                var errorMessage = exception.toString();
                var stackTrace = ng.toJson(exception);
                if (shouldSkipErrorReporting(errorMessage)) {
                    return;
                }
                if (stackTrace === "{}") {
                    try {
                        stackTrace = ng.toJson(stackTraceService.print({ e: exception }));
                        errorMessage += " (via printStackTrace)";
                    } catch (stackTraceError) {
                        $log.warn("Error logging failed via printStackTrace()");
                        $log.log(stackTraceError);
                    }
                }
                $.ajax({
                    type: "POST",
                    url: "/api/error-log/javascript",
                    contentType: "application/json",
                    data: ng.toJson({
                        errorUrl: $window.location.href,
                        errorMessage: errorMessage,
                        stackTrace: stackTrace
                    })
                });
            } catch (loggingError) {
                $log.warn("Error logging failed");
                $log.log(loggingError);
            }
        }
        function shouldSkipErrorReporting(message) {
            var isSkip = true;
            var isSend = false;
            var now = (new Date()).getTime();
            var errorKey = ("debounce_" + message);
            if (!debounceLog.hasOwnProperty(errorKey)) {
                debounceLog[errorKey] = 0;
            }
            if (now < (debounceLog[errorKey] + debounceTimeout)) {
                return (isSkip);
            }
            debounceLog[errorKey] = now;
            return (isSend);
        }
        return ({
            exceptionHandler: log
        });
    }
})(angular, InVision);
;
;
/*! hashkey-copier.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("hashKeyCopier", HashKeyCopier);
    /** @ngInject */
    function HashKeyCopier(_) {
        function applyHashKeyIndex(hashKeyIndex, target, uniqueIdentifiers) {
            if (_.isArray(target)) {
                applyHashKeyIndexToArray(hashKeyIndex, "[]", target, uniqueIdentifiers);
            } else if (_.isObject(target)) {
                applyHashKeyIndexToObject(hashKeyIndex, ".", target, uniqueIdentifiers);
            }
            return (target);
        }
        function applyHashKeyIndexToArray(hashKeyIndex, path, target, uniqueIdentifiers) {
            for (var i = 0, length = target.length ; i < length ; i++) {
                var targetItem = target[i];
                if (_.isArray(targetItem)) {
                    applyHashKeyIndexToArray(hashKeyIndex, (path + "[]"), targetItem, uniqueIdentifiers);
                } else if (_.isObject(targetItem)) {
                    applyHashKeyIndexToObject(hashKeyIndex, (path + "."), targetItem, uniqueIdentifiers);
                }
            }
        }
        function applyHashKeyIndexToObject(hashKeyIndex, path, target, uniqueIdentifiers) {
            var identifier = getUniqueIdentifierForObject(target, uniqueIdentifiers);
            if (identifier) {
                var hashKeyPath = (path + target[identifier]);
                if (hashKeyIndex.hasOwnProperty(hashKeyPath)) {
                    target[hashKeyLookup] = hashKeyIndex[hashKeyPath];
                }
            }
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    var targetItem = target[key];
                    if (_.isArray(targetItem)) {
                        applyHashKeyIndexToArray(hashKeyIndex, (path + key + "[]"), targetItem, uniqueIdentifiers);
                    } else if (_.isObject(targetItem)) {
                        applyHashKeyIndexToObject(hashKeyIndex, (path + key + "."), targetItem, uniqueIdentifiers);
                    }
                }
            }
        }
        function buildHashKeyIndex(target, uniqueIdentifiers) {
            var hashKeyIndex = {};
            if (_.isArray(target)) {
                buildHashKeyIndexForArray(hashKeyIndex, "[]", target, uniqueIdentifiers);
            } else if (_.isObject(target)) {
                buildHashKeyIndexForObject(hashKeyIndex, ".", target, uniqueIdentifiers);
            }
            return (hashKeyIndex);
        }
        function buildHashKeyIndexForArray(hashKeyIndex, path, target, uniqueIdentifiers) {
            for (var i = 0, length = target.length ; i < length ; i++) {
                var targetItem = target[i];
                if (_.isArray(targetItem)) {
                    buildHashKeyIndexForArray(hashKeyIndex, (path + "[]"), targetItem, uniqueIdentifiers);
                } else if (_.isObject(targetItem)) {
                    buildHashKeyIndexForObject(hashKeyIndex, (path + "."), targetItem, uniqueIdentifiers);
                }
            }
        }
        function buildHashKeyIndexForObject(hashKeyIndex, path, target, uniqueIdentifiers) {
            if (target.hasOwnProperty(hashKeyLookup)) {
                var identifier = getUniqueIdentifierForObject(target, uniqueIdentifiers);
                if (identifier) {
                    hashKeyIndex[path + target[identifier]] = target[hashKeyLookup];
                }
            }
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    var targetItem = target[key];
                    if (_.isArray(targetItem)) {
                        buildHashKeyIndexForArray(hashKeyIndex, (path + key + "[]"), targetItem, uniqueIdentifiers);
                    } else if (_.isObject(targetItem)) {
                        buildHashKeyIndexForObject(hashKeyIndex, (path + key + "."), targetItem, uniqueIdentifiers);
                    }
                }
            }
        }
        function copyHashKeys(existing, incoming, uniqueIdentifiers) {
            if (isExistingDataEmpty(existing)) {
                return (incoming);
            }
            if (!uniqueIdentifiers) {
                uniqueIdentifiers = ["id"];
            }
            var hashKeyIndex = buildHashKeyIndex(existing, uniqueIdentifiers);
            applyHashKeyIndex(hashKeyIndex, incoming, uniqueIdentifiers);
            return (incoming);
        }
        function getUniqueIdentifierForObject(target, uniqueIdentifiers) {
            for (var i = 0, length = uniqueIdentifiers.length ; i < length ; i++) {
                var identifier = uniqueIdentifiers[i];
                if (target.hasOwnProperty(identifier)) {
                    return (identifier);
                }
            }
            return (null);
        }
        function isEmptyArray(target) {
            return (
            target.hasOwnProperty("length") &&
            (target.length === 0)
            );
        }
        function isExistingDataEmpty(existing) {
            if (!existing || isEmptyArray(existing)) {
                return (true);
            }
            return (false);
        }
        var hashKeyLookup = "$$hashKey";
        return ({
            copyHashKeys: copyHashKeys
        });
    }
})(angular, InVision);
;
;
/*! hotspot-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("hotspotService", HotspotService);
    /** @ngInject */
    function HotspotService(_, $resource, serviceHelper, modelEvents) {
        function getByScreenID(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "query",
                parameters: {
                    screenID: screenID
                }
            });
            return promise;
        }
        function saveHotspot(hotspot, currentScreen) {
            var parameters = _.pick(
            hotspot,
            "id",
            "screenID",
            "eventTypeID",
            "targetTypeID",
            "transitionTypeID",
            "targetScreenID",
            "metaData",
            "templateID",
            "x",
            "y",
            "width",
            "height",
            "isScrollTo",
            "isBottomAligned"
            );
            parameters.eventTypeID = (parameters.eventTypeID || eventTypes.click);
            parameters.transitionTypeID = (parameters.transitionTypeID || transitionTypes.none);
            parameters.metaData = (parameters.metaData || {});
            parameters.templateID = (parameters.templateID || 0);
            parameters.isBottomAligned = parameters.templateID != 0 ? parameters.isBottomAligned : false;
            if (parameters.isBottomAligned) {
                parameters.bottomY = currentScreen.height - parameters.y - parameters.height;
                parameters.y = parameters.bottomY;
            }
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "save",
                parameters: parameters,
                successCallback: function (response) {
                    if (!hotspot.id) {
                        hotspot.id = response.id;
                    }
                }
            });
            return promise;
        }
        function deleteHotspot(hotspot) {
            var parameters = _.pick(hotspot, "id");
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "delete",
                parameters: parameters
            });
            return promise;
        }
        var resource = $resource("/api/hotspots/:command:id", {
            id: "@id",
            command: "@command"
        });
        var eventTypes = {
            click: 1,
            doubleTap: 2,
            pressHold: 3,
            swipeRight: 4,
            swipeLeft: 5,
            swipeUp: 6,
            swipeDown: 7,
            hover: 8
        };
        var targetTypes = {
            screen: 1,
            lastScreenVisited: 2,
            previousScreenInSort: 3,
            nextScreenInSort: 4,
            externalUrl: 5,
            positionOnScreen: 6
        };
        var transitionTypes = {
            none: 1,
            pushRight: 2,
            pushLeft: 3,
            slideUp: 4,
            slideDown: 5,
            flipRight: 6,
            flipLeft: 7,
            dissolve: 8
        };
        return {
            deleteHotspot: deleteHotspot,
            eventTypes: eventTypes,
            getByScreenID: getByScreenID,
            saveHotspot: saveHotspot,
            targetTypes: targetTypes,
            transitionTypes: transitionTypes
        };
    }
})(angular, InVision);
;
;
/*! http-activity-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("httpActivityService", Service);
    /** @ngInject */
    function Service() {
        this.activeRequestCount = 0;
        this.activeGetRequestCount = 0;
        this.activePostRequestCount = 0;
        return (this);
    }
    Service.prototype = {
        isActive: function () {
            return (this.activeRequestCount !== 0);
        },
        isActiveWithGet: function () {
            return (this.activeGetRequestCount !== 0);
        },
        isActiveWithPost: function () {
            return (this.activePostRequestCount !== 0);
        },
        requestCompleted: function (isPostRequest) {
            if (isPostRequest) {
                this.activePostRequestCount--;
            } else {
                this.activeGetRequestCount--;
            }
            this.activeRequestCount--;
            if (this.activeRequestCount === 0) {
                this.activeGetRequestCount = 0;
                this.activePostRequestCount = 0;
            }
            return (this.activeRequestCount);
        },
        requestStarted: function (isPostRequest) {
            if (isPostRequest) {
                this.activePostRequestCount++;
            } else {
                this.activeGetRequestCount++;
            }
            this.activeRequestCount++;
            return (this.activeRequestCount);
        }
    };
})(angular, InVision);
;
;
/*! jquery.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("$", Factory);
    function Factory() {
        return $;
    }
})(angular, InVision);
;
;
/*! lodash.js */
;
;
(function (ng, app, _) {
    "use strict";
    app.factory("_", Factory);
    /** @ngInject */
    function Factory() {
        _.containsWithProperty = function (collection, name, value) {
            return (!!this.findWithProperty(collection, name, value));
        };
        _.countWithProperty = function (collection, name, value) {
            var count = 0;
            for (var i = 0 ; i < collection.length ; i++) {
                if (collection[i][name] === value) {
                    count++;
                }
            }
            return (count);
        };
        _.extendExistingProperties = function (destination, source) {
            if (!(destination && source)) {
                return (destination);
            }
            var angularKeyPattern = new RegExp("^\\$+", "i");
            for (var key in source) {
                if (
                source.hasOwnProperty(key) &&
                destination.hasOwnProperty(key) &&
                !angularKeyPattern.test(key) &&
                !_.isFunction(source[key])
                ) {
                    destination[key] = source[key];
                }
            }
            return (destination);
        };
        _.filterWithProperty = function (collection, name, value) {
            var filteredCollection = _.filter(
            collection,
            function (item) {
                return (item[name] === value);
            }
            );
            return (filteredCollection);
        };
        _.findWithProperty = function (collection, name, value) {
            var result = _.find(
            collection,
            function (item) {
                return (item[name] === value);
            }
            );
            return (result);
        };
        _.indexOfWithProperty = function (collection, name, value) {
            for (var i = 0 ; i < collection.length ; i++) {
                if (collection[i][name] === value) {
                    return (i);
                }
            }
            return (-1);
        };
        _.notContainsProperty = function (collection, name, value) {
            var filteredCollection = this.filter(
            collection,
            function (item) {
                return (!_.contains(item[name].toLowerCase(), value.toLowerCase()));
            }
            );
            return (filteredCollection);
        };
        _.maxProperty = function (collection, name) {
            if (!collection.length) {
                return;
            }
            return (
            _.max(
            _.pluck(collection, name)
            )
            );
        };
        _.minProperty = function (collection, name) {
            return (
            _.min(
            _.pluck(collection, name)
            )
            );
        };
        _.normalizeMixedDataValue = function (value) {
            var padding = "000000000000000";
            value = value.replace(
            /(\d+)((\.\d+)+)?/g,
            function ($0, integer, decimal, repeatDecimal) {
                if (decimal !== repeatDecimal) {
                    return (
                    padding.slice(integer.length) +
                    integer +
                    decimal
                    );
                }
                decimal = (decimal || ".0");
                return (
                padding.slice(integer.length) +
                integer +
                decimal +
                padding.slice(decimal.length)
                );
            }
            );
            return (value);
        };
        _.rejectWithProperty = function (collection, name, value) {
            var filteredCollection = _.reject(
            collection,
            function (item) {
                return (item[name] === value);
            }
            );
            return (filteredCollection);
        };
        _.setProperty = function (collection, name, value) {
            this.forEach(
            collection,
            function (item) {
                item[name] = value;
            }
            );
            return (collection);
        };
        _.sortOnProperty = function (collection, name, direction) {
            direction = (direction || "asc");
            var sortIndicator = (direction === "asc" ? -1 : 1);
            collection.sort(
            function (a, b) {
                return (a[name] < b[name] ? sortIndicator : -sortIndicator);
            }
            );
            return (collection);
        };
        _.sortOnPropertyUsingNaturalOrder = function (collection, name, direction) {
            direction = (direction || "asc");
            var sortIndicator = (direction === "asc" ? -1 : 1);
            collection.sort(
            function (a, b) {
                var aMixed = _.normalizeMixedDataValue(a.name.toLowerCase());
                var bMixed = _.normalizeMixedDataValue(b.name.toLowerCase());
                return (aMixed < bMixed ? sortIndicator : -sortIndicator);
            }
            );
            return (collection);
        };
        _.sumProperty = function (collection, name) {
            var sum = 0;
            for (var i = 0 ; i < collection.length ; i++) {
                sum += collection[i][name];
            }
            return (sum);
        };
        _.withoutProperty = function (collection, name, value) {
            var filteredCollection = this.filter(
            collection,
            function (item) {
                return (item[name] !== value);
            }
            );
            return (filteredCollection);
        };
        _.withoutPropertyRange = function (collection, name, valueRange) {
            var filteredCollection = this.filter(
            collection,
            function (item) {
                return (_.indexOf(valueRange, item[name]) === -1);
            }
            );
            return (filteredCollection);
        };
        _.withProperty = function (collection, name, value) {
            var filteredCollection = this.filter(
            collection,
            function (item) {
                return (item[name] === value);
            }
            );
            return (filteredCollection);
        };
        _.withPropertyRange = function (collection, name, valueRange) {
            var filteredCollection = this.filter(
            collection,
            function (item) {
                return (_.indexOf(valueRange, item[name]) !== -1);
            }
            );
            return (filteredCollection);
        };
        return (_);
    }
})(angular, InVision, _);
;
;
/*! modal-window-request.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("modalWindowRequest", ModalWindowRequest);
    /** @ngInject */
    function ModalWindowRequest() {
        function getData(index, defaultValue) {
            if (arguments.length === 0) {
                return (modalData);
            } else if (
            (index > modalData.length) &&
            (arguments.length == 2)
            ) {
                return (defaultValue);
            } else {
                return (modalData[index]);
            }
        }
        function getType() {
            return (modalType);
        }
        function isSuppressFade() {
            return (suppressFade === true);
        }
        function setRequest(newModalType, newModalData, newSuppressFade) {
            modalType = newModalType;
            modalData = newModalData;
            suppressFade = (newSuppressFade || false);
        }
        function setSuppressFade(newSuppressFade) {
            suppressFade = (newSuppressFade || false);
        }
        function isSuppressClose() {
            return (suppressClose === true);
        }
        function setSuppressClose(newSuppressClose) {
            suppressClose = (newSuppressClose || false);
        }
        var modalType = "";
        var modalData = [];
        var suppressFade = false;
        var suppressClose = false;
        return ({
            getData: getData,
            getType: getType,
            isSuppressFade: isSuppressFade,
            setRequest: setRequest,
            setSuppressFade: setSuppressFade,
            isSuppressClose: isSuppressClose,
            setSuppressClose: setSuppressClose
        });
    }
})(angular, InVision);
;
;
/*! model-events.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("modelEvents", ModelEventsFactory);
    /** @ngInject */
    function ModelEventsFactory(PubSub) {
        return (new PubSub());
    }
})(angular, InVision);
;
;
/*! moment.js */
;
;
(function (ng, app, moment) {
    "use strict";
    app.factory("moment", Factory);
    /** @ngInject */
    function Factory() {
        return moment;
    }
})(angular, InVision, moment);
;
;
/*! notifications-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("notificationsService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function getSettings() {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getSettings"
            });
            return (promise);
        }
        function updateSendDigestAt(wantsDigestAtFrequencyInHours, digestSendTime) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateSendDigestAt",
                parameters: {
                    command: "digestSendTime",
                    wantsDigestAtFrequencyInHours: wantsDigestAtFrequencyInHours,
                    sendNextDigestAt: digestSendTime
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function updateSettings(settings) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateSettings",
                parameters: settings,
                successCallback: function (response) {
                    modelEvents.trigger("notificationSettingsUpdated", settings);
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/notifications/:command",
        {
            command: "@command"
        },
        {
            getSettings: {
                method: "GET"
            },
            updateSendDigestAt: {
                method: "POST",
                command: "digestSendTime"
            },
            updateSettings: {
                method: "POST"
            }
        }
        );
        return ({
            getSettings: getSettings,
            updateSendDigestAt: updateSendDigestAt,
            updateSettings: updateSettings
        });
    }
})(angular, InVision);
;
;
/*! partial-helper.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("partialHelper", PartialHelper);
    /** @ngInject */
    function PartialHelper(Deferred) {
        function applyCacheIfAvailable(deferred, resourceResponse, cachedResponse) {
            if (cachedResponse !== null) {
                deferred.resolve(
                applyCacheToResourceResponse(resourceResponse, cachedResponse)
                );
            }
        }
        function applyCacheToResourceResponse(resourceResponse, cachedResponse) {
            if (ng.isArray(resourceResponse)) {
                resourceResponse.splice.apply(
                resourceResponse,
                [0, 0].concat(cachedResponse)
                );
            } else {
                ng.extend(resourceResponse, cachedResponse);
            }
            return (resourceResponse);
        }
        function executeRequest(options) {
            var resource = options.resource;
            var name = options.name;
            var parameters = (options.parameters || {});
            var cachedResponse = (options.cachedResponse || null);
            var successCallback = (options.successCallback || ng.noop);
            var errorCallback = (options.errorCallback || ng.noop);
            var deferred = new Deferred();
            var resourceResponse = resource[name](
            parameters,
            function (response) {
                successCallback(response);
                deferred.resolve(response);
            },
            function (response) {
                errorCallback(response);
                deferred.reject(
                unwrapErrorMessage(response)
                );
            }
            );
            applyCacheIfAvailable(deferred, resourceResponse, cachedResponse);
            return (deferred.promise);
        }
        function unwrapErrorMessage(errorResponse) {
            try {
                var response = ng.fromJson(errorResponse.data);
                if (ng.isString(response)) {
                    response = {
                        message: response,
                        code: -1
                    };
                }
            } catch (error) {
                var response = {
                    message: errorResponse.data,
                    code: -1
                };
            }
            return (response);
        }
        return ({
            executeRequest: executeRequest
        });
    }
})(angular, InVision);
;
;
/*! project-overview-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectOverviewService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, dateHelper, _) {
        function getActivityAndStats(projectID, offset, duration) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getActivityAndStats",
                parameters: {
                    id: projectID,
                    offset: offset,
                    duration: duration,
                    command: "withStats"
                }
            });
            return (promise);
        }
        function getActivity(projectID, offset, duration) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getActivity",
                parameters: {
                    id: projectID,
                    offset: offset,
                    duration: duration,
                    command: "activityOnly"
                }
            });
            return (promise);
        }
        function getStatsByUser(userID, startTime, endTime) {
            var promise = serviceHelper.executeRequest({
                resource: userResource,
                name: "getStatsByUser",
                parameters: {
                    id: userID,
                    startTime: startTime,
                    endTime: endTime
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/partials/desktop/projects/activity/:command/:id/:offset/:duration",
        {
            id: "@id",
            offset: "@offset",
            duration: "@duration",
            command: "@command"
        },
        {
            getActivity: {
                method: "GET",
                isArray: false,
                command: "activityOnly"
            },
            getActivityAndStats: {
                method: "GET",
                isArray: false,
                command: "withStats"
            }
        }
        );
        var userResource = $resource(
        "/api/apps/userstats/:id/:startTime/:endTime",
        {
            id: "@id",
            startTime: "@startTime",
            endTime: "@endTime"
        },
        {
            getStatsByUser: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            getActivity: getActivity,
            getActivityAndStats: getActivityAndStats,
            getStatsByUser: getStatsByUser
        });
    }
})(angular, InVision);
;
;
/*! project-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectService", ProjectsService);
    /** @ngInject */
    function ProjectsService($resource, serviceHelper, modelEvents) {
        function activateProject(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "activateProject",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function addSampleScreensToProject(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "addSampleScreensToProject",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    var screens = ng.fromJson(response);
                    for (var screenIndex in screens) {
                        modelEvents.trigger("screenUploaded", screens[screenIndex]);
                    }
                }
            });
            return (promise);
        }
        function addUsersToProject(projectID, userIDList) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "addUsersToProject",
                parameters: {
                    id: projectID,
                    userIDList: userIDList
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUsersAdded", projectID, userIDList.split(","));
                }
            });
            return (promise);
        }
        function addUserToProject(projectID, userID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "addUserToProject",
                parameters: {
                    id: projectID,
                    userID: userID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUserAdded", projectID, userID);
                }
            });
            return (promise);
        }
        function archiveProject(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "archiveProject",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function changeUsersOnProject(projectID, addUserIDList, removeUserIDList) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "changeUsersOnProject",
                parameters: {
                    id: projectID,
                    addUserIDList: addUserIDList.join(","),
                    removeUserIDList: removeUserIDList.join(",")
                },
                successCallback: function (response) {
                    if (addUserIDList.length) {
                        modelEvents.trigger("projectUsersAdded", projectID, addUserIDList);
                    }
                    if (removeUserIDList.length) {
                        modelEvents.trigger("projectUsersRemoved", projectID, removeUserIDList);
                    }
                }
            });
            return (promise);
        }
        function deleteProject(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "deleteProject",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectDeleted", projectID);
                }
            });
            return (promise);
        }
        function duplicateProject(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "duplicateProject",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectCreated", response);
                }
            });
            return (promise);
        }
        function exportPDF(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "exportPDF",
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectCreated", response);
                }
            });
            return (promise);
        }
        function getByID(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getByID",
                parameters: {
                    id: id
                }
            });
            return (promise);
        }
        function getMembers(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getMembers",
                parameters: {
                    id: id
                }
            });
            return (promise);
        }
        function getStakeholders(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getStakeholders",
                parameters: {
                    id: id
                }
            });
            return (promise);
        }
        function removeStakeholderFromProject(projectID, userID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "removeStakeholder",
                parameters: {
                    id: projectID,
                    userID: userID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectStakeholderRemoved", projectID, userID);
                }
            });
            return (promise);
        }
        function removeUserFromProject(projectID, userID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "removeUserFromProject",
                parameters: {
                    id: projectID,
                    userID: userID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUserRemoved", projectID, userID);
                }
            });
            return (promise);
        }
        function renameProject(projectID, name) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "renameProject",
                parameters: {
                    id: projectID,
                    name: name
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function setConfigDefaults(projectID, config) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "setConfigDefaults",
                parameters: {
                    id: projectID,
                    backgroundColor: config.backgroundColor,
                    backgroundImageID: config.backgroundImage.id,
                    backgroundImagePosition: config.backgroundImagePosition,
                    alignment: config.alignment
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function setFavoriteStatus(projectID, isFavorite) {
            var methodName = (isFavorite ? "star" : "unstar");
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: methodName,
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function setIsMinimizedInTimeline(projectID, isMinimizedInTimeline) {
            var methodName = (isMinimizedInTimeline ? "collapseActivity" : "expandActivity");
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: methodName,
                parameters: {
                    id: projectID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function save(parameters) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "save",
                parameters: parameters,
                successCallback: function (response) {
                    modelEvents.trigger("projectCreated", response);
                }
            });
            return (promise);
        }
        function transferOwnership(projectID, email) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "transferOwnership",
                parameters: {
                    id: projectID,
                    email: email
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        function setProjectType(projectID, isMobile, mobileDeviceID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "setProjectType",
                parameters: {
                    id: projectID,
                    isMobile: isMobile,
                    mobileDeviceID: mobileDeviceID
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectUpdated", response);
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/project/:id/:command",
        {
            id: "@id",
            command: "@command"
        },
        {
            activateProject: {
                method: "POST",
                params: {
                    command: "activate"
                }
            },
            addSampleScreensToProject: {
                method: "POST",
                isArray: true,
                params: {
                    command: "add-sample-screens"
                }
            },
            addUserToProject: {
                method: "POST",
                params: {
                    command: "add-user"
                }
            },
            addUsersToProject: {
                method: "POST",
                params: {
                    command: "add-users"
                }
            },
            archiveProject: {
                method: "POST",
                params: {
                    command: "archive"
                }
            },
            changeUsersOnProject: {
                method: "POST",
                params: {
                    command: "change-users"
                }
            },
            collapseActivity: {
                method: "POST",
                params: {
                    command: "collapse-activity"
                }
            },
            deleteProject: {
                method: "DELETE"
            },
            duplicateProject: {
                method: "POST",
                params: {
                    command: "duplicate"
                }
            },
            expandActivity: {
                method: "POST",
                params: {
                    command: "expand-activity"
                }
            },
            exportPDF: {
                method: "POST",
                params: {
                    command: "export-pdf"
                }
            },
            getByID: {
                method: "GET"
            },
            getMembers: {
                method: "GET",
                isArray: true,
                params: {
                    command: "members"
                }
            },
            getStakeholders: {
                method: "GET",
                isArray: true,
                params: {
                    command: "stakeholders"
                }
            },
            removeStakeholder: {
                method: "POST",
                params: {
                    command: "remove-stakeholder"
                }
            },
            removeUserFromProject: {
                method: "POST",
                params: {
                    command: "remove-user"
                }
            },
            renameProject: {
                method: "POST",
                params: {
                    command: "rename"
                }
            },
            star: {
                method: "POST",
                params: {
                    command: "star"
                }
            },
            setConfigDefaults: {
                method: "POST",
                params: {
                    command: "set-config-defaults"
                }
            },
            save: {
                method: "POST"
            },
            transferOwnership: {
                method: "POST",
                params: {
                    command: "transfer-ownership"
                }
            },
            unstar: {
                method: "POST",
                params: {
                    command: "unstar"
                }
            },
            setProjectType: {
                method: "POST",
                params: {
                    command: "setProjectType"
                }
            }
        }
        );
        return ({
            activateProject: activateProject,
            addSampleScreensToProject: addSampleScreensToProject,
            addUsersToProject: addUsersToProject,
            addUserToProject: addUserToProject,
            archiveProject: archiveProject,
            changeUsersOnProject: changeUsersOnProject,
            deleteProject: deleteProject,
            duplicateProject: duplicateProject,
            exportPDF: exportPDF,
            getByID: getByID,
            getMembers: getMembers,
            getStakeholders: getStakeholders,
            removeStakeholderFromProject: removeStakeholderFromProject,
            removeUserFromProject: removeUserFromProject,
            renameProject: renameProject,
            setConfigDefaults: setConfigDefaults,
            setFavoriteStatus: setFavoriteStatus,
            setIsMinimizedInTimeline: setIsMinimizedInTimeline,
            save: save,
            transferOwnership: transferOwnership,
            setProjectType: setProjectType
        });
    }
})(angular, InVision);
;
;
/*! pusher.js */
;
;
(function (ng, app) {
    "use strict";
    app.value("Pusher", Pusher);
})(angular, InVision);
;
;
/*! release-notification-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("releaseNotificationService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function getReleaseNotifications() {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getReleaseNotifications"
            });
            return (promise);
        }
        var resource = $resource(
        "/api/release-notification",
        {
        },
        {
            getReleaseNotifications: {
                method: "GET",
                isArray: true
            }
        }
        );
        return ({
            getReleaseNotifications: getReleaseNotifications
        });
    }
})(angular, InVision);
;
;
/*! render-context.js */
;
;
(function (ng, app) {
    "use strict";
    app.value("RenderContext", RenderContext);
    function RenderContext(requestContext, actionPrefix, paramNames) {
        this._requestContext = requestContext;
        this._actionPrefix = actionPrefix;
        this._paramNames = paramNames;
        return (this);
    }
    RenderContext.prototype = {
        getNextSection: function () {
            return (
            this._requestContext.getNextSection(this._actionPrefix)
            );
        },
        isChangeLocal: function () {
            return (
            this._requestContext.startsWith(this._actionPrefix)
            );
        },
        isChangeRelevant: function () {
            if (!this._requestContext.startsWith(this._actionPrefix)) {
                return (false);
            }
            if (this._requestContext.hasActionChanged()) {
                return (true);
            }
            return (
            this._paramNames.length &&
            this._requestContext.haveParamsChanged(this._paramNames)
            );
        }
    };
})(angular, InVision);
;
;
/*! request-context.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("requestContext", RequestContext);
    /** @ngInject */
    function RequestContext(RenderContext) {
        this.RenderContext = RenderContext;
        this._action = "";
        this._sections = [];
        this._params = {};
        this._previousAction = "";
        this._previousParams = {};
        return (this);
    }
    RequestContext.prototype = {
        getAction: function () {
            return (this._action);
        },
        getNextSection: function (prefix) {
            if (!this.startsWith(prefix)) {
                return (null);
            }
            if (prefix === "") {
                return (this._sections[0]);
            }
            var depth = prefix.split(".").length;
            if (depth === this._sections.length) {
                return (null);
            }
            return (this._sections[depth]);
        },
        getParam: function (name) {
            return (this._params[name] || null);
        },
        getParamAsInt: function (name, defaultValue) {
            var valueAsInt = parseInt(this.getParam(name));
            if (isNaN(valueAsInt)) {
                return (defaultValue || 0);
            } else {
                return (valueAsInt);
            }
        },
        getRenderContext: function (requestActionLocation, paramNames) {
            requestActionLocation = (requestActionLocation || "");
            paramNames = (paramNames || []);
            if (!ng.isArray(paramNames)) {
                paramNames = [paramNames];
            }
            return (
            new this.RenderContext(this, requestActionLocation, paramNames)
            );
        },
        hasActionChanged: function () {
            return (this._action !== this._previousAction);
        },
        hasParamChanged: function (paramName, paramValue) {
            if (!ng.isUndefined(paramValue)) {
                return (!this.isParam(paramName, paramValue));
            }
            if (
            !(paramName in this._previousParams) &&
            (paramName in this._params)
            ) {
                return (true);
            } else if (
            (paramName in this._previousParams) &&
            !(paramName in this._params)
            ) {
                return (true);
            }
            return (this._previousParams[paramName] !== this._params[paramName]);
        },
        haveParamsChanged: function (paramNames) {
            for (var i = 0, length = paramNames.length ; i < length ; i++) {
                if (this.hasParamChanged(paramNames[i])) {
                    return (true);
                }
            }
            return (false);
        },
        isParam: function (paramName, paramValue) {
            if (
            (paramName in this._params) &&
            (this._params[paramName] == paramValue)
            ) {
                return (true);
            }
            return (false);
        },
        setContext: function (action, routeParams) {
            this._previousAction = this._action;
            this._previousParams = this._params;
            this._action = action;
            this._sections = action.split(".");
            this._params = ng.copy(routeParams);
        },
        startsWith: function (prefix) {
            if (
            !prefix.length ||
            (this._action === prefix) ||
            (this._action.indexOf(prefix + ".") === 0)
            ) {
                return (true);
            }
            return (false);
        }
    };
})(angular, InVision);
;
;
/*! screen-divider-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("screenDividerService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function createScreenDivider(projectID, label, screenPosition, displayObjectsPosition) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "createScreenDivider",
                parameters: {
                    projectID: projectID,
                    label: label,
                    position: screenPosition
                },
                successCallback: function (response) {
                    modelEvents.trigger("dividerCreated", response, displayObjectsPosition);
                }
            });
            return (promise);
        }
        function deleteScreenDivider(projectID, dividerID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "deleteScreenDivider",
                parameters: {
                    projectID: projectID,
                    dividerID: dividerID
                },
                successCallback: function (response) {
                    modelEvents.trigger("dividerDeleted", dividerID);
                }
            });
            return (promise);
        }
        function getByProjectID(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getByProjectID",
                parameters: {
                    projectID: projectID
                }
            });
            return (promise);
        }
        function updateScreenDivider(projectID, dividerID, label) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateScreenDivider",
                parameters: {
                    projectID: projectID,
                    dividerID: dividerID,
                    label: label
                },
                successCallback: function (response) {
                    modelEvents.trigger("dividerUpdated", response);
                }
            });
            return (promise);
        }
        function updateScreenDividerPositions(projectID, dividers) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateScreenDividerPositions",
                parameters: {
                    projectID: projectID,
                    dividers: dividers
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenDividerPositionsUpdated", response);
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/screen-divider/:docCommand",
        {
            docCommand: "@docCommand"
        },
        {
            createScreenDivider: {
                method: "POST",
                params: {
                    docCommand: "create"
                }
            },
            deleteScreenDivider: {
                method: "POST",
                params: {
                    docCommand: "delete"
                }
            },
            getByProjectID: {
                method: "GET"
            },
            updateScreenDivider: {
                method: "POST",
                params: {
                    docCommand: "update"
                }
            },
            updateScreenDividerPositions: {
                method: "POST",
                params: {
                    docCommand: "update-divider-positions"
                }
            }
        }
        );
        return ({
            createScreenDivider: createScreenDivider,
            deleteScreenDivider: deleteScreenDivider,
            getByProjectID: getByProjectID,
            updateScreenDivider: updateScreenDivider,
            updateScreenDividerPositions: updateScreenDividerPositions
        });
    }
})(angular, InVision);
;
;
/*! screen-history-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("screenHistoryService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function get(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    screenID: screenID
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function createShare(screenID, version) {
            var promise = serviceHelper.executeRequest({
                resource: shareResource,
                name: "create",
                parameters: {
                    screenID: screenID,
                    version: version
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/partials/desktop/screen-versions/:screenID/:command",
        {
            screenID: "@screenID",
            command: "@command"
        },
        {
            get: {
                method: "GET"
            }
        }
        );
        var shareResource = $resource(
        "/api/screen-versions/share",
        {
            screenID: "@screenID",
            version: "@version"
        },
        {
            create: {
                method: "POST"
            }
        }
        );
        return ({
            get: get,
            createShare: createShare
        });
    }
})(angular, InVision);
;
;
/*! screen-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("screenService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function activateScreen(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "activateScreen",
                parameters: {
                    id: screenID
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenUpdated", response);
                }
            });
            return (promise);
        }
        function archiveScreen(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "archiveScreen",
                parameters: {
                    id: screenID
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenUpdated", response);
                }
            });
            return (promise);
        }
        function archiveScreens(screenIDs) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "archiveScreens",
                parameters: {
                    screenIDs: screenIDs
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function deleteScreen(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "deleteScreen",
                parameters: {
                    id: screenID
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenDeleted", screenID);
                }
            });
            return (promise);
        }
        function deleteScreens(screenIDs) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "deleteScreens",
                parameters: {
                    screenIDs: screenIDs
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function duplicateScreen(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "duplicateScreen",
                parameters: {
                    id: screenID
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function getByID(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "getByID",
                parameters: {
                    id: id
                }
            });
            return (promise);
        }
        function markScreenAsRead(screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "markScreenAsRead",
                parameters: {
                    id: screenID
                }
            });
            return (promise);
        }
        function renameScreen(screenID, name) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "renameScreen",
                parameters: {
                    id: screenID,
                    name: name
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenUpdated", response);
                }
            });
            return (promise);
        }
        function saveConfig(screen) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "saveConfig",
                parameters: screen
            });
            return (promise);
        }
        function sendWorkflowStatusNotification(screenID, userIDList) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sendWorkflowStatusNotification",
                parameters: {
                    id: screenID,
                    userIDList: userIDList
                }
            });
            return (promise);
        }
        function setWorkflowStatus(screenID, workflowStatusID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "setWorkflowStatus",
                parameters: {
                    id: screenID,
                    workflowStatusID: workflowStatusID
                },
                successCallback: function (response) {
                    modelEvents.trigger("screenUpdated", response);
                }
            });
            return (promise);
        }
        function updateSort(projectID, screenIDs) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "updateSort",
                parameters: {
                    projectID: projectID,
                    screenIDs: screenIDs.join(",")
                },
                successCallback: function (response) {
                    modelEvents.trigger("projectScreensSorted", projectID, screenIDs);
                }
            });
            return (promise);
        }
        function setFixedHeaderHeight(screen) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "setFixedHeaderHeight",
                parameters: {
                    screenID: screen.id,
                    fixedHeaderHeight: screen.fixedHeaderHeight
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        function setFixedFooterHeight(screen) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "setFixedFooterHeight",
                parameters: {
                    screenID: screen.id,
                    fixedFooterHeight: screen.fixedFooterHeight
                },
                successCallback: function (response) {
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/screens/:listCommand:id/:docCommand",
        {
            id: "@id",
            listCommand: "@listCommand",
            docCommand: "@docCommand"
        },
        {
            activateScreen: {
                method: "POST",
                params: {
                    docCommand: "activate"
                }
            },
            archiveScreen: {
                method: "POST",
                params: {
                    docCommand: "archive"
                }
            },
            archiveScreens: {
                method: "POST",
                isArray: true,
                params: {
                    listCommand: "archive"
                }
            },
            deleteScreen: {
                method: "DELETE"
            },
            deleteScreens: {
                method: "POST",
                params: {
                    listCommand: "delete"
                }
            },
            duplicateScreen: {
                method: "POST",
                params: {
                    docCommand: "duplicate"
                }
            },
            getByID: {
                method: "GET"
            },
            markScreenAsRead: {
                method: "POST",
                params: {
                    docCommand: "mark-as-read"
                }
            },
            renameScreen: {
                method: "POST",
                params: {
                    docCommand: "rename"
                }
            },
            saveConfig: {
                method: "POST",
                params: {
                    docCommand: "config"
                }
            },
            sendWorkflowStatusNotification: {
                method: "POST",
                params: {
                    docCommand: "send-workflow-status-notification"
                }
            },
            setWorkflowStatus: {
                method: "POST",
                params: {
                    docCommand: "set-workflow-status"
                }
            },
            updateSort: {
                method: "POST",
                isArray: true,
                params: {
                    listCommand: "update-sort"
                }
            },
            setFixedHeaderHeight: {
                method: "POST",
                params: {
                    listCommand: "setFixedHeaderHeight"
                }
            },
            setFixedFooterHeight: {
                method: "POST",
                params: {
                    listCommand: "setFixedFooterHeight"
                }
            }
        }
        );
        var workflowStatus = {
            IN_PROGRESS: 1,
            COMPLETE: 2,
            COMPLETE_AND_APPROVED: 3
        };
        return ({
            activateScreen: activateScreen,
            archiveScreen: archiveScreen,
            archiveScreens: archiveScreens,
            deleteScreen: deleteScreen,
            deleteScreens: deleteScreens,
            duplicateScreen: duplicateScreen,
            getByID: getByID,
            markScreenAsRead: markScreenAsRead,
            renameScreen: renameScreen,
            saveConfig: saveConfig,
            sendWorkflowStatusNotification: sendWorkflowStatusNotification,
            setWorkflowStatus: setWorkflowStatus,
            updateSort: updateSort,
            workflowStatus: workflowStatus,
            setFixedHeaderHeight: setFixedHeaderHeight,
            setFixedFooterHeight: setFixedFooterHeight
        });
    }
})(angular, InVision);
;
;
/*! service-helper.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("serviceHelper", ServiceHelper);
    /** @ngInject */
    function ServiceHelper(Deferred) {
        function executeRequest(options) {
            var resource = options.resource;
            var name = options.name;
            var parameters = (options.parameters || {});
            var successCallback = (options.successCallback || ng.noop);
            var errorCallback = (options.errorCallback || ng.noop);
            var deferred = new Deferred();
            var resourceResponse = resource[name](
            parameters,
            function (response) {
                successCallback(response);
                deferred.resolve(response);
            },
            function (response) {
                errorCallback(response);
                deferred.reject(
                unwrapErrorMessage(response)
                );
            }
            );
            return (deferred.promise);
        }
        function unwrapErrorMessage(errorResponse) {
            try {
                var response = ng.fromJson(errorResponse.data);
                if (ng.isString(response)) {
                    response = {
                        message: response,
                        code: -1
                    };
                }
            } catch (error) {
                var response = {
                    message: errorResponse.data,
                    code: -1
                };
            }
            return (response);
        }
        return ({
            executeRequest: executeRequest
        });
    }
})(angular, InVision);
;
;
/*! session-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("sessionService", SessionService);
    /** @ngInject */
    function SessionService($q, $resource, serviceHelper, userService, _) {
        function authenticate() {
            var deferred = $q.defer();
            resource.get(
            {
            },
            function (response) {
                ng.extend(user, response.account);
                ng.extend(subscription, response.subscription);
                user.initials = userService.getInitials(user.name);
                user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
                deferred.resolve(response);
            },
            function () {
                deferred.reject();
            }
            );
            return (deferred.promise);
        }
        function get(key, defaultValue) {
            var localKey = getDataKey(key);
            if (data.hasOwnProperty(localKey)) {
                return (data[localKey]);
            } else if (!ng.isUndefined(defaultValue)) {
                data[localKey] = defaultValue;
                return (defaultValue);
            }
        }
        function getDataKey(key) {
            return ("session__" + key);
        }
        function isAuthenticated() {
            return (user.isAccountAuthenticated);
        }
        function set(key, value) {
            var localKey = getDataKey(key);
            data[localKey] = value;
        }
        function update() {
            resource.get(
            {},
            function (response) {
                ng.extend(user, response.account);
                ng.extend(subscription, response.subscription);
                user.initials = userService.getInitials(user.name);
                user.hasSystemAvatar = userService.isSystemAvatar(user.avatarID);
            }
            );
        }
        var resource = $resource(
        "/api/account",
        {
        },
        {
            getUser: {
                method: "GET"
            }
        }
        );
        var user = {
            id: 0,
            name: "",
            initials: "",
            hasSystemAvatar: true,
            email: "",
            isAccountAuthenticated: false
        };
        var subscription = {};
        var data = {};
        return ({
            authenticate: authenticate,
            get: get,
            isAuthenticated: isAuthenticated,
            set: set,
            update: update,
            subscription: subscription,
            user: user
        });
    }
})(angular, InVision);
;
;
/*! share-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("shareService", ShareService);
    /** @ngInject */
    function ShareService($resource, serviceHelper, modelEvents) {
        function createShare(
        projectID,
        screenID,
        isCommentingAllowed,
        isNavigateAllowed,
        isResizeWindow,
        isLoadAllScreens,
        isUserTesting,
        isAnonymousViewingAllowed,
        password
        ) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "createShare",
                parameters: {
                    projectID: projectID,
                    screenID: screenID,
                    isCommentingAllowed: isCommentingAllowed,
                    isNavigateAllowed: isNavigateAllowed,
                    isResizeWindow: isResizeWindow,
                    isLoadAllScreens: isLoadAllScreens,
                    isUserTesting: isUserTesting,
                    isAnonymousViewingAllowed: isAnonymousViewingAllowed,
                    password: password
                },
                successCallback: function (response) {
                    modelEvents.trigger("shareCreated", response);
                }
            });
            return (promise);
        }
        function revokeAllShares(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "revokeAllShares",
                parameters: {
                    projectID: projectID
                }
            });
            return (promise);
        }
        function revokeShare(shareID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "revokeShare",
                parameters: {
                    id: shareID
                }
            });
            return (promise);
        }
        function sendEmail(shareID, emailList, message) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sendEmail",
                parameters: {
                    id: shareID,
                    emailList: emailList,
                    message: message
                }
            });
            return (promise);
        }
        function sendSMS(shareID, phoneNumber) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "sendSMS",
                parameters: {
                    id: shareID,
                    phoneNumber: phoneNumber
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/share/:listCommand:id/:docCommand",
        {
            id: "@id",
            listCommand: "@listCommand",
            docCommand: "@docCommand"
        },
        {
            createShare: {
                method: "POST"
            },
            revokeAllShares: {
                method: "POST",
                params: {
                    listCommand: "revoke-all"
                }
            },
            revokeShare: {
                method: "DELETE"
            },
            sendEmail: {
                method: "POST",
                params: {
                    docCommand: "send-email"
                }
            },
            sendSMS: {
                method: "POST",
                params: {
                    docCommand: "send-sms"
                }
            }
        }
        );
        return ({
            createShare: createShare,
            revokeAllShares: revokeAllShares,
            revokeShare: revokeShare,
            sendEmail: sendEmail,
            sendSMS: sendSMS
        });
    }
})(angular, InVision);
;
;
/*! stack-trace-service.js */
;
;
(function (ng, app, printStackTrace) {
    "use strict";
    app.factory("stackTraceService", Factory);
    /** @ngInject */
    function Factory() {
        return ({
            print: printStackTrace
        });
    }
})(angular, InVision, printStackTrace);
;
;
/*! subscription-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("subscriptionService", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, sessionService) {
        function getAllPlans() {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "getAllPlans",
                cachedResponse: cache.getResponse("allPlans"),
                successCallback: function (response) {
                    cache.setResponse("allPlans", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("allPlans");
                }
            });
            return (promise);
        }
        function getCurrentPlan() {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "getCurrentPlan",
                cachedResponse: cache.getResponse("currentPlan"),
                successCallback: function (response) {
                    cache.setResponse("currentPlan", response);
                },
                errorCallback: function () {
                    cache.deleteResponse("currentPlan");
                }
            });
            return (promise);
        }
        function changePlan(plan, coupon) {
            var coupon = coupon || "";
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "changePlan",
                successCallback: function (response) {
                    cache.setResponse("currentPlan", response);
                    modelEvents.trigger("subscriptionChanged", response);
                    sessionService.update();
                },
                errorCallback: function (response) {
                    modelEvents.trigger("subscriptionUpdateError", response);
                    sessionService.update();
                },
                parameters: {
                    planId: plan.id,
                    coupon: coupon
                }
            });
            return (promise);
        }
        var cache = new PartialCache("subscriptionService");
        var resource = $resource(
        "/api/:rootObject/:command",
        {
            command: "@command",
            rootObject: "@rootObject"
        },
        {
            getAllPlans: {
                method: "GET",
                isArray: true,
                params: {
                    command: "",
                    rootObject: "plans"
                }
            },
            getCurrentPlan: {
                method: "GET",
                isArray: false,
                params: {
                    rootObject: "billing",
                    command: "get-current-plan"
                }
            },
            changePlan: {
                method: "POST",
                isArray: false,
                params: {
                    command: "",
                    rootObject: "subscriptions"
                }
            }
        }
        );
        return ({
            getAllPlans: getAllPlans,
            getCurrentPlan: getCurrentPlan,
            changePlan: changePlan
        });
    };
})(angular, InVision);
;
;
/*! team-invitation-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamInvitationService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function cancel(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "cancel",
                parameters: {
                    id: id
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamInvitationDeleted", id);
                }
            });
            return (promise);
        }
        function resend(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "resend",
                parameters: {
                    id: id
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamInvitationResent", response);
                }
            });
            return (promise);
        }
        function send(
        memberEmail,
        canCreateProjectsForLead,
        initialProjectMembershipList
        ) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "save",
                parameters: {
                    memberEmail: memberEmail,
                    canCreateProjectsForLead: canCreateProjectsForLead,
                    initialProjectMembershipList: initialProjectMembershipList
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamInvitationCreated");
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/team-invitation/:id/:command",
        {
            id: "@id",
            command: "@command"
        },
        {
            cancel: {
                method: "DELETE"
            },
            resend: {
                method: "POST",
                params: {
                    command: "resend"
                }
            },
            send: {
                method: "POST"
            }
        }
        );
        return ({
            cancel: cancel,
            resend: resend,
            send: send
        });
    }
})(angular, InVision);
;
;
/*! team-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamService", Service);
    /** @ngInject */
    function Service($resource, serviceHelper, modelEvents) {
        function grantAdminStatus(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "grantAdminStatus",
                parameters: {
                    id: id
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamMemberUpdated", response);
                }
            });
            return (promise);
        }
        function remove(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "remove",
                parameters: {
                    id: id
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamMemberDeleted", id);
                }
            });
            return (promise);
        }
        function revokeAdminStatus(id) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "revokeAdminStatus",
                parameters: {
                    id: id
                },
                successCallback: function (response) {
                    modelEvents.trigger("teamMemberUpdated", response);
                }
            });
            return (promise);
        }
        function setAdminStatus(id, isAdmin) {
            if (isAdmin) {
                return (grantAdminStatus(id));
            } else {
                return (revokeAdminStatus(id));
            }
        }
        var resource = $resource(
        "/api/team/:id/:command",
        {
            id: "@id",
            command: "@command"
        },
        {
            grantAdminStatus: {
                method: "POST",
                params: {
                    command: "grant-admin-status"
                }
            },
            remove: {
                method: "DELETE"
            },
            revokeAdminStatus: {
                method: "POST",
                params: {
                    command: "revoke-admin-status"
                }
            }
        }
        );
        return ({
            grantAdminStatus: grantAdminStatus,
            remove: remove,
            revokeAdminStatus: revokeAdminStatus,
            setAdminStatus: setAdminStatus
        });
    }
})(angular, InVision);
;
;
/*! template-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("templateService", TemplateService);
    /** @ngInject */
    function TemplateService(_, $resource, serviceHelper, modelEvents) {
        function getByProjectID(projectID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "query",
                parameters: {
                    projectID: projectID
                },
                successCallback: function (conversations) {
                }
            });
            return promise;
        }
        function saveTemplate(template) {
            var parameters = _.pick(template, "id", "projectID", "name");
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "save",
                parameters: parameters,
                successCallback: function (response) {
                    template.id = response.id;
                }
            });
            return promise;
        }
        function deleteTemplate(template) {
            var parameters = _.pick(template, "id");
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "delete",
                parameters: parameters,
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function addScreen(templateID, screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "addScreen",
                parameters: {
                    id: templateID,
                    screenID: screenID
                },
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function duplicateTemplate(templateID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "duplicateTemplate",
                parameters: {
                    id: templateID
                },
                successCallback: function (response) {
                }
            });
            return promise;
        }
        function removeScreen(templateID, screenID) {
            var promise = serviceHelper.executeRequest({
                resource: resource,
                name: "removeScreen",
                parameters: {
                    id: templateID,
                    screenID: screenID
                },
                successCallback: function (response) {
                }
            });
            return promise;
        }
        var resource = $resource(
        "/api/templates/:id/:command/:screenID",
        {
            id: "@id",
            command: "@command",
            screenID: "@screenID"
        },
        {
            addScreen: {
                method: "POST",
                params: {
                    command: "screens"
                }
            },
            duplicateTemplate: {
                method: "POST",
                params: {
                    command: "duplicate"
                }
            },
            removeScreen: {
                method: "DELETE",
                params: {
                    command: "screens"
                }
            }
        }
        );
        return {
            getByProjectID: getByProjectID,
            saveTemplate: saveTemplate,
            deleteTemplate: deleteTemplate,
            duplicateTemplate: duplicateTemplate,
            addScreen: addScreen,
            removeScreen: removeScreen
        };
    }
})(angular, InVision);
;
;
/*! twitter-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("twitterService", Service);
    /** @ngInject */
    function Service(BaseResourceService, $resource, Deferred) {
        BaseResourceService.call(this, $resource, Deferred);
        this.resource = this.Resource(
        "/api/twitter/:username",
        {
            username: "@username"
        },
        {
            getUser: {
                method: "GET"
            }
        }
        );
        return (this);
    }
    Service.prototype = {
        getUser: function (username) {
            var promise = this.executeCacheableResourceRequest({
                name: "getUser",
                parameters: {
                    username: username
                }
            });
            return (promise);
        }
    };
})(angular, InVision);
;
;
/*! user-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("userService", Service);
    /** @ngInject */
    function Service(_) {
        function getInitials(name) {
            if (!name) {
                return ("");
            }
            var nameParts = name.replace(/^\s+|\s+$/i, "").split(/\s+/i);
            var namePartsCount = nameParts.length;
            if (namePartsCount > 1) {
                return (
                nameParts[0].slice(0, 1) +
                nameParts[namePartsCount - 1].slice(0, 1)
                );
            }
            return (nameParts[0].slice(0, 1));
        }
        function getOnlineStatus(lastRequestAt) {
            var now = (new Date()).getTime();
            var onlineCutoff = (10 * 60 * 1000); 	// 10 minutes.
            var awayCutoff = (30 * 60 * 1000);	// 30 minutes.
            if (lastRequestAt > (now - onlineCutoff)) {
                return ("Online");
            } else if (lastRequestAt > (now - awayCutoff)) {
                return ("Away");
            }
            return ("Offline");
        }
        function getShortName(name) {
            if (!name) {
                return ("");
            }
            var nameParts = name.replace(/^\s+|\s+$/i, "").split(/\s+/i);
            var namePartsCount = nameParts.length;
            if (namePartsCount > 1) {
                return (
                nameParts[0] +
                " " +
                nameParts[namePartsCount - 1].slice(0, 1) +
                ((nameParts[namePartsCount - 1].length > 1) ? "." : "")
                );
            }
            return (nameParts[0]);
        }
        function isSystemAvatar(avatarID) {
            return (avatarID.indexOf("00000000") === 0);
        }
        return ({
            getInitials: _.memoize(getInitials),
            getOnlineStatus: getOnlineStatus,
            getShortName: _.memoize(getShortName),
            isSystemAvatar: _.memoize(isSystemAvatar)
        });
    }
})(angular, InVision);
;
;
/*! validation-service.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("validationService", ValidationService);
    /** @ngInject */
    function ValidationService() {
        this.errorCodes = [
        {
            code: 400,
            message: "Invalid request for this resource."
        },
        {
            code: 400,
            message: "Invalid request body content."
        },
        {
            code: 401,
            message: "The credentials you provided are not valid."
        },
        {
            code: 403,
            message: "Forbidden."
        },
        {
            code: 404,
            message: "The requested resource could not be found."
        },
        {
            code: 405,
            message: "The requested resource does not support the given method."
        },
        {
            code: 1100,
            message: "Validation failure"
        },
        {
            code: 1101,
            message: "Validation failure: missing field"
        },
        {
            code: 1102,
            message: "Validation failure: invalid field"
        },
        {
            code: 1103,
            message: "Validation failure: already exists"
        },
        {
            code: 500,
            message: "Unexpected error"
        }
        ];
        return (this);
    }
    ValidationService.prototype = {
        isAlreadyExists: function (error) {
            return (error.code === 1103);
        },
        isBadRequest: function (error) {
            return (error.code === 400);
        },
        isForbidden: function (error) {
            return (error.code === 403);
        },
        isInvalid: function (error) {
            return (error.code === 1100);
        },
        isInvalidField: function (error) {
            return (error.code === 1102);
        },
        isMissingField: function (error) {
            return (error.code === 1101);
        },
        isNotFound: function (error) {
            return (error.code === 404);
        },
        isOverQuota: function (error) {
            return (
            (error.code === 3000) ||
            (error.code === 3001)
            );
        }
    };
})(angular, InVision);
;
;
/*! zero-clipboard.js */
;
;
(function (ng, app) {
    "use strict";
    app.factory("ZeroClipboard", Factory);
    /** @ngInject */
    function Factory() {
        ZeroClipboard.setMoviePath("/assets/zeroclipboard/ZeroClipboard.swf");
        return (ZeroClipboard);
    }
})(angular, InVision);
;
;
/*! affiliate-activity-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("affiliateActivityModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, _) {
        function get(userID, projectID) {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: userID,
                    projectID: projectID
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/partials/desktop/affiliate-activity-modal/:id/:projectID",
        {
            id: "@id",
            projectID: "@projectID"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! change-plans-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("changePlansPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {}
            });
            return (promise);
        }
        function getCacheKey() {
            return ("na");
        }
        var cache = new PartialCache("changePlansPartial");
        var resource = $resource(
        "/api/partials/desktop/change-plans",
        {},
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! console-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("consolePartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(screenID) {
            var cacheKey = getCacheKey(screenID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: screenID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(screenID) {
            return (screenID);
        }
        var cache = new PartialCache("console");
        var resource = $resource(
        "/api/partials/desktop/console/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "screenDeleted",
        function (event, screenID) {
            cache.deleteResponse(getCacheKey(screenID));
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! dashboard-activity-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("dashboardActivityPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(offset, durationInDays) {
            var cacheKey = getCacheKey(offset, durationInDays);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    offset: offset,
                    durationInDays: durationInDays
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                }
            });
            return (promise);
        }
        function getCacheKey(offset, durationInDays) {
            return (offset + "-" + durationInDays);
        }
        var cache = new PartialCache("dashboardActivity", (2 * PartialCache.DAY));
        var resource = $resource(
        "/api/partials/desktop/dashboard/activity/:offset/:durationInDays",
        {
            offset: "@offset",
            durationInDays: "@durationInDays"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateResponses(
            function (response) {
                return (
                _.findWithProperty(response.activity.projects, "id", projectID)
                );
            },
            function (response) {
                response.projects = _.rejectWithProperty(response.activity.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateResponses(
            function (response) {
                return (
                _.findWithProperty(response.activity.projects, "id", project.id)
                );
            },
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.activity.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! dashboard-projects-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("dashboardProjectsPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("projects");
        }
        var cache = new PartialCache("dashboardProjects");
        var resource = $resource(
        "/api/partials/desktop/dashboard/projects",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateAllResponses(
            function (response) {
                response.projects = _.rejectWithProperty(response.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! dashboard-stat-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("dashboardStatPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(leadUserID, offset, durationInDays) {
            var cacheKey = getCacheKey(leadUserID, offset, durationInDays);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    leadUserID: leadUserID,
                    offset: offset,
                    durationInDays: durationInDays
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                }
            });
            return (promise);
        }
        function getCacheKey(leadUserID, offset, durationInDays) {
            return (leadUserID + "-" + offset + "-" + durationInDays);
        }
        var cache = new PartialCache("dashboardStats", (2 * PartialCache.DAY));
        var resource = $resource(
        "/api/partials/desktop/dashboard/stats/:leadUserID/:offset/:durationInDays",
        {
            leadUserID: "@leadUserID",
            offset: "@offset",
            durationInDays: "@durationInDays"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! existing-shares-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("existingSharesModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                }
            });
            return (promise);
        }
        var resource = $resource(
        "/api/partials/desktop/existing-shares-modal/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! new-project-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("newProjectModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("na");
        }
        var cache = new PartialCache("newProjectModal");
        var resource = $resource(
        "/api/partials/desktop/new-project-modal",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! new-share-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("newShareModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID, screenID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID,
                    screenID: (screenID || 0)
                }
            });
            return (promise);
        }
        function getCacheKey(projectID, screenID) {
            return (projectID);
        }
        var resource = $resource(
        "/api/partials/desktop/new-share-modal/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "POST",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! new-team-member-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("newTeamMemberModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("na");
        }
        var cache = new PartialCache("newTeamMemberModal");
        var resource = $resource(
        "/api/partials/desktop/new-team-member-modal",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! project-assets-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectAssetsPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("projectAssets");
        var resource = $resource(
        "/api/partials/desktop/projects/detail/:id/assets",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectAssetsSorted",
        function (event, projectID, assetIDs) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                for (var i = 0, length = assetIDs.length ; i < length ; i++) {
                    var assetID = assetIDs[i];
                    var sortIndex = (i + 1);
                    var cachedAsset = _.findWithProperty(response.asset, "id", assetID);
                    if (cachedAsset) {
                        cachedAsset.sort = sortIndex;
                    }
                }
            }
            );
        }
        );
        modelEvents.on(
        "assetDeleted",
        function (event, assetID) {
            cache.updateResponses(
            function (response) {
                return (_.findWithProperty(response.assets, "id", assetID));
            },
            function (response) {
                response.assets = _.withoutProperty(response.assets, "id", assetID);
            }
            );
        }
        );
        modelEvents.on(
        "assetUpdated",
        function (event, asset) {
            cache.updateResponse(
            getCacheKey(asset.projectID),
            function (response) {
                var cachedAsset = _.findWithProperty(response.assets, "id", asset.id);
                if (cachedAsset) {
                    _.extendExistingProperties(cachedAsset, asset);
                } else {
                    response.assets.push(asset);
                }
            }
            );
        }
        );
        modelEvents.on(
        "assetUploaded",
        function (event, asset) {
            cache.updateResponse(
            getCacheKey(asset.projectID),
            function (response) {
                var cachedAsset = _.findWithProperty(response.asset, "id", asset.id);
                if (cachedAsset) {
                    _.extendExistingProperties(cachedAsset, asset);
                } else {
                    response.assets.push(asset);
                }
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! project-conversations-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectConversationsPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID, status) {
            if (status === "open") {
                return (getOpenConversations(projectID, status));
            } else {
                return (getOtherConversations(projectID, status));
            }
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        function getOpenConversations(projectID, status) {
            var cacheKey = getCacheKey(projectID, status);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID,
                    status: status
                },
                successCallback: function (response) {
                },
                errorCallback: function () {
                }
            });
            return (promise);
        }
        function getOtherConversations(projectID, status) {
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID,
                    status: status
                }
            });
            return (promise);
        }
        function updateFilters(filters) {
            var promise = partialHelper.executeRequest({
                resource: filterResource,
                name: "updateFilters",
                parameters: {
                    commentFilterRead: filters.read.value,
                    commentFilterStatus: filters.status.value,
                    commentFilterType: filters.type.value
                },
                successCallback: function (response) {
                },
                errorCallback: function () {
                }
            });
            return (promise);
        }
        var cache = new PartialCache("projectConversations");
        var resource = $resource(
        "/api/partials/desktop/projects/detail/:id/conversations/:status",
        {
            id: "@id",
            status: "@status"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        var filterResource = $resource(
        "/api/account/filters",
        {},
        {
            updateFilters: {
                method: "POST",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        return ({
            get: get,
            updateFilters: updateFilters
        });
    }
})(angular, InVision);
;
;
/*! project-detail-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectDetailPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("projectDetail");
        var resource = $resource(
        "/api/partials/desktop/projects/detail/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateResponses(
            function (response) {
                return (response.project.id === project.id);
            },
            function (response) {
                _.extendExistingProperties(response.project, project);
            }
            );
        }
        );
        modelEvents.on(
        "subscriptionChanged",
        function (event, newPlan) {
            cache.rejectResponses(function (project) { return true; });
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! project-members-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectMembersModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("projectMembersModal");
        var resource = $resource(
        "/api/partials/desktop/project-members-modal/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateResponse(
            getCacheKey(project.id),
            function (response) {
                _.extendExistingProperties(response.project, project);
            }
            );
        }
        );
        modelEvents.on(
        "projectUserAdded",
        function (event, projectID, userID) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                var cachedUsers = _.filterWithProperty(response.teamMembers, "id", userID);
                _.setProperty(cachedUsers, "isProjectMember", true);
            }
            );
        }
        );
        modelEvents.on(
        "projectUsersAdded",
        function (event, projectID, userIDs) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                var cachedUsers = _.withPropertyRange(response.teamMembers, "id", userIDs);
                _.setProperty(cachedUsers, "isProjectMember", true);
            }
            );
        }
        );
        modelEvents.on(
        "projectUserRemoved",
        function (event, projectID, userID) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                var cachedUsers = _.filterWithProperty(response.teamMembers, "id", userID);
                _.setProperty(cachedUsers, "isProjectMember", false);
            }
            );
        }
        );
        modelEvents.on(
        "projectUsersRemoved",
        function (event, projectID, userIDs) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                var cachedUsers = _.withPropertyRange(response.teamMembers, "id", userIDs);
                _.setProperty(cachedUsers, "isProjectMember", false);
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! project-screens-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectScreensPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("projectScreens");
        var resource = $resource(
        "/api/partials/desktop/projects/detail/:id/screens",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectScreensSorted",
        function (event, projectID, screenIDs) {
            cache.updateResponse(
            getCacheKey(projectID),
            function (response) {
                for (var i = 0, length = screenIDs.length ; i < length ; i++) {
                    var screenID = screenIDs[i];
                    var sortIndex = (i + 1);
                    var cachedScreen = _.findWithProperty(response.screens, "id", screenID);
                    if (cachedScreen) {
                        cachedScreen.sort = sortIndex;
                    }
                }
            }
            );
        }
        );
        modelEvents.on(
        "screenDeleted",
        function (event, screenID) {
            cache.updateResponses(
            function (response) {
                return (_.findWithProperty(response.screens, "id", screenID));
            },
            function (response) {
                response.screens = _.withoutProperty(response.screens, "id", screenID);
            }
            );
        }
        );
        modelEvents.on(
        "screenUpdated",
        function (event, screen) {
            cache.updateResponse(
            getCacheKey(screen.projectID),
            function (response) {
                var cachedScreen = _.findWithProperty(response.screens, "id", screen.id);
                if (cachedScreen) {
                    _.extendExistingProperties(cachedScreen, screen);
                } else {
                    response.screens.push(screen);
                }
            }
            );
        }
        );
        modelEvents.on(
        "screenUploaded",
        function (event, screen) {
            cache.updateResponse(
            getCacheKey(screen.projectID),
            function (response) {
                var cachedScreen = _.findWithProperty(response.screens, "id", screen.id);
                if (cachedScreen) {
                    _.extendExistingProperties(cachedScreen, screen);
                } else {
                    response.screens.push(screen);
                }
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! projects-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("projectsProjectsPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("projects");
        }
        var cache = new PartialCache("projectsProjects");
        var resource = $resource(
        "/api/partials/desktop/projectsProjects",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateAllResponses(
            function (response) {
                response.projects = _.rejectWithProperty(response.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! standard-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("standardPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("projects");
        }
        var cache = new PartialCache("standardProjects");
        var resource = $resource(
        "/api/partials/desktop/standard/projects",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateAllResponses(
            function (response) {
                response.projects = _.rejectWithProperty(response.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! team-activity-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamActivityPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(userID, offset, durationInDays) {
            var cacheKey = getCacheKey(userID, offset, durationInDays);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: userID,
                    offset: offset,
                    durationInDays: durationInDays
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                }
            });
            return (promise);
        }
        function getCacheKey(userID, offset, durationInDays) {
            return (userID + "-" + offset + "-" + durationInDays);
        }
        var cache = new PartialCache("teamActivity", (2 * PartialCache.DAY));
        var resource = $resource(
        "/api/partials/desktop/team/detail/:id/activity/:offset/:durationInDays",
        {
            id: "@id",
            offset: "@offset",
            durationInDays: "@durationInDays"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateResponses(
            function (response) {
                return (
                _.findWithProperty(response.activity.projects, "id", projectID)
                );
            },
            function (response) {
                response.projects = _.rejectWithProperty(response.activity.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateResponses(
            function (response) {
                return (
                _.findWithProperty(response.activity.projects, "id", project.id)
                );
            },
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.activity.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! team-detail-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamDetailPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, sessionService, _) {
        function get(userID) {
            var cacheKey = getCacheKey(userID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: userID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(userID) {
            return (userID);
        }
        var cache = new PartialCache("teamDetail");
        var resource = $resource(
        "/api/partials/desktop/team/detail/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "accountUpdated",
        function (event, account) {
            cache.updateResponses(
            function (response) {
                return (response.teamMember.id === account.id);
            },
            function (response) {
                _.extendExistingProperties(response.teamMember, account);
            }
            );
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateAllResponses(
            function (response) {
                response.projects = _.withoutProperty(response.projects, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        modelEvents.on(
        "projectUserAdded",
        function (event, projectID, userID) {
            cache.updateResponse(
            getCacheKey(userID),
            function (response) {
                var cachedProject = _.findWithProperty(response.projects, "id", projectID);
                if (cachedProject) {
                    cachedProject.includesTeamMember = true;
                }
            }
            );
        }
        );
        modelEvents.on(
        "projectUserRemoved",
        function (event, projectID, userID) {
            if (userID === sessionService.user.id) {
                cache.updateResponse(
                getCacheKey(userID),
                function (response) {
                    response.projects = _.withoutProperty(response.projects, "id", projectID);
                }
                );
            } else {
                cache.updateResponse(
                getCacheKey(userID),
                function (response) {
                    var cachedProject = _.findWithProperty(response.projects, "id", projectID);
                    if (cachedProject) {
                        cachedProject.includesTeamMember = false;
                    }
                }
                );
            }
        }
        );
        modelEvents.on(
        "teamMemberDeleted",
        function (event, userID) {
            cache.deleteResponse(getCacheKey(userID));
        }
        );
        modelEvents.on(
        "teamMemberUpdated",
        function (event, teamMember) {
            cache.updateResponse(
            getCacheKey(teamMember.id),
            function (response) {
                var cachedTeamMember = _.extendExistingProperties(
                _.findWithProperty(response.teamMembers, "id", teamMember.id),
                teamMember
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! team-list-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamListPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("teamList");
        }
        var cache = new PartialCache("teamList");
        var resource = $resource(
        "/api/partials/desktop/team/list",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "accountUpdated",
        function (event, account) {
            cache.updateAllResponses(
            function (response) {
                var cachedTeamMember = _.extendExistingProperties(
                _.findWithProperty(response.teamMembers, "id", account.id),
                account
                );
            }
            );
        }
        );
        modelEvents.on(
        "projectUserAdded",
        function (event, projectID, userID) {
            cache.updateAllResponses(
            function (response) {
                var cachedTeamMember = _.findWithProperty(response.teamMembers, "id", userID);
                if (cachedTeamMember) {
                    cachedTeamMember.projectCount++;
                }
            }
            );
        }
        );
        modelEvents.on(
        "projectUserRemoved",
        function (event, projectID, userID) {
            cache.updateAllResponses(
            function (response) {
                var cachedTeamMember = _.findWithProperty(response.teamMembers, "id", userID);
                if (cachedTeamMember) {
                    cachedTeamMember.projectCount--;
                }
            }
            );
        }
        );
        modelEvents.on(
        "teamInvitationDeleted",
        function (event, invitationID) {
            cache.updateAllResponses(
            function (response) {
                response.invitations = _.withoutProperty(response.invitations, "id", invitationID);
            }
            );
        }
        );
        modelEvents.on(
        "teamMemberDeleted",
        function (event, userID) {
            cache.updateAllResponses(
            function (response) {
                response.teamMembers = _.withoutProperty(response.teamMembers, "id", userID);
            }
            );
        }
        );
        modelEvents.on(
        "teamMemberUpdated",
        function (event, teamMember) {
            cache.updateAllResponses(
            function (response) {
                var cachedTeamMember = _.extendExistingProperties(
                _.findWithProperty(response.teamMembers, "id", teamMember.id),
                teamMember
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! team-notifications-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamNotificationsPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("na");
        }
        var cache = new PartialCache("teamNotifications", (2 * PartialCache.DAY));
        var resource = $resource(
        "/api/partials/desktop/team/detail/notifications",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "notificationSettingsUpdated",
        function (event, settings) {
            cache.updateAllResponses(
            function (response) {
                response.notificationSettings = settings;
            }
            );
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.updateAllResponses(
            function (response) {
                response.projects = _.rejectWithProperty(response.projects, "id", projectID);
                response.notificationSettings.projectNotifications = _.rejectWithProperty(response.notificationSettings.projectNotifications, "id", projectID);
            }
            );
        }
        );
        modelEvents.on(
        "projectUpdated",
        function (event, project) {
            cache.updateAllResponses(
            function (response) {
                var cachedProject = _.extendExistingProperties(
                _.findWithProperty(response.projects, "id", project.id),
                project
                );
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! team-profile-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("teamProfilePartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get() {
            var cacheKey = getCacheKey();
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey() {
            return ("na");
        }
        var cache = new PartialCache("teamProfile");
        var resource = $resource(
        "/api/partials/desktop/team/detail/profile",
        {
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "accountUpdated",
        function (event, account) {
            cache.updateAllResponses(
            function (response) {
                _.extendExistingProperties(response.account, account);
            }
            );
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! transfer-project-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("transferProjectModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("transferProjectModal");
        var resource = $resource(
        "/api/partials/desktop/transfer-project-modal/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);
;
;
/*! workflow-status-notification-modal-partial.js */
;
;
(function (ng, app) {
    "use strict";
    app.service("workflowStatusNotificationModalPartial", Service);
    /** @ngInject */
    function Service($resource, partialHelper, PartialCache, modelEvents, _) {
        function get(projectID, screenID) {
            var cacheKey = getCacheKey(projectID);
            var promise = partialHelper.executeRequest({
                resource: resource,
                name: "get",
                parameters: {
                    id: projectID
                },
                cachedResponse: cache.getResponse(cacheKey),
                successCallback: function (response) {
                    cache.setResponse(cacheKey, response);
                },
                errorCallback: function () {
                    cache.deleteResponse(cacheKey);
                }
            });
            return (promise);
        }
        function getCacheKey(projectID) {
            return (projectID);
        }
        var cache = new PartialCache("workflowStatusNotificationModal");
        var resource = $resource(
        "/api/partials/desktop/workflow-status-notification-modal/:id",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: false
            }
        }
        );
        modelEvents.on(
        "projectDeleted",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectUserAdded",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        modelEvents.on(
        "projectUserRemoved",
        function (event, projectID) {
            cache.deleteResponse(getCacheKey(projectID));
        }
        );
        return ({
            get: get
        });
    }
})(angular, InVision);