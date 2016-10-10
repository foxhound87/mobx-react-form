import React from 'react';
import { observer } from 'mobx-react';
import DebugForm from './Debug';

const HobbiesFields = observer(({ form, field }) => (
  <fieldset>
    {field.map('hobbies', hobby =>
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
    {form.map('members', field =>
      <fieldset key={field.key}>
        <div key={field.$('firstname').name}>
          <div>
            <b>{field.$('firstname').label}</b>
            <i>{field.$('firstname').error}</i>
          </div>
          <input
            type="text"
            name={field.$('firstname').name}
            value={field.$('firstname').value}
            placeholder={field.$('firstname').label}
            onChange={field.$('firstname').sync}
          />
        </div>
        <div key={field.$('lastname').name}>
          <div>
            <b>{field.$('lastname').label}</b>
            <i>{field.$('lastname').error}</i>
          </div>
          <input
            type="text"
            name={field.$('lastname').name}
            value={field.$('lastname').value}
            placeholder={field.$('lastname').label}
            onChange={field.$('lastname').sync}
          />
        </div>
        <br />
        <span>
          <button type="button" onClick={e => form.$('members').onDel(e, field.key)}>
            <i className="fa fa-times-circle" data-tip="Remove" />
          </button>
          <button type="button" onClick={field.onClear}>
            <i className="fa fa-eraser" data-tip="Clear" />
          </button>
          <button type="button" onClick={field.onReset}>
            <i className="fa fa-refresh" data-tip="Reset" />
          </button>
        </span>

        <br />
        <br />
        <div className="clearfix">
          <div className="left">Hobbies</div>
          <div className="right">
            <button type="button" onClick={e => field.onAdd(e, 'hobbies')}>
              <i className="fa fa-plus-circle" data-tip="Add Hobby" />
            </button>
          </div>
        </div>
        <br />

        <HobbiesFields form={form} field={field} />

      </fieldset>
    )}
  </div>
));

const FormWithNestedFields = observer(({ form }) => (
  <div className="container normal">
    <form>
      <h2>Nested Fields</h2>

      <fieldset>
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

        <span className="ctrl">
          <button type="button" onClick={form.$('club').onClear}>
            <i className="fa fa-eraser" data-tip="Clear Club" />
          </button>
          <button type="button" onClick={form.$('club').onReset}>
            <i className="fa fa-refresh" data-tip="Reset Club" />
          </button>
        </span>
      </fieldset>

      <b>{form.$('members').label}</b>
      <br />
      <br />

      {<MembersFields form={form} />}

      <div className="ctrl">
        <button type="button" onClick={form.$('members').onClear}>
          <i className="fa fa-eraser" data-tip="Clear" /> Clear Members
        </button>
        <button type="button" onClick={form.$('members').onReset}>
          <i className="fa fa-refresh" data-tip="Reset" /> Reset Members
        </button>
      </div>

      <br />
      <br />
      <div className="ctrl">
        <button type="submit" onClick={form.onSubmit}>
          <i className="fa fa-dot-circle-o" data-tip="Submit" /> Submit
        </button>
        <button type="button" onClick={form.onClear}>
          <i className="fa fa-eraser" data-tip="Clear" /> Clear All
        </button>
        <button type="button" onClick={form.onReset}>
          <i className="fa fa-refresh" data-tip="Reset" /> Reset All
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
