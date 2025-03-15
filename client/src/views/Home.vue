<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span class="designer">欢迎冯国恒</span>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item @click="toPerson" index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
        <div class="blog-container">
            <el-card v-for="blog in sortedBlogs" :key="blog.id" class="blog-card">
                <template #header>
                    <h3>{{ blog.title }}</h3>
                    <span class="blog-date">{{ blog.date }}</span>
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
import router from '../router/index.js';

const activeIndex = ref('home');

const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};

const blogs = ref([]);
const sortedBlogs = ref([]);

const fetchBlogs = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/getBlogs');
        blogs.value = response.data;
        sortedBlogs.value = blogs.value;
    } catch (error) {
        console.error('获取博客数据失败:', error);
    }
};
const toPerson = () => {
    router.push('/person'); // 使用 router.push 进行路由跳转
};

onMounted(() => {
    console.log('localstorage',localStorage.getItem('email'));
    fetchBlogs();
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