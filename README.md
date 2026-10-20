# Mahesh Pulivarthi, portfolio

Personal site for Mahesh Pulivarthi, backend & platform engineer.
Live at [my-me-one.vercel.app](https://my-me-one.vercel.app/).

The whole site is an interactive terminal: it boots with `neofetch` and
`help`, and visitors explore with commands such as `projects`,
`experience`, `resume` and `mail`, or by tapping the tmux-style status bar.

## Run it

```sh
npm install
npm run dev     # local dev server
npm run build   # production build in dist/
```

## Update the content

All text lives in `src/data.js`; commands are defined in
`src/components/Terminal.jsx`.

## Stack

React 18 and Vite with plain CSS (`src/index.css`). The `mail` command
sends through EmailJS. The resume served by the site is
`public/Mahesh_Pulivarthi_Resume.pdf`.
