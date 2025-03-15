<template>
    <div>
        <h2>登录</h2>
        <input :class="{ 'error-input': loginStore.loginError }" v-model="loginStore.form.username" placeholder="用户名" />
        <input v-model="loginStore.form.password" placeholder="密码" type="password" />
        <button @click="handleSqlLogin">SQL 登录</button>
        <button @click="handleMongoLogin">MongoDB 登录</button>
        <button @click="fetchLogin">使用 Fetch 登录</button>
        <button @click="ttt">尝试token</button>
        <button @click="accessProtected">尝试session</button>
        <button id="githubLoginBtn">使用 GitHub 登录</button>
        <button @click="toRegister">现在去注册</button>
        <p>{{ loginStore.message }}</p>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { useLoginStore } from '../store/loginStore';

const loginStore = useLoginStore();
const emits = defineEmits(['login-success']);
const isLoggedIn = ref(false);

const handleSqlLogin = async () => {
    const isSuccess = await loginStore.sqlLogin();

    
    if (isSuccess) {
        emits('login-success');
        console.log('localstorage',localStorage.getItem('email'));
        window.location.href = '/home';
    }
};

const handleMongoLogin = async () => {
    const isSuccess = await loginStore.mongoLogin();
    if (isSuccess) {
        emits('login-success');
    }
};
//原生fetch
import { reactive, ref } from 'vue';
import instance from '../http.js'; // 引入封装的 instance
import { onMounted } from 'vue';

const form = reactive({
    username: '',
    password: ''
});

const message = ref('');

const fetchLogin = async () => {
    try {

        // 使用 instance 发送请求，自动携带拦截器处理的请求头
        const response = await instance.post('/api/sqlLogin', {
            username: loginStore.form.username,
            password: loginStore.form.password
        });
        if (response.message === 'SQL 数据库登录成功') {
            loginStore.message = response.message;

            localStorage.setItem('token', response.token);


            isLoggedIn.value = true;
            window.location.href = '/home';
        } else {
            loginStore.message = response.message;
        }
    } catch (error) {
        message.value = '使用 instance 登录失败';
        console.error('请求异常：', error); // 打印错误信息辅助调试
    }
};
const ttt = async () => {
    try {
        // 从本地存储中获取 Token，假设登录时将 Token 存储在 localStorage 里
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('未获取到有效的 Token');
            return;
        }

        const response = await fetch('http://localhost:3000/api/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }

        const data = await response.json();
        console.log('受保护接口响应数据：', data);
        return data;
    } catch (error) {
        console.error('请求受保护接口时出错：', error);
        return null;
    }
};
const accessProtected = async () => {//session功能失败
    try {
        const response = await fetch('http://localhost:3000/api/protecteds', {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }

        const data = await response.json()
        console.log(response);
        console.log(JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};
onMounted(() => {
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    if (githubLoginBtn) { // 增加存在性校验
        githubLoginBtn.addEventListener('click', () => {
            //跳转到你后端服务的 /auth/github 路由
            window.location.href = 'http://localhost:3000/auth/github';
        });
    }
});
const toRegister = () => {
    window.location.href = '/register'; // 跳转到注册页面 
}





</script>

<style scoped>
.error-input {
    border: 1px solid red;
}
</style>