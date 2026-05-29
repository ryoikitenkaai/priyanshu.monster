import React, { useState } from 'react';
import './Work.css';

const PROJECTS = [
  {
    id:   'PRJ/01',
    year: '2024',
    name: 'CRM Platform',
    short: 'Multi-tenant SaaS · AI Automation · WhatsApp',
    tech: ['Azure', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'Celery', 'WhatsApp API', 'AI/ML'],
    image: '/images/project-crm.png',
    href:  'https://github.com/priyanshu-kumar',
    role:  'Lead Developer & Cloud Architect',
    detail: [
      'Enterprise-grade multi-tenant CRM built on Azure, serving multiple organisations from a single deployment with complete data isolation via row-level RBAC.',
      'Integrated AI assistant that auto-suggests follow-up actions, drafts outreach scripts, and flags at-risk leads. WhatsApp Business API enables two-way messaging directly within the contact timeline.',
    ],
  },
  {
    id:   'PRJ/02',
    year: '2024',
    name: 'Vrihi',
    short: 'AI Video Generator · Python · Manim · FFmpeg',
    tech: ['Python', 'Manim', 'FFmpeg', 'Stable Diffusion', 'Whisper', 'CLI', 'AI/ML'],
    image: '/images/project-vrihi.png',
    href:  'https://github.com/priyanshu-kumar',
    role:  'AI Pipeline Engineer',
    detail: [
      'End-to-end AI video generation pipeline that converts a topic or script into a fully rendered, narrated educational video — no manual editing required.',
      'Uses Manim for mathematical animations, Stable Diffusion for scene visuals, and Whisper for TTS narration. FFmpeg encodes the final output at broadcast quality.',
    ],
  },
  {
    id:   'PRJ/03',
    year: '2023',
    name: 'CloudStack Lab',
    short: 'Private Cloud · KVM · Apache CloudStack · Ubuntu',
    tech: ['KVM', 'Apache CloudStack', 'Ubuntu', 'NFS', 'Networking', 'Terraform'],
    image: '/images/project-cloudstack.png',
    href:  'https://github.com/priyanshu-kumar',
    role:  'Infrastructure Architect',
    detail: [
      'Self-hosted private cloud built from bare metal — two KVM hypervisor nodes managed by Apache CloudStack, with NFS shared storage and full VLAN network segmentation.',
      'Provisioned infrastructure-as-code via Terraform, supporting live VM migration, snapshot management, and isolated tenant networking — a full AWS-like stack, on-premises.',
    ],
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
                aria-label={`${p.name} — ${p.short}`}
              >
                <span className="work-row__id section-eyebrow">{p.id}</span>
                <span className="work-row__name">{p.name}</span>
                <span className="work-row__desc">{p.short}</span>
                <span className="work-row__year">{p.year}</span>
                <span className="work-row__tog" aria-hidden="true">
                  {active === i ? '−' : '+'}
                </span>
              </button>

              {/* ── Panel ── */}
              <div
                className="work-panel"
                style={{ maxHeight: active === i ? '520px' : '0' }}
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
                    <span className="work-panel__id section-eyebrow">{p.id} — {p.year}</span>
                    <h3 className="work-panel__title">{p.name}</h3>
                    <p className="work-panel__role">
                      <span className="work-panel__role-label">Role:</span> {p.role}
                    </p>
                    {p.detail.map((d, di) => (
                      <p key={di} className="work-panel__desc">{d}</p>
                    ))}
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
