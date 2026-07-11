# TODO — ovos-blogs

## Open issues

- [ ] #31 Dependency Dashboard (Renovate bot)

## Gaps

- [ ] Missing `scripts/process_blog_submission.py` — `process-blog-submission.yml` invokes it but the file/dir is absent; the issue→PR submission pipeline is broken.
- [ ] No `next.config.js` despite static export to GitHub Pages; configuration depends entirely on `actions/configure-pages` injection.
- [ ] Site URL mismatch: `src/lib/constants.ts` uses `openvoiceos.github.io/ovos-blogs` while `CNAME` is `blog.openvoiceos.org` — align SEO/OG/feed/sitemap URLs to the canonical host.
- [ ] README is the unmodified upstream Vercel blog-starter; replace with OVOS-specific docs (build, submission flow, post format).
- [ ] No automated tests and no `lint` script wired up; Prettier is installed but unused.
- [ ] Placeholder/no-op dependencies in `package.json` (`fs`, `fortawesome` at `0.0.1-security`).
- [ ] `skill.md` (serverless SPA skill doc) committed at repo root — move out of the deployed source tree if not intended as content.
- [ ] No GitHub issue template for `[blog-submission]`, though the `/write` flow and workflow expect that exact title/label.

## Code TODOs

None found.
