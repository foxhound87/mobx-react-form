/* eslint no-console: 0 */
/* eslint no-undef: 0 */

console.log('MobxReactForm', MobxReactForm);

const form = new MobxReactForm({
  email: 'test@test.com',
});

console.log('form', form);
console.log('form.values()', form.values());
console.log('form.update()', form.update({ email: 'test' }));
