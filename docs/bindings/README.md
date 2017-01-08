# Fields Properties Bindings

With **Bindings** you can easly pass the fields properties to the input components.

It has many advantages: reduce code boilerplate and errors, better mainteninance and readability or handle props fallback.

 * [Default Bindings](default.md)
 * [Custom Bindings](custom.md)


<br>

## How it works

The binding system works with two modes:

* **REWRITER**: an object which assigns the **fields props names** to the **components props names**.
* **TEMPLATE**: an function which assigns the **components props names** to the **fields props values**.


Use the **Rewrite** mode if you need a simple a synthetic way to map custom components properties and you are ok using the defaults props priorities and fallbacks.

Use the **Template** mode if you need to redefine your properties priorities/fallbacks, customize the Event Handlers or reimplement the bindings from scratch.

More info on how to implement custom `rewriters`/`templates` can be found in the [Custom Bindings](custom.md) section.
