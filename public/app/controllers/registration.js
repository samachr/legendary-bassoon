lb.controller("registration", function($scope, juror){
  if(juror.getID() == '') {
    $location.path("/");
  }
  $scope.submit = function() {
    console.log(user);
    // email: "Slade.Wilson@gmail.com"
    // firstName: "Slade"
    // lastName: "Wilson"
    // password: ""
    // phone: "832-593-2084"
    // receiveCall: false
    // receiveEmail: true
    // receiveText: true
  }
})
