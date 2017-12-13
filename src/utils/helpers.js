import defaults from './defaults';
import colors from './colors';
import { isArray } from './typeCheckers';

// Calendar data
export const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const today = new Date();
export const todayComps = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};

// Days/month/year components for a given month and year
export const getMonthComps = (month, year) => {
  const firstDayOfWeek = defaults.firstDayOfWeek;
  const inLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const firstWeekday = new Date(year, month - 1, 1).getDay() + 1;
  const days = (month === 2 && inLeapYear) ? 29 : daysInMonths[month - 1];
  const weeks = Math.ceil((days + Math.abs(firstWeekday - firstDayOfWeek)) / 7);
  return {
    firstDayOfWeek,
    inLeapYear,
    firstWeekday,
    days,
    weeks,
    month,
    year,
  };
};

// Days/month/year components for a given date
export const getDateComps = (date) => {
  if (!date || !date.getTime) return undefined;
  return getMonthComps(date.getMonth() + 1, date.getFullYear());
};

// Days/month/year components for today's month
export const getThisMonthComps = () => getMonthComps(todayComps.month, todayComps.year);

// Day/month/year components for previous month
export const getPrevMonthComps = (month, year) => {
  if (month === 1) return getMonthComps(12, year - 1);
  return getMonthComps(month - 1, year);
};

// Day/month/year components for next month
export const getNextMonthComps = (month, year) => {
  if (month === 12) return getMonthComps(1, year + 1);
  return getMonthComps(month + 1, year);
};

export const getExampleMonthComps = () => {
  const thisMonthComps = getThisMonthComps();
  const nextMonthComps = getNextMonthComps(thisMonthComps.month, thisMonthComps.year);

  return {
    thisMonth: thisMonthComps.month - 1,
    thisMonthYear: thisMonthComps.year,
    nextMonth: nextMonthComps.month - 1,
    nextMonthYear: nextMonthComps.year,
  };
};

function comparePages(firstPage, secondPage) {
  if (!firstPage || !secondPage) return 0;
  if (firstPage.year === secondPage.year) {
    if (firstPage.month === secondPage.month) return 0;
    return firstPage.month < secondPage.month ? -1 : 1;
  }
  return firstPage.year < secondPage.year ? -1 : 1;
}

export const pageIsEqualToPage = (page, otherPage) => comparePages(page, otherPage) === 0;

export const pageIsBeforePage = (page, beforePage) => comparePages(page, beforePage) === -1;

export const pageIsAfterPage = (page, afterPage) => comparePages(page, afterPage) === 1;

export const getMinPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === -1) ? prev : curr;
});

export const getMaxPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === 1) ? prev : curr;
});

export const getPrevPage = (page) => {
  if (!page) return undefined;
  const prevComps = getPrevMonthComps(page.month, page.year);
  return {
    month: prevComps.month,
    year: prevComps.year,
  };
};

export const getNextPage = (page) => {
  if (!page) return undefined;
  const nextComps = getNextMonthComps(page.month, page.year);
  return {
    month: nextComps.month,
    year: nextComps.year,
  };
};

// Return page if it lies between the from and to pages
export const getPageBetweenPages = (page, fromPage, toPage) => {
  if (!page) return undefined;
  if (fromPage && comparePages(page, fromPage) === -1) return undefined;
  if (toPage && comparePages(page, toPage) === 1) return undefined;
  return page;
};

export const getFirstValidPage = (...args) => args.find(p => !!p);

export const getFirstArrayItem = (array, fallbackValue) => {
  if (!array) return fallbackValue;
  return array.length ? array[0] : fallbackValue;
};

export const getLastArrayItem = (array, fallbackValue) => {
  if (!array) return fallbackValue;
  return array.length ? array[array.length - 1] : fallbackValue;
};

export const arrayHasItems = array => isArray(array) && array.length;

export const elementHasAncestor = (el, ancestor) => {
  if (!el) return false;
  if (el === ancestor) return true;
  return elementHasAncestor(el.parentElement, ancestor);
};

export const elementPositionInAncestor = (el, ancestor) => {
  let top = 0;
  let left = 0;
  do {
    top += el.offsetTop || 0;
    left += el.offsetLeft || 0;
    el = el.offsetParent;
  } while (el && el !== ancestor);
  return {
    top,
    left,
  };
};

export const objectFromArray = (array, keyProp = 'key') => {
  if (!array || !array.length) return {};
  return array.reduce((prev, curr) => ({ ...prev, ...{ [`${curr[keyProp]}`]: curr } }), {});
};

export const mixinOptionalProps = (source, target, props) => {
  const assigned = [];
  props.forEach((p) => {
    const name = p.name || p.toString();
    const mixin = p.mixin;
    const validate = p.validate;
    if (Object.prototype.hasOwnProperty.call(source, name)) {
      const value = validate ? validate(source[name]) : source[name];
      target[name] = mixin ? { ...mixin, ...value } : value;
      assigned.push(name);
    }
  });
  return {
    target,
    assigned: assigned.length ? assigned : null,
  };
};

export const isMobile = {
  andriod() {
    return navigator.userAgent.match(/Android/i);
  },
  blackberry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any() {
    return (isMobile.andriod() || isMobile.blackberry() || isMobile.iOS() || isMobile.opera() || isMobile.windows());
  },
};

/* eslint-disable */

const shadeBlendConvert = (from, to, p) => {
  if(!this.sbcRip)this.sbcRip=(d)=>{
    let l=d.length,RGB=new Object();
    if(l>9){
        d=d.split(",");
        if(d.length<3||d.length>4)return null;//ErrorCheck
        RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
    }else{
        if(l==8||l==6||l<4)return null; //ErrorCheck
        if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
        d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
    }
    return RGB;}
  var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
  if(!f||!t)return null; //ErrorCheck
  if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
  else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
}

/* eslint-enable */

export const blendColors = (fromColor, toColor, percent) => {
  if (typeof percent !== 'number' || percent < -1 || percent > 1) return fromColor;
  if (typeof fromColor !== 'string' || typeof toColor !== 'string') return fromColor;
  const from = colors[fromColor] || fromColor;
  const to = colors[toColor] || toColor;
  if ((from[0] !== 'r' && from[0] !== '#') || (to[0] !== 'r' && to[0] !== '#')) return fromColor;
  return shadeBlendConvert(from, to, percent);
};

export const blendObjectColors = (fromObject, fromKeys, toColor, percent) => {
  fromKeys.forEach((k) => {
    if (fromObject[k]) fromObject[k] = blendColors(fromObject[k], toColor, percent);
  });
};
