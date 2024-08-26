import { HomePage, AboutPage, LoginPage, RegisterPage } from '@/views';

import route from '@/constants/route';
import { OnlyContentLayout } from '@/layouts';
import FriendShipView from '@/views/FriendShipView.vue';

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
    {
        path: route.PROFILEPAGE,
        component: RegisterPage,
        isPrivate: false,
        restricted: false,
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
    {
        path: route.FRIENDSHIPPAGE,
        component: FriendShipView,
        isPrivate: true,
        restricted: false,
    },
];
