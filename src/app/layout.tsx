import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';
import { Footer, BackToTop } from '@/client/components';
import { UserSessionProvider } from '@/client/features/session';
import Header from '@/server/components/Header';
import '@/styles/globals.css';

const inter = localFont({
  variable: '--font-sans',
  display: 'swap',
  src: [
    {
      path: '../../fonts/Inter-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../fonts/Inter-Italic-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
});

const geistMono = localFont({
  variable: '--font-geist-mono',
  display: 'swap',
  src: [
    {
      path: '../../fonts/GeistMono[wght].ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
});

const customIcons = localFont({
  variable: '--font-custom-icons',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/custom-icons.2c3a00d9.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: 'Altered Arena Stats - Statistiques et Suivi du TCG Altered',
    template: '%s | Altered Arena Stats',
  },
  description:
    'Plateforme communautaire pour suivre vos performances sur le TCG Altered. Enregistrez vos parties, analysez les métas, découvrez les factions les plus jouées et améliorez votre jeu !',
  keywords: [
    'Altered',
    'TCG',
    'jeu de cartes',
    'statistiques',
    'métas',
    'factions',
    'héros',
    'tournois',
    'deckbuilding',
    'performance',
    'gaming',
    'card game',
    'aas',
  ],
  authors: [{ name: 'Altered Arena Stats Team' }],
  creator: 'Altered Arena Stats',
  publisher: 'Altered Arena Stats',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://altered-arena-stats.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://altered-arena-stats.fr',
    title: 'Altered Arena Stats - Statistiques et Suivi du TCG Altered',
    description:
      'Plateforme communautaire pour suivre vos performances sur le TCG Altered. Enregistrez vos parties, analysez les métas, découvrez les factions les plus jouées !',
    siteName: 'Altered Arena Stats',
    images: [
      {
        url: '/images/Logo.webp',
        width: 1200,
        height: 630,
        alt: 'Altered Arena Stats - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altered Arena Stats - Statistiques et Suivi du TCG Altered',
    description: 'Plateforme communautaire pour suivre vos performances sur le TCG Altered',
    images: ['/images/Logo.webp'],
    creator: '@altered_arena_stats',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Altered Arena Stats',
  },
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Altered Arena Stats',
              description:
                'Plateforme communautaire pour suivre vos performances sur le TCG Altered',
              url: 'https://altered-arena-stats.fr',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://altered-arena-stats.fr/stats?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Altered Arena Stats',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://altered-arena-stats.fr/images/Logo.webp',
                },
              },
              sameAs: ['https://discord.com/invite/g4STbtUd3b'],
            }),
          }}
        />
        {/* Google Analytics - À configurer */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script> */}
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} ${customIcons.variable} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserSessionProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <BackToTop />
            <Toaster position="top-right" closeButton className="z-[9999]" />
          </UserSessionProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
