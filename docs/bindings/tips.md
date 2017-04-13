# Tips

### How to set a custom rewriter/template to all fields.

Assume we have already definend a cutom `rewriter`/`template` named `MaterialTextField`.

We want to assign it to all `text` fields.

For this purpose we can use the `each()` method to iterate all field and nested fields:

```javascript
class MyForm extends Form {

  onInit() {
    this.each(field => field.type === 'text' &&
      field.set('bindings', 'MaterialTextField'));
  }
}
```

