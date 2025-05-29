import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          `conic-gradient(
            from 180deg at 50% 50%,
            var(--tw-gradient-stops)
          )`,
      },
      colors: {
        // Alto's Adventure inspired palette
        // Sky colors
        'alto-midnight': '#1a1e33',
        'alto-dawn': '#eacb8a',
        'alto-morning': '#87ceeb',
        'alto-noon': '#b0e0e6',
        'alto-sunset': '#ffb703',
        'alto-dusk': '#fb8b24',
        'alto-night': '#1a1e33', // Same as midnight for simplicity
        // Mountain colors
        'alto-far-mountain-day': '#9095b3',
        'alto-middle-mountain-day': '#7a7f9e',
        'alto-close-mountain-day': '#6a6b85',
        'alto-far-mountain-dawn': '#e3a975',
        'alto-middle-mountain-dawn': '#eacb8a',
        'alto-close-mountain-dawn': '#f5d6a1',
        'alto-far-mountain-dusk': '#fb8b24',
        'alto-middle-mountain-dusk': '#ffb703',
        'alto-close-mountain-dusk': '#f5d6a1', // Reusing a similar warm tone
        'alto-far-mountain-night': '#2b304d',
        'alto-middle-mountain-night': '#4a4e69',
        'alto-close-mountain-night': '#5a5d77',
        // Tree colors
        'alto-tree-day': '#4a4e69',
        'alto-tree-dawn': '#a87a6f', // More muted for dawn
        'alto-tree-dusk': '#a87a6f', // Same muted tone for dusk
        'alto-tree-night': '#1a1e33', // Darker for night
      },
    },
  },
  plugins: [],
}

export default config 