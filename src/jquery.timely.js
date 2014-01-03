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
          var element = units[unitValueIndexMap[unitValue]];

          // Use the intensity to dictate the alpha map and allow a base color as an option
          if (element) {
            $(element).data('intensity', intensity);

            element.style.background = baseColor;
            // Use the inverse since we want a small intensity to
            element.style.opacity = intensity;
            element.style.filter = 'alpha(opacity=' + (1 - intensity) + ')';
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
      // Get the color representing the distance between the supplied
      // color and white. This color will be used for varying intensity
      // of the base color
      getDiffColor = function (base) {
        var rgb = isRGB(base) ? base : hexToRgb(base);

        rgb.r = 255 - rgb.r;
        rgb.g = 255 - rgb.g;
        rgb.b = 255 - rgb.b;

        return rgb;
      },

      // Precond:
      //    base is only a hex string or rgb object
      getIntensifiedColor = function (base, intensity) {
        var rgb = isRGB(base) ? base : hexToRgb(base);

        rgb.r *= intensity;
        rgb.g *= intensity;
        rgb.b *= intensity;

        return 'rgb(' + Math.round(rgb.r) + ',' + Math.round(rgb.g) + ',' + Math.round(rgb.b) + ')';
      },

      isHex = function (base) {
        return typeof base === 'string' &&
          base.indexOf('#') !== -1 &&
          // Shorthand or long form (including hash)
          (base.length === 4 || base.length === 7);
      },

      isRGB = function (base) {
        return typeof base === 'object' &&
          typeof base.r !== 'undefined' &&
          typeof base.g !== 'undefined' &&
          typeof base.b !== 'undefined';
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