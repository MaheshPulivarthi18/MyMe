// All site content lives here. Update this file when the resume changes.

export const profile = {
  name: "Mahesh Pulivarthi",
  role: "Backend & platform engineer",
  intro:
    "I build backend systems, then write down how they work. By day I'm a software engineer at Valuefy; the rest of the time I make libraries, pipelines and guides like the ones below.",
  email: "maheshpulivarthi18@gmail.com",
  github: "https://github.com/MaheshPulivarthi18",
  linkedin: "https://www.linkedin.com/in/mahesh-pulivarthi",
};

// Spans for the career trace. Dates are "YYYY-MM"; end: null means ongoing.
// `approx: true` shows the year only, for projects without exact months.
export const spans = [
  {
    id: "edu",
    depth: 0,
    kind: "edu",
    name: "B.Tech, Information Technology",
    where: "PDPM IIITDM Jabalpur",
    start: "2021-08",
    end: "2025-05",
    detail: [
      "Four years of computer science fundamentals, systems and competitive programming.",
      "Top 1.25% of 40,000+ participants in Graph Theory Camp, with Hall of Fame recognition.",
      "900+ algorithmic problems solved across competitive programming platforms.",
    ],
  },
  {
    id: "fusion",
    depth: 1,
    kind: "project",
    name: "Gymkhana module owner",
    where: "Fusion, institute ERP",
    start: "2023-12",
    end: "2024-08",
    link: "https://github.com/MaheshPulivarthi18/Fusion",
    detail: [
      "Owned the Gymkhana module of a Django ERP end to end: requirements, data model, REST APIs and deployment.",
      "Built workflows for clubs, memberships, events, registrations and role-based access.",
      "Profiled Django ORM queries on high-traffic endpoints and removed redundant database work.",
    ],
  },
  {
    id: "valuefy",
    depth: 0,
    kind: "work",
    name: "Valuefy",
    where: "Wealth management platform",
    start: "2025-01",
    end: null,
    detail: [
      "Recognised with the Uninhibited Spirit award and an innovation award for ownership and cross-team work.",
    ],
  },
  {
    id: "valuefy-intern",
    depth: 1,
    kind: "work",
    name: "Software Engineer Intern",
    where: "Valuefy",
    start: "2025-01",
    end: "2025-06",
    detail: [
      "Joined the investment management team and shipped production features from the first months.",
    ],
  },
  {
    id: "valuefy-se",
    depth: 1,
    kind: "work",
    name: "Software Engineer",
    where: "Valuefy",
    start: "2025-06",
    end: null,
    detail: [
      "Own a core investment management module end to end, from backend services and data flows to production deployments.",
      "Build backend services and data pipelines in Python, with async workers for heavy processing.",
      "Work on multi-database support and distributed tracing with OpenTelemetry across services.",
    ],
  },
];

export const interests = [
  "Observability and distributed tracing",
  "Async database tooling",
  "Squeezing performance out of plain code",
  "Small local models that make decisions",
];

// Featured builds. `flow` is drawn as the project's pipeline.
export const builds = [
  {
    name: "Oceanic Postgres ORM",
    kind: "Python library",
    summary:
      "An async PostgreSQL ORM on asyncpg. Nested relations like orders.items.product load in one query per level, so there is never an N+1.",
    points: [
      "LoopBack-style filter DSL with where, order, include and row locking",
      "Transactions with savepoints and retry on deadlocks",
      "Streaming cursors, LISTEN/NOTIFY, upserts and additive migrations",
    ],
    flow: ["Typed model", "Filter DSL", "Batched IN (...) per depth", "asyncpg", "Typed instances"],
    stack: ["Python", "asyncpg", "PostgreSQL"],
    link: "https://github.com/MaheshPulivarthi18/postgres-connector",
  },
  {
    name: "cas-pdf-parser",
    kind: "TypeScript package",
    summary:
      "Reads password-protected Consolidated Account Statements from CAMS, KFintech, NSDL and CDSL, in Node.js or the browser, and returns typed holdings data.",
    points: [
      "Detects the statement source and format automatically",
      "Works with paths, buffers or a browser File",
      "Decimal-safe values for money",
    ],
    flow: ["Encrypted PDF", "Extract text", "Detect source", "Parse holdings", "Typed JSON"],
    stack: ["TypeScript", "pdf.js", "Vitest"],
    link: "https://github.com/MaheshPulivarthi18/cas-parser",
  },
  {
    name: "ArxivLens",
    kind: "Distributed system",
    summary:
      "Ingests arXiv papers through a Kafka pipeline and answers questions over them with citations.",
    points: [
      "Idempotent workers with retries and dead-letter routing",
      "Partition-keyed ordering per paper",
      "Traces follow a request across HTTP and Kafka",
    ],
    flow: ["Go crawler", "Kafka", "Python parse & embed", "pgvector", "Go RAG service"],
    stack: ["Go", "Kafka", "Python", "pgvector", "OpenTelemetry"],
    link: "https://github.com/MaheshPulivarthi18/ArxivLens",
  },
];

export const guides = [
  {
    name: "OpenTelemetry, from first principles",
    summary:
      "Eleven chapters that start with why logs alone fail and end with metrics and logs tied back to traces. Each one has a small Node.js exercise.",
    progress: "11 chapters",
    link: "https://github.com/MaheshPulivarthi18/OpenTelmetry",
  },
  {
    name: "One Billion Row Challenge in Node.js",
    summary:
      "Take a slow program and make it fast in eight small steps: bytes instead of strings, hand-written parsing, then worker threads.",
    progress: "8 steps",
    link: "https://github.com/MaheshPulivarthi18/1billionrow",
  },
  {
    name: "Laya cookbook",
    summary:
      "Runnable recipes for Laya, an open-source local decision model that answers typed questions in one forward pass, with no text generation.",
    progress: "Recipes + production notes",
    link: "https://github.com/MaheshPulivarthi18/Laya-CookBook",
  },
];

export const more = [
  { name: "Multi-threaded proxy server", note: "HTTP proxy with a shared cache, in C", link: "https://github.com/MaheshPulivarthi18/multi_threaded_proxyserver_with_cache" },
  { name: "Fusion ERP, Gymkhana module", note: "Django module I owned end to end", link: "https://github.com/MaheshPulivarthi18/Fusion" },
  { name: "My Messenger", note: "Real-time MERN chat with Socket.IO", link: "https://github.com/MaheshPulivarthi18/my_messenger" },
];

export const skills = [
  { group: "Languages", items: ["Python", "Go", "JavaScript", "C++", "SQL"] },
  { group: "Backend", items: ["FastAPI", "Django", "Node.js", "Express", "REST", "Async I/O"] },
  { group: "Distributed systems", items: ["Microservices", "Kafka", "Redis", "Event-driven design", "Concurrency"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "asyncpg", "ORM design", "Query tuning"] },
  { group: "Infrastructure", items: ["AWS", "Kubernetes", "Docker", "Nginx", "Linux", "CI/CD"] },
  { group: "Observability & AI", items: ["OpenTelemetry", "Prometheus", "Grafana", "LLM integration", "OCR"] },
];
