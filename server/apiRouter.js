const express = require('express');
const userManagement = require('./Routes/UserManagement');

exports.router = (function () {
    const apiRouter = express.Router();

    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/login').post(userManagement.login);
    apiRouter.route('/account/validate').get(userManagement.validate);
    apiRouter.route('/account/verify_token').post(userManagement.verifyToken);
    apiRouter.route('/account/user_info').post(userManagement.userInfo);
    apiRouter.route('/account/delete_picture').post(userManagement.deletePicture);
    apiRouter.route('/account/fetch_user').post(userManagement.fetchUserProfileByUsername);
    apiRouter.route('/account/logout').post(userManagement.logoutUser);

    return apiRouter;
})();