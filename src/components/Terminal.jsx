import { useCallback, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { profile, interests, builds, guides, more, skills, spans, achievements } from "../data";

const HOST = "mahesh@portfolio";
const PROMPT = `${HOST}:~$`;

const LOGO = [
  " __  __ ____  ",
  "|  \\/  |  _ \\ ",
  "| |\\/| | |_) |",
  "| |  | |  __/ ",
  "|_|  |_|_|    ",
].join("\n");

const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">{children}</a>
);

const ym = (v) => (v ? v.replace("-", ".") : "now");

const download = () => {
  const a = document.createElement("a");
  a.href = profile.resume;
  a.download = "Mahesh_Pulivarthi_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/* ---------- command outputs ---------- */

const Neofetch = () => {
  const valuefy = spans.find((s) => s.id === "valuefy-se");
  const edu = spans.find((s) => s.id === "edu");
  const info = [
    ["Role", profile.role],
    ["Work", `${valuefy.name} @ ${valuefy.where}`],
    ["Education", `${edu.name}, ${edu.where}`],
    ["Languages", skills[0].items.join(", ")],
    ["Focus", "distributed systems, databases, observability"],
    ["Solved", "900+ competitive programming problems"],
    ["Shell", "portfolio-sh 2.0"],
  ];
  return (
    <div className="neofetch">
      <pre className="logo" aria-hidden="true">{LOGO}</pre>
      <div>
        <p><span className="c-ok">mahesh</span>@<span className="c-ok">portfolio</span></p>
        <p className="c-dim">{"-".repeat(16)}</p>
        {info.map(([k, v]) => (
          <p key={k}><span className="c-key">{k}</span>: {v}</p>
        ))}
        <p className="swatches" aria-hidden="true">
          {["c1", "c2", "c3", "c4", "c5", "c6"].map((c) => <i key={c} className={c} />)}
        </p>
      </div>
    </div>
  );
};

const Help = ({ list }) => (
  <>
    <p className="c-dim">Available commands:</p>
    <div className="cmd-table">
      {list.map(([name, about]) => (
        <p key={name}><span className="c-cmd">{name}</span><span className="c-dim">{about}</span></p>
      ))}
    </div>
    <p className="c-dim gap">Tab completes · ↑/↓ history · Ctrl+L clears · or tap a window in the bar below.</p>
  </>
);

const Projects = () => (
  <>
    {builds.map((b, i) => (
      <div key={b.name} className="block">
        <p>
          <span className="c-dim">[{i + 1}]</span> <Ext href={b.link}>{b.name}</Ext>{" "}
          <span className="c-dim">({b.kind})</span>
        </p>
        <div className="indent">
          <p>{b.summary}</p>
          <p className="flow"><span className="c-key">flow</span>  {b.flow.join(" ─▶ ")}</p>
          {b.points.map((pt) => <p key={pt}><span className="c-ok">+</span> {pt}</p>)}
          <p className="c-dim">stack: {b.stack.join(", ")}</p>
        </div>
      </div>
    ))}
    <p className="c-dim gap">Also: {more.map((m, i) => (
      <span key={m.name}>{i ? ", " : ""}<Ext href={m.link}>{m.name}</Ext></span>
    ))}. Try “guides” next.</p>
  </>
);

const Guides = () => (
  <>
    {guides.map((g) => (
      <div key={g.name} className="block">
        <p><Ext href={g.link}>{g.name}</Ext> <span className="c-dim">[{g.progress}]</span></p>
        <p className="indent c-dim">{g.summary}</p>
      </div>
    ))}
  </>
);

const Experience = () => {
  const valuefy = spans.filter((s) => s.id.startsWith("valuefy"));
  const [vRoot, ...vRoles] = valuefy;
  const roles = [...vRoles].reverse();
  const edu = spans.find((s) => s.id === "edu");
  const fusion = spans.find((s) => s.id === "fusion");
  return (
    <>
      <p><span className="c-ok">{vRoot.name}</span> <span className="c-dim">{vRoot.where} · {ym(vRoot.start)} → {ym(vRoot.end)}</span></p>
      {roles.map((r, i) => {
        const last = i === roles.length - 1;
        return (
          <div key={r.id}>
            <p><span className="c-dim">{last ? "└── " : "├── "}</span>{r.name} <span className="c-dim">{ym(r.start)} → {ym(r.end)}</span></p>
            {r.detail.map((d) => (
              <p key={d} className="tree-detail"><span className="c-dim">{last ? "    " : "│   "}</span><span>• {d}</span></p>
            ))}
          </div>
        );
      })}
      <p className="gap"><span className="c-ok">{edu.where}</span> <span className="c-dim">{edu.name} · {ym(edu.start)} → {ym(edu.end)}</span></p>
      <p><span className="c-dim">└── </span>{fusion.name}, {fusion.where} <span className="c-dim">{ym(fusion.start)} → {ym(fusion.end)}</span></p>
      {fusion.detail.map((d) => (
        <p key={d} className="tree-detail"><span className="c-dim">{"    "}</span><span>• {d}</span></p>
      ))}
      <p className="gap c-key">achievements</p>
      {achievements.map((a) => <p key={a}><span className="c-ok">★</span> {a}</p>)}
    </>
  );
};

const Skills = () => (
  <>
    {skills.map((s) => (
      <p key={s.group} className="kv">
        <span className="c-key">{s.group.toLowerCase().replace(/ & | /g, "_")}</span>
        <span>{s.items.join(", ")}</span>
      </p>
    ))}
  </>
);

const Contact = () => (
  <>
    <p className="kv"><span className="c-key">email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    <p className="kv"><span className="c-key">github</span><Ext href={profile.github}>github.com/MaheshPulivarthi18</Ext></p>
    <p className="kv"><span className="c-key">linkedin</span><Ext href={profile.linkedin}>in/mahesh-pulivarthi</Ext></p>
    <p className="c-dim gap">Or type “mail” to send me a message from right here.</p>
  </>
);

/* ---------- command table ---------- */

const COMMANDS = {
  help: { about: "show this list" },
  neofetch: { about: "system info, the short version of me", run: () => <Neofetch /> },
  whoami: {
    about: "a few lines about me",
    run: () => (
      <>
        <p><strong>{profile.name}</strong>, {profile.role.toLowerCase()}.</p>
        <p className="c-dim">{profile.intro}</p>
        <p className="gap"><span className="c-key">into lately</span></p>
        {interests.map((i) => <p key={i}><span className="c-ok">›</span> {i}</p>)}
      </>
    ),
  },
  projects: { about: "things I've built, and how they work", run: () => <Projects /> },
  guides: { about: "guides I've written", run: () => <Guides /> },
  experience: { about: "work and education, as a tree", run: () => <Experience /> },
  skills: { about: "my toolbox", run: () => <Skills /> },
  resume: {
    about: "download my resume (PDF)",
    run: () => {
      download();
      return (
        <p>Downloading <Ext href={profile.resume}>Mahesh_Pulivarthi_Resume.pdf</Ext>… <span className="c-dim">(or “open resume” to view it)</span></p>
      );
    },
  },
  contact: { about: "ways to reach me", run: () => <Contact /> },
  mail: { about: "send me a message from this terminal" },
  open: {
    about: "open github, linkedin, resume or a project",
    run: (arg) => {
      const targets = {
        github: profile.github,
        linkedin: profile.linkedin,
        resume: profile.resume,
        oceanic: builds[0].link,
        "cas-pdf-parser": builds[1].link,
        arxivlens: builds[2].link,
        otel: guides[0].link,
        "1brc": guides[1].link,
        laya: guides[2].link,
      };
      const url = targets[(arg || "").toLowerCase()];
      if (!url) return <p className="c-err">open: try one of {Object.keys(targets).join(", ")}</p>;
      window.open(url, "_blank", "noopener");
      return <p className="c-dim">Opening {url}</p>;
    },
  },
  clear: { about: "clear the screen" },
  history: { hidden: true },
  ls: { hidden: true, run: () => <p>projects/  guides/  experience.log  skills.txt  resume.pdf  contact.txt</p> },
  cat: {
    hidden: true,
    run: (arg) => {
      const files = {
        "resume.pdf": "resume",
        "contact.txt": "contact",
        "skills.txt": "skills",
        "experience.log": "experience",
      };
      const c = files[arg];
      return c ? COMMANDS[c].run() : <p className="c-err">cat: {arg || "missing operand"}: No such file. Try “ls”.</p>;
    },
  },
  cd: {
    hidden: true,
    run: (arg) => {
      const dir = (arg || "").replace(/[~/.]/g, "");
      if (!dir) return null;
      return COMMANDS[dir]?.run ? COMMANDS[dir].run() : <p className="c-err">cd: {arg}: No such directory</p>;
    },
  },
  sudo: { hidden: true, run: () => <p className="c-err">mahesh is not in the sudoers file. This incident will be reported.</p> },
  exit: { hidden: true, run: () => <p className="c-dim">There is no escape. Try “projects” instead.</p> },
  date: { hidden: true, run: () => <p>{new Date().toString()}</p> },
  echo: { hidden: true, run: (arg) => <p>{arg}</p> },
  pwd: { hidden: true, run: () => <p>/home/mahesh</p> },
};

const visible = Object.entries(COMMANDS).filter(([, c]) => !c.hidden).map(([n, c]) => [n, c.about]);
const names = Object.keys(COMMANDS);

const WINDOWS = ["projects", "experience", "skills", "resume", "contact", "mail", "help"];

const MAIL_STEPS = [
  { key: "name", ask: "Your name:" },
  { key: "email", ask: "Your email:" },
  { key: "message", ask: "Message:" },
  { key: "confirm", ask: "Send it? (y/n):" },
];

/* ---------- component ---------- */

export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(true);
  const [typing, setTyping] = useState(null);
  const [mail, setMail] = useState(null); // { step, data } while composing
  const [clock, setClock] = useState(() => new Date());
  const history = useRef([]);
  const histIdx = useRef(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const idRef = useRef(0);

  const push = useCallback((entry) => setLines((ls) => [...ls, { id: idRef.current++, ...entry }]), []);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  const startMail = () => {
    setMail({ step: 0, data: {} });
    return (
      <p className="c-dim">Composing a message to Mahesh. Press Ctrl+C or type “cancel” to stop.</p>
    );
  };

  const runCommand = (raw) => {
    const text = raw.trim();
    if (!text) return push({ prompt: PROMPT, cmd: "" });
    history.current = [text, ...history.current.filter((h) => h !== text)].slice(0, 50);
    histIdx.current = -1;
    const [first, ...rest] = text.split(/\s+/);
    const name = first.toLowerCase();
    const arg = rest.join(" ");
    if (name === "clear") return setLines([]);
    if (name === "help") return push({ prompt: PROMPT, cmd: text, out: <Help list={visible} /> });
    if (name === "mail") return push({ prompt: PROMPT, cmd: text, out: startMail() });
    if (name === "history") {
      return push({
        prompt: PROMPT,
        cmd: text,
        out: [...history.current].reverse().map((h, i) => <p key={i}><span className="c-dim">{String(i + 1).padStart(4)}</span>  {h}</p>),
      });
    }
    const cmd = COMMANDS[name];
    if (!cmd?.run) {
      return push({ prompt: PROMPT, cmd: text, out: <p className="c-err">{first}: command not found. Type “help”.</p> });
    }
    push({ prompt: PROMPT, cmd: text, out: cmd.run(arg) });
  };

  const sendMail = async (data) => {
    push({ out: <p className="c-dim">Sending…</p> });
    try {
      await emailjs.send(
        "service_3urrs98",
        "template_o6x8rvt",
        {
          from_name: data.name,
          to_name: profile.name,
          from_email: data.email,
          to_email: profile.email,
          message: data.message,
        },
        "5zuNASB_q5Jp0gjBn"
      );
      push({ out: <p className="c-ok">✓ Sent. Mahesh will reply to {data.email}.</p> });
    } catch (err) {
      console.error(err);
      push({
        out: (
          <p className="c-err">
            ✗ The message didn&apos;t go through. Email <a href={`mailto:${profile.email}`}>{profile.email}</a> directly.
          </p>
        ),
      });
    }
  };

  const runMailStep = (raw) => {
    const value = raw.trim();
    const step = MAIL_STEPS[mail.step];
    push({ prompt: step.ask, cmd: value });
    if (value.toLowerCase() === "cancel") {
      setMail(null);
      return push({ out: <p className="c-dim">Cancelled. Nothing was sent.</p> });
    }
    if (step.key === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      return push({ out: <p className="c-err">That doesn&apos;t look like an email address. Try again.</p> });
    }
    if (!value) return push({ out: <p className="c-err">This can&apos;t be empty.</p> });
    if (step.key === "confirm") {
      const data = mail.data;
      setMail(null);
      if (/^y(es)?$/i.test(value)) sendMail(data);
      else push({ out: <p className="c-dim">Not sent.</p> });
      return undefined;
    }
    setMail({ step: mail.step + 1, data: { ...mail.data, [step.key]: value } });
    return undefined;
  };

  // Boot: login line, then type "neofetch" and "help".
  useEffect(() => {
    const login = { id: idRef.current++, out: <p className="c-dim">Last login: {new Date().toDateString()} on ttys001</p> };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines([
        login,
        { id: idRef.current++, prompt: PROMPT, cmd: "neofetch", out: <Neofetch /> },
        { id: idRef.current++, prompt: PROMPT, cmd: "help", out: <Help list={visible} /> },
      ]);
      setBooting(false);
      return undefined;
    }
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));
    const typeOut = async (word, out) => {
      for (let i = 1; i <= word.length; i++) {
        if (cancelled) return;
        setTyping(word.slice(0, i));
        await wait(55 + Math.random() * 55);
      }
      await wait(220);
      if (cancelled) return;
      setTyping(null);
      setLines((ls) => [...ls, { id: idRef.current++, prompt: PROMPT, cmd: word, out }]);
    };
    setLines([login]);
    (async () => {
      await wait(450);
      await typeOut("neofetch", <Neofetch />);
      await wait(450);
      await typeOut("help", <Help list={visible} />);
      if (!cancelled) setBooting(false);
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!booting && window.matchMedia("(pointer: fine)").matches) focusInput();
  }, [booting]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, typing, mail]);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const onKey = (e) => {
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      if (mail) {
        setMail(null);
        push({ out: <p className="c-dim">^C  Cancelled. Nothing was sent.</p> });
      } else {
        push({ prompt: PROMPT, cmd: `${input}^C` });
      }
      setInput("");
      return;
    }
    if (e.key === "Enter") {
      if (mail) runMailStep(input);
      else runCommand(input);
      setInput("");
      return;
    }
    if (mail) return;
    if (e.key === "ArrowUp") {
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
      const typed = input.trim().toLowerCase();
      const match = names.filter((n) => !COMMANDS[n].hidden && n.startsWith(typed));
      if (match.length === 1) setInput(`${match[0]} `);
      else if (match.length > 1) push({ prompt: PROMPT, cmd: input, out: <p className="c-dim">{match.join("   ")}</p> });
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const runWindow = (cmd) => {
    if (booting) return;
    if (mail) {
      setMail(null);
      push({ out: <p className="c-dim">Cancelled the message.</p> });
    }
    runCommand(cmd);
    focusInput();
  };

  const currentPrompt = mail ? MAIL_STEPS[mail.step].ask : PROMPT;
  const time = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const day = clock.toLocaleDateString([], { day: "2-digit", month: "short" });

  return (
    <div className="shell">
      <header className="titlebar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <h1 className="title">{HOST}: ~ <span className="c-dim">— {profile.name}, {profile.role.toLowerCase()}</span></h1>
      </header>

      <main className="screen" onClick={() => !window.getSelection()?.toString() && !booting && focusInput()}>
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l) => (
            <div key={l.id} className="entry">
              {l.prompt !== undefined && (
                <p className="line">
                  <span className={l.prompt === PROMPT ? "prompt" : "prompt ask"}>{l.prompt}</span> {l.cmd}
                </p>
              )}
              {l.out && <div className="out">{l.out}</div>}
            </div>
          ))}
        </div>
        <label className="line input-line" ref={endRef}>
          <span className={mail ? "prompt ask" : "prompt"}>{currentPrompt}</span>
          {booting ? (
            <span>{typing}<span className="caret" aria-hidden="true" /></span>
          ) : (
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              enterKeyHint="send"
              aria-label={mail ? MAIL_STEPS[mail.step].ask : "Type a command, for example help"}
              type={mail && MAIL_STEPS[mail.step].key === "email" ? "email" : "text"}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          )}
        </label>
      </main>

      <nav className="statusbar" aria-label="Quick commands">
        <span className="session">[portfolio]</span>
        <div className="windows">
          {WINDOWS.map((w, i) => (
            <button key={w} type="button" onClick={() => runWindow(w)} disabled={booting}>
              {i + 1}:{w}
            </button>
          ))}
        </div>
        <span className="clock">{time} {day}</span>
      </nav>
    </div>
  );
}
