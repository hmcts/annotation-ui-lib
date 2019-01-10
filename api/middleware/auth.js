const axios = require('axios');
const jwtDecode = require('jwt-decode');
const config = require('../../config');

module.exports = (req, res, next) => {
    const userId = req.headers[config.cookies.userId] || req.cookies[config.cookies.userId];
    const jwt = req.headers.authorization || req.cookies[config.cookies.token];
    const jwtData = jwtDecode('');
    const expires = new Date(jwtData.exp).getTime();
    const now = new Date().getTime() / 1000;
    const expired = expires < now;

    if (expired) {
        res.status(401).send('Token expired!');
    } else {
        req.auth = jwtData;
        req.auth.token = jwt;
        req.auth.userId = userId;

        axios.defaults.headers.common.Authorization = `Bearer ${req.auth.token}`
        if (req.headers.ServiceAuthorization) {
            axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization
        }
        next();
    }
};
