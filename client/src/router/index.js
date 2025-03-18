//路由配置文件
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

// 路由懒加载
const Login = () => import('../components/UserLogin.vue');
const UserInfo = () => import('../components/UserInfo.vue');
const Home = () => import('../views/Home.vue');
const Dashboard = () => import('../views/Dashboard.vue');

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            console.log(`进入Home的路由独享守卫:即将从 ${from.path} 导航到 ${to.path}`);

            next();
        }
    },
    {
        path: '/home',
        name: 'home',//访问时才导入
        component: Home,//components:() => import('../components/UserLogin.vue');
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue'),
        children: [
            // 嵌套路由
            {
                path: 'info',
                name: 'UserInfo',
                component: UserInfo
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue')
            }
        ]
    },
    {
        path: '/user/:id', // 动态路由
        name: 'UserDetail',
        component: () => import('../views/UserDetail.vue')
    }
    , {
        path: '/register', // 动态路由
        name: 'register',
        component: () => import('../components/UserRegister.vue')
    },
    {
        path: '/person', // 动态路由
        name: 'person',
        component: () => import('../views/个人主页.vue')
    },
    {
        path: '/write',
        name: 'write',
        component: () => import('../views/撰写文章.vue')
    }
    , {
        path: '/third',
        name: 'third',
        component: () => import('../views/github登录首页.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 全局守卫
router.beforeEach((to, from, next) => {
    console.log();
    console.log(`全局前置守卫:即将从 ${from.path} 导航到 ${to.path}`);
    // 这里可以添加登录验证等逻辑
    next();
});

router.afterEach((to, from) => {
    console.log('全局后置守卫:导航完成');
});

export default router;