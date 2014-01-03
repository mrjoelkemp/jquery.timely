;(function ($) {
  'use strict';

  var
      unitTemplate = '<div class="time-unit"></div>',
      gridTemplate = '<div class="time-grid"></div>',
      // TODO: Month names, days of week (axes)
      periodTemplate = '<div class="timely"></div>';

  // Options:
  //    period: 'monthly', 'daily' (TODO)
  //    data:   object used to determine color strength
  //    color:  the color to vary with intensity
  $.fn.timely = function (options) {
    options = $.extend({
      period: 'monthly',
      color: '#0F0'
    }, options);

    var
        $this = $(this),
        // Grab the element before it's in the dom to minimize potential reflow
        $grid = getPeriodGrid(options.period);

    // renderPeriod.call(this, options.period);

    options.data = generateDebugData();

    renderColors($grid, options.data, options.color);

    $this.html($grid);
  };

  /////////////////////////
  // Timely Helpers
  /////////////////////////

  var
      // Returns a jQuery element representing the generated dom for
      // the passed period
      getPeriodGrid = function (period) {
        var $template;

        if (period.toLowerCase() === 'monthly') {
          $template = $(periodTemplate);

          // Fill out the grid
          $template.append(getMonthlyGrid());
        }

        return $template;
      },

      // Keys are day numbers and values are floats between 0 (no activity) and 1 (max activity)
      // TODO: keys as timestamps?
      renderColors = function ($grid, data, baseColor) {
        var units = $grid.find('.time-unit'),
            unitValueIndexMap = {};

        // Generate a lookup table of unit values to dom element positions in units list
        $.each(units, function (idx, val) {
          var unitVal = $(val).data('value');

          if (typeof unitVal !== 'undefined') {
            unitValueIndexMap[unitVal] = idx;
          }
        });

        $.each(data, function (unitValue, intensity) {
          var element = units[unitValueIndexMap[unitValue]],
              color = getIntensifiedColor(baseColor, intensity);

          console.log(color);
          // Color intensity for the unit
          // TODO: Make color channel configurable (select red, green or blue)
          // OR just use the intensity to dictate the alpha map and allow a base color as an option
          // if (element) element.style.background = 'rgb(0,' + Math.round(255 * intensity) + ',0)';
          if (element) {
            element.style.background = color;
          }
        });
      };

  /////////////////////////
  // Debug helpers
  /////////////////////////

  var generateDebugData = function () {
    var data = {};

    // For every day of the year
    for (var i = 1; i < 365; i++) {
      data[i] = Math.random().toFixed(2);
    }

    return data;
  };

  /////////////////////////
  // Time period helpers
  /////////////////////////

  var
      // Returns a dom representation for the months of a year
      getMonthlyGrid = function () {
        var $day = $(unitTemplate),
            $template = $(gridTemplate),
            $week, absoluteDay;

        for (var week = 1; week <= 52; week++) {
          $week = $('<div class="week"></div>');
          $week
            .addClass(week.toString())
            .data('value', week);

          for (var day = 1; day <= 7; day++) {
            // Day 1 to 364
            absoluteDay = day + (7 * (week - 1));

            $day = $(unitTemplate);
            $day
              .addClass('day' + ' ' + absoluteDay)
              .data('value', absoluteDay);

            $week.append($day);
          }

          $template.append($week);
        }

        return $template;
      };

  /////////////////////////
  // Color helpers
  /////////////////////////

  var
      getIntensifiedColor = function (base, intensity) {
        var isHex = typeof base === 'string' && base.indexOf('#') !== -1,
            isRGB = typeof base === 'object' &&
                    typeof base.r !== 'undefined' &&
                    typeof base.g !== 'undefined' &&
                    typeof base.b !== 'undefined',
            rgb = isRGB ? base : {};

        if (isHex) {
          rgb = hexToRgb(base);

          rgb.r *= intensity;
          rgb.g *= intensity;
          rgb.b *= intensity;
        }

        return 'rgb(' + Math.round(rgb.r) + ',' + Math.round(rgb.g) + ',' + Math.round(rgb.b) + ')';
      },

      // Returns the hex representation of the passed rgb color components
      // Note: Taken from http://stackoverflow.com/a/5624139/700897
      rgbToHex = function (r, g, b) {
        var colorComponentToHex = function (c) {
          var hex = c.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + colorComponentToHex(r) + colorComponentToHex(g) + colorComponentToHex(b);
      },

      // Returns an object of rgb components from the passed hex value
      // Note: Taken from http://stackoverflow.com/a/5624139/700897
      hexToRgb = function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };


})(window.jQuery);