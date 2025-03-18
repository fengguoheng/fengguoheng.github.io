<template>
    <div class="login-container">
        <el-card class="login-card">
            <template #header>
                <h2>登录</h2>
            </template>
            <el-form :model="loginStore.form" ref="formRef">
                <el-form-item>
                    <el-input v-model="loginStore.form.username" placeholder="用户名"
                        :class="{ 'error-input': loginStore.loginError }" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginStore.form.password" placeholder="密码" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSqlLogin">登录</el-button>
                    <el-button @click="toRegister">现在去注册</el-button>
                    <el-button id="githubLoginBtn" @click="handleGithubLogin">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                            style="width: 18px; height: 18px; margin-right: 4px;">
                            <path
                                d="M24 0c-13.2 0-24 10.8-24 24s10.8 24 24 24 24-10.8 24-24-10.8-24-24-24zm0 44c-11 0-20-9-20-20 0-3.3.9-6.4 2.5-9.1-.2-.6-.2-1.2-.2-1.8 0-4.7 2.9-8.6 7-10.5-1.3.4-2.7.6-4.1.6-2.5 0-4.9-1-6.7-2.6 1.4.2 2.7.6 4 1-3.3-3.2-8-5.2-12.8-5.2-1.3 0-2.5.1-3.8.3 2.7 1.7 5.8 2.7 9 3.2-2.5-1.7-4-4.7-4-7.7 0-1.7.5-3.2 1.3-4.4-2.7.7-5.2-1.3-5.2-6 0-1.3.4-2.5 1-3.4 1.7 2.1 4.1 3.6 6.8 3.7-1.6 1.3-3.4 2-5.3 2.4.5-2.2 1.6-4.5 3-5.9-1.4.4-3.1.6-4.8.6-1.3 0-2.5-.1-3.8-.3 2.5 1.6 5.4 2.7 8.4 2.7 10 0 15.6-8.4 15.6-15.6 0-2.4-.1-4.7-.4-7 1.1.8 2.3 1.3 3.6 1.3 2.2 0 4.4-.6 6.2-1.6-1.1 2-3.4 3.4-6.1 4.3 1.9-.2 3.7-.8 5.2-1.6-1.3 2-2.9 3.9-4.8 5 1.6 1.3 3.5 2.1 5.5 2.1 12 0 18-10 18-18 0-3.5-.8-6.7-2.2-9.6 1.5-.3 2.9-.9 4.1-1.6-1.4 1.7-3.1 3-5 3.8 1.3-1.1 2.7-2.4 4-3.8-1 1.7-2.4 3.3-4 4.8 1.3-.1 2.6-.4 3.8-.8-1.1 1.7-2.8 3-4.7 3.8 1.1-.9 2-2 2.8-3.1-.9 1.2-2 2.2-3.2 3.1z" />
                        </svg>
                        使用 GitHub 登录
                    </el-button>
                    <el-button @click="toHome">游客</el-button>
                </el-form-item>
            </el-form>
            <p>{{ loginStore.message }}</p>
        </el-card>
        <img src="/background.jpg" alt="背景图" class="bg-image" />
    </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import { useLoginStore } from '../store/loginStore';

const loginStore = useLoginStore();
const emits = defineEmits(['login-success']);
const formRef = ref(null);

const handleSqlLogin = async () => {
    const isSuccess = await loginStore.sqlLogin();
    if (isSuccess) {
        emits('login-success');
        window.location.href = '/home';
    }
};

const handleGithubLogin = () => {
    window.location.href = '/api/auth/github';
};

const toRegister = () => {
    window.location.href = '/register';
};
const toHome = () => {
    window.location.href = '/home';
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.login-card {
    width: 400px;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-form-item {
    margin-bottom: 16px;
}

.login-container {
    position: relative;
    min-height: 100vh;
}

.bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    /* 置于底层 */
}

.login-card {
    position: relative;
    z-index: 1;
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    /* 卡片背景色 */
}
</style>