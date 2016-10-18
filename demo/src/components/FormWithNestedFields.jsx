import React from 'react';
import { observer } from 'mobx-react';
import DebugForm from './Debug';

const HobbiesFields = observer(({ form, fields }) => (
  <fieldset>
    <div className="clearfix">
      <div className="left">{fields.$('hobbies').label}</div>
      <div className="right">
        <button type="button" onClick={e => fields.$('hobbies').onAdd(e)}>
          <i className="fa fa-plus-circle" data-tip="Add Hobby" />
        </button>
      </div>
    </div>
    <hr />
    {fields.$('hobbies').map(hobby =>
      <div key={hobby.key}>
        <span key={hobby.name}>
          <div>
            <i>{hobby.error}</i>
          </div>
          <input
            type="text"
            placeholder="hobby"
            name={hobby.name}
            value={hobby.value}
            onChange={hobby.sync}
          />
        </span>
        <span>
          <button type="button" onClick={e => form.onDel(e, hobby.path)}>
            <i className="fa fa-times-circle" data-tip="Remove" />
          </button>
          <button type="button" onClick={hobby.onClear}>
            <i className="fa fa-eraser" data-tip="Clear" />
          </button>
          <button type="button" onClick={hobby.onReset}>
            <i className="fa fa-refresh" data-tip="Reset" />
          </button>
        </span>
      </div>
    )}
  </fieldset>
));

const MembersFields = observer(({ form }) => (
  <div>
    <div className="clearfix">
      <div className="left">
        <b>{form.$('members').label}</b>
      </div>
      <div className="right">
        <button type="button" onClick={form.$('members').onClear}>
          <i className="fa fa-eraser" data-tip="Clear All Members" />
        </button>
        <button type="button" onClick={form.$('members').onReset}>
          <i className="fa fa-refresh" data-tip="Reset All Members" />
        </button>
      </div>
    </div>
    <hr />
    {form.$('members').map(fields =>
      <fieldset key={fields.key} className="center">
        <div key={fields.$('firstname').name}>
          <div>
            <b>{fields.$('firstname').label}</b>
            <i>{fields.$('firstname').error}</i>
          </div>
          <input
            type="text"
            name={fields.$('firstname').name}
            value={fields.$('firstname').value}
            placeholder={fields.$('firstname').label}
            onChange={fields.$('firstname').sync}
          />
        </div>
        <div key={fields.$('lastname').name}>
          <div>
            <b>{fields.$('lastname').label}</b>
            <i>{fields.$('lastname').error}</i>
          </div>
          <input
            type="text"
            name={fields.$('lastname').name}
            value={fields.$('lastname').value}
            placeholder={fields.$('lastname').label}
            onChange={fields.$('lastname').sync}
          />
        </div>
        <br />
        <span>
          <button type="button" onClick={e => form.$('members').onDel(e, fields.key)}>
            <i className="fa fa-times-circle" data-tip="Remove Member" />
          </button>
          <button type="button" onClick={fields.onClear}>
            <i className="fa fa-eraser" data-tip="Clear Member" />
          </button>
          <button type="button" onClick={fields.onReset}>
            <i className="fa fa-refresh" data-tip="Reset Member" />
          </button>
        </span>

        <br />
        <br />

        <HobbiesFields form={form} fields={fields} />

      </fieldset>
    )}
  </div>
));

const FormWithNestedFields = observer(({ form }) => (
  <div className="container normal">
    <form>
      <h2>Nested Fields</h2>

      <div className="clearfix">
        <div className="left">
          <b>{form.$('club').label}</b>
        </div>
        <div className="right">
          <button type="button" onClick={form.$('club').onClear}>
            <i className="fa fa-eraser" data-tip="Clear Club" />
          </button>
          <button type="button" onClick={form.$('club').onReset}>
            <i className="fa fa-refresh" data-tip="Reset Club" />
          </button>
        </div>
      </div>
      <hr />
      <fieldset className="center">
        <div>
          <b>{form.$('club.name').label}</b>
          <i>{form.$('club.name').error}</i>
        </div>
        <input
          type="text"
          name={form.$('club.name').name}
          value={form.$('club.name').value}
          placeholder={form.$('club.name').label}
          onChange={form.$('club.name').sync}
        />

        <div>
          <b>{form.$('club.city').label}</b>
          <i>{form.$('club.city').error}</i>
        </div>
        <input
          type="text"
          name={form.$('club.city').name}
          value={form.$('club.city').value}
          placeholder={form.$('club.city').label}
          onChange={form.$('club.city').sync}
        />

        <br />
        <br />
        <div>
          <button type="button" onClick={form.$('club').onClear}>
            <i className="fa fa-eraser" data-tip="Clear Club" />
          </button>
          <button type="button" onClick={form.$('club').onReset}>
            <i className="fa fa-refresh" data-tip="Reset Club" />
          </button>
        </div>
      </fieldset>

      <br />
      <br />

      {<MembersFields form={form} />}

      <br />
      <div className="ctrl">
        <button type="submit" onClick={form.onSubmit}>
          <i className="fa fa-dot-circle-o" /> Submit
        </button>
        <button type="button" onClick={form.onClear}>
          <i className="fa fa-eraser" /> Clear All
        </button>
        <button type="button" onClick={form.onReset}>
          <i className="fa fa-refresh" /> Reset All
        </button>
      </div>

      <p><i>{form.error}</i></p>

    </form>

    <div className="mobx-react-form-devtools">
      <DebugForm form={form} />
    </div>
  </div>
));

MembersFields.propTypes = {
  form: React.PropTypes.object,
};

FormWithNestedFields.propTypes = {
  form: React.PropTypes.object,
};

export default FormWithNestedFields;
