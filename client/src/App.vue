<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 使用 ref 创建响应式数据
const musicBtnRef = ref(null); // 关联按钮ref

// 生命周期钩子：组件挂载完成后执行
onMounted(() => {
  console.log('App 组件已挂载');
});

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