# Mahesh Pulivarthi, portfolio

Personal site for Mahesh Pulivarthi, backend & platform engineer.
Live at [my-me-one.vercel.app](https://my-me-one.vercel.app/).

The whole site is a green-phosphor terminal with a small virtual file
system (`~/projects`, `~/guides`, `~/experience`, `about.txt`, `resume.pdf`…).
Visitors explore with `ls`, `cd`, `cat`, `tree` and `open`, click files in
the explorer sidebar, or tap the tmux-style status bar.

## Run it

```sh
npm install
npm run dev     # local dev server
npm run build   # production build in dist/
```

## Update the content

All text lives in `src/data.js`. The file tree is built in `src/fs.jsx`
and commands are defined in `src/components/Terminal.jsx`.

## Stack

React 18 and Vite with plain CSS (`src/index.css`). The `mail` command
sends through EmailJS. The resume served by the site is
`public/Mahesh_Pulivarthi_Resume.pdf`.
