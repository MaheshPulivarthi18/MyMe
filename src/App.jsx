import Trace from "./components/Trace";
import Contact from "./components/Contact";
import SystemScene from "./components/SystemScene";
import Terminal from "./components/Terminal";
import { profile, builds, guides, more, skills } from "./data";

const nav = [
  { href: "#built", label: "Built" },
  { href: "#guides", label: "Guides" },
  { href: "#background", label: "Background" },
  { href: "#resume", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

function Flow({ steps, label }) {
  return (
    <ol className="flow" aria-label={`How ${label} works`}>
      {steps.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  );
}

export default function App() {
  return (
    <>
      <SystemScene />
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
          <div className="hero-side">
            <h1>
              <span>Mahesh</span>
              <span>Pulivarthi</span>
            </h1>
            <div className="hero-copy">
              <p className="hero-role">{profile.role}</p>
              <p className="hero-intro">{profile.intro}</p>
              <ul className="hero-links">
                <li><a className="btn" href="#built">See what I&apos;ve built</a></li>
                <li><a className="btn btn-ghost" href={profile.resume} download>Download resume</a></li>
                <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
                <li><a href={`mailto:${profile.email}`}>Email</a></li>
              </ul>
            </div>
          </div>
          <Terminal />
        </section>

        <section id="built" className="block">
          <div className="block-head">
            <p className="path" aria-hidden="true">$ cd ~/built</p>
            <h2>Things I&apos;ve built</h2>
            <p>Libraries and systems I designed and wrote end to end. Each line shows how data moves through it.</p>
          </div>
          <div className="builds">
            {builds.map((b) => (
              <article className="build" key={b.name}>
                <header className="build-head">
                  <h3>
                    <a href={b.link} target="_blank" rel="noreferrer">{b.name}</a>
                  </h3>
                  <p className="build-kind">{b.kind}</p>
                </header>
                <Flow steps={b.flow} label={b.name} />
                <div className="build-body">
                  <p className="build-summary">{b.summary}</p>
                  <ul className="build-points">
                    {b.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <p className="build-meta">
                    <span>{b.stack.join(", ")}</span>
                    <a href={b.link} target="_blank" rel="noreferrer">Source on GitHub</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="guides" className="block">
          <div className="block-head">
            <p className="path" aria-hidden="true">$ cd ~/guides</p>
            <h2>Guides I&apos;ve written</h2>
            <p>I learn by building in small steps and writing each one down, so others can follow the same path.</p>
          </div>
          <ul className="guides">
            {guides.map((g) => (
              <li key={g.name}>
                <a href={g.link} target="_blank" rel="noreferrer">
                  <span className="guide-name">{g.name}</span>
                  <span className="guide-summary">{g.summary}</span>
                  <span className="guide-progress">{g.progress}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="more">
            <h3>Earlier projects</h3>
            <ul>
              {more.map((m) => (
                <li key={m.name}>
                  <a href={m.link} target="_blank" rel="noreferrer">{m.name}</a>
                  <span>{m.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="background" className="block">
          <div className="block-head">
            <p className="path" aria-hidden="true">$ cd ~/background</p>
            <h2>Background</h2>
            <p>Where I&apos;ve worked and studied, drawn like a trace. Select a span to open it.</p>
          </div>
          <Trace />
          <dl className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="resume" className="block">
          <div className="resume">
            <div>
              <p className="path" aria-hidden="true">$ cat resume.pdf</p>
              <h2>Resume</h2>
              <p>One page: experience, projects, skills and achievements.</p>
            </div>
            <div className="resume-actions">
              <a className="btn" href={profile.resume} download>Download PDF</a>
              <a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer">Open in browser</a>
            </div>
          </div>
        </section>

        <section id="contact" className="block">
          <div className="block-head">
            <p className="path" aria-hidden="true">$ ./contact.sh</p>
            <h2>Say hello</h2>
            <p>Want to talk about a project, a role or a gnarly backend problem? Send a message here or email me directly.</p>
          </div>
          <Contact />
        </section>
      </main>

      <footer className="foot">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href="https://github.com/MaheshPulivarthi18/MyMe" target="_blank" rel="noreferrer">Source on GitHub</a>
      </footer>
    </>
  );
}
