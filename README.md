jquery.timely
=============

Github-style, time period, heat maps.

![Sample](http://i.imgur.com/EQA100O.png)

### Usage

```html
<script src="jquery.timely.js"></script>
<link rel="stylesheet" type="text/css" href="jquery.timely.css">
```

The timely grid will be injected into `$('#my-elem')`.

```javascript
$('#my-elem').timely({
  color: '#926300',
  data: {
    1: 0.12,
    2: 0.01,
    ...
  }
});
```

### How to supply data

* `color`: the base, background color for a `time-unit` 
 * This color's opacity will be altered based on the progress value
* `data`: a day number to progress value mapping.
 * Progress is indicated via a float between 0 (no progress) and 1 (max progress)

### Classes to style

If you'd like to change the look and feel, override the following classes:

* `timely`      : main container of the widget
* `time-unit`   : an individual box
* `time-grid`   : the grid of boxes
* `x-axis`      : collection of names of the month
* `y-axis`      : collection of days of the week
* `month-name`  : individual month name
* `day-name`    : individual day name
* `week`        : collection of vertical days

### TODO:

* Support timestamps as keys
 * Detect start month and project a year from that

* Support twitter bootstrap tooltip message
 * Mapping value could be an object 
  
  ```javascript
    $('#my-elem').timely({
      color: '#926300',
      data: {
        1: {
          progress: 0.12,
          message: '12 contributions' 
        },
        ...
      }
    });
  ```

* Support configurable time period (days, years)
 * Currently, only months are supported