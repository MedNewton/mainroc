import { useEffect, useState } from 'react'

const NAV_ITEMS = ['CAPABILITIES', 'INDUSTRIES', 'RESSOURCES', 'COMPANY', 'CONTACT']

const HERO_PHRASES = ['Guided by intelligence', 'Powered by clarity']

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
      <div className="hero-title-wrap">
        {HERO_PHRASES.map((phrase, i) => (
          <TitleLine
            key={phrase}
            text={phrase}
            state={i === current ? 'in' : i === previous ? 'out' : 'idle'}
          />
        ))}
      </div>
      <p className="hero-subtitle">
        From concept to conviction, we help high‑performing founders turn bold
        visions into market‑tested momentum.
      </p>
      <div className="hero-buttons">
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

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  )
}
