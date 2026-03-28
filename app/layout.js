import './globals.css'

export const metadata = {
  title: 'Knowledge',
  description: 'Share knowledge with the world',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" precedence='default'></link>
      </head>
      <body>
        {children}
      </body>
      
    </html>
  )
}