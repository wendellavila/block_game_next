import { inter } from '@/utils/constants';
import './globals.css';
export { metadata } from '@/utils/constants';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
