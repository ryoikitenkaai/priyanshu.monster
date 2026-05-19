import React, { useState } from 'react';
import './Work.css';

const PROJECTS = [
  {
    id: 'PRJ/01',
    year: '2024',
    name: 'crm_az',
    descriptor: 'Multi-tenant CRM · Azure · FastAPI · React',
    tech: ['Azure', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'Celery'],
    image: '/images/project-crm.png',
    href: 'https://github.com/priyanshu-kumar',
  },
  {
    id: 'PRJ/02',
    year: '2024',
    name: 'Vrihi',
    descriptor: 'AI Video Generator · Python · Manim · FFmpeg',
    tech: ['Python', 'Manim', 'FFmpeg', 'AI/ML', 'CLI'],
    image: '/images/project-vrihi.png',
    href: 'https://github.com/priyanshu-kumar',
  },
  {
    id: 'PRJ/03',
    year: '2023',
    name: 'CloudStack Lab',
    descriptor: 'KVM Homelab · Apache CloudStack · Ubuntu',
    tech: ['KVM', 'Apache CloudStack', 'Ubuntu', 'Networking', 'NFS'],
    image: '/images/project-cloudstack.png',
    href: 'https://github.com/priyanshu-kumar',
  },
];

export default function Work() {
  const [active, setActive] = useState(null);

  return (
    <section className="work border-thick-top" id="work" aria-label="Selected work">
      <div className="section-inner">

        <div className="work__header reveal">
          <span className="section-eyebrow">03 — Selected Work</span>
          <h2 className="section-heading work__heading">Projects</h2>
        </div>

        <div className="work__list" role="list">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`work-item${active === i ? ' work-item--open' : ''}`}
              role="listitem"
            >
              {/* ── Row ── */}
              <button
                className="work-row"
                onClick={() => setActive(active === i ? null : i)}
                aria-expanded={active === i}
                aria-label={`${p.name} — ${p.descriptor}`}
              >
                <span className="work-row__id section-eyebrow">{p.id}</span>
                <span className="work-row__name">{p.name}</span>
                <span className="work-row__desc">{p.descriptor}</span>
                <span className="work-row__year">{p.year}</span>
                <span className="work-row__tog" aria-hidden="true">
                  {active === i ? '−' : '+'}
                </span>
              </button>

              {/* ── Panel ── */}
              <div
                className="work-panel"
                style={{ maxHeight: active === i ? '400px' : '0' }}
                aria-hidden={active !== i}
              >
                <div className="work-panel__inner">
                  {/* Left — image */}
                  <div className="work-panel__img-wrap">
                    <img
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      className="work-panel__img"
                      loading="lazy"
                    />
                  </div>
                  {/* Right — details */}
                  <div className="work-panel__details">
                    <span className="work-panel__id section-eyebrow">{p.id}</span>
                    <h3 className="work-panel__title">{p.name}</h3>
                    <p className="work-panel__desc">{p.descriptor}</p>
                    <div className="work-panel__tech">
                      {p.tech.map((t) => (
                        <span key={t} className="work-panel__tag">{t}</span>
                      ))}
                    </div>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-panel__link"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
