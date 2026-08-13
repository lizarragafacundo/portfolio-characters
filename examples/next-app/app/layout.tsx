import type { Metadata } from 'next'
import '@facundolizarraga/portfolio-characters/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'portfolio-characters — example',
  description: 'Every persona, theme and dock motion the component ships with.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
