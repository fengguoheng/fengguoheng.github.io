import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state: {
        form: {
            username: '',
            password: ''
        },
        message: '',
        loginError: false
    },
    getters: {
        getForm: state => state.form,
        getMessage: state => state.message,
        getLoginError: state => state.loginError
    },
    mutations: {
        SET_FORM(state, formData) {
            state.form = formData;
        },
        SET_MESSAGE(state, newMessage) {
            state.message = newMessage;
        },
        SET_LOGIN_ERROR(state, errorStatus) {
            state.loginError = errorStatus;
        }
    },
    actions: {
        async sqlLogin({ commit, state }) {
            try {
                const response = await axios.post('http://192.168.110.199:3000/api/sqlLogin', {
                    username: state.form.username,
                    password: state.form.password
                });
                if (response.data.message === '登录成功') {
                    commit('SET_LOGIN_ERROR', false);
                    commit('SET_MESSAGE', response.data.message);
                    // 这里可以添加更多登录成功后的逻辑，比如通知其他组件
                } else {
                    commit('SET_LOGIN_ERROR', true);//使用上面封装的函数
                    commit('SET_MESSAGE', response.data.message);
                }
            } catch (error) {
                commit('SET_MESSAGE', 'SQL 登录失败');
            }
        },
        async mongoLogin({ commit, state }) {
            try {
                const response = await axios.post('http://192.168.110.199:3000/api/mongoLogin', {
                    username: state.form.username,
                    password: state.form.password
                });
                commit('SET_MESSAGE', response.data.message);
                // 这里可以添加更多登录成功后的逻辑，比如通知其他组件
            } catch (error) {
                commit('SET_MESSAGE', 'MongoDB 登录失败');
            }
        }
    }
});

export default store;