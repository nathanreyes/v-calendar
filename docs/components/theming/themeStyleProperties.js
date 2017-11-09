export default [
  {
    propertyName: '<code>wrapper</code>',
    description: `
      Wrapper for both single and double-paned calendars.
      <br /><strong>Common assignments:</strong> <code>background</code>, <code>border</code>, <code>width</code>
      <br /><strong>Avoid:</strong> <code>height</code>
      `,
  },
  {
    propertyName: '<code>verticalDivider</code>',
    description: `
      Vertical divider that appears when calendar is double-paned.
      This style can be overriden by <code>headerVerticalDivider</code>, <code>weekdayVerticalDivider</code>, or <code>weeksVerticalDivider</code> for those specific sections if necessary.
      <br /><strong>Common assignments:</strong> <code>borderLeft</code>
      `,
  },
  {
    propertyName: '<code>header</code>',
    description: 'Header section that encapsulates arrows and title. <br /><strong>Common assignments:</strong> <code>background</code>, <code>padding</code>',
  },
  {
    propertyName: '<code>headerTitle</code>',
    description: 'Header title.<br /><strong>Common assignments:</strong> <code>font</code>',
  },
  {
    propertyName: '<code>headerArrows</code>',
    description: 'Header arrows.<br /><strong>Common assignments:</strong> <code>font</code>',
  },
  {
    propertyName: '<code>headerVerticalDivider</code>',
    description: `
      Vertical divider that appears in the header section when calendar is double paned.
      This style overrides <code>verticalDivider</code> for the header section.
      <br /><strong>Common assignments:</strong> <code>borderLeft</code>
    `,
  },
  {
    propertyName: '<code>headerHorizontalDivider</code>',
    description: 'Horizontal divider that appears just below header section.<br /><strong>Common assignments:</strong> <code>borderTop</code>.',
  },
  {
    propertyName: '<code>weekdays</code>',
    description: 'Weekday section that encapsulates all the weekday labels.<br /><strong>Common assignments:</strong> <code>background</code>, <code>padding</code>, <code>font</code>',
  },
  {
    propertyName: '<code>weekdaysVerticalDivider</code>',
    description: `
      Vertical divider that appears in the weekdays section when calendar is double paned.
      This style overrides <code>verticalDivider</code> for the weekdays section.
      <br /><strong>Common assignments:</strong> <code>borderLeft</code>
    `,
  },
  {
    propertyName: '<code>weekdaysHorizontalDivider</code>',
    description: 'Horizontal divider that appears just below weekdays section.<br /><strong>Common assignments:</strong> <code>borderTop</code>.',
  },
  {
    propertyName: '<code>weeks</code>',
    description: `
      Weeks section that encapsulates all the days of the month.
      <br /><strong>Common assignments:</strong> <code>background</code>, <code>padding</code>
      <br /><strong>Avoid:</strong> <code>height</code>
    `,
  },
  {
    propertyName: '<code>weeksVerticalDivider</code>',
    description: `
      Vertical divider that appears in the weeks section when calendar is double paned.
      This style overrides <code>verticalDivider</code> for the weeks section.
      <br /><strong>Common assignments:</strong> <code>borderLeft</code>
    `,
  },
  {
    propertyName: '<code>dayCell</code>',
    description: `
      Day cell that contains day content and any associated attributes.
      <br /><strong>Common assignments:</strong> <code>height</code>, <code>background</code>
      <br /><strong>Avoid:</strong> <code>width</code>
    `,
  },
  {
    propertyName: '<code>dayCellNotInMonth</code>',
    description: `
      When a day does not lie in the month it is displayed on (belongs to previous or next month), this style is merged with <code>dayCell</code>.
      <br /><strong>Common assignments:</strong> <code>opacity</code>
      <br /><strong>Avoid:</strong> <code>width</code>
    `,
  },
  {
    propertyName: '<code>dayContent</code>',
    description: `
      Content area within the day cell that contains the day of the month number.
      <br /><strong>Common assignments:</strong> <code>background</code>, <code>border</code>, <code>borderRadius</code>, <code>font</code>
    `,
  },
  {
    propertyName: '<code>dayContentHover</code>',
    description: `
      When content is hovered, this style is merged with <code>dayContent</code>.
      <br /><strong>Common assignments:</strong> <code>background</code>, <code>border</code>, <code>borderRadius</code>, <code>font</code>      
    `,
  },
  {
    propertyName: '<code>dots</code>',
    description: `
      Container for dot indicators.
      <br /><strong>Common assignments:</strong> <code>width</code>, <code>marginBottom</code>
    `,
  },
  {
    propertyName: '<code>bars</code>',
    description: `
      Container for bar indicators.
      <br /><strong>Common assignments:</strong> <code>width</code>, <code>marginBottom</code>
    `,
  },
];
