import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Banner from './banner/Banner'
import AuthProvider from './auth-provider'
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
    <html lang="en">
      <head>
        <link rel="preload" href="/svg/filter.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/management.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/login.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/logout.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/switch.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/menu.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/svg/home.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Banner/>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
