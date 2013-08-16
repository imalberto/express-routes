/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint nomen:true, node:true*/

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    params  = require('express-params'),

    pathTo    = require('../../lib/pathto'),
    roads     = require('../../lib/roads'),
    regparams = require('../../lib/regparams'),

    app = express();

roads.extend(app);
regparams.extend(app);
params.extend(app);

app.engine('.hbs', exphbs({
    extname      : '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

// -- Routes -------------------------------------------------------------------

function render(view) {
    return function (req, res, next) {
        res.render(view, {
            helpers: {pathTo: pathTo(app.getRouteMap(app.getNamedRoutes()))}
        });
    };
}

function bucket(num) {
    return function (req, res, next) {
        res.exposeRoutes(app.findAll('name', {bucket: num}));
        next();
    };
}

app.param('postId', function (value) {
    console.log('---- verifying that value is: ' + value);
    return Number(value);
});

app.get('/posts/', render('posts'));
app.nameRoute('posts', '/posts/');

app.get('/posts/:postId', bucket(1), render('post'));
app.annotate('/posts/:postId', {bucket: 1});
app.nameRoute('post', '/posts/:postId');


app.param('admin', /^settings\/?/);
app.get('/admin/:admin', render('posts'));
app.nameRoute('admin', '/admin/:admin');
app.annotate('/admin/:admin', { bucket: 99});

app.get('/', function (req, res, next) {
    res.locals.pageId = 1;
    next();
}, render('home'));
app.annotate('/', { bucket: 2 });
app.nameRoute('home', '/');

app.exposeRoutes();

// -- Serve --------------------------------------------------------------------

app.listen(3000, function () {
    console.log('Server listening on port: 3000');
});
