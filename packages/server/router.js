const Router = require('koa-router');
const Auth = require('./middlewares/auth');
const User = require('./controllers/user');
const Aider = require('./controllers/aider');
const UserV1 = require('./controllers/v1/user');
const UserV2 = require('./controllers/v2/user');
const TopicV1 = require('./controllers/v1/topic');
const TopicV2 = require('./controllers/v2/topic');
const ReplyV1 = require('./controllers/v1/reply');
const NoticeV1 = require('./controllers/v1/notice');
const { ALLOW_SIGNUP } = require('../../config');

const router = new Router();

router.get('/', ctx => { ctx.body = 'Welcome to mints api'; }); // API 测试

if (ALLOW_SIGNUP || process.env.NODE_ENV === 'test') {
  router.post('/signup', User.signup); // 注册
  router.get('/set_active', User.setActive); // 账户激活
} else {
  router.post('/github', User.github); // Github 登录
}

router.get('/captcha', Aider.getCaptcha); // 获取图形验证码
router.get('/send_mail', User.sendMail); // 发送验证邮件
router.post('/signin', User.signin); // 登录
router.post('/forget_pass', User.forgetPass); // 忘记密码
router.post('/reset_pass', User.resetPass); // 重置密码
router.post('/upload_avatar', Auth.userRequired, User.uploadAvatar); // 头像上传
router.put('/setting', Auth.userRequired, User.updateSetting); // 更新个人信息
router.patch('/update_pass', Auth.userRequired, User.updatePass); // 修改密码
router.get('/info', Auth.userRequired, User.getCurrentUser); // 获取当前用户信息

const routerV1 = new Router({ prefix: '/v1' });

routerV1
  .get('/users/top', UserV1.getUserTop) // 获取积分榜用户列表
  .get('/user/:uid', UserV1.getUserById) // 根据ID获取用户信息
  .get('/user/:uid/action', UserV1.getUserAction) // 获取用户动态
  .get('/user/:uid/create', UserV1.getUserCreate) // 获取用户专栏列表
  .get('/user/:uid/like', UserV1.getUserLike) // 获取用户喜欢列表
  .get('/user/:uid/collect', UserV1.getUserCollect) // 获取用户收藏列表
  .get('/user/:uid/follower', UserV1.getUserFollower) // 获取用户粉丝列表
  .get('/user/:uid/following', UserV1.getUserFollowing) // 获取用户关注列表
  .patch('/user/:uid/follow_or_un', Auth.userRequired, UserV1.followOrUn) // 关注或者取消关注用户
  .post('/create', Auth.userRequired, TopicV1.createTopic) // 创建话题
  .delete('/topic/:tid/delete', Auth.userRequired, TopicV1.deleteTopic) // 删除话题
  .put('/topic/:tid/update', Auth.userRequired, TopicV1.updateTopic) // 编辑话题
  .get('/topics/list', TopicV1.getTopicList) // 获取话题列表
  .get('/topics/search', TopicV1.searchTopic) // 搜索话题列表
  .get('/topics/no_reply', TopicV1.getNoReplyTopic) // 获取无人回复的话题
  .get('/topic/:tid', TopicV1.getTopicById) // 根据ID获取话题详情
  .patch('/topic/:tid/like_or_un', Auth.userRequired, TopicV1.likeOrUnLike) // 喜欢或者取消喜欢话题
  .patch('/topic/:tid/collect_or_un', Auth.userRequired, TopicV1.collectOrUnCollect) // 收藏或者取消收藏话题
  .post('/topic/:tid/reply', Auth.userRequired, ReplyV1.createReply) // 创建回复
  .delete('/reply/:rid/delete', Auth.userRequired, ReplyV1.deleteReply) // 删除回复
  .put('/reply/:rid/update', Auth.userRequired, ReplyV1.updateReply) // 编辑回复
  .patch('/reply/:rid/up_or_down', Auth.userRequired, ReplyV1.upOrDownReply) // 回复点赞或者取消点赞
  .get('/notice/user', Auth.userRequired, NoticeV1.getUserNotice) // 获取用户消息
  .get('/notice/system', Auth.userRequired, NoticeV1.getSystemNotice); // 获取系统消息

const routerV2 = new Router({ prefix: '/v2' });

routerV2
  .get('/', ctx => { ctx.body = 'Version_2 API'; })
  .get('/users/new_this_week', Auth.adminRequired, UserV2.countUserThisWeek) // 获取本周新增用户数
  .get('/users/new_last_week', Auth.adminRequired, UserV2.countUserLastWeek) // 获取上周新增用户数
  .get('/users/total', Auth.adminRequired, UserV2.countUserTotal) // 获取用户总数
  .get('/users/list', Auth.adminRequired, UserV2.getUserList) // 获取用户列表
  .post('/users/create', Auth.adminRequired, UserV2.createUser) // 新增用户
  .delete('/user/:uid/delete', Auth.rootRequired, UserV2.deleteUser) // 删除用户(超管物理删除)
  .patch('/user/:uid/star', Auth.rootRequired, UserV2.starUser) // 设为星标用户
  .patch('/user/:uid/lock', Auth.adminRequired, UserV2.lockUser) // 锁定用户(封号)
  .get('/topics/new_this_week', Auth.adminRequired, TopicV2.countTopicThisWeek) // 获取本周新增话题数
  .get('/topics/new_last_week', Auth.adminRequired, TopicV2.countTopicLastWeek) // 获取上周新增话题数
  .get('/topics/total', Auth.adminRequired, TopicV2.countTopicTotal) // 获取话题总数
  .delete('/topic/:tid/delete', Auth.rootRequired, TopicV2.deleteTopic) // 删除话题(超管物理删除)
  .patch('/topic/:tid/top', Auth.adminRequired, TopicV2.topTopic) // 话题置顶
  .patch('/topic/:tid/good', Auth.adminRequired, TopicV2.goodTopic) // 话题加精
  .patch('/topic/:tid/lock', Auth.adminRequired, TopicV2.lockTopic); // 话题锁定(封贴)

module.exports = {
  rt: router.routes(),
  v1: routerV1.routes(),
  v2: routerV2.routes()
};
