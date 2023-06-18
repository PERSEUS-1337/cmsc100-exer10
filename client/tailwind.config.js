module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      
    },
    fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
  },
  variants: {
    extend: {},
  },
  daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#219EBC",
            "secondary": "#8ECAE6",
            "accent": "#FFB703",
            "neutral": "#023047",
            "base-100": "#f3f4f6",
            "info": "#3ABFF8",
            "success": "#36D399",
            "warning": "#FBBD23",
            "error": "#F87272",
          },
        },
      ],
    },
  plugins: [require('daisyui')],
}
