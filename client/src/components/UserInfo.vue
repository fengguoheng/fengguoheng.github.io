<template>
    <div>
        <h2>用户信息</h2>
        <input v-model="username" placeholder="输入用户名" />
        <button  @click="getSqlUserInfo">获取 SQL 用户信息</button>
        <button :disabled='isLoading' @click="getMongoUserInfo">获取 MongoDB 用户信息</button>
        <!-- 使用 v-for 循环渲染数据 -->
        <ul>
            <li v-for="( i) in userInfoArray"  >
                {{  i }}
            </li>
        </ul>
        <div>{{ a }}</div>
        <button @click="handleLogout">退出登录</button>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { defineEmits } from 'vue';

const emits = defineEmits(['logout']);
const username = ref('');
// 使用 reactive 创建响应式对象
const userInfo = reactive({});
// 用于 v-for 循环的数据
const userInfoArray = ref([]);
const a=ref(6)//实时更新数据，不用手动刷新
const isLoading = ref(true);

// 生命周期钩子：组件挂载完成后执行
onMounted(() => {
    console.log('UserInfo 组件已挂载');
});

// 生命周期钩子：组件卸载前执行
onUnmounted(() => {
    console.log('UserInfo 组件即将卸载');
});

const getSqlUserInfo = async () => {
    try {
        const response = await axios.get(`http://192.168.110.199:3000/api/sqlUsers/${username.value}`);
        userInfo.value = response.data;
        // 假设返回的数据是数组，用于 v-for 渲染
        console.log(response.data);
        //console.log(typeof (Object.entries(response.data).map(([key, value]) => ({
            //key,value
        //})))));
        console.log(Array.isArray(Object.entries(response.data).map(([key, value]) => ({
            key,value
        }))));
        console.log(Object.entries(response.data).map(([key, value]) => ({
            key,value
        })));
        userInfoArray.value = Object.entries(response.data).map(([key, value]) => ({
            key,value
        }));
        isLoading.value = false;
    } catch (error) {
        userInfo.value = { message: 'SQL 查询失败' };
        userInfoArray.value = [];
    }
};

const getMongoUserInfo = async () => {
    try {
        const response = await axios.get(`http://192.168.110.199:3000/api/mongoUsers/${username.value}`);
        userInfo.value = response.data;
        // 假设返回的数据是数组，用于 v-for 渲染
        userInfoArray.value = response.data;
    } catch (error) {
        userInfo.value = { message: 'MongoDB 查询失败' };
        userInfoArray.value = [];
    }
};

const handleLogout = () => {
    emits('logout'); // 通知父组件退出登录
};
</script>