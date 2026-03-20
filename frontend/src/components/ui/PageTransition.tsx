import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants } from '../../lib/animations'

interface Props {
  children: React.ReactNode
  key?:     string
}

export function PageTransition({ children, key }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
