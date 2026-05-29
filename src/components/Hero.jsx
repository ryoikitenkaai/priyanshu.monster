import React from 'react';
import Marquee from './Marquee';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Hero introduction">

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── MAIN SPLIT ── */}
      <div className="hero__body">

        {/* LEFT — typographic block */}
        <div className="hero__left">

          {/* ════════════════════════════════════════
              DECORATIVE BACKGROUND LAYER
              Fills the empty top-left void
              ════════════════════════════════════════ */}
          <div className="hero__deco" aria-hidden="true">

            {/* Ghost watermark — "PURE CREATIVITY" */}
            <span className="hero__watermark">PURE<br/>CREATIVITY</span>

            {/* Fine line SVG graphic — blueprint/technical feel */}
            <svg
              className="hero__deco-svg"
              viewBox="0 0 560 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizontal rule grid — 8 lines */}
              {[40, 80, 120, 160, 200, 240, 280, 320].map((y) => (
                <line key={y} x1="0" y1={y} x2="560" y2={y}
                  stroke="#0D0D0D" strokeWidth="0.4" strokeOpacity="0.1" />
              ))}

              {/* Vertical rule grid — 6 lines */}
              {[80, 160, 240, 320, 400, 480].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="340"
                  stroke="#0D0D0D" strokeWidth="0.4" strokeOpacity="0.1" />
              ))}

              {/* Top-left crosshair / reticle */}
              <circle cx="80" cy="80" r="24"
                stroke="#0D0D0D" strokeWidth="0.8" strokeOpacity="0.18" />
              <circle cx="80" cy="80" r="4"
                stroke="#2C5F2E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              <line x1="56" y1="80" x2="104" y2="80"
                stroke="#0D0D0D" strokeWidth="0.8" strokeOpacity="0.22" />
              <line x1="80" y1="56" x2="80" y2="104"
                stroke="#0D0D0D" strokeWidth="0.8" strokeOpacity="0.22" />
              {/* Reticle tick marks */}
              <line x1="80" y1="48" x2="80" y2="54"
                stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.18" />
              <line x1="80" y1="106" x2="80" y2="112"
                stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.18" />
              <line x1="48" y1="80" x2="54" y2="80"
                stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.18" />
              <line x1="106" y1="80" x2="112" y2="80"
                stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.18" />

              {/* Diagonal accent line — top-right area */}
              <line x1="280" y1="20" x2="480" y2="140"
                stroke="#2C5F2E" strokeWidth="0.6" strokeOpacity="0.15" />

              {/* Measurement bracket — top */}
              <line x1="160" y1="24" x2="400" y2="24"
                stroke="#0D0D0D" strokeWidth="0.7" strokeOpacity="0.14" />
              <line x1="160" y1="18" x2="160" y2="30"
                stroke="#0D0D0D" strokeWidth="0.7" strokeOpacity="0.14" />
              <line x1="400" y1="18" x2="400" y2="30"
                stroke="#0D0D0D" strokeWidth="0.7" strokeOpacity="0.14" />

              {/* Small label: 240px */}
              <text x="268" y="20" fontFamily="monospace" fontSize="7"
                fill="#0D0D0D" fillOpacity="0.22" textAnchor="middle">
                240PX
              </text>

              {/* Coordinate labels */}
              <text x="14" y="46" fontFamily="monospace" fontSize="7"
                fill="#0D0D0D" fillOpacity="0.2">
                X:0 Y:0
              </text>
              <text x="490" y="46" fontFamily="monospace" fontSize="7"
                fill="#0D0D0D" fillOpacity="0.2" textAnchor="end">
                W:560
              </text>
              <text x="14" y="336" fontFamily="monospace" fontSize="7"
                fill="#0D0D0D" fillOpacity="0.2">
                H:340
              </text>

              {/* Bottom-right small accent box */}
              <rect x="440" y="270" width="80" height="44"
                stroke="#0D0D0D" strokeWidth="0.6" strokeOpacity="0.14" />
              <line x1="440" y1="283" x2="520" y2="283"
                stroke="#0D0D0D" strokeWidth="0.6" strokeOpacity="0.1" />
              <text x="448" y="279" fontFamily="monospace" fontSize="6"
                fill="#2C5F2E" fillOpacity="0.5">
                PRIYANSHU.MONSTER
              </text>
              <text x="448" y="295" fontFamily="monospace" fontSize="6"
                fill="#0D0D0D" fillOpacity="0.2">
                BUILD: PROD
              </text>
              <text x="448" y="307" fontFamily="monospace" fontSize="6"
                fill="#0D0D0D" fillOpacity="0.2">
                VER: 2026.1
              </text>

              {/* Connector lines from crosshair to text area */}
              <line x1="104" y1="80" x2="240" y2="240"
                stroke="#0D0D0D" strokeWidth="0.5" strokeOpacity="0.08"
                strokeDasharray="4 6" />
              <line x1="80" y1="104" x2="80" y2="280"
                stroke="#0D0D0D" strokeWidth="0.5" strokeOpacity="0.08"
                strokeDasharray="4 6" />

              {/* Green accent dot cluster — right side */}
              <circle cx="480" cy="80" r="2" fill="#2C5F2E" fillOpacity="0.25" />
              <circle cx="496" cy="80" r="2" fill="#2C5F2E" fillOpacity="0.18" />
              <circle cx="512" cy="80" r="2" fill="#2C5F2E" fillOpacity="0.12" />
            </svg>
          </div>
          {/* ════════════════════════════════════════ */}

          {/* ── QUOTE — pinned top ── */}
          <div className="hero__quote-block">
            <span className="hero__quote-mark">"</span>
            <div className="hero__quote-text">
              <em>Pure</em><br />Creativity
            </div>
          </div>

          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Freelance Developer · Full-Stack & Cloud
          </span>

          <h1 className="hero__name">
            <span className="hero__name-row">PRIYANSHU</span>
            <span className="hero__name-row hero__name-outline">KUMAR</span>
          </h1>

          <p className="hero__sub">
            Cloud infrastructure · Backend systems · Full-stack web
          </p>

          <div className="hero__actions">
            <a href="#contact" className="hero__btn-primary">
              Start a Project →
            </a>
            <a href="#work" className="hero__btn-ghost">
              View Work
            </a>
          </div>
        </div>

        {/* RIGHT — technical blueprint graphic */}
        <div className="hero__right" aria-hidden="true">
          <div className="hero__grid-bg" />
          <div className="hero__graphic-wrap">
            <img
              src="/images/hero-graphic.png"
              alt=""
              className="hero__graphic"
            />
          </div>
          <span className="hero__corner hero__corner--tl">SYS.ARCH</span>
          <span className="hero__corner hero__corner--br">REV.03</span>
        </div>

      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className="hero__strip">
        <div className="hero__stat">
          <b className="hero__stat-n">3+</b>
          <span className="hero__stat-l">Yrs Active</span>
        </div>
        <span className="hero__vr" aria-hidden="true" />
        <div className="hero__stat">
          <b className="hero__stat-n">10+</b>
          <span className="hero__stat-l">Projects Shipped</span>
        </div>
        <span className="hero__vr" aria-hidden="true" />
        <div className="hero__stat">
          <b className="hero__stat-n">2</b>
          <span className="hero__stat-l">Startups</span>
        </div>
        <span className="hero__vr hero__vr--push" aria-hidden="true" />
        <div className="hero__tags">
          {['Azure','KVM','Docker','FastAPI','React','PostgreSQL'].map(t => (
            <span key={t} className="hero__tag">{t}</span>
          ))}
        </div>
      </div>

    </section>
  );
}
