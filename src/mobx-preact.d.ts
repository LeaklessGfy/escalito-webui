declare module 'mobx-preact' {
  import { FunctionalComponent } from 'preact';
  export function observer<T extends FunctionalComponent<any>>(target: T): T;
}
