
const app = require('./app')
const BlogRouter = require('./controllers/blog')


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
