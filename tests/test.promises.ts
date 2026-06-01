// FORMS
import { FormInterface } from "../src/models/FormInterface";
import $flat from "./data/_.flat";
import $nested from "./data/_.nested";
import $fixes from "./data/_.fixes";

// TESTS
import flat from "./promises/_.flat";
import nested from "./promises/_.nested";
import fixes from "./promises/_.fixes";

flat.validate($flat as Record<string, FormInterface>);
nested.validate($nested as Record<string, FormInterface>);
fixes.validate($fixes as Record<string, FormInterface>);
