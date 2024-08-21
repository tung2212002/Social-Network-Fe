import './index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { plugin as formKitPlugin, defaultConfig } from '@formkit/vue';
import { createFloatingLabelsPlugin } from '@formkit/addons';
import '@formkit/themes/genesis';
import '@formkit/addons/css/floatingLabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'vuetify/styles';
// import { createVuetify } from 'vuetify';
// import vuetify from './plugins/vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from 'vuetify/lib/framework.mjs';

const app = createApp(App);

app.use(createPinia());
app.use(router);
const options = {
    // You can set your default options here
};
const myCustomLightTheme = {
    // dark: false,
    colors: {
        // background: '#FFFFFF',
        // surface: '#FFFFFF',
        // 'surface-bright': '#FFFFFF',
        // 'surface-light': '#EEEEEE',
        // 'surface-variant': '#424242',
        // 'on-surface-variant': '#EEEEEE',
        // primary: '#1867C0',
        // 'primary-darken-1': '#1F5592',
        // secondary: '#48A9A6',
        // 'secondary-darken-1': '#018786',
        // error: '#B00020',
        // info: '#2196F3',
        // success: '#4CAF50',
        // warning: '#FB8C00',
    },
    // variables: {
    //     'border-color': '#000000',
    //     'border-opacity': 0.12,
    //     'high-emphasis-opacity': 0.87,
    //     'medium-emphasis-opacity': 0.6,
    //     'disabled-opacity': 0.38,
    //     'idle-opacity': 0.04,
    //     'hover-opacity': 0.04,
    //     'focus-opacity': 0.12,
    //     'selected-opacity': 0.08,
    //     'activated-opacity': 0.12,
    //     'pressed-opacity': 0.12,
    //     'dragged-opacity': 0.08,
    //     'theme-kbd': '#212529',
    //     'theme-on-kbd': '#FFFFFF',
    //     'theme-code': '#F5F5F5',
    //     'theme-on-code': '#000000',
    // },
};

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomLightTheme',
        themes: {
            myCustomLightTheme,
        },
    },
});
app.use(Toast, options);
app.use(
    formKitPlugin,
    defaultConfig({
        plugins: [
            createFloatingLabelsPlugin({
                // set to true to have floating labels be the default.
                // otherwise, use the `:floating-label` prop
                useAsDefault: true,
            }),
        ],
    }),
);
// app.use(IconsPlugin);
app.use(vuetify);
app.mount('#app');
