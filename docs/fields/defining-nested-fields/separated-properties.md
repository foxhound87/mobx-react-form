## Defining Nested Fields as Separated Properties

### Define Nested Empty Fields

Define the fields `structure` using dot notation and array notation in an array of strings.

> The `label` will be automatically named using the field `name`

```javascript
const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
  'members[].hobbies[]',
];

new Form({ fields, ... });

```

### Defining Nested Values

Provide a `values` object with only the initial state. You can use array of object too.

```javascript
const values = {
  club: 'The Club Name',
  members: [{
    firstname: 'Clint',
    lastname: 'Eastwood',
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: 'Charlie',
    lastname: 'Chaplin',
    hobbies: ['Golf', 'Basket'],
  }],
};

new Form({ fields, values, ... });
```

You can use the `values` object as the `fields` if you want to omit the fields `structure` (not recommended).

### Defining Nested Property

You can define these properties:

`fields`, `values`, `labels`, `placeholders`, `defaults`, `disabled`, `related`, `bindings`, `types`, `options`, `extra`, `hooks`, `handlers`.

Validation properties `rules` (DVR) and `validators` (VJF) can be defined as well.

###### Using Dot Notation & Array Notation

You can set a property for each fields separately creating an object and passing it to the form costructor:

```javascript
const labels = {
  'club': 'Label Club',
  'club.name': 'Label Club Name',
  'club.city': 'Label Club City',
  'members': 'Label Members',
  'members[].firstname': 'Label Member FirstName',
  'members[].lastname': 'Label Member LastName',
  'members[].hobbies': 'Label Member Hobby',
};

new Form({ fields, values, labels, ... });
```

###### As Nested Objects

```javascript
const labels = {
  state: {
    city: {
      places: {
        centralPark: 'Central Park',
        statueOfLiberty: 'Statue of Liberty',
        empireStateBuilding: 'Empire State Building',
        brooklynBridge: 'Brooklyn Bridge',
      },
    },
  },
};
```

### Define `bindings` prop for Nested Fields

You can define the **bindings** name of a pre-defined `rewriter` or `template`.

```javascript
...

const bindings = {
  'club.name': 'MaterialTextField',
  'club.city': 'MaterialTextField',
  'members[].firstname': 'MaterialTextField',
  'members[].lastname': 'MaterialTextField',
  'members[].hobbies': 'MaterialTextField',
}

new Form({ bindings, ... });
```

[Read how to create new bidings here.](https://foxhound87.github.io/mobx-react-form/docs/bindings/)
