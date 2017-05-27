import figlet from 'figlet';
import chalk from 'chalk';
import notifier from 'node-notifier';

export default function abimis(done) {
    figlet('Abimis', { font: 'ANSI Shadow' }, function(err, ascii) {
        console.log(chalk.yellow('Abimis says hello from the framework side! Have fun!\n'));
        console.log(ascii);
        console.log('Copyright © 2017 Aterrae | Digital Growth.');
        done();
    });
    notifier.notify({ title: 'Abimis is running!', message: 'Now you are coding with power! 💪', icon: 'brand/notification-success.png' });
}
