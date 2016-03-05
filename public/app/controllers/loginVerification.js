lb.controller("loginVerification", function($scope, $http){
  $scope.error = "";
  $scope.submit = function() {
    $scope.error = "";
    if (!$scope.juror_id) {
      $scope.error += "Please input a jurorid";
    } else if (!$scope.last_name) {
      $scope.error += "Please input a last name";
    } else {
      var data = {juror_id: $scope.juror_id, last_name: $scope.juror_id};
      data = JSON.stringify(data);
      $http.post("/api/v1/login/verification", data).success(function(data, status) {
          console.log(data, status);
       })
    }
  }
})
