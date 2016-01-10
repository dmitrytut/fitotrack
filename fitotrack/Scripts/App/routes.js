
//
// Fitotrack App Routes

(function (ng, app) {
    "use strict";

    app.config(
        [
            '$stateProvider',
            '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                //
                // Rules.
                //
                // Case insensitive url.
                $urlRouterProvider.rule(function ($injector, $location) {
                    var path = $location.path(), normalized = path.toLowerCase();
                    if (path != normalized) {
                        $location.replace().path(normalized);
                    }
                });
                //
                // Dealing with trailing slash in url.
                $urlRouterProvider.rule(function ($injector, $location) {
                    var path = $location.url();
                    // Check to see if the path has a trailing slash.
                    if ('/' === path[path.length - 1]) {
                        return path.replace(/\/$/, '');
                    }
                    if (path.indexOf('/?') > 0) {
                        return path.replace('/?', '?');
                    }
                    return false;
                });

                //
                // Main abstract route for vital information resolving.
                $stateProvider
                    .state('main', {
                        abstract: true,
                        template: '<ui-view/>',
                        // Centralize the config resolution.
                        resolve: {
                            ftGlobal: '$ftGlobal',
                            global: function (ftGlobal) {
                                return ftGlobal.getSessionUserInfo();
                            }
                        }
                    });

                //
                // Dashboard routing.
                $stateProvider
                    .state('dashboard', {
                        url: '/dashboard',
                        templateUrl: '/tpl/partial?name=dashboard/dashboard.main',
                        controller: 'dashboard.Ctrl',
                        resolve: {
                            dashboardInitDataSvc: 'dashboard.InitData',
                            dashboardInitialData: function (dashboardInitDataSvc) {
                                return dashboardInitDataSvc();
                            }
                        },
                        parent: 'main'
                    });

                //
                // Meal routing.
                $stateProvider
                    .state('food', {
                        abstract: true,
                        url: '/food',
                        template: '<div ui-view></div>',
                        parent: 'main',
                        defaultChild: 'food.diary_today'
                    })
                    .state('food.diary_today', {
                        url: '/diary',
                        templateUrl: '/tpl/partial?name=meal/food/food.diary.main',
                        controller: 'meal.food.DiaryCtrl'
                    })
                    .state('food.diary_date', {
                        url: '/diary/{date}',
                        templateUrl: '/tpl/partial?name=meal/food/food.diary.main',
                        controller: 'meal.food.DiaryCtrl'
                    })
                    .state('food.view', {
                        url: '/view/{foodId}',
                        templateUrl: '/tpl/partial?name=meal/food/food.view.main',
                        controller: 'meal.food.ViewCtrl'
                    })
                    .state('food.search', {
                        url: '/search{query:(?:/[^/]+)?}{pageNum:(?:/[^/]+)?}{pageSize:(?:/[^/]+)?}',
                        templateUrl: '/tpl/partial?name=meal/food/food.search.main',
                        controller: 'meal.food.SearchCtrl'
                    });

                //
                // Workout routing.
                $stateProvider
                    .state('workout', {
                        abstract: true,
                        url: '/workout',
                        template: '<div ui-view></div>',
                        parent: 'main',
                        defaultChild: 'workout.diary_today'
                    })
                    .state('workout.diary_today', {
                        url: '/diary',
                        templateUrl: '/tpl/partial?name=workout/diary/workout.diary.main',
                        controller: 'workout.diary.Ctrl'
                    })
                    .state('workout.diary_date', {
                        url: '/diary/{date}',
                        templateUrl: '/tpl/partial?name=workout/diary/workout.diary.main',
                        controller: 'workout.diary.Ctrl'
                    });
                //
                // Exercises routing.
                $stateProvider
                    .state('exercise', {
                        abstract: true,
                        url: '/exercise',
                        template: '<div ui-view></div>',
                        parent: 'main',
                        defaultChild: 'exercise.view'
                    })
                    .state('exercise.view', {
                        url: '/{exerciseId}',
                        templateUrl: '/tpl/partial?name=workout/exercises/workout.exercise.view',
                        controller: 'workout.exercise.Ctrl'
                    });

                //
                // Statistics routing.
                $stateProvider
                    .state('statistics', {
                        abstract: true,
                        url: '/stats',
                        templateUrl: '/tpl/partial?name=statistics/statistics.main',
                        controller: 'statistics.Ctrl',
                        parent: 'main',
                        defaultChild: 'statistics.all'
                    })
                .state('statistics.empty', {
                        url: '',
                        controller: ['$state', function ($state) {
                            $state.transitionTo('statistics.all');
                        }]
                })
                    .state('statistics.all', {
                        url: '/all',
                        templateUrl: '/tpl/partial?name=statistics/statistics.all'
                    })
                    .state('statistics.body', {
                        url: '/body',
                        templateUrl: '/tpl/partial?name=statistics/statistics.body'
                    })
                    .state('statistics.strength', {
                        url: '/strength',
                        templateUrl: '/tpl/partial?name=statistics/statistics.strength'
                    })
                    .state('statistics.cardio', {
                        url: '/cardio',
                        templateUrl: '/tpl/partial?name=statistics/statistics.cardio'
                    })
                    .state('statistics.nutrition', {
                        url: '/nutrition',
                        templateUrl: '/tpl/partial?name=statistics/statistics.nutrition'
                    });

                //
                // Profile routing.
                $stateProvider
                    .state('profile', {
                            abstract: true,
                            url: '/profile',
                            templateUrl: '/tpl/partial?name=profile/profile.view.main',
                            controller: 'profile.Ctrl',
                            resolve: {
                                profileService: 'profile.Service',
                                profileData: function (profileService) {
                                    return profileService.get();
                                }
                            },
                            parent: 'main',
                            defaultChild: 'profile.general'
                        })
                        .state('profile.empty', {
                            url: '',
                            controller: ['$state', function ($state) {
                                $state.transitionTo('profile.general');
                            }]
                        })
                        .state('profile.general', {
                            url: '/general',
                            templateUrl: '/tpl/partial?name=profile/profile.view.general'
                        })
                        .state('profile.physicalinfo', {
                            url: '/physicalinfo',
                            templateUrl: '/tpl/partial?name=profile/profile.view.physicalinfo'
                        })
                        .state('profile.goals', {
                            url: '/goals',
                            templateUrl: '/tpl/partial?name=profile/profile.view.goals'
                        })
                        .state('profile.goals.create', {
                            url: "/create?return",
                            onEnter: [
                                '$rootScope',
                                '$state',
                                '$modal',
                                'profile.Service',
                                function ($rootScope, $state, $modal, profileService) {
                                    $modal.open({
                                        templateUrl: "/tpl/partial?name=profile/profile.view.goals.create",
                                        resolve: {
                                            physicalInfoEx: function () {
                                                return profileService.getPhysicalInfoEx();
                                            }
                                        },
                                        controller: 'profile.GoalWizard.Ctrl'
                                    }).result.then(function (result) {
                                    }).finally(function () {
                                        // Get redirect parameter value from url.
                                        var isReturn = ($state.params['return'] === 'true');

                                        if (isReturn &&
                                            ng.isDefined($rootScope.$previousState.name) &&
                                            $rootScope.$previousState.name.length > 0) {
                                            return $state.go($rootScope.$previousState.name);
                                        }
                                        return $state.go("profile.goals");
                                    });
                                }]
                        })
                    .state('profile.credentials', {
                        url: '/credentials',
                        templateUrl: '/tpl/partial?name=profile/profile.view.credentials'
                    })
                    .state('profile.notifications', {
                        url: '/notifications',
                        templateUrl: '/tpl/partial?name=profile/profile.view.notifications'
                    })
                    .state('profile.privacy', {
                        url: '/privacy',
                        templateUrl: '/tpl/partial?name=profile/profile.view.privacy'
                    });
                //
                // Other.
                $urlRouterProvider.otherwise('/dashboard');

                //function () {
 
                //    if (window.location.pathname == baseSiteUrlPath || window.location.pathname == baseSiteUrlPath + "angular") {
                //        window.location = baseSiteUrlPath + "angular/index";
                //    } else {
                //        window.location = baseSiteUrl + "angular/page-not-found";
                //    }
            }]);
})(angular, fitotrack);