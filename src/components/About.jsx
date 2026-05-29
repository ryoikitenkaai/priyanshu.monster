import React from 'react';
import './About.css';

const STATS = [
  { n: '3+',  l: 'Years',    sub: 'ACTIVE'      },
  { n: '10+', l: 'Projects', sub: 'DELIVERED'   },
  { n: '3',   l: 'Domains', sub: 'MASTERED'    },
];

const SKILLS = [
  'Python', 'FastAPI', 'React', 'Azure', 'KVM',
  'Docker', 'PostgreSQL', 'Nginx', 'Celery', 'Linux',
  'Terraform', 'CI/CD', 'Pen Testing', 'OSINT', 'AI/ML',
];

const TEAMS = [
  {
    id: '01',
    tag: 'DEV & CLOUD',
    name: 'Priyanshu Kumar',
    desc: 'Full-stack development, cloud infrastructure on Azure & KVM, backend architecture, DevOps pipelines, and production-grade deployment.',
    color: 'blue',
    lead: true,
  },
  {
    id: '02',
    tag: 'CYBER TEAM',
    name: 'Security & Networks',
    desc: 'Penetration testing, vulnerability research, network hardening, OSINT, and security audits across infrastructure and applications.',
    color: 'red',
  },
  {
    id: '03',
    tag: 'AI TEAM',
    name: 'Intelligent Systems',
    desc: 'AI-driven automation, video pipelines, ML model integration, and intelligent workflow engines built with Python and modern AI tooling.',
    color: 'green',
  },
];

/* Inline terminal graphic */
function TerminalGraphic() {
  const lines = [
    { k: 'const', rest: ' team = {' },
    { indent: true, k: 'cyber:', rest: " 'Security & Networks'," },
    { indent: true, k: 'ai:', rest: " 'Intelligent Systems'," },
    { indent: true, k: 'cloud:', rest: " 'Dev & Cloud'," },
    { indent: true, k: 'stack:', rest: " ['Python', 'React', 'FastAPI']," },
    { indent: true, k: 'degree:', rest: " 'B.Tech CSE'," },
    { indent: true, k: 'available:', rest: ' true,' },
    { k: '};', rest: '' },
    { k: '', rest: '' },
    { k: '// Build.', rest: ' Scale. Ship.' },
  ];

  return (
    <div className="about__terminal" aria-label="Code representation of the team profile">
      {/* title bar */}
      <div className="about__terminal-bar">
        <span className="about__terminal-dot about__terminal-dot--r" />
        <span className="about__terminal-dot about__terminal-dot--y" />
        <span className="about__terminal-dot about__terminal-dot--g" />
        <span className="about__terminal-title">team.js</span>
      </div>
      {/* code body */}
      <div className="about__terminal-body">
        {lines.map((l, i) => (
          <div key={i} className={`about__code-line${l.indent ? ' about__code-line--indent' : ''}`}>
            <span className="about__code-num">{(i + 1).toString().padStart(2, '0')}</span>
            <span className="about__code-key">{l.k}</span>
            <span className="about__code-rest">{l.rest}</span>
          </div>
        ))}
        {/* blinking cursor */}
        <div className="about__code-line about__code-line--cursor">
          <span className="about__code-num">11</span>
          <span className="about__cursor" aria-hidden="true">▋</span>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="about border-thick-top border-thick-bottom" id="about" aria-label="About the team">
      <div className="section-inner">

        {/* Eyebrow */}
        <div className="about__eyebrow reveal">
          <span className="section-eyebrow">04 — About the Team</span>
          <span className="about__eyebrow-rule" aria-hidden="true" />
        </div>

        <div className="about__grid">

          {/* LEFT — terminal block */}
          <div className="about__col-left">
            <TerminalGraphic />

            <blockquote className="about__quote">
              We don't just ship —<br />we build systems<br />that last.
            </blockquote>
          </div>

          {/* RIGHT — bio + skills + stats */}
          <div className="about__col-right">
            <p className="about__bio">
              We're a focused team of three disciplines — Cybersecurity, Artificial Intelligence,
              and Cloud &amp; Development. Together we design, secure, and ship production-grade
              systems that are reliable, observable, and built to scale.
            </p>
            <p className="about__bio">
              Led by <strong>Priyanshu Kumar</strong> on the Dev &amp; Cloud side, our work spans
              multi-tenant platforms on Azure, AI-powered automation pipelines, self-hosted private
              clouds with KVM, and security-first infrastructure hardened by the Cyber team.
            </p>

            <div className="about__skills" role="list" aria-label="Technical skills">
              {SKILLS.map((s) => (
                <span key={s} className="about__skill" role="listitem">{s}</span>
              ))}
            </div>

            <div className="about__stats">
              {STATS.map((st) => (
                <div key={st.sub} className="about__stat">
                  <span className="about__stat-sub">{st.sub}</span>
                  <span className="about__stat-n">{st.n}</span>
                  <span className="about__stat-l">{st.l}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── TEAM CREDITS ── */}
        <div className="about__teams">
          <div className="about__teams-label">
            <span className="section-eyebrow">The Team</span>
            <span className="about__eyebrow-rule" aria-hidden="true" />
          </div>
          <div className="about__teams-grid">
            {TEAMS.map((t) => (
              <div key={t.id} className={`about__team-card about__team-card--${t.color}${t.lead ? ' about__team-card--lead' : ''}`}>
                <div className="about__team-header">
                  <span className="about__team-id section-eyebrow">{t.id}</span>
                  <span className="about__team-tag">{t.tag}</span>
                  {t.lead && <span className="about__team-lead-badge">Lead</span>}
                </div>
                <h3 className="about__team-name">{t.name}</h3>
                <p className="about__team-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
