
//
//Profile service for communicating with server side

(function (ng, app) {
    'use strict';

    app.factory('data.profile.Service',
            function (Restangular) {
                var rest = Restangular.all('food');
                //Get profile from FS server
                function get(id) {
                    return rest.one('getfsProfile', id).get();
                }
                //Save profile to FT server
                function save(profile) {
                    return rest.post(profile);
                }
                //Update profile on FT server
                function update(profile) {
                    return 'undefined';
                }
                //Delete profile from FT server
                function remove(id) {
                    return 'undefined';
                }
                var foodService = {
                    get: get,
                    save: save,
                    update: update,
                    remove: remove
                };
                return proflieService;
            }
        );
})(angular, fitotrack);