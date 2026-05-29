import React, { useState } from 'react';
import './Services.css';

const SERVICES = [
  {
    id: '01',
    label: 'Cloud Infrastructure',
    title: 'Cloud Infrastructure',
    descriptor: 'Azure virtual machines, KVM hypervisors, VPC networking, IAM policies, storage tiers, and Terraform-based infrastructure-as-code at scale.',
    tech: ['Azure', 'KVM', 'Terraform', 'Networking', 'IAM'],
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="svc__icon" aria-hidden="true">
        <path d="M7 31a9 9 0 0 1 0-18h1.5A13 13 0 0 1 35 20h1.5a7 7 0 0 1 0 14H7Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M22 35v-9M19 29l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
      </svg>
    ),
  },
  {
    id: '02',
    label: 'Full-Stack Development',
    title: 'Full-Stack Development',
    descriptor: 'React frontends with FastAPI backends. PostgreSQL databases, JWT auth, REST & WebSocket APIs built for production from the first commit.',
    tech: ['React', 'FastAPI', 'PostgreSQL', 'REST', 'WebSocket'],
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="svc__icon" aria-hidden="true">
        <rect x="5" y="7" width="34" height="24" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M14 37h16M22 31v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
        <path d="M16 19l-4 4 4 4M28 19l4 4-4 4M23 17l-4 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
      </svg>
    ),
  },
  {
    id: '03',
    label: 'DevOps & Deployment',
    title: 'DevOps & Deployment',
    descriptor: 'Docker containerisation, GitHub Actions CI/CD pipelines, Nginx reverse-proxying, SSL automation, and zero-downtime blue/green deploys.',
    tech: ['Docker', 'CI/CD', 'Nginx', 'GitHub Actions', 'SSL'],
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="svc__icon" aria-hidden="true">
        <circle cx="22" cy="22" r="9" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="22" cy="22" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M22 5v5M22 34v5M5 22h5M34 22h5M9.4 9.4l3.5 3.5M31.1 31.1l3.5 3.5M9.4 34.6l3.5-3.5M31.1 12.9l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
      </svg>
    ),
  },
  {
    id: '04',
    label: 'Backend Architecture',
    title: 'Backend Architecture',
    descriptor: 'Microservice design, multi-tenant RBAC systems, Celery task queues, connection pooling, and observability-first production systems.',
    tech: ['Microservices', 'RBAC', 'Celery', 'Multi-tenancy', 'Observability'],
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="svc__icon" aria-hidden="true">
        <rect x="5" y="9"  width="34" height="7" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="5" y="19" width="34" height="7" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="5" y="29" width="34" height="7" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="35" cy="12.5" r="1.5" fill="currentColor"/>
        <circle cx="35" cy="22.5" r="1.5" fill="currentColor"/>
        <circle cx="35" cy="32.5" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: '05',
    label: 'Cybersecurity',
    title: 'Cybersecurity',
    descriptor: 'Penetration testing, vulnerability assessment, network hardening, OSINT, and security audits. We identify threats before they find you.',
    tech: ['Pen Testing', 'OSINT', 'Network Hardening', 'Nmap', 'Burp Suite'],
    icon: (
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="svc__icon" aria-hidden="true">
        <path d="M22 5L7 12v10c0 9 6.5 17 15 19 8.5-2 15-10 15-19V12L22 5Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M16 22l4 4 8-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"/>
      </svg>
    ),
  },
];

export default function Services() {
  const [open, setOpen] = useState(null);

  return (
    <section className="services border-thick-top" id="services" aria-label="Services">
      <div className="section-inner">

        {/* Header row */}
        <div className="services__header reveal">
          <span className="section-eyebrow">02 — What We Do</span>
          <h2 className="section-heading services__heading">Services</h2>
        </div>

        {/* Services index list */}
        <div className="services__list" role="list">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.id}
              className={`svc-row${open === i ? ' svc-row--open' : ''}`}
              role="listitem"
            >
              {/* Row header */}
              <button
                className="svc-row__head"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-label={svc.title}
              >
                <span className="svc-row__id section-eyebrow">{svc.id}</span>
                {svc.icon}
                <span className="svc-row__title">{svc.title}</span>
                <span className="svc-row__plus" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>

              {/* Expandable body */}
              <div
                className="svc-row__body"
                style={{ maxHeight: open === i ? '220px' : '0' }}
                aria-hidden={open !== i}
              >
                <div className="svc-row__body-inner">
                  <p className="svc-row__desc">{svc.descriptor}</p>
                  <div className="svc-row__tech">
                    {svc.tech.map((t) => (
                      <span key={t} className="svc-row__tech-tag">{t}</span>
                    ))}
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
