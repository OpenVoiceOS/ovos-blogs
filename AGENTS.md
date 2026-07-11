# AGENTS.md — ovos-blogs

The OpenVoiceOS blog site: a Next.js (App Router) + TypeScript static site built on the Vercel Starter Blog template. Posts are Markdown files in `_posts/`. Statically exported and deployed to GitHub Pages, served at `blog.openvoiceos.org`.

## Setup

```bash
npm ci          # uses package-lock.json; Node 20
```

## Test

No test suite. Verification is the production build:

```bash
npm run build   # next build (must succeed)
npm run dev     # local dev server at http://localhost:3000 (--turbopack)
```

## Lint/Typecheck

No `lint` script and no ESLint config. TypeScript is configured (`tsconfig.json`); `next build` type-checks. Prettier is a devDependency but no script is wired up.

## Layout

- `_posts/*.md` — blog content. One Markdown file per post; front matter (`title`, `excerpt`, `coverImage`, `date`, `author`, `coauthors`). Adding a file adds a post.
- `src/lib/api.ts` — reads/sorts posts from `_posts` (gray-matter front matter).
- `src/lib/markdownToHtml.ts` — remark/rehype pipeline (gfm, highlight).
- `src/lib/constants.ts` — SEO/site constants (SITE_URL, OG image, keywords).
- `src/app/` — App Router pages: home `page.tsx`, `posts/[slug]`, `about`, `archive`, `write`, `newblog`; route handlers `feed.xml`, `sitemap.xml`, `robots.txt`.
- `src/app/_components/` — React UI components (header, footer, post-card, theme-switcher, etc.).
- `src/interfaces/` — `Post`, `Author` TypeScript types.
- `public/` — static assets (logo, post cover images under `assets/blog/...`).
- `.github/workflows/nextjs.yml` — build + deploy to GitHub Pages on push to `master`.
- `.github/workflows/process-blog-submission.yml` — turns `[blog-submission]` issues into PRs.
- `CNAME` — `blog.openvoiceos.org`.

Not a Python package / OVOS plugin: no `pyproject.toml`, no entry points, no OPM group.

## Submission flow

The `/write` page collects post metadata + Markdown and opens a prefilled GitHub issue titled `[blog-submission] <title>` with label `blog-submission`. `process-blog-submission.yml` is meant to parse that issue, write a file to `_posts/`, and open a PR.

## Conventions (Org hard rules)

- Branches: work on `dev`, stable is `master`. NEVER use `main`. (Pages deploy triggers on `master`.)
- New repos are private by default; never make a source repo public without asking.
- Commit identity: JarbasAi <jarbasai@mailfence.com>.
- For Python/plugin repos, CI is OpenVoiceOS/gh-automations reusable workflows referenced at `@dev`, and version files are bumped automatically via semver from conventional-commit prefixes (`feat:`/`fix:`/`feat!:`) — never edit version files by hand. This repo is a JS/static site, so it uses its own GitHub Pages deploy workflow instead of gh-automations.
- No Neon / `neon-*` references.
- No meta-commentary in docs/commits/PRs/code (no history, no dates, no "design mistake" framing) — describe current state only.

## Gotchas

- `process-blog-submission.yml` runs `python3 scripts/process_blog_submission.py`, but `scripts/` does not exist in the repo. The submission-to-PR automation is broken until that script is added.
- No `next.config.js` despite static-export deploy to GitHub Pages; the workflow relies on `actions/configure-pages` injecting `static_site_generator: next` (basePath/unoptimized images). Adding explicit config is the safer path.
- Site URL drift: `src/lib/constants.ts` sets `SITE_URL`/`HOME_OG_IMAGE_URL` to `https://openvoiceos.github.io/ovos-blogs`, but the live site uses the `CNAME` `blog.openvoiceos.org`. SEO/OG/feed/sitemap URLs may point at the wrong host.
- README is still the unmodified upstream Vercel blog-starter (mentions Vercel/StackBlitz, not OVOS).
- `skill.md` (serverless-github-native-spa skill doc) is committed at repo root.
- `package.json` lists `fs` and `fortawesome` as `0.0.1-security` placeholder packages — leftover/no-op deps.
