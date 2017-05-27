import gulp from 'gulp';
import SETTINGS from '../settings';
import argv from 'minimist';
import shell from 'shelljs';
import fs from 'fs';

// This GET function:
// Git clone the package repo
// Installs all of the package's dependencies
// Injects all the necessary settings into Abimis' settings.json
// Moves all of the code that is overwritten by the package into folderName.old
// Copies all files from the package to a folder of the local project
// Removes the cloned folder
export default function get(done) {
    let repository = 'abimis' + process.argv[3];
    let dependenciesList = '';

    if (!fs.existsSync(repository)) {
        shell.exec('git clone https://github.com/aterrae/' + repository);
    }

    const ABIMIS = require('../' + repository + '/abimis');
    const MAIN = ABIMIS.main;
    const DEPENDENCIES = ABIMIS.dependencies;
    const SASS = ABIMIS.sass;
    const JS = ABIMIS.js;

    for (let i = 0; i < DEPENDENCIES.length; i++) {
        dependenciesList += DEPENDENCIES[i] + ' ';
        console.log('Installing ' + DEPENDENCIES[i]);
    }
    if (dependenciesList != '') {
        if (shell.which('yarn')) {
            console.log('Using Yarn =^•ω•^=');
            shell.exec('yarn add ' + dependenciesList);
            console.log('Finished dependencies installation');
        } else {
            console.log('Using NPM');
            shell.exec('npm install --save ' + dependenciesList);
            console.log('Finished dependencies installation');
        }
    }

    settingsInjector(SASS, SETTINGS.SASS.libPaths);
    settingsInjector(JS, SETTINGS.JSLIBS.sourceFiles);

    function settingsInjector(source, dest) {
        for (let i = 0; i < source.length; i++) {
            let exists = true;
            for (let j = 0; j < dest.length; j++) {
                if (source[i] == dest[j]) {
                    exists = false;
                }
            }
            if (exists) { dest.push(source[i]); }
        }
    }

    fs.writeFile('settings.json', JSON.stringify(SETTINGS, null, 2));

    for (let i = 0; i < MAIN.length; i++) {
        let folder = MAIN[i];
        let oldFolder = MAIN[i] + '.old';
        if (fs.existsSync(oldFolder)) {
            shell.rm('-rf', oldFolder);
        }
        shell.mv(folder, oldFolder);
        shell.cp('-R', repository + '/' + folder + '/.', folder);
    }

    shell.rm('-rf', repository);
    done();
}
