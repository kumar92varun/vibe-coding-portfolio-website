import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyWork from '../views/MyWork.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Anshul Nagpal | Pro Video Editor',
            description: 'Portfolio of Anshul, a professional video editor specializing in modern, high-quality video production.'
        }
    },
    {
        path: '/work',
        name: 'MyWork',
        component: MyWork,
        meta: {
            title: 'My Work | Anshul Nagpal | Pro Video Editor',
            description: 'Explore the portfolio and recent projects of Anshul, showcasing high-quality and dynamic video editing.'
        }
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

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Anshul Nagpal | Pro Video Editor';

    const descriptionElement = document.querySelector('head meta[name="description"]');
    if (descriptionElement) {
        descriptionElement.setAttribute('content', to.meta.description || 'Portfolio of Anshul, a professional video editor specializing in modern, high-quality video production.');
    }

    const ogTitle = document.querySelector('head meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', to.meta.title || 'Anshul Nagpal | Pro Video Editor');

    const ogDesc = document.querySelector('head meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', to.meta.description || 'Portfolio of Anshul, a professional video editor specializing in modern, high-quality video production.');

    const twitterTitle = document.querySelector('head meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', to.meta.title || 'Anshul Nagpal | Pro Video Editor');

    const twitterDesc = document.querySelector('head meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', to.meta.description || 'Portfolio of Anshul, a professional video editor specializing in modern, high-quality video production.');

    next();
});

export default router
