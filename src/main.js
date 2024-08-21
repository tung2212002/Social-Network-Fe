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
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const app = createApp(App);

app.use(createPinia());
app.use(router);
const options = {
    // You can set your default options here
};
const vuetify = createVuetify({
    components,
    directives,
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
