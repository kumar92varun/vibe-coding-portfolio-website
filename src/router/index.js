import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyWork from '../views/MyWork.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/work',
        name: 'MyWork',
        component: MyWork
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router
