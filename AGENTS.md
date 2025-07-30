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