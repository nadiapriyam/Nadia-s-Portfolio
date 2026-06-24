import React, { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion'
const labPhoto = '/lab-photo.png'

// ─── Color System ────────────────────────────────────────────────────────────
const G = {
  dark: '#0A1510',
  green: '#0D3B2E',
  md: '#1B6B4A',
  lt: '#52B888',
  bg: '#FAF4E8',
  muted: '#5A6B62',
}

const notePad: React.CSSProperties = {
  backgroundColor: '#FAF4E8',
  backgroundImage: [
    'linear-gradient(90deg, transparent 72px, rgba(13,59,46,0.08) 72px, rgba(13,59,46,0.08) 74px, transparent 74px)',
    'repeating-linear-gradient(transparent, transparent 31px, rgba(160,180,168,0.3) 31px, rgba(160,180,168,0.3) 32px)',
  ].join(', '),
}

// ─── Text Emphasis ───────────────────────────────────────────────────────────
function U({ children, color = 'rgba(220, 185, 50, 0.8)' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        textDecoration: 'underline',
        textDecorationColor: color,
        textDecorationThickness: 2.5,
        textUnderlineOffset: 4,
      }}
    >
      {children}
    </span>
  )
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        textDecoration: 'underline',
        textDecorationColor: 'rgba(220, 185, 50, 0.8)',
        textDecorationThickness: 2.5,
        textUnderlineOffset: 4,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

// ─── FadeUp ──────────────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Pin ─────────────────────────────────────────────────────────────────────
function Pin({ color = 'gold' }: { color?: 'gold' | 'green' | 'slate' }) {
  const disc: Record<string, string> = {
    gold: 'radial-gradient(circle at 35% 35%, #fff 0%, #f5d97a 18%, #c9a12a 42%, #8a6800 68%, #3d2d00 100%)',
    green: 'radial-gradient(circle at 35% 35%, #fff 0%, #7ddba8 18%, #22a066 42%, #0d6040 68%, #032d1e 100%)',
    slate: 'radial-gradient(circle at 35% 35%, #fff 0%, #c8d0d8 18%, #8898a8 42%, #4a5a6a 68%, #1a2530 100%)',
  }
  const shaftColor: Record<string, string> = {
    gold: '#9a7200',
    green: '#0d6040',
    slate: '#4a5a6a',
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: -18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: disc[color],
          boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(0,0,0,0.2)',
        }}
      />
      <div
        style={{
          width: 3,
          height: 9,
          background: shaftColor[color],
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
          marginTop: 1,
        }}
      />
    </div>
  )
}

// ─── Sticky ──────────────────────────────────────────────────────────────────
function Sticky({
  variant = 'a',
  pin,
  rotate = 0,
  mt = 0,
  step,
  children,
}: {
  variant?: 'a' | 'b' | 'c'
  pin?: 'gold' | 'green' | 'slate'
  rotate?: number
  mt?: number
  step?: number
  children: React.ReactNode
}) {
  const bg = {
    a: 'linear-gradient(155deg, #D5E9DF, #C3DAC9)',
    b: 'linear-gradient(155deg, #EDF5EF, #E0F0E6)',
    c: 'linear-gradient(155deg, #B4CFBB, #A6C4AE)',
  }[variant]

  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.8, rotate }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 280, damping: 16, mass: 0.7 }}
      style={{
        position: 'relative',
        background: bg,
        padding: '1.4rem 1.3rem 1.6rem',
        borderRadius: 3,
        overflow: 'visible',
        rotate,
        marginTop: mt,
        boxShadow:
          '0 1px 1px rgba(0,0,0,0.08), 0 3px 8px rgba(0,0,0,0.14), 0 10px 24px rgba(0,0,0,0.16), 4px 4px 0 rgba(0,0,0,0.05)',
        flex: 1,
      }}
    >
      {pin && <Pin color={pin} />}
      {step !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: 9,
            right: 9,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(13,59,46,0.13)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: G.green,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {step}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 22,
          height: 22,
          background: 'linear-gradient(225deg, rgba(255,255,255,0.5) 45%, rgba(0,0,0,0.08) 45%)',
          borderRadius: '0 0 3px 0',
        }}
      />
      {children}
    </motion.div>
  )
}

// ─── StickyArrow ─────────────────────────────────────────────────────────────
function StickyArrow({ dir = 'right', onDark = false }: { dir?: 'right' | 'down' | 'diag'; onDark?: boolean }) {
  const stroke = onDark ? 'rgba(250,244,232,0.35)' : G.md
  if (dir === 'diag') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
          opacity: onDark ? 0.7 : 0.5,
        }}
      >
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          <path d="M40 4L8 34M8 34l15 -3M8 34l3 -15" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  if (dir === 'right') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          flexShrink: 0,
          marginTop: 34,
          opacity: onDark ? 0.7 : 0.5,
        }}
      >
        <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
          <path d="M1 11h30M24 2l12 9-12 9" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        opacity: onDark ? 0.7 : 0.5,
      }}
    >
      <svg width="22" height="38" viewBox="0 0 22 38" fill="none">
        <path d="M11 1v30M2 24l9 12 9-12" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── SectionDivider ──────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ margin: '3.5rem 0 2.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: G.green,
          position: 'relative',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          paddingBottom: 3,
        }}
      >
        <span
          style={{
            position: 'absolute',
            bottom: -1,
            left: -4,
            right: -4,
            height: 9,
            background: 'rgba(220, 190, 60, 0.32)',
            transform: 'rotate(-0.4deg) skewX(-2deg)',
            borderRadius: 1,
            zIndex: 0,
          }}
        />
        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, opacity: 0.55 }}>
        <div style={{ height: 1, background: 'rgba(13,59,46,0.18)' }} />
        <div style={{ height: 1, background: 'rgba(13,59,46,0.09)' }} />
        <div style={{ height: 1, background: 'rgba(13,59,46,0.04)' }} />
      </div>
    </div>
  )
}

// ─── ProjectBlock ─────────────────────────────────────────────────────────────
function ProjectBlock({
  number,
  label,
  dark = false,
  children,
}: {
  number: string
  label: string
  dark?: boolean
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4, boxShadow: '0 14px 34px rgba(13,59,46,0.13)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        background: dark ? G.green : 'rgba(13,59,46,0.03)',
        border: dark ? 'none' : '1px solid rgba(13,59,46,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '0.9rem 1.8rem',
          borderBottom: dark
            ? '1px solid rgba(255,255,255,0.07)'
            : '1px solid rgba(13,59,46,0.09)',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: dark ? 'rgba(250,244,232,0.3)' : 'rgba(13,59,46,0.35)',
          }}
        >
          {number}
        </span>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: dark ? G.lt : G.green,
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(13,59,46,0.07)',
          }}
        />
      </div>
      {children}
    </motion.div>
  )
}

// ─── BCard ───────────────────────────────────────────────────────────────────
function BCard({
  dark = false,
  accent = false,
  notepad = false,
  noHover = false,
  style = {},
  children,
}: {
  dark?: boolean
  accent?: boolean
  notepad?: boolean
  noHover?: boolean
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  let base: React.CSSProperties = {
    background: 'rgba(255,255,255,0.62)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(13,59,46,0.10)',
  }
  if (dark) {
    base = {
      background: '#0D3B2E',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }
  } else if (accent) {
    base = {
      background: '#1B6B4A',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    }
  } else if (notepad) {
    base = {
      ...notePad,
      border: '1px solid rgba(13,59,46,0.12)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }
  }
  return (
    <motion.div
      whileHover={noHover || reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ borderRadius: 3, overflow: 'hidden', padding: '1.5rem', ...base, ...style }}
    >
      {children}
    </motion.div>
  )
}

// ─── Tag ─────────────────────────────────────────────────────────────────────
function Tag({ light = false, children }: { light?: boolean; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: 20,
        background: light ? 'rgba(255,255,255,0.14)' : 'rgba(13,59,46,0.09)',
        color: light ? 'rgba(250,244,232,0.85)' : G.green,
        border: light ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(13,59,46,0.16)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </span>
  )
}

// ─── WavingHand — minimal animated greeting ──────────────────────────────────
function WavingHand({ ml = '0.3em' }: { ml?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.span
      role="img"
      aria-label="waving hand"
      style={{ display: 'inline-block', transformOrigin: '70% 70%', marginLeft: ml, fontStyle: 'normal' }}
      animate={reduced ? undefined : { rotate: [0, 16, 0] }}
      transition={reduced ? undefined : { duration: 1.2, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
    >
      👋
    </motion.span>
  )
}

// ─── LivePilotTag — Tag with a minimal pulsing live dot ──────────────────────
function LivePilotTag() {
  const reduced = useReducedMotion()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.14)',
        color: 'rgba(250,244,232,0.85)',
        border: '1px solid rgba(255,255,255,0.2)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, flexShrink: 0 }}>
        {!reduced && (
          <motion.span
            aria-hidden
            animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G.lt }}
          />
        )}
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G.lt }} />
      </span>
      Live Pilot
    </span>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: G.lt,
  marginBottom: '0.6rem',
}

const sectionH2Style = (light = false): React.CSSProperties => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 800,
  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
  color: light ? G.bg : G.green,
  lineHeight: 1.15,
  marginBottom: '2rem',
})

const stickyLabelStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: G.muted,
  marginBottom: 8,
}

const stickyBodyStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  lineHeight: 1.62,
  color: G.dark,
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        transition: 'background 0.3s, backdrop-filter 0.3s',
        background: scrolled ? 'rgba(250,244,232,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(13,59,46,0.08)' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: scrolled ? G.green : G.bg,
          letterSpacing: '-0.01em',
        }}
      >
        NP
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {['About', 'Work', 'Contact'].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: scrolled ? G.green : 'rgba(250,244,232,0.8)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = G.lt)}
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.color = scrolled ? G.green : 'rgba(250,244,232,0.8)')
            }
          >
            {label}
          </a>
        ))}
        <div style={{ width: 1, height: 16, background: scrolled ? 'rgba(13,59,46,0.15)' : 'rgba(250,244,232,0.2)' }} />
        <a
          href="https://www.linkedin.com/in/nadia-priyam-b306b71a9/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          style={{ color: scrolled ? G.green : 'rgba(250,244,232,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = G.lt)}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = scrolled ? G.green : 'rgba(250,244,232,0.7)')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a
          href="mailto:nadiapriyam21@gmail.com"
          title="Email"
          style={{ color: scrolled ? G.green : 'rgba(250,244,232,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = G.lt)}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = scrolled ? G.green : 'rgba(250,244,232,0.7)')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: scrolled ? G.green : G.bg,
            border: `1px solid ${scrolled ? 'rgba(13,59,46,0.3)' : 'rgba(250,244,232,0.35)'}`,
            borderRadius: 5,
            padding: '4px 10px',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLAnchorElement
            el.style.borderColor = G.lt
            el.style.color = G.lt
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLAnchorElement
            el.style.borderColor = scrolled ? 'rgba(13,59,46,0.3)' : 'rgba(250,244,232,0.35)'
            el.style.color = scrolled ? G.green : G.bg
          }}
        >
          Resume
        </a>
      </div>
    </nav>
  )
}

// ─── Breakpoint hook ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return { isMobile: w < 640, isTablet: w < 960 }
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 420], [1, 0])
  const y = useTransform(scrollY, [0, 420], [0, 60])
  const { isMobile, isTablet } = useBreakpoint()

  const credentials = [
    {
      label: 'PILOT',
      items: ['Meridian live'],
    },
    {
      label: 'RESEARCH',
      items: ['MRI reconstruction', 'Pediatric imaging', 'Radiation reduction'],
    },
    {
      label: 'BACKGROUND',
      items: ['Neuroscience, Behavior and Biology', 'Radiology', 'Premedical anatomy', 'Java and Python'],
    },
  ]

  // Grid layout: desktop 3-col, tablet 2-col, mobile 1-col
  const gridCols = isMobile ? '1fr' : isTablet ? '260px 1fr' : '300px 1fr 1fr'
  const portraitGridRow = isMobile ? 'auto' : '1 / 3'
  const portraitMinH = isMobile ? 240 : isTablet ? 480 : 540
  const headlineGridCol = isMobile ? '1' : isTablet ? '2 / 3' : '2 / 4'
  const notepadGridCol = isMobile ? '1' : isTablet ? '2 / 3' : '2 / 3'
  const statsGridCol = isMobile ? '1' : isTablet ? '1 / 3' : '3 / 4'

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(155deg, ${G.dark} 0%, ${G.green} 55%, ${G.md} 100%)`,
        padding: isMobile ? '64px 1.2rem 2rem' : '80px 1.5rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <motion.div style={{ opacity, y, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '1rem',
            maxWidth: 1280,
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Portrait */}
          <div
            style={{
              gridRow: portraitGridRow,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              minHeight: portraitMinH,
            }}
          >
            <img
              src="/nadia.jpg"
              alt="Nadia Priyam"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 10%',
                display: 'block',
              }}
            />
          </div>

          {/* Headline card */}
          <div style={{ gridColumn: headlineGridCol }}>
            <BCard dark style={{ height: '100%', padding: isMobile ? '1.8rem 1.8rem' : '2.4rem 2.8rem' }}>
              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: G.lt,
                  marginBottom: '1.2rem',
                  opacity: 0.9,
                }}
              >
                NADIA PRIYAM · MEDICAL IMAGING · RADIOLOGY TECHNOLOGY
              </p>

              {/* Main headline */}
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: isMobile ? 'clamp(1.9rem, 7vw, 2.6rem)' : 'clamp(2.2rem, 3.8vw, 3.6rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: G.bg,
                }}
              >
                Engineering{' '}
                <span style={{ color: G.lt, fontStyle: 'italic' }}>medical technology</span>
                {' '}in the space where{' '}
                <U>clinical efficiency</U>{' '}
                becomes a necessity.
              </h1>
            </BCard>
          </div>

          {/* Personal note card — notepad */}
          <div style={{ gridColumn: notepadGridCol }}>
            <BCard notepad style={{ height: '100%', padding: isMobile ? '1.6rem 1.6rem' : '2rem 2.2rem' }}>
              {/* Personal greeting */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: isMobile ? '1.25rem' : '1.45rem',
                  color: G.green,
                  lineHeight: 1.2,
                  marginBottom: '0.9rem',
                }}
              >
                Hi, I'm Nadia Priyam.<WavingHand />
              </p>

              {/* Supporting sentence */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: G.muted,
                  marginBottom: '1.6rem',
                }}
              >
                I build medical imaging tools shaped by neuroscience, anatomy, and software, with a focus on making radiology workflows clearer, faster, and more human.
              </p>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <motion.a
                  href="#work"
                  whileHover={{ y: -2, boxShadow: '0 10px 22px rgba(13,59,46,0.28)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: '11px 24px',
                    borderRadius: 3,
                    background: G.green,
                    color: G.bg,
                    textDecoration: 'none',
                    letterSpacing: '0.03em',
                  }}
                >
                  Explore my work
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ y: -2, backgroundColor: 'rgba(13,59,46,0.06)', borderColor: 'rgba(13,59,46,0.85)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: '11px 24px',
                    borderRadius: 3,
                    background: 'transparent',
                    color: G.green,
                    border: `1.5px solid rgba(13,59,46,0.5)`,
                    textDecoration: 'none',
                    letterSpacing: '0.03em',
                  }}
                >
                  Get in touch
                </motion.a>
              </div>
            </BCard>
          </div>

          {/* Credibility snapshot */}
          <div style={{ gridColumn: statsGridCol }}>
            <BCard accent style={{ height: '100%', padding: isMobile ? '1.6rem 1.6rem' : '2rem 2.2rem' }}>
              {credentials.map(({ label, items }) => (
                <div key={label} style={{ marginBottom: '1.4rem' }}>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      color: 'rgba(250,244,232,0.42)',
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {items.map((item) => (
                      <p
                        key={item}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: G.bg,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </BCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2.2rem',
            animation: 'bounceY 2s ease-in-out infinite',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="rgba(250,244,232,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

// ─── AboutSection ─────────────────────────────────────────────────────────────
function AboutSection() {
  const { isMobile, isTablet } = useBreakpoint()

  const gridCols = isMobile || isTablet ? '1fr' : '1fr 1fr 1fr'
  const notecardCol = isMobile || isTablet ? '1' : '1 / 3'

  // Notepad lines + k-space concentric rings in top-right corner
  const aboutCardBg: React.CSSProperties = {
    backgroundImage: [
      'linear-gradient(90deg, transparent 72px, rgba(13,59,46,0.08) 72px, rgba(13,59,46,0.08) 74px, transparent 74px)',
      'repeating-linear-gradient(transparent, transparent 31px, rgba(160,180,168,0.3) 31px, rgba(160,180,168,0.3) 32px)',
      'radial-gradient(circle at 108% -8%, transparent 28%, rgba(13,59,46,0.045) 30%, transparent 34%)',
      'radial-gradient(circle at 108% -8%, transparent 46%, rgba(13,59,46,0.03) 48%, transparent 52%)',
      'radial-gradient(circle at 108% -8%, transparent 64%, rgba(13,59,46,0.02) 66%, transparent 70%)',
    ].join(', '),
    backgroundColor: '#FAF4E8',
  }

  const greenCardData = [
    { label: 'DEGREE', items: ['Neuroscience, Behavior, and Biology'] },
    { label: 'BUILDING', items: ['Meridian', 'Medical imaging visualization platform'] },
    { label: 'RESEARCH', items: ['K space MRI reconstruction'] },
    { label: 'BACKGROUND', items: ['Radiology', 'Premedical anatomy', 'Java', 'Python'] },
  ]

  return (
    <section id="about" style={{ background: G.bg, padding: isMobile ? '3.5rem 1.2rem' : '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeUp>
          <p style={eyebrowStyle}>Signal to Image</p>
          <h2 style={{ ...sectionH2Style(), maxWidth: 700 }}>
            <span style={{ display: 'block' }}>Building at the root of MRI,</span>
            <span style={{ display: 'block' }}>where signal space becomes anatomy.</span>
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem' }}>
          <FadeUp delay={0.1} style={{ gridColumn: notecardCol }}>
            <BCard
              notepad
              style={{
                ...aboutCardBg,
                height: '100%',
                padding: isMobile ? '1.8rem 1.8rem' : '2.4rem 2.8rem',
                boxShadow: '0 2px 18px rgba(0,0,0,0.08)',
                border: '1px solid rgba(13,59,46,0.2)',
              }}
            >
              {/* Lab photo */}
              <div style={{ marginBottom: '1.6rem', textAlign: 'center' }}>
                <img
                  src={labPhoto}
                  alt="Nadia in the research lab"
                  style={{
                    width: isMobile ? 150 : 180,
                    height: isMobile ? 180 : 215,
                    objectFit: 'cover',
                    objectPosition: 'center 30%',
                    borderRadius: 4,
                    display: 'block',
                    margin: '0 auto',
                    border: '1px solid rgba(13,59,46,0.15)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  }}
                />
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: G.muted,
                  letterSpacing: '0.04em',
                  marginTop: 7,
                  fontStyle: 'italic',
                }}>
                  In the lab — where the questions started.
                </p>
              </div>

              {/* Name */}
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: isMobile ? '1.3rem' : '1.65rem',
                color: G.green,
                lineHeight: 1.15,
                marginBottom: '1.6rem',
              }}>
                A bit about me.
              </p>

              {/* Para 1 */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, lineHeight: 1.82, color: G.dark, marginBottom: '1.7rem' }}>
                I'm a founder with a degree in <U color={G.lt}>Neuroscience, Behavior, and Biology</U> from Emory University and a premedical background that built a <U color={G.lt}>working fluency in anatomy</U>. That foundation shapes how I build radiology tools, with an understanding of both the scan and the clinical thinking behind it.
              </p>

              {/* Para 2 */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, lineHeight: 1.82, color: G.muted, marginBottom: '2.2rem' }}>
                The convergence of medicine and computation was always inevitable. I am building at that intersection because <U color={G.lt}>efficiency in clinical environments</U> is not a feature. It is a necessity.
              </p>

              {/* Field Note — editorial research callout */}
              <div style={{
                borderLeft: '3px solid rgba(82,184,136,0.5)',
                paddingLeft: '1rem',
                paddingTop: '0.6rem',
                paddingBottom: '0.6rem',
                background: 'rgba(13,59,46,0.04)',
                borderRadius: '0 3px 3px 0',
              }}>
                <span style={{
                  display: 'block',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: G.lt,
                  marginBottom: 6,
                }}>
                  Field Note
                </span>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: G.dark,
                }}>
                  The scanner never sees an image. It sees oscillating voltages. The image is always a mathematical construction.
                </p>
              </div>
            </BCard>
          </FadeUp>

          <FadeUp delay={0.2}>
            <BCard dark style={{ height: '100%', padding: isMobile ? '1.8rem' : '2.2rem', border: '1px solid rgba(82,184,136,0.18)' }}>
              {greenCardData.map(({ label, items }, groupIdx) => (
                <div key={label} style={{ marginBottom: groupIdx < greenCardData.length - 1 ? '2rem' : 0 }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,244,232,0.45)',
                    marginBottom: 8,
                  }}>
                    {label}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {items.map((item, i) => (
                      <p key={item} style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: i === 0 ? 14 : 12.5,
                        fontWeight: i === 0 ? 600 : 400,
                        color: i === 0 ? G.bg : 'rgba(250,244,232,0.5)',
                        lineHeight: 1.55,
                      }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </BCard>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── KSpaceTransform ─────────────────────────────────────────────────────────
// Left: a grayscale tissue (brain) image — the "reconstructed pixels" a doctor
// reads. Right: its 2D Fourier transform (k-space) — bright low-frequency centre,
// radial decay, phase-encode lines, swept line-by-line as a scanner acquires it.
// Middle: Fourier wavelets bridging image -> signal. Reflects the section text:
// "K-space is the 2D Fourier transform of tissue. Position is encoded in phase."
function KSpaceTransform({ height, reduced }: { height: number; reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let W = 0
    let H = 0

    // Brain/phantom ellipses in normalized [-1,1]: cx, cy, rx, ry, intensity
    const TISSUE: [number, number, number, number, number][] = [
      [0, 0, 0.9, 0.92, 0.34],
      [0, 0, 0.82, 0.84, 0.6],
      [0, 0, 0.7, 0.72, 0.42],
      [-0.26, -0.08, 0.17, 0.27, 0.14],
      [0.26, -0.08, 0.17, 0.27, 0.14],
      [0, 0.36, 0.13, 0.17, 0.74],
      [0, -0.42, 0.1, 0.12, 0.68],
    ]
    const tissueAt = (x: number, y: number) => {
      let v = -1
      for (const [cx, cy, rx, ry, it] of TISSUE) {
        const dx = (x - cx) / rx
        const dy = (y - cy) / ry
        if (dx * dx + dy * dy <= 1) v = it
      }
      return v
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      const pad = Math.round(H * 0.12)
      const sq = Math.min(H - pad * 2, W * 0.3)
      const top = (H - sq) / 2
      const imgX = pad
      const ksX = W - pad - sq
      const midX0 = imgX + sq
      const midX1 = ksX
      const cyM = top + sq / 2

      // ── middle: Fourier wavelets bridging image -> k-space ──
      if (midX1 - midX0 > 24) {
        const span = midX1 - midX0
        for (let i = 0; i < 4; i++) {
          const freq = (i + 1) * 0.9
          const amp = (sq * 0.16) / (i + 1)
          ctx.beginPath()
          for (let px = 0; px <= span; px += 2) {
            const fx = px / span
            const env = Math.sin(Math.PI * fx)
            const yy = cyM + Math.sin(fx * span * 0.05 * freq - t * (1.4 + i * 0.5)) * amp * env
            const x = midX0 + px
            if (px === 0) ctx.moveTo(x, yy)
            else ctx.lineTo(x, yy)
          }
          ctx.strokeStyle = 'rgba(95,224,196,' + (0.16 + i * 0.05) + ')'
          ctx.lineWidth = 1
          ctx.stroke()
        }
        for (let d = 0; d < 5; d++) {
          const p = (t * 0.12 + d / 5) % 1
          const x = midX0 + p * span
          const env = Math.sin(Math.PI * p)
          ctx.beginPath()
          ctx.arc(x, cyM, 1.6 * env + 0.6, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(140,240,210,' + 0.5 * env + ')'
          ctx.fill()
        }
        ctx.font = '600 ' + Math.max(8, Math.round(H * 0.075)) + "px 'DM Sans', sans-serif"
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(238,234,222,0.45)'
        ctx.fillText('FFT', (midX0 + midX1) / 2, Math.max(10, top - 3))
      }

      // ── left: tissue image (grayscale pixels) ──
      const cell = Math.max(2, Math.round(sq / 34))
      for (let py = 0; py < sq; py += cell) {
        for (let px = 0; px < sq; px += cell) {
          const nx = ((px + cell / 2) / sq) * 2 - 1
          const ny = ((py + cell / 2) / sq) * 2 - 1
          const v = tissueAt(nx, ny)
          if (v < 0) continue
          const scan = 0.85 + 0.15 * Math.sin((px / sq) * 6 - t * 2)
          const b = Math.min(1, v * 1.25 * scan)
          ctx.fillStyle = 'rgba(238,234,222,' + b + ')'
          ctx.fillRect(imgX + px, top + py, cell - 0.6, cell - 0.6)
        }
      }

      // ── right: k-space (2D Fourier magnitude) ──
      const kcell = 3
      const kcx = ksX + sq / 2
      const kcy = top + sq / 2
      const acq = ((t * 0.18) % 1.4) - 0.2
      const acqY = top + acq * sq
      for (let py = 0; py < sq; py += kcell) {
        for (let px = 0; px < sq; px += kcell) {
          const nx = ((px + kcell / 2) / sq) * 2 - 1
          const ny = ((py + kcell / 2) / sq) * 2 - 1
          const r = Math.sqrt(nx * nx + ny * ny)
          let base = 1 / (1 + Math.pow(r * 9, 2))
          base = Math.pow(base, 0.42)
          const rings = 0.62 + 0.38 * Math.cos(r * 32 - t * 1.5)
          const axis = Math.exp(-nx * nx * 70) * 0.45 + Math.exp(-ny * ny * 70) * 0.45
          let mag = Math.min(1, base * rings + base * axis)
          if (((py / kcell) | 0) % 2 === 0) mag *= 0.82
          const dline = Math.abs(top + py - acqY)
          const glow = Math.exp(-(dline * dline) / 40) * 0.6
          mag = Math.min(1, mag + glow * base)
          if (mag < 0.02) continue
          ctx.fillStyle = 'rgba(95,224,196,' + mag + ')'
          ctx.fillRect(ksX + px, top + py, kcell - 0.4, kcell - 0.4)
        }
      }
      const pulse = 0.7 + 0.3 * Math.sin(t * 2)
      const g = ctx.createRadialGradient(kcx, kcy, 0, kcx, kcy, sq * 0.18)
      g.addColorStop(0, 'rgba(200,255,240,' + 0.85 * pulse + ')')
      g.addColorStop(1, 'rgba(95,224,196,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(kcx, kcy, sq * 0.18, 0, Math.PI * 2)
      ctx.fill()

      // kx / ky axis labels on the k-space panel
      ctx.font = '600 ' + Math.max(8, Math.round(H * 0.07)) + "px 'DM Sans', sans-serif"
      ctx.fillStyle = 'rgba(95,224,196,0.62)'
      ctx.textAlign = 'center'
      ctx.fillText('kx', kcx, Math.min(H - 1, top + sq + Math.round(H * 0.1)))
      ctx.save()
      ctx.translate(Math.max(6, ksX - Math.round(H * 0.05)), kcy)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('ky', 0, 0)
      ctx.restore()
    }

    const setup = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setup()

    if (reduced) {
      draw(0)
      const roR = new ResizeObserver(() => {
        setup()
        draw(0)
      })
      roR.observe(wrap)
      return () => roR.disconnect()
    }

    const start = performance.now()
    const loop = (now: number) => {
      draw((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => setup())
    ro.observe(wrap)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [height, reduced])

  return (
    <div ref={wrapRef} style={{ width: '100%', height }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}

// ─── KodeSignalReveal ───────────────────────────────────────────────────────
function KodeSignalReveal({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const { isMobile } = useBreakpoint()
  const reducedMotion = useReducedMotion() ?? false

  const stripH = isMobile ? 118 : 150

  return (
    <section ref={ref} style={style}>
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'linear-gradient(108deg, #0a2c22 0%, #0c3a2d 46%, #0f4a39 100%)',
          border: '1px solid rgba(82,184,136,0.16)',
        }}
      >
        {/* ── Seamless transformation strip: pixels morph into raw signal ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: isMobile ? '1.3rem 1.3rem 0.5rem' : '1.5rem 2rem 0.6rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(250,244,232,0.42)' }}>
              The shift
            </span>
            <motion.span
              animate={reducedMotion ? {} : { opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#5FE0C0', textShadow: '0 0 14px rgba(95,224,196,0.55)', whiteSpace: 'nowrap' }}
            >
              K-ODE starts earlier.
            </motion.span>
          </div>

          <div style={{ marginTop: 10 }}>
            <KSpaceTransform height={stripH} reduced={reducedMotion} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(250,244,232,0.5)' }}>
              reconstructed pixels
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', color: '#5FE0C0' }}>
              raw signal space
            </span>
          </div>
        </motion.div>

        {/* ── Seamless dual panels (no torn seam) ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            borderTop: '1px solid rgba(82,184,136,0.12)',
          }}
        >
          {/* Today */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, padding: isMobile ? '1.5rem 1.4rem' : '2rem 2rem 2rem 2.4rem' }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: G.muted, marginBottom: 12 }}>
              Today
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, lineHeight: 1.78, color: 'rgba(250,244,232,0.62)' }}>
              Most radiology workflows and image-based AI models begin after reconstruction, reading grayscale images. But MRI is not born as a picture. By the time signal becomes a pixel, part of the scanner's original measurement has already been compressed, simplified, or left behind.
            </p>
          </motion.div>

          {/* Soft seam (desktop) */}
          {!isMobile && (
            <div aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', background: 'linear-gradient(to bottom, transparent, rgba(82,184,136,0.28), transparent)' }} />
          )}

          {/* K-ode */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, padding: isMobile ? '1.5rem 1.4rem' : '2rem 2.4rem 2rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: G.lt, marginBottom: 12 }}>
                What K-ode aims to achieve
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, lineHeight: 1.78, color: 'rgba(250,244,232,0.9)', marginBottom: 16 }}>
                K-ODE works closer to the root of MRI, before the data collapses into a conventional image. It focuses on the signal space where frequency, phase, and anatomy first connect, preserving information that reconstruction can flatten or bury.
              </p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, lineHeight: 1.55, color: G.bg, fontStyle: 'italic' }}
            >
              This should not be optional. It should become foundational.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


// ─── WorkSection ─────────────────────────────────────────────────────────────
function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'zoom-out' }}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 6, boxShadow: '0 8px 60px rgba(0,0,0,0.6)', cursor: 'default' }}
      />
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '1.2rem', right: '1.4rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
      >×</button>
    </motion.div>
  )
}

function ExpandableImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div style={{ position: 'relative', cursor: 'zoom-in', width: '100%', height: '100%' }} onClick={() => setOpen(true)}>
        <img src={src} alt={alt} style={style} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 4, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em' }}>Click to expand</span>
        </div>
      </div>
      <AnimatePresence>
        {open && <LightboxModal src={src} alt={alt} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function WorkSection() {
  const { isMobile } = useBreakpoint()
  const [kspaceOpen, setKspaceOpen] = React.useState(false)
  const [evidenceOpen, setEvidenceOpen] = React.useState(false)
  return (
    <section
      id="work"
      style={{ background: `linear-gradient(180deg, ${G.bg} 0%, rgba(13,59,46,0.04) 100%)`, padding: '5rem 1.5rem' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeUp>
          <p style={eyebrowStyle}>Work</p>
          <h2 style={sectionH2Style()}>Projects in production &amp; research.</h2>
        </FadeUp>

        {/* ── Meridian ── */}
        <FadeUp delay={0.1}>
          <ProjectBlock number="01" label="MERIDIAN" dark>

            {/* Hero: two-column — stats left, image right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Left: logo + tags + stats */}
              <div style={{ padding: '2rem 2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <img
                  src="/meridian-logo.png"
                  alt="Meridian"
                  style={{ height: 38, width: 'auto', maxWidth: 220, filter: 'invert(1) brightness(0.9)', marginBottom: '1.2rem', display: 'block' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
                  <Tag light>Health Tech</Tag>
                  <Tag light>AI Workflow</Tag>
                  <LivePilotTag />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {[
                    { num: '88%', label: 'of US adults lack proficient health literacy', src: 'NAAL / CDC, 2003' },
                    { num: '29%', label: 'of patients understand their imaging exam', src: 'PubMed, 2015' },
                    { num: '2x', label: 'more likely to follow treatment when they understand', src: 'PMC meta-analysis' },
                  ].map(({ num, label, src }) => (
                    <div key={num}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: G.lt, lineHeight: 1, marginBottom: 5 }}>{num}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(250,244,232,0.6)', lineHeight: 1.4, marginBottom: 3 }}>{label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(250,244,232,0.25)', letterSpacing: '0.03em' }}>{src}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: prototype image panel */}
              <div style={{ height: 320, overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/meridian-prototype.png"
                  alt="Meridian prototype"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                />
                {/* Fade left edge into dark green */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${G.green} 0%, rgba(13,59,46,0.6) 18%, transparent 40%)`, pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Sticky notes row */}
            <div style={{ padding: '0 1.6rem 1.4rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.25)', marginBottom: '0.2rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                The story
              </p>
              <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', paddingTop: 14 }}>
                <Sticky variant="b" pin="gold" rotate={-1.3} step={1}>
                  <p style={stickyLabelStyle}>Problem</p>
                  <p style={stickyBodyStyle}>
                    <Num>85%</Num> of patients report confusion with radiology report language. A grayscale scan is <U>unreadable without medical training</U>.
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(13,59,46,0.4)', letterSpacing: '0.03em', marginTop: 8 }}>Insights into Imaging, 2020</p>
                </Sticky>
                <StickyArrow dir="right" onDark />
                <Sticky variant="a" pin="green" rotate={0.9} mt={16} step={2}>
                  <p style={stickyLabelStyle}>Solution</p>
                  <p style={stickyBodyStyle}>
                    Meridian converts scans into <U>3D annotated summaries</U> with a patient-facing field that makes <U>medical jargon understandable</U> directly using radiologists' annotations.
                  </p>
                </Sticky>
                <StickyArrow dir="right" onDark />
                <Sticky variant="c" pin="slate" rotate={-0.7} step={3}>
                  <p style={stickyLabelStyle}>Impact</p>
                  <p style={stickyBodyStyle}>
                    <U>3D visualization</U> improves comprehension by <Num>40%</Num>. Patients who understand their diagnosis are <Num>2x</Num> more likely to follow treatment.
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(13,59,46,0.4)', letterSpacing: '0.03em', marginTop: 8 }}>Frontiers in Physiology, 2025 · PMC meta-analysis</p>
                </Sticky>
                <StickyArrow dir="right" onDark />
                <Sticky variant="b" pin="gold" rotate={1.1} mt={10} step={4}>
                  <p style={stickyLabelStyle}>Status</p>
                  <p style={stickyBodyStyle}>
                    <U>Live pilot</U> with early clinical partners. Iterating on feedback.
                  </p>
                </Sticky>
              </div>
            </div>

            {/* Before / After comparison strip */}
            <div style={{
              background: 'rgba(0,0,0,0.22)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: isMobile ? '1.6rem 1.2rem 2rem' : '2rem 2.2rem 2.4rem',
            }}>
              {/* Label */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(250,244,232,0.28)',
                marginBottom: '1.4rem',
              }}>
                From greyscale to understanding
              </p>

              {/* Cards row */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'stretch',
                gap: 0,
              }}>

                {/* ── Left card: Original MRI ── */}
                <div style={{
                  flex: 1,
                  background: '#050c08',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                }}>
                  {/* Header bar */}
                  <div style={{
                    padding: '0.6rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.03)',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'inline-block', flexShrink: 0 }} />
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: 'rgba(250,244,232,0.38)',
                    }}>Original MRI view</p>
                  </div>
                  {/* Image */}
                  <div style={{ height: 300, overflow: 'hidden' }}>
                    <img
                      src="/brain-2d.png"
                      alt="2D MRI scan"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block',
                      }}
                    />
                  </div>
                  {/* Caption */}
                  <div style={{ padding: '0.55rem 1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.22)' }}>
                      Greyscale MRI scan
                    </p>
                  </div>
                </div>

                {/* ── Connector ── */}
                <div style={{
                  width: isMobile ? 'auto' : 88,
                  height: isMobile ? 64 : 'auto',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: isMobile ? '0.6rem 0' : '0 0.6rem',
                }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: G.lt,
                    textAlign: 'center',
                    opacity: 0.85,
                  }}>Meridian</p>
                  {isMobile ? (
                    <svg width="14" height="32" viewBox="0 0 14 32" fill="none">
                      <path d="M7 0v24M1 18l6 12 6-12" stroke={G.lt} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                      <path d="M0 6h32M27 1l11 5-11 5" stroke={G.lt} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 8.5,
                    letterSpacing: '0.05em',
                    color: 'rgba(82,184,136,0.5)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}>Signal to<br/>understanding</p>
                </div>

                {/* ── Right card: 3D view ── */}
                <div style={{
                  flex: 1,
                  background: '#070e0a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                }}>
                  {/* Header bar */}
                  <div style={{
                    padding: '0.6rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.03)',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: G.lt, opacity: 0.65, display: 'inline-block', flexShrink: 0 }} />
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: 'rgba(250,244,232,0.38)',
                    }}>Patient-friendly 3D view</p>
                  </div>
                  {/* Image */}
                  <div style={{ height: 300, overflow: 'hidden', position: 'relative' }}>
                    <img
                      src="/brain-3d.jpg"
                      alt="Meridian 3D brain view"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 50%',
                        display: 'block',
                      }}
                    />
                    {/* Annotation overlay */}
                    {/* Annotation: callout box top-right, pointer to ventricles center */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} overflow="visible">
                        {/* Line from bottom-left of callout to ventricle dot */}
                        <line x1="75%" y1="112" x2="55%" y2="138" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
                        <circle cx="55%" cy="138" r="4" fill="white" opacity="0.8"/>
                      </svg>
                      {/* Callout box */}
                      <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 10,
                        width: 150,
                        background: 'rgba(255,255,255,0.96)',
                        borderRadius: 8,
                        padding: '9px 12px 10px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                      }}>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: '#1e3a5f',
                          marginBottom: 4,
                          letterSpacing: '0.01em',
                        }}>Enlarged ventricles</p>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 9.5,
                          color: '#374151',
                          lineHeight: 1.45,
                          margin: 0,
                        }}>These fluid spaces look larger than usual. This can happen with hydrocephalus, a buildup of extra fluid in the brain.</p>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 9,
                          color: '#6b7280',
                          margin: '6px 0 0',
                        }}>Your care team can help.</p>
                      </div>
                    </div>
                  </div>
                  {/* Caption */}
                  <div style={{ padding: '0.55rem 1rem 0.4rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.22)' }}>
                      Visual, shareable, understandable
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: 'rgba(250,244,232,0.18)', fontStyle: 'italic', marginTop: 4, letterSpacing: '0.01em' }}>
                      AI generated prototype. This represents what we are working toward.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </ProjectBlock>
        </FadeUp>

        {/* ── Divider ── */}
        <SectionDivider label="Next — K-ode MRI Research" />

        {/* ── K-ode ── */}
        <FadeUp delay={0.1}>
          <ProjectBlock number="02" label="K-ODE">
            <div style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

              {/* Quote strip — full width */}
              <KodeSignalReveal style={{ gridColumn: '1 / 4', marginBottom: '0.4rem' }} />

              {/* K-ode main card — notepad */}
              <BCard notepad noHover style={{ gridColumn: '1 / 2', padding: '2.2rem 2.4rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                  <Tag>MRI Research</Tag>
                  <Tag>Signal Processing</Tag>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.6rem', color: G.green, marginBottom: '0.8rem', lineHeight: 1.2 }}>
                  K-ode
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.72, color: G.dark, marginBottom: '1.4rem' }}>
                  An MRI scanner does not capture an image directly. It collects raw frequency signals (called <span style={{ position: 'relative', display: 'inline' }}><button onClick={() => setKspaceOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', color: 'inherit', fontStyle: 'italic', textDecoration: 'underline', textDecorationColor: G.lt, textDecorationThickness: 2, textUnderlineOffset: 3 }}>k-space</button><AnimatePresence>{kspaceOpen && (<motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.18 }} style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, width: 272, background: G.bg, border: '1px solid rgba(82,184,136,0.22)', borderRadius: 10, padding: '0.85rem 1rem', boxShadow: '0 6px 24px rgba(0,0,0,0.13)', zIndex: 20 }}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: G.dark, margin: '0 0 5px' }}>The MRI scanner does not record an image. It records the Fourier transform of tissue density. The image is recovered by inverse Fourier transform.</p><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: G.dark, margin: '0 0 7px' }}>K-space is the 2D Fourier transform of tissue. Position is encoded in phase. This is not an analogy. It is the physical mechanism of MRI acquisition.</p><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: G.muted, letterSpacing: '0.03em', margin: 0 }}>Lauterbur (1973), Twieg (1983)</p></motion.div>)}</AnimatePresence></span>), then uses a mathematical process called the Fourier transform to convert them into the images a doctor reads. K-ode reconstructs those images from fewer signals than usual, cutting scan time without losing quality. Achieves <Num>SSIM {'>'} 0.94</Num> on benchmark datasets.
                </p>
              </BCard>

              {/* Sticky 2×2 with arrows */}
              <div
                style={{
                  gridColumn: '2 / 4',
                  display: 'grid',
                  gridTemplateColumns: '1fr 52px 1fr',
                  gridTemplateRows: 'auto 44px auto',
                  gap: 0,
                  paddingTop: 26,
                }}
              >
                <Sticky variant="a" pin="green" rotate={-1.1} step={1}>
                  <p style={stickyLabelStyle}>How K-space is structured</p>
                  <svg viewBox="0 0 200 72" style={{ width: '100%', maxHeight: 78, display: 'block', marginBottom: 10 }} role="img" aria-label="K-space concentric rings: center holds bulk contrast, outer rings hold fine detail">
                    <g transform="translate(38,36)" fill="none" stroke={G.green}>
                      <circle r="30" strokeOpacity="0.22" strokeWidth="1.5" />
                      <circle r="22" strokeOpacity="0.38" strokeWidth="1.5" />
                      <circle r="14" strokeOpacity="0.58" strokeWidth="1.5" />
                      <circle r="6" fill={G.green} stroke="none" />
                    </g>
                    <line x1="42" y1="31" x2="86" y2="15" stroke={G.md} strokeWidth="1" strokeOpacity="0.5" />
                    <text x="90" y="15" fontFamily="'DM Sans', sans-serif" fontSize="9" fontWeight="700" fill={G.green} dominantBaseline="middle">CENTER · contrast</text>
                    <line x1="65" y1="51" x2="86" y2="59" stroke={G.md} strokeWidth="1" strokeOpacity="0.5" />
                    <text x="90" y="59" fontFamily="'DM Sans', sans-serif" fontSize="9" fontWeight="700" fill={G.green} dominantBaseline="middle">OUTER RINGS · detail</text>
                  </svg>
                  <p style={stickyBodyStyle}>
                    <U>K-space center</U> holds bulk contrast. <U>Outer rings</U> hold fine detail. The image sharpens from anatomy to edges, in order of <U>spatial scale</U>, not randomly.
                  </p>
                </Sticky>
                <StickyArrow dir="right" />
                <Sticky variant="c" pin="slate" rotate={0.9} mt={18} step={2}>
                  <p style={stickyLabelStyle}>Frequency as fingerprint</p>
                  <svg viewBox="0 0 200 64" style={{ width: '100%', maxHeight: 72, display: 'block', marginBottom: 10 }} role="img" aria-label="Radial power curves: each tissue type produces a distinct decay signature across k-space">
                    <line x1="8" y1="52" x2="192" y2="52" stroke={G.green} strokeWidth="1" strokeOpacity="0.3" />
                    <polyline points="10,12 38,22 74,36 120,46 188,50" fill="none" stroke={G.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="10,18 38,20 70,38 116,40 188,48" fill="none" stroke={G.lt} strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="10" y="62" fontFamily="'DM Sans', sans-serif" fontSize="8" fontWeight="600" fill={G.muted}>center</text>
                    <text x="170" y="62" fontFamily="'DM Sans', sans-serif" fontSize="8" fontWeight="600" fill={G.muted}>edge</text>
                  </svg>
                  <p style={stickyBodyStyle}>
                    Every tissue type produces a unique <U>radial power curve</U> in k-space. <U>Pathology changes that curve</U> before an image ever forms. K-ode mines this frequency layer, data that has <U>never been systematically studied</U>.
                  </p>
                </Sticky>

                <div />
                <StickyArrow dir="diag" />
                <div />

                <Sticky variant="b" pin="gold" rotate={-0.6} step={3}>
                  <p style={stickyLabelStyle}>K-ode's method</p>
                  <p style={stickyBodyStyle}>
                    Instead of segmenting a reconstructed image, K-ode <U>filters k-space before the inverse Fourier transform</U>. The <U>physics does the separation</U>, not a guessing algorithm.
                  </p>
                </Sticky>
                <StickyArrow dir="right" />
                <Sticky variant="a" pin="green" rotate={1.2} mt={14} step={4}>
                  <p style={stickyLabelStyle}>Why it matters everywhere</p>
                  <p style={stickyBodyStyle}>
                    K-space is collected in <U>every MRI scan worldwide</U>. If pathology is readable in <U>raw frequency data before reconstruction</U>, it changes how every scan is analyzed, not just in research, but across <U>every clinical system that touches MRI</U>.
                  </p>
                </Sticky>
              </div>

              {/* ── Evidence section ── */}
              <div style={{ gridColumn: '1 / 4', marginTop: '1.6rem', paddingTop: '1.8rem', borderTop: '1px solid rgba(13,59,46,0.1)' }}>

                {/* Label + headline — toggles the evidence dropdown */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setEvidenceOpen(o => !o)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setEvidenceOpen(o => !o)
                    }
                  }}
                  aria-expanded={evidenceOpen}
                  aria-controls="evidence-body"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '4px', margin: '-4px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', outlineColor: G.lt, outlineOffset: 2 }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: G.lt, marginBottom: '0.5rem' }}>Evidence from my research</p>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', color: G.green, lineHeight: 1.25, margin: 0 }}>
                      What appears in the signal before it becomes pixels
                    </h4>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: evidenceOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0, marginTop: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', border: `1px solid ${G.lt}`, color: G.green }}
                  >
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {evidenceOpen && (
                    <motion.div
                      key="evidence-body"
                      id="evidence-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '1.1rem' }}>

                {/* Intro */}
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.78, color: G.muted, marginBottom: '1.6rem', maxWidth: 680 }}>
                  After defining where KODE fits in the MRI pipeline, I tested whether useful information could be found earlier, in raw k-space. These experiments show that contrast, structure, and subtle signal patterns can exist before the final grayscale image is reconstructed.
                </p>

                {/* Four evidence finding cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.8rem' }}>
                  {([
                    {
                      stat: '135/135',
                      label: 'Frequency bands',
                      body: 'Enhancement appeared across every frequency band in raw k-space before image reconstruction.',
                    },
                    {
                      stat: '8%',
                      label: 'K-space center',
                      body: 'A small central region carried much of the visible anatomical structure.',
                    },
                    {
                      stat: '2.2%',
                      label: 'Subtle signal',
                      body: 'A sparse signal component carried pathology-relevant structure that could be buried during pixel averaging.',
                    },
                    {
                      stat: 'T1 vs T2',
                      label: 'Contrast encoding',
                      body: 'The same anatomy can produce different image contrast depending on how the MRI signal is encoded and reconstructed.',
                    },
                  ] as { stat: string; label: string; body: string }[]).map(({ stat, label, body }) => (
                    <div key={label} style={{ background: G.bg, border: '1px solid rgba(13,59,46,0.11)', borderRadius: 8, padding: '1.1rem 1.15rem', display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: G.green, marginBottom: 5, lineHeight: 1.1 }}>{stat}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: G.lt, marginBottom: 9 }}>{label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, lineHeight: 1.65, color: G.muted }}>{body}</p>
                    </div>
                  ))}
                </div>

                {/* Figure cards — 55/45, equal height */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,11fr) minmax(0,9fr)', gap: '1rem', alignItems: 'stretch' }}>

                  {/* Figure 1: T1 vs T2 */}
                  <div style={{ background: G.bg, border: '1px solid rgba(13,59,46,0.12)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#0d0d0d', position: 'relative', flex: '1 1 0', minHeight: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', gap: 2 }}>
                      <div style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                        <ExpandableImage
                          src="/kode-t1t2.png"
                          alt="T1 brain scan"
                          style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', objectFit: 'cover', objectPosition: 'left center', display: 'block' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '10%' }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, color: 'white', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 20, letterSpacing: '0.06em', marginBottom: 4 }}>T1</span>
                          <svg width="12" height="18" viewBox="0 0 12 18"><line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/><polygon points="6,18 2,11 10,11" fill="rgba(255,255,255,0.5)"/></svg>
                        </div>
                      </div>
                      <div style={{ width: 1, height: '60%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                      <div style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
                        <ExpandableImage
                          src="/kode-t1t2.png"
                          alt="T2 brain scan"
                          style={{ position: 'absolute', top: 0, right: 0, width: '200%', height: '100%', objectFit: 'cover', objectPosition: 'right center', display: 'block' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '10%' }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, color: 'white', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 20, letterSpacing: '0.06em', marginBottom: 4 }}>T2</span>
                          <svg width="12" height="18" viewBox="0 0 12 18"><line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/><polygon points="6,18 2,11 10,11" fill="rgba(255,255,255,0.5)"/></svg>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '0.85rem 1.1rem 1rem', borderTop: '1px solid rgba(13,59,46,0.08)' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: G.green, marginBottom: 5 }}>Same brain slice, different MRI contrast</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.65, color: G.muted }}>T1 and T2 are different ways MRI signal can be encoded and reconstructed. The anatomy is related, but the contrast changes depending on how the signal is processed.</p>
                    </div>
                  </div>

                  {/* Figure 2: Sparse signal */}
                  <div style={{ background: G.bg, border: '1px solid rgba(13,59,46,0.12)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#eeecea', flex: '1 1 0', minHeight: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem' }}>
                      <ExpandableImage
                        src="/kode-brain.png"
                        alt="Sparse k-space signal"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '0.85rem 1.1rem 1rem', borderTop: '1px solid rgba(13,59,46,0.08)' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: G.green, marginBottom: 5 }}>Finding a small hidden signal</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.65, color: G.muted }}>This experiment looks for small signal patterns that may become harder to notice once raw MRI data is converted into pixels.</p>
                    </div>
                  </div>
                </div>

                {/* Takeaway */}
                <div style={{ marginTop: '2rem', marginBottom: '0.75rem', padding: '1.3rem 1.5rem', background: 'rgba(13,59,46,0.04)', border: '1px solid rgba(13,59,46,0.1)', borderRadius: 8 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: G.lt, marginBottom: 8 }}>Takeaway</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, lineHeight: 1.75, color: G.dark, fontStyle: 'italic' }}>
                    KODE asks whether MRI intelligence should begin earlier: not only after the image is reconstructed, but in the signal space where MRI data first takes shape.
                  </p>
                </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </ProjectBlock>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── ContactSection ──────────────────────────────────────────────────────────
function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await emailjs.send(
        'service_y7pjsod',
        'template_lpd9377',
        {
          name: formData.name,
          title: formData.email,
          message: formData.message,
        },
        'tCf9vDqs4rEv1zQ31'
      )
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Try emailing directly at nadiapriyam21@gmail.com')
    } finally {
      setSending(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 3,
    padding: '12px 14px',
    color: G.bg,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  }

  return (
    <section id="contact" style={{ background: `linear-gradient(155deg, ${G.dark} 0%, ${G.green} 100%)`, padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <FadeUp>
          <p style={{ ...eyebrowStyle, color: G.lt }}>Contact</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: G.bg, lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Let's work on something that matters.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'rgba(250,244,232,0.65)', marginBottom: '2rem' }}>
            Whether you're working on clinical tools, research infrastructure, or something that doesn't have a name yet — I'm interested.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {[
              { label: 'GitHub', href: 'https://github.com/nadiapriyam' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nadia-priyam-b306b71a9/' },
              { label: 'Email', href: 'mailto:nadiapriyam21@gmail.com' },
              { label: 'Resume', href: '/resume.pdf', target: '_blank' },
            ].map(({ label, href, target }) => (
              <a
                key={label}
                href={href}
                target={target}
                rel={target ? 'noopener noreferrer' : undefined}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: 'rgba(250,244,232,0.55)', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = G.lt)}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(250,244,232,0.55)')}
              >
                ↗ {label}
              </a>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 280, gap: '1rem' }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: 36, color: G.lt }}
                >
                  ✦
                </motion.div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: G.bg, textAlign: 'center' }}>Message sent.</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(250,244,232,0.55)', textAlign: 'center' }}>I'll get back to you soon.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <input type="text" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
                <input type="email" placeholder="Your email" required value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} style={inputStyle} />
                <textarea placeholder="What are you working on?" required rows={5} value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                {error && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#f87171', margin: 0 }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 3, background: sending ? 'rgba(82,184,136,0.5)' : G.lt, color: G.dark, border: 'none', cursor: sending ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', alignSelf: 'flex-start', transition: 'background 0.2s' }}
                >
                  {sending ? 'Sending...' : 'Send message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>

      <div style={{ maxWidth: 1280, margin: '4rem auto 0', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: 'rgba(250,244,232,0.3)' }}>NP</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(250,244,232,0.25)', letterSpacing: '0.04em' }}>© 2025 Nadia Priyam</span>
      </div>
    </section>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2.5,
        transformOrigin: '0%',
        scaleX,
        background: `linear-gradient(90deg, ${G.green}, ${G.lt})`,
        zIndex: 200,
      }}
    />
  )
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ContactSection />
      </main>
    </>
  )
}
