import { HomePage, AboutPage, LoginPage, RegisterPage } from '@/views';

import route from '@/constants/route';
import { OnlyContentLayout } from '@/layouts';

export const publicRoutes = [
    {
        path: route.LOGINPAGE,
        component: LoginPage,
        isPrivate: false,
        restricted: false,
        layout: OnlyContentLayout,
    },
    {
        path: route.REGISTERPAGE,
        component: RegisterPage,
        isPrivate: false,
        restricted: false,
        layout: OnlyContentLayout,
    },
];

export const privateRoutes = [
    {
        path: route.HOMEPAGE,
        component: HomePage,
        isPrivate: true,
        restricted: false,
    },
    {
        path: route.ABOUTPAGE,
        component: AboutPage,
        isPrivate: true,
        restricted: false,
    },
];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue')
//     }
//   ]
// })

// export default router
