const express = require('express');
const router = express.Router();
//const EventEmitter = require('events');
const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const mongoose = require('./mongodb.js');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const mysql = require('mysql2/promise');
//const fs = require('fs');
//const path = require('path');

const pool = mysql.createPool({
    host: '192.168.110.199',
    user: 'root',
    password: '2794840873',
    database: 'blogdb'
});
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
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // 确保邮箱地址唯一
        allowNull: false // 不允许为空
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



            const a = req.session.user;
            res.json({ success: true, message: 'SQL 数据库登录成功', token, a, email: user.email });
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
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // 基本验证：检查字段是否为空
    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: '请填写完整信息' });
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: '请输入有效的邮箱地址' });
    }

    try {
        // 检查用户名是否已存在
        const existingUser = await SqlUser.findOne({ where: { username } });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ success: false, message: '该用户名已被使用，请选择其他用户名' });
        }

        const existingEmailUser = await SqlUser.findOne({ where: { email } });
        console.log(existingEmailUser);
        if (existingEmailUser) {
            return res.status(400).json({ success: false, message: '该邮箱已被注册，请使用其他邮箱' });
        }
        await SqlUser.create({ username, password, email });
        // 将用户信息插入数据库


        res.json({ success: true, message: '注册成功' });
    } catch (error) {
        console.error('注册过程中出现数据库错误:', error);
        res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
    }
});
router.get('/getBlogs', async (req, res) => {
    try {
        // 从数据库中查询所有记录
        const [rows] = await pool.execute('SELECT blogs FROM sqlusers');
        console.log(1, rows);
        let allBlogs = [];

        // 遍历查询结果
        rows.forEach(row => {
            console.log(2, row);//row是对象
            console.log(row.blogs, 3);//是数组
            console.log(Array.isArray(row.blogs))
            const blogsArray = row.blogs;//说右边不是


            if (Array.isArray(blogsArray)) {
                allBlogs = allBlogs.concat(blogsArray);
            }
        });

        // 根据日期对博客进行排序
        allBlogs.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.json(allBlogs);
    } catch (error) {
        console.error('查询数据库出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// 处理获取用户博客的接口
router.get('/personBlogs/:email', async (req, res) => {
    const [rows] = await pool.execute('SELECT blogs FROM sqlUsers WHERE email = ?', [req.params.email]);
    console.log(1, req.params.email);
    console.log(4, rows);//rows是数组
    console.log(5, typeof (rows[0].blogs));//是二维数组
    console.log(6, rows[0].blogs);//但是但是但是打印出来是[{},{}]
    let a = [];
    if (!rows[0].blogs) {
        return res.json({ a });
    }
    a = rows[0].blogs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);//.字体是根据对象的字段
    });

    res.json({ a });
    /*
    const userEmail = req.params.email; // 从路由参数获取 email



    pool.query('SELECT blogs FROM sqlUsers WHERE email = ?', [userEmail], (err, results) => {
        if (err) {
            console.error('执行查询出错:', err);
            return res.status(500).json({ error: '服务器内部错误' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: '用户不存在' });
        }

        try {
            const blogsData = results[0].blogs;
            console.error(Array.isArray(blogsData));
            //blogsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            res.json(blogsData); // 返回博客数据


        } catch (parseErr) {
            console.error('解析博客数据出错:', parseErr);
            res.status(500).json({ error: '博客数据格式异常' });
        }
    });
});
*/
});
router.post('/submitBlogs/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email);
        const { title, content } = req.body;
        const newArticle = {
            title,
            content,
            date: new Date() // 将日期转换为 ISO 字符串格式
        };
        let a = JSON.stringify(newArticle);
        let b = [JSON.stringify(a)];
        console.log(111111, b);
        let c = b;
        //let c = b.map(item => {
        // 去掉字符串首尾的引号
        //return item.slice(1, -1); 
        //});
        console.log('c', c);
        let d = c.map(item => item.replace(/\\/g, ''));
        console.log('d', d);
        const originalArray = d;

        // 处理数组元素，去除多余引号和转义字符
        const processedArray = originalArray.map(item => {
            // 去掉首尾引号
            item = item.trim().slice(1, -1);
            // 去掉转义字符
            return item.replace(/\\/g, '');
        });

        // 把处理后的元素拼接成 JSON 数组字符串
        const jsonArrayString = `[ ${processedArray.join(', ')} ]`;

        // 在字符串外面加上单引号
        const finalString = `'${jsonArrayString}'`;
        console.log(finalString);
        const newString = `${finalString.trim().replace(/\s*(\[|\])\s*/g, '$1')}`;
        console.log('最后', newString);
        const e = newString.slice(1, -1);
        console.log('e', e);




        const [rows] = await pool.execute(
            `UPDATE sqlUsers
        SET blogs = IF(
            blogs IS NULL,
            ?,
            JSON_MERGE_PRESERVE(blogs, ?)
        )
        WHERE email = ?`,
            [e, e, email]
        );
        console.log(33333333333, rows);


        // 检查是否更新成功
        if (rows.affectedRows === 0) {
            throw new Error('未找到对应的用户或更新失败');
        }




        // 返回成功响应
        res.status(200).json({ message: '文章提交成功', article: newArticle });
    } catch (error) {


        console.error('数据库操作出错:', error);
        res.status(500).json({ message: '文章提交失败，请稍后重试' });
    }
}),

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