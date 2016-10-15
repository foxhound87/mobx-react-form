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

You can use this object as the `fields` if you want to omit the fields `structure`.

### Defining Nested Property

You can do it for these properties: `labels`, `defaults`, `disabled`, `related`.

And for the validation as well using `rules` for DVR Mode and `validate` for VJF Mode.

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
