// All site content lives here. Update this file when the resume changes.

export const profile = {
  name: "Mahesh Pulivarthi",
  role: "Backend & platform engineer",
  intro:
    "I build production wealthtech systems at Valuefy: microservices, data pipelines, and the tracing that shows where every millisecond goes.",
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
  {
    id: "arxivlens",
    depth: 0,
    kind: "project",
    name: "ArxivLens",
    where: "Paper ingestion & semantic search",
    start: "2026-01",
    end: "2026-08",
    approx: true,
    link: "https://github.com/MaheshPulivarthi18/ArxivLens",
    detail: [
      "Event-driven ingestion in Go, Kafka and Python workers into PostgreSQL with pgvector.",
      "Idempotent processing, retries, dead-letter routing and partition-keyed ordering.",
      "Go RAG service with citation-aware answers, traced across HTTP and Kafka.",
    ],
  },
  {
    id: "oceanic",
    depth: 0,
    kind: "project",
    name: "Oceanic Connectors",
    where: "Async multi-database ORM",
    start: "2026-01",
    end: "2026-09",
    approx: true,
    link: "https://github.com/MaheshPulivarthi18/postgres-connector",
    detail: [
      "Async connectors and ORM for PostgreSQL and MySQL with one model, query and migration interface.",
      "Batch relation loading resolves nested relations in O(depth) queries, with no N+1.",
    ],
  },
];

export const projects = [
  {
    name: "ArxivLens",
    year: "2026",
    summary:
      "Crawls, parses, chunks and embeds arXiv papers through a Kafka pipeline, then answers questions over them with citations.",
    stack: ["Go", "Kafka", "Python", "pgvector", "OpenTelemetry"],
    link: "https://github.com/MaheshPulivarthi18/ArxivLens",
  },
  {
    name: "Oceanic Connectors",
    year: "2026",
    summary:
      "An async ORM on asyncpg with typed models, a LoopBack-style filter DSL, nested relations, JSONB, soft deletes and migrations.",
    stack: ["Python", "asyncpg", "PostgreSQL", "MySQL"],
    link: "https://github.com/MaheshPulivarthi18/postgres-connector",
  },
  {
    name: "1 Billion Row Challenge",
    year: "2026",
    summary:
      "A step-by-step guide that takes a slow Node.js program for a billion rows of data and makes it fast, one idea per step: bytes, parsing, worker threads.",
    stack: ["Node.js", "Performance", "Worker threads"],
    link: "https://github.com/MaheshPulivarthi18/1billionrow",
  },
  {
    name: "Fusion ERP, Gymkhana module",
    year: "2023–24",
    summary:
      "Club, membership and event management for a Django institute ERP, owned from design to deployment.",
    stack: ["Django", "REST", "PostgreSQL"],
    link: "https://github.com/MaheshPulivarthi18/Fusion",
  },
  {
    name: "Multi-threaded proxy server",
    year: "2024",
    summary: "An HTTP proxy with a shared cache, built on sockets and threads.",
    stack: ["C", "Sockets", "Threads"],
    link: "https://github.com/MaheshPulivarthi18/multi_threaded_proxyserver_with_cache",
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "Go", "JavaScript", "C++", "SQL"] },
  { group: "Backend", items: ["FastAPI", "Django", "Node.js", "Express", "REST", "Async I/O"] },
  { group: "Distributed systems", items: ["Microservices", "Kafka", "Redis", "Event-driven design", "Concurrency"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "asyncpg", "ORM design", "Query tuning"] },
  { group: "Infrastructure", items: ["AWS", "Kubernetes", "Docker", "Nginx", "Linux", "CI/CD"] },
  { group: "Observability & AI", items: ["OpenTelemetry", "Prometheus", "Grafana", "LLM integration", "OCR"] },
];
