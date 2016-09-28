import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm } from './Debug';

const FormWithNestedFields = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left normal">
      <form onSubmit={form.handleOnSubmit}>
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
          </div>
        )}

        <br />

        <br />

        <div className="ctrl">
          <button onClick={form.$('club').handleOnClear}>Clear</button>
          <button onClick={form.$('club').handleOnReset}>Reset</button>
          <button
            onClick={form.$('club').handleAdd}
          >+ Add Field</button>
        </div>

        <hr />
        <br />
        <div className="ctrl">
          <button type="submit">Submit</button>
          <button onClick={form.handleOnClear}>Clear</button>
          <button onClick={form.handleOnReset}>Reset</button>
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
