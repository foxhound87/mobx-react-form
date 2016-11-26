import {ObservableMap} from "mobx";
import * as Field from "../../src/Field";
import * as Form from "../../src/Form";
import * as State from "../../src/State";

const test = (title: string, fn: Function) => { /* do nothing */
};

test("Form", () => {
    let f: Form = new Form();

    test("ISeparatedProps", () => {
        let props: Form.ISeparatedProps;
        props = {fields: ["test"]};
        props = {values: {}};
        props = {labels: {}};
        props = {defaults: {}};
        props = {related: {}};
        props = {validate: {}};
        props = {rules: {}};
        props = {schema: {}};
        props = {schema: {}};
    });

    test("constructors", () => {

        test("empty constructor", () => {
            f = new Form();
            f = new Form({});
        });

        test("unified", () => {
            f = new Form({fields: {}});
            f = new Form({fields: []});
            f = new Form({fields: [{}]});
            f = new Form({fields: {}}, "test");
        });

        test("separated", () => {
            f = new Form({fields: ["test"]});
            f = new Form({values: {}});
            f = new Form({labels: {}});
            f = new Form({defaults: {}});
            f = new Form({related: {}});
            f = new Form({validate: {}});
            f = new Form({rules: {}});
            f = new Form({schema: {}});
            f = new Form({schema: {}}, "test");
        });
    });

    test("public props", () => {
        const name: string|null = f.name;
        const hasError: boolean = f.hasError;
        const isValid: boolean = f.isValid;
        const isDirty: boolean = f.isDirty;
        const isPristine: boolean = f.isPristine;
        const isDefault: boolean = f.isDefault;
        const isEmpty: boolean = f.isEmpty;
        const error: string|null = f.error;

        // .fields
        const fields: ObservableMap<any> = f.fields;
        const d: {} = fields.get("test").defaults;
        const $: {} = fields.$mobx;

        // .validator
        const v = f.validator;
        if (v !== null) {
            const s: string = v.getDefaultErrorMessage();
        }
    });

    test("options()", () => {
        const s: string = <string> (f.options("test"));
        const b: boolean = <boolean> (f.options("test"));
        const allowRequired: boolean|undefined = f.options({allowRequired: true}).allowRequired;
    });

    test("on()", () => f.on("test", ({form, path}: {form: Form, path: string}) => 123));

    test("validate()", () => {
        f.validate().then((b: boolean) => 123);
        f.validate({}).then((b: boolean) => 123);
        f.validate({}, {}).then((b: boolean) => 123);
    });

    test("invalidate", () => {
        f.invalidate();
        f.invalidate("test");
        f.invalidate(null);
    });

    test("clear()", () => f.clear());

    test("reset()", () => f.reset());

    test("submit()", () => {

        test("non-typed", () => {
            f.submit().then((b: boolean) => 123);
            f.submit({}).then((b: boolean) => 123);
            f.submit({onSubmit: (form: Form) => 123}).then((b: boolean) => 123);
            f.submit({onError: (form: Form) => 123}).then((b: boolean) => 123);
        });

        test("typed", () => {
            f.submit<string>().then((s: string) => 123);
            f.submit<string>({}).then((s: string) => 123);
            f.submit<string>({onSubmit: (form: Form) => "test"}).then((s: string) => 123);
            f.submit<string>({onError: (form: Form) => "test"}).then((s: string) => 123);
        });
    });

    test("onSubmit()", () => {
        const e: any = "event";
        f.onSubmit(e);
        f.onSubmit(e, {});
        f.onSubmit(e, {onSubmit: (form: Form) => 123});
        f.onSubmit(e, {onError: (form: Form) => 123});
    });

    test("onClear()", () => f.onClear("event"));

    test("onReset()", () => f.onReset("event"));

    test("onAdd()", () => {
        f.onAdd("event");
        f.onAdd("event", "key");
        f.onAdd("event", null);
    });

    test("onDel()", () => {
        f.onDel("event");
        f.onDel("event", "key");
        f.onDel("event", null);
    });

    test("values()", () => {
        const r: {} = f.values();
    });

    test("errors()", () => {
        const r: {} = f.errors();
    });

    test("labels()", () => {
        const r: {} = f.labels();
    });

    test("defaults()", () => {
        const r: {} = f.defaults();
    });

    test("initials()", () => {
        const r: {} = f.initials();
    });

    test("init()", () => {
        f.init();
        f.init({});
    });

    test("update()", () => f.update({}));

    // TODO: check return types
    test("$()", () => {
        const r: any = f.$("key");
    });

    // TODO: check return types
    test("select()", () => {
        f.select("path");
        f.select("path", undefined, true);
    });

    // TODO: check return types
    test("container()", () => {
        f.container();
        f.container(null);
        f.container("path");
    });

    test("check()", () => {
        f.check("computed");
        f.check("computed", true);
    });

    test("get()", () => {
        f.get();
        f.get(null);
        f.get("prop");
        const o: {} = f.get(["a", "b"]);
    });

    test("set()", () => {
        f.set("prop", {whatever: "here"});
        f.set("prop", {whatever: "here"}, true);
        f.set({whatever: "here"});
    });

    test("map()", () => {
        let s: string[];
        s = f.map<string>((field: Field, index: number) => "str");
        s = f.map<string>("path", (field: Field, index: number) => "str");
    });

    test("forEach()", () => {
        f.forEach((field: Field) => field.key);
        f.forEach((field: Field) => field.key, undefined);
        f.forEach((field: Field) => field.key, undefined, 123);
    });

    test("add()", () => {
        f.add();
        f.add(null);
        f.add("path");
    });

    test("del()", () => {
        f.del();
        f.del(null);
        f.del("path");
    });

    test("makeField()", () => {
        let field: Field;

        field = f.makeField({
            key: "key",
            path: "path",
            state: new State(),
        });

        field = f.makeField({
            data: {},
            key: "key",
            path: "path",
            state: new State(),
        });

        field = f.makeField({
            key: "key",
            path: "path",
            props: {},
            state: new State(),
        });

        field = f.makeField({
            key: "key",
            path: "path",
            state: new State(),
            update: true,
        });
    });

});
