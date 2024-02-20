# Model inputs

Model inputs are a way to define a signal-based input that automatically emits its value when it changes.

<div class="alert is-helpful">

Model inputs are currently in [developer preview](/guide/releases#developer-preview).

</div>

For example, using `model` in the directive below will expose an input called `value` that allows for the value to be set through a data binding and an ouput called `valueChange` that will emit when calling `value.set` or `value.update`.

```typescript
import {Directive, model} from '@angular/core';

@Directive({
  selector: 'input[my-dir]',
  standalone: true,
})
export class MyDir {
  value = model('');
}
```

When binding to `value` using a two-way binding, the value of `myProperty` and `value` will be kept in sync automatically:

```typescript
import {Component} from '@angular/core';
import {MyDir} from './my-dir';

@Component({
  template: '<input my-dir [(value)]="myProperty"/>',
  imports: [MyDir],
  standalone: true,
})
export class MyDir {
  myProperty = model('hello');
}
```

Angular supports two variants of model inputs:

**Optional model inputs**
Model inputs are optional by default, unless you use `model.required`.
You can specify an explicit initial value, or Angular will use `undefined` implicitly.

**Required model inputs**
Required model inputs always have a value of the given input type.
They are declared using the `model.required` function.

```typescript
import {Component, input} from '@angular/core';

@Component({...})
export class MyComp {
  // optional
  firstName = model<string>();         // ModelSignal<string|undefined>
  age = model(0);                      // ModelSignal<number>

  // required
  lastName = model.required<string>(); // ModelSignal<string>
}
```

A model input is automatically recognized by Angular whenever you use the `model` or `model.required` functions as initializer of class members.

## Differences between `model()` and `input()`

Both `input()` and `model()` functions are ways to define signal-based inputs in Angular, but they differ in a few ways:
1. `model()` defines **both** an input and an output. The output's name is always the name of the input suffixed with `Change` to support two-way bindings. It will be up to the consumer of your directive to decide if they want to use just the input, just the output, or both.
2. `ModelSignal` is a `WritableSignal` which means that its value can be changed from anywhere using the `set` and `update` methods. When a new value is assigned, the `ModelSignal` will emit to its output. This is different from `InputSignal` which is read-only and can only be changed through the template.
3. Model inputs do not support input transforms while signal inputs do.


## Aliasing a model

Angular uses the class member name as the name of the model input.
You can alias models to change their public name to be something different.

```typescript
class StudentDirective {
  age = model(0, {alias: 'studentAge'});
}
```

This exposes a `studentAge` input and a `studentAgeChange` output on the `StudentDirective`.

## Using in templates

Model inputs are writable signals. As with signals declared via `signal()`, you access the current value of the model by calling the model signal.

```html
<p>First name: {{firstName()}}</p>
<p>Last name: {{lastName()}}</p>
```

This access to the value is captured in reactive contexts and can notify active consumers, like Angular itself, whenever the value changes.

A model signal in practice is an extension of `WritableSignal` that you know from [the signals guide](/guide/signals#writable-signals).

```typescript
export class ModelSignal<T> extends WritableSignal<T> { ... }`.
```
