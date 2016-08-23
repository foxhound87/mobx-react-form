import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm, DebugField } from './Debug';

const FormCompany = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left">
      <form>
        <h2>Form Company</h2>
        <div>
          {form.fields.name.label}
          <i>{form.fields.name.error}</i>
        </div>
        <input
          type="text"
          name={form.fields.name.name}
          value={form.fields.name.value}
          placeholder={form.fields.name.label}
          onChange={form.syncValue}
        />

        <div>
          {form.fields.revenue.label}
          <i>{form.fields.revenue.error}</i>
        </div>
        <input
          type="text"
          name={form.fields.revenue.name}
          value={form.fields.revenue.value}
          placeholder={form.fields.revenue.label}
          onChange={form.syncValue}
        />

        <div>
          {form.fields.assets.label}
          <i>{form.fields.assets.error}</i>
        </div>
        <input
          type="text"
          name={form.fields.assets.name}
          value={form.fields.assets.value}
          placeholder={form.fields.assets.label}
          onChange={form.syncValue}
        />

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

        <p><i>{form.genericError}</i></p>

      </form>
    </div>
    <div className="splitted-65 container-right">
      <DebugForm form={form} />
      <hr />
      <DebugField field={form.fields.name} />
      <DebugField field={form.fields.revenue} />
      <DebugField field={form.fields.assets} />
    </div>
  </div>
);

FormCompany.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormCompany);
