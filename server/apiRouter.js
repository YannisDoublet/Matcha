const express = require('express');
const userManagement = require('./Routes/UserManagement');

exports.router = (function () {
    const apiRouter = express.Router();

    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/login').post(userManagement.login);
	apiRouter.route('/test').get((req, res) => {
	   res.json({test: 'success'});
    });

    return apiRouter;
})();