
const app = require('./app')
const logg = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT, () => {
  logg.info(`Server running on port ${config.PORT}`)
})
