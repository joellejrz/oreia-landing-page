---
name: cloudflare-operator
description: Plans and executes Cloudflare account work using the installed Cloudflare plugin, official Cloudflare docs search, Wrangler, and approval-gated mutations. Use when the user wants to inspect, troubleshoot, build, deploy, or change Cloudflare Workers, Pages, bindings, builds, observability, or other Cloudflare resources from this workspace.
---

# Cloudflare Operator

## Use This Skill When

- The user wants Cloudflare account context, platform guidance, troubleshooting, or deployment help.
- The task touches Workers, Pages, Wrangler, builds, bindings, observability, AI, storage, networking, or account settings.

## Default Policy

- Treat Cloudflare account reads as allowed after required authentication.
- Treat every mutating Cloudflare action as approval-gated.
- Before any write, deploy, delete, rollback, secret change, or config mutation, summarize the target, action, and expected impact, then ask for explicit approval.
- Never claim "full context" until both repo context and Cloudflare account context have been gathered.

## Docs-First Workflow

1. Prefer the installed Cloudflare docs MCP before answering product questions from memory.
2. Before calling a Cloudflare MCP tool, read its descriptor/schema from the MCP file system.
3. Use `search_cloudflare_documentation` for Cloudflare product guidance.
4. If migrating Pages to Workers, always call `migrate_pages_to_workers_guide` first.

## Account Workflow

1. Decide whether the task needs `plugin-cloudflare-cloudflare-docs`, `plugin-cloudflare-cloudflare-bindings`, `plugin-cloudflare-cloudflare-builds`, or `plugin-cloudflare-cloudflare-observability`.
2. Check the target server's `STATUS.md`.
3. If `STATUS.md` says auth is required, call `mcp_auth` with `{}` before proceeding.
4. Prefer account inspection before proposing changes: current resources, recent builds, recent errors, relevant bindings, or observability signals.
5. Combine Cloudflare account context with local repo context before deciding what to change.

## Repo Workflow

1. Inspect `package.json`, `wrangler.jsonc`, `wrangler.toml`, framework config, and deployment scripts first.
2. Prefer `wrangler.jsonc` over TOML for new or updated Cloudflare projects.
3. Keep `compatibility_date` recent.
4. After Cloudflare config changes, run `wrangler types`.
5. Before deploy, run `wrangler check`.
6. Unless the user already asked for deployment, ask before any live deploy.

## Safety Rules

- Reads are fine after auth; mutations require explicit approval.
- Prefer dry runs, previews, staging environments, or read-only inspection first.
- Never commit secrets or put them in `wrangler.jsonc`.
- Call out cost-sensitive services such as Workers AI, Vectorize, Browser Rendering, and build or logging features that may increase usage.

## Response Pattern

1. State what you are checking.
2. Gather repo context.
3. Gather docs or account context.
4. Separate findings from proposed actions.
5. Ask approval before any mutation.
6. After changes, verify with `wrangler check`, `wrangler types`, build status, logs, or observability as appropriate.

## Quick Prompts

- "Audit this Worker against Cloudflare best practices."
- "Explain why this Pages build is failing."
- "Prepare a Wrangler deploy plan, but ask before deploying."
- "Inspect bindings and observability before changing anything."
- "Use Cloudflare docs to choose between D1, KV, R2, and Durable Objects."

## Additional Resource

- For step-by-step operating guidance, see [PLAYBOOK.md](PLAYBOOK.md).
