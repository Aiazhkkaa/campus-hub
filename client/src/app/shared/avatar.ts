import { Component, computed, input } from '@angular/core';
import { pastelFor } from '../core/labels';

/** Round picture with initials on a soft pastel colour when there is no photo. */
@Component({
  selector: 'app-avatar',
  template: `
    @if (url()) {
      <img [class]="'avatar avatar-' + size()" [src]="url()" [alt]="name()" />
    } @else {
      <span [class]="'avatar avatar-' + size() + ' art-' + color()" [attr.aria-label]="name()">{{ initials() }}</span>
    }
  `,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly url = input<string | null>(null);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly color = computed(() => pastelFor(this.name()));
  protected readonly initials = computed(() =>
    this.name()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join(''),
  );
}
