# AI Agent Skills

MobX React Form provides a collection of **AI agent skills** — reusable, self-contained instructions that enable AI coding assistants (Cursor, Windsurf, Claude Code, Codebuff, Copilot, and others) to generate correct mobx-react-form code on demand.

> 🔗 **Repository:** [github.com/foxhound87/skills](https://github.com/foxhound87/skills)

---

## What are Skills?

Skills are markdown files that teach an AI agent how to work with specific features of mobx-react-form. When a skill is installed and activated, the AI can:

- Write correct form definitions (flat, nested, mixed)
- Set up validation with any plugin (DVR, VJF, YUP, JOI, ZOD, SVK)
- Configure event hooks and handlers
- Create custom bindings for your UI framework
- Build advanced features (wizards, sortable lists, file uploads, computed fields, etc.)
- Avoid common pitfalls and anti-patterns

Each skill covers a focused area of the library, so the AI uses only what it needs.

## Available Skills

### Core

| Skill | Description |
|-------|-------------|
| **mobx-react-form-api** | Core API — installation, Form/Field constructor, properties, methods, helpers, event handlers |
| **mobx-react-form-flat** | Flat field definitions — unified mode, separated mode, mixed mode, field properties, patterns |
| **mobx-react-form-nested** | Nested & array fields — dot notation, array notation, dynamic add/remove, ArrayMap, field traversal |
| **mobx-react-form-validation** | Validation — DVR, VJF, SVK, YUP, JOI, ZOD plugins, async validation, cross-validation, hooks |
| **mobx-react-form-bindings** | Field bindings — default rewriter/template, custom bindings, `$try`, per-field mapping, UI frameworks |
| **mobx-react-form-multi-step** | Multi-step wizard forms — nested groups, per-step validation, navigation, review screen |

### Advanced

| Skill | Description |
|-------|-------------|
| **mobx-react-form-events** | Event hooks & handlers — onInit, onChange, onFocus, onBlur, onSubmit, onSuccess, onError, key events |
| **mobx-react-form-observers-interceptors** | MobX observers & interceptors — observe field changes, intercept mutations, reject/modify values, disposers |
| **mobx-react-form-computed** | Reactive computed props & autorun — computed field values, autorun-derived totals, row calculations |
| **mobx-react-form-composer** | Forms composer — orchestrate multiple Form instances, batch validate/submit/clear/reset |
| **mobx-react-form-converters** | Input/output converters — transform values between input and store, per-field and separated mode |
| **mobx-react-form-file-upload** | File upload fields — type: file, drag-and-drop zones, onDrop hook, FileList access, validation |
| **mobx-react-form-sortable** | Sortable arrays — move(), ArrayMap reordering, drag-and-drop with @dnd-kit, up/down buttons |
| **mobx-react-form-extend** | Extend Form & Field classes — custom field classes, makeField(), generic/specific extension |
| **mobx-react-form-options** | Form & field options — validation timing, error display, strict modes, debounce, data retrieval |

### Other

| Skill | Description |
|-------|-------------|
| **ios-theme-color** | Diagnose and fix Safari iOS rendering issues — theme-color, Liquid Glass, safe areas, viewport |

---

## Installation

Skills are installed using [skills.sh](https://skills.sh). You need Node.js installed on your machine.

### Install all skills at once

```bash
npx skills add https://github.com/foxhound87/skills --all
```

### Install individual skills

```bash
npx skills add https://github.com/foxhound87/skills --skill mobx-react-form-api
npx skills add https://github.com/foxhound87/skills --skill mobx-react-form-validation
npx skills add https://github.com/foxhound87/skills --skill mobx-react-form-bindings
```

### Install for a specific agent

Some AI agents allow targeting where skills are installed:

```bash
npx skills add https://github.com/foxhound87/skills --all -a <agent-name>
```

For example, with [Opencode](https://opencode.sh/):

```bash
npx skills add https://github.com/foxhound87/skills --all -a opencode
```

---

## Usage

### In chat-based AI assistants

Once installed, simply ask your AI assistant to work with mobx-react-form. If the skill system is supported, the relevant skills are automatically loaded when you describe your task.

Example prompts:

> "Create a login form with mobx-react-form using DVR validation and Material UI bindings."
>
> "Add a sortable list of items to my existing mobx-react-form using the array fields API."
>
> "Set up a multi-step wizard form with per-step validation and a review screen."

### In Cursor / Windsurf / VS Code with AI extensions

Skills integrate with agentic coding tools that support the [skills.sh](https://skills.sh) protocol. After installation, the AI will reference the skill files when generating code, ensuring correct API usage and conventions.

---

## Compatibility

Skills are framework-agnostic and work with any AI assistant that supports the skills.sh protocol, including:

- [Codebuff](https://codebuff.com)
- [Cursor](https://cursor.sh)
- [Windsurf](https://codeium.com/windsurf)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [GitHub Copilot](https://github.com/features/copilot)
- [Opencode](https://opencode.sh/)

---

## Source & Contributing

All skills are open-source and hosted on GitHub:

> **[github.com/foxhound87/skills](https://github.com/foxhound87/skills)**

Contributions are welcome! Open a PR or issue to suggest improvements, report bugs, or propose new skills.
