# AI Agent Skills

MobX formkit provides a collection of **AI agent skills** — reusable, self-contained instructions that enable AI coding assistants (Cursor, Windsurf, Claude Code, Codebuff, Copilot, and others) to generate correct mobx-formkit code on demand.

> 🔗 **Repository:** [github.com/foxhound87/skills](https://github.com/foxhound87/skills)

---

## What are Skills?

Skills are markdown files that teach an AI agent how to work with specific features of mobx-formkit. When a skill is installed and activated, the AI can:

- Write correct form definitions (flat, nested, mixed)
- Set up validation with any plugin (DVR, VJF, YUP, JOI, ZOD, AJV, VALIBOT, VINEJS)
- Configure event hooks and handlers
- Create custom bindings for your UI framework
- Build advanced features (wizards, sortable lists, file uploads, computed fields, etc.)
- Avoid common pitfalls and anti-patterns

Each skill covers a focused area of the library, so the AI uses only what it needs.

## Available Skills

| Skill | Description |
|-------|-------------|
| **mobx-formkit-api** | Core API — installation, Form/Field constructor, properties, methods, helpers, event handlers |
| **mobx-formkit-flat** | Flat field definitions — unified mode, separated mode, mixed mode, field properties, patterns |
| **mobx-formkit-nested** | Nested & array fields — dot notation, array notation, dynamic add/remove, ArrayMap, field traversal |
| **mobx-formkit-validation** | Validation — DVR, VJF, AJV, YUP, JOI, ZOD, VALIBOT, VINEJS plugins, async validation, cross-validation, hooks |
| **mobx-formkit-bindings** | Field bindings — default rewriter/template, custom bindings, `$try`, per-field mapping, UI frameworks |
| **mobx-formkit-multi-step** | Multi-step wizard forms — nested groups, per-step validation, navigation, review screen |
| **mobx-formkit-events** | Event hooks & handlers — onInit, onChange, onFocus, onBlur, onSubmit, onSuccess, onError, key events |
| **mobx-formkit-observers-interceptors** | MobX observers & interceptors — observe field changes, intercept mutations, reject/modify values, disposers |
| **mobx-formkit-computed** | Reactive computed props & autorun — computed field values, autorun-derived totals, row calculations |
| **mobx-formkit-composer** | Forms composer — orchestrate multiple Form instances, batch validate/submit/clear/reset |
| **mobx-formkit-converters** | Input/output converters — transform values between input and store, per-field and separated mode |
| **mobx-formkit-file-upload** | File upload fields — type: file, drag-and-drop zones, onDrop hook, FileList access, validation |
| **mobx-formkit-sortable** | Sortable arrays — move(), ArrayMap reordering, drag-and-drop with @dnd-kit, up/down buttons |
| **mobx-formkit-extend** | Extend Form & Field classes — custom field classes, makeField(), generic/specific extension |
| **mobx-formkit-options** | Form & field options — validation timing, error display, strict modes, debounce, data retrieval |

---

## Installation

Skills are installed using [skills.sh](https://skills.sh). You need Node.js installed on your machine.

### Install all skills at once

```bash
npx skills add https://github.com/foxhound87/skills --all
```

### Install individual skills

```bash
npx skills add https://github.com/foxhound87/skills --skill mobx-formkit-api
npx skills add https://github.com/foxhound87/skills --skill mobx-formkit-validation
npx skills add https://github.com/foxhound87/skills --skill mobx-formkit-bindings
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

Once installed, simply ask your AI assistant to work with mobx-formkit. If the skill system is supported, the relevant skills are automatically loaded when you describe your task.

Example prompts:

> "Create a login form with mobx-formkit using DVR validation and Material UI bindings."
>
> "Add a sortable list of items to my existing mobx-formkit using the array fields API."
>
> "Set up a multi-step wizard form with per-step validation and a review screen."

### In Cursor / Windsurf / VS Code with AI extensions

Skills integrate with agentic coding tools that support the [skills.sh](https://skills.sh) protocol. After installation, the AI will reference the skill files when generating code, ensuring correct API usage and conventions.

---

---

## Source & Contributing

All skills are open-source and hosted on GitHub:

> **[github.com/foxhound87/skills](https://github.com/foxhound87/skills)**

Contributions are welcome! Open a PR or issue to suggest improvements, report bugs, or propose new skills.
