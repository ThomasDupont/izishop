/**
 * Created by thomas on 24/06/2017.
 */

angular.module('criticalPath').controller('HomeCtrl', ['$scope',
    function($scope){
        $scope.shopList = [];
        $scope.listShop = listShop;
        $scope.addToList = function() {
            var i = $scope.listShop.findIndex(function(e) {
                return e.element == $scope.itemList.element;
            });
            $scope.shopList.push($scope.listShop[i]);
        };
        $scope.validation = function() {
            var pathFinding = new PathFinding();
            pathFinding.setGrid(grid);
            $scope.grid = pathFinding.calcItenary($scope.shopList, [0,0]).getFinalGrid();
        };
    }
]);
