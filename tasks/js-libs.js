import gulp from 'gulp';
import { JSLIBS } from '../settings';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import errorLog from './error-log';

// This JSLIBS function:
// Compiles ES6
// Concatenates JS files into a single file
export function jsLibs(done) {
    if (JSLIBS.sourceFiles) {
        return gulp.src(JSLIBS.sourceFiles)
            .pipe(babel())
            .pipe(concat(JSLIBS.destFile))
            .pipe(gulp.dest(JSLIBS.destPath));
    } else {
        done();
    }
}

// This JSLIBSDIST function:
// Compiles ES6
// Concatenates JS files into a single file
// Minifies the resulting JS
export function jsLibsDist(done) {
    if (JSLIBS.sourceFiles) {
        return gulp.src(JSLIBS.sourceFiles)
            .pipe(babel())
            .pipe(concat(JSLIBS.destFile))
            .pipe(uglify().on('error', errorLog))
            .pipe(gulp.dest(JSLIBS.destPath));
    } else {
        done();
    }
}
