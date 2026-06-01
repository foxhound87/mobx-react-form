import simulateAsyncFindUserCall from "./_.async";

const extend: {
  keywords: Record<string, any>;
} = {
  keywords: {
    range: {
      type: "number",
      compile: (sch: number[], parentSchema: { exclusiveRange?: boolean }) => {
        const min = sch[0];
        const max = sch[1];

        return parentSchema.exclusiveRange === true
          ? (data: number) => data > min && data < max
          : (data: number) => data >= min && data <= max;
      },
    },
    checkUser: {
      async: true,
      validate: (field: string, value: any) =>
        simulateAsyncFindUserCall({ [field]: value }).then(
          (items: any) => items.length === 0
        ),
    },
  },
  // formats: {},
};

export default ({ validator }: { validator: any }) => {
  Object.keys(extend.keywords).forEach((key) =>
    validator.addKeyword(key, extend.keywords[key])
  );
  // Object.keys(extend.formats).forEach(key => validator.addFormat(key, extend.formats[key]));
};
