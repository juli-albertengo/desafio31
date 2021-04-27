const mongoose = require('mongoose');

const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
        return 'Connection Established'
    } catch (error) {
        return error;
    }
}

module.exports = connectToDB;