
var app = angular.module('knock', ['ionic']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'templates/main-template.html',
                abstract: true,
            })
            
            .state('app.test', {
                url: '/test',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'pages/test.html',
                        controller: 'testCtrl'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'pages/home.html',
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('app.bank', {
                url: '/home',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'pages/bank.html',
                        controller: 'bankCtrl'
                    }
                }
            })
            .state('app.help', {
                url: '/help',
                cache: false,
                views: {
                    menuContent: {
                        templateUrl: 'pages/help.html',
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('app.transaction', {
                url: '/transaction/{bankTitle}',
                views: {
                    menuContent: {
                        templateUrl: 'pages/transaction.html',
                        controller: 'transactionCtrl',
                        resolve: {
                            bankTitle: function ($stateParams) {
                                return $stateParams.bankTitle;
                            }
                        }
                    }
                }
            });

    //$urlRouterProvider.otherwise('/app/home');
    $urlRouterProvider.otherwise('/app/test');

});


app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});