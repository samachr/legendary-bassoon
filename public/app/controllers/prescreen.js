lb.controller("prescreen", function($scope, $http, $location, juror){
  $scope.error = "";
  if(juror.getID() == '') {
    $location.path("/");
  }

  $http.get("/api/v1/survey/"+juror.getID()).then(function(data, status) {
    $scope.questionList = data.data.questionList;
   })

  $scope.submit = function() {
    $scope.error = "";

    var data = {juror_id: juror.getID(), responses: $scope.answers}
    $http.post("/api/v1/survey", data).then(function(data, status) {
      // console.log(data);
      juror.juror_data = data.data.juror_data;
      // console.log(juror.juror_data.registrationStatus)
      if(juror.juror_data.registrationStatus == "ready") {
        $location.path("/registration");
      } else if(juror.juror_data.registrationStatus == "ineligible"){
        $location.path("/finished");
      }
     })
  }
})
