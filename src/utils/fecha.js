/* eslint-disable no-bitwise, no-mixed-operators, no-useless-escape, no-multi-assign */
/* DATE FORMATTING & PARSING USING A SLIGHTLY MODIFIED VERSION OF FECHA (https://github.com/taylorhakes/fecha) */
/* ADDS A NARROW WEEKDAY FORMAT 'dd' */
import { isNumber, isString, isArray, isDate } from './_';

const token = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
const literal = /\[([^]*?)\]/gm;
const noop = () => {};

function monthUpdate(arrName) {
  return (d, v, i18n) => {
    const index = i18n[arrName].indexOf(
      v.charAt(0).toUpperCase() + v.substr(1).toLowerCase(),
    );
    if (~index) {
      d.month = index;
    }
  };
}

function pad(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) {
    val = `0${val}`;
  }
  return val;
}

const formatFlags = {
  D(dateObj) {
    return dateObj.getDate();
  },
  DD(dateObj) {
    return pad(dateObj.getDate());
  },
  Do(dateObj, i18n) {
    return i18n.DoFn(dateObj.getDate());
  },
  d(dateObj) {
    return dateObj.getDay();
  },
  dd(dateObj) {
    return pad(dateObj.getDay());
  },
  W(dateObj, i18n) {
    return i18n.dayNamesNarrow[dateObj.getDay()];
  },
  WW(dateObj, i18n) {
    return i18n.dayNamesShorter[dateObj.getDay()];
  },
  WWW(dateObj, i18n) {
    return i18n.dayNamesShort[dateObj.getDay()];
  },
  WWWW(dateObj, i18n) {
    return i18n.dayNames[dateObj.getDay()];
  },
  M(dateObj) {
    return dateObj.getMonth() + 1;
  },
  MM(dateObj) {
    return pad(dateObj.getMonth() + 1);
  },
  MMM(dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()];
  },
  MMMM(dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()];
  },
  YY(dateObj) {
    return String(dateObj.getFullYear()).substr(2);
  },
  YYYY(dateObj) {
    return pad(dateObj.getFullYear(), 4);
  },
  h(dateObj) {
    return dateObj.getHours() % 12 || 12;
  },
  hh(dateObj) {
    return pad(dateObj.getHours() % 12 || 12);
  },
  H(dateObj) {
    return dateObj.getHours();
  },
  HH(dateObj) {
    return pad(dateObj.getHours());
  },
  m(dateObj) {
    return dateObj.getMinutes();
  },
  mm(dateObj) {
    return pad(dateObj.getMinutes());
  },
  s(dateObj) {
    return dateObj.getSeconds();
  },
  ss(dateObj) {
    return pad(dateObj.getSeconds());
  },
  S(dateObj) {
    return Math.round(dateObj.getMilliseconds() / 100);
  },
  SS(dateObj) {
    return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
  },
  SSS(dateObj) {
    return pad(dateObj.getMilliseconds(), 3);
  },
  a(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
  },
  A(dateObj, i18n) {
    return dateObj.getHours() < 12
      ? i18n.amPm[0].toUpperCase()
      : i18n.amPm[1].toUpperCase();
  },
  ZZ(dateObj) {
    const o = dateObj.getTimezoneOffset();
    return (
      (o > 0 ? '-' : '+') +
      pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4)
    );
  },
};

const parseFlags = {
  D: [
    twoDigits,
    (d, v) => {
      d.day = v;
    },
  ],
  Do: [
    new RegExp(twoDigits.source + word.source),
    (d, v) => {
      d.day = parseInt(v, 10);
    },
  ],
  d: [twoDigits, noop],
  W: [word, noop],
  M: [
    twoDigits,
    (d, v) => {
      d.month = v - 1;
    },
  ],
  MMM: [word, monthUpdate('monthNamesShort')],
  MMMM: [word, monthUpdate('monthNames')],
  YY: [
    twoDigits,
    (d, v) => {
      const da = new Date();
      const cent = +da
        .getFullYear()
        .toString()
        .substr(0, 2);
      d.year = `${v > 68 ? cent - 1 : cent}${v}`;
    },
  ],
  YYYY: [
    fourDigits,
    (d, v) => {
      d.year = v;
    },
  ],
  S: [
    /\d/,
    (d, v) => {
      d.millisecond = v * 100;
    },
  ],
  SS: [
    /\d{2}/,
    (d, v) => {
      d.millisecond = v * 10;
    },
  ],
  SSS: [
    threeDigits,
    (d, v) => {
      d.millisecond = v;
    },
  ],
  h: [
    twoDigits,
    (d, v) => {
      d.hour = v;
    },
  ],
  m: [
    twoDigits,
    (d, v) => {
      d.minute = v;
    },
  ],
  s: [
    twoDigits,
    (d, v) => {
      d.second = v;
    },
  ],
  a: [
    word,
    (d, v, i18n) => {
      const val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    },
  ],
  ZZ: [
    /([\+\-]\d\d:?\d\d|Z)/,
    (d, v) => {
      if (v === 'Z') v = '+00:00';
      const parts = `${v}`.match(/([+-]|\d\d)/gi);
      if (parts) {
        const minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    },
  ],
};
parseFlags.DD = parseFlags.D;
parseFlags.dd = parseFlags.d;
parseFlags.WWWW = parseFlags.WWW = parseFlags.WW = parseFlags.W;
parseFlags.MM = parseFlags.M;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;

export const format = (dateObj, mask, locale) => {
  if (isNumber) {
    dateObj = new Date(dateObj);
  }
  if (!isDate(dateObj)) {
    throw new Error('Invalid Date in fecha.format');
  }
  mask = locale.masks[mask] || mask;
  const literals = [];
  // Make literals inactive by replacing them with ??
  mask = mask.replace(literal, ($0, $1) => {
    literals.push($1);
    return '??';
  });
  // Apply formatting rules
  mask = mask.replace(token, $0 =>
    $0 in formatFlags
      ? formatFlags[$0](dateObj, locale)
      : $0.slice(1, $0.length - 1),
  );
  // Inline literal values back into the formatted value
  return mask.replace(/\?\?/g, () => literals.shift());
};

const parseString = (dateStr, mask, locale) => {
  if (typeof mask !== 'string') {
    throw new Error('Invalid mask in fecha.parse');
  }
  mask = locale.masks[mask] || mask;
  // Avoid regular expression denial of service, fail early for really long strings
  // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
  if (dateStr.length > 1000) {
    return false;
  }

  let isValid = true;
  const dateInfo = {};
  mask.replace(token, $0 => {
    if (parseFlags[$0]) {
      const info = parseFlags[$0];
      const index = dateStr.search(info[0]);
      if (!~index) {
        isValid = false;
      } else {
        dateStr.replace(info[0], result => {
          info[1](dateInfo, result, locale);
          dateStr = dateStr.substr(index + result.length);
          return result;
        });
      }
    }

    return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
  });

  if (!isValid) {
    return false;
  }

  const today = new Date();
  if (
    dateInfo.isPm === true &&
    dateInfo.hour != null &&
    +dateInfo.hour !== 12
  ) {
    dateInfo.hour = +dateInfo.hour + 12;
  } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
    dateInfo.hour = 0;
  }

  let date;
  if (dateInfo.timezoneOffset != null) {
    dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
    date = new Date(
      Date.UTC(
        dateInfo.year || today.getFullYear(),
        dateInfo.month || 0,
        dateInfo.day || 1,
        dateInfo.hour || 0,
        dateInfo.minute || 0,
        dateInfo.second || 0,
        dateInfo.millisecond || 0,
      ),
    );
  } else {
    date = new Date(
      dateInfo.year || today.getFullYear(),
      dateInfo.month || 0,
      dateInfo.day || 1,
      dateInfo.hour || 0,
      dateInfo.minute || 0,
      dateInfo.second || 0,
      dateInfo.millisecond || 0,
    );
  }
  return date;
};

export const parse = (dateStr, mask, locale) => {
  const masks = (isArray(mask) && mask) || [
    (isString(mask) && mask) || 'YYYY-MM-DD',
  ];
  return (
    masks.map(m => parseString(dateStr, m, locale)).find(d => d) ||
    new Date(dateStr)
  );
};
