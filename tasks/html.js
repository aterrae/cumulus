import gulp from 'gulp';
import { HTML } from '../settings';
import compileHandlebars from 'gulp-hb';
import errorHandlebars from './error-handlebars';
import browser from 'browser-sync';

// This HTML function:
// Compiles the Handlebars files including them in their respective files
export default function html() {
    return gulp.src(HTML.pages)
        .pipe(compileHandlebars({
            partials: HTML.partials,
            data: HTML.data,
            helpers: HTML.helpers
        }))
        .on('error', errorHandlebars)
        .pipe(gulp.dest(HTML.destPath))
        .pipe(browser.reload({ stream: true }));
}
