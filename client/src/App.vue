<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">文章</el-menu-item>
      <el-menu-item index="3">关于</el-menu-item>
    </el-menu>
    <!-- 使用 v-if 控制组件显示
    <Login v-if="isLogin" @login-success="handleLoginSuccess" />
    <UserInfo v-if="isInfo" @logout="handleLogout" />
    -->
    <div>
      <el-button type="primary">这是 Element Plus 按钮</el-button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Login from './components/UserLogin.vue';
import UserInfo from './components/UserInfo.vue';

// 使用 ref 创建响应式数据
const isLogin = ref(true);
const isInfo = ref(false);

// 生命周期钩子：组件挂载完成后执行
onMounted(() => {
  console.log('App 组件已挂载');
});

const handleLoginSuccess = () => {
  isLogin.value = false;
  isInfo.value = true;
};

const handleLogout = () => {
  isLogin.value = true;
  isInfo.value = false;
};
const activeIndex = ref('1'); // 默认激活的菜单项

const handleSelect = (index) => {
  console.log(`当前选中：${index}`);
  activeIndex.value = index; // 更新激活状态
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-menu-demo {
  margin-bottom: 20px;
}
</style>