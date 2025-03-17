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
app.use(cors({
    origin:'*',
    credentials: true, // 允许发送凭据（如cookies）
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // 允许的HTTP方法
    
}));  
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

app.get('/auth/github', passport.authenticate('github', {//授权登录界面
    prompt: 'login' 
}));//第二个参数是中间件
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            console.log('用户信息:', req.user);
            console.log('GitHub ID:', req.user.id);

            // 示例：获取用户名和 GitHub ID
            const username = req.user.username;
            let password = req.user.id.toString().substring(0, 10);
            if (password.length < 10) {
                password = password.padEnd(10, '0');
            }

            // 插入用户信息到数据库
            const [result] = await pool.execute(
                'INSERT INTO sqlusers (username, password) VALUES (?, ?)',
                [username, password]
            );

            console.log('用户信息插入成功，插入的 ID 为:', result.insertId);

            // 重定向到用户首页
            res.redirect('http://192.168.110.200:8080/home');
        } catch (error) {
            console.error('插入用户信息到数据库时出错:', error);
            res.status(500).send('服务器内部错误');
        }
    }
);

app.get('/', (req, res) => {
    res.redirect('http://192.168.110.200:8080/'); //重新定向到前端首页
    
})

app.use('/api', userRoutes);

app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.use(express.static(path.join(__dirname, 'public')));


passport.use(new GitHubStrategy({
    oauth2: kkgithubOAuth2, // 自定义 OAuth2 实例
    clientID: 'Ov23liqyjvZ8blf0Nqmr', // 明确保留 clientID
    clientSecret: '2ac73990a8e357d52370c8c8b0d12a13b1f185be', // 明确保留 clientSecret
    callbackURL: 'http://192.168.110.200:3000/auth/github/callback'//回调地址
}, (accessToken, refreshToken, profile, done) => {//待丰富
    // 处理 GitHub 登录回调逻辑，例如保存用户信息到数据库
    console.log(3333,profile);
    done(null, profile);
}));

// 用户序列化与反序列化
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://192.168.110.200:${port}/`);
});