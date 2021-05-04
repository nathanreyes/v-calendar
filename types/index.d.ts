import { Plugin, DefineComponent } from 'vue';

declare const VCalendarLibrary: Exclude<Plugin['install'], undefined>;
export default VCalendarLibrary;

export const Calendar: Exclude<Plugin['install'], undefined> | DefineComponent;

export const Popover: Exclude<Plugin['install'], undefined> | DefineComponent;

export const PopoverRow:
  | Exclude<Plugin['install'], undefined>
  | DefineComponent;

export const DatePicker:
  | Exclude<Plugin['install'], undefined>
  | DefineComponent;
