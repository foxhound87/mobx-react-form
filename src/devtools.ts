import { autorun, toJS, values } from "mobx";

export type FormkitDevtoolsEvent =
  | { type: "connected"; connected: boolean }
  | { type: "form:new"; key: string; form: any }
  | { type: "register"; key: string; form: any }
  | { type: "unregister"; key: string }
  | { type: "snapshot"; payload: FormkitDevtoolsSnapshot };

export interface FormkitDevtoolsFieldSnapshot {
  key?: string;
  path?: string;
  name?: string;
  id?: string;
  type?: string;
  value?: any;
  default?: any;
  initial?: any;
  error?: any;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  related?: any;
  rules?: any;
  options?: any;
  bindings?: any;
  extra?: any;
  checked?: any;
  validators?: any;
  validatedWith?: any;
  hasError?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  isPristine?: boolean;
  isDefault?: boolean;
  isEmpty?: boolean;
  disabled?: boolean;
  touched?: boolean;
  focused?: boolean;
  blurred?: boolean;
  changed?: boolean;
  deleted?: boolean;
  validating?: boolean;
  clearing?: boolean;
  resetting?: boolean;
  submitting?: boolean;
  size?: number;
  submitted?: boolean;
  validated?: boolean;
  fields?: FormkitDevtoolsFieldSnapshot[];
}

export interface FormkitDevtoolsSnapshot {
  key: string;
  name?: string;
  size?: number;
  submitted?: boolean;
  validated?: boolean;
  submitting?: boolean;
  validating?: boolean;
  clearing?: boolean;
  resetting?: boolean;
  hasError?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  isPristine?: boolean;
  isDefault?: boolean;
  isEmpty?: boolean;
  disabled?: boolean;
  deleted?: boolean;
  touched?: boolean;
  focused?: boolean;
  blurred?: boolean;
  changed?: boolean;
  error?: any;
  options?: Record<string, any>;
  helpers?: Record<string, any>;
  fields: FormkitDevtoolsFieldSnapshot[];
}

export interface FormkitDevtoolsHook {
  connected: boolean;
  registry: Map<string, any>;
  emit(event: FormkitDevtoolsEvent): void;
  subscribe(listener: (event: FormkitDevtoolsEvent) => void): () => void;
  register(key: string, form: any): void;
  unregister(key: string): void;
  connect(): void;
  disconnect(): void;
  requestSnapshot(): void;
}

const HOOK_KEY = "__MOBX_FORMKIT_DEVTOOLS_HOOK__";

const FIELD_PROPS = [
  "key",
  "id",
  "name",
  "path",
  "type",
  "bindings",
  "options",
  "default",
  "initial",
  "value",
  "label",
  "placeholder",
  "autoFocus",
  "related",
  "rules",
  "extra",
  "checked",
  "validators",
  "validatedWith",
  "clearing",
  "resetting",
  "hasError",
  "isValid",
  "isDirty",
  "isPristine",
  "isDefault",
  "isEmpty",
  "disabled",
  "deleted",
  "touched",
  "focused",
  "blurred",
  "changed",
  "error",
  "size",
  "submitted",
  "validated",
  "submitting",
  "validating",
] as const;

const FORM_PROPS = [
  "name",
  "size",
  "submitted",
  "validated",
  "submitting",
  "validating",
  "clearing",
  "resetting",
  "hasError",
  "isValid",
  "isDirty",
  "isPristine",
  "isDefault",
  "isEmpty",
  "disabled",
  "deleted",
  "touched",
  "focused",
  "blurred",
  "changed",
  "error",
] as const;

const FIELD_HELPER_PROPS = [
  "error",
  "label",
  "placeholder",
  "default",
  "initial",
  "type",
  "disabled",
  "checked",
  "related",
  "rules",
  "options",
  "extra",
  "bindings",
  "validators",
  "validatedWith",
] as const;

/**
 * Recursively convert a value into a plain, structured-clone-safe shape:
 * observable structures become plain objects/arrays and functions become
 * name strings (functions cannot cross the postMessage boundary).
 */
const serialize = (value: any, depth: number = 0): any => {
  if (depth > 8) return undefined;
  if (typeof value === "function") {
    return `[Function${value.name ? `: ${value.name}` : ""}]`;
  }
  if (value == null) return value;
  const plain = toJS(value);
  if (Array.isArray(plain)) {
    return plain.map((item: any) => serialize(item, depth + 1));
  }
  if (typeof plain === "object") {
    const out: Record<string, any> = {};
    for (const key of Object.keys(plain)) {
      out[key] = serialize(plain[key], depth + 1);
    }
    return out;
  }
  return plain;
};

const isArrayMap = (target: any) => Boolean(target && typeof target === "object" && target._isArrayMap);

const pairsOf = (target: any): [string, any][] => {
  if (isArrayMap(target)) return Array.from((target as any).entries());
  if (Array.isArray(target)) return target.map((value: any, index: number) => [String(index), value]);
  const entries = values(target);
  if (Array.isArray(entries)) return entries.map((value: any, index: number) => [String(index), value]);
  return Object.entries(target);
};

const pick = (source: any, props: readonly string[]) => {
  const out: Record<string, any> = {};
  for (const prop of props) {
    const value = source && typeof source === "object" ? source[prop] : undefined;
    if (value !== undefined) out[prop] = serialize(value);
  }
  return out;
};

const serializeField = (field: any, key?: string): FormkitDevtoolsFieldSnapshot => {
  const out: FormkitDevtoolsFieldSnapshot = pick(field, FIELD_PROPS);
  if (key !== undefined && out.name === undefined) out.name = key;
  if (key !== undefined && out.path === undefined) out.path = key;
  if (isArrayMap(field)) {
    out.fields = pairsOf(field).map(([childKey, entry]: [string, any]) => serializeField(entry, childKey));
  }
  return out;
};

const fieldKey = (field: FormkitDevtoolsFieldSnapshot, index: number): string =>
  (field as any).key ?? field.path ?? field.name ?? `field-${index}`;

const collectProp = (fields: FormkitDevtoolsFieldSnapshot[], prop: string): Record<string, any> => {
  const out: Record<string, any> = {};
  fields.forEach((field, index) => {
    const key = fieldKey(field, index);
    out[key] = field.fields && field.fields.length
      ? collectProp(field.fields, prop)
      : (field as any)[prop];
  });
  return out;
};

const collectHelpers = (form: any, fields: FormkitDevtoolsFieldSnapshot[]): Record<string, any> => {
  const out: Record<string, any> = {};
  for (const prop of FIELD_HELPER_PROPS) {
    out[prop] = collectProp(fields, prop);
  }
  out.hooks = serialize(form.$hooks);
  out.handlers = serialize(form.$handlers);
  return out;
};

const collectBooleanOptions = (form: any): Record<string, boolean> => {
  const out: Record<string, boolean> = {};
  const options = form?.state?.options?.options;
  if (!options || typeof options !== "object") return out;
  for (const key of Object.keys(options)) {
    const value = options[key];
    if (typeof value === "boolean") out[key] = value;
  }
  return out;
};

const serializeForm = (key: string, form: any): FormkitDevtoolsSnapshot => {
  const out = { key, ...pick(form, FORM_PROPS) } as FormkitDevtoolsSnapshot;
  out.fields = pairsOf(form.fields).map(([fieldKey, field]: [string, any]) => serializeField(field, fieldKey));
  out.helpers = collectHelpers(form, out.fields);
  out.options = collectBooleanOptions(form);
  return out;
};

const createHook = (): FormkitDevtoolsHook => {
  const registry = new Map<string, any>();
  const listeners = new Set<(event: FormkitDevtoolsEvent) => void>();
  const disposers = new Map<string, () => void>();
  const caches = new Map<string, FormkitDevtoolsSnapshot>();
  const dirty = new Set<string>();
  let connected = false;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;

  const emit: FormkitDevtoolsHook["emit"] = (event) => {
    for (const listener of listeners) listener(event);
  };

  const flush = () => {
    flushTimer = null;
    const keys = [...dirty];
    dirty.clear();
    for (const key of keys) {
      const snapshot = caches.get(key);
      if (snapshot) emit({ type: "snapshot", payload: snapshot });
    }
  };

  const scheduleFlush = (key: string) => {
    dirty.add(key);
    if (flushTimer == null) flushTimer = setTimeout(flush, 0);
  };

  const dispose = (key: string) => {
    disposers.get(key)?.();
    disposers.delete(key);
    dirty.delete(key);
    caches.delete(key);
  };

  const setup = (key: string) => {
    dispose(key);
    if (!connected) return;
    const form = registry.get(key);
    if (!form) return;
    disposers.set(
      key,
      autorun(() => {
        // Reading observables inside serializeForm makes the autorun re-run
        // on every field/form change; the result is cached and emitted once
        // (batched) by flush.
        caches.set(key, serializeForm(key, form));
        scheduleFlush(key);
      })
    );
  };

  return {
    get connected() {
      return connected;
    },
    registry,
    emit,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    register(key, form) {
      registry.set(key, form);
      emit({ type: "register", key, form });
      setup(key);
    },
    unregister(key) {
      if (!registry.has(key)) return;
      dispose(key);
      registry.delete(key);
      emit({ type: "unregister", key });
    },
    connect() {
      if (connected) return;
      connected = true;
      for (const key of registry.keys()) setup(key);
      emit({ type: "connected", connected: true });
    },
    disconnect() {
      if (!connected) return;
      connected = false;
      for (const key of [...disposers.keys()]) dispose(key);
      emit({ type: "connected", connected: false });
    },
    requestSnapshot() {
      for (const [key, form] of registry) {
        emit({ type: "snapshot", payload: caches.get(key) ?? serializeForm(key, form) });
      }
    },
  };
};

const globalRef = globalThis as any;

export const getHook = (): FormkitDevtoolsHook | undefined => globalRef[HOOK_KEY];

export const installHook = (): FormkitDevtoolsHook => {
  if (!globalRef[HOOK_KEY]) {
    globalRef[HOOK_KEY] = createHook();
  }
  return globalRef[HOOK_KEY];
};

export const registerForm = (key: string, form: any) => installHook().register(key, form);

export const unregisterForm = (key: string) => installHook().unregister(key);

const hook = installHook();

hook.subscribe((event) => {
  if (event.type === "form:new" && !hook.registry.has(event.key)) {
    hook.register(event.key || event.form?.name || `form-${hook.registry.size + 1}`, event.form);
  }
});
