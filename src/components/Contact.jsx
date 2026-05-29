import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <footer className="contact" id="contact" aria-label="Contact and footer">

      {/* ── HEADER ── */}
      <div className="contact__header reveal">
        <div className="contact__header-inner">
          <span className="section-eyebrow">05 — Contact</span>
          <h2 className="contact__heading">
            Work With
            <br />
            <span className="contact__heading-outline">Our Team.</span>
          </h2>
          <p className="contact__sub">
            Reach out for projects, consulting, or long-term<br />collaborations. Our Cyber, AI &amp; Dev teams are ready.
          </p>
        </div>
        {/* Decorative grid on right */}
        <div className="contact__deco" aria-hidden="true">
          <div className="contact__deco-grid" />
          <div className="contact__deco-box">
            <span className="contact__deco-label">STATUS</span>
            <span className="contact__deco-status">
              <span className="contact__deco-dot" />
              AVAILABLE
            </span>
          </div>
        </div>
      </div>

      {/* ── LINK ROW ── */}
      <div className="contact__links reveal reveal-d2">
        <a
          href="mailto:hello@priyanshu.monster"
          className="contact-link"
          aria-label="Email hello@priyanshu.monster"
        >
          <span className="contact__link-type">Email</span>
          <span className="contact__link-val">hello@priyanshu.monster</span>
          <span className="contact__link-arrow" aria-hidden="true">↗</span>
        </a>

        <span className="contact__link-vr" aria-hidden="true" />

        <a
          href="https://github.com/priyanshu-kumar"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
          aria-label="GitHub @priyanshu-kumar"
        >
          <span className="contact__link-type">GitHub</span>
          <span className="contact__link-val">@priyanshu-kumar</span>
          <span className="contact__link-arrow" aria-hidden="true">↗</span>
        </a>

        <span className="contact__link-vr" aria-hidden="true" />

        <a
          href="mailto:hello@priyanshu.monster"
          className="contact-link contact-link--cta"
          aria-label="Start a project"
        >
          <span className="contact__cta-text">Start a Project →</span>
        </a>
      </div>

      {/* ── FOOTER BAR ── */}
      <div className="contact__footer reveal reveal-d3">
        <span className="contact__footer-name">PRIYANSHU KUMAR © 2026</span>
        <span className="contact__footer-stack">
          Cyber Team · AI Team · Dev &amp; Cloud
        </span>
        <span className="contact__footer-avail">AVAILABLE FOR WORK</span>
      </div>

    </footer>
  );
}
