// This automatically **transforms** app.json:
// https://docs.expo.io/workflow/configuration/#dynamic-configuration-with-appconfigjs
//
// Right now, we use it to load our secrets.json into "extra"
const fs = require('fs')
const path = require('path')

const FILE_NAME = path.resolve(__dirname, 'secrets.json')

if (!fs.existsSync(FILE_NAME)) {
    throw new Error('secrets.json does not exist!')
}

const SECRETS = fs.readFileSync(FILE_NAME).toString()

if (!SECRETS) {
    throw new Error('secrets.json is empty!')
}

export default ({ config }) => {
    const parsed = JSON.parse(SECRETS)
    return {
        ...config,
        extra: {
            ...(config.extra || {}),
            ...parsed,
        },
    }
}
