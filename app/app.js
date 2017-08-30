var app = angular.module('plunker', ['ngSanitize']);

app.controller('MainCtrl', ['$scope', '$timeout', '$http', '$interval', function($scope, $timeout, $http, $interval) {
    var init = function() {
        $scope.country = "INDIA";
        $scope.problems = [];
        var currentProblemPath = "";
        $http.get('data.json').success(function(data) {
            $scope.catagories = data.catagories;
        });

        $scope.onsubCatagoryClick = function(subcatagory, catagory) {
            currentProblemPath = 'domains/'+catagory.folder+'/'+subcatagory.link;
            $http.get(currentProblemPath+'/problems.json').success(function(data) {
                $scope.problems = data.models;
            });
        };

        $scope.onProblemClick = function(problem){
            $http.get(currentProblemPath+'/problems/'+ problem.slug+'.json').success(function(data) {
                $scope.problemContent = data;
            });
        };
    };

    init();
}]);
