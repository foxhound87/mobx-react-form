import { FormInterface } from "../../src/models/FormInterface";
import $flat from '../fixtures/_.flat';
import $nested from '../fixtures/_.nested';

import flat from '../fixtures/computed/_.flat';
import nested from '../fixtures/computed/_.nested';

flat.isValid($flat as Record<string, FormInterface>);
flat.hasError($flat as Record<string, FormInterface>);
flat.isDirty($flat as Record<string, FormInterface>);
flat.isEmpty($flat as Record<string, FormInterface>);
flat.isPristine($flat as Record<string, FormInterface>);
flat.isPristine($flat as Record<string, FormInterface>);

nested.isValid($nested as Record<string, FormInterface>);
