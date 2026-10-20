import Trace from "./components/Trace";
import Contact from "./components/Contact";
import { profile, projects, skills } from "./data";

const nav = [
  { href: "#trace", label: "Timeline" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <a className="mark" href="#top" aria-label={`${profile.name}, home`}>MP</a>
        <nav aria-label="Sections">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <h1>
            <span>Mahesh</span>
            <span>Pulivarthi</span>
          </h1>
          <div className="hero-copy">
            <p className="hero-role">{profile.role}</p>
            <p className="hero-intro">{profile.intro}</p>
            <ul className="hero-links">
              <li><a className="btn" href="#contact">Get in touch</a></li>
              <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            </ul>
          </div>
        </section>

        <section id="trace" className="block">
          <div className="block-head">
            <h2>Timeline</h2>
            <p>Read it like a trace: each bar is a span of my career. Select one to see what happened inside it.</p>
          </div>
          <Trace />
          <ul className="legend" aria-label="Legend">
            <li className="lg-work">Work</li>
            <li className="lg-edu">Education</li>
            <li className="lg-project">Project</li>
          </ul>
        </section>

        <section id="projects" className="block">
          <div className="block-head">
            <h2>Projects</h2>
            <p>Things I build to go deeper on systems: pipelines, ORMs, and raw performance.</p>
          </div>
          <ul className="projects">
            {projects.map((p) => (
              <li key={p.name}>
                <a href={p.link} target="_blank" rel="noreferrer">
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-year">{p.year}</span>
                  <span className="proj-summary">{p.summary}</span>
                  <span className="proj-stack">{p.stack.join(", ")}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" className="block">
          <div className="block-head">
            <h2>Toolbox</h2>
          </div>
          <dl className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className="block">
          <div className="block-head">
            <h2>Get in touch</h2>
            <p>Want to talk about a role, a project or a gnarly backend problem? Send a message here or email me directly.</p>
          </div>
          <Contact />
        </section>
      </main>

      <footer className="foot">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href={profile.github} target="_blank" rel="noreferrer">Source on GitHub</a>
      </footer>
    </>
  );
}
