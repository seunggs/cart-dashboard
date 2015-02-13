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
      datasetArray: [  
                      { 
                        'Visitors': [
                                      ['19-May-12', 124],
                                      ['18-May-12', 120],
                                      ['17-May-12', 104],
                                      ['16-May-12', 109],
                                      ['15-May-12', 102],
                                      ['14-May-12', 98],
                                      ['13-May-12', 105]
                                    ],
                      },
                      { 
                        'Conversions':  [
                                          ['19-May-12', 65],
                                          ['18-May-12', 62],
                                          ['17-May-12', 55],
                                          ['16-May-12', 58],
                                          ['15-May-12', 56],
                                          ['14-May-12', 50],
                                          ['13-May-12', 52]
                                        ],
                      },
                      {
                        'Errors': [
                                    ['19-May-12', 25],
                                    ['18-May-12', 28],
                                    ['17-May-12', 45],
                                    ['16-May-12', 62],
                                    ['15-May-12', 26],
                                    ['14-May-12', 29],
                                    ['13-May-12', 32]
                                  ]
                      }
                    ]
    };

    return ChartBase;
  }

})();
