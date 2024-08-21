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
