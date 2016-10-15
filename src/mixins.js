import _ from 'lodash';

/**
  Lodash Mixins
*/

export default {
   // hasEvery: (obj, keys) => _.every(keys, _.partial(_.has, obj)),
  hasSome: (obj, keys) => _.some(keys, _.partial(_.has, obj)),
};
