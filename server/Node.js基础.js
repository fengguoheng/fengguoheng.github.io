const express = require('express');
const app = express();
const http = require('http');//创建HTTP服务器
const fs = require('fs');//文件系统操作
const path = require('path');//路径处理
const EventEmitter = require('events');//事件驱动编程
const userRoutes = require('./userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');//增强安全性

// 中间件设置//感觉只有跨域请求cors是必须存在的
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoutes);
/*
// 创建事件发射器实例//广播站
const loginEmitter = new EventEmitter();

// 读取用户数据文件，假设文件格式为每行一个用户，格式为：用户名:密码
function readUsersFile() {
    return new Promise((resolve, reject) => {
        const usersFilePath = path.join(__dirname, 'users.txt');//文件位置
        fs.readFile(usersFilePath, 'utf8', (err, data) => {//接受一个回调函数作为参数
            if (err) {//如果读取过程中出现问题
                reject(err);
            } else {//按行分割，再按照冒号分割
                const users = data.split('\n').map(line => {
                    const [username, password] = line.split(':');
                    return { username, password };
                });//返回对象
                resolve(users);//包含所有用户对象的数组
            }
        });
    });
}

// 监听登录成功事件
loginEmitter.on('loginSuccess', (username) => {
    console.log(`${username} 登录成功`);//模板字符串，类似插值表达式
});//接受到第一个参数，则打印

// 监听登录失败事件
loginEmitter.on('loginFailure', (username) => {
    console.log(`${username} 登录失败`);
});
// 中间件设置
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
// 创建HTTP服务器
const server = http.createServer(async (req, res) => {//参数是回调函数
    const users = await readUsersFile();//等待
    if (req.method === 'POST' && req.url === '/login') {//方法，地址
        //路由判断依据，方法和地址
        //路由指的是根据不同的请求方法和URL地址，将请求分发给不同的处理函数或逻辑。
        let body = '';
        req.on('data', (chunk) => {//有数据可读时被调用，即接收到data
            body += chunk.toString();
        });
        req.on('end', async () => {//数据读取结束时被调用。当访客的所有信息都到达后，此事件触发
            const formData = {};
            const pairs = body.split('&');//分割，按照&符号
            for (const pair of pairs) {
                const [key, value] = pair.split('=');//键值对，进一步分割
                formData[key] = decodeURIComponent(value);//解码
            }
            const { username, password } = formData;//解构赋值，从forData对象中提取出
            const user = users.find(u => u.username === username && u.password === password);
            //一条条比对，find方法
            let result;
            if (user) {
                result = { success: true, message: '登录成功' };
                loginEmitter.emit('loginSuccess', username);//同时也会触发接收器，
                //控制台打印登录成功的提示
            } else {
                result = { success: false, message: '用户名或密码错误' };
                loginEmitter.emit('loginFailure', username);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });//响应头
            res.end(JSON.stringify(result));//将json转换为json字符串，发送
        });
    } else {//表示返回的是纯文本信息，不是json
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

app.post('/login', async (req, res) => {
    const users = await readUsersFile();//等待
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    let result;
    if (user) {
        result = { success: true, message: '登录成功' };
        loginEmitter.emit('loginSuccess', username);
    } else {
        result = { success: false, message: '用户名或密码错误' };
        loginEmitter.emit('loginFailure', username);
    }
    res.json(result);
});
*/

// 错误处理：全局错误处理中间件//及时记录问题反映错误
app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});
// 静态文件服务
//表示在当前文件所在的目录。自助商品店里的商品都放在public这个文件夹里
app.use(express.static(path.join(__dirname,'public')));

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://192.168.110.199:${port}/`);
});//等待访客到来