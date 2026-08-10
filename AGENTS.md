# AGENTS.md — hydra-client

This file provides instructions for any coding agent working on this repository.
It complements the existing upstream project configuration (`.cursorrules`, `.editorconfig`, `.eslintrc.cjs`, `.prettierignore`, `.npmrc`, `.gitattributes`, `.gitignore`). Those files remain authoritative for their respective concerns. Follow their rules.

## Before Substantial Work

1. Read `PROJECT_CONTEXT.md` in this repository.
2. Read `.cursorrules` — it contains project-specific coding rules (logging, i18n, code style, ESLint policy).
3. Inspect the current repository state (`git status`, `git log`, `git diff`).
4. Inspect relevant source code before modifying it.
5. Understand existing implementation before changing it.
6. Determine whether the task affects the sibling repository (`hydra-selfhosted-backend`).
7. When working across the client/backend boundary, inspect both sides.

## Source of Truth

- **Source code** = current implementation (authoritative)
- **Git history** = historical record
- **`PROJECT_CONTEXT.md`** = durable project knowledge
- **Explicit API/contract documentation** = established interface contracts
- **`.cursorrules`** = project coding conventions (logging, i18n, code style)
- **Upstream README** = documents the official Hydra project, not our custom fork

Never claim functionality exists without verifying it in source code.
Never assume unfinished work is implemented.

## Project Context Maintenance

After completing a substantial change, determine whether durable project knowledge changed.

Automatically update `PROJECT_CONTEXT.md` when changes affect:

- Architecture or significant functionality
- API contracts or client/backend communication
- Authentication flow
- Environment configuration
- Custom fork modifications
- Upstream compatibility
- Significant bugs or workarounds
- Development workflow

Do not update it for every small code change.
Do not turn it into a changelog.
Do not document speculative future functionality as implemented.

## Cross-Repository Development

This client communicates with `hydra-selfhosted-backend` via HTTP API.

The relationship is: `hydra-client → HTTP/WS → hydra-selfhosted-backend`

When a feature crosses the boundary:

1. Inspect the client implementation.
2. Inspect the backend implementation.
3. Identify what actually works today.
4. Identify the existing contract (request/response shapes).
5. Identify missing or incomplete pieces.
6. Keep both sides consistent.

Do not invent an API solely because it would be convenient.

## Package Manager

This project uses **Yarn** (v1 classic). The lockfile is `yarn.lock`.

- Use `yarn` to install dependencies, not `npm`.
- Use `yarn <script>` to run scripts, not `npm run <script>`.
- Do not introduce `package-lock.json`.
- Do not substitute npm commands when documenting or running workflows.

## Git

- Preserve uncommitted work — do not discard the existing `.env` or working tree changes.
- Do not force-reset or force-push.
- Inspect diffs before committing.
- Use meaningful Conventional Commit messages.
- Keep commits logically scoped.
- Do not include secrets (`.env`) or unrelated files.

### Commit Message Format

Use Conventional Commits:

```
feat(client): integrate game synchronization
fix(client): handle unavailable backend gracefully
refactor(client): extract auth callback handler
docs(client): document self-hosted environment variables
```

Avoid vague messages: `update`, `changes`, `stuff`, `fix`, `misc`, `work`.

## Hydra Fork

This repository is a fork of the official Hydra Launcher.

- Preserve intentional custom modifications (especially the subscription bypass).
- Understand the relationship with official Hydra before resolving conflicts.
- Inspect history before resolving merge conflicts.
- Never blindly overwrite custom work.
- Never blindly choose one side of a merge conflict.
- Preserve upstream compatibility where possible.
- The upstream `README.md` documents the official Hydra project. Do not treat it as documentation of our custom project. Record project-specific information in `PROJECT_CONTEXT.md`.
- Do not delete, replace, or blindly rewrite upstream project configuration files (`.cursorrules`, `.editorconfig`, `.eslintignore`, `.eslintrc.cjs`, `.gitattributes`, `.gitignore`, `.npmrc`, `.prettierignore`, etc.) unless there is an independently justified reason.

## Upstream Coding Conventions (from .cursorrules)

- Use `logger` instead of `console` for all logging.
- All user-facing strings must use i18next (`useTranslation` hook / `t()` function).
- Fix ESLint errors properly before disabling rules.
- Follow TypeScript strict mode conventions.
- Use async/await instead of raw promises when possible.
- Prefer named exports for utilities and services.

## Testing

Use the repository's actual tooling:

- `yarn typecheck` — TypeScript type checking (node + web)
- `yarn lint` — ESLint
- `yarn format-check` — Prettier formatting check
- `yarn test` — Node.js test runner

Never claim a check passed unless it was actually run.

When integration with the backend is incomplete, distinguish:
- **verified working** — tested and confirmed
- **partially working** — some functionality works
- **not implemented** — code does not exist yet
- **blocked** — depends on unfinished backend work
- **unknown** — not tested

## Change Scope

Always:
- Implement new features or significant custom changes as separate modules in distinct files. Avoid heavy in-line modifications to existing upstream files whenever possible to minimize merge conflicts with future upstream releases.

Do not:
- Perform unrelated refactors.
- Rewrite working architecture without reason.
- Modify unrelated files.
- Discard existing work (especially the `.env` and subscription bypass).
- Silently change project requirements.
- Turn speculative requirements into implementation.
- Modify upstream configuration files without justification.

## Completion

Before considering substantial work complete:

1. Verify the implementation.
2. Run relevant checks (`yarn typecheck`, `yarn lint`, etc.).
3. Inspect the diff (`git diff`).
4. Inspect repository status (`git status`).
5. Update `PROJECT_CONTEXT.md` if durable knowledge changed.
6. Create appropriate commits when committing is appropriate.
7. Clearly identify anything incomplete or unverified.
