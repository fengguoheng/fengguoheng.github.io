<template>
    <div class="article-write-container">
        <el-form ref="formRef" :model="articleForm" :rules="rules" label-width="100px" class="form-container">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
                <el-input v-model="articleForm.content" type="textarea" :rows="5" placeholder="请输入文章内容"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitArticle">提交文章</el-button>
                <el-button style="margin-left: 10px" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref,onMounted  } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 表单数据
const articleForm = ref({
    title: '',
    content: ''
});

// 表单验证规则
const rules = ref({
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
});

// 模板引用
const formRef = ref(null);
const email=ref('');


// 提交文章方法
const submitArticle = async () => {
    if (!formRef.value) return;
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // 替换为实际的接口地址
                const response = await axios.post(`http://localhost:3000/api/submitBlogs/${email.value}`, articleForm.value);
                if (response.status === 200) {
                    ElMessage.success('文章提交成功');
                    articleForm.value = { title: '', content: '' };
                } else {
                    ElMessage.error('文章提交失败，请稍后重试');
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage.error('文章提交失败，请稍后重试');
            }
        } else {
            ElMessage.error('请检查表单填写内容');
        }
    });
};

// 取消操作
const cancel = () => {
    articleForm.value = { title: '', content: '' };
    history.back();
};
onMounted(() => {
    console.log('组件挂载', 2, localStorage.getItem('email'));
    console.log(222);

    email.value = localStorage.getItem('email');
   
    console.log(333);
    console.log('email', email.value);
    console.log('1','email.value');
});
</script>

<style scoped>
.article-write-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.form-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>