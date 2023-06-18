module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#023047",
                      
            "secondary": "#219EBC",
                      
            "accent": "#FFB703",
                      
            "neutral": "#8ECAE6",
                      
            "base-100": "#2A303C",
                      
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
