import { HomePage, AboutPage, LoginPage, RegisterPage, ChatPage } from '@/views';

import route from '@/constants/route';
import { OnlyContentLayout } from '@/layouts';
import FriendShipView from '@/views/FriendShipView.vue';
import ProfileUserView from '@/views/ProfileUserView.vue';
import ChatView from '@/views/ChatView.vue';

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
        component: ProfileUserView,
        isPrivate: false,
        restricted: false,
    },
    {
        path: route.PROFILEPAGE1,
        component: ProfileUserView,
        isPrivate: false,
        restricted: false,
    },
    {
        path: route.CHATPAGE,
        component: ChatPage,
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
