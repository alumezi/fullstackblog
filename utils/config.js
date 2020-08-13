require('dotenv').config()
module.exports = {
    DB_URL: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3001
}