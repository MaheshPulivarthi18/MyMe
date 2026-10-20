import { useState } from "react";
import { spans } from "../data";

const toMonths = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

const now = new Date();
const nowMonths = now.getFullYear() * 12 + now.getMonth();
const axisStart = Math.min(...spans.map((s) => toMonths(s.start)));
const axisEnd = nowMonths + 1;
const axisSpan = axisEnd - axisStart;

const pct = (months) => ((months - axisStart) / axisSpan) * 100;

const duration = (s) => {
  if (s.approx) return s.start.slice(0, 4);
  const total = (s.end ? toMonths(s.end) : nowMonths) - toMonths(s.start) + 1;
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(" ");
};

const years = [];
for (let y = Math.ceil(axisStart / 12); y * 12 <= axisEnd; y++) years.push(y);

const kindLabel = { work: "Work", edu: "Education", project: "Project" };

export default function Trace() {
  const [open, setOpen] = useState("valuefy-se");

  return (
    <div className="trace" role="list" aria-label="Career timeline">
      <div className="trace-axis" aria-hidden="true">
        <span className="trace-axis-label">Span</span>
        <div className="trace-ticks">
          {years.map((y) => (
            <span key={y} className="trace-tick" style={{ left: `${pct(y * 12)}%` }}>
              {y}
            </span>
          ))}
        </div>
        <span className="trace-axis-label trace-dur">Duration</span>
      </div>

      {spans.map((s) => {
        const left = pct(toMonths(s.start));
        const right = pct((s.end ? toMonths(s.end) : nowMonths) + 1);
        const isOpen = open === s.id;
        return (
          <div key={s.id} role="listitem" className={`span span-${s.kind}`} data-depth={s.depth}>
            <button
              type="button"
              className="span-row"
              aria-expanded={isOpen}
              aria-controls={`detail-${s.id}`}
              onClick={() => setOpen(isOpen ? null : s.id)}
            >
              <span className="span-label">
                <span className="span-name">{s.name}</span>
                <span className="span-where">{s.where}</span>
              </span>
              <span className="span-track">
                {years.map((y) => (
                  <span key={y} className="span-grid" style={{ left: `${pct(y * 12)}%` }} />
                ))}
                <span
                  className={`span-bar${s.end ? "" : " span-live"}${s.approx ? " span-approx" : ""}`}
                  style={{ left: `${left}%`, width: `${right - left}%` }}
                />
              </span>
              <span className="span-dur">{s.end ? duration(s) : `${duration(s)}, ongoing`}</span>
            </button>
            <div id={`detail-${s.id}`} className="span-detail" hidden={!isOpen}>
              <p className="span-kind">{kindLabel[s.kind]}</p>
              <ul>
                {s.detail.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {s.link && (
                <a href={s.link} target="_blank" rel="noreferrer">
                  View source on GitHub
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
