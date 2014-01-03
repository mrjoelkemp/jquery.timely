;(function ($) {
  'use strict';

  var
      unitTemplate = '<div class="time-unit"></div>',
      gridTemplate = '<div class="time-grid"></div>',
      // TODO: Month names, days of week
      periodTemplate = '<div class="timely"></div>';

  // Options:
  //    period: 'monthly', 'daily' (TODO)
  //    data: object used to determine color strength
  $.fn.timely = function (options) {
    options = $.extend({ period: 'monthly' }, options);

    var
        $this = $(this),
        // Grab the element before it's in the dom to minimize potential reflow
        $grid = getPeriodGrid(options.period);

    // renderPeriod.call(this, options.period);

    options.data = generateDebugData();

    renderColors($grid, options.data);

    $this.html($grid);
  };

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
      renderColors = function ($grid, data) {
        var units = $grid.find('.time-unit'),
            unitValueIndexMap = {};

        // Generate a lookup table of unit values to dom element positions in units list
        $.each(units, function (idx, val) {
          var unitVal = $(val).data('value');
          console.log('unitval', unitVal);

          if (typeof unitVal !== 'undefined') {
            unitValueIndexMap[unitVal] = idx;
          }
        });

        $.each(data, function (unitValue, intensity) {
          var element = units[unitValueIndexMap[unitValue]];

          // Color intensity for the unit
          // TODO: Make color channel configurable (select red, green or blue)
          // OR just use the intensity to dictate the alpha map and allow a base color as an option
          if (element) element.style.background = 'rgb(0,' + Math.round(255 * intensity) + ',0)';
        });
      };

  // Debug helper
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

})(window.jQuery);