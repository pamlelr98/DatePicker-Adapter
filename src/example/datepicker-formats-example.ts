import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const moment = _rollupMoment || _moment;

export class CustomDateAdapter extends NativeDateAdapter {
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  override format(date: Date, displayFormat: Object): string {
    const day = this.padToTwo(date.getDate());
    const month = this.padToTwo(date.getMonth() + 1);
    const year = date.getFullYear();

    console.log('displayFormat', displayFormat);

    const formatMapping = {
      'DD.MM.YYYY': `${day}.${month}.${year}`,
      'DD/MM/YYYY': `${day}/${month}/${year}`,
      'MM/DD/YYYY': `${month}/${day}/${year}`,
      'MMM YYYY': `${this.monthNames[date.getMonth()]} ${year}`,
    };

    const formattedDate = formatMapping['DD.MM.YYYY'];
    if (!formattedDate) {
      throw new Error(`Date format ${displayFormat} not supported`);
    }

    return formattedDate;
  }

  override parse(value: any, parseFormat: any): Date | null {
    if (value && typeof value == 'string') {
      const parts = this.extractDateParts(value, parseFormat);
      if (!parts) return null;

      const { day, month, year } = parts;
      const temp = new Date(year, month - 1, day);
      if (
        temp.getFullYear() == year &&
        temp.getMonth() == month - 1 &&
        temp.getDate() == day
      ) {
        return temp;
      }
    }
    return null;
  }

  private padToTwo(number: number) {
    return number <= 9 ? `0${number}` : number.toString();
  }

  private extractDateParts(
    dateString: string,
    parseFormat: string
  ): { day: number; month: number; year: number } | null {
    const formatParts = parseFormat.split(/[\.\-\/]/);
    const dateParts = dateString.split(/[\.\-\/]/);

    if (formatParts.length === dateParts.length) {
      let day, month, year;

      for (let i = 0; i < formatParts.length; i++) {
        if (formatParts[i] === 'DD') {
          day = parseInt(dateParts[i]);
        } else if (formatParts[i] === 'MM') {
          month = parseInt(dateParts[i]);
        } else if (formatParts[i] === 'YYYY') {
          year = parseInt(dateParts[i]);
        }
      }

      if (!day || !month || !year) return null;

      return { day, month, year };
    }

    return null;
  }
}

export class CustomDateAdapter2 extends NativeDateAdapter {
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  padToTwo(number: number): string {
    return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
  }

  override format(date: Date, displayFormat: Object): string {
    const day = this.padToTwo(date.getDate());
    const month = this.padToTwo(date.getMonth() + 1);
    const year = date.getFullYear();

    const formatMapping = {
      'DD.MM.YYYY': `${day}.${month}.${year}`,
      'DD/MM/YYYY': `${day}/${month}/${year}`,
      'MM/DD/YYYY': `${month}/${day}/${year}`,
      'MMM YYYY': `${this.monthNames[date.getMonth()]} ${year}`,
    };

    const formattedDate = formatMapping['DD/MM/YYYY'];
    if (!formattedDate) {
      throw new Error(`Date format ${displayFormat} not supported`);
    }

    return formattedDate;
  }

  override parse(value: any, parseFormat: string = 'DD.MM.YYYY'): Date | null {
    console.log('parse', parseFormat);

    if (typeof value === 'string' && value.length) {
      const str = value.split(/[./]/);
      const year = Number(str[2]);
      const month = Number(str[parseFormat[3] === 'M' ? 1 : 0]) - 1;
      const date = Number(str[parseFormat[0] === 'D' ? 0 : 1]);
      return new Date(year, month, date);
    }
    return null;
  }
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** @title Datepicker with custom formats */
@Component({
  selector: 'datepicker-formats-example',
  templateUrl: 'datepicker-formats-example.html',
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter2,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DatepickerFormatsExample {
  date = new FormControl(moment());
}

/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
