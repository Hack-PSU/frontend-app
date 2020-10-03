const config = require('@dji-dev/us-web-config/eslint')({
    typescript: true,
    graphql: false,
    react: true,
    vue: false,
})

config.rules['prettier/prettier'][1].endOfLine = 'auto'

module.exports = config
