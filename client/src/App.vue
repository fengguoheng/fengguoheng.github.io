<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 使用 ref 创建响应式数据
const isLogin = ref(true);
const isInfo = ref(false);
const musicBtnRef = ref(null); // 关联按钮ref
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