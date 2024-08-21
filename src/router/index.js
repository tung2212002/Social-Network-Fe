import { createRouter, createWebHistory, useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { publicRoutes, privateRoutes } from './router';
import { useUserStore } from '@/stores';
import { NotFoundPage } from '@/views';
import route from '@/constants/route';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...publicRoutes.map((route) => ({
            path: route.path,
            component: route.component,
            meta: {
                layout: route.layout || DefaultLayout,
                restricted: route.restricted,
                isPrivate: route.isPrivate,
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
        })),
        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    try {
        console.log('Entering5', to, from, next);
        await userStore.fetchUser();
        console.log(!userStore.user);

        if (!userStore.user && to.meta.isPrivate) {
            console.log('Entering6', to, from, next);
            next(route.LOGINPAGE);
        } else if ((to.path === route.LOGINPAGE || to.path === route.REGISTERPAGE) && userStore.user) {
            console.log('Entering8', to, from, next);
            next(route.HOMEPAGE);
        } else {
            console.log('Entering7', to, from, next);
            next();
        }
    } catch (error) {
        console.error('Error during token verification:', error);
        next(route.LOGINPAGE);
    }
});

export default router;
