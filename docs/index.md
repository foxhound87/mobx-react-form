---
layout: home

hero:
  name: MobX React Form
  text: Reactive MobX Form State Management
  tagline: Extensible validation, nested fields, event hooks, bindings — with full TypeScript support.
  image:
    src: /hero-icon.svg
    alt: MobX React Form
  actions:
    - theme: brand
      text: Quick Start
      link: /quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/foxhound87/mobx-react-form

features:
  - title: Validation Plugins
    details: Choose from 6 drivers — DVR, VJF, SVK, YUP, JOI, ZOD. Sync & async, extendable rules.
    link: /validation/
    linkText: Learn more

  - title: Nested Fields
    details: Deeply nested structures, arrays, dynamic add/remove, dot notation, ArrayMap — fully serializable.
    link: /fields/
    linkText: Learn more

  - title: Event Hooks & Handlers
    details: onInit, onChange, onFocus, onBlur, onSubmit, onSuccess, onError — full lifecycle control.
    link: /events/
    linkText: Learn more

  - title: Field Bindings
    details: Default bindings for inputs, selects, textareas — or custom bindings for any UI framework (MUI, Ant Design, React Aria, etc.).
    link: /bindings/
    linkText: Learn more

  - title: TypeScript First
    details: Full type inference with `Form<F>`, typed field access, autocomplete for field paths and props.
    link: /typescript
    linkText: Learn more

  - title: Reactive Computed
    details: Functional computed field props reacting to MobX observables — dynamic totals, formatting, derived values.
    link: /extra/computed-props
    linkText: Learn more

  - title: AI Agent Skills
    details: Installable skill files for Cursor, Windsurf, Claude Code, Codebuff and Copilot — AI writes correct form code.
    link: /skills
    linkText: Learn more

  - title: Forms Composer
    details: Orchestrate multiple Form instances for wizards, multi-step flows, and batch submit/validate/clear.
    link: /extra/composer
    linkText: Learn more

  - title: Tree-Shakeable
    details: Only ~8KB gzip. Zero DOM dependencies. Works with Next.js, Remix, Vite, and any React SSR framework.
    link: /performance-ssr
    linkText: Learn more

  - title: DevTools
    details: Dedicated DevTools package for debugging form state, validation, and field values in real-time.
    link: /devtools
    linkText: Learn more
---

<div class="home-sections" markdown="1">

## Get Started in Seconds

```bash
npm install --save mobx-react-form
```

Then pick a validation plugin, define your fields, and you're ready to go.

<div class="cta-row">
  <a href="/mobx-react-form/quick-start" class="cta-button primary">Quick Start Guide →</a>
  <a href="/mobx-react-form/quick-start-class" class="cta-button secondary">Class-based Setup →</a>
</div>

</div>

<div class="home-sections alt" markdown="1">

## Built for Your UI Framework

Use it with any React UI library — or with **vanilla HTML/JS** via UMD bundle:

<div class="framework-grid" id="framework-grid">
  <div class="framework-item">
    <span class="framework-icon">🌐</span>
    <span>Vanilla HTML/JS</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">⚛️</span>
    <span>Material UI</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🐜</span>
    <span>Ant Design</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🎨</span>
    <span>React Aria</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🧩</span>
    <span>Headless UI</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">📦</span>
    <span>React Widgets</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🔽</span>
    <span>React Select</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🧪</span>
    <span>Chakra UI</span>
  </div>
  <div class="framework-item">
    <span class="framework-icon">🎯</span>
    <span>PrimeReact</span>
  </div>
</div>

See the [UMD Setup guide](/umd-setup) for vanilla HTML/JS usage, or the [Bindings guide](/bindings/) for custom component libraries.

</div>

<div class="home-sections" markdown="1">

## Resources & Community

<div class="resources-grid">
  <a href="https://foxhound87.github.io/mobx-react-form-demo/" class="resource-card">
    <div class="resource-icon">🚀</div>
    <div class="resource-title">Live Demo</div>
    <div class="resource-desc">See it in action</div>
  </a>
  <a href="/mobx-react-form/recipes" class="resource-card">
    <div class="resource-icon">📖</div>
    <div class="resource-title">Recipes & Patterns</div>
    <div class="resource-desc">Real-world examples</div>
  </a>
  <a href="/mobx-react-form/troubleshooting" class="resource-card">
    <div class="resource-icon">❓</div>
    <div class="resource-title">FAQ & Troubleshooting</div>
    <div class="resource-desc">Common issues solved</div>
  </a>
  <a href="https://discord.gg/CVV8w4zat4" class="resource-card">
    <div class="resource-icon">💬</div>
    <div class="resource-title">Discord Community</div>
    <div class="resource-desc">Chat & support</div>
  </a>
  <a href="https://github.com/foxhound87/skills" class="resource-card">
    <div class="resource-icon">🤖</div>
    <div class="resource-title">AI Skills</div>
    <div class="resource-desc">Guides for AI coding</div>
  </a>
  <a href="https://github.com/foxhound87/mobx-react-form" class="resource-card">
    <div class="resource-icon">⭐</div>
    <div class="resource-title">GitHub</div>
    <div class="resource-desc">Source & issues</div>
  </a>
</div>

</div>

<style>
.home-sections {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
}

.home-sections.alt {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin: 24px auto;
  padding: 48px 24px;
}

.home-sections h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-sections > p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
}

/* Code block */
.home-samples {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

/* CTA row */
.cta-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cta-button.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.cta-button.primary:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.35);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.cta-button.secondary {
  border: 1.5px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.cta-button.secondary:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.25);
}

/* Framework grid */
.framework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  max-width: 700px;
  margin: 0 auto;
}

.framework-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  cursor: default;
  position: relative;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.framework-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.08);
}

.framework-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* Resources grid */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  max-width: 700px;
  margin: 0 auto;
}

.resource-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
}

.resource-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.1);
}

.resource-icon {
  font-size: 1.6rem;
  line-height: 1;
}

.resource-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.resource-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* Hero GitHub stars badge — placed inside hero actions */
.hero-stars {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
}

.hero-stars img {
  vertical-align: middle;
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-stars a:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.35);
}

/* Inline code in home */
.home-sections code {
  background: var(--vp-c-bg-soft);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* Home link style */
.home-link {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.home-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

/* Framework item selected state */
.framework-item.selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: scale(1.05);
}

@media (max-width: 640px) {
  .home-sections {
    padding: 32px 16px;
  }
  
  .framework-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
  
  .resources-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>

<script>
(function() {
  if (typeof window === 'undefined') return;

  function injectBadge() {
    var actions = document.querySelector('.VPHomeHero .actions');
    if (!actions) return false;
    // Avoid double injection
    if (actions.querySelector('.hero-stars')) return true;
    var wrap = document.createElement('span');
    wrap.className = 'hero-stars';
    var link = document.createElement('a');
    link.href = 'https://github.com/foxhound87/mobx-react-form';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    var img = document.createElement('img');
    img.src = 'https://img.shields.io/github/stars/foxhound87/mobx-react-form?style=for-the-badge&logo=github&label=Stars&color=e11d48';
    img.alt = 'GitHub stars';
    link.appendChild(img);
    wrap.appendChild(link);
    actions.appendChild(wrap);
    return true;
  }

  // Try immediately (SSR case)
  if (!injectBadge()) {
    // Vue might not have rendered yet — watch for it
    var observer = new MutationObserver(function() {
      if (injectBadge()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Safety timeout
    setTimeout(function() { observer.disconnect(); }, 5000);
  }

  // Framework grid items interactions
  document.addEventListener('DOMContentLoaded', function() {
    var items = document.querySelectorAll('#framework-grid .framework-item');
    if (!items.length) return;
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        var self = this;
        self.classList.add('selected');
        setTimeout(function() { self.classList.remove('selected'); }, 400);
      });
      item.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        this.style.transform = 'translateY(-2px) perspective(400px) rotateX(' + ((y - cy) / 20) + 'deg) rotateY(' + ((cx - x) / 20) + 'deg)';
      });
      item.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.classList.remove('selected');
      });
    });
  });
})();
</script>
