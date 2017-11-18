export const POPOVER_VISIBILITIES = { // eslint-disable-line import/prefer-default-export
  HOVER: 'hover',
  FOCUS: 'focus',
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  isManual: v => v === 'hidden' || v === 'visible',
  isManaged: v => v === 'hover' || v === 'focus',
};
