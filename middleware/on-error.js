const config = require('../config');

module.exports = function () {
    return function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: config.DEV_FLAG ? err : {}
        });
    }
};
