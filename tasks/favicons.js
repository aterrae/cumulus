import gulp from 'gulp';
import settingsFavicons from '../settings-favicons';
import rimraf from 'rimraf';
import fs from 'fs';
import realFavicon from 'gulp-real-favicon';

// This FAVICONS function:
// Generates the favicon files inside the dest folder
// Generates the favicon partial inside the partials folder
export default function favicons(done) {
    const sourceFile = settingsFavicons.partialDest + '/' + settingsFavicons.partialName;
    rimraf(settingsFavicons.dest, () => {
        settingsFavicons.settings.error_on_image_too_small = false;
        settingsFavicons.markupFile = 'favicons-temp.json';
        realFavicon.generateFavicon(settingsFavicons, () => {
            fs.writeFile(sourceFile, '', () => {
                gulp.src([sourceFile])
                    .pipe(realFavicon.injectFaviconMarkups(require('../favicons-temp.json').favicon.html_code))
                    .pipe(gulp.dest(settingsFavicons.partialDest));
                done();
            });
        });
    });
}
