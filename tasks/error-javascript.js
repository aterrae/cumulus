import notifier from 'node-notifier';

// Building the Javascript error notification message
export default function (error) {
    let title = 'Error: ';
    let message = '';
    let icon = 'brand/notification-failure.png';

    if (error.filename) {
        title += error.filename.slice(error.filename.lastIndexOf('/'), error.filename.length);
    } else {
        title += 'Javascript';
    }

    if (error.message && error.filename) {
        message += error.message.slice(error.filename.length + 2, error.message.lastIndexOf(':'));
    } else {
        message += error.message;
    }

    notifier.notify({ title: title, message: message, icon: icon });
}
