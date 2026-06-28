import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Overlay() {
  const root = useRef()
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Intro timeline ---------------------------------------------------
      gsap
        .timeline({ delay: 0.3 })
        .from('.topbar', { y: -30, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .from('.hero-title .line', {
          yPercent: 120,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
        }, '-=0.4')
        .from('.hero-scroll', { opacity: 0, duration: 1, ease: 'power1.out' }, '-=0.4')

      // --- Scroll-revealed content sections --------------------------------
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="overlay" ref={root}>
      {/* ---- Fixed top bar ---- */}
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Home">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">
            STUDIO
            <br />
            NAME
          </span>
        </a>
        <button
          className="sound"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
        >
          Sound {muted ? 'Off' : 'On'}
          <span className="sound-line" aria-hidden="true" />
        </button>
      </header>

      {/* ---- Hero ---- */}
      <section className="section hero" id="top">
        <h1 className="hero-title">
          <span className="line">Crafting the</span>
          <span className="line">next wave</span>
        </h1>
        <a className="hero-scroll" href="#about">
          Scroll down to
          <br />
          discover more
          <span className="hero-scroll-line" aria-hidden="true" />
        </a>
      </section>

      {/* ---- Content sections (placeholder copy — swap for your own) ---- */}
      <section className="section feature" id="about">
        <div className="feature-card reveal">
          <p className="kicker">01 — Studio</p>
          <h2>A design &amp; technology studio</h2>
          <p>
            We craft immersive digital experiences where brand, story and
            real-time 3D meet. Replace this copy with your studio’s story.
          </p>
        </div>
      </section>

      <section className="section feature feature-right">
        <div className="feature-card reveal">
          <p className="kicker">02 — Approach</p>
          <h2>Built in real time</h2>
          <p>
            Every project is engineered for motion — interfaces that respond,
            scenes that breathe, and moments that move people.
          </p>
        </div>
      </section>

      <section className="section feature">
        <div className="feature-card reveal">
          <p className="kicker">03 — Work</p>
          <h2>Selected projects</h2>
          <p>
            Drop your case studies here — a grid of work, a showreel, or a few
            signature pieces that show what you do best.
          </p>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="section footer" id="contact">
        <div className="reveal">
          <p className="kicker">Get in touch</p>
          <h2>Let’s build something.</h2>
          <a className="btn btn-primary" href="mailto:hello@example.com">
            Start a project
          </a>
          <p className="credits">
            3D model “Enchanted Crystal” via Sketchfab — replace with the
            author’s name &amp; license (e.g. CC-BY) from the model page. Built
            with React, three.js &amp; GSAP.
          </p>
        </div>
      </footer>
    </div>
  )
}
