// FORMS
import { FormInterface } from "../../src/models/FormInterface";
import $flat from "../fixtures/_.flat";
import $nested from "../fixtures/_.nested";
import $fixes from "../fixtures/_.fixes";

// TESTS
import flat from "../fixtures/promises/_.flat";
import nested from "../fixtures/promises/_.nested";
import fixes from "../fixtures/promises/_.fixes";

flat.validate($flat as Record<string, FormInterface>);
nested.validate($nested as Record<string, FormInterface>);
fixes.validate($fixes as Record<string, FormInterface>);
