# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (Gatsby 5 + React 19 + styled-components 6, Node 24, npm), deployed to GitHub Pages. The working branch is `source`; every push to it runs `.github/workflows/deploy.yml`, which lints, builds, and publishes `public/` via GitHub Pages Actions. There is no manual deploy step, and build output is never committed.

`.npmrc` pins the public npm registry (the machine's global npm config points at an internal registry). npm's `allowScripts` in `package.json` lists the packages whose install scripts may run (sharp, lmdb, etc.); a new native dependency needs `npm install-scripts approve <pkg>`.

## Commands

```bash
npm run develop  # dev server at localhost:8000 (GraphiQL at /___graphql)
npm run build    # production build into public/
npm run serve    # serve the production build at localhost:9000
npm run clean    # clear .cache/public — use when GraphQL/schema or image changes don't show up
npm run lint     # eslint (flat config in eslint.config.js)
npm run format   # prettier over all js/jsx/json/md
```

There are no tests. The husky pre-commit hook runs lint-staged (prettier on js/css/json/md, `eslint --fix` on js). The React Compiler lint rules from `eslint-plugin-react-hooks` v7 are enabled and strict about mutating refs/props during render.

## Architecture

**Content is Markdown, rendered by GraphQL queries.** Almost all text on the site lives in `content/` and is pulled in through `gatsby-transformer-remark`. Each homepage section in `src/components/sections/` runs its own `useStaticQuery` filtered by `fileAbsolutePath` regex, so the directory a file lives in determines where it appears:

| Directory                          | Rendered by                                            | Notes                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/jobs/<Company>/index.md`  | `sections/jobs.js`                                     | tabbed experience list, sorted by `date`                                                                                                                                                                                                                                                                                                                              |
| `content/featured/<Name>/index.md` | `sections/featured.js`                                 | `cover` image co-located in the folder; sorted by `date` ascending (dates here are just ordering values like `'1'`)                                                                                                                                                                                                                                                   |
| `content/projects/*.md`            | `pages/archive.js`                                     | no longer on the homepage; only the unlinked `/archive` page renders these                                                                                                                                                                                                                                                                                            |
| `content/posts/<slug>/index.md`    | `sections/blog.js`, `pages/blog/`, `templates/post.js` | the homepage section (`#blog`) shows the 3 newest posts; `/blog` lists all; `slug` frontmatter must start with `/blog/`. `draft: true` excludes a post everywhere (no page, not listed, no tag pages); `tags` generate `/blog/tags/<kebab>/`. `hello-world` is a draft starter template; the other drafts are the template author's old posts, kept hidden on purpose |

Exception: `sections/opensource.js` uses a hardcoded `contributions` array rather than Markdown. Hero, About, and Contact copy is also inline in their components.

**Site-wide config** is in `src/config.js` (email, social links, nav links, brand colors, ScrollReveal settings) and is also read by `gatsby-config.js`. Homepage section order is set in `src/pages/index.js`; nav anchors in `config.navLinks` must match section `id`s.

**Import aliases** (`@components`, `@config`, `@hooks`, `@styles`, `@utils`, `@images`, etc.) are defined in `gatsby-node.js` `onCreateWebpackConfig`. The same hook null-loads `scrollreveal` and `animejs` during SSR because they touch `window` — any new browser-only library needs the same treatment or a `typeof window` guard (see `src/utils/sr.js`).

**React 19 constraints**: `findDOMNode` is gone, so never use `react-transition-group`'s `CSSTransition` directly — use `Transition` from `@components` (`src/components/transition.js`), which supplies `nodeRef` and attaches it to its single child element (the child must accept a `ref`). SEO/head tags use Gatsby's Head API: each page exports `Head` rendering `<Seo title=... pathname={location.pathname} />`; there is no react-helmet. Anything that differs between server and client (e.g. `usePrefersReducedMotion`, which assumes reduced motion during SSR) must not change the initial render, or hydration fails.

**Intro animation**: the homepage loader and staggered fade-ins play once per visit. `Layout` decides via a module-level flag (survives client-side navigation) and exposes it through `useIntro()` (`src/hooks/useIntro.js`); Nav, Side, and Hero animate only when it's true. Full page reloads replay it.

**Styling**: styled-components with a global theme — CSS variables in `src/styles/variables.js`, shared mixins in `src/styles/mixins.js` (accessed as `theme.mixins.*`), provided via `Layout`.

**Static assets**: files in `static/` (e.g. `resume.pdf`) are served at the site root unchanged.
