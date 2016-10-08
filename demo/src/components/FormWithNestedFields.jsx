import React from 'react';
import { observer } from 'mobx-react';
import { DebugForm } from './Debug';


const HobbiesFields = observer(({ form, field }) => (
  <div>
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
          <button type="button" onClick={e => form.onDel(e, hobby.path)}>X</button>
          <button type="button" onClick={hobby.onClear}>Clear</button>
          <button type="button" onClick={hobby.onReset}>Reset</button>
        </span>
      </div>
    )}
  </div>
));

const MembersFields = observer(({ form }) => (
  <div>
    {form.map('members', field =>
      <div key={field.key}>
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
        <span className="ctrl">
          <button type="button" onClick={e => form.$('members').onDel(e, field.key)}>X</button>
          <button type="button" onClick={field.onClear}>Clear</button>
          <button type="button" onClick={field.onReset}>Reset</button>
          <button type="button" onClick={e => field.onAdd(e, 'hobbies')}>+ Add Hobby</button>
        </span>
        <hr />
        <HobbiesFields form={form} field={field} />
        <hr />
      </div>
    )}
  </div>
));

const FormWithNestedFields = observer(({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left normal">
      <form>
        <h2>Nested Fields</h2>

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

        <div className="ctrl">
          <button type="button" onClick={form.$('club').onClear}>Clear Club</button>
          <button type="button" onClick={form.$('club').onReset}>Reset Club</button>
        </div>

        <hr />
        <button type="button" onClick={e => form.$('members').onAdd(e)}>+ Add Member</button>
        <hr />

        {<MembersFields form={form} />}

        <br />
        <br />

        <div className="ctrl">
          <button type="button" onClick={form.$('members').onClear}>Clear Members</button>
          <button type="button" onClick={form.$('members').onReset}>Reset Members</button>
        </div>

        <hr />
        <br />
        <div className="ctrl">
          <button type="submit" onClick={form.onSubmit}>Submit</button>
          <button type="button" onClick={form.onClear}>Clear All</button>
          <button type="button" onClick={form.onReset}>Reset All</button>
        </div>

        <p><i>{form.error}</i></p>

      </form>
    </div>
    <div className="splitted-65 container-right">
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
