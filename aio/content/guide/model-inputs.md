# Model inputs

**Model inputs** are a special type of input that enable a component to propagate new values
back to another component.

<div class="alert is-helpful">

Model inputs are currently in [developer preview](/guide/releases#developer-preview).

</div>

When creating a component, you can define a model input similarly to how you create a standard
input.

```typescript
import {Directive, model, input} from '@angular/core';

@Directive({...})
export class CustomCheckbox {
  // This is a model input.
  checked = model(false);

  // This is a standard input.
  disabled = input(false);
}
``` 

Both types of input allow someone to bind a value into the property. However, **model inputs allow
the component author to write values into the property**.

In other respects, you can use model inputs the same way you use standard inputs. You can read the
value by calling the signal function, including in reactive contexts like `computed` and `effect`.

```typescript
import {Directive, model, input} from '@angular/core';

@Directive({
  selector: 'custom-checkbox',
  template: '<div (click)="toggle()"> ... </div>',
})
export class CustomCheckbox {
  checked = model(false);
  disabled = input(false);

  toggle() {
    // While standard inputs are read-only, you can write directly to model inputs.
    this.checked.set(!this.checked());
  }
}
``` 

When a component writes a new value into a model input, Angular can propagate the new value back
to the component that is binding a value into that input. This is called **two-way binding** because
values can flow in both directions.

## Two-way binding with signals

You can bind a writable signal to a model input.

```typescript
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = signal(false);
}
```

In the above, the `CustomCheckbox` can write values into its `checked` model input, which then
propagates those values back to the `isAdmin` signal in `UserProfile`. This binding keeps that
values of `checked` and `isAdmin` in sync. Notice that the binding passes the `isAdmin` signal
itself, not the _value_ of the signal.

## Two-way binding with plain properties

You can bind a plain JavaScript property to a model input.

```typescript
@Component({
  ...,
  // `checked` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-checkbox [(checked)]="isAdmin" />',
})
export class UserProfile {
  protected isAdmin = false;
}
```

In the above, the `CustomCheckbox` can write values into its `checked` model input, which then
propagates those values back to the `isAdmin` property in `UserProfile`. This binding keeps that
values of `checked` and `isAdmin` in sync.

## Implicit `change` events

When you declare a model input in a component or directive, Angular automatically creates a
corresponding [output](inputs-outputs) for that model. The output's
name is the model input's name suffixed with "Change".

```typescript
@Directive({...})
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  checked = model(false);
}
```

Angular emits this change event whenever you write a new value into the model input by calling
its `set` or `update` methods.

## Customizing model inputs

You can mark a model input as required or provide an alias in the same way as a
[standard input](./signal-inputs).

Model inputs do not support input transforms.

## When to use model inputs

Use model inputs in components that exist to modify a value based on user interaction.
Custom form controls, such as a date picker or combobox, should use model inputs for their
primary value.

Avoid using model inputs as a convenience to avoid introducing an additional class property for
containing local state.
