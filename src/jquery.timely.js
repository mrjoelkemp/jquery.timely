;(function ($) {
  'use strict';

  var
      periodTemplate  = '<div class="timely"></div>',
      unitTemplate    = '<div class="time-unit"></div>',
      gridTemplate    = '<div class="time-grid"></div>',
      xAxisTemplate   = '<div class="x-axis"></div>',
      yAxisTemplate   = '<div class="y-axis"></div>',

      monthNames  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayNames    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

      monthNameTemplate = '<div class="month-name"></div>',
      dayNameTemplate   = '<div class="day-name"></div>',
      weekTemplate      = '<div class="week"></div>';

  // Options:
  //    period: 'monthly', 'daily' (TODO)
  //    data:   object used to determine color strength
  //    color:  the color to vary with intensity
  $.fn.timely = function (options) {
    options = $.extend({
      period: 'monthly',
      color:  '#0F0'
    }, options);

    // Grab the element before it's in the dom to minimize potential reflow
    var $grid = getPeriodGrid(options.period);

    renderColors($grid, options.data, options.color);

    $(this).html($grid);
  };

  /////////////////////////
  // Timely Helpers
  /////////////////////////

  var
      // Returns a jQuery element representing the generated dom for
      // the passed period
      getPeriodGrid = function (period) {
        var $template, $xAxis, $yAxis, $grid;

        if (period.toLowerCase() === 'monthly') {
          $template = $(periodTemplate);

          // Generate the x axis
          // 3-letter month names
          $xAxis = $(xAxisTemplate);
          monthNames.forEach(function (name) {
            var $monthName = $(monthNameTemplate).text(name.slice(0, 3));
            $xAxis.append($monthName);
          });

          // Generate the y axis
          // Single letter days of the week
          $yAxis = $(yAxisTemplate);
          dayNames.forEach(function (name, idx) {
            var $dayName = $(dayNameTemplate).text(name[0].toUpperCase());
            // Alternate the days shown
            if (idx % 2 === 0) $dayName.css('visibility', 'hidden');
            $yAxis.append($dayName);
          });

          // Add the month names
          $template.append($xAxis);

          $grid = getMonthlyGrid();
          $grid.prepend($yAxis);

          // Fill out the grid
          $template.append($grid);
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

        // Use the intensity to dictate the alpha map and allow a base color as an option
        $.each(data, function (unitValue, intensity) {
          var element = units[unitValueIndexMap[unitValue]];

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
  // Time period helpers
  /////////////////////////

  var
      // Returns a dom representation for the months of a year
      getMonthlyGrid = function () {
        var $day = $(unitTemplate),
            $template = $(gridTemplate),
            $week, absoluteDay;

        for (var week = 1; week <= 52; week++) {
          $week = $(weekTemplate);
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