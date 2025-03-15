<template>
    <el-container class="register-container">
        <el-main>
            <h1>注册账号</h1>
            <el-form ref="formRef" :model="formData" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { ElMessage } from 'element-plus';

// 表单数据
const formData = ref({
    username: '',
    password: '',
    email: '',
});

// 表单引用
const formRef = ref(null);

// 组件内守卫 - 离开当前组件时触发
onBeforeRouteLeave((to, from) => {
    console.log(`离开注册页面的组件内守卫:即将从 ${from.path} 导航到 ${to.path}`);
    return true;
});

// 组件内守卫 - 路由更新时触发（当前组件实例复用情况下）
onBeforeRouteUpdate((to, from) => {
    console.log('注册页面 组件路由更新前的守卫');
    return true;
});

// 处理注册逻辑
const handleRegister = () => {
    // 先检查表单信息是否完整
    if (!formData.value.username || !formData.value.password || !formData.value.email) {
        ElMessage.error('请填写完整信息！');
        return;
    }

    // 发送注册请求到后端
    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // 解析 JSON 响应体
            }
            throw new Error('注册请求失败');
        })
        .then(data => {
            if (data.success) {
                ElMessage.success('注册成功！');
                // 清空表单
                formData.value.username = '';
                formData.value.password = '';
                formData.value.email = '';
            } else {
                ElMessage.error(data.message || '注册失败，请稍后重试');
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
            ElMessage.error('注册请求出错，请稍后重试');
        });
};

</script>

<style scoped>
.register-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>