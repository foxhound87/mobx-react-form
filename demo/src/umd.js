/* eslint no-console: 0 */
/* eslint no-undef: 0 */

console.log('MobxReactForm', MobxReactForm);

const form = new MobxReactForm({
  email: 'test@test.com',
});

console.log('form', form);
console.log('form.get()', form.get('values'));
console.log('form.set()', form.set({ email: 'test' }));
