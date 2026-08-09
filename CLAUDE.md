# Working on this repo — read first

Full project context, architecture, and status live in [PROJECT-HANDOFF.md](PROJECT-HANDOFF.md). Read that before starting any work — this file only covers *how to work with Nasir*, not what the project is.

## Who Nasir is

Non-technical Managing Director of Westline Builders. Plain language, no jargon. He reviews work by looking at it (in his own browser or on the live site), not by reading code or diffs.

## Workflow rules

- **Local-commit-only.** Make changes and commit locally as you go, but do **not** `git push` until Nasir explicitly says he's finished reviewing and wants it live. Check `git status -sb` to see how far ahead of `origin/main` the branch is.
- Once he says push, push straight to `main` — no PR review process, he doesn't use branches.
- Cloudflare Pages auto-deploys `main` in 1-2 minutes after a push.
- Nasir uses **GitHub Desktop**, not git CLI, if he ever needs to touch git himself — keep any instructions to him GUI-friendly.

## Local preview

- Server: `npx --yes serve --listen 4173 .` — config is in `.claude/launch.json` (`westline-static`).
- **Start it once as a standalone background process and leave it running.** Nasir points his own real Chrome at `http://localhost:4173`, separately from any testing you do. If you use `mcp__Claude_Browser__preview_start`/`preview_stop` to start and stop this same port for your own checks, you will kill his tab too — this has happened repeatedly. Reuse the already-running server for your own checks; don't stop-and-restart it as part of verification.
- See `.claude/skills/local-preview/SKILL.md` for the exact steps.

## Testing limitation to remember

The agent browser pane does not truly composite or scroll a real viewport — hover, scroll-driven behavior, and CSS transitions can silently do nothing there even though computed styles look correct. Verify scroll/hover-dependent behavior (e.g. `position: sticky`) by reading DOM/computed state or dispatching synthetic events, not by trusting a screenshot alone. Two real sticky-positioning bugs shipped as "verified" before this was caught — see PROJECT-HANDOFF.md §6.

## Style

- No em dashes, keep responses short, plain language.
- Take initiative — Nasir has asked repeatedly not to be stopped for permission on routine changes. `.claude/settings.json` in this repo (if present) sets `bypassPermissions`; if you're on a fresh machine without that file, see the note in PROJECT-HANDOFF.md about carrying it over.
