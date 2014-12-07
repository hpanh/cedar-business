//Middleware modules
const express = require('express');

const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const compress = require('compression');

const cluster = require('cluster');
const config = require('./lib/config');

var numCPUs = require('os').cpus().length; //Count number of cpus

var app = express();

var debug = (config('NODE_ENV', '') === 'test') || config('DEBUG', false);
if (debug) {
    console.info("Debug is ON");
}

function init() {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const compress = require('compression');
    const favicon = require('serve-favicon');

    const nunjucks = require('nunjucks');
    const path = require('path');
    const middleware = require('./middleware');
    const views = require('./views');
    const http = require('http');
    const cedarApi = require('./api');

    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([
        path.join(__dirname, './templates'),
        path.join(__dirname, './static/templates')
    ]), {
        autoescape: true,
        watch: true
    });

    env.express(app);

    app.locals.newrelic = newrelic;
    app.locals.cw_url = config('CEDAR_AUDIENCE');

    var STATIC_DIR = path.join(__dirname, '/static');
    var STATIC_ROOT = '/static';
    var CSRF_OPTIONS = {
        whitelist: [
            '/login/facebook',
            '/persona/login',
            '/persona/logout',
            '/persona/verify',
            '/api/user',
            '/hook'
        ]
    };

    app.use(multer({ dest: './.tmp/'}));
    app.use(compress());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json())
    app.use(cookieParser());
    app.use(favicon(__dirname + '/static/favicon.ico'));
    app.use(middleware.session());
    app.use(middleware.csrf(CSRF_OPTIONS));
    app.use(middleware.sass(STATIC_DIR, STATIC_ROOT));
    app.use(middleware.addCsrfToken);
    app.use(middleware.debug);
    app.use(middleware.initLocalData);
    app.use(STATIC_ROOT, express.static(STATIC_DIR));
    app.use(middleware.staticResource(STATIC_ROOT));
    app.use(middleware.domainWrapper(cluster));

    var LOGIN_PAGE_REDIRECT_TO = '/login';
    var secureRouteHandlers = [middleware.cedarUserAware(LOGIN_PAGE_REDIRECT_TO)];
    //var secureRouteHandlers = [persona.ensureLoggedIn(), middleware.cedarUserAware()];
    var secureApiHandlers = [middleware.verifyApiRequest()];

    var api = express.Router();

    app.get('/', views.home);

    api.get('/users', cedarApi.user.getUsers);
    api.get('/user/email/:email', secureApiHandlers, cedarApi.user.getUser);
    api.get('/user/current', cedarApi.user.getCurrentUser);
    api.get('/user/username/:username', secureApiHandlers, cedarApi.user.getUser);

    api.get('/badges', cedarApi.badge.getBadges);
    api.get('/badges/:badgeSlug', cedarApi.badge.getBadge);

    api.get('/issuers', cedarApi.issuer.getIssuers);
    api.get('/issuers', cedarApi.issuer.getIssuer);
    app.use('/api', api);

    app.get('/blog', function (req, res, next) {
        res.redirect('http://blog.toxbadge.com');
    });

    app.get('*', function (req, res, next) {
        var error = new Error('Page not found');

        Object.defineProperties(error, {
            name: {value: 'ResourceNotFoundError'},
            code: {value: 404},
        });

        next(error);
    });

    app.all('*', function (req, res, next) {
        var error = new Error('Method not allowed');

        Object.defineProperties(error, {
            name: {value: 'MethodNotAllowedError'},
            code: {value: 405},
        });

        next(error);
    });
    app.use(middleware.logErrors());
    app.use(middleware.clientErrorHandler());
    app.use(middleware.errorHandler());
}

if (cluster.isMaster && debug == false) {
    //newrelic only run once
    var newrelic;
    if (process.env.NEW_RELIC_ENABLED) {
        newrelic = require('newrelic');
        console.log('newrelic is running');
    } else {
        newrelic = {
            getBrowserTimingHeader: function () {
                return "<!-- New Relic RUM disabled -->";
            }
        };
    }

    //As I tested with using maximum number of workers, there exists memory excceed error in heroku.
    //I think the reason come from the number of workers, if I reduce the workers the error seem to take longer
    //time before it occur again.
    //I choose 1 as this is the smallest number of worker we can choose now, if it still create memory excceed error,
    //our last solution is to disable worker and use the old method.
    numCPUs = 1;
    if (debug == true) {
        numCPUs = 1;
    };

    //Fork worker base on number of CPUs (or dynos)
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    };

    //events
    var timeouts = [];
    function errorMsg() {
      console.error("New worker is forked");
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    })
    cluster.on('disconnect', function(worker) {
        console.error('worker ' + worker.process.pid + ' disconnect!');
        cluster.fork();
    });
    cluster.on('fork', function(worker) {
      timeouts[worker.id] = setTimeout(errorMsg, 2000);
    });
    cluster.on('listening', function(worker, address) {
      clearTimeout(timeouts[worker.id]);
    });
} else {
    init();
    if (!module.parent) {
        const port = config('PORT', 7743);

        app.listen(port, function (err) {
            if (err) {
                throw err;
            }

            console.log('Listening on port ' + port + '.');
        });
    } else {
        module.exports = http.createServer(app);
    }
}
