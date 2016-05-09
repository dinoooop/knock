app.directive("knRadio", function ($ionicModal) {

    return {
        /* Only use as <kn-radio> tag */
        restrict: 'E',
        templateUrl: 'templates/derective-radio.html',
        scope: {
            items: '=',
            heading: '@',
            lock: '='
        },
        link: function (scope, element, attrs) {

            $ionicModal.fromTemplateUrl('templates/derective-radio-items.html', {
                scope: scope
            }).then(function (modal) {
                scope.modal = modal;
            });

            scope.showItems = function () {
                scope.modal.show();
            }

            /* Hide list */
            scope.hideItems = function (checked) {
                scope.lock = checked;
                scope.modal.hide();
            }
        }

    };

});