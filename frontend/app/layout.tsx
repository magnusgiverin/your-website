import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Toaster} from 'sonner'

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

export {Metadata}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`antialiased`}>
      <body>
        <section className="min-h-screen pb-40">
          {/* The <Toaster> component is responsible for rendering toast notifications */}
          <Toaster />
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live */}
          <main>{children}</main>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
