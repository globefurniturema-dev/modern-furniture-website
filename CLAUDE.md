# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website for Modern Furniture & Mattresses (Fall River, MA). No build tools, no package manager, no framework — plain HTML, CSS, and JS. Open `index.html` directly in a browser to preview.

## Running the site

```
start index.html          # Windows — opens in default browser
open index.html           # macOS
```

There is no build step, dev server, or test suite.

## Architecture

All styling lives in `css/style.css` (one file). All interactivity lives in `js/main.js` (one file). Font Awesome 6.5.0 is loaded from CDN.

**Page structure** — each HTML page is self-contained and shares the same nav/footer pattern:
- `index.html` — homepage with hero slider, departments, about, blog preview, contact form
- `living-room.html`, `bedroom.html`, `dining.html`, `mattresses.html` — department product grids
- `blog.html` — blog index; `blog-mattress-back-pain.html`, `blog-choose-sofa.html`, `blog-small-bedroom-ideas.html` — individual posts

**CSS design tokens** (defined in `:root` in `style.css`):
- `--bg: #F5F0E8` — warm beige page background
- `--surface: #EDE5D8` — slightly darker surface
- `--primary: #CC0000` — red accent (buttons, labels, links)
- `--text: #111111` — body text
- `--secondary: #555555` — muted text
- `--max-width: 1200px` — container cap

**JS features in `main.js`**: sticky navbar shadow on scroll, mobile hamburger toggle, smooth scroll with navbar-offset correction, active nav link highlight via `IntersectionObserver`, hero slider (autoplay every 5s, touch swipe, arrow/dot controls), fade-in animation via `IntersectionObserver` on `.fade-in` elements, async contact form submission to Formspree.

## Images

All product images are `.webp` format stored under `images-opt/`:
- `images-opt/` — three hero banners (`spring-banner.webp`, `banneer.webp`, `dining.webp`)
- `images-opt/living-room/`, `bedroom/`, `dining/`, `mattresses/` — product images per department

Department pages use only local images from `images-opt/`. The homepage department cards use Unsplash URLs directly.

## Contact form

Submissions POST to `https://formspree.io/f/mdawewgl`. To change the endpoint, update both the `action` attribute in `index.html` and the `fetch` URL in `main.js`.

## Git workflow

Commit after every meaningful change with a descriptive message, then push to `origin/master`:
```
git add <files>
git commit -m "description of what changed and why"
git push
```
GitHub repo: https://github.com/globefurniturema-dev/modern-furniture-website
