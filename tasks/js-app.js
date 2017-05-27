import gulp from 'gulp';
import { JSAPP } from '../settings';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import errorJavascript from './error-javascript';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import errorLog from './error-log';
import browser from 'browser-sync';

function getBundler(isDistribution) {
    return browserify({
        entries: [JSAPP.sourceFile],
        transform: [babelify], // Compiles ES6 and React JSX
        plugin: [watchify],
        extensions: ['.js'],
        debug: !isDistribution,
        fullPaths: true,
        cache: {},
        packageCache: {}
    });
}

// This JSAPP function:
// Compiles ES6 and React JSX
// Concatenates JS files into a single file
export function jsApp() {
    const BUNDLER = getBundler(false);
    function build(file) {
        if (file) console.log('Javascript recompiling: ' + file);
        return BUNDLER
            .bundle()
            .on('error', errorJavascript)
            .on('error', console.log.bind(console, 'Javascript error: '))
            .pipe(source(JSAPP.destFile))
            .pipe(buffer())
            .pipe(gulp.dest(JSAPP.destPath))
            .pipe(browser.reload({ stream: true }));
    }

    build();
    BUNDLER.on('update', build);
}

// This JSAPPDIST function:
// Compiles ES6 and React JSX
// Concatenates JS files into a single file
// Minifies the resulting JS
export function jsAppDist() {
    const BUNDLER = getBundler(true);
    function build(file) {
        if (file) console.log('Javascript recompiling: ' + file);
        return BUNDLER
            .bundle()
            .on('error', errorJavascript)
            .on('error', console.log.bind(console, 'Javascript error: '))
            .pipe(source(JSAPP.destFile))
            .pipe(buffer())
            .pipe(uglify().on('error', errorLog))
            .pipe(gulp.dest(JSAPP.destPath))
            .pipe(browser.reload({ stream: true }));
    }

    build();
    BUNDLER.on('update', build);
}
