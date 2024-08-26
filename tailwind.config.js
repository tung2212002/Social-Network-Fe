/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}', './index.html', './formkit.theme.mjs', './formkit.config.mjs'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            gridTemplateColumns: {
                'auto-1fr': 'auto 1fr',
            },
            backgroundColor: {
                primary: '#2c3e50',
                secondary: '#34495e',
                tertiary: '#7f8c8d',
                quaternary: '#95a5a6',
                quinary: '#bdc3c7',
                senary: '#ecf0f1',
            },
        },
    },
    plugins: [],
};
