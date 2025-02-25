import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Nordcraft - Win a Garmin Watch',
  description: 'Register with Nordcraft for your chance to win an amazing Garmin watch! Join our community and enter the competition today.',
  keywords: ['Nordcraft', 'Garmin watch', 'competition', 'giveaway', 'registration'],
  authors: [{ name: 'Nordcraft' }],
  creator: 'Nordcraft',
  publisher: 'Nordcraft',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: defaultUrl,
    title: 'Nordcraft - Win a Garmin Watch',
    description: 'Register with Nordcraft for your chance to win an amazing Garmin watch! Join our community and enter the competition today.',
    siteName: 'Nordcraft',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Harry-Yates/nordcraft-comp/refs/heads/main/public/images/meta.webp',
        width: 400,
        height: 133,
        alt: 'Nordcraft Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nordcraft - Win a Garmin Watch',
    description: 'Register with Nordcraft for your chance to win an amazing Garmin watch! Join our community and enter the competition today.',
    images: ['https://raw.githubusercontent.com/Harry-Yates/nordcraft-comp/refs/heads/main/public/images/meta.webp'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
