import React from 'react';
import './About.css';

const STATS = [
  { n: '3+',  l: 'Years',    sub: 'EXPERIENCE'  },
  { n: '10+', l: 'Projects', sub: 'DELIVERED'   },
  { n: '2',   l: 'Startups', sub: 'CONTRIBUTED' },
];

const SKILLS = [
  'Python', 'FastAPI', 'React', 'Azure', 'KVM',
  'Docker', 'PostgreSQL', 'Nginx', 'Celery', 'Linux',
  'Terraform', 'Ubuntu', 'CI/CD',
];

/* Inline terminal graphic — real code lines */
function TerminalGraphic() {
  const lines = [
    { k: 'const', rest: ' priyanshu = {' },
    { indent: true, k: 'role:', rest: " 'Freelance Developer'," },
    { indent: true, k: 'stack:', rest: " ['Python', 'React', 'FastAPI']," },
    { indent: true, k: 'cloud:', rest: " ['Azure', 'KVM', 'Docker']," },
    { indent: true, k: 'degree:', rest: " 'B.Tech CSE — LPU'," },
    { indent: true, k: 'available:', rest: ' true,' },
    { k: '};', rest: '' },
    { k: '', rest: '' },
    { k: '// Build.', rest: ' Scale. Ship.' },
  ];

  return (
    <div className="about__terminal" aria-label="Code representation of Priyanshu's profile">
      {/* title bar */}
      <div className="about__terminal-bar">
        <span className="about__terminal-dot about__terminal-dot--r" />
        <span className="about__terminal-dot about__terminal-dot--y" />
        <span className="about__terminal-dot about__terminal-dot--g" />
        <span className="about__terminal-title">profile.js</span>
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
          <span className="about__code-num">10</span>
          <span className="about__cursor" aria-hidden="true">▋</span>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="about border-thick-top border-thick-bottom" id="about" aria-label="About Priyanshu">
      <div className="section-inner">

        {/* Eyebrow */}
        <div className="about__eyebrow reveal">
          <span className="section-eyebrow">04 — About Me</span>
          <span className="about__eyebrow-rule" aria-hidden="true" />
        </div>

        <div className="about__grid">

          {/* LEFT — terminal block */}
          <div className="about__col-left">
            <TerminalGraphic />

            <blockquote className="about__quote">
              Building systems<br />that scale,<br />not just ship.
            </blockquote>
          </div>

          {/* RIGHT — bio + skills + stats */}
          <div className="about__col-right">
            <p className="about__bio">
              I&apos;m Priyanshu Kumar — a freelance developer and B.Tech CSE graduate
              from Lovely Professional University. I specialise in cloud infrastructure,
              backend systems, and full-stack web applications.
            </p>
            <p className="about__bio">
              I&apos;ve built multi-tenant CRM platforms on Azure, automated AI video pipelines
              with Python and FFmpeg, and self-hosted private clouds using KVM and Apache
              CloudStack. I care deeply about systems that are reliable, observable, and built
              to last — production-ready from commit one.
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
      </div>
    </section>
  );
}
