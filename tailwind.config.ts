import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002045',
        'on-primary': '#ffffff',
        'primary-container': '#1a365d',
        'on-primary-container': '#86a0cd',
        'primary-fixed': '#d6e3ff',
        'primary-fixed-dim': '#adc7f7',
        secondary: '#2c694e',
        'on-secondary': '#ffffff',
        'secondary-container': '#aeeecb',
        'on-secondary-container': '#316e52',
        'secondary-fixed': '#b1f0ce',
        'secondary-fixed-dim': '#95d4b3',
        surface: '#f7fafc',
        'on-surface': '#181c1e',
        'surface-variant': '#e0e3e5',
        'on-surface-variant': '#43474e',
        'surface-dim': '#d7dadc',
        'surface-bright': '#f7fafc',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f4f6',
        'surface-container': '#ebeef0',
        'surface-container-high': '#e5e9eb',
        'surface-container-highest': '#e0e3e5',
        outline: '#74777f',
        'outline-variant': '#c4c6cf',
        background: '#f7fafc',
        'on-background': '#181c1e',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'tertiary-fixed': '#ffdcc5',
        'tertiary-fixed-dim': '#ffb783',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', '"Noto Sans JP"', 'sans-serif'],
        body: ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
