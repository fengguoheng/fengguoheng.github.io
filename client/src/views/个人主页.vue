<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span class="designer">欢迎冯国恒</span>
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
import { useLoginStore } from '@/store/loginStore';
import axios from 'axios';
const loginStore = useLoginStore();
const activeIndex = ref('personal'); // 设置默认选中项
const sortedBlogs = ref([]); // 存储排序后的博客数据
const email = ref('');
// ✅ 定义响应式变量，用于模板渲染
const extractedData = ref([]);


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

        // 使用 loginStore.email 传递给后端

        const response = await axios.get(`http://localhost:3000/api/personBlogs/${email.value}`);
        sortedBlogs.value = response.data.a;
        console.log(sortedBlogs.value);
        // ✅ 将处理后的数据赋值给响应式变量
        extractedData.value = sortedBlogs.value.map((blogItem) => ({
            date: blogItem.date,
            title: blogItem.title,
            content: blogItem.content
        }));
        console.log('提取后的数据:', extractedData.value);


        /*
        //console.log('1', response.data.shuju);
        sortedBlogs.value = Object.entries(response.data.shuju); // 将对象转换为数组
        // console.log('2', sortedBlogs.value);
        sortedBlogs.value = Object.entries(sortedBlogs.value);
        //console.log('4', sortedBlogs.value[0][1][1]);
        sortedBlogs.value[0][1][1] = Object.entries(sortedBlogs.value[0][1][1]);
        //console.log('3', sortedBlogs.value);
        console.log('777', sortedBlogs.value[0][1][1][0][1][1]);
        sortedBlogs.value[0][1][1][0][1][1] = Object.entries(sortedBlogs.value[0][1][1][0][1][1]);
        let i = [];
        i = sortedBlogs.value[0][1][1][0][1][1];
        i.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);

        });
        console.log('888', i[]);
        */

    } catch (error) {
        console.log('获取博客失败:', error);
    }
};


onMounted(() => {
    console.log('组件挂载', 2, localStorage.getItem('email'));
    console.log(222);

    email.value = localStorage.getItem('email');
    fetchUserBlogs();
    console.log(333);
    console.log('email', email.value);
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