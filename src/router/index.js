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
        await userStore.fetchUser();
        if (!userStore.user && to.meta.isPrivate) {
            next(route.LOGINPAGE);
        } else if ((to.path === route.LOGINPAGE || to.path === route.REGISTERPAGE) && userStore.user) {
            next(route.HOMEPAGE);
        } else {
            next();
        }
    } catch (error) {
        next(route.LOGINPAGE);
    }
});

export default router;
