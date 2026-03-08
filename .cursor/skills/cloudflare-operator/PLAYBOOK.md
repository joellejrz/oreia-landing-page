# Cloudflare Operator Playbook

## Goal

Use the installed Cloudflare plugin as the default control plane for Cloudflare work in this workspace, with docs-first reasoning and approval-gated mutations.

## Cloudflare MCP Servers

- `plugin-cloudflare-cloudflare-docs`
  - Use for product guidance and platform decisions.
  - Read the tool descriptor before each call.
  - Preferred tool: `search_cloudflare_documentation`.
- `plugin-cloudflare-cloudflare-bindings`
  - Use when the task needs account or project binding context.
  - Check `STATUS.md`; if auth is required, call `mcp_auth` with `{}`.
- `plugin-cloudflare-cloudflare-builds`
  - Use for recent build and deployment context.
  - Check `STATUS.md`; if auth is required, call `mcp_auth` with `{}`.
- `plugin-cloudflare-cloudflare-observability`
  - Use for recent errors, logs, and observability signals.
  - Check `STATUS.md`; if auth is required, call `mcp_auth` with `{}`.

## Standard Workflow

1. Read repo context:
   - `package.json`
   - `wrangler.jsonc` or `wrangler.toml`
   - framework config
   - deploy scripts
2. Read Cloudflare docs context:
   - query the docs MCP for the product or feature in question
   - prefer official docs over memory
3. Read account context if needed:
   - authenticate the relevant Cloudflare MCP server if required
   - inspect current builds, bindings, or observability signals
4. Decide whether the task is read-only or mutating.
5. If mutating:
   - summarize the exact action
   - name the target environment or resource
   - explain expected impact
   - ask for explicit approval
6. After changes:
   - run `wrangler check`
   - run `wrangler types` after config changes
   - verify with build status, logs, or observability if available

## Approval Template

Use this structure before any mutation:

```markdown
Planned Cloudflare action:
- Target: <worker/pages project/account resource>
- Action: <deploy/update/delete/create/rotate secret/etc>
- Expected impact: <what changes for users or infrastructure>
- Verification: <wrangler check, logs, build status, observability>

Reply with approval if you want me to proceed.
```

## Product Selection Cheatsheet

- Edge code or APIs: Workers
- Git-driven frontend deploys: Pages
- Per-entity state or coordination: Durable Objects
- SQL: D1
- Blobs and assets: R2
- Cache or lightweight config: KV
- Background messages: Queues
- Long-running durable jobs: Workflows
- AI inference: Workers AI
- Vector search: Vectorize

## Wrangler Defaults

- Prefer `wrangler.jsonc`.
- Keep `compatibility_date` recent.
- Use `compatibility_flags: ["nodejs_compat"]` unless there is a reason not to.
- Enable `observability.enabled` for new Workers unless the user asks otherwise.
- Use `.dev.vars` or Wrangler secrets for secrets, never committed config values.

## Mutation Guardrails

- Do not deploy, delete, rollback, rotate secrets, or modify live bindings without explicit approval.
- Prefer preview or dry-run flows where possible.
- Call out cost or quota implications before enabling paid Cloudflare features.
- If auth to a Cloudflare MCP server is skipped or fails, explain the limitation and continue with repo plus docs context only.

## Example Requests

- "Check whether this Worker should use D1 or Durable Objects."
- "Inspect recent Cloudflare build failures and explain the root cause."
- "Review my Wrangler config and prepare a safe deploy plan."
- "Look at observability first, then propose the smallest Cloudflare fix."
