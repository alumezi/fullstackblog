
const app = require('./app')
const logg = require('./utils/logger')

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logg.info(`Server running on port ${PORT}`)
})
