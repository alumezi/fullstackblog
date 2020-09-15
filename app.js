const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const BlogRouter = require('./controllers/blogs')
const UserRouter = require('./controllers/users')
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware')

mongoose.connect(config.DB_URL, { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/blogs', BlogRouter);
app.use('/api/users', UserRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;