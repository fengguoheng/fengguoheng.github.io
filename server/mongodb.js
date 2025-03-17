const mongoose = require('mongoose');

// 连接 MongoDB，配置连接池
mongoose.connect('mongodb://localhost:27017/blogdb', {
    
    maxPoolSize: 5 // 连接池大小
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;