import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import Script from 'next/script'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

const Metadata: Metadata = {
  title: 'Your Website',
  description: 'A Next.js app with Sanity CMS integration',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`antialiased`}>
      <body>
        <section className="min-h-screen">
          {/* The <Toaster> component is responsible for rendering toast notifications */}
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live */}
          <main>{children}</main>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
