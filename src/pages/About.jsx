import { motion } from 'framer-motion'
import AboutCard from '../components/AboutCard'
import PageMeta from '../components/PageMeta'

const About = () => {
  return (
    <>
      <PageMeta
        title="About — Tucker Craig"
        description="Hello, world! I'm Tucker. I build apps for my AI usage, my own voice-to-text, and AI agents on my phone, plus firmware for omalo."
        url="https://btuckerc.dev/about"
        image="https://btuckerc.dev/og/about.jpg"
        imageAlt="Tucker Craig, about. Hello, world! I'm Tucker."
      />
      <div className="about-page tui-page-shell min-h-[calc(100svh-7.25rem)] px-4 pb-28">
        <div className="relative mx-auto w-full max-w-3xl">
          <div className="flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              <AboutCard />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
