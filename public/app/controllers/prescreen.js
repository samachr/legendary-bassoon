lb.controller("prescreen", function($scope, $http, $location, juror){
  $scope.error = "";
  console.log(juror.getID());

  $http.get("/api/v1/survey/"+juror.getID()).then(function(data, status) {
    $scope.questionList = data.data.questionList;
   })

  $scope.submit = function() {
    $scope.error = "";

    var data = {juror_id: juror.getID(), responses: $scope.answers}
    $http.post("/api/v1/survey", data).then(function(data, status) {
        $location.path("/registration");
     })
  }
})
