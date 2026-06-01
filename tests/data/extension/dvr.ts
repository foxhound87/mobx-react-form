import _ from "lodash";
import simulateAsyncFindUserCall from "./_.async";

const asyncRules: Record<string, (value: any, attr: string, key: string, passes: Function) => void> = {
  checkUser: (value, attr, key, passes) => {
    const msg = `Hey! The :attribute ${value} is already taken.`;
    // show error if the call does not returns entries
    simulateAsyncFindUserCall(
      { user: value },
      _.lowerCase(attr) === "ignorecase"
    ).then((items: any) =>
      items.length === 0 ? passes() : passes(false, msg)
    );
  },
};

export default ({ validator }: { validator: any }) =>
  Object.keys(asyncRules).forEach((key) =>
    validator.registerAsync(key, asyncRules[key])
  );

// export default ({ validator }) => Object.keys(rules)
//   .forEach((key) => validator.register(key, rules[key].function, rules[key].message));
