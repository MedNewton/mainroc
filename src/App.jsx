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

const INDUSTRIES = [
  {
    num: '01',
    name: 'FINTECH AND FINANCIAL PLATFORMS',
    label: 'Fintech',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 4l9 5.5" strokeLinejoin="round" />
        <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18" />
      </svg>
    ),
  },
  {
    num: '02',
    name: 'AI AND INTELLIGENT PRODUCTS',
    label: 'AI',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="7" width="10" height="10" />
        <path d="M9.5 2.5V7M14.5 2.5V7M9.5 17v4.5M14.5 17v4.5M2.5 9.5H7M2.5 14.5H7M17 9.5h4.5M17 14.5h4.5" />
      </svg>
    ),
  },
  {
    num: '03',
    name: 'WEB3 AND DIGITAL ASSETS',
    label: 'Web3',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 2.5l8 4.5v10l-8 4.5-8-4.5V7l8-4.5z" />
        <path d="M12 11.5l8-4.5M12 11.5L4 7M12 11.5v10" />
      </svg>
    ),
  },
  {
    num: '04',
    name: 'HEALTH AND LIFE SCIENCES',
    label: 'Healthtech',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 12h4.5l2.5-6 5 12 2.5-6h4.5" />
      </svg>
    ),
  },
]

const CASE_STUDIES = [
  {
    tag: 'FINTECH',
    name: 'Novatech',
    desc: 'Replatforming a cross-border payments suite around one clear design system.',
  },
  {
    tag: 'AI',
    name: 'LUMINA',
    desc: 'Productizing an ML research pipeline into a self-serve analytics tool.',
  },
  {
    tag: 'WEB3',
    name: 'Vertex Labs',
    desc: 'Wallet onboarding that feels like a consumer app.',
  },
  {
    tag: 'SAAS',
    name: 'KORE',
    desc: 'Design-led growth for a B2B operations platform.',
  },
  {
    tag: 'HEALTHTECH',
    name: 'Meridian',
    desc: 'A patient portal rebuilt for clarity, speed and trust.',
  },
  {
    tag: 'BRAND',
    name: 'PULSE',
    desc: 'Full identity and motion system for a developer-tools launch.',
  },
]

function CaseStudies() {
  return (
    <div className="cases">
      <h2 className="cases-title">Selected case studies</h2>
      <p className="cases-sub">
        <span className="ind-bullet" aria-hidden="true" />
        Real products, real outcomes — a closer look at what we ship
      </p>
      <div className="cases-grid">
        {CASE_STUDIES.map(({ tag, name, desc }) => (
          <a className="cs-card" href="#" key={name}>
            <div className="cs-media" aria-hidden="true" />
            <div className="cs-info">
              <span className="cs-tag">{tag}</span>
              <h3 className="cs-name">{name}</h3>
              <p className="cs-desc">{desc}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="cases-cta">
        <h3 className="cta-title">Let&rsquo;s build your next big idea</h3>
        <div className="cta-buttons">
          <a className="btn btn--light" href="#">
            Start your project
          </a>
          <a className="btn btn--ghost" href="#">
            Book a strategy call
          </a>
        </div>
      </div>
    </div>
  )
}

function IndustryCard({ num, name, label, icon }) {
  return (
    <article className="ind-card">
      <header className="ind-card-head">
        <span className="ind-card-num">{num}</span>
        <span className="ind-card-name">{name}</span>
      </header>
      <div className="ind-card-media" aria-hidden="true">
        <div className="ind-card-asset" />
      </div>
      <div className="ind-card-body">
        <span className="ind-card-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="ind-card-label">{label}</span>
      </div>
    </article>
  )
}

function Industries() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const pin = el.querySelector('.ind-pin')
    const slots = Array.from(el.querySelectorAll('.ind-slot'))
    const node = el.querySelector('.ind-node')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = null

    // Node spring: scroll deltas shove the square off-center along the line,
    // an underdamped spring pulls it back with an elastic overshoot. The loop
    // runs only while scrolling or until the node settles.
    let nodeY = 0
    let nodeV = 0
    let lastScrollY = window.scrollY
    let lastTime = 0
    let physRaf = null

    const physics = (time) => {
      const dt = Math.min(48, time - lastTime) / 1000 || 0.016
      lastTime = time
      const sy = window.scrollY
      const delta = Math.min(60, Math.max(-60, sy - lastScrollY))
      lastScrollY = sy
      nodeV += delta * 5
      nodeV += (-90 * nodeY - 4 * nodeV) * dt
      nodeY = Math.min(32, Math.max(-32, nodeY + nodeV * dt))
      node.style.setProperty('--node-y', `${nodeY.toFixed(2)}px`)
      if (delta !== 0 || Math.abs(nodeY) > 0.1 || Math.abs(nodeV) > 1) {
        physRaf = requestAnimationFrame(physics)
      } else {
        nodeY = 0
        nodeV = 0
        node.style.setProperty('--node-y', '0px')
        physRaf = null
      }
    }

    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.35
      const end = vh * 0.02
      const raw = (start - rect.top) / (start - end)
      const clamped = Math.min(1, Math.max(0, raw))
      const eased = clamped * clamped * (3 - 2 * clamped)
      el.style.setProperty('--ind-p', eased.toFixed(4))

      // Pinned stage: progress through the tall wrapper maps to 0..N, and each
      // card owns one unit of it — grow in, hold, hand off to the next side.
      const smooth = (s) => s * s * (3 - 2 * s)
      const pinRect = pin.getBoundingClientRect()
      const lead = vh * 0.2
      const span = pinRect.height - vh + lead
      const p =
        Math.min(1, Math.max(0, (lead - pinRect.top) / span)) * slots.length

      slots.forEach((slot, i) => {
        const isLast = i === slots.length - 1
        const t = p - i
        let g = 0
        let v = 0
        let y = 30

        if (t > 0) {
          const enter = smooth(Math.min(1, t / 0.3))
          g = enter
          v = enter
          y = (1 - enter) * 30
          if (!isLast && t > 0.8) {
            const exit = smooth(Math.min(1, (t - 0.8) / 0.2))
            v = 1 - exit
            y = exit * -30
          }
        }

        slot.style.setProperty('--g', g.toFixed(4))
        slot.style.setProperty('--v', v.toFixed(4))
        slot.style.setProperty('--y', `${y.toFixed(1)}px`)
      })
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
      if (!reduceMotion && physRaf === null) {
        lastTime = performance.now()
        lastScrollY = window.scrollY
        physRaf = requestAnimationFrame(physics)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf !== null) cancelAnimationFrame(raf)
      if (physRaf !== null) cancelAnimationFrame(physRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="industries" ref={ref}>
      <h2 className="ind-title">
        Different industries,
        <br />
        same standard of clarity
      </h2>
      <p className="ind-sub">
        <span className="ind-bullet" aria-hidden="true" />
        MAINROC builds for the industries defining tomorrow
      </p>
      <div className="ind-pin" style={{ height: `${INDUSTRIES.length * 100}vh` }}>
        <div className="ind-stage">
          <div className="ind-line" aria-hidden="true" />
          <span className="ind-node" aria-hidden="true" />
          {INDUSTRIES.map((industry, i) => (
            <div
              className={`ind-slot ${i % 2 ? 'ind-slot--left' : 'ind-slot--right'}`}
              key={industry.num}
            >
              <IndustryCard {...industry} />
            </div>
          ))}
        </div>
      </div>
      <CaseStudies />
    </section>
  )
}

function CoFounding() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    let raf = null

    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.35
      const end = vh * 0.02
      const raw = (start - rect.top) / (start - end)
      const clamped = Math.min(1, Math.max(0, raw))
      const eased = clamped * clamped * (3 - 2 * clamped)
      el.style.setProperty('--cf-p', eased.toFixed(4))
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
    <section className="cofounding" ref={ref}>
      <span className="cf-chip">CO-FOUNDING</span>
      <h2 className="cf-title">
        No co-founder?
        <br />
        No problem.
      </h2>
      <p className="cf-sub">
        MAINROC partners with early-stage founders to build and launch startups
        as a true co-founder — MVP development, branding, go-to-market support,
        and fundraising guidance.
      </p>
      <div className="cf-buttons">
        <a className="btn btn--dark" href="#">
          APPLY
        </a>
        <a className="btn btn--outline" href="#">
          LEARN MORE
        </a>
      </div>
    </section>
  )
}

const FOOTER_COLS = [
  { title: 'COMPANY', links: ['About', 'Case studies', 'Careers', 'Contact'] },
  {
    title: 'CAPABILITIES',
    links: ['Strategy', 'Brand', 'Web', 'Product', 'Motion & 3D'],
  },
  { title: 'CONNECT', links: ['LinkedIn', 'X / Twitter', 'Dribbble', 'GitHub'] },
]

function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (e.target.email.value.trim()) setSubscribed(true)
  }

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-news">
          <span className="footer-chip">NEWSLETTER</span>
          <h2 className="footer-title">Signal, not noise.</h2>
          <p className="footer-sub">
            One monthly brief on strategy, design and engineering — straight
            from the MAINROC studio floor.
          </p>
          {subscribed ? (
            <p className="nl-done">
              <span className="ind-bullet" aria-hidden="true" />
              SUBSCRIBED — TALK SOON.
            </p>
          ) : (
            <form className="nl-form" onSubmit={onSubmit}>
              <span className="nl-field">
                <input
                  className="nl-input"
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  aria-label="Email address"
                />
              </span>
              <button className="btn btn--blue" type="submit">
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
        <div className="footer-cols">
          {FOOTER_COLS.map(({ title, links }) => (
            <div className="footer-col" key={title}>
              <span className="footer-col-title">{title}</span>
              {links.map((label) => (
                <a className="footer-link" href="#" key={label}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MAINROC. ALL RIGHTS RESERVED.</span>
        <span className="footer-tag">
          <span className="ind-bullet" aria-hidden="true" />
          BUILT FOR THE INDUSTRIES DEFINING TOMORROW
        </span>
        <span className="footer-legal">
          <a href="#">PRIVACY</a>
          <a href="#">TERMS</a>
        </span>
      </div>
      <div className="footer-mark" aria-hidden="true">
        MAINROC
      </div>
    </footer>
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
      <CoFounding />
      <Footer />
    </>
  )
}
