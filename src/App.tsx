import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { Footer } from './components/Footer'
import { IssuesBelt } from './components/IssuesBelt'
import { Nav } from './components/Nav'
import { ClosingCTA } from './sections/ClosingCTA'
import { Eligibility } from './sections/Eligibility'
import { FAQ } from './sections/FAQ'
import { Format } from './sections/Format'
import { Hero } from './sections/Hero'
import { Hosts } from './sections/Hosts'
import { Judging } from './sections/Judging'
import { Team } from './sections/Team'
import { Premise } from './sections/Premise'
import { Timeline } from './sections/Timeline'
import { Tracks } from './sections/Tracks'

export default function App() {
  // The page renders after load, so honour a #section in the URL once it exists.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id)
      document.fonts.ready.then(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }),
      )
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <IssuesBelt />
          <Premise />
          <Tracks />
          <Format />
          <Timeline />
          <Eligibility />
          <Judging />
          <Hosts />
          <Team />
          <FAQ />
          <ClosingCTA />
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  )
}
