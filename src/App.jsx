import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    if (!dot) return;

    const onMove = (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    };
    const onEnter = () => dot.classList.add('hovered');
    const onLeave = () => dot.classList.remove('hovered');

    document.addEventListener('mousemove', onMove);

    const attachHover = () => {
      document.querySelectorAll('a, button, .svc-row, .work-item').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attachHover();

    // IntersectionObserver — scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* ── GLOBAL BACKGROUND LAYER ── */}
      <div className="bg-canvas" aria-hidden="true">
        {/* Soft ambient gradient orbs */}
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        {/* Watermark */}
        <div className="bg-watermark">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="bg-watermark__text">Peak Creativity</span>
          ))}
        </div>
      </div>

      <div id="cursor-dot" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default App;
