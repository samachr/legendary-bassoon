lb.controller("loginVerification", function($scope, $http, $location, juror){
  $scope.error = "";

  // console.log(juror.getID());

  $scope.submit = function() {
    $scope.error = "";
    if (!$scope.juror_id) {
      $scope.error += "Please input a jurorid";
    } else if (!$scope.last_name) {
      $scope.error += "Please input a last name";
    } else {
      var data = {juror_id: $scope.juror_id, last_name: $scope.last_name};
      $http.post("/api/v1/login/verification", data).success(function(data, status) {
          // console.log(data);
          juror.setID($scope.juror_id);
          $location.path("/prescreen");
       })
    }
  }
})
