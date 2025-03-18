<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span class="designer">designed by zhenghaifeng</span>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref('home'); // 设置默认选中项

const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};
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





</style>