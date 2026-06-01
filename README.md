# Monster Command

Repository foundation for the Monster Command project at Medi Monster Inc.

Purpose

This repository contains the foundational structure and configuration to build the Monster Command system: a Supabase-backed platform for managing plants, cameras, sensors, seed inventory and seed drops, and generating public exports. This initial commit focuses only on repository layout, documentation, and safe setup for Supabase integration — no application features or UI are included yet.

Top-level structure

monster-command/
├── .github/workflows/    # CI workflows (add CI files here)
├── app/                  # Frontend or web app (Next.js/Vite/etc.)
├── components/           # Reusable UI components (if applicable)
├── lib/                  # Shared libraries and utilities
├── supabase/             # Supabase migrations, SQL functions, and config
│   └── migrations/
├── public/               # Static assets
├── types/                # Generated TypeScript types (DB types, shared types)
├── exports/              # Public export generation and artifacts
├── docs/                 # Design docs, ERDs, architecture
├── scripts/              # Helper and developer scripts
├── README.md             # This file
└── LICENSE               # Add a license (e.g., MIT)

Quickstart (foundation)

1. Read docs/architecture.md and docs/schema.md to understand the planned data model and architecture.
2. Add required secrets to the repository's GitHub Secrets (do NOT commit secrets to source): SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
3. Use the supabase/README.md to set up local Supabase and migrations (supabase CLI or docker-compose).
4. Add CI workflows in .github/workflows to run lint/typecheck/tests and to gate migrations deploys.

Next steps (before development)

- Finalize the DB schema and add the initial migration(s) to supabase/migrations/.
- Add CI workflows (lint, typecheck, tests) and enable branch protection requiring those checks.
- Configure CODEOWNERS and repository branch protections.
- Add a CONTRIBUTING.md and SECURITY.md (not added in this initial commit; add next).

Maintainers

- Repository: MediMonsterInc/Monster-Command

