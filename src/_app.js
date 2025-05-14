import { AnimatePresence } from 'framer-motion'
import '@/styles/globals.css'

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence mode="wait">
      <Component key={router.route} {...pageProps} />
    </AnimatePresence>
  )
}