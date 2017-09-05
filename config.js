const fs = require('fs');
const path = require('path');

const localEnvJSONPath = path.join(process.cwd(), './.env.json');
const local = (function () {
    try {
        return JSON.parse(fs.readFileSync(localEnvJSONPath, 'utf8'));
    } catch (err) {
        return {};
    }
})();

module.exports = {
    DOMAIN: process.env.DOMAIN || local.DOMAIN,
    PUBLIC_URL: process.env.PUBLIC_URL || local.PUBLIC_URL,
    DEV_FLAG: process.env.DEV_FLAG || local.DEV_FLAG,
    SERVER_SESSION_SECRET: process.env.SERVER_SESSION_SECRET || local.SERVER_SESSION_SECRET,
    PORT: process.env.PORT || local.PORT,
    SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID || local.SOUNDCLOUD_CLIENT_ID,
    SOUNDCLOUD_CLIENT_SECRET : process.env.SOUNDCLOUD_CLIENT_SECRET || local.SOUNDCLOUD_CLIENT_SECRET
};
