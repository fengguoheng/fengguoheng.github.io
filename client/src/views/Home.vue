<template>
    <div>
        <h1>首页1</h1>
        <router-link to="/login">登录</router-link>
        <router-link to="/user/info">用户信息</router-link>
        <router-link to="/user/2">用户详情（动态路由）</router-link>
    </div>
</template>

<script setup>
// 组件内守卫
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

onBeforeRouteLeave((to, from) => {//在钩子函数中定义
    console.log(`离开Home的组件内守卫:即将从 ${from.path} 导航到 ${to.path}`);
    return true;
});

onBeforeRouteUpdate((to, from) => {
    console.log('Home 组件路由更新前的守卫');
    return true;
});
</script>