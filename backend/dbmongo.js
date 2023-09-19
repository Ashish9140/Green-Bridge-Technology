const mongoose = require('mongoose');
function DBConnect() {
    mongoose.set('strictQuery', false);
    mongoose.connect("mongodb+srv://ashish:pjyYTFcxuJMABAhf@cluster0.d0kyvof.mongodb.net/?retryWrites=true&w=majority");
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected to mongoDB');
    });
}

module.exports = DBConnect;