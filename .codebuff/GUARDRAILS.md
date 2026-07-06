# Codebuff Guardrails — Commit Convention & Semver

This project uses **semantic-release** to automatically bump versions based on commit messages (**conventional commits**).

Every commit you make MUST use the correct prefix. Using the wrong prefix will cause incorrect version bumps when released.

## Conventional Commit Prefixes

| Prefix     | Semver Impact  | When to use                                           |
|------------|----------------|-------------------------------------------------------|
| `feat:`    | **minor** bump | Only for actual new features in source code           |
| `fix:`     | **patch** bump | Only for actual bug fixes in source code              |
| `chore:`   | **no bump**    | README changes, config, dependencies, tooling, meta   |
| `docs:`    | **no bump**    | Documentation-only changes (docs site, JSDoc, guides) |
| `refactor:`| **no bump**    | Code restructuring without feature/fix behavior       |
| `test:`    | **no bump**    | Adding or fixing tests                                |
| `style:`   | **no bump**    | Formatting, whitespace, lint fixes (no logic change)  |
| `perf:`    | **patch bump** | Performance improvements                              |
| `ci:`      | **no bump**    | CI/CD config changes                                  |

## Critical Rules

1. **README/docs-only changes** → ALWAYS use `chore:` or `docs:` — NEVER `feat:` or `fix:`
2. **Adding a badge, updating a link, fixing a typo in docs** → use `chore:` or `docs:`
3. **`feat:` is ONLY for new source code features** — never for markdown, config, or tooling
4. **`fix:` is ONLY for source code bug fixes** — never for documentation fixes
5. **When in doubt, use `chore:`** — it's safe and never triggers a release

## Examples

```bash
# ✅ Correct
git commit -m "chore: update README with npm badges"
git commit -m "docs: add skills installation guide"
git commit -m "feat: add ArrayMap.move() method"        # actual code
git commit -m "fix: resolve type error in Form constructor"  # actual bug fix

# ❌ Wrong — would trigger incorrect version bump
git commit -m "feat: add badge to README"               # should be chore:
git commit -m "fix: update link in documentation"       # should be docs:
```

## CHANGELOG

When updating `CHANGELOG.md`:
- Group entries under the correct version header (`# X.Y.Z (branch)`)
- Always create a NEW section for each batch of changes — never append to an existing release
- Use the correct branch label: `(master)` if changes go to master, `(next)` for next, etc.
