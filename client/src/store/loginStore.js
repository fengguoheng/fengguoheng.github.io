import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginStore = defineStore('login', {
    state: () => ({
        form: {
            username: '',
            password: '',

        },
        message: '',
        loginError: false,
        email: '',
    }),
    actions: {
        async sqlLogin() {
            try {

                const response = await axios.post(`/api/api/sqlLogin`, {
                    username: this.form.username,
                    password: this.form.password
                });
                if (response.data.message === 'SQL 数据库登录成功') {
                    this.loginError = false;
                    this.message = response.data.message;
                    this.email = response.data.email;
                    
                    localStorage.setItem('email', this.email);
                    
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('id', response.data.id);
                    return true; // 表示登录成功
                } else {
                    this.loginError = true;
                    this.message = response.data.message;
                    return false;
                }
            } catch (error) {
                this.message = 'SQL 登录失败';
                return false;
            }
        },
        async mongoLogin() {
            try {
                const response = await axios.post('/api/api/mongoLogin', {
                    username: this.form.username,
                    password: this.form.password
                });
                this.message = response.data.message;
                return true;
            } catch (error) {
                this.message = 'MongoDB 登录失败';
                return false;
            }
        }
    }
});