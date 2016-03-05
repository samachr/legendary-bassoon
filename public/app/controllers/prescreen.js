lb.controller("prescreen", function($scope, $http, $location){
  $scope.error = "";


  $http.get("/api/v1/survey").then(function(data, status) {
    $scope.questionList = data.data.questionList;
    $scope.juror_id = data.data.juror_id;
   })

  $scope.submit = function() {
    $scope.error = "";

    var data = {juror_id: $scope.juror_id, responses: $scope.answers}
    $http.post("/api/v1/survey", data).then(function(data, status) {
        $location.path("/registration");
     })
  }
})
