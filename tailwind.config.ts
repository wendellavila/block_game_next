import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  },
  plugins: [
    require('tailwindcss-animated')
  ],
  safelist: [
    {pattern: /(bg|text)-(red|yellow|orange|blue|cyan|green|purple)-500/},
    {pattern: /bg-neutral-800/}
  ],
};
export default config;
