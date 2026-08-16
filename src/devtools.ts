import { autorun, toJS, values } from "mobx";

export type FormkitDevtoolsEvent =
  | { type: "connected"; connected: boolean }
  | { type: "form:new"; key: string; form: any }
  | { type: "register"; key: string; form: any }
  | { type: "unregister"; key: string }
  | { type: "snapshot"; payload: FormkitDevtoolsSnapshot };

export interface FormkitDevtoolsFieldSnapshot {
  path?: string;
  name?: string;
  type?: string;
  value?: any;
  default?: any;
  initial?: any;
  error?: any;
  hasError?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  isPristine?: boolean;
  isEmpty?: boolean;
  disabled?: boolean;
  touched?: boolean;
  focused?: boolean;
  blurred?: boolean;
  changed?: boolean;
  deleted?: boolean;
  validating?: boolean;
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
  options?: Record<string, any>;
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
  "path",
  "name",
  "type",
  "value",
  "default",
  "initial",
  "error",
  "hasError",
  "isValid",
  "isDirty",
  "isPristine",
  "isEmpty",
  "disabled",
  "touched",
  "focused",
  "blurred",
  "changed",
  "deleted",
  "validating",
] as const;

const FORM_PROPS = ["name", "size", "submitted", "validated", "submitting", "validating"] as const;

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
    if (value !== undefined) out[prop] = toJS(value);
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

const serializeForm = (key: string, form: any): FormkitDevtoolsSnapshot => {
  const out: FormkitDevtoolsSnapshot = { key, ...pick(form, FORM_PROPS) };
  out.fields = pairsOf(form.fields).map(([fieldKey, field]: [string, any]) => serializeField(field, fieldKey));
  return out;
};

const createHook = (): FormkitDevtoolsHook => {
  const registry = new Map<string, any>();
  const listeners = new Set<(event: FormkitDevtoolsEvent) => void>();
  const disposers = new Map<string, () => void>();
  let connected = false;
  let pending = false;

  const emit: FormkitDevtoolsHook["emit"] = (event) => {
    for (const listener of listeners) listener(event);
  };

  const flush = () => {
    pending = false;
    for (const [key, form] of registry) {
      emit({ type: "snapshot", payload: serializeForm(key, form) });
    }
  };

  const requestFlush = () => {
    if (pending) return;
    pending = true;
    setTimeout(flush, 0);
  };

  const dispose = (key: string) => {
    disposers.get(key)?.();
    disposers.delete(key);
  };

  const setup = (key: string) => {
    dispose(key);
    if (!connected) return;
    const form = registry.get(key);
    if (!form) return;
    disposers.set(
      key,
      autorun(() => requestFlush())
    );
  };

  return {
    connected,
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
        emit({ type: "snapshot", payload: serializeForm(key, form) });
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