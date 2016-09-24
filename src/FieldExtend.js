// import { action } from 'mobx';
import _ from 'lodash';
import Field from './Field';

/**
  Fields Extend
*/
export default $this => ({

  /**
    Add Field
  */
  add: (e) => {
    e.preventDefault();
    const $n = _.random(999, 9999);
    _.extend($this.fields, {
      [$n]: new Field($n, null, { $label: '' }),
    });
    console.log('add field');
  },

  /**
    Delete Field
  */
  del: (e) => {
    e.preventDefault();
    console.log('del field');
  },

});
