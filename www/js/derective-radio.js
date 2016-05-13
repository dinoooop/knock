app.directive("knRadio", function ($ionicModal) {


    return {
        /* Only use as <kn-radio> tag */
        restrict: 'E',
        templateUrl: 'templates/derective-radio.html',
        scope: {
            items: '=',
            heading: '@',
            key: '='
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

                if (typeof checked != "undefined") {
                    scope.key = checked;
                    scope.value = scope.getValue(scope.key);
                }
                
                scope.modal.hide();

            }
            scope.getValue = function (id) {
                var data = scope.items.getObj('id', id);
                return data.data.title;
            }
            scope.value = scope.getValue(scope.key);
        }

    };

});
