const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./userRoutes');
const path = require('path');
const sequelize = require('./db');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const OAuth = require('oauth'); // 引入 oauth 模块，用于修改请求端点

(async () => {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功');
        await sequelize.sync();
        console.log('数据库同步成功');
    } catch (error) {
        console.error('数据库操作出错:', error);
        process.exit(1);
    }
})();

// 中间件设置
app.use(cors({}));  
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({  
    secret: 'your_secret_key',  
    resave: false,  
    saveUninitialized: true,  
    cookie: { maxAge: 60 * 1000 * 60 }  
}));  

// passport 中间件
app.use(passport.initialize());
app.use(passport.session());

// 自定义 kkgithub 的 OAuth2 配置（关键调整）
const kkgithubOAuth2 = new OAuth.OAuth2(
    'Ov23liqyjvZ8blf0Nqmr', // GitHub 应用的 clientID（保持不变）
    '2ac73990a8e357d52370c8c8b0d12a13b1f185be', // GitHub 应用的 clientSecret（保持不变）
    'https://kkgithub.com', // kkgithub 代理地址
    '/login/oauth/authorize', // 授权端点（GitHub 标准端点，无需修改）
    '/login/oauth/access_token', // 令牌获取端点（GitHub 标准端点，无需修改）
    {
        requestOptions: {
            timeout: 10000 // 设置超时时间为 10 秒
        }
    }
);
//前端通过浏览器的地址栏输入相应的 URL
// （例如 http://yourdomain.com/auth/github）
// 或者通过代码中使用 window.location.href 等方式进行页面跳转，都会触发对该路由的 GET 请求
app.get('/auth/github', passport.authenticate('github', {//授权登录界面
    prompt: 'login' 
}));//第二个参数是中间件
//处理 GitHub 认证回调的路由。当 GitHub 认证流程完成后，会向这个路由发送回调请求。
//当接收到回调请求时，会先执行第二个参数passport.authenticate('github', { failureRedirect: '/login' })这个中间件。它会对 GitHub 返回的认证信息进行验证和处理，如果认证失败，就会重定向到/login页面。
//如果认证成功，才会执行第三个参数，即回调函数(req, res) => { res.redirect('http://localhost:8080/'); }，将用户重定向到http://localhost:8080/页面。
app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('http://localhost:8080/home'); //重新定向到前端首页
    }
);

app.use('/api', userRoutes);

app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.use(express.static(path.join(__dirname, 'public')));

// 配置 GitHub 登录策略（关键修复：确保 clientID、clientSecret 正确传递）
passport.use(new GitHubStrategy({
    oauth2: kkgithubOAuth2, // 自定义 OAuth2 实例
    clientID: 'Ov23liqyjvZ8blf0Nqmr', // 明确保留 clientID
    clientSecret: '2ac73990a8e357d52370c8c8b0d12a13b1f185be', // 明确保留 clientSecret
    callbackURL: 'http://localhost:3000/auth/github/callback'//回调地址
}, (accessToken, refreshToken, profile, done) => {//待丰富
    // 处理 GitHub 用户信息，例如保存到数据库或返回给前端
    done(null, profile);
}));

// 用户序列化与反序列化
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});