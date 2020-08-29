require('dotenv').config()

let PORT = process.env.PORT || 3001;
let DB_URL = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
    DB_URL = process.env.MONGODB_TEST
}

module.exports = {
    DB_URL,
    PORT
}