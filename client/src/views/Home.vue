<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span  v-if="userInfo" class="designer">欢迎{{ userInfo.username }}</span>
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
        <button @click='toWrite' id="writeArticleBtn">撰写文章</button>
    </div>
    <!-- 隐藏的音频容器 -->
    <audio id="musicPlayer" src="船长.mp3" controls style="display: none;"></audio>

    <!-- 播放音乐按钮 -->
    <button ref="musicBtnRef" class="music-btn" @click="playMusic()">播放音乐</button>
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
const sortedBlogs = ref([]);
const musicBtnRef = ref(null);
const username = ref('');
const isLoggedIn = ref(false);
const userInfo = ref({});
const fetchBlogs = async () => {
    try {
        const response = await axios.get('/api/api/getBlogs');
        sortedBlogs.value = response.data;
    } catch (error) {
        console.error('获取博客数据失败:', error);
    }
};
const toPerson = () => {
    router.push('/person'); // 使用 router.push 进行路由跳转
};
const toWrite = () => {
    router.push('/write'); // 使用 router.push 进行路由跳转 
}
const playMusic = () => {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer.paused) {
        musicPlayer.play();
        musicBtnRef.value.textContent = "暂停音乐"; // 切换为暂停文字
    } else {
        musicPlayer.pause();
        musicBtnRef.value.textContent = "播放音乐"; // 切换回播放文字
    }
};
onMounted(async () => {
    try {
        
        const response = await axios.get('api/check', {
            withCredentials: true // 携带 cookie 信息
        });
        if (response.data.isLoggedIn) {
            isLoggedIn.value = true;
            userInfo.value = response.data;
        }
        console.log('用户名:', userInfo.value.username);
    } catch (error) {
        console.error('验证登录状态出错:', error);
    }

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

#writeArticleBtn {
    position: fixed;
    /* 固定定位 */
    bottom: 30px;
    /* 距离底部30px */
    right: 30px;
    /* 距离右侧30px */
    padding: 12px 24px;
    background-color: #409eff;
    /* 按钮颜色 */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    z-index: 999;
    /* 确保按钮在顶层 */
}

/* 固定按钮样式 */
.music-btn {
    position: fixed;
    top: 20px;
    /* 距离顶部20px */
    right: 20px;
    /* 距离右侧20px */
    padding: 10px 20px;
    background-color: #42b983;
    /* 按钮颜色 */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
    /* 确保按钮在顶层 */
}
</style>