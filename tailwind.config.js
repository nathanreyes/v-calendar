module.exports = {
  prefix: 'vc-',
  theme: {
    // Convert all rems to px to avoid inconsistencies across css frameworks
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
    },
    spacing: {
      px: '1px',
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
      40: '160px',
      48: '192px',
      56: '224px',
      64: '256px',
    },
    borderRadius: {
      none: '0',
      sm: '18px',
      default: '4px',
      lg: '8px',
      full: '9999px',
    },
  },
  // Limit variants for sections whitelisted by PurgeCSS
  variants: {
    textColor: ['hover'],
    backgroundColor: ['hover'],
    borderColor: ['hover', 'focus'],
    opacity: ['responsive', 'hover'],
  },
};
