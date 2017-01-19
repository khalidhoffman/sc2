const fs = require('fs'),
    path = require('path'),

    localEnvJSONPath = path.join(process.cwd(), './.env.json'),
    local = JSON.parse(fs.readFileSync(localEnvJSONPath, 'utf8'));

module.exports = {
    DOMAIN: local.DOMAIN,
    PUBLIC_URL: local.PUBLIC_URL,
    DEV_FLAG: local.DEV_FLAG,
    SERVER_SESSION_SECRET: local.SERVER_SESSION_SECRET,
    PORT: local.PORT,
    SOUNDCLOUD_CLIENT_ID : local.SOUNDCLOUD_CLIENT_ID,
    SOUNDCLOUD_CLIENT_SECRET : local.SOUNDCLOUD_CLIENT_SECRET
};
