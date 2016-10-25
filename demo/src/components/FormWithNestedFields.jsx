import React from 'react';
import { observer } from 'mobx-react';
import DebugForm from './Debug';

const HobbiesFields = observer(({ form, hobbies }) => (
  <fieldset>
    <div className="clearfix">
      <div className="left">{hobbies.label}</div>
      <div className="right">
        <button type="button" onClick={e => hobbies.onAdd(e)}>
          <i className="fa fa-plus-circle" data-tip="Add Hobby" />
        </button>
      </div>
    </div>
    <hr />
    {hobbies.map(hobby =>
      hobby && <div key={hobby.key}>
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
    {form.$('members').map(member =>
      member && <fieldset key={member.key} className="center">
        <div key={member.$('firstname').name}>
          <div>
            <b>{member.$('firstname').label}</b>
            <i>{member.$('firstname').error}</i>
          </div>
          <input
            type="text"
            name={member.$('firstname').name}
            value={member.$('firstname').value}
            placeholder={member.$('firstname').label}
            onChange={member.$('firstname').sync}
          />
        </div>
        <div key={member.$('lastname').name}>
          <div>
            <b>{member.$('lastname').label}</b>
            <i>{member.$('lastname').error}</i>
          </div>
          <input
            type="text"
            name={member.$('lastname').name}
            value={member.$('lastname').value}
            placeholder={member.$('lastname').label}
            onChange={member.$('lastname').sync}
          />
        </div>
        <br />
        <span>
          <button type="button" onClick={e => form.$('members').onDel(e, member.key)}>
            <i className="fa fa-times-circle" data-tip="Remove Member" />
          </button>
          <button type="button" onClick={member.onClear}>
            <i className="fa fa-eraser" data-tip="Clear Member" />
          </button>
          <button type="button" onClick={member.onReset}>
            <i className="fa fa-refresh" data-tip="Reset Member" />
          </button>
        </span>

        <br />
        <br />

        <HobbiesFields form={form} hobbies={member.$('hobbies')} />

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

export default FormWithNestedFields;
