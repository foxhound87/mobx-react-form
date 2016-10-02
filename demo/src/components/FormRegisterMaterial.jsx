import React from 'react';
import { observer } from 'mobx-react';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { DebugForm } from './Debug';

const FormRegister = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left material">
      <form>
        <h2>Form Register</h2>
        <h4>Material UI</h4>

        <TextField
          name={form.$('username').name}
          value={form.$('username').value}
          floatingLabelText={form.$('username').label}
          errorText={form.$('username').error}
          onChange={form.$('username').sync}

        /><br />

        <TextField
          name={form.$('email').name}
          value={form.$('email').value}
          floatingLabelText={form.$('email').label}
          errorText={form.$('email').error}
          onChange={form.$('email').sync}

        /><br />

        <TextField
          name={form.$('emailConfirm').name}
          value={form.$('emailConfirm').value}
          floatingLabelText={form.$('emailConfirm').label}
          errorText={form.$('emailConfirm').error}
          onChange={form.$('emailConfirm').sync}

        /><br />

        <TextField
          name={form.$('password').name}
          value={form.$('password').value}
          floatingLabelText={form.$('password').label}
          errorText={form.$('password').error}
          onChange={form.$('password').sync}

        /><br />

        <TextField
          name={form.$('devSkills').name}
          value={form.$('devSkills').value}
          floatingLabelText={form.$('devSkills').label}
          errorText={form.$('devSkills').error}
          onChange={form.$('devSkills').sync}

        /><br />

        <br />
        <Toggle
          labelPosition="right"
          label={form.$('terms').label}
          name={form.$('terms').name}
          defaultToggled={form.$('terms').value}
          onToggle={form.$('terms').sync}
        />
        <div>
          <i>{form.$('terms').error}</i>
        </div>

        <br />
        <div className="ctrl">
          <button type="submit" onClick={form.onSubmit}>Submit</button>
          <button type="button" onClick={form.onClear}>Clear</button>
          <button type="button" onClick={form.onReset}>Reset</button>
        </div>

        <p><i>{form.error}</i></p>

      </form>
    </div>
    <div className="splitted-65 container-right">
      <DebugForm form={form} />
    </div>
  </div>
);

FormRegister.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormRegister);
