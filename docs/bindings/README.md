# Fields Properties Bindings

With **Bindings** you can easly pass the fields properties to the input components.


### [Default Bindings](default.md)
  * [Simple Usage](default.md#simple-usage)
  * [Properties Overwrite](default.md#properties-overwrite)


  * [Defaults Bindings](default.md#warning)
    * [Default Rewriter](default.md#default-rewriter)
    * [Default Template](default.md#default-template)

### [Custom Bindings](custom.md)
  * [Implement a Rewriter](custom.md#implement-a-rewriter)
  * [Implement a Template](custom.md#implement-a-template)

---

## Why should I use Bindings?

Bindings has many advantages:

- reduce code boilerplate and errors
- better mainteninance and readability
- handle props fallback / overwrite.
- reimplement the event handlers.


## How it works

The binding system works with two modes:

* **REWRITER**: an object which assigns the **component props names** to the **fields props names**.
* **TEMPLATE**: a function which assigns the  **fields props values** to the **component props names**.


Use the **Rewrite Mode** if you need a simple a synthetic way to map custom components properties and you are ok using the defaults props priorities and fallbacks.

Use the **Template Mode** if you need to redefine your properties priorities/fallbacks, customize the Event Handlers or reimplement the bindings from scratch.

More info on how to implement custom `rewriters`/`templates` can be found in the [Custom Bindings](custom.md) section, otherwise if you are using default html inputs you don't need them, see the [Default Bindings](default.md) section.
