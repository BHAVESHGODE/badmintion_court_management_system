/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Montserrat', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0A2463', // Deep Navy Blue
                    light: '#15327a',
                    dark: '#051233'
                },
                accent: {
                    green: '#39FF14', // Neon Green
                    orange: '#FF5E00', // Vibrant Orange
                },
                dark: {
                    950: '#050505', // Ultra dark bg
                    900: '#0a0a0a',
                    800: '#171717',
                    700: '#262626',
                },
                brand: { // Keep backward compatibility for now just in case
                    lime: '#39FF14',
                    violet: '#7c3aed',
                    pink: '#FF5E00',
                }
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'court-floor': "repeating-linear-gradient(45deg, #0A2463 0, #0A2463 10px, #081d52 10px, #081d52 20px)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
