// A small virtual file system for the terminal, built from src/data.js.
import { profile, interests, builds, guides, more, skills, spans, achievements } from "./data";
import { work, workGroups } from "./work";

export const HOME = "/home/mahesh";

const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">{children}</a>
);

const ym = (v) => (v ? v.replace("-", ".") : "now");

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const file = (body, opts = {}) => ({ type: "file", body, size: opts.size ?? 512, link: opts.link, kind: opts.kind });
const dir = (children) => ({ type: "dir", children });

const size = (v) => JSON.stringify(v).length;

/* ---------- file bodies ---------- */

const Readme = () => (
  <>
    <p className="c-hi"># ~/README.md</p>
    <p>Welcome to Mahesh&apos;s machine. Everything here is a real file you can read.</p>
    <p className="gap">Try:</p>
    <div className="cmd-table">
      {[
        ["ls", "list this folder"],
        ["cat about.txt", "who I am"],
        ["cd projects", "go into a folder, then ls"],
        ["work", "every repo on my GitHub, by topic"],
        ["tree", "see everything at once"],
        ["open resume.pdf", "view my resume"],
        ["mail", "send me a message"],
      ].map(([c, d]) => (
        <p key={c}><span className="c-cmd">{c}</span><span className="c-dim">{d}</span></p>
      ))}
    </div>
    <p className="c-dim gap">Or click files in the explorer, or tap the windows in the bottom bar.</p>
  </>
);

const About = () => (
  <>
    <p><span className="c-hi">{profile.name}</span>, {profile.role.toLowerCase()}.</p>
    <p className="c-dim">{profile.intro}</p>
    <p className="gap c-hi">into lately:</p>
    {interests.map((i) => <p key={i}>  › {i}</p>)}
  </>
);

const Skills = () =>
  skills.map((s) => (
    <p key={s.group} className="kv">
      <span className="c-hi">{s.group.toLowerCase().replace(/ & | /g, "_")}</span>
      <span>{s.items.join(", ")}</span>
    </p>
  ));

const Contact = () => (
  <>
    <p className="kv"><span className="c-hi">email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    <p className="kv"><span className="c-hi">github</span><Ext href={profile.github}>github.com/MaheshPulivarthi18</Ext></p>
    <p className="kv"><span className="c-hi">linkedin</span><Ext href={profile.linkedin}>in/mahesh-pulivarthi</Ext></p>
    <p className="c-dim gap">Or run <span className="c-cmd">mail</span> to send me a message from here.</p>
  </>
);

const Resume = () => (
  <>
    <p>resume.pdf: PDF document, version 1.4, 1 page</p>
    <p className="c-dim">Binary file. Run <span className="c-cmd">open resume.pdf</span> to view it, or <span className="c-cmd">resume</span> to download.</p>
  </>
);

const Project = ({ b }) => (
  <>
    <p className="c-hi"># {b.name}</p>
    <p className="c-dim">{b.kind}</p>
    <p className="gap">{b.summary}</p>
    <p className="gap"><span className="c-hi">## flow</span></p>
    <p className="flow">{b.flow.join("  ─▶  ")}</p>
    <p className="gap"><span className="c-hi">## highlights</span></p>
    {b.points.map((pt) => <p key={pt}>- {pt}</p>)}
    <p className="gap"><span className="c-hi">stack:</span> {b.stack.join(", ")}</p>
    <p><span className="c-hi">source:</span> <Ext href={b.link}>{b.link.replace("https://", "")}</Ext></p>
  </>
);

const Guide = ({ g }) => (
  <>
    <p className="c-hi"># {g.name}</p>
    <p className="c-dim">{g.progress}</p>
    <p className="gap">{g.summary}</p>
    <p className="gap"><span className="c-hi">read:</span> <Ext href={g.link}>{g.link.replace("https://", "")}</Ext></p>
  </>
);

const Earlier = ({ m }) => (
  <>
    <p className="c-hi"># {m.name}</p>
    <p>{m.note}.</p>
    <p className="gap"><span className="c-hi">source:</span> <Ext href={m.link}>{m.link.replace("https://", "")}</Ext></p>
  </>
);

const Valuefy = () => {
  const [root, ...roles] = spans.filter((s) => s.id.startsWith("valuefy"));
  const list = [...roles].reverse();
  return (
    <>
      <p><span className="c-hi">{root.name}</span> <span className="c-dim">{root.where} · {ym(root.start)} → {ym(root.end)}</span></p>
      {list.map((r, i) => {
        const last = i === list.length - 1;
        return (
          <div key={r.id}>
            <p><span className="c-dim">{last ? "└── " : "├── "}</span>{r.name} <span className="c-dim">{ym(r.start)} → {ym(r.end)}</span></p>
            {r.detail.map((d) => (
              <p key={d} className="tree-detail"><span className="c-dim">{last ? "    " : "│   "}</span><span>• {d}</span></p>
            ))}
          </div>
        );
      })}
      {root.detail.map((d) => <p key={d} className="gap c-dim">{d}</p>)}
    </>
  );
};

const College = () => {
  const edu = spans.find((s) => s.id === "edu");
  const fusion = spans.find((s) => s.id === "fusion");
  return (
    <>
      <p><span className="c-hi">{edu.where}</span> <span className="c-dim">{edu.name} · {ym(edu.start)} → {ym(edu.end)}</span></p>
      <p><span className="c-dim">└── </span>{fusion.name}, {fusion.where} <span className="c-dim">{ym(fusion.start)} → {ym(fusion.end)}</span></p>
      {fusion.detail.map((d) => (
        <p key={d} className="tree-detail"><span className="c-dim">{"    "}</span><span>• {d}</span></p>
      ))}
    </>
  );
};

const WorkFile = ({ w }) => (
  <>
    <p className="c-hi"># {w.title}</p>
    <p className="c-dim">{w.lang} · {w.year}</p>
    <p className="gap">{w.summary}</p>
    <p className="gap"><span className="c-hi">## highlights</span></p>
    {w.points.map((pt) => <p key={pt}>- {pt}</p>)}
    <p className="gap"><span className="c-hi">stack:</span> {w.stack.join(", ")}</p>
    <p><span className="c-hi">source:</span> <Ext href={w.repo}>{w.repo.replace("https://", "")}</Ext></p>
    {w.live && <p><span className="c-hi">live:</span> <Ext href={w.live}>{w.live.replace("https://", "")}</Ext></p>}
    {w.extra?.map(([label, url]) => (
      <p key={url}><span className="c-hi">{label}:</span> <Ext href={url}>{url.replace("https://", "")}</Ext></p>
    ))}
  </>
);

export const WorkIndex = () => (
  <>
    {Object.entries(workGroups).map(([g, about]) => (
      <div key={g} className="block">
        <p><span className="c-dir">~/work/{g}/</span> <span className="c-dim"># {about}</span></p>
        {work.filter((w) => w.group === g).map((w) => (
          <p key={w.file} className="work-row">
            <span>{w.file}</span>
            <span className="c-dim">{w.summary.split(/\.\s|:\s/)[0].replace(/\.$/, "")}</span>
          </p>
        ))}
      </div>
    ))}
    <p className="gap c-dim">{work.length} repos. Read one with <span className="c-cmd">cat ~/work/systems/oceanic-postgres-orm.md</span>, or <span className="c-cmd">open</span> it on GitHub.</p>
  </>
);

const Achievements = () => achievements.map((a) => <p key={a}>★ {a}</p>);

/* ---------- the tree ---------- */

export const ROOT = dir({
  "README.md": file(() => <Readme />, { size: 640 }),
  "about.txt": file(() => <About />, { size: size(profile) + size(interests) }),
  "skills.txt": file(() => <Skills />, { size: size(skills) }),
  "contact.txt": file(() => <Contact />, { size: 214 }),
  "resume.pdf": file(() => <Resume />, { size: 48211, link: profile.resume, kind: "pdf" }),
  projects: dir({
    ...Object.fromEntries(builds.map((b) => [`${slug(b.name)}.md`, file(() => <Project b={b} />, { size: size(b), link: b.link })])),
    earlier: dir(
      Object.fromEntries(more.map((m) => [`${slug(m.name)}.md`, file(() => <Earlier m={m} />, { size: size(m), link: m.link })]))
    ),
  }),
  guides: dir(
    Object.fromEntries(
      guides.map((g) => {
        const name = g.link.includes("OpenTelmetry") ? "opentelemetry" : g.link.includes("1billionrow") ? "1brc-nodejs" : slug(g.name);
        return [`${name}.md`, file(() => <Guide g={g} />, { size: size(g), link: g.link })];
      })
    )
  ),
  work: dir(
    Object.fromEntries(
      Object.keys(workGroups).map((g) => [
        g,
        dir(Object.fromEntries(work.filter((w) => w.group === g).map((w) => [w.file, file(() => <WorkFile w={w} />, { size: size(w), link: w.repo })]))),
      ])
    )
  ),
  experience: dir({
    "valuefy.log": file(() => <Valuefy />, { size: size(spans.filter((s) => s.id.startsWith("valuefy"))) }),
    "iiitdm-jabalpur.log": file(() => <College />, { size: size(spans.filter((s) => !s.id.startsWith("valuefy"))) }),
    "achievements.txt": file(() => <Achievements />, { size: size(achievements) }),
  }),
});

/* ---------- path helpers ---------- */

export function resolve(cwd, input = "") {
  let p = input.trim();
  if (!p || p === "~") return HOME;
  if (p.startsWith("~")) p = HOME + p.slice(1);
  else if (!p.startsWith("/")) p = `${cwd}/${p}`;
  const parts = [];
  p.split("/").forEach((seg) => {
    if (!seg || seg === ".") return;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  });
  return `/${parts.join("/")}`;
}

export function lookup(path) {
  if (path === HOME) return ROOT;
  if (!path.startsWith(`${HOME}/`)) return path === "/" || path === "/home" ? { type: "dir", children: {}, outside: true } : null;
  let node = ROOT;
  for (const seg of path.slice(HOME.length + 1).split("/")) {
    if (node?.type !== "dir" || !Object.prototype.hasOwnProperty.call(node.children, seg)) return null;
    node = node.children[seg];
  }
  return node ?? null;
}

export const display = (path) => (path === HOME ? "~" : path.startsWith(`${HOME}/`) ? `~${path.slice(HOME.length)}` : path);

export const sortedEntries = (node) =>
  Object.entries(node.children).sort(([a, x], [b, y]) =>
    x.type === y.type ? a.localeCompare(b) : x.type === "dir" ? -1 : 1
  );

// Every path under HOME, for Tab completion.
export function allPaths() {
  const out = [];
  const walk = (node, base) => {
    sortedEntries(node).forEach(([name, child]) => {
      const p = `${base}/${name}`;
      out.push({ path: p, type: child.type });
      if (child.type === "dir") walk(child, p);
    });
  };
  walk(ROOT, HOME);
  return out;
}
