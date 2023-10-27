/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
	// https://github.com/tailwindlabs/tailwindcss/issues/6602
	preflight: false,
  }
}

