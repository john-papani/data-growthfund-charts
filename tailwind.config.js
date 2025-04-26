/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.7rem",
      },
      screens: {
        "3xl": "2000px",
        "4xl": "2500px",
        "5xl": "4000px",
      },
      colors: {
        "tedx-red": "#eb0028",
        // "our-red": "#e14640",
        "our-red": "#eb0028",
        "our-black": "#191617",
      },
    },
  },
  plugins: [],
};
