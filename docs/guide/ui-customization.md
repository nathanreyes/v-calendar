---
sidebarDepth: 2
---

# UI Customization

## Aproaches

In general, there are 4 specific ways in which you can customize the user interface for both `v-calendar` and `v-date-picker`.

### Props

Props are used to customize user interface elements that would be impossible to accomplish with slots, classes or styling alone. Examples include [`formats`](../api/calendar.md#formats) and [`title-position`](../api/calendar.md#title-position).

### Slots

Slots can be used to replace the default interface elements with those that you would like to provide yourself. Examples include [`header-left-button`](../api/calendar.md#header-left-button) and [`day-content`](../api/calendar.md#day-content).

### Classes

Classes are a new and now more preferred way to apply styling to calendars, when possible.

#### Step 1: Create component wrapper

Wrap `v-calendar` or `v-date-picker` in your own custom component.

```html
<template>
  <v-calendar
    :attributes='attributes'
    :from-date='new Date(2018, 0, 1)'>
  </v-calendar>
</template>
```

```js
export default {
  data() {
    return {
      attributes: [
        {
          highlight: {
            backgroundColor: '#3b3cab',
            height: '2.4rem',
          },
          contentStyle: {
            color: '#fafafa',
          },
          dates: {
            start: new Date(2018, 0, 7),
            end: new Date(2018, 0, 13),
          },
        },
        {
          highlight: {
            backgroundColor: '#f94f83',
            height: '2.4rem',
          },
          contentStyle: {
            color: '#fafafa',
          },
          dates: new Date(2018, 0, 12),
        },
      ],
    };
  },
};
```

#### Step 2: Configure styles in `<style>` section

Use a [deep selector](https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors) to target nested classes within `.c-pane-container`. Here is an example of styling various sections of the calendar using **SCSS**.

```scss
/deep/ .c-pane-container {
  background: linear-gradient(to bottom right, #25266c, #343698);
  border-radius: 10px;
  .c-header {
    color: #dadada;
    padding: 20px 15px 10px 15px;
  }
  .c-title {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .c-arrow {
    color: #7d799b;
    margin-top: 10px;
  }
  .c-weeks {
    padding: 0;
  }
  .c-weekdays {
    color: #2ecdba;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 10px 0;
  }
  .c-day-content {
    color: #3b5b93;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 8px 8px;
  }
}
```

<guide-customize-classes>
</guide-customize-classes>

### Styles

Styles are the last option for customization. They should be used when more complex customization rules are needed. For example, you can define styles as functions that accept [`page`](../api/page-object.md) and [`day`](../api/day-object) objects as arguments and return a style object.

## Horizontal Layout

The first step to customizing `v-calendar` or `v-date-picker` is determining how the component is needs to be laid out horizontally. There are 3 critical props to determining how this is done

| Property | Type | Default Value |
| -------- | ---- | ------------- |
| `is-double-paned` | Boolean | `false` |
| `pane-width` | Number | `256` // px |
| `is-expanded` | Boolean | `false` |

### Using `pane-width`

The second component to the horizontal layout is the width of a single pane. This can be configured manually with the `pane-width` prop. If the calendar is double-paned, then the overall width of the calendar will be double this value.

::: tip
If `is-doubled-paned` is set and the overall screen width falls to just below the double-paned width, the calendar will revert to a single pane layout.
:::

```html
<v-calendar
  :pane-width='270'
  is-double-paned>
</v-calendar>
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/layout-pane-width.png' width='540'>
</div> -->

### Using `is-expanded`

Alternatively, the calendar can automatically expand to fill the full width of its container by passing the `is-expanded` prop. If `is-double-paned` is set, both panes expand equally.

::: tip
The minimum width of a calendar pane is 256px, so if the container is less than 256px for single paned or 512px for double paned calendars, the calendar will overflow or get cut off, depending on the container's `overflow` setting.
:::

```html
<div style='width: 700px'>
  <v-calendar
    is-expanded
    is-double-paned>
  </v-calendar>
</div>
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/layout-is-expanded.png' width='700'>
</div> -->

## Header

### Overview

Reference the table below for all methods of customization within calendar headers.

| Method | Options |
| ------ | ------- |
| Props | `formats.title`, `title-position`, `title-transition` |
| Slots | `header`, `header-title`, `header-left-button`, `header-right-button` |
| Classes | `.c-header`, `.c-title`, `.c-arrow` |
| Styles | `themeStyles.header`, `themeStyles.headerTitle`, `themeStyles.headerArrows` |

### Set custom title
The header title is a simple indicator of what month the user is currently viewing. By default, it uses the `"MMMM YYYY"` format. If you would like to change the display, you can [provide your own format](/guide#formatting-parsing) or use a custom slot. When using a custom slot, you can extract out any [`page`](/api/page-object.md) properties you might need. For example, the following would display `Jan '18` as the header title instead of `January 2018`.

```html
<v-calendar>
  <span slot='header-title' slot-scope='{ shortMonthLabel, shortYearLabel }'>
    {{ shortMonthLabel }} `{{ shortYearLabel }}
  </span>
</v-calendar>
```

<guide-customize-header-title>
</guide-customize-header-title>

::: tip
This could more simply be acheived by using the `"MMM 'YY"` format, but you get the point! :)
:::

### Change title position

The title is positioned in between the 'move previous' and 'move next' navigation buttons by default, but this is easily changed via the `title-position` prop, which accepts `"left"`, `"center"` and `"right"`.

<guide-customize-header-title-pos>
</guide-customize-header-title-pos>

### Set custom arrows


## Vertical Layout & Styling

Once the horizontal layout has been determined, we can now target other methods for customizing `v-calendar`. This includes everything from vertical layout to subsection spacing and styling. To achieve all of this we use the `theme-styles` prop.

### Using `theme-styles`

The `theme-styles` prop is an object that consists of various styles that can used to control the design and layout for any section of the calendar.

[Here are the currently supported configurable styles.](/api/theme-styles.md)

**Don't be afraid to experiment with styles!** Any style you choose to configure is 'mixed in' with its associated default style, so you can target single properties without affecting the others. For example, we could target the overall wrapper `width` without worrying about affecting its `border` or `backgroundColor`.

### Demo Walkthrough

To explain how to use the `theme-styles` prop, we'll design the following calendar, walking through each step in the process, explaining which styles to use to target specific areas.

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/layout-intro.png' width='250'>
  <img src='./gitbook/images/layout/demo-6.png' width='290'>
</div> -->

#### Background, Border & Shadows

First, we would like to add a nice gradient as the background coupled with a contrasting font color. To do that, we can assign a style to the `wrapper` like so with the desired gradient and color:

```html
<v-calendar
  :theme-styles='themeStyles'>
</v-calendar>
```

```javascript
export default {
  data() {
    return {
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa'
        }
      }
    }
  }
}
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-1.png' width='250'>
</div> -->

Also, we can clean up the border and add a little bit of shadow to make it *super* fancy :).

```javascript
export default {
  data() {
    return {
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          borderRadius: '5px',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
        }
      }
    }
  }
}
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-2.png' width='250'>
</div> -->

#### Dividers

Each calendar conveniently includes dividers that are hidden by default. They are represented by the following `theme-style` properties:
  * `headerHorizontalDivider`: Horizontal divider between the header and weekday sections
  * `weekdayHorizontalDivider`: Horizontal divider between the weekday and weeks sections
  * `verticalDivider`: Vertical divider between 2 calendar panes when `is-double-paned` is set
    * `headerVerticalDivider`: Overrides `verticalDivider` in the header section
    * `weekdayVerticalDivider`: Overrides `verticalDivider` in the weekdays section
    * `weeksVerticalDivider`: Overrides `verticalDivider` in the weeks section

In our example, we just need the `headerHorizontalDivider`. We'll use a subtle divider that spans 80% of the calendar width.

```javascript
export default {
  data() {
    return {
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          borderRadius: '5px',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
        },
        headerHorizontalDivider: {
          borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
          width: '80%',
        },
      }
    }
  }
}
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-3.png' width='250'>
</div> -->

Well, honestly, that just doesn't look very good. It's pretty obvious that we have some spacing issues to address, which leads us into our next challenge.

#### Section Spacing

The sections of our calendar need some room to breathe, so we'll use the following `theme-style` properties to accomplish this.

  * `header`
  * `weekdays`
  * `weeks`

All we need to do is add some padding to vertically separate the sections out from each other and horizontally separate the sections from the edges. For horizontal spacing, we need to collectively apply the same padding to each section for consistency. Also note that the vertical spacing we apply to each section will contribute to the overall height of the calendar.

```javascript
export default {
  data() {
    const hSpacing = '15px';
    return {
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
          borderRadius: '5px',
        },
        header: {
          padding: `20px ${hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
          width: '80%',
        },
        weekdays: {
          padding: `20px ${hSpacing} 5px ${hSpacing}`,
        },
        weeks: {
          padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
        },
      }
    }
  }
}
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-4.png' width='250'>
</div> -->

Things are starting to come together. You'll notice from the code above that `hSpacing` is a defined constant used to apply the same horizontal padding to all sections. One thing too is that the calendar is starting to look a little constrained width-wise, so we can go back and make it a bit wider by one of two methods:

  1. Assign width directly with the `pane-width` prop
  2. Wrap `v-calendar` in a container div and set `is-expanded` to `true`

We'll use the first approach here to make the calendar a bit wider. Remember, this is a direct prop, not part of `theme-styles`.

```html
<v-calendar
  :pane-width='290'
  :theme-styles='themeStyles'>
</v-calendar>
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-5.png' width='290'>
</div> -->

#### Colors, Font

Finally, we just need to add some final touches to make the calendar a bit more legible. First, the default color (light-ish blue gray) of the weekday labels doesn't contrast well with the background gradient. Also, the day label could stand to use a tad larger font. To do all of this, we can modify the `weekdays` style and add a new `dayContent` style.

```javascript
export default {
  data() {
    const hSpacing = '15px';

    return {
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
          borderRadius: '5px',
        },
        header: {
          padding: `20px ${hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
          width: '80%',
        },
        weekdays: {
          color: '#6eded1', // New color
          fontWeight: '600', // And bolder font weight
          padding: `20px ${hSpacing} 5px ${hSpacing}`,
        },
        weeks: {
          padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
        },
        dayContent: {
          fontSize: '0.9rem'
        }
      }
    }
  }
}
```

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-6.png' width='290'>
</div> -->

With that, we have completed the custom calendar design.

#### Days Not In Month

One final note on the styling for days not in the currently active month. These are faded by default, but you can customize the amount that these day cells are faded or hide them completely by using 2 different methods:

**Class Method:** Apply rules using the deep class selector
```css
/deep/ .c-day:not(.in-month) {
  opacity: 0;
  pointer-events: none; /* For `v-date-picker` */
}
```

**Style Method:** Use a function for the `dayCell` theme style
```javascript
export default {
  data() {
    return {
      themeStyles: {
        dayCell: ({ day }) => {
          if (!day.inMonth) return {
            opacity: 0,
            pointerEvents: 'none',
          };
        }
      }
    };
  }
}
```

::: warning
As of `v0.9.6`, the `dayCellNotInMonth` style has been deprecated in favor of the methods shown above.
:::

<!-- <div class='distributed'>
  <img src='./gitbook/images/layout/demo-7.png' width='290'>
</div> -->