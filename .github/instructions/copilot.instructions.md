---
applyTo: '**'
---

# Clean Commit Workflow

This repository follows the **Clean Commit** workflow for all commit messages.

Reference: https://github.com/wgtechlabs/clean-commit

## Commit Message Format

```text
<emoji> <type>: <description>
<emoji> <type> (<scope>): <description>
```

## The 9 Types

| Emoji | Type       | What it covers                                      |
| :---: | ---------- | --------------------------------------------------- |
|  📦   | `new`      | Adding new features, files, or capabilities         |
|  🔧   | `update`   | Changing existing code, refactoring, improvements   |
|  🗑️   | `remove`   | Removing code, files, features, or dependencies     |
|  🔒   | `security` | Security fixes, patches, vulnerability resolutions  |
|  ⚙️   | `setup`    | Project configs, CI/CD, tooling, build systems      |
|  ☕   | `chore`    | Maintenance tasks, dependency updates, housekeeping |
|  🧪   | `test`     | Adding, updating, or fixing tests                   |
|  📖   | `docs`     | Documentation changes and updates                   |
|  🚀   | `release`  | Version releases and release preparation            |

## Rules

- Use lowercase for type
- Use present tense ("add" not "added")
- No period at the end
- Keep description under 72 characters

## Examples

- `📦 new: user authentication system`
- `🔧 update (api): improve error handling`
- `🗑️ remove (deps): unused lodash dependency`
- `🔒 security: patch XSS vulnerability`
- `⚙️ setup: add eslint configuration`
- `☕ chore: update npm dependencies`
- `🧪 test: add unit tests for auth service`
- `📖 docs: update installation instructions`
- `🚀 release: version 1.0.0`
