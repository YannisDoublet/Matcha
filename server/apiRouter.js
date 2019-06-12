const express = require('express');
const userManagement = require('./Routes/UserManagement');
const chatManagement = require('./Routes/chatManagement');
const matcherManagement = require('./Routes/matcherManagement');


exports.router = (function () {
    const apiRouter = express.Router();

    /* ACCOUNT */

    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/login').post(userManagement.login);
    apiRouter.route('/account/validate').get(userManagement.validate);
    apiRouter.route('/account/verify_token').post(userManagement.verifyToken);
    apiRouter.route('/account/user_info').post(userManagement.userInfo);
    apiRouter.route('/account/upload_picture').post(userManagement.uploadPicture);
    apiRouter.route('/account/delete_picture').post(userManagement.deletePicture);
    apiRouter.route('/account/fetch_user').post(userManagement.fetchUserProfileByUsername);
    apiRouter.route('/account/logout').post(userManagement.logoutUser);

    /* CHAT */

    apiRouter.route('/chat/fetch_card').post(chatManagement.fetchCard);
    apiRouter.route('/chat/fetch_messages').post(chatManagement.fetchMsg);
    apiRouter.route('/chat/send_message').post(chatManagement.sendMsg);

    /* MATCH */

    apiRouter.route('/matcher/match_suggestion').post(matcherManagement.matchSuggestion);
    apiRouter.route('/matcher/fetch_tags').get(matcherManagement.fetchTags);

    return apiRouter;
})();