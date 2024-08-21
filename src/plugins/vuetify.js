import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import 'vuetify/styles';
const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
        },
    },
});

export default vuetify;
