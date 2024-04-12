import './globals.css';
export { metadata } from '@/utils/constants';

import { silkscreen } from '@/utils/constants';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${silkscreen.className}`}>
        {children}
      </body>
    </html>
  );
}
