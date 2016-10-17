import React from 'react';
import { observer } from 'mobx-react';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import DebugForm from './Debug';

const FormRegister = ({ form }) => (
  <div className="container material">
    <form>
      <h2>Form Register</h2>
      <h4>Material UI</h4>

      <TextField
        name={form.$('username').name}
        value={form.$('username').value}
        floatingLabelText={form.$('username').label}
        errorText={form.$('username').error}
        onChange={form.$('username').onChange}
        onFocus={form.$('username').onFocus}
        onBlur={form.$('username').onBlur}
      /><br />

      <TextField
        name={form.$('email').name}
        value={form.$('email').value}
        floatingLabelText={form.$('email').label}
        errorText={form.$('email').error}
        onChange={form.$('email').onChange}
        onFocus={form.$('email').onFocus}
        onBlur={form.$('email').onBlur}
      /><br />

      <TextField
        name={form.$('emailConfirm').name}
        value={form.$('emailConfirm').value}
        floatingLabelText={form.$('emailConfirm').label}
        errorText={form.$('emailConfirm').error}
        onChange={form.$('emailConfirm').onChange}
        onFocus={form.$('emailConfirm').onFocus}
        onBlur={form.$('emailConfirm').onBlur}
      /><br />

      <TextField
        name={form.$('password').name}
        value={form.$('password').value}
        floatingLabelText={form.$('password').label}
        errorText={form.$('password').error}
        onChange={form.$('password').onChange}
        onFocus={form.$('password').onFocus}
        onBlur={form.$('password').onBlur}
      /><br />

      <TextField
        name={form.$('devSkills').name}
        value={form.$('devSkills').value}
        floatingLabelText={form.$('devSkills').label}
        errorText={form.$('devSkills').error}
        onChange={form.$('devSkills').onChange}
        onFocus={form.$('devSkills').onFocus}
        onBlur={form.$('devSkills').onBlur}
      /><br />

      <br />
      <Toggle
        labelPosition="right"
        label={form.$('terms').label}
        name={form.$('terms').name}
        defaultToggled={form.$('terms').value}
        onToggle={form.$('terms').onToggle}
        onFocus={form.$('terms').onFocus}
        onBlur={form.$('terms').onBlur}
      />
      <div>
        <i>{form.$('terms').error}</i>
      </div>

      <br />
      <div className="ctrl">
        <button type="submit" onClick={form.onSubmit}>
          <i className="fa fa-dot-circle-o" /> Submit
        </button>
        <button type="button" onClick={form.onClear}>
          <i className="fa fa-eraser" /> Clear
        </button>
        <button type="button" onClick={form.onReset}>
          <i className="fa fa-refresh" /> Reset
        </button>
      </div>

      <p><i>{form.error}</i></p>

    </form>

    <div className="mobx-react-form-devtools">
      <DebugForm form={form} />
    </div>
  </div>
);

FormRegister.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormRegister);
