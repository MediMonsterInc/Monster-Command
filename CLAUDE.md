# Monster Command Project Context

These instructions apply to coding agents working in this repository.

## Project Context

Monster Command is a Next.js 15 / React 19 read-only dashboard for Medi Monster grow operations. It uses Supabase as the planned backend and falls back to placeholder data when Supabase environment variables are not configured.

Current app areas include plants, cameras, sensors, scores, alerts, seeds, irrigation, exports, shared UI components, Supabase query helpers, and TypeScript data types.

## Setup And Verification

Use the existing npm workflow:

```bash
npm ci
npm run build
npm run typecheck
```

`npm run lint` currently runs deprecated `next lint` and prompts for ESLint setup instead of acting as a non-interactive CI check. Do not claim lint is passing unless the script has been fixed and rerun.

When checking runtime behavior, start:

```bash
npm run dev
```

Then verify relevant routes with a browser or `curl`.

## Secrets And Environment

Never commit real secrets, `.env`, `.env.local`, service-role keys, private keys, tokens, credentials, database dumps, or local Supabase state.

Only `.env.example` should be committed. It currently contains placeholders. The app code reads:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If changing environment variable names, update `.env.example`, `lib/env.ts`, and related docs together.

The Supabase service-role key must never be exposed to client code or public Next.js variables. Use it only in protected server-side deployment or migration workflows after explicit approval.

## Agentic Cost Guardrails

This repository currently has no checked-in AI SDK, OpenAI, Anthropic, LangChain, MCP, or model-calling workflow. Do not add paid AI/model/API dependencies, hosted agents, MCP servers, background automation, polling jobs, or external service integrations without explicit approval.

The main cost risk today is Supabase usage, not LLM usage:

- `lib/supabase/queries.ts` performs broad dashboard reads.
- `getDashboardData()` fans out across many tables per dashboard load.
- `noStore()` disables Next caching for these reads.
- Several queries use `select("*")`.

When touching Supabase access, prefer selected columns, small limits, indexes/views/RPCs for aggregate dashboard data, and explicit cache/revalidation decisions. Do not add fast polling for sensors or cameras without rate limits and a clear cost estimate.

## Model Policy

Use the cheapest practical model for the role. Escalate only when the task is blocked by model capability, and mention the escalation in the handoff.

- Claude driver/coordinator: Claude Opus 4.6.
- Claude workers/subagents: Claude Sonnet 4.6.
- Codex: GPT-5.4 with medium reasoning.
- GitHub Copilot CLI: repository settings cannot enforce a model; prefer `auto` or the cheapest available model at low effort from user/session settings.

## MCP And Tooling

There is no repository MCP configuration today. If MCP is added later, document:

- server purpose
- command and package source
- required environment variables
- network/file access scope
- expected cost and rate limits
- whether it is safe for untrusted prompts

Do not require local-only global agent configuration for normal project setup unless documented here.

## Coding Style

Keep changes small and aligned with the existing codebase:

- Match the current Next.js App Router, TypeScript, Tailwind, and component patterns.
- Prefer existing helpers such as `DataPanel`, `MetricCard`, `StatusPill`, `SourceNotice`, and format utilities.
- Use structured Supabase/client APIs rather than ad hoc string handling.
- Do not introduce broad refactors while fixing a narrow issue.
- Keep UI dense, operational, and readable. This is a dashboard, not a marketing site.

## Handoff Expectations

Before final handoff, report:

- files changed
- commands run and exit status
- known verification gaps
- any cost, security, or secret-handling risks noticed
