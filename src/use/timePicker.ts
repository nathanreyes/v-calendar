import { computed } from 'vue';
import { arrayHasItems } from '../utils/helpers';
import {
  SimpleDateParts,
  DateParts,
  getDatePartsOptions,
  isDateParts,
} from '../utils/date/helpers';
import { useBase } from '../use/base';
import { useDatePicker } from '../use/datePicker';

const _amOptions = [
  { value: 0, label: '12' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
];
const _pmOptions = [
  { value: 12, label: '12' },
  { value: 13, label: '1' },
  { value: 14, label: '2' },
  { value: 15, label: '3' },
  { value: 16, label: '4' },
  { value: 17, label: '5' },
  { value: 18, label: '6' },
  { value: 19, label: '7' },
  { value: 20, label: '8' },
  { value: 21, label: '9' },
  { value: 22, label: '10' },
  { value: 23, label: '11' },
];

export interface TimePickerProps {
  position: number;
}

export type TimePickerContext = ReturnType<typeof createTimePicker>;

export function createTimePicker(props: TimePickerProps) {
  const ctx = useDatePicker();
  const {
    locale,
    isRange,
    isTimeMode,
    dateParts,
    rules,
    is24hr,
    hideTimeHeader,
    timeAccuracy,
    updateValue: updateDpValue,
  } = ctx;

  function updateParts(newParts: Partial<DateParts>) {
    newParts = Object.assign(parts.value, newParts);
    let newValue = null;
    if (isRange.value) {
      const start = isStart.value ? newParts : dateParts.value[0];
      const end = isStart.value ? dateParts.value[1] : newParts;
      newValue = { start, end };
    } else {
      newValue = newParts;
    }
    updateDpValue(newValue, {
      patch: 'time',
      targetPriority: isStart.value ? 'start' : 'end',
      moveToValue: true,
    });
  }

  const isStart = computed(() => props.position === 0);
  const parts = computed(
    () => dateParts.value[props.position] || { isValid: false },
  );
  const partsValid = computed(() => isDateParts(parts.value));
  const isValid = computed(() => !!parts.value.isValid);
  const showHeader = computed(() => {
    return !hideTimeHeader.value && isValid.value;
  });

  const date = computed(() => {
    if (!partsValid.value) return null;
    let date = locale.value.toDate(parts.value as Partial<SimpleDateParts>);
    if ((parts.value as DateParts).hours === 24) {
      date = new Date(date.getTime() - 1);
    }
    return date;
  });

  const hours = computed({
    get() {
      return (parts.value as DateParts).hours;
    },
    set(val) {
      updateParts({ hours: val });
    },
  });

  const minutes = computed({
    get() {
      return (parts.value as DateParts).minutes;
    },
    set(val) {
      updateParts({ minutes: val });
    },
  });

  const seconds = computed({
    get() {
      return (parts.value as DateParts).seconds;
    },
    set(val) {
      updateParts({ seconds: val });
    },
  });

  const milliseconds = computed({
    get() {
      return (parts.value as DateParts).milliseconds;
    },
    set(val) {
      updateParts({ milliseconds: val });
    },
  });

  const isAM = computed({
    get() {
      return (parts.value as DateParts).hours < 12;
    },
    set(value) {
      value = String(value).toLowerCase() == 'true';
      let hValue = hours.value;
      if (value && hValue >= 12) {
        hValue -= 12;
      } else if (!value && hValue < 12) {
        hValue += 12;
      }
      updateParts({ hours: hValue });
    },
  });

  const options = computed(() =>
    getDatePartsOptions(parts.value as DateParts, rules.value[props.position]),
  );

  const amHourOptions = computed(() => {
    return _amOptions.filter(opt =>
      options.value.hours.some(ho => ho.value === opt.value),
    );
  });

  const pmHourOptions = computed(() => {
    return _pmOptions.filter(opt =>
      options.value.hours.some(ho => ho.value === opt.value),
    );
  });

  const hourOptions = computed(() => {
    if (is24hr.value) return options.value.hours;
    if (isAM.value) return amHourOptions.value;
    return pmHourOptions.value;
  });

  const isAMOptions = computed(() => {
    const result = [];
    if (arrayHasItems(amHourOptions.value))
      result.push({ value: true, label: 'AM' });
    if (arrayHasItems(pmHourOptions.value))
      result.push({ value: false, label: 'PM' });
    return result;
  });

  return {
    ...ctx,
    showHeader,
    timeAccuracy,
    parts,
    isValid,
    date,
    hours,
    minutes,
    seconds,
    milliseconds,
    options,
    hourOptions,
    isAM,
    isAMOptions,
    is24hr,
  };
}
