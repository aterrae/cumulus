'use strict';

// Import all plugins
import gulp from 'gulp';
import plugins  from 'gulp-load-plugins';
import utility from 'gulp-util';
import notifier from 'node-notifier';
import yargs from 'yargs';
import fs from 'fs';
import yaml from 'js-yaml'
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import browser from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';

// With $ (constant name) we load all Gulp Plugins
const $ = plugins();

// With DISTRIBUTION (constant name) we set the --distribution argument if it exists
const DISTRIBUTION = !!(yargs.argv.distribution);
// If DISTRIBUTION is true we set NODE_ENV = 'production'
if (DISTRIBUTION) {
    process.env.NODE_ENV = 'production';
}

// With PORT we set the port where the server will be running
// With COMPATIBILITY we set the autoprefixer for CSS
// With HTML, SASS, JSLIBS, JSAPP, ASSETS we set the locations of the resources used in the project
const { PORT,
        COMPATIBILITY,
        HTML,
        SASS,
        JSLIBS,
        JSAPP,
        ASSETS } = loadConfig();
function loadConfig() {
    let ymlFile = fs.readFileSync('settings.yml', 'utf8');
    return yaml.load(ymlFile);
}

// This BUILD function, builds all the website files except the project's JS
gulp.task('build',
gulp.series(clean, gulp.parallel(html, sass, jsLibs, assets, images)));

// This DEFAULT function, calls the BUILD task, runs the server, builds the project's JS and starts watching all changes
gulp.task('default',
gulp.series(abimis, 'build', server, gulp.parallel(jsApp, watch)));

// This CLEAN function, deletes the dist folder
function clean(done) {
    rimraf('dist', done);
}

// This HTML function, compiles the Handlebars files including them in their respective files
function html() {
    return gulp.src(HTML.pages)
    .pipe($.hb({
        partials: HTML.partials,
        data: HTML.data,
        helpers: HTML.helpers
    }))
    .on('error', errorLog)
    .pipe(gulp.dest(HTML.destPath[0]))
    .pipe(browser.reload({ stream: true }));
}

// This SASS function, compiles the SASS files adding CSS prefixes where necessary
// If in development this function also generates the sourcemaps
// If in distribution this function deletes all unused CSS classes and minifies the resulting CSS
function sass() {
    return gulp.src(SASS.sourcePath)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        includePaths: SASS.libsPath
    })
    .on('error', sassNotify)
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
        browsers: COMPATIBILITY
    }))
    .pipe($.if(DISTRIBUTION, $.uncss({
        html: HTML.sourcePath
    })))
    .pipe($.if(DISTRIBUTION, $.cssnano()))
    .pipe($.if(!DISTRIBUTION, $.sourcemaps.write()))
    .pipe(gulp.dest(SASS.destPath[0]))
    .pipe(browser.reload({ stream: true }));
}

// This JSLIBS function, compiles ES6 and concatenates JS files into a single file
// If in distribution this function minifies the resulting JS
function jsLibs(done) {
    if(JSLIBS.sourceFile) {
        return gulp.src(JSLIBS.sourceFile)
        .pipe($.babel())
        .pipe($.concat(JSLIBS.destFile[0]))
        .pipe($.if(DISTRIBUTION, $.uglify()
            .on('error', errorLog)
        ))
        .pipe(gulp.dest(JSLIBS.destPath[0]));
    } else {
        done();
    }
}

// This JSAPP function, compiles Es6 and React JSX and concatenates JS files into a single file
// If in distribution this function minifies the resulting JS
function jsApp() {
    var bundler = browserify({
        entries: [JSAPP.sourceFile],
        transform: [babelify], // Compiles ES6 and React JSX
        plugin: [watchify],
        extensions: ['.jsx'],
        debug: !DISTRIBUTION,
        cache: {},
        packageCache: {},
        fullPaths: true
    })

    function build(file) {
        if (file) utility.log('Babel recompiling: ' + file);
        return bundler
        .bundle()
        .on('error', reactNotify)
        .on('error', utility.log.bind(utility, 'Hey there is a Browserify Error:'))
        .pipe(source(JSAPP.destFile[0]))
        .pipe(buffer())
        // If in DISTRIBUTION minify JS
        .pipe($.if(DISTRIBUTION, $.uglify()
            .on('error', errorLog)
        ))
        .pipe(gulp.dest(JSAPP.destPath[0]))
        .pipe(browser.reload({ stream: true }));
    };

    build();
    bundler.on('update', build);
};

// This ASSETS function, copies all folders and their files (except the img folder) inside the dist folder
function assets() {
    return gulp.src(ASSETS.sourcePath)
    .pipe(gulp.dest(ASSETS.destPath[0]))
    .pipe(browser.reload({ stream: true }));
}

// This IMAGES function, copies all images located in the img folder inside the dist folder
// If in distribution this function minifies all image files of this type: GIF, JPEG, PNG, SVG
function images() {
    return gulp.src(ASSETS.imagesSourcePath)
    .pipe($.if(DISTRIBUTION, $.imagemin({
        progressive: true
    })))
    .pipe(gulp.dest(ASSETS.imagesDestPath[0]))
    .pipe(browser.reload({ stream: true }));
}

// This SERVER function, starts the server
function server(done) {
    browser.init({
        server: {
            baseDir: HTML.destPath,
            middleware: [historyApiFallback()] // Fixes issues with the HTML5 History API
        },
        port: PORT
    });
    done();
}

// This WATCH function, watches changes in the HTML, SASS and in the ASSETS folder
function watch() {
    gulp.watch(HTML.sourcePath, html);
    gulp.watch(SASS.sourcePath, sass);
    gulp.watch(ASSETS.sourcePath, assets);
    gulp.watch(ASSETS.imagesSourcePath, images);
}

// Utils

function abimis(done) {
    utility.log(utility.colors.yellow('Abimis says hello from the framework side! Have fun!'));
    utility.log('   _____   ___.    .__          .__');
    utility.log('  /  _  \\  \\_ |__  |__|  _____  |__|  ______');
    utility.log(' /  /_\\  \\  | __ \\ |  | /     \\ |  | /  ___/');
    utility.log('/    |    \\ | \\_\\ \\|  ||  Y Y  \\|  | \\___ \\');
    utility.log('\\____|__  / |___  /|__||__|_|  /|__|/____  >');
    utility.log('        \\/      \\/           \\/          \\/');
    utility.log('Copyright © 2017 Aterrae | Digital Growth.');
    notifier.notify({title: 'Abimis is running!', message: 'Now you are coding with power! 💪'});
    done();
}

// Building the general error management
function errorLog(error) {
    utility.log(error);
    this.emit('end');
}

// Building the SASS error notification message
function sassNotify(error) {
    var title = 'Error: ';
    var message = 'In: ';

    if (error.messageOriginal) {
        title += error.messageOriginal;
    }
    if (error.relativePath){
        message += error.relativePath;
    }
    if (error.line) {
        message += '\nOn Line: ' + error.line;
    }

    notifier.notify({title: title, message: message});
};

// Building the React error notification message
function reactNotify(error) {
    var title = 'Error: ';
    var message = 'In: ';

    if(error.message) {
        var errorMessage = error.message.split(':');
        title += errorMessage[1];
    }
    if(error.filename) {
        var file = error.filename.split('/');
        message += file[file.length-1];
    }
    if(error.loc) {
        message += '\nOn Line: ' + error.loc['line'];
    }

    notifier.notify({title: title, message: message});
};
