(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name home.factory:Chart
   *
   * @description
   *
   */
  angular
    .module('home')
    .factory('Chart', Chart);

  function Chart() {
    var ChartBase = {
      dataset:  [
                  {
                    date: '19-May-12',
                    visitors: 124
                  },
                  {
                    date: '18-May-12',
                    visitors: 120
                  },
                  {
                    date: '17-May-12',
                    visitors: 104
                  },
                  {
                    date: '16-May-12',
                    visitors: 109
                  },
                  {
                    date: '15-May-12',
                    visitors: 102
                  },
                  {
                    date: '14-May-12',
                    visitors: 93
                  },
                  {
                    date: '13-May-12',
                    visitors: 91
                  }
                ],
      dataset2:  [
                  {
                    date: '19-May-12',
                    visitors: 114,
                    conversions: 40,
                    errors: 32
                  },
                  {
                    date: '18-May-12',
                    visitors: 102,
                    conversions: 44,
                    errors: 37
                  },
                  {
                    date: '17-May-12',
                    visitors: 108,
                    conversions: 42,
                    errors: 30
                  },
                  {
                    date: '16-May-12',
                    visitors: 122,
                    conversions: 60,
                    errors: 50
                  },
                  {
                    date: '15-May-12',
                    visitors: 112,
                    conversions: 36,
                    errors: 29
                  },
                  {
                    date: '14-May-12',
                    visitors: 99,
                    conversions: 54,
                    errors: 32
                  },
                  {
                    date: '13-May-12',
                    visitors: 96,
                    conversions: 29,
                    errors: 20
                  }
                ]
    };

    return ChartBase;
  }

})();
