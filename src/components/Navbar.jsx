import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        <span className="navbar__brand">Portfolio / 2026</span>
        <nav className="navbar__nav" aria-label="Primary navigation">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
          ))}
          <a href="mailto:hello@priyanshu.monster" className="navbar__cta" aria-label="Hire Priyanshu">
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  );
}
