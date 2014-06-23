angular.module('ng-ff', []).factory('ffService', function () {
    return window.jsff;
});
//From
// https://github.com/mjt01/angular-feature-flags
angular.module('ng-ff').directive('flags', function (ffService) {
    return {
        restrict: 'A',
        link: function postLink($scope, element, attrs) {
            var placeholder = document.createComment(' js Feature Flag: ' + attrs.flags + ' ');
            var swap = function (oldEl, newEl) {
                var parent = oldEl.parentNode;
                if (parent) {
                    parent.replaceChild(newEl, oldEl);
                }
            };

            $scope.$watch(function () {
                return ffService.flags(attrs.flags);
            }, function (isEnabled) {
                if (isEnabled === false) {
                    swap(element[0], placeholder);
                } else {
                    swap(placeholder, element[0]);
                }
            });
        }
    };
});