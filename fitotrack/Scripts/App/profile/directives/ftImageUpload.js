
/**
 * @fileOverview
 * ftImageUpload.js
 * File upload directive.
 */

(function (ng, app) {
    'use strict';

    app.directive('ftImageUpload',
        [
            '$q',
            '$timeout',
            'moment',
            'appCfg',
            'utilsService',
            'notificationService',
            function ($q, $timeout, moment, appCfg, utils, notification) {
                var ftImageUpload = {
                    restrict: 'E',
                    replace: true,
                    require: 'ngModel',
                    scope: {
                        ngModel: '=',
                        gender: '@',
                        onSuccess: '&'
                    },
                    controller: [
                        '$scope', 
                        '$http',
                        function ($scope, $http) {
                            // Is male gender.
                            $scope.isMale = function () {
                                return $scope.gender == appCfg.Gender.Male;
                            };
                            // Is female gender.
                            $scope.isFemale = function () {
                                return $scope.gender == appCfg.Gender.Female;
                            };
                            // Function for determine while image element must be visible or not.
                            $scope.isPreviewImgVisible = function () {
                                return ($scope.uploadedImageSrc && $scope.uploadedImageSrc.length > 0);
                            };
                            // Add extra data to input string
                            $scope.addExtraData = function (str) {
                                return str + $scope.extraDataConst + (new Date()).getTime();
                            };
                            // Upload function for browsers that support FormData object.
                            $scope.uploadImage = function (image) {
                                if (image) {
                                    // Create a FormData instance
                                    var formData = new FormData();
                                    // Add the file
                                    formData.append("userImage", image);
                                    // Post image with 'Content-Type' trick. 
                                    // In this case 'Content-Type' will be transformed to proper value with boundary.
                                    $http.post("/api/profile/uploaduserimage", formData, {
                                        withCredentials: true,
                                        headers: { 'Content-Type': undefined },
                                        transformRequest: angular.identity
                                    }).success(function (data) {
                                        if (data.value) {
                                            // Validate url
                                            if (appCfg.regexpURL.test(data.value)) {
                                                // Change the model
                                                $scope.uploadedImageSrc = $scope.addExtraData(data.value);
                                                $scope.ngModel = $scope.uploadedImageSrc;

                                                // Call onSuccess callback function
                                                $timeout(function () {
                                                    $scope.onSuccess()
                                                });
                                            }
                                        }
                                    }).error(function () {
                                        notification.error("Unexpected error. Please, try another image.");
                                    });
                                }
                            };
                        }
                    ],
                    link: function (scope, element, attrs, ngModel) {
                        scope.extraDataConst = "?ftimageupload=";
                        scope.uploadedImageSrc = "";
                        scope.isIFrame = false;
                        // Rendering ngModel
                        ngModel.$render = function () {
                            // Save ngModel while rendering directive
                            scope.uploadedImageSrc = ngModel.$viewValue;
                        };
                        // Model changing function
                        scope.setModel = function (data) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(data);
                                // Update image source and add extra info (?...) 
                                // for guaranteed changing of variable (bad hack).
                                // Without extra info preview image wouldn't update 
                                // because image src can be the same as previous.
                                scope.uploadedImageSrc = scope.addExtraData(ngModel.$viewValue);
                            });
                        };
                        // Format modelValue to viewValue with extra info (?...)
                        ngModel.$formatters.push(function (modelValue) {
                            if (!utils.isUndefinedOrNull(modelValue) && modelValue.length > 0) {
                                var viewValue = scope.addExtraData(modelValue);
                                return viewValue;
                            }
                            return modelValue;
                        });
                        // Parse viewValue to modelValue without extra info (?...)
                        ngModel.$parsers.push(function (viewValue) {
                            if (!utils.isUndefinedOrNull(viewValue) && viewValue.length > 0) {
                                var queryPartIndex = viewValue.toLowerCase().lastIndexOf(scope.extraDataConst);
                                if (queryPartIndex > 0){
                                    var modelValue = viewValue.substring(0, queryPartIndex);
                                    return modelValue;
                                }
                            }
                            return viewValue;
                        });
                        // Check for browser FormData support
                        if (window.FormData === undefined) {
                            scope.isIFrame = true;
                            // if browser doesn't support FormData, use iFrame method for file upload
                            // Make form ready to interact with iframe
                            element.find('form').attr('action', '/api/profile/uploaduserimage');
                            element.find('form').attr('target', 'ftImageUploadIFrame');
                            // Create hidden iframe dynamically to prevent record in browser history
                            var iframeHtml = '<iframe id="ftImageUploadIFrame" name="ftImageUploadIFrame" height="0" width="0" frameborder="0" scrolling="yes" style="display:none"></iframe>';
                            // Append iframe to parent directive
                            if (!$(element).find('#ftImageUploadIFrame').length) {
                                element.append(iframeHtml);
                            }
                            $(element).find('#ftImageUploadIFrame').bind('load', function () {
                                var iframeBody = $(element).find('#ftImageUploadIFrame').contents().find('body').find('pre');
                                if (iframeBody.length) {
                                    var imgSrc = iframeBody.text();
                                    if (imgSrc && imgSrc.length > 0) {
                                        // Validate url
                                        if (appCfg.regexpURL.test(imgSrc)) {
                                            // Change the model
                                            scope.setModel(imgSrc);
                                        }
                                    }
                                }
                            });
                        }
                        $(element).find('#ftImageUploadButton').bind('click', function () {
                            // Raise click event for hidden file input
                            $(element).find('#ftImageUploadFileInput').trigger('click');
                        });
                        // Upload file to server on file input changed (actually on file select)
                        $(element).find('#ftImageUploadFileInput').bind('change', function (evt) {
                            var files = evt.__files_ || evt.target.files;
                            if (files[0]) {
                                if (scope.isIFrame) {
                                    element.find('form').trigger('submit');
                                } else {
                                    scope.uploadImage(files[0]);
                                }
                            }
                        });
                    },
                    template:
                    '<div name="ft-image-upload">' +
                    '<div class="profile-avatar-pane">' +
                        '<img data-ng-if="isPreviewImgVisible()" data-ng-src="{{uploadedImageSrc}}"/>' +
                        '<img data-ng-if="!isPreviewImgVisible() && isFemale()" src="/Content/img/empty-avatar-f.png"/>' +
                        '<img data-ng-if="!isPreviewImgVisible() && !isFemale()" src="/Content/img/empty-avatar-m.png"/>' +
                    '</div>' +
                    '<form method="post" enctype="multipart/form-data">' +
                        '<button type="button" id="ftImageUploadButton" class="btn btn-lg btn-primary upload-photo-btn">' +
                            'Upload' + 
                        '</button>' +
                        '<input type="file" ' +
                            'name="ftImageUploadFileInput"' +
                            'id="ftImageUploadFileInput"' + 
                            'multiple="false"' +
                            'accept="image/jpg, image/jpeg, image/pjpeg, image/gif, image/x-png, image/png, image/bmp"' +
                            'style="display:none" />' + 
                    '</form>' +
                    '</div>'
                };
                return ftImageUpload;
            }
        ]);
})(angular, fitotrack, moment);