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

angular.module('ng-ff').directive('ffDashboard', function (ffService) {
	return {
		restrict: 'E',
		template:'<div style="position: fixed; top:10px; left:10px; width: 300px; box-shadow: 0px 0px 4px black; padding: 20px;">' +
				'<b>Flags</b>' +
				'<p ng-repeat="(key,flag) in allData()">' +
				'<b>{{key}}</b> - ' +
				'<a href="#" ng-click="toggle(key,flag)"  ng-class="{\'label-success\' : flag.active,\'label-danger\' : !flag.active}" class="label">{{flag.active}}</a>' +
				'</p>' +
				'</div>',
		link: function postLink(scope, element, attrs) {
			scope.allData=function(){
				return ffService.getData();
			};
			scope.toggle=function(key,flag){
				var enabled= flag.active;
				enabled ? ffService.disable(key) : ffService.enable(key);
			};
		}
	};
});