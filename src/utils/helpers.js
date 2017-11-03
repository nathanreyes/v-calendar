import colors from './colors';

// Calendar data
export const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const yearList = Array.apply(null, Array(201)).map((_, i) => 1900 + i); // eslint-disable-line prefer-spread
export const today = new Date();
export const todayComps = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};

export const getIsLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Days/month/year components for a given month and year
export const getMonthComps = (month, year) => ({
  days: (month === 2 && getIsLeapYear(year)) ? 29 : daysInMonths[month - 1],
  month,
  year,
});

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

function comparePages(firstPage, secondPage) {
  if (!firstPage || !secondPage) return 0;
  if (firstPage.year === secondPage.year) {
    if (firstPage.month === secondPage.month) return 0;
    return firstPage.month < secondPage.month ? -1 : 1;
  }
  return firstPage.year < secondPage.year ? -1 : 1;
}

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

export const getFirstArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[0] : undefined;
};

export const getLastArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[array.length - 1] : undefined;
};

export const composedPath = (el) => {
  const path = [];
  while (el) {
    path.push(el);
    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }
    el = el.parentElement;
  }
  return path;
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

export const DateInfo = class DateInfo {
  constructor(date, order = 0) {
    if (!date) return;
    const hasStart = !!date.start;
    const hasEnd = !!date.end;
    if (hasStart || hasEnd) {
      // Normalize start and end dates
      let start = new Date(date.start);
      let end = new Date(date.end);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      // Assign start and end dates
      this.type = 'range';
      this.isRange = true;
      this.start = start;
      this.startTime = start.getTime();
      this.end = end;
      this.endTime = end.getTime();
    } else {
      this.type = 'date';
      this.isDate = true;
      this.date = new Date(date);
      this.date.setHours(0, 0, 0, 0);
      this.dateTime = this.date.getTime();
    }
    this.order = order;
    this.intersects = this.intersects.bind(this);
  }

  toRange() {
    if (this.isDate) {
      return {
        start: new Date(this.dateTime),
        startTime: this.dateTime,
        end: new Date(this.dateTime),
        endTime: this.dateTime,
      };
    }
    return {
      start: new Date(this.startTime),
      startTime: this.startTime,
      end: new Date(this.endTime),
      endTime: this.endTime,
    };
  }

  containsDate(date) {
    if (this.isDate) return this.dateTime === date.getTime();
    if (this.start && date < this.start) return false;
    if (this.end && date > this.end) return false;
    return true;
  }

  compare(other) {
    if (this.order !== other.order) return this.order - other.order;
    if (this.type !== other.type) return this.isDate ? 1 : -1;
    if (this.isDate) return 0;
    const diff = this.start - other.start;
    return diff !== 0 ? diff : this.end - other.end;
  }

  intersects(other) {
    if (this.isDate) {
      return other.isDate ? this.dateTime === other.dateTime : other.containsDate(this.date);
    }
    if (other.isDate) return this.containsDate(other.date);
    return this.containsDate(other.start) || this.containsDate(other.end);
  }
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
