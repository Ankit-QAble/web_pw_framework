---
id: sync-template-with-upstream
title: Sync template repos with upstream
description: Keep template forks in sync with the main web_pw_framework repository using an upstream remote and a merge branch.
---

When teammates bootstrap their own template repo from `web_pw_framework`, the safest way to pull new framework enhancements is to track this project as an upstream remote and merge updates through a temporary branch. This flow keeps the template’s `main` branch clean and makes conflicts easy to reconcile.

## Why use an upstream remote?

- `origin` should point to the teammate’s template repository (where they push their customizations).
- `upstream` should point back to this canonical framework so new fixes and features flow downstream.
- A dedicated merge branch (e.g., `merge-framework-updates`) isolates the sync work from day-to-day commits on `main`.

## Step-by-step

1. **Add upstream remote (from inside the template repo):**
   ```bash
   git remote add upstream https://github.com/Ankit-QAble/web_pw_framework.git
   git remote -v
   # expect: origin -> template repo, upstream -> main framework
   ```
2. **Fetch the latest framework commits:**
   ```bash
   git fetch upstream
   ```
3. **Create a merge branch to protect template `main`:**
   ```bash
   git checkout -b merge-framework-updates
   ```
4. **Merge upstream changes and resolve conflicts if prompted:**
   ```bash
   git merge upstream/main
   # fix conflicts, verify locally
   git add .
   git commit
   ```
5. **(Optional) Fast-forward template `main` after validation:**
   ```bash
   git checkout main
   git merge merge-framework-updates
   git push origin main
   ```

## Common conflict areas

- Template-specific folder restructures.
- Local modifications to shared utilities such as `framework/core/BasePage.ts`.
- Divergent package versions in `package.json`.

Resolve conflicts in the merge branch, re-run tests, and only then update `main`.

## Quick reference

```
git remote add upstream https://github.com/Ankit-QAble/web_pw_framework.git
git fetch upstream
git checkout -b merge-framework-updates
git merge upstream/main
# resolve conflicts, add, commit
git checkout main
git merge merge-framework-updates
git push origin main
```

