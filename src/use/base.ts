import { PropType, computed, provide, inject, toRef } from 'vue';
import { getDefault } from '../utils/defaults';
import { default as Locale, LocaleConfig } from '../utils/locale';
import { Attribute } from '../utils/attribute';
import { isObject } from '../utils/_';
import { useTheme } from './theme';
import { DarkModeConfig, DarkModeClassConfig } from 'vue-screen-utils';

export interface BaseProps {
  color: string;
  isDark?: DarkModeConfig;
  theme?: string;
  locale?: string | Record<string, any> | Locale;
  firstDayOfWeek: number;
  masks?: Record<string, any>;
  timezone?: string;
  minDate?: Date;
  minDateExact?: Date;
  maxDate?: Date;
  maxDateExact?: Date;
  disabledDates?: [];
  availableDates?: [];
}

const contextKey = '__vc_base_context__';

export const propsDef = {
  color: {
    type: String,
    default: () => getDefault('color'),
  },
  isDark: {
    type: [Boolean, String, Object as PropType<DarkModeClassConfig>],
    default: () => getDefault('isDark'),
  },
  firstDayOfWeek: Number,
  masks: Object,
  locale: [String, Object],
  timezone: String,
  minDate: null,
  maxDate: null,
  minDateExact: null,
  maxDateExact: null,
  disabledDates: null,
  availableDates: null,
};

export type BaseContext = ReturnType<typeof createBase>;

export function createBase(props: BaseProps) {
  // #region Computed

  const isDark = computed(() => props.isDark ?? false);
  const theme = useTheme(toRef(props, 'color'), isDark);

  const locale = computed(() => {
    // Return the locale prop if it is an instance of the Locale class
    if (props.locale instanceof Locale) return props.locale;
    // Build up a base config from component props
    const config = (
      isObject(props.locale)
        ? props.locale
        : {
            id: props.locale,
            firstDayOfWeek: props.firstDayOfWeek,
            masks: props.masks,
          }
    ) as Partial<LocaleConfig>;
    // Return new locale
    return new Locale(config, props.timezone);
  });

  const masks = computed(() => locale.value.masks);

  const disabledDates = computed(() => {
    const dates = locale.value.normalizeDates(props.disabledDates, {
      isAllDay: true,
    });
    // Add disabled range for min date
    if (props.minDateExact || props.minDate) {
      const end = props.minDateExact
        ? locale.value.normalizeDate(props.minDateExact)
        : locale.value.normalizeDate(props.minDate!, {
            rules: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
          });
      dates.push({
        start: null,
        end: new Date(end.getTime() - 1000),
      });
    }
    // Add disabled range for min date
    if (props.maxDateExact || props.maxDate) {
      const start = props.maxDateExact
        ? locale.value.normalizeDate(props.maxDateExact)
        : locale.value.normalizeDate(props.maxDate!, {
            rules: {
              hours: 23,
              minutes: 59,
              seconds: 59,
            },
          });
      dates.push({
        start: new Date(start.getTime() + 1000),
        end: null,
      });
    }
    return dates;
  });

  const availableDates = computed(() => {
    return locale.value.normalizeDates(props.availableDates, {
      isAllDay: false,
    });
  });

  const disabledAttribute = computed(() => {
    return new Attribute(
      {
        key: 'disabled',
        dates: disabledDates.value,
        excludeDates: availableDates.value,
        excludeMode: 'includes',
        order: 100,
      },
      theme,
      locale.value,
    );
  });

  // #endregion Computed

  const context = {
    theme,
    locale,
    masks,
    disabledDates,
    availableDates,
    disabledAttribute,
  };
  provide(contextKey, context);
  return context;
}

export function useBase() {
  const context = inject<BaseContext>(contextKey);
  if (context) return context;
  throw new Error(
    'Base context missing. Please verify this component is nested within a valid context provider.',
  );
}

export function useOrCreateBase(props: BaseProps) {
  return inject<BaseContext>(contextKey, createBase(props));
}
