import { useEffect, useRef, useState } from 'react'
import LocomotiveScroll from 'locomotive-scroll'

const NAV_ITEMS = ['CAPABILITIES', 'INDUSTRIES', 'RESSOURCES', 'COMPANY', 'CONTACT']

const HERO_PHRASES = ['Guided by intelligence', 'Powered by clarity']

const CLIENTS = [
  { name: 'Novatech', style: { fontWeight: 700 } },
  { name: 'LUMINA', style: { fontWeight: 400, letterSpacing: '0.25em' } },
  { name: 'Vertex Labs', style: { fontWeight: 500, fontStyle: 'italic' } },
  { name: 'Atlas & Co', style: { fontFamily: 'Georgia, serif' } },
  { name: 'KORE', style: { fontWeight: 800, letterSpacing: '0.12em' } },
  { name: 'Meridian', style: { fontFamily: 'Georgia, serif', fontStyle: 'italic' } },
  { name: 'PULSE', style: { fontWeight: 300, letterSpacing: '0.3em' } },
  { name: 'Halcyon', style: { fontWeight: 600 } },
]

function Brand() {
  return (
    <a className="logo" href="#" aria-label="MAINROC home">
      <span>MAINROC</span>
    </a>
  )
}

function PlusBox() {
  return (
    <span className="plus-box" aria-hidden="true">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M4.5 0V9M0 4.5H9" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  )
}

function Navbar() {
  return (
    <header className="navbar">
      <Brand />
      <nav className="nav-links">
        {NAV_ITEMS.map((label) => (
          <a className="nav-item" href="#" key={label}>
            {label}
            <PlusBox />
          </a>
        ))}
      </nav>
      <a className="get-started" href="#">
        Get started
      </a>
    </header>
  )
}

function TitleLine({ text, state }) {
  let charIndex = 0
  return (
    <h1 className={`hero-title hero-title--${state}`} aria-label={text} aria-hidden={state !== 'in'}>
      {text.split(' ').map((word, w) => (
        <span className="hero-word-mask" aria-hidden="true" key={w}>
          {word.split('').map((char) => {
            const i = charIndex++
            return (
              <span className="hero-char" style={{ '--i': i }} key={i}>
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

function Hero() {
  const [{ current, previous }, setPhrase] = useState({ current: 0, previous: null })

  useEffect(() => {
    const t = setInterval(() => {
      setPhrase(({ current }) => ({
        current: (current + 1) % HERO_PHRASES.length,
        previous: current,
      }))
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="hero">
      <div className="hero-title-wrap" data-scroll data-scroll-speed="0.28">
        {HERO_PHRASES.map((phrase, i) => (
          <TitleLine
            key={phrase}
            text={phrase}
            state={i === current ? 'in' : i === previous ? 'out' : 'idle'}
          />
        ))}
      </div>
      <p className="hero-subtitle" data-scroll data-scroll-speed="0.18">
        From concept to conviction, we help high‑performing founders turn bold
        visions into market‑tested momentum.
      </p>
      <div className="hero-buttons" data-scroll data-scroll-speed="0.1">
        <a className="btn btn--dark" href="#">
          START YOUR PROJECT
        </a>
        <a className="btn btn--light" href="#">
          EXPLORE CAPABILITIES
        </a>
      </div>
    </main>
  )
}

function Clients() {
  return (
    <section className="clients">
      <h2 className="clients-heading">Trusted by innovative companies worldwide</h2>
      <div className="logo-marquee">
        <div className="logo-track">
          {[0, 1].map((copy) => (
            <div className="logo-group" aria-hidden={copy === 1} key={copy}>
              {CLIENTS.map(({ name, style }) => (
                <span className="logo-item" style={style} key={name}>
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CAPABILITIES = [
  'Strategy & positioning',
  'Brand & identity',
  'Web design & development',
  'Product & UX',
  'Motion & 3D experiences',
]

const ABOUT_TEXT =
  "MAINROC is the studio where strategy, design, and engineering move as one. The result? Superior products, real user trust and value that's shared, not extracted."

function About() {
  const textRef = useRef(null)
  const [revealed, setRevealed] = useState(0)
  const words = ABOUT_TEXT.split(' ')

  useEffect(() => {
    const el = textRef.current
    let raf = null

    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.85
      const end = vh * 0.35
      const progress = (start - rect.top) / (start - end + rect.height)
      const clamped = Math.min(1, Math.max(0, progress))
      setRevealed(Math.round(clamped * words.length))
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [words.length])

  return (
    <section className="about">
      <p className="about-text" aria-label={ABOUT_TEXT} ref={textRef}>
        {words.map((word, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`about-word ${i < revealed ? 'about-word--visible' : ''}`}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="capabilities">
      <div className="cap-topbar">
        <span className="cap-chip">MAINROC delivers</span>
      </div>
      <div className="cap-panel">
        {CAPABILITIES.map((title) => (
          <a className="cap-row" href="#" key={title}>
            <h3 className="cap-title">{title}</h3>
            <span className="cap-arrow" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function Industries() {
  const ref = useRef(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const el = ref.current
    let raf = null

    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      setDark(rect.top < window.innerHeight * 0.65)
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className={`industries ${dark ? 'industries--dark' : ''}`} ref={ref}>
      <h2 className="ind-title">
        Different industries,
        <br />
        same standard of clarity
      </h2>
      <p className="ind-sub">
        <span className="ind-bullet" aria-hidden="true" />
        MAINROC builds for the industries defining tomorrow
      </p>
      <div className="ind-stage">
        <div className="ind-line" aria-hidden="true" />
        <div className="ind-node" aria-hidden="true" />
        <article className="ind-card">
          <header className="ind-card-head">
            <span className="ind-card-num">01</span>
            <span className="ind-card-name">FINTECH AND FINANCIAL PLATFORMS</span>
          </header>
          <div className="ind-card-body">
            <span className="ind-card-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9.5L12 4l9 5.5" strokeLinejoin="round" />
                <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18" />
              </svg>
            </span>
            <span className="ind-card-label">Fintech</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default function App() {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        duration: 1.2,
        wheelMultiplier: 1,
        smoothWheel: true,
      },
    })
    return () => scroll.destroy()
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <Clients />
      <About />
      <Capabilities />
      <Industries />
    </>
  )
}
