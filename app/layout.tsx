import "./globals.css"

export const metadata = {
  title: "FoalFinder AI",
  description: "AI-powered foal name generator based on bloodlines"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}