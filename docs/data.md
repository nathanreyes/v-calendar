# Working With Data

In this section, we'll try to put it all together and walk through a real scenario of using some custom data to display attributes and handle events as the user interacts with the calendar. The hope is that you'll become more comfortable with how to make `v-calendar` work for you and your application needs.

For this simple example, we'll be working with a local array of todos (obviously), but we could easily fetch these todos from an API on `mounted()` or via `Vuex`.

## Step 1: Converting Data to Attributes

The first step is finding an efficient, intuitive way to convert our custom data elements into attributes for the calendar to display. The general approach here is that we'll store our todos as an array in our local state. We'll then use a computed property to recompute the attributes any time the state of our todos array changes.

```html
<v-calendar
  :attributes='attributes'>
</v-calendar>
```

```javascript
export default {
  data() {
    return {
      todos: [
        {
          id: 1,
          description: 'Clean the house.',
          date: new Date(2018, 0, 15),
          isCompleted: false,
          color: 'red'
        },
      ],
    };
  },
  computed: {
  	attributes() {
      return this.todos.map(t => ({
        key: `todo.${t.id}`,
        dot: {
          backgroundColor: t.color,
        },
        dates: t.date,
        customData: t,
      }));
    },
  }
};
```

<!-- <p align='center'>
  <img src='./gitbook/images/attributes/data-step-1.png' title='Calendar with todo attribute' width='250'>
</p> -->

Here are a few things to note from the code above:

  1. We use the [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) array function to convert the todos into attributes. This will be a common pattern when converting custom data into attributes.
  2. We assign a key derived from our original todo's id
  3. We make sure to assign the todo element to the attribute's `customData` property. We may need a way to later access the original todo.

## Step 2: Handling Events

Once we have figured out a way to convert our data into attributes that `v-calendar` can understand, we need to react to the user's actions like clicking on calendar days. For our application, we would just like to display the day that the user clicked, along with a list of the todos that exist for that day (if any). For that, we can handle the `dayclick` event.

```html
<div id='app'>
  <v-calendar
    :attributes='attributes'
    @dayclick='dayClicked'>
  </v-calendar>
</div>
```
```javascript
export default {
  data() {
    return {
      selectedDay: null, // Add state to store selected day
      todos: [
        {
          id: 1,
          description: 'Clean the house.',
          date: new Date(2018, 0, 15),
          isCompleted: false,
          color: 'red'
        },
      ],
    };
  },
  computed: {
  	attributes() {
      return this.todos.map(t => ({
        key: `todo.${t.id}`,
        dot: {
          backgroundColor: t.color,
        },
        dates: t.date,
        customData: t,
      }));
    },
  },
  methods: {
    dayClicked(day) {
      this.selectedDay = day;
    },
  },
};
```
```css
#app {
  display: flex;
}

.selected-day {
  margin-left: 10px;
}
```

Handling the `dayclick` event is as simple as storing the [`day`](/api/day-object.md) event object. With this object, we get access to all kinds of information about the clicked day, including the attributes that lie on that day. We can access these attributes in one of two ways.

  * `day.attributes`: An array containing all the day's attributes.
  * `day.attributesMap`: An object containing all the day's attributes as values matched to their respective `key` property

The attributes in the `attributes` list or `attributesMap` object look much the same as the attributes originally passed in as a prop, except that these attributes are super-charged with the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `intersectsDate(*date*)` | Function | Accepts a date expression (`Date` object, range or pattern) and returns the first `DateInfo` object belonging to the attribute that partially intersects the given date, if any. Returns `false` otherwise. |
| `includesDate(*date*)` | Function | Accepts a date expression (`Date` object, range or pattern) and returns the first `DateInfo` object belonging to the attribute that completely includes (or contains) the given date, if any. Returns `false` otherwise. |
| `targetDate` | `DateInfo` | Object with information about the date used by the attribute to display on the current day. |

So...back to the example, now that we have saved the [`day`](/api/day-object.md) to the local state variable `selectedDay`, we can then add a new column to display information about the day and all of its attributes.

```html
<div id='app'>
  <v-calendar
    :attributes='attributes'
    @dayclick='dayClicked'>
  </v-calendar>
  <!-- Add a column to display info for clicked day -->
  <div
    v-if='selectedDay'
    class='selected-day'>
    <h3>{{ selectedDay.date.toDateString() }}</h3>
    <ul>
      <li
        v-for='attr in selectedDay.attributes'
        :key='attr.key'>
        {{ attr.customData.description }}
      </li>
    </ul>
  </div>
</div>
```

## `DateInfo` & Attributes Lifecycle

The previous example introduced the `DateInfo` object, so we should discuss exactly what this is. As discussed earlier, there are multiple kinds of date expressions allowed for attributes: native dates or date-like objects (any valid expression using `new Date(*expression*)`), date ranges with optional `start` and `end` dates, and date patterns using [valid pattern expressions](/api/date-patterns).

Ultimately, `v-calendar` creates its own wrapper object for all of these objects, the `DateInfo` object. This object is used to conveniently treat all dates the same from an API perspective as well as super-charge the dates with the ability to test if they:
  * intersects other dates or `DateInfo` objects
  * include (or contain) other dates or `DateInfo` objects

Here is the full structure of the `DateInfo` object:

| Property | Type | Description | Assigned For |
| -------- | ---- | ----------- | ------------ |
| `type` | String | Description of wrapped date (`"date"`, `"range"`). | Date, Range |
| `isDate` | Boolean | Wrapped date is a native `Date` object (`type === "date"`). | Date, Range |
| `isRange` | Boolean | Wrapped date is a date range with or without patterns included (`type === "range"`). | Date, Range |
| `date` | Date | The wrapped native `Date` object. | Date |
| `dateTime` | Number | Result of calling `date.getTime()`. | Date |
| `start` | Date | Start date of the range. | Range |
| `startTime` | Number | Result of calling `start.getTime()`. | Range |
| `end` | Date | End date of the range. | Range |
| `endTime` | Number | Result of calling `end.getTime()`. | Range |
| `daySpan` | Number | Number of days between the `start` and `end` dates. | Range |
| `weekSpan` | Number | Number of weeks between the `start` and `end` dates. | Range |
| `monthSpan` | Number | Number of months between the `start` and `end` dates. | Range |
| `yearSpan` | Number | Number of years between the `start` and `end` dates. | Range |
| `isComplex` | Boolean | Date range includes patterns. | Range |
| `intersectsDate(Date)` | Function | Accepts a date expression (`Date` object, range or pattern) and returns `true` if it partially intersects the given date. Returns `false` otherwise. | Date, Range |
| `includesDate(Date)` | Function | Accepts a date expression (`Date` object, range or pattern) and returns `true` if it completely includes (or contains) the given date. Returns `false` otherwise. | Date, Range |

As mentioned before, these objects are accessed via the `attribute.targetDate` property when attributes are passed in events. To further understand what role `DateInfo` objects play and how they can be used by the client, let's review the lifecycle of attributes from the moment they are passed into `v-calendar` until the time they are exposed back to you as the developer via day related events.

<!-- <p align='center'>
  <img src='./gitbook/images/data/attributes-diagram.png' title='Attributes lifecycle' width='100%'>
</p> -->

The following is a written walkthrough of the diagram.
1. The client passes an array of attributes into `v-calendar`.
2. `v-calendar` creates an `AttributeStore` object that accepts these attributes and creates a new array of custom `Attribute` objects (calling `Attribute(*attribute)` factory method).
3. Each `Attribute` object configures itself using the client attribute.
  1. It converts each client date object into a new `DateInfo` object (calling `DateInfo(*date*)` factory method).
  2. It exposes methods to testing if it includes dates (simple dates, ranges, and patterns). These methods simply delegate the testing to its array of `DateInfo` objects.
4. On initial render, any time time new attributes are provided, or any time the user navigates to a different page, `v-calendar` queries the  `AttributeStore` for each day's attributes. It delegates the day inclusion test to the child `Attribute` objects which ensure the day matches at least one of its `DateInfo` objects, and makes sure it isn't excluded via `excudeDates`.
5. The `AttributeStore` makes copies of the filtered `Attribute` objects and assigns the matching `DateInfo` object to each `Attribute`'s `targetDate` property.
6. `v-calendar` caches the attributes for each day until it needs to refetch. On day events (`dayclick`, `daymouseenter`, `daymouseleave`) the days attributes are sent in the [`day`](/api/day-object.md) event object.