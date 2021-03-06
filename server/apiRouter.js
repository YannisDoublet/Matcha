const express = require('express');
const userManagement = require('./Routes/UserManagement');
const chatManagement = require('./Routes/chatManagement');
const matcherManagement = require('./Routes/matcherManagement');
const notificationsManagement = require('./Routes/notificationsManagement');

exports.router = (function () {
    const apiRouter = express.Router();

    /* ACCOUNT */

    apiRouter.route('/account/register').post(userManagement.register);
    apiRouter.route('/account/login').post(userManagement.login);
    apiRouter.route('/account/validate').get(userManagement.validate);
    apiRouter.route('/account/verify_token').post(userManagement.verifyToken);
    apiRouter.route('/account/send_forgot_password').post(userManagement.sendForgotPassword);
    apiRouter.route('/account/reset_password').post(userManagement.resetPassword);
    apiRouter.route('/account/user_info').post(userManagement.userInfo);
    apiRouter.route('/account/check_likes').post(userManagement.checkLikes);
    apiRouter.route('/account/check_block').post(userManagement.checkBlock);
    apiRouter.route('/account/check_match').post(userManagement.checkMatch);
    apiRouter.route('/account/change_info').post(userManagement.changeInfo);
    apiRouter.route('/account/change_location').post(userManagement.changeLocation);
    apiRouter.route('/account/add_tag').post(userManagement.addTag);
    apiRouter.route('/account/delete_tag').post(userManagement.deleteTag);
    apiRouter.route('/account/manage_bio').post(userManagement.manageBio);
    apiRouter.route('/account/upload_picture').post(userManagement.uploadPicture);
    apiRouter.route('/account/update_profile_picture').post(userManagement.updateProfilePicture);
    apiRouter.route('/account/delete_picture').post(userManagement.deletePicture);
    apiRouter.route('/account/fetch_user').post(userManagement.fetchUserProfileByUsername);
    apiRouter.route('/account/report_user').post(userManagement.reportUser);
    apiRouter.route('/account/block_user').post(userManagement.blockUser);
    apiRouter.route('/account/unblock_user').post(userManagement.unblockUser);
    apiRouter.route('/account/logout').post(userManagement.logoutUser);

    /* CHAT */

    apiRouter.route('/chat/fetch_card').post(chatManagement.fetchCard);
    apiRouter.route('/chat/fetch_messages').post(chatManagement.fetchMsg);
    apiRouter.route('/chat/send_message').post(chatManagement.sendMsg);

    /* MATCH */

    apiRouter.route('/matcher/fetch_count').post(matcherManagement.fetchCount);
    apiRouter.route('/matcher/match_suggestion').post(matcherManagement.matchSuggestion);
    apiRouter.route('/matcher/like_user').post(matcherManagement.likeUser);
    apiRouter.route('/matcher/dislike_user').post(matcherManagement.dislikeUser);
    apiRouter.route('/matcher/fetch_tags').get(matcherManagement.fetchTags);
    apiRouter.route('/matcher/research_users').post(matcherManagement.researchUsers);
    apiRouter.route('/matcher/research_precise_user').post(matcherManagement.researchPreciseUser);

    /* NOTIFICATIONS */

    apiRouter.route('/notifications/get_notifications').post(notificationsManagement.getNotifications);
    apiRouter.route('/notifications/read_notifications').post(notificationsManagement.readNotifications);

    return apiRouter;
})();