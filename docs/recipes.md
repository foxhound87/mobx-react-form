# Recipes & Common Patterns

Practical examples of real-world form scenarios with mobx-react-form.

---

## Dependent Fields

Validate one field based on the value of another:

```javascript
import { Form } from 'mobx-react-form';

const fields = {
  country: {
    label: 'Country',
    value: 'US',
  },
  state: {
    label: 'State',
    rules: 'required|string',
  },
};

const hooks = {
  onChange(form) {
    // Clear state when country changes
    if (form.$('country').changed) {
      form.$('state').reset();
    }
  },
};

const form = new Form({ fields }, { hooks });
```

---

## Conditional Validation

Apply different validation rules based on another field's value:

```javascript
// Custom VJF validator
function requiredIf(conditionField, conditionValue) {
  return ({ field, form }) => {
    const conditionMet = form.$(conditionField).value === conditionValue;
    if (!conditionMet) return [true]; // skip validation
    const isValid = field.value && field.value.length > 0;
    return [isValid, `The ${field.label} is required.`];
  };
}

const fields = {
  subscribe: {
    label: 'Subscribe to newsletter',
    type: 'checkbox',
    value: false,
  },
  email: {
    label: 'Email',
    validators: [requiredIf('subscribe', true)],
  },
};
```

---

## Multi-Step / Wizard Forms

Use the Forms Composer to manage multi-step flows:

```javascript
import { composer } from 'mobx-react-form/lib/composer';
import StepOneForm from './StepOneForm';
import StepTwoForm from './StepTwoForm';
import StepThreeForm from './StepThreeForm';

const forms = composer({
  step1: new StepOneForm(),
  step2: new StepTwoForm(),
  step3: new StepThreeForm(),
});

// Navigate steps
function nextStep(currentStep) {
  const current = forms.select(currentStep);
  current.submit({
    onSuccess: () => {
      if (currentStep === 'step3') {
        forms.submit().then(({ forms }) => {
          console.log('All steps valid!', forms);
        });
      }
    },
    onError: () => alert('Fix errors before proceeding'),
  });
}
```

---

## Dynamic Array Fields

Add and remove fields from an array dynamically:

```javascript
const fields = [
  'hobbies',
  'hobbies[]',
];

const values = {
  hobbies: ['Soccer', 'Baseball'],
};

const form = new Form({ fields, values });

// Add a new hobby
form.$('hobbies').add({ value: 'Tennis' });

// Remove the second hobby (index 1)
form.$('hobbies').del(1);

// Remove by path
form.del('hobbies[0]');
```

---

## File Upload with Preview

```javascript
const fields = {
  avatar: {
    label: 'Profile Picture',
    type: 'file',
    hooks: {
      onDrop(field) {
        const file = field.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            field.set('extra', {
              previewUrl: e.target.result,
              fileName: file.name,
              fileSize: file.size,
            });
          };
          reader.readAsDataURL(file);
        }
      },
    },
  },
};
```

---

## Debounced Search / Autocomplete

Use the built-in debounced validation for search-as-you-type:

```javascript
const fields = {
  search: {
    label: 'Search',
    rules: 'min:3',
  },
};

const options = {
  validationDebounceWait: 400,  // wait 400ms after typing
  validateOnChange: true,
};

const hooks = {
  onSuccess(form) {
    if (form.$('search').changed) {
      performSearch(form.$('search').value);
    }
  },
};

const form = new Form({ fields }, { options, hooks });
```

---

## Reset to Specific Values

Use `set()` followed by `resetValidation()` to restore specific state:

```javascript
function resetToPreset(form, preset) {
  form.set('value', preset);
  form.resetValidation(true);
}
```

---

## Check if Any Field is Dirty Across Nested Fields

```javascript
const isFormDirty = form.changed > 0;
// or for the whole form tree:
const isAnyDirty = form.check('isDirty', true);
```

---

## Invalidate with Async Error

Mark a field as invalid after an API call:

```javascript
form.submit({
  onSuccess: (form) => {
    api.createUser(form.values())
      .catch((error) => {
        // Server returned a field-level error
        form.$('email').invalidate(error.email);
        // Or set a generic form error
        form.invalidate('Unable to create account. Please try again.');
      });
  },
});
```

---

## Computed Values Example

Automatically compute a total from array fields:

```javascript
const computed = {
  'products[].total': ({ field }) => {
    const qty = field.container()?.$('qty')?.value || 0;
    const amount = field.container()?.$('amount')?.value || 0;
    return qty * amount;
  },
  total: ({ form }) =>
    form.$('products')?.reduce(
      (acc, f) => acc + (f.$('total')?.value || 0), 0
    ),
};
```

---

## Tips

- Use `strictSelect: false` if you access fields via computed props before they are fully initialized.
- Use `validateOnChangeAfterInitialBlur: true` to only validate on change after the user has left the field once.
- Use `autoTrimValue: true` to automatically trim whitespace from string values.
