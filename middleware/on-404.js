module.exports = function () {
    return function (req, res, next) {
        next(Object.assign(new Error('Not Found'), {status: 404}));
    };
};
