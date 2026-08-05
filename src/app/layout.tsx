import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Banner from './banner/Banner'
import AuthProvider from './auth-provider'
import ThemeProvider from './theme-provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DoMore',
  description: 'Stream videos from your phone!',
  icons: {
    icon: [
      {
        url: "/icon.svg",
        href: "/icon.svg",
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var raw=localStorage.getItem('theme-storage');var theme=raw?JSON.parse(raw).state.theme:'system';if(theme!=='light'&&theme!=='dark'){theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',theme);}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preload" href="/svg/tags.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/management.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/login.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/logout.svg" as="image" type="image/svg+xml" />
        {/* chevrons and pagination arrows — the only icons the file list draws */}
        <link rel="preload" href="/svg/left.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/right.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/menu.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/home.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Banner />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
