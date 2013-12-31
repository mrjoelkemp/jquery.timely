;(function ($) {
  'use strict';

  var
      unitTemplate = '<div class="time-unit"></div>',
      gridTemplate = '<div class="time-grid"></div>',
      // TODO: Month names, days of week
      periodTemplate = '<div class="timely"></div>';

  // Options:
  //    period: 'monthly', 'daily' (TODO)
  $.fn.timely = function (options) {
    options = $.extend({ period: 'monthly' }, options);

    var $this = $(this),
        $template;

    if (options.period.toLowerCase() === 'monthly') {
      $template = $(periodTemplate);

      // Fill out the grid
      $template.append(getMonthlyGrid());

      // Inject the template into the target
      $this.append($template);
    }
  };

  // Returns a dom template for the monthly period
  var getMonthlyGrid = function () {
    var $day = $(unitTemplate),
    //     monthsWith31days = [1, 3, 5, 7, 8, 10, 12],
        $template = $(gridTemplate),
        $week;
    //     month, day, numDays;

    // for (month = 1; month <= 12; month++) {
    //   numDays = monthsWith31days.indexOf(month) !== -1 ? 31 : 30;

    //   for (day = 1; day <= numDays; day++) {

    //   }
    // }

    for (var week = 1; week <= 52; week++) {
      $week = $('<div class="week"></div>');
      $week.addClass(' ' + week);
      $week.data('value', week);

      for (var day = 1; day <= 7; day++) {
        $day = $(unitTemplate);
        $day.addClass('day' + ' ' + day);
        $day.data('value', day);
        $week.append($day);
      }

      $template.append($week);

    }

    return $template;
  };

})(window.jQuery);