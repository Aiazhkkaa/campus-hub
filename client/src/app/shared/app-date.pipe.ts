import { formatDate } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18n } from '../core/i18n';

/** Like the `date` pipe, but always in the language the user picked. Default: "Tue, 18 Nov · 13:00" */
@Pipe({ name: 'appDate', pure: false })
export class AppDatePipe implements PipeTransform {
  private readonly i18n = inject(I18n);

  transform(value: string | Date, format = 'EEE, d MMM · HH:mm'): string {
    return formatDate(value, format, this.i18n.locale());
  }
}
