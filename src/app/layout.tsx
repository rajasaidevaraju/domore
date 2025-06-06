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
      <body className={inter.className}>
        <AuthProvider>
          <Banner/>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
