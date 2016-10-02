import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm } from './Debug';

const FormWithNestedFields = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left normal">
      <form>
        <h2>Nested Fields (w/ selectors)</h2>

        <div>
          <b>{form.$('address.city').label}</b>
          <i>{form.$('address.city').error}</i>
        </div>
        <input
          type="text"
          name={form.$('address.city').name}
          value={form.$('address.city').value}
          placeholder={form.$('address.city').label}
          onChange={form.$('address.city').sync}
        />

        <div>
          <b>{form.$('address.street').label}</b>
          <i>{form.$('address.street').error}</i>
        </div>
        <input
          type="text"
          name={form.$('address.street').name}
          value={form.$('address.street').value}
          placeholder={form.$('address.street').label}
          onChange={form.$('address.street').sync}
        />

        <br />
        <br />

        <h2>Nested Fields (w/ mapping)</h2>

        <div>
          <b>{form.$('club').label}</b>
          <i>{form.$('club').error}</i>
        </div>
        <input
          type="text"
          name={form.$('club').name}
          value={form.$('club').value}
          placeholder={form.$('club').label}
          onChange={form.$('club').sync}
        />

        {form.map('club', field =>
          <div key={field.name}>
            <div>
              <b>{field.label}</b>
              <i>{field.error}</i>
            </div>
            <input
              type="text"
              name={field.name}
              value={field.value}
              placeholder={field.label}
              onChange={field.sync}
            />
            <span className="ctrl">
              <button
                type="button"
                onClick={e => form.$('club').onDel(e, field.name)}
              >X</button>
            </span>
          </div>
        )}

        <br />

        <br />

        <div className="ctrl">
          <button type="button" onClick={form.$('club').onClear}>Clear</button>
          <button type="button" onClick={form.$('club').onReset}>Reset</button>
          <button type="button" onClick={e => form.$('club').onAdd(e)}>+ Add Field</button>
        </div>

        <hr />
        <br />
        <div className="ctrl">
          <button type="submit" onClick={form.onSubmit} >Submit</button>
          <button type="button" onClick={form.onClear} >Clear</button>
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

FormWithNestedFields.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormWithNestedFields);
