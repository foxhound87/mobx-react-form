## Async Vanilla Javascript Validation Functions (VJF)

### Define a function that returns a `promise`

After the promise is done, we get the result and pass them to a function which returns an array with two elements: the first element is the validation condition, the second is a string with the error message.

```javascript
export function checkUser({ field }) {
  const msg = `Hey! The username ${field.value} is already taken.`;
  // show error if the call does not returns entries
  return simulateAsyncFindUserCall({ user: field.value })
    .then((items) => [(items.length === 0), msg]);
}
```
