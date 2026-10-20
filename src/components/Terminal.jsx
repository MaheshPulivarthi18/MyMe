import { useCallback, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { profile, skills, spans, builds, guides } from "../data";
import { HOME, ROOT, resolve, lookup, display, sortedEntries, WorkIndex } from "../fs";
import { work } from "../work";

const HOST = "mahesh@portfolio";

const LOGO = [
  " __  __ ____  ",
  "|  \\/  |  _ \\ ",
  "| |\\/| | |_) |",
  "| |  | |  __/ ",
  "|_|  |_|_|    ",
].join("\n");

const BOOT = [
  "portfolio-sh 3.0 (tty1)",
  "[  OK  ] Mounted /home/mahesh",
  `[  OK  ] Indexed ${builds.length} projects, ${guides.length} guides, ${work.length} repos`,
  "[  OK  ] Started mail daemon",
  "[  OK  ] Reached target: ready to talk",
];

const fmtSize = (n) => (n >= 1024 ? `${(n / 1024).toFixed(1)}K` : `${n}`);

const downloadResume = () => {
  const a = document.createElement("a");
  a.href = profile.resume;
  a.download = "Mahesh_Pulivarthi_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/* ---------- outputs ---------- */

const Neofetch = () => {
  const job = spans.find((s) => s.id === "valuefy-se");
  const edu = spans.find((s) => s.id === "edu");
  const info = [
    ["Role", profile.role],
    ["Work", `${job.name} @ ${job.where}`],
    ["Education", `${edu.name}, ${edu.where}`],
    ["Languages", skills[0].items.join(", ")],
    ["Focus", "distributed systems, databases, observability"],
    ["Repos", `${work.length} public on GitHub (see ~/work)`],
    ["Solved", "900+ competitive programming problems"],
    ["Shell", "portfolio-sh 3.0"],
  ];
  return (
    <div className="neofetch">
      <pre className="logo" aria-hidden="true">{LOGO}</pre>
      <div>
        <p className="c-hi">mahesh@portfolio</p>
        <p className="c-dim">{"-".repeat(16)}</p>
        {info.map(([k, v]) => (
          <p key={k}><span className="c-hi">{k}</span>: {v}</p>
        ))}
        <p className="swatches" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((c) => <i key={c} className={`s${c}`} />)}
        </p>
      </div>
    </div>
  );
};

const HELP = [
  ["ls [-l] [dir]", "list files"],
  ["cd <dir>", "change folder (cd .. goes up)"],
  ["cat <file>", "read a file"],
  ["tree", "show every file"],
  ["open <file>", "open a project, guide or resume.pdf"],
  ["pwd", "print the current folder"],
  ["neofetch", "system info, the short version of me"],
  ["projects", "read the featured project files"],
  ["work", "every repo on my GitHub, by topic"],
  ["experience", "work and education"],
  ["skills", "my toolbox"],
  ["resume", "download my resume (PDF)"],
  ["contact", "ways to reach me"],
  ["mail", "send me a message from here"],
  ["history", "commands you've run"],
  ["clear", "clear the screen"],
];

const Help = () => (
  <>
    <div className="cmd-table">
      {HELP.map(([c, d]) => (
        <p key={c}><span className="c-cmd">{c}</span><span className="c-dim">{d}</span></p>
      ))}
    </div>
    <p className="c-dim gap">Tab completes commands and paths · ↑/↓ history · Ctrl+L clears · Ctrl+C cancels</p>
  </>
);

const Ls = ({ node, long }) => {
  const entries = sortedEntries(node);
  if (!long) {
    return (
      <p className="ls">
        {entries.map(([name, n]) => (
          <span key={name} className={n.type === "dir" ? "c-dir" : n.kind === "pdf" ? "c-bin" : ""}>
            {name}{n.type === "dir" ? "/" : ""}
          </span>
        ))}
      </p>
    );
  }
  return (
    <>
      <p className="c-dim">total {entries.length}</p>
      {entries.map(([name, n]) => (
        <p key={name} className="ls-l">
          <span className="c-dim">{n.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}</span>
          <span className="c-dim">mahesh</span>
          <span className="c-dim num">{n.type === "dir" ? "4.0K" : fmtSize(n.size)}</span>
          <span className="c-dim">Oct 20</span>
          <span className={n.type === "dir" ? "c-dir" : n.kind === "pdf" ? "c-bin" : ""}>
            {name}{n.type === "dir" ? "/" : ""}
          </span>
        </p>
      ))}
    </>
  );
};

const Tree = ({ node, label }) => {
  const rows = [];
  let files = 0;
  let dirs = 0;
  const walk = (n, prefix) => {
    const entries = sortedEntries(n);
    entries.forEach(([name, child], i) => {
      const last = i === entries.length - 1;
      rows.push(
        <p key={prefix + name}>
          <span className="c-dim">{prefix}{last ? "└── " : "├── "}</span>
          <span className={child.type === "dir" ? "c-dir" : child.kind === "pdf" ? "c-bin" : ""}>{name}</span>
        </p>
      );
      if (child.type === "dir") {
        dirs += 1;
        walk(child, prefix + (last ? "    " : "│   "));
      } else files += 1;
    });
  };
  walk(node, "");
  return (
    <>
      <p className="c-dir">{label}</p>
      {rows}
      <p className="gap c-dim">{dirs} directories, {files} files</p>
    </>
  );
};

const Err = ({ children }) => <p className="c-err">{children}</p>;

/* ---------- explorer sidebar ---------- */

function Explorer({ cwd, onFile, onDir, disabled }) {
  const [open, setOpen] = useState({ [`${HOME}/projects`]: true });
  const render = (node, base, depth) =>
    sortedEntries(node).map(([name, child]) => {
      const path = `${base}/${name}`;
      const isDir = child.type === "dir";
      const expanded = open[path];
      return (
        <li key={path}>
          <button
            type="button"
            disabled={disabled}
            className={`${isDir ? "c-dir" : child.kind === "pdf" ? "c-bin" : ""}${cwd === path ? " here" : ""}`}
            style={{ paddingLeft: `${10 + depth * 14}px` }}
            aria-expanded={isDir ? !!expanded : undefined}
            onClick={() => {
              if (isDir) {
                setOpen((o) => ({ ...o, [path]: !o[path] }));
                onDir(path);
              } else onFile(path);
            }}
          >
            <span className="c-dim" aria-hidden="true">{isDir ? (expanded ? "▾ " : "▸ ") : "  "}</span>
            {name}{isDir ? "/" : ""}
          </button>
          {isDir && expanded && <ul>{render(child, path, depth + 1)}</ul>}
        </li>
      );
    });
  return (
    <aside className="explorer" aria-label="File explorer">
      <p className="explorer-head">EXPLORER</p>
      <button type="button" className={`root c-dir${cwd === HOME ? " here" : ""}`} disabled={disabled} onClick={() => onDir(HOME)}>
        ~/ <span className="c-dim">mahesh</span>
      </button>
      <ul>{render(ROOT, HOME, 0)}</ul>
    </aside>
  );
}

/* ---------- terminal ---------- */

const MAIL_STEPS = [
  { key: "name", ask: "Your name:" },
  { key: "email", ask: "Your email:" },
  { key: "message", ask: "Message:" },
  { key: "confirm", ask: "Send it? (y/n):" },
];

const COMMAND_NAMES = [
  "ls", "cd", "cat", "tree", "open", "pwd", "neofetch", "whoami", "projects", "work", "experience",
  "skills", "resume", "contact", "mail", "history", "clear", "help",
];

const WINDOWS = [
  ["projects", "projects"],
  ["work", "work"],
  ["experience", "experience"],
  ["skills", "skills"],
  ["resume", "resume"],
  ["contact", "contact"],
  ["mail", "mail"],
  ["tree", "tree"],
  ["help", "help"],
];

export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(HOME);
  const [booting, setBooting] = useState(true);
  const [typing, setTyping] = useState(null);
  const [mail, setMail] = useState(null);
  const [clock, setClock] = useState(() => new Date());
  const history = useRef([]);
  const histIdx = useRef(-1);
  const draft = useRef("");
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const idRef = useRef(0);
  const cwdRef = useRef(HOME);

  const promptFor = (dir) => `${HOST}:${display(dir)}$`;
  const push = useCallback((entry) => setLines((ls) => [...ls, { id: idRef.current++, ...entry }]), []);
  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  const changeDir = (path) => {
    cwdRef.current = path;
    setCwd(path);
  };

  const catPath = (path, arg) => {
    const node = lookup(path);
    if (!node) return <Err>cat: {arg}: No such file or directory</Err>;
    if (node.type === "dir") return <Err>cat: {arg}: Is a directory</Err>;
    return node.body();
  };

  const execute = (text) => {
    const here = cwdRef.current;
    const [first, ...rest] = text.split(/\s+/);
    const name = first.toLowerCase();
    const flags = rest.filter((r) => r.startsWith("-"));
    const args = rest.filter((r) => !r.startsWith("-"));
    const arg = args.join(" ");

    switch (name) {
      case "help":
        return <Help />;
      case "neofetch":
        return <Neofetch />;
      case "whoami":
        return lookup(`${HOME}/about.txt`).body();
      case "pwd":
        return <p>{here}</p>;
      case "ls":
      case "ll":
      case "dir": {
        const target = resolve(here, arg || ".");
        const node = lookup(target);
        if (!node) return <Err>ls: cannot access &apos;{arg}&apos;: No such file or directory</Err>;
        if (node.outside) return <Err>ls: permission denied. Your home is {display(HOME)}.</Err>;
        if (node.type === "file") return <p>{arg}</p>;
        return <Ls node={node} long={name === "ll" || flags.some((f) => f.includes("l"))} />;
      }
      case "cd": {
        const target = resolve(here, arg || "~");
        const node = lookup(target);
        if (node?.outside) return <Err>cd: permission denied. Nothing to see outside {display(HOME)}.</Err>;
        if (!node) return <Err>cd: {arg}: No such file or directory</Err>;
        if (node.type !== "dir") return <Err>cd: {arg}: Not a directory</Err>;
        changeDir(target);
        return null;
      }
      case "cat":
      case "less":
      case "more":
      case "head":
        if (!arg) return <Err>{name}: missing file operand. Try “ls”.</Err>;
        return catPath(resolve(here, arg), arg);
      case "tree": {
        const target = resolve(here, arg || ".");
        const node = lookup(target);
        if (!node || node.type !== "dir" || node.outside) return <Err>tree: {arg || "."}: not a folder</Err>;
        return <Tree node={node} label={display(target)} />;
      }
      case "open": {
        if (["github", "linkedin"].includes(arg)) {
          window.open(profile[arg], "_blank", "noopener");
          return <p className="c-dim">Opening {profile[arg]}</p>;
        }
        if (!arg) return <Err>open: which file? e.g. “open resume.pdf”</Err>;
        const target = resolve(here, arg);
        const node = lookup(target);
        if (!node) return <Err>open: {arg}: No such file</Err>;
        if (node.outside) return <Err>open: permission denied. Nothing to see outside {display(HOME)}.</Err>;
        if (node.type === "dir") {
          changeDir(target);
          return <Ls node={node} />;
        }
        if (!node.link) return node.body();
        window.open(node.link, "_blank", "noopener");
        return <p className="c-dim">Opening {node.link.startsWith("/") ? arg : node.link}</p>;
      }
      case "projects":
        return builds.map((b, i) => {
          const file = Object.entries(lookup(`${HOME}/projects`).children).find(([, n]) => n.link === b.link);
          return (
            <div key={b.name} className={i ? "file-block" : ""}>
              <p className="c-dim">==&gt; ~/projects/{file[0]} &lt;==</p>
              {file[1].body()}
            </div>
          );
        });
      case "work":
        if (!arg) return <WorkIndex />;
        return execute(`ls ~/work/${arg}`);
      case "experience":
        return ["valuefy.log", "iiitdm-jabalpur.log", "achievements.txt"].map((f, i) => (
          <div key={f} className={i ? "file-block" : ""}>
            <p className="c-dim">==&gt; ~/experience/{f} &lt;==</p>
            {lookup(`${HOME}/experience/${f}`).body()}
          </div>
        ));
      case "skills":
        return lookup(`${HOME}/skills.txt`).body();
      case "contact":
        return lookup(`${HOME}/contact.txt`).body();
      case "resume":
        downloadResume();
        return <p>Downloading Mahesh_Pulivarthi_Resume.pdf… <span className="c-dim">(“open resume.pdf” views it instead)</span></p>;
      case "history":
        return [...history.current].reverse().map((h, i) => (
          <p key={i}><span className="c-dim">{String(i + 1).padStart(4)}</span>  {h}</p>
        ));
      case "sudo":
        return <Err>mahesh is not in the sudoers file. This incident will be reported.</Err>;
      case "rm":
        return <Err>rm: refusing to delete my portfolio. Nice try.</Err>;
      case "exit":
      case "logout":
        return <p className="c-dim">There is no escape. Try “cd projects” instead.</p>;
      case "echo":
        return <p>{rest.join(" ")}</p>;
      case "date":
        return <p>{new Date().toString()}</p>;
      case "vim":
      case "nano":
      case "emacs":
        return <p className="c-dim">Read-only file system. (And you&apos;d never get out of vim anyway.)</p>;
      default:
        return <Err>{first}: command not found. Type “help”.</Err>;
    }
  };

  const runCommand = (raw) => {
    const text = raw.trim();
    const prompt = promptFor(cwdRef.current);
    histIdx.current = -1;
    if (!text) return push({ prompt, cmd: "" });
    history.current = [text, ...history.current.filter((h) => h !== text)].slice(0, 50);
    const name = text.split(/\s+/)[0].toLowerCase();
    if (name === "clear") return setLines([]);
    if (name === "mail") {
      setMail({ step: 0, data: {} });
      return push({ prompt, cmd: text, out: <p className="c-dim">Composing a message to Mahesh. Ctrl+C or “cancel” stops.</p> });
    }
    push({ prompt, cmd: text, out: execute(text) });
  };

  const sendMail = async (data) => {
    push({ out: <p className="c-dim">Sending…</p> });
    try {
      await emailjs.send(
        "service_3urrs98",
        "template_o6x8rvt",
        { from_name: data.name, to_name: profile.name, from_email: data.email, to_email: profile.email, message: data.message },
        "5zuNASB_q5Jp0gjBn"
      );
      push({ out: <p className="c-hi">✓ Sent. Mahesh will reply to {data.email}.</p> });
    } catch (err) {
      console.error(err);
      push({ out: <Err>✗ The message didn&apos;t go through. Email <a href={`mailto:${profile.email}`}>{profile.email}</a> directly.</Err> });
    }
  };

  const runMailStep = (raw) => {
    const value = raw.trim();
    const step = MAIL_STEPS[mail.step];
    push({ prompt: step.ask, ask: true, cmd: value });
    if (value.toLowerCase() === "cancel") {
      setMail(null);
      return push({ out: <p className="c-dim">Cancelled. Nothing was sent.</p> });
    }
    if (!value) return push({ out: <Err>This can&apos;t be empty.</Err> });
    if (step.key === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      return push({ out: <Err>That doesn&apos;t look like an email address. Try again.</Err> });
    }
    if (step.key === "confirm") {
      setMail(null);
      if (/^y(es)?$/i.test(value)) sendMail(mail.data);
      else push({ out: <p className="c-dim">Not sent.</p> });
      return undefined;
    }
    setMail({ step: mail.step + 1, data: { ...mail.data, [step.key]: value } });
    return undefined;
  };

  // Boot: kernel-style log, login line, then type "neofetch" and "cat README.md".
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const login = <p className="c-dim">Last login: {new Date().toDateString()} on tty1</p>;
    const bootOut = BOOT.map((b) => (
      <p key={b}>{b.startsWith("[") ? <><span className="c-dim">[</span><span className="c-hi">  OK  </span><span className="c-dim">]</span>{b.slice(8)}</> : b}</p>
    ));
    const readme = lookup(`${HOME}/README.md`).body();
    const prompt = promptFor(HOME);
    if (reduced) {
      setLines([
        { id: idRef.current++, out: <>{bootOut}{login}</> },
        { id: idRef.current++, prompt, cmd: "neofetch", out: <Neofetch /> },
        { id: idRef.current++, prompt, cmd: "cat README.md", out: readme },
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
        await wait(45 + Math.random() * 50);
      }
      await wait(200);
      if (cancelled) return;
      setTyping(null);
      setLines((ls) => [...ls, { id: idRef.current++, prompt, cmd: word, out }]);
    };
    (async () => {
      for (const b of bootOut) {
        await wait(180);
        if (cancelled) return;
        setLines((ls) => [...ls, { id: idRef.current++, out: b, tight: true }]);
      }
      await wait(250);
      if (cancelled) return;
      setLines((ls) => [...ls, { id: idRef.current++, out: login }]);
      await wait(350);
      await typeOut("neofetch", <Neofetch />);
      await wait(400);
      await typeOut("cat README.md", readme);
      if (!cancelled) setBooting(false);
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const complete = () => {
    const parts = input.split(" ");
    if (parts.length === 1) {
      const m = COMMAND_NAMES.filter((n) => n.startsWith(parts[0].toLowerCase()));
      if (m.length === 1) setInput(`${m[0]} `);
      else if (m.length > 1) push({ prompt: promptFor(cwd), cmd: input, out: <p className="c-dim">{m.join("   ")}</p> });
      return;
    }
    const partial = parts[parts.length - 1];
    const slash = partial.lastIndexOf("/");
    const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : "";
    const base = partial.slice(slash + 1);
    const node = lookup(resolve(cwd, dirPart || "."));
    if (!node || node.type !== "dir") return;
    const m = sortedEntries(node).filter(([n]) => n.startsWith(base));
    if (m.length === 1) {
      const [n, child] = m[0];
      parts[parts.length - 1] = dirPart + n + (child.type === "dir" ? "/" : "");
      setInput(parts.join(" "));
    } else if (m.length > 1) {
      push({ prompt: promptFor(cwd), cmd: input, out: <p className="ls">{m.map(([n, c]) => <span key={n} className={c.type === "dir" ? "c-dir" : ""}>{n}{c.type === "dir" ? "/" : ""}</span>)}</p> });
    }
  };

  const onKey = (e) => {
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      if (mail) {
        setMail(null);
        push({ out: <p className="c-dim">^C  Cancelled. Nothing was sent.</p> });
      } else push({ prompt: promptFor(cwd), cmd: `${input}^C` });
      histIdx.current = -1;
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
        // Leaving the line being typed: keep it so ArrowDown can bring it back.
        if (histIdx.current === -1) draft.current = input;
        histIdx.current = i;
        setInput(history.current[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Already on the line being typed: nothing newer to show, so leave it alone.
      if (histIdx.current === -1) return;
      const i = histIdx.current - 1;
      histIdx.current = i;
      setInput(i >= 0 ? history.current[i] : draft.current);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const run = (cmd) => {
    if (booting) return;
    if (mail) {
      setMail(null);
      push({ out: <p className="c-dim">Cancelled the message.</p> });
    }
    runCommand(cmd);
    focusInput();
  };

  const rel = (path) => {
    const r = display(path);
    return r.startsWith("~/") && path.startsWith(`${cwdRef.current}/`) ? path.slice(cwdRef.current.length + 1) : r;
  };

  const currentPrompt = mail ? MAIL_STEPS[mail.step].ask : promptFor(cwd);
  const time = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const day = clock.toLocaleDateString([], { day: "2-digit", month: "short" });

  return (
    <div className="crt">
      <div className="shell">
        <header className="titlebar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <h1 className="title">{HOST}: {display(cwd)} <span className="c-dim">— {profile.name}, {profile.role.toLowerCase()}</span></h1>
        </header>

        <div className="panes">
          <Explorer cwd={cwd} disabled={booting} onFile={(p) => run(`cat ${rel(p)}`)} onDir={(p) => {
            run(`cd ${display(p)}`);
            run("ls");
          }} />

          <main className="screen" onClick={() => !window.getSelection()?.toString() && !booting && focusInput()}>
            <div role="log" aria-live="polite" aria-label="Terminal output">
              {lines.map((l) => (
                <div key={l.id} className={l.tight ? "entry tight" : "entry"}>
                  {l.prompt !== undefined && (
                    <p className="line">
                      <span className={l.ask ? "prompt ask" : "prompt"}>{l.prompt}</span> {l.cmd}
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
        </div>

        <nav className="statusbar" aria-label="Quick commands">
          <span className="session">[portfolio]</span>
          <div className="windows">
            {WINDOWS.map(([label, cmd], i) => (
              <button key={label} type="button" onClick={() => run(cmd)} disabled={booting}>
                {i + 1}:{label}
              </button>
            ))}
          </div>
          <span className="clock">{display(cwd)} │ {time} {day}</span>
        </nav>
      </div>
    </div>
  );
}

