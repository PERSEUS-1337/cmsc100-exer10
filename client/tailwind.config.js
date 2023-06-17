/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
          mytheme: {
          
            "primary": "#8ECAE6",
                      
            "secondary": "#219EBC",
                      
            "accent": "#FFB703",
                      
            "neutral": "#023047",
                      
            "base-100": "#FFFFFF",
                      
            "info": "#3ABFF8",
                      
            "success": "#36D399",
                      
            "warning": "#FB8500",
                      
            "error": "#F87272",
          },
        },
      ],
    },
  plugins: [
    require('daisyui'),
  ],
  autoprefixer: {},
}

