import type { Metadata } from 'next';
import { Inter,Pixelify_Sans,Silkscreen } from 'next/font/google';

export const inter = Inter({ subsets: ["latin"] });
export const pixelify = Pixelify_Sans({subsets: ["latin"]});
export const silkscreen = Silkscreen({subsets: ["latin"], weight: ["400"]});

export const metadata: Metadata = {
  title: "Block Game Next",
  description: "Tetris clone made with Next.js",
};

export const defaultPlayfieldSize = {
  width: 10,
  height: 20
};

export const headerColors = [
  'text-red-500', 'text-orange-500','text-yellow-500',
  'text-green-500', 'text-blue-500', 'text-purple-500'
];