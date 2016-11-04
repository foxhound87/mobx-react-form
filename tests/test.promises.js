import $flat from './data/_.flat';
import $nested from './data/_.nested';

import flat from './promises/_.flat';
import nested from './promises/_.nested';

flat.validate($flat);
nested.validate($nested);
