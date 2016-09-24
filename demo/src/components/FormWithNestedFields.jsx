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

        {form.$map('address', field =>
          <div key={field.key}>
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

        <div className="ctrl">
          <button
            type="submit"
            onClick={form.$('address').add}
          >+ Add Field</button>
        </div>

        <br />
        <br />
        <div className="ctrl">
          <button
            type="submit"
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
    </div>
  </div>
);

FormWithNestedFields.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormWithNestedFields);
