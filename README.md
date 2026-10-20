# Mahesh Pulivarthi, portfolio

Personal site for Mahesh Pulivarthi, backend & platform engineer.
Live at [my-me-one.vercel.app](https://my-me-one.vercel.app/).

The centrepiece is a career timeline drawn as a distributed trace waterfall:
each role and project is a span you can expand.

## Run it

```sh
npm install
npm run dev     # local dev server
npm run build   # production build in dist/
```

## Update the content

All text lives in `src/data.js`: profile, timeline spans,
projects and skills.

## Stack

React 18 and Vite with plain CSS. The hero is an interactive terminal
(`src/components/Terminal.jsx`) floating over a live Three.js scene
(`src/components/SystemScene.jsx`). The resume served by the site is
`public/Mahesh_Pulivarthi_Resume.pdf`.
The contact form sends through EmailJS.
