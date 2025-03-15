import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginStore = defineStore('login', {
    state: () => ({
        form: {
            username: '',
            password: ''
        },
        message: '',
        loginError: false
    }),
    actions: {
        async sqlLogin() {
            try {
                const response = await axios.post('http://localhost:3000/api/sqlLogin', {
                    username: this.form.username,
                    password: this.form.password
                });
                if (response.data.message === '登录成功') {
                    this.loginError = false;
                    this.message = response.data.message;
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
                const response = await axios.post('http://localhost:3000/api/mongoLogin', {
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