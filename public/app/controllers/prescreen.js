lb.controller("prescreen", function($scope, $http, $location){
  $scope.error = "";

  $http.get("/api/v1/survey").then(function(data, status) {
    console.log(data.data.questionList);
    $scope.questionList = data.data.questionList;
   })

  $scope.submit = function() {
    $scope.error = "";

    var data = {juror_id: 0, responses: $scope.answers}
    // var data = {responses: Object.keys($scope.answers).map(function(questionID){
    //   return {questionID: questionID, ResponseValue: $scope.answers[questionID]}
    // }),

    $http.post("/api/v1/survey", data).success(function(data, status) {
        $location.path("/registration");
     })

  }
})
