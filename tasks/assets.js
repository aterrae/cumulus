import gulp from 'gulp';
import { ASSETS } from '../settings';
import imagemin from 'gulp-imagemin';
import browser from 'browser-sync';

// This ASSETS function:
// Copies all folders and their files (except the img folder) inside the dest folder
export function assets() {
    return gulp.src(ASSETS.sourcePath)
        .pipe(gulp.dest(ASSETS.destPath))
        .pipe(browser.reload({ stream: true }));
}

// This IMAGES function:
// Copies all images located in the img folder inside the dest folder
export function images() {
    return gulp.src(ASSETS.imagesSourcePath)
        .pipe(gulp.dest(ASSETS.imagesDestPath))
        .pipe(browser.reload({ stream: true }));
}

// This IMAGESDIST function:
// Copies all images located in the img folder inside the dest folder
// Minifies all image files of this type: GIF, JPEG, PNG, SVG
export function imagesDist() {
    return gulp.src(ASSETS.imagesSourcePath)
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest(ASSETS.imagesDestPath))
        .pipe(browser.reload({ stream: true }));
}
