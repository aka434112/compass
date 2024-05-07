const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/styles/*.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat'],
      },
    },
    colors: {
      primary: 'var(--el-color-primary)',
      'primary-background': 'var(--el-color-primary-light-9)',
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const scrollbar = {
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: '0.625rem',
          },
          '&::-webkit-scrollbar-track': {
            background: 'var(--el-color-primary-light-9)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--el-color-primary)',
            border: '2px solid transparent',
            'border-radius': '0.75rem',
            'background-clip': 'content-box',
          },
          '&::-webkit-scrollbar-hover': {},
        },
      }

      addUtilities(scrollbar)
    }),
  ],
}
