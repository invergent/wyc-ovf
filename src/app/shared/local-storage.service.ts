import { InjectionToken } from '@angular/core';
import { ILocalStorage } from './models';

export let LOCALSTORAGE_TOKEN = new InjectionToken<ILocalStorage>('localstorage');
