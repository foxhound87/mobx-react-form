import _ from 'lodash';

/**
  Register lodash Mixins
*/

_.mixin({
  // hasEvery: (obj, keys) => _.every(keys, _.partial(_.has, obj)),
  hasSome: (obj, keys) => _.some(keys, _.partial(_.has, obj)),
},
{ chain: false });
