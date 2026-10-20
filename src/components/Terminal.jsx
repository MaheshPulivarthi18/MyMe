import { useEffect, useRef, useState } from "react";
import { profile, interests, builds, guides, skills, spans } from "../data";

const PROMPT = "mahesh@portfolio:~$";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">{children}</a>
);

const commands = {
  help: {
    about: "list commands",
    run: () => (
      <div className="t-grid">
        {Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => (
            <div key={name} className="t-row">
              <span className="t-cmd">{name}</span>
              <span className="t-dim">{c.about}</span>
            </div>
          ))}
        <p className="t-dim t-gap">Tab completes, ↑ ↓ walk history. Try “open built”.</p>
      </div>
    ),
  },
  whoami: {
    about: "who I am",
    run: () => (
      <>
        <p><strong>{profile.name}</strong>, {profile.role.toLowerCase()}.</p>
        <p className="t-dim">{profile.intro}</p>
      </>
    ),
  },
  projects: {
    about: "things I've built",
    run: () => (
      <>
        {builds.map((b) => (
          <div key={b.name} className="t-item">
            <p><Ext href={b.link}>{b.name}</Ext> <span className="t-dim">({b.kind})</span></p>
            <p className="t-dim">{b.flow.join(" → ")}</p>
          </div>
        ))}
        <p className="t-dim t-gap">Details: <button className="t-link" onClick={() => go("built")}>open built</button></p>
      </>
    ),
  },
  guides: {
    about: "guides I've written",
    run: () =>
      guides.map((g) => (
        <p key={g.name}>
          <Ext href={g.link}>{g.name}</Ext> <span className="t-dim">[{g.progress}]</span>
        </p>
      )),
  },
  interests: {
    about: "what I'm into lately",
    run: () => (
      <ul className="t-list">
        {interests.map((i) => <li key={i}>{i}</li>)}
      </ul>
    ),
  },
  skills: {
    about: "my toolbox",
    run: () =>
      skills.map((s) => (
        <p key={s.group}>
          <span className="t-key">{s.group.toLowerCase().replace(/ & | /g, "_")}</span>=
          <span className="t-dim">[{s.items.join(", ")}]</span>
        </p>
      )),
  },
  experience: {
    about: "where I've worked and studied",
    run: () =>
      spans.map((s) => (
        <p key={s.id} style={{ paddingLeft: s.depth ? "2ch" : 0 }}>
          {s.depth ? "└─ " : ""}
          {s.name} <span className="t-dim">@ {s.where}, {s.start.slice(0, 4)}–{s.end ? s.end.slice(0, 4) : "now"}</span>
        </p>
      )),
  },
  resume: {
    about: "download my resume (PDF)",
    run: () => {
      const a = document.createElement("a");
      a.href = profile.resume;
      a.download = "Mahesh_Pulivarthi_Resume.pdf";
      a.click();
      return (
        <p>
          Downloading <Ext href={profile.resume}>Mahesh_Pulivarthi_Resume.pdf</Ext>…
        </p>
      );
    },
  },
  contact: {
    about: "ways to reach me",
    run: () => (
      <>
        <p>email    <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        <p>github   <Ext href={profile.github}>github.com/MaheshPulivarthi18</Ext></p>
        <p>linkedin <Ext href={profile.linkedin}>in/mahesh-pulivarthi</Ext></p>
      </>
    ),
  },
  open: {
    about: "jump to a section: built, guides, background, resume, contact",
    run: (arg) => {
      const ids = ["built", "guides", "background", "resume", "contact"];
      if (!ids.includes(arg)) {
        return <p className="t-err">open: pick one of {ids.join(", ")}</p>;
      }
      go(arg);
      return <p className="t-dim">Scrolling to {arg}…</p>;
    },
  },
  scene: {
    about: "what's moving behind this window",
    run: () => (
      <p className="t-dim">
        A live model of an event-driven backend: clients → gateway → Kafka → workers → stores.
        Each dot is a request. Move your pointer or scroll to turn it.
      </p>
    ),
  },
  clear: { about: "clear the screen", run: () => null },
  ls: {
    hidden: true,
    run: () => <p>built/  guides/  background/  resume.pdf  contact.txt</p>,
  },
  cat: {
    hidden: true,
    run: (arg) => {
      if (arg === "resume.pdf") return commands.resume.run();
      if (arg === "contact.txt") return commands.contact.run();
      return <p className="t-err">cat: {arg || "missing file"}: try “ls”</p>;
    },
  },
  cd: { hidden: true, run: (arg) => commands.open.run((arg || "").replace(/[~/]/g, "")) },
  sudo: { hidden: true, run: () => <p className="t-err">Permission denied. Nice try, though.</p> },
  date: { hidden: true, run: () => <p>{new Date().toString()}</p> },
  echo: { hidden: true, run: (arg) => <p>{arg}</p> },
};

const names = Object.keys(commands);

export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(true);
  const [typing, setTyping] = useState("");
  const history = useRef([]);
  const histIdx = useRef(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const idRef = useRef(0);

  const push = (cmd, out) =>
    setLines((ls) => [...ls, { id: idRef.current++, cmd, out }]);

  const run = (raw) => {
    const text = raw.trim();
    if (!text) return push("", null);
    history.current = [text, ...history.current].slice(0, 50);
    histIdx.current = -1;
    const [name, ...rest] = text.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (name.toLowerCase() === "clear") return setLines([]);
    if (!cmd) {
      return push(text, <p className="t-err">{name}: command not found. Type “help”.</p>);
    }
    push(text, cmd.run(rest.join(" ")));
  };

  // Boot sequence: type "whoami", then "help".
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines([
        { id: idRef.current++, cmd: "whoami", out: commands.whoami.run() },
        { id: idRef.current++, cmd: "help", out: commands.help.run() },
      ]);
      setBooting(false);
      return undefined;
    }
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));
    const typeOut = async (word) => {
      for (let i = 1; i <= word.length; i++) {
        if (cancelled) return;
        setTyping(word.slice(0, i));
        await wait(70 + Math.random() * 60);
      }
      await wait(250);
      if (cancelled) return;
      setTyping("");
      setLines((ls) => [...ls, { id: idRef.current++, cmd: word, out: commands[word].run() }]);
    };
    (async () => {
      await wait(500);
      await typeOut("whoami");
      await wait(500);
      await typeOut("help");
      if (!cancelled) setBooting(false);
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const onKey = (e) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histIdx.current + 1, history.current.length - 1);
      if (i >= 0) {
        histIdx.current = i;
        setInput(history.current[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = histIdx.current - 1;
      histIdx.current = Math.max(i, -1);
      setInput(i >= 0 ? history.current[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = names.filter((n) => !commands[n].hidden && n.startsWith(input.trim().toLowerCase()));
      if (match.length === 1) setInput(match[0] + " ");
      else if (match.length > 1) push(input, <p className="t-dim">{match.join("  ")}</p>);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const chip = (cmd) => {
    if (booting) return;
    run(cmd);
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="term-title">mahesh@portfolio: ~</span>
      </div>
      <div
        className="term-body"
        ref={bodyRef}
        onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus({ preventScroll: true })}
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l) => (
            <div key={l.id} className="t-entry">
              <p className="t-line">
                <span className="t-prompt">{PROMPT}</span> {l.cmd}
              </p>
              {l.out && <div className="t-out">{l.out}</div>}
            </div>
          ))}
        </div>
        <label className="t-line t-input">
          <span className="t-prompt">{PROMPT}</span>
          {booting ? (
            <span className="t-typed">{typing}<span className="t-caret" aria-hidden="true" /></span>
          ) : (
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label="Type a command, for example help"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          )}
        </label>
      </div>
      <div className="term-chips" aria-label="Quick commands">
        {["projects", "experience", "resume", "contact", "help"].map((c) => (
          <button key={c} type="button" onClick={() => chip(c)} disabled={booting}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
