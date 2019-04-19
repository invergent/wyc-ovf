import { InjectionToken } from '@angular/core';
import { IToastr } from './models';

export let TOASTR_TOKEN = new InjectionToken<IToastr>('toastr');
