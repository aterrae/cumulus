'use strict';

import gulp from 'gulp';

import abimis from './tasks/abimis';
import nodeEnv from './tasks/node-env';
import clean from './tasks/clean';
import html from './tasks/html';
import { sass, sassCheck, sassDist } from './tasks/sass';
import { jsLibs, jsLibsDist } from './tasks/js-libs';
import { jsApp, jsAppDist } from './tasks/js-app';
import { assets, images, imagesDist } from './tasks/assets';
import { humans, robots } from './tasks/txt';
import server from './tasks/server';
import favicons from './tasks/favicons';
import get from './tasks/get';

import { HTML, SASS, ASSETS } from './settings';

// This BUILD task:
// Builds all the website files except the project's JS
gulp.task('build',
    gulp.series(clean, gulp.parallel(html, sass, jsLibs, assets, images))
);

// This WATCH function:
// Watches changes in the HTML, SASS and in the ASSETS folder
function watch() {
    gulp.watch(HTML.sourcePath, html);
    gulp.watch(SASS.sourcePath, sass);
    gulp.watch(ASSETS.sourcePath, assets);
    gulp.watch(ASSETS.imagesSourcePath, images);
}

// This DEFAULT task:
// Calls the BUILD task
// Runs the server
// Builds the project's JS
// Starts watching all changes
gulp.task('default',
    gulp.series(abimis, 'build', server, gulp.parallel(jsApp, watch))
);

// This BUILDDIST task:
// Calls the SASSCHECK task
// Builds all the website files except the project's JS
gulp.task('buildDist',
    gulp.series(clean, sassCheck, gulp.parallel(html, sassDist, jsLibsDist, assets, imagesDist, humans, robots))
);

// This WATCHDIST function:
// Watches changes in the HTML, SASS and in the ASSETS folder
function watchDist() {
    gulp.watch(HTML.sourcePath, html);
    gulp.watch(SASS.sourcePath, gulp.series(sassCheck, sassDist));
    gulp.watch(ASSETS.sourcePath, assets);
    gulp.watch(ASSETS.imagesSourcePath, imagesDist);
}

// This DISTRIBUTION task:
// Sets NODE_ENV
// Calls the BUILDDIST task
// Runs the server
// Builds the project's JS
// Starts watching all changes
gulp.task('distribution',
    gulp.series(abimis, nodeEnv, 'buildDist', server, gulp.parallel(jsAppDist, watchDist))
);

// This FAVICONS task:
// Calls the FAVICONS task
gulp.task('favicons',
    gulp.series(favicons)
);

// This GET task:
// Calls the GET task
gulp.task('get',
    gulp.series(get)
);
