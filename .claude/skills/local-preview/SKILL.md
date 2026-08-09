---
name: local-preview
description: Start and use the local static-file server for this site (port 4173). Use whenever you need to view a page locally, verify a change before committing, or Nasir reports "localhost:4173 isn't loading" / "connection refused".
---

# Local preview server

Nasir reviews changes by pointing his **own real Chrome** at `http://localhost:4173`, independently of any browser-automation tooling you use for your own checks. The two must not fight over the same server process.

## Starting it

Run it as a standalone background process via the Bash tool, **not** via `mcp__Claude_Browser__preview_start`:

```bash
npx --yes serve --listen 4173 .
```

Use `run_in_background: true` on the Bash call. This detaches it from any browser-automation tool's lifecycle.

Verify it's up:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/
```
Expect `200`.

## Using it for your own checks

Point `mcp__Claude_Browser__preview_start` (or `navigate`) at `http://localhost:4173/<page>` — this reuses the process you already started, it doesn't spawn a new one.

**Do not call `preview_stop` on it.** That tool's stop/start cycle is what caused the recurring `ERR_CONNECTION_REFUSED` bug Nasir hit repeatedly: each `preview_stop` after a verification pass killed the same port his Chrome tab was connected to.

## If the port really is down

Only restart it the same way — a fresh detached background Bash process. Never diagnose this by cycling `preview_start`/`preview_stop`.
