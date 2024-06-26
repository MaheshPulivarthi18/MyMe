import {
  python,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  linux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  c,
  iiitdmj,
  onestop,
  c1,
  carrent,
  jobit,
  tripguide,
  os,
  next,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "django Developer",
    icon: web,
  },
  {
    title: "mern Developer",
    icon: backend,
  },
  {
    title: "c++ programmer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "next",
    icon: next,
  },
  {
    name: "docker",
    icon: docker,
  },
  {
    name: "python",
    icon: python,
  },
  {
    name: "c++",
    icon: c1,
  },
  {
    name: "c",
    icon: c,
  },
];

const experiences = [
   {
    title: "Python Developer",
    company_name: "1Stop",
    icon: onestop,
    iconBg: "#383E56",
    date: "May 2023 - July 2024",
    points: [
      "Developing information gathering tool using python",
      "Developed an passive port scanner using nmap and multi_threding and concurrency concepts",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Django Developer",
    company_name: "IIIT",
    icon: iiitdmj,
    iconBg: "#383E56",
    date: "Dcemeber 2023 - May 2024",
    points: [
      "Developing web applications using django and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: `Multithreded_proxyserver
    with_cache`,
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "os",
        color: "blue-text-gradient",
      },
      {
        name: "threading",
        color: "green-text-gradient",
      },
      {
        name: "sockets",
        color: "pink-text-gradient",
      },
    ],
    image: os,
    source_code_link: "https://github.com/MaheshPulivarthi18/multi_threaded_proxyserver_with_cache",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };