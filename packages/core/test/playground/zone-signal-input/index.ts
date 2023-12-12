/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, computed, Directive, Input, signal, ɵinput as input, inject} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

@Directive({
  selector: '[listbox]',
  standalone: true,
  host: {
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class Listbox {
  value = input.required({transform: v => `${v}`});
  disabled = input(false, {transform: v => v != null && `${v}` !== 'false'});
}

@Directive({
  selector: '[option]',
  standalone: true,
  host: {
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-selected]': 'isSelected()',
  }
})
export class Option {
  private listbox = inject(Listbox);

  value = input.required({transform: v => `${v}`});
  disabled = input(false, {transform: v => v != null && `${v}` !== 'false'});

  protected isDisabled = computed(() => this.listbox.disabled() || this.disabled());
  protected isSelected = computed(() => this.listbox.value() === this.value());
}

@Component({
  selector: 'greet',
  standalone: true,
  imports: [Listbox, Option],
  template: `
    {{ counter() }} -- {{label()}}
    
    <ul listbox value="3">
      @for (v of [1, 2, 3, 4, 5]; track $index) {
        <li option [value]="v" [disabled]="v === 2">{{v}}</li>
      }
    </ul>
  `,
})
export class Greet<T> {
  counter = input(0);
  bla = input();  // TODO: should be a diagnostic. no type & no value
  bla2 = input<string>();
  bla3 = input.required<string>();
  bla4 = input(0, {alias: 'bla4Public'});
  gen = input.required<string>();
  gen2 = input.required<T>();

  label = input<string>();

  works(): T {
    return this.gen2();
  }

  // Eventually in signal components, a mix not allowed. For now, this is
  // supported though.
  @Input() oldInput: string|undefined;
}

@Component({
  standalone: true,
  selector: 'my-app',
  template: `
    Hello <greet [counter]="3" [bla4Public]="10" #ok
      [bla3]="someStringVar" gen='this is required' [gen2]="{yes: true}"
      label="Hello {{name()}}"
    />

    <button (click)="ok.works().yes">Click</button>
    <button (click)="updateName()">Change name</button>
  `,
  imports: [Greet],
})
export class MyApp {
  name = signal('Angular');
  someVar = -10;
  someStringVar = 'works';

  protected updateName() {
    this.name.update(n => `${n}-`);
  }

  onClickFromChild() {
    console.info('Click from child');
  }
}

bootstrapApplication(MyApp).catch((e) => console.error(e));
