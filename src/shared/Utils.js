import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Utils
*/
export default {

  pathToFieldsTree(path, n = 0) {
    const $ss = this.state.struct();
    const structPath = utils.pathToStruct(path);
    const structArray = _.filter($ss, item => _.startsWith(item, structPath));
    const tree = parser.handleFieldsArrayOfStrings(structArray);
    const struct = _.replace(structPath, new RegExp('\\[]', 'g'), `[${n}]`);
    return parser.handleFieldsNested(_.get(tree, struct));
  },

};

