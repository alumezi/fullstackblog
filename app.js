const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const BlogRouter = require('./controllers/blog')

mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', BlogRouter);

module.exports = app;