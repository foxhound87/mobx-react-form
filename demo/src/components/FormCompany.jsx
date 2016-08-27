import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm, DebugField } from './Debug';

const products = ['iPhone', 'Watch', 'iMac', 'Mac Pro', 'MacBook Air', 'MacBook Pro'];

const FormCompany = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left">
      <form>
        <h2>Form Company</h2>

        <div>
          {form.$('name').label}
          <i>{form.$('name').error}</i>
        </div>
        <input
          type="text"
          name={form.$('name').name}
          value={form.$('name').value}
          placeholder={form.$('name').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('revenue').label}
          <i>{form.$('revenue').error}</i>
        </div>
        <input
          type="text"
          name={form.$('revenue').name}
          value={form.$('revenue').value}
          placeholder={form.$('revenue').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('assets').label}
          <i>{form.$('assets').error}</i>
        </div>
        <input
          type="text"
          name={form.$('assets').name}
          value={form.$('assets').value}
          placeholder={form.$('assets').label}
          onChange={form.syncValue}
        />

        <div>
          {form.$('products').label}
          <i>{form.$('products').error}</i>
        </div>
        <select
          value={form.$('products').value}
          name={form.$('products').name}
          onChange={form.syncValue}
        >
          <option />
          {products.map((val) =>
            <option value={val} key={val}>{val}</option>
          )}
        </select>

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
      <DebugField field={form.fields.name} />
      <DebugField field={form.fields.revenue} />
      <DebugField field={form.fields.assets} />
      <DebugField field={form.fields.products} />
    </div>
  </div>
);

FormCompany.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormCompany);
