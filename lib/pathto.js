/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, node:true*/

var REGEX_PATH_PARAM = /([:*])([\w\-]+)?/g;

module.exports = function (routeMap) {
    /**
    @return {String} route path that maches routeName
    **/
    return function (routeName, options) {
        var context,
            path,
            keys,
            route = routeMap[routeName];

        options = options || {};
        context = options.hash;

        if (!route) { return ''; }

        path = route.path;
        keys = route.keys.map(function (key) { return key.name || key; });

        if (context && keys.length) {
            keys.forEach(function (key) {
                var regex = new RegExp('[:*]' + key + '\\b');
                path = path.replace(regex, context[key]);
            });
        }

        // Replace missing params with empty strings.
        return path.replace(REGEX_PATH_PARAM, '');
    };
};
