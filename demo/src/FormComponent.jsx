import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm, DebugField } from './DebugComponent';

const FormComponent = ({ form, events }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left">
      <form>
        <a href="https://www.npmjs.com/package/mobx-ajv-form">
          <h3>mobx-ajv-form</h3>
        </a>
        <div>
          {form.fields.username.label}
          <i>{form.fields.username.error}</i>
        </div>
        <input
          type="text"
          name={form.fields.username.name}
          value={form.fields.username.value}
          placeholder={form.fields.username.label}
          onChange={form.syncValue}
        />

        <div>
          {form.fields.email.label}
          <i>{form.fields.email.error}</i>
        </div>
        <input
          type="text"
          name={form.fields.email.name}
          value={form.fields.email.value}
          placeholder={form.fields.email.label}
          onChange={form.syncValue}
        />

        <div>
          {form.fields.password.label}
          <i>{form.fields.password.error}</i>
        </div>
        <input
          type="password"
          name={form.fields.password.name}
          value={form.fields.password.value}
          placeholder={form.fields.password.label}
          onChange={form.syncValue}
        />

        <div>
          <button
            type="submit"
            disabled={!form.isValid}
            onClick={events.handleOnSubmit}
          >Submit</button>
          <button
            type="submit"
            onClick={events.handleOnClear}
          >Clear</button>
          <button
            type="submit"
            onClick={events.handleOnReset}
          >Reset</button>
        </div>

        <p>{form.genericError}</p>

      </form>
    </div>
    <div className="splitted-65 container-right">
      <DebugForm form={form} />
      <hr />
      <DebugField field={form.fields.username} />
      <DebugField field={form.fields.email} />
      <DebugField field={form.fields.password} />
    </div>
  </div>
);

FormComponent.propTypes = {
  events: React.PropTypes.object,
  form: React.PropTypes.object,
};

export default observer(FormComponent);
