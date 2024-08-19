import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { publicRoutes, privateRoutes } from './router';
import { useUserStore } from '@/stores';
import { NotFoundPage } from '@/views';

// Define a common guard function
const authGuard = async (to, from, next, isPrivate, restricted) => {
    console.log('authGuard');
    const userStore = useUserStore();
    if (!userStore.isAuthenticated && isPrivate) {
        await userStore.fetchUser();
        console.log('Authenticated');
        if (!userStore.isAuthenticated) {
            next('/login');
        } else {
            next();
        }
    } else if (restricted && !userStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
};

// Define the router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...publicRoutes.map((route) => ({
            path: route.path,
            component: route.component,
            meta: {
                layout: route.layout || DefaultLayout,
                restricted: route.restricted,
            },
            beforeEnter: (to, from, next) => {
                console.log('Entering1', to, from, next);
                authGuard(to, from, next, false, route.restricted);
            },
        })),
        ...privateRoutes.map((route) => ({
            path: route.path,
            component: route.component,
            meta: {
                layout: route.layout || DefaultLayout,
                isPrivate: route.isPrivate,
                restricted: route.restricted,
            },
            beforeEnter: (to, from, next) => {
                authGuard(to, from, next, route.isPrivate, route.restricted);
            },
        })),
        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        },
    ],
});

export default router;
