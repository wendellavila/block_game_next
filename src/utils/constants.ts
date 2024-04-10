import type { Metadata } from 'next';
import { Inter,Pixelify_Sans } from 'next/font/google';

export const inter = Inter({ subsets: ["latin"] });
export const pixelify = Pixelify_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Block Game Next",
  description: "Tetris clone made with Next.js",
};

export const defaultPlayfieldSize = {
  width: 10,
  height: 20
};