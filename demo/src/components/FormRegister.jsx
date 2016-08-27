import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm, DebugField } from './Debug';

const FormRegister = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left">
      <form>
        <h2>Form Register</h2>

        <div>
          {form.$('username').label}
          <i>{form.$('username').error}</i>
        </div>
        <input
          type="text"
          name={form.$('username').name}
          value={form.$('username').value}
          placeholder={form.$('username').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('email').label}
          <i>{form.$('email').error}</i>
        </div>
        <input
          type="text"
          name={form.$('email').name}
          value={form.$('email').value}
          placeholder={form.$('email').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('emailConfirm').label}
          <i>{form.$('emailConfirm').error}</i>
        </div>
        <input
          type="text"
          name={form.$('emailConfirm').name}
          value={form.$('emailConfirm').value}
          placeholder={form.$('emailConfirm').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('password').label}
          <i>{form.$('password').error}</i>
        </div>
        <input
          type="password"
          name={form.$('password').name}
          value={form.$('password').value}
          placeholder={form.$('password').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('devSkills').label}
          <i>{form.$('devSkills').error}</i>
        </div>
        <input
          type="string"
          name={form.$('devSkills').name}
          value={form.$('devSkills').value}
          placeholder={form.$('devSkills').label}
          onChange={form.syncValue}
        />

        <br />
        <br />
        <input
          type="checkbox"
          name={form.$('terms').name}
          checked={form.$('terms').value}
          onChange={form.syncValue}
        /> {form.$('terms').label}
        <div>
          <i>{form.$('terms').error}</i>
        </div>

        <div>
          <button
            type="submit"
            disabled={!form.isValid}
            onClick={form.handleOnSubmit}
          >Submit</button>
          <button
            type="submit"
            onClick={form.handleOnClear}
          >Clear</button>
          <button
            type="submit"
            onClick={form.handleOnReset}
          >Reset</button>
        </div>

        <p><i>{form.error}</i></p>

      </form>
    </div>
    <div className="splitted-65 container-right">
      <DebugForm form={form} />
      <hr />
      <DebugField field={form.fields.username} />
      <DebugField field={form.fields.email} />
      <DebugField field={form.fields.emailConfirm} />
      <DebugField field={form.fields.password} />
      <DebugField field={form.fields.devSkills} />
      <DebugField field={form.fields.terms} />
    </div>
  </div>
);

FormRegister.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormRegister);
