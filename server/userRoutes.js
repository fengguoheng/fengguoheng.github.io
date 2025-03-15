const express = require('express');
const router = express.Router();
//const EventEmitter = require('events');
const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const mongoose = require('./mongodb.js');
const jwt = require('jsonwebtoken');
const session = require('express-session');
//const fs = require('fs');
//const path = require('path');


const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// 创建 SQL 数据库的用户模型//模型似乎封装了操作数据库的函数
const SqlUser = sequelize.define('SqlUser', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
});

// 同步 SQL 数据库模型（仅在开发时使用，生产环境需谨慎）
sequelize.sync();//创建对应的表

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: '未提供 token' });
    jwt.verify(token.split(' ')[1], 'your_secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ message: '无效的 token' });
        req.user = decoded;
        next();
    });
};
// 登录路由，尝试从 SQL 数据库验证
router.post('/sqlLogin', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 从 SQL 数据库中查找用户
        const user = await SqlUser.findOne({ where: { username, password } });
        if (user) {
            // 生成 JWT
            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
            req.session.user = { username: req.body.username, loggedIn: true };
            console.log(req.session.user,2);
            console.log(req.session,1);
            console.log(req.session.user.loggedIn,3);
            const a = req.session.user;
            res.json({ success: true, message: 'SQL 数据库登录成功', token, a});
        } else {
            res.json({ success: false, message: 'SQL 数据库用户名或密码错误' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'SQL 数据库错误' });
    }
});

// 示例：一个需要验证 Token 的受保护接口
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: '这是受保护的路由', user: req.user });
});

// 登录路由，尝试从 MongoDB 验证
router.post('/mongoLogin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, message: 'MongoDB 数据库登录成功' });
        } else {
            res.json({ success: false, message: 'MongoDB 数据库用户名或密码错误' });
        }
    } catch (error) {
        res.status(500).json({ error: 'MongoDB 数据库错误' });
    }
});

// 动态路由参数：根据用户名从 SQL 数据库获取用户信息
router.get('/sqlUsers/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await SqlUser.findOne({ where: { username } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'SQL 数据库用户未找到' });
        }
    } catch (error) {
        res.status(500).json({ error: 'SQL 数据库错误' });
    }
});

// 动态路由参数：根据用户名从 MongoDB 数据库获取用户信息
router.get('/mongoUsers/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'MongoDB 数据库用户未找到' });
        }
    } catch (error) {
        res.status(500).json({ error: 'MongoDB 数据库错误' });
    }
});
router.get('/protecteds', (req, res) => {
    if (req.session.user && req.session.user.loggedIn) {
        res.json({ message: '这是受保护的路由', user: req.session.user });
    } else {
        console.log(req.session.user);
        console.log(11112222222222);
        res.status(401).json({ message: '未登录' });
    }
});

module.exports = router;
/*
// 创建事件发射器实例
const loginEmitter = new EventEmitter();

// 读取用户数据文件，假设文件格式为每行一个用户，格式为：用户名:密码
function readUsersFile() {
  return new Promise((resolve, reject) => {
      const usersFilePath = path.join(__dirname, 'users.txt');
      fs.readFile(usersFilePath, 'utf8', (err, data) => {
          if (err) {
              reject(err);
          } else {
              const users = data.split('\n').map(line => {
                  const [username, password] = line.split(':');
                  return { username, password };
              });
              resolve(users);
          }
      });
  });
}

// 监听登录成功事件
loginEmitter.on('loginSuccess', (username) => {
  console.log(`${username} 登录成功`);
});

// 监听登录失败事件
loginEmitter.on('loginFailure', (username) => {
  console.log(`${username} 登录失败`);
});

// 登录路由
router.post('/login', async (req, res) => {
  const users = await readUsersFile();
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

// 动态路由参数：根据用户名获取用户信息
router.get('/users/:username', async (req, res) => {
  const users = await readUsersFile();
  const { username } = req.params;
  const user = users.find(u => u.username === username);
  if (user) {
      res.json(user);
  } else {
      res.status(404).json({ message: '用户未找到' });
  }
});

module.exports = router;
*/