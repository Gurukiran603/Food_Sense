/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"fruit-hero": "url('https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1600&auto=format&fit=crop')", // fresh strawberries
				"fruit-mix": "url('https://images.unsplash.com/photo-1547517023-7ca0c162f816?q=80&w=1600&auto=format&fit=crop')", // assorted fruits
				"fruit-citrus": "url('https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1600&auto=format&fit=crop')", // citrus
			},
			boxShadow: {
				soft: '0 10px 30px rgba(0,0,0,0.08)'
			},
		},
	},
	plugins: [],
};
