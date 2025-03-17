<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span class="designer">欢迎{{ username }}</span>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
        <div class="blog-container">
            <el-card v-for="blog in extractedData" class="blog-card">
                <template #header>
                    <h3>{{ blog.title }}</h3>
                    <h4>{{ blog.username }}</h4>
                    <span class="blog-date">{{ new Date(blog.date).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                        }) }}</span>
                </template>
                <div class="blog-content">
                    {{ blog.content }}
                </div>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const activeIndex = ref('personal'); // 设置默认选中项
const sortedBlogs = ref([]); // 存储排序后的博客数据
const email = ref('');
// ✅ 定义响应式变量，用于模板渲染
const extractedData = ref([]);
const username = ref(''); // 存储用户名
const handleSelect = (index) => {
    console.log('当前选中：', index);
    if(index === 'home'){
        window.location.href = '/home';
    }
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};
const fetchUserBlogs = async () => {
    try {  
        const response = await axios.get(`api/api/personBlogs/${email.value}`);
        sortedBlogs.value = response.data.a;
        extractedData.value = sortedBlogs.value.map((blogItem) => ({
            date: blogItem.date,
            title: blogItem.title,
            content: blogItem.content,
            username: blogItem.username,
        }));
    } catch (error) {
        console.log('获取博客失败:', error);
    }
};
onMounted(() => {
    email.value = localStorage.getItem('email');
    fetchUserBlogs();
    username.value = localStorage.getItem('username'); // 获取用户名并赋值给响应式变量
});
</script>
<style scoped>
.nav-container {
    background: #e3e9f3;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.header-section {
    text-align: center;
    margin-bottom: 20px;
}
.title {
    font-size: 28px;
    color: #4CAF50;
    margin: 0;
    font-weight: 600;
}
.designer {
    font-size: 14px;
    color: #6c757d;
    margin-top: 5px;
    display: block;
}
.nav-menu {
    justify-content: center;
    gap: 12px;
}
.el-menu-item {
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 16px;
}
.blog-container {
    padding: 20px;
}
.blog-card {
    margin-bottom: 20px;
}
.blog-date {
    float: right;
    color: #999;
}
.blog-content {
    margin-top: 10px;
}
</style>