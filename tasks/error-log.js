// Building the general error management
export default function (error) {
    console.log(error);
    this.emit('end');
}
