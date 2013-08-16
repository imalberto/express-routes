/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, node:true*/

'use strict';

exports.extend = extendApp;

function extendApp(app) {
    if (app['@regparams']) { return app; }

    // Brand.
    Object.defineProperty(app, '@regparams', {value: true});

    app.params = {};
    app.param(registerParam.bind(app));

    return app;
}

function registerParam(name, handler) {
    /*jshint validthis:true */
    if ((handler instanceof RegExp) || handler.length < 3) {
        this.params[name] = handler;
    }
}
