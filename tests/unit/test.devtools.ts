import { installHook, getHook, registerForm, unregisterForm, FormkitDevtoolsEvent } from "../../src/devtools";
import Form from "../../src/Form";
import { expect } from "chai";

const hook = installHook();

describe("devtools hook", () => {
  beforeEach(() => {
    for (const key of [...hook.registry.keys()]) hook.unregister(key);
    hook.disconnect();
  });

  it("installs an idempotent global hook", () => {
    expect(getHook()).to.equal(hook);
    expect(installHook()).to.equal(hook);
  });

  it("emits register/unregister events", () => {
    const events: FormkitDevtoolsEvent[] = [];
    installHook().subscribe((event) => events.push(event));

    registerForm("login", {});
    unregisterForm("login");

    expect(events.map((event) => event.type)).to.deep.equal(["register", "unregister"]);
  });

  it("auto-registers forms emitted by the Form constructor", () => {
    const events: FormkitDevtoolsEvent[] = [];
    hook.subscribe((event) => events.push(event));

    new Form({ email: {} }, { name: "login" });

    expect(hook.registry.has("login")).to.equal(true);
    expect(hook.registry.get("login")).to.be.instanceOf(Form);
    expect(events.some((event) => event.type === "register" && event.key === "login")).to.equal(true);
  });

  it("emits snapshots on connect and when values change", (done) => {
    const form = new Form({ email: { value: "a@b.c" }, meta: { firstName: "" } }, { name: "contact" });

    hook.register("contact", form);
    hook.connect();

    const snapshots: any[] = [];
    hook.subscribe((event) => {
      if (event.type === "snapshot") snapshots.push(event.payload);
    });

    setTimeout(() => {
      expect(snapshots.length).to.be.greaterThan(0);
      expect(snapshots[0]).to.have.property("key", "contact");
      expect(snapshots[0].fields.map((field: any) => field.name)).to.include("email");

      form.$("email").value = "changed@x.y";

      setTimeout(() => {
        const last = snapshots[snapshots.length - 1];
        expect(last.fields.find((field: any) => field.name === "email").value).to.equal("changed@x.y");
        hook.disconnect();
        done();
      }, 30);
    }, 30);
  });
});