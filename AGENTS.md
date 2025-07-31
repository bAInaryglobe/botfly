# AGENTS.md

## Build, Lint, and Test
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`
- **Lint code:** `npm run lint`
- **Testing:** No test framework is configured. Add one (e.g., Jest, Vitest) if tests are needed.

## Code Style Guidelines
- **Imports:** Use ES module syntax. Use `@/` alias for `src/`.
- **Formatting:** Follow ESLint (Next.js core-web-vitals, TypeScript) rules. No Prettier config; default to ESLint/VSCode formatting.
- **Types:** TypeScript is in `strict` mode. Always annotate types for public APIs and props.
- **Naming:** Use camelCase for variables/functions, PascalCase for components/types, UPPER_CASE for constants.
- **Error Handling:** Prefer try/catch for async code. Surface errors via Next.js error boundaries where possible.
- **File Structure:** Place app code in `src/app/`. Use feature-based or domain-based organization.
- **Comments:** Use JSDoc for exported functions/components. Keep comments concise and relevant.
- **Dependencies:** Use only dependencies listed in `package.json`.

## Misc
- **Ignored files:** See `.gitignore` for ignored patterns (e.g., `.env*`, `node_modules/`, `.next/`).
- **Agentic workspace:** This repo is agentic-ready (see `.vscode/settings.json`).


always push all changes to githhb (commit messages no more than one concise sentence)

## Proposed Appwrite Database Structure

> **Note:** All collections include a `deleted` (boolean) field for soft deletion and offline sync support (for Appwrite + RxDB integration).

| Collection | Purpose | Example Fields |
|------------|---------|---------------|
| users      | User profiles (optional, for extra info) | name, email, avatarUrl, createdAt, deleted |
| projects   | User projects/workspaces | name, description, owner (userId), createdAt, updatedAt, deleted |
| agents     | AI agents per project | name, projectId, config, status, createdAt, updatedAt, deleted |
| messages   | Chat or logs for agents | agentId, projectId, userId, content, type, timestamp, deleted |
| settings   | User or project settings | userId/projectId, key, value, deleted |

### Example: "projects" Collection Schema
- name (string, required)
- description (string, optional)
- owner (userId, required, relation to users)
- createdAt (datetime, auto)
- updatedAt (datetime, auto)
- deleted (boolean, default: false)

### Example: "agents" Collection Schema
- name (string, required)
- projectId (string, required, relation to projects)
- config (json, required)
- status (string, e.g., 'active', 'paused')
- createdAt (datetime, auto)
- updatedAt (datetime, auto)
- deleted (boolean, default: false)
